const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '..', 'data', 'waitlist.json');

function readWaitlist() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (err) {
    return [];
  }
}

function writeWaitlist(list) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/waitlist  { email }
router.post('/', (req, res) => {
  const email = (req.body && req.body.email || '').trim().toLowerCase();

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  const list = readWaitlist();

  if (list.some(entry => entry.email === email)) {
    return res.status(200).json({ message: 'Already on the waitlist.', duplicate: true });
  }

  list.push({ email, joinedAt: new Date().toISOString() });
  writeWaitlist(list);

  res.status(201).json({ message: 'Added to waitlist.', count: list.length });
});

// GET /api/waitlist  -> for your own admin use, not for public consumption.
// Protect this route (e.g. an admin token check) before deploying publicly.
router.get('/', (req, res) => {
  const adminToken = req.header('x-admin-token');
  if (!process.env.ADMIN_TOKEN || adminToken !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Missing or invalid admin token.' });
  }
  const list = readWaitlist();
  res.json({ count: list.length, signups: list });
});

module.exports = router;
