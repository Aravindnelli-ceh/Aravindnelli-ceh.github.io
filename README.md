# ReviewPilot

AI-drafted replies to customer reviews (Google, Yelp, Facebook), plus a sentiment dashboard for local businesses running one or more locations.

This repo contains a **marketing landing page** (`index.html`) and a **working front-end dashboard demo** (`app.html`). Both are static, self-contained HTML files — no build step required.

> **Honest note:** this is a solid, realistic SaaS niche with a real market (millions of local businesses), not a guaranteed "billion dollar" outcome. Treat it as a validated starting point, not a promise.

---

## 1. Deploy to GitHub Pages

1. Create a new repo (e.g. `reviewpilot`) or use an existing one — call it whatever you want, `globalassc` or anything else.
2. Add these files to the repo root:
   - `index.html`
   - `app.html`
   - `CNAME` (only if using a custom domain — see below)
3. Commit and push:
   ```bash
   git init
   git add index.html app.html CNAME
   git commit -m "Initial ReviewPilot site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
4. In the GitHub repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `root`**.
5. GitHub gives you a URL like `https://<your-username>.github.io/<your-repo>/`. It can take a minute or two to go live.

## 2. Attach your own domain

1. Edit the `CNAME` file in this repo and replace the placeholder with your real domain, e.g.:
   ```
   www.yourdomain.com
   ```
2. At your domain registrar (wherever you bought the domain), add DNS records pointing to GitHub Pages:
   - For a subdomain like `www`: a **CNAME** record pointing to `<your-username>.github.io`
   - For an apex domain (`yourdomain.com` with no `www`): four **A** records pointing to GitHub's IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
3. Back in **Settings → Pages**, enter your custom domain and enable **Enforce HTTPS** once it's available (can take up to 24 hours for the certificate).

## 3. Making the demo real

Both files are currently front-end only, so nothing here costs money to run as-is. To turn it into a real product:

- **AI replies**: `app.html` has a placeholder `draftReply()` function. Replace it with a call to your own backend (never call the Anthropic API directly from the browser with a real key), which in turn calls `https://api.anthropic.com/v1/messages` with the review text and your business's tone settings.
- **Waitlist signups**: `index.html` currently saves emails to `localStorage` in the visitor's own browser only — you won't see these. Swap the form handler for a real endpoint (e.g. [Formspree](https://formspree.io), a Supabase table, or your own API route) before you rely on it for real signups.
- **Review data**: Both Google Business Profile and Yelp have official APIs for pulling reviews; Facebook Page reviews require the Graph API. You'll need a small backend to poll these on a schedule and store results in a database.
- **Auth & multi-location accounts**: not included here — you'll want something like Supabase Auth, Clerk, or Auth0 once you have real customers logging in.

## File structure

```
.
├── index.html   # Marketing / landing page with waitlist form
├── app.html     # Dashboard demo: review inbox + AI draft replies
├── CNAME        # Your custom domain (edit before using)
└── README.md    # This file
```
