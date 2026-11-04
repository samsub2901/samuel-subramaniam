# samuel-subramaniam

Personal portfolio site. Plain static files, no framework, no build step, no tracking.

- `public/` holds everything that is served: `index.html`, `styles.css`, `404.html`, the résumé PDF and `assets/` (self-hosted fonts, favicon, screenshots, Open Graph image).
- `public/_headers` sets security headers (strict CSP: no scripts, nothing third-party) and font caching.
- Hosted on Cloudflare's free plan as a static-assets Worker (`wrangler.toml`).

## Update

```
npm install          # once, for wrangler
git commit -am "..." && git push
npm run deploy
```

Screenshots of the Aurora portfolio terminal come from its example build (fictional portfolio), never from the real app.

Fonts: Barlow Semi Condensed, Source Serif 4 and IBM Plex Mono, all under the SIL Open Font License.
