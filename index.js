require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const Razorpay = require('razorpay');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const AMOUNT_PAISE = 1000; // ₹10.00 — Razorpay amounts are in the smallest currency unit (paise)

// Owner's WhatsApp number (with country code, no +/spaces) — where entries get pinged.
const OWNER_WHATSAPP_NUMBER = process.env.OWNER_WHATSAPP_NUMBER || '916309579202';

// ---------- Simple file-backed store for the entry count + contest entries ----------
// Good enough for a seasonal campaign. Swap for a real database if this needs to scale
// or survive a host that wipes disk on redeploy (e.g. some free tiers).
const DATA_DIR = path.join(__dirname, 'data');
const STATS_FILE = path.join(DATA_DIR, 'stats.json');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(STATS_FILE)) fs.writeFileSync(STATS_FILE, JSON.stringify({ totalEntries: 0, entries: [] }, null, 2));

function readStats() {
  return JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));
}
function writeStats(data) {
  fs.writeFileSync(STATS_FILE, JSON.stringify(data, null, 2));
}

if(!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET){
  console.warn('⚠️  RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set. Copy .env.example to .env and fill in your Razorpay test keys.');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Public key only — safe to expose to the frontend.
app.get('/api/config', (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID || '' });
});

// Creates a real order on Razorpay's servers for a fixed ₹10. Amount is decided
// here, server-side, so the frontend can never manipulate what gets charged.
app.post('/api/create-order', async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: AMOUNT_PAISE,
      currency: 'INR',
      receipt: 'rakhi_' + Date.now(),
    });
    res.json(order);
  } catch (err) {
    console.error('create-order error:', err);
    res.status(500).json({ error: 'Could not create order' });
  }
});

// Verifies the signature Razorpay's checkout returns after a successful payment.
// This is the step that makes the payment "real" — a request can't fake a valid
// signature without knowing RAZORPAY_KEY_SECRET, which never leaves this server.
app.post('/api/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ valid: false, error: 'Missing fields' });
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const valid = expectedSignature === razorpay_signature;

  // In a production app, persist { orderId, paymentId, valid, timestamp } to a
  // database here, so a payment can only ever unlock one card, not be replayed.
  if (valid) {
    console.log('✅ Verified payment:', razorpay_payment_id);
  } else {
    console.warn('❌ Signature mismatch for order:', razorpay_order_id);
  }

  res.json({ valid });
});

// Real, honest count of completed entries — not a hardcoded marketing number.
// Starts at 0 and only grows when someone actually finishes the flow.
app.get('/api/stats', (req, res) => {
  const stats = readStats();
  res.json({ totalEntries: stats.totalEntries });
});

// Called once a card is generated after a verified payment. Logs the entry,
// bumps the counter, and gives the frontend a pre-filled wa.me link to your
// WhatsApp so the details land in your chat with one tap.
app.post('/api/entry', async (req, res) => {
  const { sender, sibling, relation, phone, contestOptIn, story, paymentId } = req.body;

  if (!sender || !sibling) {
    return res.status(400).json({ error: 'Missing sender/sibling name' });
  }

  const stats = readStats();
  const entry = {
    sender, sibling, relation, phone: phone || null,
    contestOptIn: !!contestOptIn, story: story || null,
    paymentId: paymentId || null,
    at: new Date().toISOString(),
  };
  stats.entries.push(entry);
  stats.totalEntries += 1;
  writeStats(stats);

  const lines = [
    '🧵 New Rakhi Memory entry',
    `From: ${sender}`,
    `To: ${sibling} (${relation})`,
    phone ? `Phone: ${phone}` : null,
    contestOptIn ? `🎁 Entered Brother/Sister of the Year contest` : null,
    story ? `Story: ${story}` : null,
  ].filter(Boolean).join('\n');

  const waLink = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;

  // Optional: silently auto-send to your WhatsApp via the official Cloud API,
  // if you've set these up (see README). Without them, the frontend falls
  // back to opening `waLink` for the customer to send with one tap — WhatsApp
  // doesn't allow businesses to silently message numbers without either the
  // customer initiating contact or an approved message template, so one of
  // these two paths is required either way.
  if (process.env.WHATSAPP_CLOUD_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
    try {
      await fetch(`https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_CLOUD_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: OWNER_WHATSAPP_NUMBER,
          type: 'text',
          text: { body: lines },
        }),
      });
    } catch (err) {
      console.error('WhatsApp Cloud API send failed (falling back to waLink):', err.message);
    }
  }

  res.json({ totalEntries: stats.totalEntries, waLink });
});

// Serve the static site
app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(PORT, () => {
  console.log(`Rakhi Memory server running on http://localhost:${PORT}`);
});
