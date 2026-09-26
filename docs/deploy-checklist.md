# Deploy-time checks (spec §7.6)

Run after the first production deploy. Each needs owner access.

- [ ] #7  Rich Results Test on `/` and `/about-us` — Organization and
      BreadcrumbList parse with no errors or warnings.
- [ ] #8  Lighthouse on `/` — record LCP, CLS and INP. No target is asserted
      here; record the numbers so later changes have a baseline.
- [ ] #10 Search Console — verify the property, submit `/sitemap.xml`, and
      confirm it is collecting data. Spec §16 names this as the point of
      the whole first phase.
- [x] #5  Apex/`www` — **settled in code on 2026-09-20 (78f0999), the other
      way round.** Rather than flip the edge, `SITE.url` moved to
      `https://www.selfstoragehosting.com`, so canonicals, the sitemap,
      `metadataBase`, `og:url` and the JSON-LD `@id` now name the host that
      actually serves. Nothing is left to do in the dashboard.
      **Do not make the apex the primary domain in Netlify.** Production is
      Netlify behind Cloudflare (responses carry `x-nf-request-id` and
      `Server: cloudflare`), Netlify lists `www.selfstoragehosting.com` as
      the primary custom domain, and that is what produces the apex→`www`
      301 the canonicals now agree with. Flipping it would point every
      canonical at a redirecting URL again — the exact defect this fixed.
      The redirect direction and `SITE.url` must always change together; if
      hosting ever moves (spec D1 plans Vercel), carry the same pairing over.
      Verify only: `curl -sI https://selfstoragehosting.com/` should 301 to
      the `www` host, and `curl -sI https://www.selfstoragehosting.com/`
      should answer 200.
- [ ] Hosting (optional tidy-up): the Netlify dashboard still lists the
      Vite-era publish directory `dist`. It no longer matters —
      `self-storage-hosting/netlify.toml` sets `publish = ".next"` and
      file-based settings override the dashboard — but clearing it avoids
      confusion. The branch also deletes `public/_redirects`, whose
      `/* /index.html 200` SPA fallback would have routed every URL to a
      file Next.js never emits.

## Environment variables

What each name does, where it is set, and what breaks when it is absent.
`git grep -n "process\.env\." -- self-storage-hosting backend` is the
authority; this table is the reading of it as of 2026-09-21.

Netlify (site `self-storage-hosting/`):

| Name | Needed? | Read | Absent means |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | optional | build | `lib/site.ts` falls back to `https://www.selfstoragehosting.com`, which is correct today. Set it only to override, and never to the apex — see #5. |
| `CONTACT_TO_EMAIL` | **yes** | request | `/api/contact` answers **503** to every visitor and logs "Contact form not configured". The form looks live and delivers nothing. |
| `RESEND_API_KEY` | **yes** | request | same 503 — the route requires both. |
| `NEXT_PUBLIC_API_BASE` | not yet | **build** | `/user/login` and `/user/register` say "Signing in is not available right now." — deliberate until the backend exists. Inlined at build, so setting it needs a fresh deploy, not just a save. |

Netlify reads its environment at deploy time, so **after changing any of
these, trigger a new deploy.** Saving the variable alone changes nothing.

Backend (`backend/`, not deployed anywhere yet — see "Turn accounts on"):

| Name | Needed? | Absent means |
| --- | --- | --- |
| `MONGODB_URI` | **yes** | falls back to `mongodb://127.0.0.1:27017`, which no host serves. |
| `MONGODB_DB` | **yes** | falls back to `selfstoragehosting`; fine if that is the real database name. |
| `JWT_SECRET` | **yes** | 32 characters minimum. `.env.example` leaves it empty on purpose so it can never be copied into production as a publicly known signing key. |
| `NODE_ENV=production` | **yes** | the sign-in cookie drops `Secure` and `SameSite=None`, so cross-origin sign-in silently fails. |
| `CORS_ORIGINS` | **yes** | the site's origins, comma-separated. |
| `PORT` | host-dependent | defaults to 4000; most hosts inject their own. |
| `JWT_EXPIRES` | optional | leave unset or `7d`, matching the cookie lifetime fixed in code and the seven days the privacy policy states. |

## Plan 2: after the remaining pages deploy

Each needs owner access.

- [ ] **Legal review, now overdue.** PR #1 merged with the legal pages still
      marked as drafts. `git grep -n "DRAFT FOR OWNER" -- self-storage-hosting/app`
      lists every legal page still waiting. The comment at the top of each
      page lists what the owner or counsel has to decide, such as the legal
      entity that runs the site and how long data is kept.
      Remove a comment only after those decisions are made and written in.
- [ ] **Turn accounts on.** `/user/login` and `/user/register` read
      `NEXT_PUBLIC_API_BASE` at build time. Until it is set, both pages say
      "Signing in is not available right now." and send nothing.
      1. Deploy `backend/` over HTTPS with `MONGODB_URI`, `JWT_SECRET`,
         `NODE_ENV=production`, and `CORS_ORIGINS` set to the site's origins,
         comma-separated: `https://selfstoragehosting.com,https://www.selfstoragehosting.com`.
         Both, even though #5 settled on `www`: the apex 301 covers the
         browser's top-level navigation, but a stray `fetch` issued from an
         apex document would still carry the apex `Origin`, and listing it
         costs nothing. Leave `JWT_EXPIRES` unset, or set it to `7d` — the
         privacy policy says sign-in lasts seven days, and the cookie's own
         lifetime is fixed at seven days in code. In production the sign-in
         cookie is sent with `Secure` and `SameSite=None`.
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
      Then disclose it in the privacy policy's "Cookies" section.
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
- [ ] **Run the tests before every deploy.** No CI runs them today:
      `netlify.toml` runs only `npm run build`. Run `npm test` in
      `self-storage-hosting/` and in `backend/` before each deploy,
      or add both to a CI job.

## Plan 3: after the resources pages deploy

Each needs the owner's access or decision.

- [ ] **Extend #7 and #10 again.** Run the Rich Results Test on `/resources`
      (BreadcrumbList only: the hub carries no Article) and on each of the
      five guides under it (Article and BreadcrumbList). In Search Console,
      request indexing for `/resources` and the five guides. `/sitemap.xml`
      already lists them.
- [ ] **Who keeps the compatibility matrix current (spec §14 E2).** Still
      open: name someone. Until then, re-check it with the quarterly events
      review above. Open every link in the page's Sources list and correct
      any table row whose vendor page changed. Then set these to the day you
      checked:
      - both tables' "as checked on" date;
      - each source's `verifiedOn` in `self-storage-hosting/lib/sources.ts`;
      - the article's `dateModified` in `self-storage-hosting/lib/articles.ts`.
      The "as checked on" date is a fact the page states, so changing it is
      a real modification. The sitemap's `lastModified` follows
      `dateModified`.
- [ ] **The other four guides.** Each Sources list prints the date every
      source was last checked. Re-check them at the same time and update
      `verifiedOn`. Change a guide's `dateModified` only when the facts on
      it change, as `lib/articles.ts` says.
- [ ] **Cited sources still answer — monthly and before each deploy.** In
      `self-storage-hosting/`, run
      `LINKCHECK=1 npx vitest run tests/source-status.test.ts`. It fetches
      every URL in `lib/sources.ts` and fails on anything but a 200, or on
      an HTML page where the title promises a PDF. It is kept out of
      `npm test` and the build so a vendor outage cannot block a deploy,
      which is why it has to be run by hand. Vendors move documents without
      redirects: on 2026-09-25, 13 PTI PDFs had moved from `/documents/...`
      to `/documents/current-products/...` or
      `/documents/archived-products/...`. For each failure, find the
      same document on the vendor's own document page, re-read every
      sentence that cites it, then update `url` and `verifiedOn`. If the
      vendor no longer publishes it, use a web.archive.org copy only if one
      actually loads, and add "(archived copy)" to its title. If neither
      exists, remove the `SOURCES` entry and every citation of it, and
      re-check or remove each sentence it supported. An end-of-support date
      that no longer rests on the vendor's own public notice must go
      (spec §15.3). If a guide's text changes, bump its `dateModified` in
      `lib/articles.ts`.
- [ ] **Trademark owners we could not confirm.** `/legal/trademarks` names
      Revenue Control Systems, Eight IO, BearBox and Cubby Storage without an
      owner, because no first-party page for any of them was found. If counsel
      wants owners named, confirm each from the company's own site. Then move
      the name from `NAMES_WITHOUT_CONFIRMED_OWNER` into `THIRD_PARTY_MARKS` in
      `self-storage-hosting/lib/trademarks.ts`, and update
      `LEGAL_UPDATED.trademarks` in `self-storage-hosting/lib/legal.ts`.

### Two things no test can catch — read them before editing any page

Both were considered for a guard and deliberately left to a human. The first
is open-ended paraphrase detection, which fires on innocent wording; the
second is a judgement about prose.

- [ ] **Outage wording.** Anything a page says about what happens during an
      internet outage must either render the `OUTAGE_BEHAVIOR` constant from
      `self-storage-hosting/lib/claims.ts` verbatim, or be attributed to a
      named vendor's cited document. Say nothing about admin changes made
      during an outage (spec §14 D3 is still open), and never let a page or a
      section lead with offline operation.
      `tests/content-policy.test.ts` catches only the three phrasings it
      already knows; a fresh paraphrase walks straight past it.
- [ ] **Prose that restates `HARDWARE_INTEGRATIONS` or `FMS_BRIDGES`.**
      These paragraphs spell out the two `lib/claims.ts` constants in words
      instead of rendering them. Change either constant and every line below
      has to be hand-edited to match. No test compares the prose with the
      constant, so the drift is silent. Paths are under
      `self-storage-hosting/`; line numbers are where they were on
      2026-09-19, so search the wording rather than trusting them.
      All four `HARDWARE_INTEGRATIONS` categories, in order:
      - `app/(marketing)/solutions/access-control-hosting/page.tsx:58` (FAQ answer)
      - `app/(marketing)/resources/falconxt-end-of-life/page.tsx:441`

      A subset of the categories, which still has to stay true to them:
      - `app/(marketing)/about-us/page.tsx:36` and `:111`
      - `app/(marketing)/page.tsx:24`
      - `app/(marketing)/demo/page.tsx:18`
      - `app/(marketing)/solutions/page.tsx:21`
      - `app/(marketing)/solutions/access-control-hosting/page.tsx:15` and `:95`
      - `app/(marketing)/resources/falconxt-end-of-life/page.tsx:62` and `:471`

      `FMS_BRIDGES` written out as a sentence rather than mapped over:
      - `app/(marketing)/about-us/page.tsx:266`
      - `app/(marketing)/solutions/access-control-hosting/page.tsx:62` (FAQ answer) and `:214`
      - `app/(marketing)/resources/digigate-replacement/page.tsx:425-426`
      - `app/(marketing)/resources/gate-not-syncing/page.tsx:483`
      - `app/(marketing)/resources/self-storage-gate-compatibility/page.tsx:212`
      - `app/(marketing)/resources/self-storage-gate-server/page.tsx:435-436`

      Four places already render a constant and need no edit. Both
      `{HARDWARE_INTEGRATIONS.map(...)}`:
      - `app/(marketing)/about-us/page.tsx:247`
      - `app/(marketing)/solutions/access-control-hosting/page.tsx:192`

      Both `{FMS_BRIDGES.map(...)}`:
      - `app/(marketing)/about-us/page.tsx:274`
      - `app/(marketing)/solutions/access-control-hosting/page.tsx:222`
