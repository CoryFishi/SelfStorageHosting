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
      `Server: cloudflare`), not Vercel as spec D1 plans. Make the apex the
      primary domain in Netlify's domain management, and check Cloudflare
      for a redirect rule doing the same thing — either one can produce this
      301. If hosting moves to Vercel per D1, it is the Vercel project's
      domain settings instead. Dashboard change, owner access, not code.
- [ ] Hosting: confirm the host's build settings suit Next.js before the
      first production deploy from this branch. The site was a Vite SPA, so
      existing settings may publish `dist`, which `next build` does not
      produce. The branch also deletes `public/_redirects` (its
      `/* /index.html 200` SPA fallback would have routed every URL to a
      file Next.js never emits). A deploy preview that serves `/about-us`
      and `/sitemap.xml` correctly is the check.
