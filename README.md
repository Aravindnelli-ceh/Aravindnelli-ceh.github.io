# ReviewPilot

AI-drafted replies to customer reviews (Google, Yelp, Facebook), plus a sentiment dashboard for local businesses running one or more locations.

This repo has two parts:
- **Front-end** (`index.html`, `app.html`) — static pages, deploy to GitHub Pages
- **Backend** (`/backend`) — a small Express API that stores waitlist signups, serves review data, and drafts replies with the real Anthropic API

> **Honest note:** this is a solid, realistic SaaS niche with a real market (millions of local businesses), not a guaranteed "billion dollar" outcome. Treat it as a validated starting point, not a promise.

---

## 1. Run the backend locally

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- Leave `ANTHROPIC_API_KEY` blank to use the built-in template fallback (free, works immediately).
- Set it to a real key from [console.anthropic.com](https://console.anthropic.com) to get live AI-drafted replies.
- Set `ALLOWED_ORIGINS` to wherever you're serving the front-end from, e.g. `http://localhost:5500`.

```bash
npm start
```

The API runs on `http://localhost:3001` by default. Check it's alive:

```bash
curl http://localhost:3001/health
```

## 2. Run the front-end locally

The front-end calls the backend at `http://localhost:3001` by default. Serve the HTML files with any static server (not `file://`, since `fetch()` calls need a real origin):

```bash
# from the repo root, in a separate terminal
python3 -m http.server 5500
```

Open `http://localhost:5500/app.html` — it will show "✓ Connected to backend" if the API is reachable, or fall back to sample data with a warning if not.

## 3. Deploy the backend

The backend is a normal Node/Express app — deploy it anywhere that runs Node, for example:

**Render** (simplest, free tier available)
1. Push this repo to GitHub.
2. In Render: New → Web Service → connect your repo → set **Root Directory** to `backend`.
3. Build command: `npm install`. Start command: `npm start`.
4. Add environment variables from `.env.example` (`ANTHROPIC_API_KEY`, `ALLOWED_ORIGINS`, `ADMIN_TOKEN`) in Render's dashboard.
5. Render gives you a URL like `https://reviewpilot-api.onrender.com` — that's your `API_BASE_URL`.

**Railway / Fly.io** work the same way: point them at the `backend` folder, set the same environment variables, deploy.

⚠️ Whichever host you use, set `ALLOWED_ORIGINS` to your real front-end domain (e.g. `https://yourdomain.com`) once deployed — don't leave it wide open in production.

## 4. Deploy the front-end to GitHub Pages

1. Add `index.html`, `app.html`, and `CNAME` to your repo root (the `backend/` folder can stay in the same repo — GitHub Pages only serves the static files).
2. Before pushing, point the front-end at your deployed backend by adding one line before the closing `</body>` in **both** `index.html` and `app.html`:
   ```html
   <script>window.REVIEWPILOT_API_BASE_URL = 'https://your-backend-url.onrender.com';</script>
   ```
   (Add it just *before* the existing `<script>` block that does the fetching, so the variable exists when that script runs.)
3. Commit and push:
   ```bash
   git init
   git add .
   git commit -m "Initial ReviewPilot site + backend"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
4. In the GitHub repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `root`**.
5. GitHub gives you a URL like `https://<your-username>.github.io/<your-repo>/`.

## 5. Attach your own domain

1. Edit the `CNAME` file with your real domain, e.g. `www.yourdomain.com`.
2. At your registrar, add DNS records pointing to GitHub Pages:
   - Subdomain (`www`): a **CNAME** record → `<your-username>.github.io`
   - Apex domain (`yourdomain.com`): four **A** records →
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
3. In **Settings → Pages**, enter your custom domain and enable **Enforce HTTPS** once available (can take up to 24 hours).

## What's real vs. still a stub

| Piece | Status |
|---|---|
| Waitlist signups | Real — stored in `backend/data/waitlist.json`. Swap for a real database before serious traffic. |
| AI-drafted replies | Real Anthropic API call if `ANTHROPIC_API_KEY` is set; template fallback otherwise. |
| Review data | Seed data in `backend/data/reviews.json`. Not yet connected to Google/Yelp/Facebook — see below. |
| Posting replies to platforms | Recorded locally only. Actually posting requires each platform's API (see below). |
| Auth / multi-tenant accounts | Not built. Needed before you have real customers logging in. |

## Connecting real review sources (next step, not included)

- **Google Business Profile API** — `reviews.list` to read, and it supports posting replies too.
- **Yelp Fusion API** — can read reviews; Yelp has no public API for posting replies (those still get approved manually on Yelp's site).
- **Facebook Graph API** — `/{page-id}/ratings` to read Page reviews, and it supports posting replies.

You'd add a scheduled job (e.g. a cron job or a queue) that polls these APIs, normalizes results into the same shape as `backend/data/reviews.json`, and stores them in a real database instead of a JSON file.

## File structure

```
.
├── index.html              # Marketing / landing page with waitlist form
├── app.html                # Dashboard: review inbox + AI draft replies
├── CNAME                   # Your custom domain (edit before using)
├── README.md                # This file
└── backend/
    ├── server.js            # Express app entrypoint
    ├── package.json
    ├── .env.example         # Copy to .env and fill in
    ├── routes/
    │   ├── waitlist.js       # POST/GET /api/waitlist
    │   ├── reviews.js        # GET /api/reviews, POST /api/reviews/:id/reply
    │   └── draftReply.js     # POST /api/draft-reply (calls Anthropic API)
    └── data/
        ├── reviews.json      # Seed review data (swap for a real DB later)
        └── waitlist.json     # Waitlist signups (swap for a real DB later)
```
