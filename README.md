# Nelli Aravind — 3D Career Portfolio

A single-page, cinematic 3D portfolio (Three.js + GSAP) built from your verified certificates.

## Run it locally
Just open `index.html` in a browser — or, for best results with images loading, serve it:
```
npx serve .
```
Then visit the printed localhost URL.

## Where to update things

| What | Where |
|---|---|
| Email / WhatsApp / LinkedIn / GitHub | `CONTACT` object near the top of the `<script>` block in `index.html` |
| Real CV | Replace `assets/cv.pdf` with your actual CV (same filename) |
| Profile photo | Replace `assets/profile.jpg` |
| Certificates | Replace files in `assets/certificates/` (keep filenames) or edit the `CERTIFICATES` array in `index.html` to add more |

Already wired up for you:
- **Email:** Naiduaravind169@gmail.com
- **WhatsApp / Call:** +91 63095 79202 (floating WhatsApp button + Contact section + Recruiter Mode)
- **LinkedIn / GitHub:** placeholders only — add your URLs in the `CONTACT` config, since none were supplied.

## Sections included
Hero (3D floating gallery) · 3D Certificate Carousel (drag / swipe / arrow keys / click to open) · Career Timeline · Skills · Projects · About · Resume · Recruiter Mode (simplified scannable view) · Contact.

## Deploy
This is a static site — drag-and-drop friendly on:
- **Netlify / Vercel:** drop the folder in, or connect a GitHub repo and deploy.
- **GitHub Pages:** push this folder to a repo and enable Pages on the `main` branch root.
- **Cloudflare Pages:** connect the repo, build command: none, output directory: `/`.

No build step is required — it's plain HTML/CSS/JS with Three.js and GSAP loaded from CDN.

## Notes on content accuracy
All certificate details (names, dates, certificate numbers, issuers) are taken directly from your uploaded certificate images. No companies, job titles, or credentials were invented. The "Featured Projects" section is clearly labeled as conceptual/personal work, not production systems for named employers.
