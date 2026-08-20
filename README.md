# Create Your Rakhi Memory 🧵

A 4-page site plus a small backend:

- **`public/index.html`** — landing page
- **`public/gallery.html`** — sample card designs
- **`public/about.html`** — about / FAQ
- **`public/app.html`** — the actual wizard (names → photo → design → pay → share)
- **`server/`** — Node/Express backend that creates a real Razorpay order and **verifies the payment signature server-side**, so the ₹10 charge can be trusted (not just an honor-system click)

```
rakhi-site/
├── public/
│   ├── index.html
│   ├── gallery.html
│   ├── about.html
│   ├── app.html
│   ├── css/style.css
│   └── js/
│       ├── cardRenderer.js   ← draws the card on <canvas>
│       └── wizard.js         ← step logic + payment flow
├── server/
│   ├── index.js
│   ├── package.json
│   └── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

## Why a backend at all?

A plain UPI deep link (`upi://pay?...`) can't be verified — anyone could just skip paying and click "continue." This backend fixes that:

1. Frontend asks the server to create an order (`POST /api/create-order`) — **amount is decided server-side**, so it can never be tampered with from the browser.
2. Razorpay's checkout opens (supports UPI/PhonePe/GPay/Paytm, cards, net banking).
3. On success, the frontend sends Razorpay's response to `POST /api/verify-payment`.
4. The server recomputes the cryptographic signature using your **secret key** (which never reaches the browser) and only returns `valid: true` if it genuinely matches.
5. Only then does the app unlock the card step.

## 1. Get Razorpay keys (free, takes ~2 minutes)

1. Sign up at [dashboard.razorpay.com](https://dashboard.razorpay.com/signup).
2. Go to **Settings → API Keys → Generate Test Key**. Test mode = no real money moves, perfect for development.
3. Copy the **Key ID** and **Key Secret**.
4. To actually receive money later: **Settings → Account & Settings** to complete KYC, then switch to **Live keys** and link your bank account/UPI ID for settlement — Razorpay pays that account automatically, no need to hardcode any UPI ID in the code.

## 2. Run it locally

```bash
cd server
cp .env.example .env
# paste your Razorpay test Key ID and Key Secret into .env

npm install
npm start
```

Visit **http://localhost:3000** — the Express server serves the whole `public/` folder *and* the API, so everything runs from one process/port.

## 3. Deploy

This needs a real server process (not just static hosting), since it verifies payments. Easiest free options: **Render**, **Railway**, or **Fly.io**.

### Deploy to Render (example)

1. Push this repo to GitHub.
2. On [render.com](https://render.com): **New → Web Service** → connect your repo.
3. Settings:
   - **Root directory:** `server`
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Add environment variables (from your `.env`): `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`.
5. Deploy — Render gives you a live URL like `https://rakhi-memory.onrender.com`.

Going live with real charges: switch `RAZORPAY_KEY_ID`/`SECRET` in your host's environment variables to your **live** keys once KYC is approved.

## WhatsApp notifications

Every finished entry is logged to `server/data/stats.json` and reaches your WhatsApp (default `916309579202`, change via `OWNER_WHATSAPP_NUMBER` in `.env`) one of two ways:

- **Default, zero setup:** the customer's browser opens a pre-filled `wa.me` link with their name, sibling's name, phone, and contest note — they just tap send. This is what ships out of the box.
- **Optional, fully silent:** set `WHATSAPP_CLOUD_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` in `.env` (from Meta's [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)) and the server pushes the message to your WhatsApp automatically, no tap needed. This needs a Meta Business/WhatsApp Business account — there's no way to silently auto-message a personal WhatsApp number without either this official API or the customer's own tap, by WhatsApp's own anti-spam rules.

## The "Brother/Sister of the Year" contest

The site collects entries (opt-in checkbox + short story) and counts them honestly — the "X people have already tied their thread" banner only grows as real entries come in, it isn't a fake number. Picking a winner, sourcing the surprise gift, and actually getting it delivered same-day are real-world logistics this code doesn't automate — that part is on you (or a courier partner) to run manually using the entries in `server/data/stats.json`.

## Notes

- **Photo privacy:** photos never leave the browser except inside the image the user downloads/shares — the card is drawn entirely client-side on `<canvas>`.
- **One payment → one card:** for a production version, persist verified payments (order ID, payment ID, timestamp) to a database and check it hasn't already been used, so a single successful payment can't be reused across multiple browser sessions. The current `server/index.js` has a comment marking exactly where that would go.
- **File upload:** standard `<input type="file">` + `FileReader` — works in any normal browser. If it seems unresponsive inside an embedded preview/iframe, that's a preview sandboxing limitation, not a bug — it works once hosted normally.

## License

MIT — see `LICENSE`.
