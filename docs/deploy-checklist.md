# Deploy-time checks (spec §7.6)

Run after the first production deploy. Each needs owner access.

- [ ] #7  Rich Results Test on `/` and `/about-us` — Organization and
      BreadcrumbList parse with no errors or warnings.
- [ ] #8  Lighthouse on `/` — record LCP, CLS and INP. No target is asserted
      here; record the numbers so later changes have a baseline.
- [ ] #10 Search Console — verify the property, submit `/sitemap.xml`, and
      confirm it is collecting data. Spec §16 names this as the point of
      the whole first phase.
- [ ] #5  Re-run the apex/`www` redirect check (Step 6) against production.
      As of this writing (2026-09-18) the apex still 301s to `www` — the
      opposite of the direction `SITE.url` assumes. Left as is, every
      canonical points at a URL that immediately redirects, which wastes
      crawl budget and splits signals.
      Where to flip it: production is served by **Netlify behind
      Cloudflare** today (responses carry `x-nf-request-id` and
      `Server: cloudflare`), not Vercel as spec D1 plans, and Netlify's
      public site record lists `www.selfstoragehosting.com` as the primary
      custom domain — which is what produces this 301. Make the apex the
      primary domain in Netlify's domain management. If hosting moves to
      Vercel per D1, it is the Vercel project's domain settings instead.
      Dashboard change, owner access, not code.
- [ ] Hosting (optional tidy-up): the Netlify dashboard still lists the
      Vite-era publish directory `dist`. It no longer matters —
      `self-storage-hosting/netlify.toml` sets `publish = ".next"` and
      file-based settings override the dashboard — but clearing it avoids
      confusion. The branch also deletes `public/_redirects`, whose
      `/* /index.html 200` SPA fallback would have routed every URL to a
      file Next.js never emits.
