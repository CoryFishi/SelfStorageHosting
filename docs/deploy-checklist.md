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

## Plan 2: after the remaining pages deploy

Each needs owner access.

- [ ] **Legal review, before PR #1 merges.** `git grep -n "DRAFT FOR OWNER" -- self-storage-hosting/app`
      lists every legal page still waiting. The comment at the top of each
      page lists what the owner or counsel has to decide, such as the legal
      entity that runs the site and how long data is kept.
      Remove a comment only after those decisions are made and written in.
- [ ] **Turn accounts on.** `/user/login` and `/user/register` read
      `NEXT_PUBLIC_API_BASE` at build time. Until it is set, both pages say
      "Signing in is not available right now." and send nothing.
      1. Deploy `backend/` over HTTPS with `MONGODB_URI`, `JWT_SECRET`,
         `NODE_ENV=production`, and `CORS_ORIGINS` set to the site's origins,
         comma-separated: `https://selfstoragehosting.com,https://www.selfstoragehosting.com`
         while #5 is open. In production the sign-in cookie is sent with
         `Secure` and `SameSite=None`.
      2. Serve the backend from a subdomain of the site's own domain, such as
         `api.selfstoragehosting.com`. A cookie from a different domain is a
         third-party cookie, which some browsers block by default. Safari is
         one of them. On such a browser, signing in would appear to work and
         then forget the visitor.
      3. In Netlify, set `NEXT_PUBLIC_API_BASE` to the backend's origin, then
         trigger a new deploy. Setting the variable without a new build
         changes nothing.
      4. Create a test account on `/user/register`, log out, log back in on
         `/user/login`, then delete the test account from the database.
- [ ] **Cookies.** `curl -sI https://www.selfstoragehosting.com/ | grep -i set-cookie`.
      The site's own code sets no cookie on its pages. The sign-in cookie
      comes only from the backend. If this prints a cookie, find out who
      sets it. Cloudflare's bot protection, for one, can add `__cf_bm`.
      Then disclose it in the privacy policy's "Cookies" section before
      PR #1 merges.
- [ ] **/events refreshes itself.** The page is regenerated at most once a
      day (`revalidate = 86400`), so a finished event drops off without a
      deploy. On the day after the first listed event ends, load `/events`
      and confirm that event is gone. If it is still listed, Netlify is
      serving the page as a fixed file. Until that is fixed, run a daily
      deploy from a Netlify build hook.
- [ ] **Quarterly events review (spec §14 E1).** First due 2026-12-18. Open
      every `source` in `self-storage-hosting/lib/events.ts`. Update
      `verifiedOn`, correct or remove anything that changed, and add newly
      announced events only from the organizer's own page. The rendered
      check (`RENDERED=1`) fails when no upcoming event is left. That
      failure means the review is overdue, not that the code is broken.
- [ ] **Extend #7 and #10.** Run the Rich Results Test on `/events` (Event)
      and `/solutions/access-control-hosting` (BreadcrumbList). In Search
      Console, request indexing for the new indexable pages. `/sitemap.xml`
      already lists them.
- [ ] **Run the tests before every deploy.** No CI runs them today: `netlify.toml` runs only `npm run build`. Run `npm test` in `self-storage-hosting/` and in `backend/` before each deploy, or add both to a CI job.
