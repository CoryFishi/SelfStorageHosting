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
      opposite of the direction `SITE.url` assumes. Flip the redirect in the
      Vercel project's domain settings so the apex is primary; this is a
      dashboard change requiring the owner's account access, not a code
      change. Left as is, every canonical points at a URL that immediately
      redirects, which wastes crawl budget and splits signals.
