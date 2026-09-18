# Self Storage Hosting — Website Completion & SEO Design

**Date:** 2026-09-18
**Scope:** The marketing website only. No new product or backend features, with one narrow exception (§9, auth contract repair) that the owner may veto.
**Status:** Awaiting owner approval.

---

## 1. Context

`selfstoragehosting.com` is live today as a client-rendered Vite + React SPA. Two pages are real (`HomePage`, `AboutUsPage`); eight are the identical "Under Development" placeholder. The site has no per-page metadata, no sitemap, no robots file, no structured data, and no mobile navigation.

This document specifies finishing the pages and rebuilding the site's search foundation.

### 1.1 The defect that outranks everything else

`self-storage-hosting/public/_redirects` contains exactly one line:

```
/*  /index.html  200
```

Verified against the live host: `/this-does-not-exist-xyz`, `/contact` and `/about-us/` all return **HTTP 200** with the SPA shell. So do `/robots.txt` and `/sitemap.xml`, both served as `Content-Type: text/html`.

Consequences:
- An unbounded soft-404 surface. Every typo, every stale inbound link, every crawler probe returns a success page.
- Google cannot read a robots file or a sitemap, because neither exists — the catch-all intercepts both.

The Next.js migration resolves this structurally: unmatched routes return a real 404, and `app/robots.ts` / `app/sitemap.ts` serve correct content types.

### 1.2 Known broken links in the current build

| Location | Problem |
|---|---|
| `LargeNavbar.tsx:33` | "Talk to Sales" → `/contact`, which has no route |
| `AboutUsPage.tsx:138`, `:293`, `:337` | Three more links to the nonexistent `/contact` |
| `Footer.tsx` (×4) | Security, Privacy Policy, Sitemap, Accessibility Statement are all `to="#"` |
| `Footer.tsx` | `/about-us#story`, `#careers`, `#news` — none of those anchors exist |
| `AboutUsPage.tsx:141` | "View pricing" → `/solutions/access-control-hosting`, which publishes no pricing |
| `HomePage.tsx:38` | Uses `--color-bg-website` / `--color-text-website`, never defined |
| `Spinner.tsx:8` | Uses `--color-accent-website`, never defined — the animated ring is invisible |
| `LargeNavbar.tsx:16,23,30` | Three dropdown carets on links that have no dropdown |
| `backend/index.ts:22,27` | `app.listen()` called twice — the second throws `EADDRINUSE` |

---

## 2. Locked decisions

Owner-confirmed. Not open for re-litigation during implementation.

| # | Decision |
|---|---|
| D1 | Migrate to **Next.js App Router**, deploy on **Vercel**. Domain `selfstoragehosting.com`. |
| D2 | **No fabricated customers, testimonials, logos or named case studies. Ever.** |
| D3 | The About-page stats band (100+ sites, 99.95% uptime, <200 ms, US & AU) is **placeholder — remove it entirely**. |
| D4 | The four FMS→access-control bridges are **built and running in production**. They may be presented as available. |
| D5 | `/user/login` and `/user/register` get working forms, `noindex`. |
| D6 | **No public pricing.** "Request a quote" CTAs throughout. |
| D7 | Build scope: migration + 10 pages + technical SEO + `/resources` hub with 5 articles. |
| D8 | `/support` publishes genuinely useful diagnostic content but **does not target competitor brand-support queries**. |
| D9 | `/contact` publishes a form plus business email, phone and mailing address (values pending — §14). |

### 2.1 Decisions made in this spec (owner may veto at review)

| # | Decision | Rationale |
|---|---|---|
| D10 | Articles live at flat `/resources/[slug]`. **No category sub-hubs.** | `[category]` and `[slug]` as siblings under `app/resources/` is a duplicate-route collision that fails the build. Flat also avoids shipping an indexed sub-hub with zero children. |
| D11 | Build a real `/solutions` index page. | Needed for breadcrumb integrity (never put a 404 in a `BreadcrumbList`), and there are two genuine solutions worth comparing. ~350 words, not a stub. |
| D12 | Forms POST to a Next.js Route Handler that sends transactional email. | The Express backend has auth routes only. There is nowhere for a contact form to POST today. |
| D13 | **Dark mode is out of scope.** | The commented `.dark` tokens in `App.css:63–124` use `--text-50`, not `--color-text-50`. Tailwind 4 derives utilities from `--color-*`, so porting them as-is compiles cleanly and does nothing. This is unfinished work, not a port. |
| D14 | `/case-studies` launches `noindex` and excluded from the sitemap. | No real material exists (D2). Ships as an honest "what we'd measure" page until the owner supplies studies. |

---

## 3. Realistic expectations

Recorded so success is judged against reality rather than hope.

- ~33,000 large-scale US facilities. The 100 largest companies manage ~15,000, leaving ~18,000 with smaller and independent owners. That implies roughly **20,000–30,000 US operator decision-makers**.
- Structurally this caps head terms in the low hundreds of searches/month, and each long-tail EOL or bridge query at roughly 10–100/month. **This is an inference from market size, not measured data.**
- **Success looks like tens of highly-qualified visits per month, not thousands.**
- **No verified search volumes exist anywhere in the supporting research.** Every competition rating in §5 is an editorial judgment from who currently occupies page one. The keyword map is a *hypothesis*.
- Google Search Console must be connected on day one. At day 90, re-prioritize from real impression data and discard whichever parts of §5 the data contradicts.

### 3.1 Competitive reality

`self storage access control software` and `self storage gate access system` return **zero non-incumbent results**. Storable, OpenTech, PTI, SiteLink, Sentinel, ButterflyMX, ProDataKey, DoorKing, SpiderDoor and Janus hold every position. Head terms are a 12–18 month aspiration, targeted only on the solution pages.

**The winnable wedge is the end-of-life migration cluster**, and it decays:

- PTI discontinued **FalconXT hardware and the StorLogix Cloud Adapter effective 1 Oct 2025**; support calls redirected to upgrades from 1 Dec 2025; customers transitioned to PTI CloudController.
- **StorLogix Desktop** discontinued 1 Oct 2023.
- **DigiGate is end-of-life.**

A forced-migration buyer population exists right now and no one has published the buyer-side decision guide.

### 3.2 The positioning constraint

**Storable sells this bridge first-party.** Their access-control product publicly lists DigiGate, DoorKing 1838, OpenTech CIA, PTI/StorLogix, PTI/Falcon, QuikStor, Revenue Control Systems, StorGuard and SpiderDoor. All four of our bridges originate on **Storable-owned platforms** (Storable Edge, Storable Easy) while Storable sells a competing access product. This is a marketing problem and a platform-dependency risk.

Differentiators that survive scrutiny:

1. **Audit-trail reconciliation after an outage.** Offline enforcement is table stakes — every competitor has it. *Nobody advertises the resync/backfill.* Lead with this half.
2. **Getting the Windows PC out of the office.** Documented, citable: Storable Easy's DigiGate integration requires an on-site ESS Gate Sync Program with Post Download Action pointed at `digisend.exe` and DigiGate left running; SiteLink requires a designated PC running 24/7 polling every 2 minutes; the DigiGate-700 install manual documents a "System Controller PC" with a VGA monitor driving an RS-485 bus.
3. **Migration off end-of-life DigiGate and FalconXT.**
4. **Mixed-vendor portfolios** no single FMS vendor covers.
5. **Pricing for 1–20-site independents.**

**Do not** lead with "works when the internet drops" — that is table stakes and invites an unflattering comparison.

---

## 4. Information architecture

### 4.1 Route list

| Route | Status | Index? | In sitemap? |
|---|---|---|---|
| `/` | Rebuild from existing | Yes | Yes |
| `/solutions` | **New** (D11) | Yes | Yes |
| `/solutions/access-control-hosting` | Stub → build | Yes | Yes |
| `/solutions/web-hosting` | Stub → build | Yes | Yes |
| `/about-us` | Port + correct | Yes | Yes |
| `/resources` | **New** hub | Yes | Yes |
| `/resources/[slug]` | **New** — 5 articles | Yes | Yes |
| `/events` | Stub → build | Yes | Yes |
| `/support` | Stub → build | Yes | Yes |
| `/demo` | Stub → build | Yes | Yes |
| `/contact` | **New** — fixes 4 live broken links | Yes | Yes |
| `/case-studies` | Stub → honest placeholder | **No** (D14) | No |
| `/user/login` | Stub → real form | **No** | No |
| `/user/register` | Stub → real form | **No** | No |
| `/legal/privacy` | **New** | Yes | Yes |
| `/legal/terms` | **New** | Yes | Yes |
| `/legal/trademarks` | **New** | Yes | Yes |
| `/legal/accessibility` | **New** | Yes | Yes |
| `not-found` | Port existing copy | n/a | No |

### 4.2 Navigation

**Top utility bar:** Request a Demo · Support · Login

**Main nav:** Logo · Solutions (dropdown: Access Control Hosting, Facility Websites) · Resources · About Us · **Talk to Sales** (button → `/contact`)

Fixes applied: remove the caret from "About Us" (no dropdown); real dropdowns get `aria-expanded` / `aria-controls`; **add a mobile hamburger menu** — there is none today; replace every `<a href>` with `next/link`; replace the fixed `px-30` gutter with responsive padding.

### 4.3 Footer

Four columns — Solutions, Resources, Company, Legal. Every current dead link resolves:

- Security → a `#security` section on `/legal/privacy` (no separate `/legal/security` route — it would be thin)
- Privacy Policy → `/legal/privacy`
- Sitemap → `/sitemap.xml`
- Accessibility Statement → `/legal/accessibility`
- `/about-us#story`, `#careers`, `#news` → **add the anchors** to the About page; the content largely exists.

### 4.4 Internal linking

- Every article links to at least one solution page in its first third and in its conclusion.
- Both solution pages link to `/contact` and to `/resources`.
- `/support` diagnostics link to the relevant article.
- Breadcrumbs on every page below the top level.

---

## 5. Keyword and metadata map

**Title convention:** the root layout sets `title: { template: '%s | Self Storage Hosting' }`. Per-page titles therefore **exclude** the brand suffix — it is appended automatically. Home uses `title: { absolute: ... }`. Lengths below are the page title; add 23 chars for the rendered suffix.

| Route | Primary keyword | Title (excl. suffix) | Meta description (≤155) |
|---|---|---|---|
| `/` | self storage access control software *(aspirational)* | `Self Storage Hosting — Cloud Access Control` *(absolute)* | Cloud-hosted access control and facility websites for independent self-storage operators. No on-site server. Request a quote. |
| `/solutions` | self storage software solutions | `Solutions` | Cloud access control hosting and facility websites built for independent self-storage operators. Compare both solutions. |
| `/solutions/access-control-hosting` | self storage access control systems | `Cloud Self-Storage Access Control` | Host your gate controllers, keypads and smart locks in the cloud. Works offline, reconciles the audit trail on reconnect. |
| `/solutions/web-hosting` | self storage facility website | `Self-Storage Facility Websites` | Fast, secure websites for storage facilities with SSL, CDN, lead capture and optional online move-ins. Request a quote. |
| `/about-us` | — (brand) | `About Us` | Why we built cloud access control for independent self-storage operators, and how our FMS-to-gate bridges work. |
| `/resources` | self storage access control guides | `Resources` | Practical guides on self-storage access control, gate-to-software syncing and migrating off end-of-life hardware. |
| `/events` | self storage industry events | `Industry Events` | Confirmed self-storage industry conferences and trade shows, each verified against the organizer's own listing. |
| `/support` | self storage gate troubleshooting | `Support & Diagnostics` | Diagnose gate and access-control sync problems, identify which system you're running, and find vendor support contacts. |
| `/demo` | — (conversion) | `Request a Demo` | See cloud access control running against your gate system and facility software. Book a tailored walkthrough. |
| `/contact` | — (conversion) | `Contact` | Talk to us about cloud access control hosting, facility websites or an FMS-to-gate integration. |
| `/case-studies` | — | `Case Studies` | *(noindex)* |

### 5.1 Keyword traps — do not target

- **Tenant-intent queries** (`storage units near me`, `self storage prices`) — wrong audience entirely; the buyer is the operator.
- **Competitor brand-support queries** (`storlogix support`, `digigate support`, `pti storlogix phone number`) — per D8. Ranking for a competitor's support desk is the fastest route to being declined from their partner directory.
- **Head terms as a primary launch target** — see §3.1.

---

## 6. Page blueprints

### 6.1 `/solutions/access-control-hosting` — highest priority

1. **Hero** — H1 `Cloud-hosted access control for self-storage`. Sub: no on-site server, works offline, reconciles on reconnect. CTA: Request a quote.
2. **The problem** — the on-site PC. Use the documented specifics from §3.2(2). Concrete failure modes: PC dies, Windows updates, dynamic IP, VPN/port-forwarding, no remote access, after-hours truck rolls, backup/restore, end-of-life OS.
3. **How it works** — cloud control plane + on-site bridge. Diagram.
4. **Offline behaviour and audit reconciliation** — the lead differentiator. Local controllers keep enforcing last-known rules; on reconnect, changes resync and audit logs backfill. *Owner to confirm whether admin changes made during an outage are queued and applied on reconnect — if so, that is a second differentiator nobody advertises (§14, D3).*
5. **Supported hardware** — gate controllers, smart locks, keypads/readers, door alarms and sensors.
6. **FMS integrations** — the four production bridges (D4), linking to `/about-us` and the compatibility article.
7. **Security** — RBAC, per-facility isolation, TLS, signed device tokens, key rotation, audit exports. Only claims the owner substantiates (§14, B).
8. **Migrating from end-of-life hardware** — DigiGate, FalconXT. Links to articles 1 and 3.
9. **FAQ** — 6–8 questions. Real accordion semantics (§7.5).
10. **CTA** — Request a quote.

### 6.2 `/solutions/web-hosting` — best winnable money page

Lower competition than access control. Same skeleton: hero → who it's for → what's included (SSL, CDN, forms and lead capture, optional online move-ins, unit availability) → performance and SEO benefits → how it connects to the facility's FMS → FAQ → CTA.

### 6.3 `/solutions` (D11)

~350 words. Two cards with a genuine "which do I need?" comparison, not a link list. Breadcrumb parent for both solution pages.

### 6.4 `/about-us`

Port existing, then apply every correction in §13. Remove the stats band (D3). Add `#story`, `#careers`, `#news` anchors so the footer links resolve. Repoint "View pricing" → "Explore solutions" (D6).

### 6.5 `/contact`

Form (name, company, email, phone, facility count, FMS, gate system, message) + business email, phone, mailing address (§14, A). Accessible errors per §7.5. Honeypot + rate limit per §10.

### 6.6 `/demo`

Qualification form: facility count, current FMS, current gate/access system, timeline. Sets expectations on what the demo covers. Same form infrastructure as `/contact`.

### 6.7 `/support`

Per D8. Three genuinely useful sections: **"Which system am I running?"** (identification guide), **symptom → cause diagnostics** (gate not syncing, codes not updating, lockouts not applying), and a **vendor support directory** linking each vendor's real support desk. No competitor brand names in title, meta or H1. Links to article 2.

### 6.8 `/events`

Only events confirmed against the organizer's own site (§12). Each row carries **its own source link and verified date**. A "last verified" badge is meaningless without per-row provenance. Flag to owner: this is the fastest-decaying asset on the site and needs quarterly review (§14, E1).

### 6.9 `/case-studies` (D14)

`noindex`, out of the sitemap. Honest framing: what we measure and would publish — truck rolls avoided, sync failure rate, time-to-provision a new site — plus a CTA inviting operators to be a first reference. No invented names, logos or numbers.

### 6.10 `/user/login` and `/user/register`

**Written from scratch.** Both files are currently the same "Under Development" template byte-for-byte; there is no form markup to wire. Requirements: real `<label>` elements (not placeholder-as-label), `autocomplete="current-password"` / `"new-password"`, errors wired via `aria-describedby`, error text announced via a live region, submit disabled while the auth context is unresolved, `noindex`.

### 6.11 Legal pages

`/legal/privacy` must disclose the actual data flows this site creates: form submissions and where they are sent, `@vercel/analytics` and Speed Insights if enabled, the auth cookie, and any email provider. **These pages need the owner's review or counsel — I will draft structure and the data-flow inventory, but generated boilerplate must not be presented as legal advice.** `/legal/trademarks` disclaims all third-party marks referenced across the site (DigiGate, StorLogix, Falcon, INSOMNIAC® CIA, Storable Edge, Storable Easy, Sitelink, Nokē and others).

---

## 7. Technical SEO plan

### 7.1 Metadata

- Root layout: `metadataBase: new URL('https://selfstoragehosting.com')`, `title.template`, default OG and Twitter, `alternates.canonical` per page.
- A shared `pageMeta()` helper. **It must accept an `og:type`** — hardcoding `'website'` ships every article as `og:type=website`. And it must not double-append the brand (§5).
- Viewport and theme colour via `generateViewport`, not `metadata` (deprecated since v14). Note: deleting `index.html` removes the site's only `<meta name="viewport">`; Next injects a sane default, but state this explicitly rather than leaving it to chance.
- `noindex` on `/case-studies`, `/user/login`, `/user/register`.

### 7.2 Structured data

Emit only what still earns something:

| Type | Where |
|---|---|
| `Organization` | Root layout — name, logo, `sameAs`, `contactPoint` |
| `WebSite` | Root layout — **name and url only** |
| `BreadcrumbList` | Every page below top level |
| `Article` | Each `/resources/[slug]` |
| `Event` | Each confirmed event on `/events` |

**Do NOT emit:**

- **`FAQPage`** — FAQ rich results were retired from Google Search on **7 May 2026**; support was removed from the Rich Results Test in June 2026. The accordions stay for users; the markup earns nothing.
- **`WebSite`/`SearchAction`** — sitelinks searchbox deprecated **21 Nov 2024**.
- **`SoftwareApplication`, `Product`, `aggregateRating`, `review`** — all require genuine ratings/offers we do not have. Fabricating them violates D2 and Google's guidelines.
- **`LocalBusiness`** — inappropriate for a SaaS with a mailing address rather than a walk-in premises.

Inject as `<script type="application/ld+json">` from a server component.

### 7.3 `robots.ts` and `sitemap.ts`

`app/robots.ts` allows all, disallows `/user/`, `/api/`, `/case-studies`, and points to the sitemap. `app/sitemap.ts` includes only indexable routes with real `lastModified`. Omit `changeFrequency` and `priority` — Google ignores both.

Canonical strategy: absolute URLs, **no trailing slash**, consistent everywhere. The apex currently 301s to `www` — pick one host and make canonicals match it exactly (§14, D1).

### 7.4 Core Web Vitals

- `HeroImage.png` is **1.38 MB**; `Logo.png` is **1.12 MB** and renders at 80 px tall. That is ~2.5 MB on first paint and the site's dominant LCP problem. Convert to AVIF/WebP, resize to actual display dimensions, serve via `next/image` with explicit `width`/`height`. Target: **under 100 KB combined.**
- Hero image currently has `alt=""` on a meaningful image — give it real alt text.
- Next 16 deprecated `priority` in favour of `preload` / `loading="eager"` + `fetchPriority="high"`, and `qualities` now requires an allowlist. **Pin the Next major before writing image code.**
- Fonts via `next/font`.
- Remove the fixed heights that break mobile: `min-h-[900px]` on the FAQ section, `min-h-[300px]` on the CTA strip, `h-96 w-96` on the hero.

### 7.5 Accessibility (overlaps SEO)

- **Mobile navigation does not exist.** Build it.
- FAQ accordion: `<div><p>` is nested inside `<button>` (invalid). Add `aria-controls`, wrap each question in a heading, add `aria-hidden` to the chevron icons so they stop polluting the accessible name. `aria-expanded` is already present.
- Focus-visible rings on every interactive element.
- `prefers-reduced-motion` — every CTA currently carries `transition duration-300 hover:scale-105` unconditionally.
- **Colour contrast:** the palette is a single low-saturation teal ramp. Nav is `text-text-50` on `bg-primary-600`; the primary CTA is `text-text-950` on `bg-accent-50`. Run at least one WCAG AA check on nav, CTA and body text.
- Skip-to-content link. Correct heading hierarchy.

### 7.6 Post-deploy verification

Assertions, not eyeballing:

1. `/robots.txt` returns `text/plain`, 200.
2. `/sitemap.xml` returns `application/xml`, 200, and every URL in it returns 200.
3. A nonexistent URL returns **404**, not 200.
4. Every page has exactly one `<h1>` and a unique title + description.
5. Canonical host matches the 301 target.
6. No `FAQPage` / `SoftwareApplication` / `aggregateRating` in any emitted JSON-LD.
7. Rich Results Test passes for `Organization`, `BreadcrumbList`, `Article`, `Event`.
8. Lighthouse: LCP < 2.5 s, CLS < 0.1, INP < 200 ms on mobile.
9. Combined image weight on `/` under 100 KB.
10. Google Search Console connected, sitemap submitted.

---

## 8. Migration plan

Target: **Next.js 16.3.5**, `tailwindcss@4.3.3`, `react@19.3.0`, `react-icons@5.7.0` (all verified current on npm).

1. Scaffold the Next app. Route groups `(marketing)` and `(auth)`.
2. **Fix `AuthContext` first** — it is a build-breaker, not a warning (§9).
3. **Tailwind:** copy `src/App.css` **lines 1–125 whole**. The commented `.dark` block at lines 63–124 sits *inside* the `@theme` block, so copying 1–62 leaves `@theme {` unterminated and excising 63–125 removes `@theme`'s own closing brace. The comment is inert and compiles fine. Dark mode is out of scope (D13).
4. **Import `globals.css` in `app/layout.tsx`.** `App.css` is currently imported from `main.tsx:4`, which gets deleted — one missing line ships the entire site unstyled.
5. Port pages to App Router file conventions. Delete all 11 `lazy()` calls — App Router code-splits per route. `Spinner` → `(marketing)/loading.tsx` is optional; with every marketing page static there is nothing left to suspend on.
6. `<Link to>` → `next/link` `href`. `"use client"` only on genuinely interactive leaves (FAQ accordion, mobile nav, forms, auth).
7. Port `NotFoundPage` copy into `app/not-found.tsx` — **it already exists**, don't invent new copy.
8. `VITE_API_BASE` → `NEXT_PUBLIC_API_BASE`.
9. Delete `index.html`, `main.tsx`, `App.tsx`, `vite.config.ts`, `public/_redirects`.
10. `next lint` was removed in 16; the project already uses `"lint": "eslint ."`, so this is nearly a no-op. Codemod if needed: `npx @next/codemod@canary next-lint-to-eslint-cli`.

**react-icons:** works in server components. The only consideration is bundle size — importing a client component into a server component does *not* convert the importer, and `export const metadata` keeps working.

---

## 9. Auth contract repair

**The owner may veto this entire section**; if vetoed, the forms get full validation and error UX against the correct endpoints and remain non-functional until the backend is fixed.

`AuthContext` and the Express backend currently disagree in five independent ways:

| # | Problem | Effect |
|---|---|---|
| 1 | Frontend calls `/app/auth/*`; backend serves `/api/users/*` | Every auth call 404s |
| 2 | Frontend requires `data.token` in the body; backend returns `{user}` and sets an httpOnly cookie | Login throws even at the correct URL |
| 3 | `requireAuth` reads `req.cookies?.token`; `cookie-parser` is not installed or mounted | `/profile` always returns `401 NO_TOKEN` |
| 4 | No `cors` middleware, but the browser calls cross-origin with `credentials: "include"` | Browser blocks the request |
| 5 | `backend/index.ts:22,27` calls `app.listen()` twice | Second call throws `EADDRINUSE` |

Nos. 1–3 are mutually contradictory: the frontend is built around a localStorage bearer token, the backend around an httpOnly cookie. **Resolution: adopt the cookie model** and drop localStorage token handling.

Additional defects found in `AuthContext`:
- The `API` constant (line 28) has a `?? "http://localhost:4000"` fallback but is used **only by `register`**. `login`, `refreshProfile` and `logout` inline the env var with no fallback — so if it is unset, three calls hit `undefined/...` while `register` silently hits localhost. Collapse all four to one constant that fails fast.
- `credentials: "include"` is present on `refreshProfile`/`login`/`logout` but **missing on `register`** and `authFetch`.
- The lazy initializer at lines 31–33 reads `localStorage` during render — this breaks prerendering once the provider moves to `app/layout.tsx`. Needs a mounted guard.

---

## 10. Forms infrastructure (D12)

`backend/src/routes` contains auth routes only. There is no form endpoint.

- `app/api/contact/route.ts` — a Route Handler validating input server-side and dispatching via a transactional email provider (Resend or equivalent). API key required (§14, D2).
- Honeypot field plus basic rate limiting. A public form on a solo-founder site with no spam control becomes a support burden within a week.
- Accessible error handling per §7.5.
- Privacy policy must disclose where submissions go (§6.11).

---

## 11. Content plan

Five articles at `/resources/[slug]` (D10), built on the EOL wedge:

| # | Article | Primary query | Intent | Links to |
|---|---|---|---|---|
| 1 | PTI FalconXT and StorLogix Cloud Adapter End of Life: Every Option You Actually Have | `falconxt end of life` | Commercial | Access control |
| 2 | Why Your Gate Isn't Syncing With Your Storage Software: A Diagnostic Guide | `gate not syncing storage software` | Informational | Support, access control |
| 3 | Still Running DigiGate? What to Do Now That Support Has Ended | `digigate replacement` | Commercial | Access control |
| 4 | Self-Storage Software and Gate Access Control: An Independent Compatibility Matrix | `self storage software gate compatibility` | Commercial | Both solutions |
| 5 | Do You Still Need a Windows PC in the Office to Run Your Gate? | `self storage gate server` | Informational | Access control |

**Guardrail:** do not publish a specific end-of-support *date* for any third-party product beyond what the vendor has stated publicly. Cite the vendor announcement and link it.

---

## 12. Events

Publish only these, each with its own source link and verified date:

| Event | Dates | Venue | Source |
|---|---|---|---|
| SSAA GC26 | 10–12 Nov 2026 | The Star Grand Gold Coast, Broadbeach | selfstorage.org.au/convention26 |
| SSA Ski Workshop 2027 | 11–14 Jan 2027 | Telluride Conference Center | SSA All-Events |
| ISS World Expo 2027 | Education 30 Mar–2 Apr; exhibits 31 Mar–1 Apr | Caesars Forum | issworldexpo.com |
| ISC West 2027 | 5–9 Apr 2027 | The Venetian Expo | discoverisc.com/west |
| SSA Spring 2027 | 28–30 Apr 2027 | Savannah Convention Center | SSA All-Events |
| SSA Fall 2027 | 7–10 Sep 2027 | Aria, Las Vegas | SSA National Fall Conference page |

Regional shows confirmed on SSA's All-Events page only: OHSSA 9/23 Columbus, NVSSA 10/6 Reno, VASSA 10/7 Richmond, IL-SSA 10/7 Champaign, GASSA/SCSSA 10/25–27 Greenville, NCSSA 11/9–10 Greensboro, SSAM 11/16–17 Detroit.

**Must not appear:** NeSSA Fall Retreat, FSSA Executive Summit, FSSA Holiday Gala, and the CSSA holiday events — none were confirmed on an organizer source. **Do not state that ISS Expo was renamed, sold or discontinued** — that was not verified.

---

## 13. Copy corrections to existing pages

Apply everywhere, including `AboutUsPage` and any new copy:

| Wrong | Correct |
|---|---|
| "Digi Gate" | **DigiGate** — a PTI Security Systems *product* (not verified as a registered trademark), end-of-life |
| "StorEdge" | **Storable Edge** (was storEDGE; renamed 6 Mar 2025) |
| "Easy Storage Solutions" | **Storable Easy** (renamed 6 Mar 2025) |
| "SiteLink" | **Sitelink by Storable** — verify current preferred capitalization on sitelink.com before publishing any brand-matched page; both spellings are in market |
| "OpenTech Alliance" (as product) | OpenTech Alliance is the *company*; the product is **INSOMNIAC® CIA**. Reproduce ® once per page at first use |
| "PMS" | **FMS** (facility management software) — the industry term |
| "in real time" (`AboutUsPage.tsx:271`) | Remove or qualify with a measured figure |
| "Stor-Guard" | **StorGuard** (one word) |

Also: the fifth bridge row (`AboutUsPage.tsx:96`, `"Your PMS" → OpenTech Alliance, Planned`) is an open-ended promise to bridge any unnamed FMS. Replace with a "Tell us your FMS" qualification CTA.

`"truck rolls"` (`AboutUsPage.tsx:52`) sits under an "Installer Friendly" heading — acceptable in installer-facing context; keep. `"time profiles"` (`:75`) is correct industry terminology; keep.

---

## 14. Facts needed from the owner

**A. Contact details (D9)** — business email, phone, mailing address. *Currently blocking the final state of `/contact` and `Organization` schema; build proceeds with clearly-marked placeholders.*

**B. Security claims** — which of these can be substantiated: encryption at rest, RBAC, SSO-ready, signed device tokens, key rotation, per-facility isolation, audit exports? Anything unsubstantiated comes out.

**C. Brand and legal** — legal entity name, social profile URLs for `sameAs`, privacy policy and terms content (or counsel).

**D. Infrastructure**
- D1: canonical host — apex or `www`?
- D2: transactional email provider and API key (§10).
- D3: **Are admin changes made during a site outage queued and applied on reconnect?** If yes, that is a second differentiator nobody advertises.

**E. Ongoing ownership**
- E1: who reviews `/events` quarterly? It is the fastest-decaying asset on the site.
- E2: who maintains the compatibility matrix in article 4?

**F. Commercial** — do Storable's and OpenTech's terms permit a third party to build and commercially operate these bridges? If not, the integration content and roughly half the differentiator set collapse to "cloud access control hosting + facility websites." Worth confirming before investing in integration-led positioning.

---

## 15. Risks and do-not-do

1. **Never publish invented customers, logos, testimonials, case studies or metrics** (D2).
2. **Never publish an unverified event date.**
3. **Never state a third-party end-of-support date** beyond the vendor's own public announcement.
4. **Never imply a partnership or endorsement** with PTI, OpenTech, Storable or Janus. Carry a trademark disclaimer.
5. **Do not ship `FAQPage`, `SoftwareApplication`, `Product`, `aggregateRating` or `SearchAction`** (§7.2).
6. **Do not build thin pages.** Better to `noindex` a page than ship a doorway. All eight current stubs are byte-identical — that is a doorway-page pattern and Google treats it as such.
7. **Do not lead with "works when the internet drops"** — table stakes (§3.2).
8. **Do not restore the `/*  →  200` catch-all** in any form.

---

## 16. Build order

1. Migration scaffold + Tailwind + layout + `AuthContext` fix — site builds and renders.
2. Technical SEO foundation: metadata helper, `robots.ts`, `sitemap.ts`, JSON-LD, `next/image`, mobile nav, a11y.
3. Port and correct `/`, `/about-us` (§13 corrections, stats band removed).
4. `/contact` + forms infrastructure — **fixes 4 live broken links**.
5. Both solution pages + `/solutions` index.
6. `/demo`, `/support`, `/events`, `/case-studies`.
7. `/user/login`, `/user/register`.
8. Legal pages.
9. `/resources` hub + 5 articles.
10. Verification sweep (§7.6), then deploy.

Steps 1–4 are the highest-value contiguous block: they eliminate the crawl defects, fix every broken link, and get Search Console collecting data. If work stops anywhere, stop after step 4.
