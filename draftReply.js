const express = require('express');
const router = express.Router();

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';

/**
 * Fallback used when ANTHROPIC_API_KEY isn't set, so the app still works
 * end-to-end during local development without requiring a paid key.
 */
function templateFallback(review, tone) {
  if (review.stars >= 4) {
    return `Thank you so much for the kind words${review.author ? ', ' + review.author : ''} — this made our day! We hope to see you again soon.`;
  }
  const empathyOpeners = [
    "I'm sorry to hear this",
    "Thank you for flagging this, and I apologize",
  ];
  const opener = empathyOpeners[review.stars <= 2 ? 0 : 1];
  const topicLine = review.topic === 'billing'
    ? "a billing error like this shouldn't take multiple tries to resolve, and that's on us."
    : review.topic === 'wait times'
    ? "a wait that long isn't the experience we want for our guests."
    : "we hear you, and it's genuinely useful feedback.";
  const closer = " I'd like to make this right — please reach out to us directly so we can follow up personally.";
  return `${opener} — ${topicLine}${closer}`;
}

function buildPrompt({ reviewText, stars, author, businessName, tone, topic }) {
  return `You are drafting a public reply to a customer review on behalf of "${businessName || 'the business'}".

Review details:
- Star rating: ${stars} out of 5
- Reviewer name: ${author || 'unknown'}
- Topic: ${topic || 'general'}
- Review text: "${reviewText}"

Instructions:
- Write in a ${tone || 'warm, professional'} tone.
- Keep it to 2-4 sentences.
- If the rating is 4 or 5 stars, thank them specifically for something they mentioned.
- If the rating is 3 stars or below, acknowledge the specific issue without being defensive, avoid generic corporate language, and invite them to reach out directly to resolve it.
- Never invent specific facts (discounts, refund amounts, employee names) that weren't in the review.
- Output ONLY the reply text, with no preamble, quotation marks, or labels.`;
}

// POST /api/draft-reply
// Body: { reviewText, stars, author, businessName, tone, topic }
router.post('/', async (req, res) => {
  const { reviewText, stars, author, businessName, tone, topic } = req.body || {};

  if (!reviewText || typeof stars !== 'number') {
    return res.status(400).json({ error: 'reviewText (string) and stars (number) are required.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    const text = templateFallback({ stars, author, topic }, tone);
    return res.json({ reply: text, source: 'template-fallback' });
  }

  try {
    const response = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 300,
        messages: [
          { role: 'user', content: buildPrompt({ reviewText, stars, author, businessName, tone, topic }) },
        ],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Anthropic API error:', response.status, errBody);
      const text = templateFallback({ stars, author, topic }, tone);
      return res.json({ reply: text, source: 'template-fallback', warning: 'AI call failed, used fallback.' });
    }

    const data = await response.json();
    const textBlock = (data.content || []).find(block => block.type === 'text');
    const reply = textBlock ? textBlock.text.trim() : templateFallback({ stars, author, topic }, tone);

    res.json({ reply, source: 'anthropic' });
  } catch (err) {
    console.error('Draft reply error:', err);
    const text = templateFallback({ stars, author, topic }, tone);
    res.json({ reply: text, source: 'template-fallback', warning: 'AI call errored, used fallback.' });
  }
});

module.exports = router;

