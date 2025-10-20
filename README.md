# Myles Photography LLC — Static Site

This is a simple, fast static site for **Myles Photography LLC** with a top header & logo, and pages for **Sample Images**, **About Us**, and **Locations**.

## Structure
```
.
├─ index.html
├─ samples.html
├─ about.html
├─ locations.html
├─ styles.css
├─ script.js
├─ assets/
│  └─ logo.svg  (6-blade shutter, thin ring, Times 'M', vector/transparent)
└─ CNAME        (for GitHub Pages custom domain)
```

## Deploy (GitHub Pages)
1. Create a new GitHub repo and upload all files.
2. In **Settings → Pages**, set Source to **Deploy from a branch** (e.g., `main` / root).
3. DNS:
   - **CNAME**: `www` → `YOUR_GITHUB_USERNAME.github.io`
   - **A** records (apex `@`): `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
4. Keep the included `CNAME` file as `www.mylesphotographyllc.com`.
5. Enable HTTPS when available.

## Notes
- Replace the sample photos with your own in `index.html` and `samples.html`.
- The logo is **SVG** (transparent by default). If you also want a white-backed PNG, export from the SVG or ask me to add one here.
