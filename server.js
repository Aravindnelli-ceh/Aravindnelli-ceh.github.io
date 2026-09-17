require('dotenv').config();

const express = require('express');
const cors = require('cors');

const waitlistRouter = require('./routes/waitlist');
const reviewsRouter = require('./routes/reviews');
const draftReplyRouter = require('./routes/draftReply');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow server-to-server / curl requests with no origin header.
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS: ' + origin));
  },
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    aiConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
    time: new Date().toISOString(),
  });
});

app.use('/api/waitlist', waitlistRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/draft-reply', draftReplyRouter);

// Basic error handler (e.g. CORS rejections) so failures return JSON, not HTML.
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`ReviewPilot API listening on http://localhost:${PORT}`);
  console.log(`AI drafting: ${process.env.ANTHROPIC_API_KEY ? 'live (Anthropic API)' : 'template fallback (no ANTHROPIC_API_KEY set)'}`);
});
