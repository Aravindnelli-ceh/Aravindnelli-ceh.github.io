const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '..', 'data', 'reviews.json');

function readReviews() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function writeReviews(list) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
}

// GET /api/reviews
// Today this returns seed data from a local JSON file. To make this real,
// replace the body of this handler with calls to:
//   - Google Business Profile API (reviews.list)
//   - Yelp Fusion API (businesses/{id}/reviews)
//   - Facebook Graph API (/{page-id}/ratings)
// ...merged into one array with the same shape, then cached in a real database.
router.get('/', (req, res) => {
  const { location, unrepliedOnly } = req.query;
  let reviews = readReviews();

  if (location) {
    reviews = reviews.filter(r => r.location.toLowerCase() === String(location).toLowerCase());
  }
  if (unrepliedOnly === 'true') {
    reviews = reviews.filter(r => !r.replied);
  }

  res.json({ reviews });
});

// POST /api/reviews/:id/reply  { text }
// Marks a review as replied in local storage. Swap the body of this handler
// for the relevant platform's "post reply" API call (Google Business Profile
// and Facebook both support posting a reply; Yelp does not have a public
// reply-posting API, so those still get approved manually on Yelp's site).
router.post('/:id/reply', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const text = (req.body && req.body.text || '').trim();

  if (!text) {
    return res.status(400).json({ error: 'Reply text is required.' });
  }

  const reviews = readReviews();
  const review = reviews.find(r => r.id === id);

  if (!review) {
    return res.status(404).json({ error: 'Review not found.' });
  }

  review.replied = true;
  review.replyText = text;
  review.repliedAt = new Date().toISOString();
  writeReviews(reviews);

  res.json({ message: 'Reply recorded.', review });
});

module.exports = router;
