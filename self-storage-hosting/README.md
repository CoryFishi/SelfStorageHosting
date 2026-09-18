# Self Storage Hosting — Website

Next.js 16 App Router marketing site for selfstoragehosting.com.

## Develop

    npm install
    cp .env.example .env.local   # then fill in the values
    npm run dev

The API lives in `../backend` and must be running for the auth pages:

    cd ../backend
    cp .env.example .env         # then fill in the values
    npm install
    npm run dev

The API needs a reachable MongoDB (a local `mongod` or an Atlas URI in
`MONGODB_URI`); it exits with `Failed to start API` if it cannot connect.
`JWT_SECRET` is optional in development and **required in production** —
the process refuses to start without it.

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm test` — Vitest (SEO, routing, link integrity, content policy)
- `npm run lint` — ESLint

## Conventions

- Routes, navigation and footer data live in `lib/site.ts`. Adding a page
  means adding it there; the sitemap and the link-integrity test read from it.
- Page metadata goes through `pageMeta()` in `lib/seo.ts`. Never put the brand
  name in a page title — the root layout template appends it.
- JSON-LD goes through `lib/schema.ts`. `FAQPage`, `SoftwareApplication`,
  `Product`, `aggregateRating`, `review`, `SearchAction` and `LocalBusiness`
  are blocked and will fail the build.
- No unverified metrics in copy: no uptime percentage, latency figure or site
  count, and no security claim beyond TLS until the owner substantiates it.
  `tests/content-policy.test.ts` enforces this.
- No `opacity-*` utility on text sitting on the dark chrome —
  `tests/contrast.test.ts` reads raw tokens and cannot see a composited colour.
- See `docs/superpowers/specs/2026-09-18-website-completion-seo-design.md`
  for the full content and copy rules.
