# Remaining Pages Implementation Plan (Plan 2 of 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build every page the navigation and footer already promise (except `/resources`, which is Plan 3), harden the auth contract behind the login and register forms, and make it structurally impossible for the site to link a page that does not exist. After this plan, PR #1 can merge.

**Architecture:** Plan 1 put the site's shape in `lib/site.ts` (`ROUTES`, `NAV`, `FOOTER`) and guarded it with pure-function tests. Plan 2 adds one idea on top: **a link is rendered only if its target is built.** `isLive()` answers that from `ROUTES`. The chrome renders `liveNav()` and `liveFooter()`. `Breadcrumbs` and `CtaBand` throw at build time on a dead target. A source guard scans every `href` literal. Each page then lands with its `built` flag flipped in the same commit, and the chrome grows to include it automatically. Third-party facts (events, vendor support desks, PTI end-of-life status, on-site PC requirements) come only from **Appendix A**. That appendix was verified against primary sources on 2026-09-18.

**Tech Stack:** Next.js 16.3.5 App Router, React 19.3.0, Tailwind CSS 4.3.3 (CSS-first tokens in `app/globals.css`), TypeScript ~5.8.3, react-icons 5.7.0, Vitest ^3.2.7 (node environment, no DOM library). Backend: Express 5.1, Mongoose 8.18, bcryptjs, Vitest + Supertest. Hosting: Netlify behind Cloudflare.

**Spec:** `docs/superpowers/specs/2026-09-18-website-completion-seo-design.md`

## Global Constraints

Every task's requirements implicitly include this section.

- **Working directories.** Frontend commands run in `self-storage-hosting/`. Backend commands run in `backend/`. Paths in this plan are relative to the repo root unless a step says `cd`.
- **Read the bundled Next docs before writing Next code.** `self-storage-hosting/AGENTS.md` says this is not the Next.js you know. The docs are in `self-storage-hosting/node_modules/next/dist/docs/`.
- **Pinned versions. No new dependencies in either `package.json`.** `next@16.3.5`, `react@19.3.0`, `react-dom@19.3.0`, `tailwindcss@4.3.3`, `react-icons@5.7.0`, `vitest@^3.2.7`.
- **Never emit these JSON-LD types:** `FAQPage`, `SoftwareApplication`, `Product`, `aggregateRating`, `review`, `SearchAction`, `LocalBusiness`. `components/JsonLd.tsx` throws on them.
- **Never publish** invented customers, testimonials, logos, case studies or metrics. **Never publish an unverified performance number.** That means no uptime percentage, latency figure, round-trip time, or site count.
- **Never publish a security claim beyond TLS** until spec §14 B is answered. The approved wording is: "Served over TLS. Ask us for our current security posture." Softening an unverified claim into vaguer words still publishes it. `tests/content-policy.test.ts` enforces the jargon and the plain-English forms.
- **Never publish a per-vendor integration status** until spec §14 F is answered. The approved bridge wording is: "We can bridge {FMS} to {gate system}. Tell us your setup." Ruling: spec D4 lets the four bridges be "presented as available", but §14 F, which asks whether each bridge may be named as a live integration, is still open. The narrower wording is the one that stays true whatever the answer to §14 F turns out to be. Cost if wrong: the pages undersell working bridges until §14 F is answered and the copy is updated.
- **Never write "audit log", "audit trail" or "audit export".** The content-policy regex rejects all three. Say "event history" or "access history" instead.
- **Offline behaviour: say exactly this much and no more.** Controllers keep enforcing the last rules they received. Site events recorded during an outage are sent up when the connection returns. Say **nothing** about admin changes made during an outage (spec §14 D3 is open). Never *lead* a page or a section with offline operation (spec §3.2, §15.7). From Task 5 on, the wording lives in `OUTAGE_BEHAVIOR` in `lib/claims.ts`. Pages render that constant and never paraphrase it.
- **Third-party facts come only from Appendix A.** Events, vendor support URLs, PTI legacy status and on-site PC requirements are all in Appendix A. **Never state a third-party end-of-support date.** PTI's own pages give none (Appendix A.3). The spec's §3.2(2) wording about a "designated PC running 24/7 polling every 2 minutes" and a "System Controller PC" **failed verification. Do not use it.** Use the verified wording in Appendix A.4.
- **Copy rules** (spec §13) apply to all new copy:
  - "Digi Gate" → **DigiGate**
  - "StorEdge" → **Storable Edge**
  - "Easy Storage Solutions" → **Storable Easy**
  - "SiteLink" → **Sitelink** (write **Sitelink by Storable** at first mention on a page)
  - "PMS" → **FMS**
  - "Stor-Guard" → **StorGuard**
  - OpenTech Alliance is the *company*. The product is **INSOMNIAC® CIA**, with ® once per page, at first use.
  - Never imply partnership or endorsement with PTI, OpenTech, Storable or Janus.
- **/support never names a competitor in its title, meta description or H1** (spec D8, §5.1). Vendor names may appear in the body and the support directory.
- **Legal pages are drafts of the owner's policy, not legal advice.** Never invent a legal entity name, a governing-law clause or a retention period. Each legal page carries a code comment saying it needs owner or counsel review before merge.
- **Contact details.** `SITE.contactEmail` stays `""` and no page publishes an email address, phone number or postal address (spec §14 A). Route people to `/contact`.
- **Secrets come from the environment only.** Never commit a real secret. `backend/.env` stays gitignored.
- **Never send a VALID body to the deployed `/api/contact`.** The preview may hold live Resend credentials, and a valid body sends a real email. Probe only with invalid bodies such as `{}`.
- **Port 3000 belongs to a long-lived server owned by the repo owner (PID 42384). Never stop it.** Any verification server uses port 3210 or higher, e.g. `npx next start -p 3210`. Stop only servers you started.
- **Commit only the files your task names.** Use `git add <path> <path>`, never `git add -A` or `git add .`. `.claude/` and `.serena/` must stay untracked **and** unignored.
- **Dark chrome is `bg-primary-700`, never `primary-600`.** On it, text is `text-text-50` and subtext is `text-accent-200`. Primary buttons on dark are `bg-accent-50 text-text-950 hover:bg-accent-200`. On light surfaces, body text is `text-text-700` through `text-text-900`.
- **No `opacity-*` utility on text.** The contrast test reads raw tokens and cannot see a composited colour.
- **Focus rings come from `components/ui/focus.ts`.** Use `FOCUS_RING_LIGHT` on light surfaces and `FOCUS_RING` on the dark chrome. Never inline a `focus-visible:outline-…` class. The contrast test fails on inlined rings.
- **Canonicals come from `pageMeta()` in `page.tsx` only.** Never from a layout.
- **A route's `built` flag flips to `true` in the same commit that creates its `page.tsx`.** Never before, never after.
- **Every guard is probed.** After writing a guard, commit, then mutate the real source it inspects, run only that test, and confirm it fails **and names the offending file or route**. Then restore with `git checkout -- <file>` (safe, because you committed first) or delete the untracked probe file. Finally confirm `git status --short` shows nothing you did not intend. A green guard is not evidence (see `MEMORY.md` → guards-must-be-probed).
- **Write regexes as regex literals in `.ts` files.** Never write them inside a `node -e` string or a shell heredoc: backslashes collapse on this machine.
- **Gates before every frontend commit:** in `self-storage-hosting/`, run `npm run lint`, `npm test`, `npm run build`, then `RENDERED=1 npx vitest run tests/rendered.test.ts` (from Task 1 on). All must pass. Run them in Git Bash; the `RENDERED=1` prefix is not PowerShell syntax. **Backend commits:** in `backend/`, run `npm test` and `npx tsc --noEmit`.
- **Do not restore a `/* → 200` catch-all** in any form.
- **Dark mode is out of scope** (spec D13).
- **`/resources` and every `/resources/*` route belong to Plan 3.** Nothing in this plan may link to them.

---

## File Structure

| File | Status | Responsibility | Task |
|---|---|---|---|
| `self-storage-hosting/lib/site.ts` | Modify | Adds `isLive`, `assertLive`, `liveNav`, `liveFooter`. Flips `built` per page. Adds the footer Security link. | 1, 3–11, 14, 15 |
| `self-storage-hosting/components/nav/MainNav.tsx` | Modify | Renders `liveNav().main` (Task 1). Its skip-link comment names SiteChrome (Task 14) | 1, 14 |
| `self-storage-hosting/components/nav/TopBar.tsx` | Modify | Renders `liveNav().utility` | 1 |
| `self-storage-hosting/components/Footer.tsx` | Modify | Renders `liveFooter()` | 1 |
| `self-storage-hosting/tests/helpers/pages.ts` | Create | `pageFiles()` and `pageMetaArg()`, moved out of sitemap-coverage | 1 |
| `self-storage-hosting/tests/links.test.ts` | Modify | Tests the live-nav behaviour and the chrome source guard | 1 |
| `self-storage-hosting/tests/helpers/links.ts` | Create | `allowedLink()`: the one link rule both link guards share. Interim until Task 15 | 1, 15 |
| `self-storage-hosting/tests/source-links.test.ts` | Create | Guards every `href` literal, fragment anchors and `http://` links | 1 |
| `self-storage-hosting/tests/rendered.test.ts` | Create | Checks the built HTML: one h1, unique title and description, canonical, robots, links, JSON-LD, event markup against visible rows, off-site resources, INSOMNIAC ® at first use, the skip link and one `<main id="main">`. Runs with `RENDERED=1` | 1, 8, 10, 11, 14 |
| `self-storage-hosting/tests/sitemap-coverage.test.ts` | Modify | Built-route pageMeta, noindex, h1 and unique-meta guards | 1, 3–11 |
| `self-storage-hosting/components/Breadcrumbs.tsx` | Create | Visible breadcrumb trail plus BreadcrumbList JSON-LD; throws on a dead crumb | 2 |
| `self-storage-hosting/components/CtaBand.tsx` | Create | Dark call-to-action band; throws on a dead target | 2 |
| `self-storage-hosting/tests/breadcrumbs.test.ts` | Create | Component throw test plus the breadcrumb source guard | 2 |
| `self-storage-hosting/tests/contrast.test.ts` | Modify | Coverage regex widened to primary/secondary/accent text; new PAIRS rows | 2 |
| `self-storage-hosting/tests/content-policy.test.ts` | Modify | Adds a "real time" pattern (Task 2); the outage-paraphrase row and its usage test (Task 5) | 2, 5 |
| `self-storage-hosting/app/(marketing)/about-us/page.tsx` | Modify | Breadcrumbs, telemetry copy (Task 2); CtaBand to /demo (Task 3); outage answer from `OUTAGE_BEHAVIOR` (Task 5) | 2, 3, 5 |
| `self-storage-hosting/app/(marketing)/page.tsx` | Modify | Outage answer from `OUTAGE_BEHAVIOR` | 5 |
| `self-storage-hosting/app/(marketing)/contact/page.tsx` | Modify | Breadcrumbs (Task 2); `<ContactForm />` (Task 3) | 2, 3 |
| `self-storage-hosting/lib/contact.ts` | Modify | `TIMELINE_OPTIONS`, `timeline`, message optional for demo | 3 |
| `self-storage-hosting/components/ContactForm.tsx` | Modify | `variant` prop, timeline select, demo labels | 3 |
| `self-storage-hosting/tests/contact.test.ts` | Modify | Demo validation cases | 3 |
| `self-storage-hosting/app/(marketing)/demo/page.tsx` | Create | /demo | 3 |
| `self-storage-hosting/app/(marketing)/solutions/page.tsx` | Create | /solutions | 4 |
| `self-storage-hosting/lib/sources.ts` | Create | `SOURCES`: every third-party page the site cites, with the date it was checked | 5 |
| `self-storage-hosting/lib/claims.ts` | Create | `OUTAGE_BEHAVIOR`: the approved outage wording, rendered by every page that mentions it | 5 |
| `self-storage-hosting/tests/sources.test.ts` | Create | Source data guards; every source is cited somewhere | 5 |
| `self-storage-hosting/components/SourceLink.tsx` | Create | Renders one citation link | 5 |
| `self-storage-hosting/app/(marketing)/solutions/access-control-hosting/page.tsx` | Create | /solutions/access-control-hosting | 5 |
| `self-storage-hosting/app/(marketing)/solutions/web-hosting/page.tsx` | Create | /solutions/web-hosting | 6 |
| `self-storage-hosting/lib/vendors.ts` | Create | Verified vendor support directory data | 7 |
| `self-storage-hosting/tests/vendors.test.ts` | Create | Vendor data guards. Task 11 moves its watchlist into `tests/helpers/brands.ts` | 7, 11 |
| `self-storage-hosting/app/(marketing)/support/page.tsx` | Create | /support | 7 |
| `self-storage-hosting/lib/dates.ts` | Create | `formatDate`, `formatDateRange` (pure, no Intl) | 8 |
| `self-storage-hosting/lib/events.ts` | Create | `IndustryEvent`, `EVENTS`, `upcomingEvents` | 8 |
| `self-storage-hosting/lib/schema.ts` | Modify | `eventSchema` takes a PostalAddress, organizer and eventStatus | 8 |
| `self-storage-hosting/tests/events.test.ts` | Create | Pure-function tests and data guards | 8 |
| `self-storage-hosting/tests/schema.test.ts` | Modify | Both `eventSchema` calls updated to the new signature | 8 |
| `self-storage-hosting/app/(marketing)/events/page.tsx` | Create | /events (ISR, daily) | 8 |
| `self-storage-hosting/tests/case-studies.test.ts` | Create | No numbers, quotes or logos on /case-studies (spec D2) | 9 |
| `self-storage-hosting/app/(marketing)/case-studies/page.tsx` | Create | /case-studies (noindex) | 9 |
| `self-storage-hosting/lib/legal.ts` | Create | `LEGAL_UPDATED`, one date per legal page | 10, 11 |
| `self-storage-hosting/tests/legal.test.ts` | Create | Legal pages name no entity, law or retention period; the privacy policy stays true to the code | 10, 11 |
| `self-storage-hosting/app/(marketing)/legal/privacy/page.tsx` | Create | /legal/privacy with `#security` | 10 |
| `self-storage-hosting/app/(marketing)/legal/terms/page.tsx` | Create | /legal/terms | 10, 11 |
| `self-storage-hosting/tests/helpers/brands.ts` | Create | `WATCHLIST` and `words`, shared by the vendor and trademark guards | 11 |
| `self-storage-hosting/lib/trademarks.ts` | Create | `THIRD_PARTY_MARKS` | 11 |
| `self-storage-hosting/tests/trademarks.test.ts` | Create | Every third-party name the site uses is listed | 11 |
| `self-storage-hosting/app/(marketing)/legal/trademarks/page.tsx` | Create | /legal/trademarks | 11 |
| `self-storage-hosting/app/(marketing)/legal/accessibility/page.tsx` | Create | /legal/accessibility | 11 |
| `backend/src/routes/user.routes.ts` | Modify | `readCredentials`, input validation, closes an operator-injection hole | 12 |
| `backend/tests/app.test.ts` | Modify | New validation tests; two existing tests move to a valid password | 12 |
| `self-storage-hosting/lib/auth-form.ts` | Create | `AuthError`, `User`, `toUser`, `validateAuthInput`, `friendlyAuthError` | 13 |
| `self-storage-hosting/lib/auth-context.tsx` | Modify | Typed errors, `toUser`, logged catch, `available`. Drops the unused `error` state | 13 |
| `self-storage-hosting/tests/auth-form.test.ts` | Create | Pure tests for auth-form.ts, and the drift check against the backend's rules | 13 |
| `self-storage-hosting/tests/auth-config.test.ts` | Modify | Source checks for `available`, the cast and the logged catch | 13 |
| `self-storage-hosting/tests/form-a11y.test.ts` | Create | Every form labels its fields, links errors to them, and announces results | 14 |
| `self-storage-hosting/components/SiteChrome.tsx` | Create | Skip link, TopBar, MainNav, `<main>`, Footer | 14 |
| `self-storage-hosting/app/(marketing)/layout.tsx` | Modify | Uses SiteChrome | 14 |
| `self-storage-hosting/app/not-found.tsx` | Modify | Uses SiteChrome | 14 |
| `self-storage-hosting/app/(auth)/layout.tsx` | Create | AuthProvider + SiteChrome | 14 |
| `self-storage-hosting/components/AuthForm.tsx` | Create | Accessible login and register form | 14 |
| `self-storage-hosting/app/(auth)/user/login/page.tsx` | Create | /user/login (noindex) | 14 |
| `self-storage-hosting/app/(auth)/user/register/page.tsx` | Create | /user/register (noindex) | 14 |
| `docs/deploy-checklist.md` | Modify | Plan 2 deploy items | 15 |

**Task order and why.** /demo comes before the solution pages so they can link to it. /solutions comes before its two children because their breadcrumbs name it, and `Breadcrumbs` throws on an unbuilt crumb. Between Task 1 and Task 15, both link guards (source and rendered) run in an **interim mode**, defined once in `tests/helpers/links.ts`. In that mode a link may name an unbuilt route that is in `ROUTES` (never `/resources`). The existing home and about-us pages already link `/solutions`, `/demo` and both solution pages, and those land over Tasks 3–6. Task 15 tightens the guard to built routes only.

**"Is actually checking something" array** (`tests/sitemap-coverage.test.ts`). Each task that flips an indexable route updates it to exactly this, in `ROUTES` order:

| After task | `indexableRoutes()` |
|---|---|
| 3 | `["/", "/about-us", "/contact", "/demo"]` |
| 4 | `["/", "/about-us", "/contact", "/solutions", "/demo"]` |
| 5 | `["/", "/about-us", "/contact", "/solutions", "/solutions/access-control-hosting", "/demo"]` |
| 6 | `["/", "/about-us", "/contact", "/solutions", "/solutions/access-control-hosting", "/solutions/web-hosting", "/demo"]` |
| 7 | `["/", "/about-us", "/contact", "/solutions", "/solutions/access-control-hosting", "/solutions/web-hosting", "/support", "/demo"]` |
| 8 | `["/", "/about-us", "/contact", "/solutions", "/solutions/access-control-hosting", "/solutions/web-hosting", "/events", "/support", "/demo"]` |
| 9 | unchanged (noindex route) |
| 10 | Task 8's array + `"/legal/privacy", "/legal/terms"` |
| 11 | Task 10's array + `"/legal/trademarks", "/legal/accessibility"` |
| 14 | unchanged (noindex routes) |

---


### Task 1: Render only live links, and guard every link in source

Right now the nav and footer render every entry in `NAV` and `FOOTER`. Fourteen of them point at pages that do not exist, so every visitor who clicks one gets a 404. This task:
- makes the chrome render only built routes;
- adds a guard over every literal `href` in the codebase;
- extends the pageMeta guards from indexable routes to all built routes;
- checks that each `#fragment` link has its anchor.

**Files:**
- Modify: `self-storage-hosting/lib/site.ts` (append after `indexableRoutes`)
- Modify: `self-storage-hosting/components/nav/TopBar.tsx`, `self-storage-hosting/components/nav/MainNav.tsx`, `self-storage-hosting/components/Footer.tsx`
- Create: `self-storage-hosting/tests/helpers/pages.ts`
- Modify: `self-storage-hosting/tests/sitemap-coverage.test.ts`
- Modify: `self-storage-hosting/tests/links.test.ts`
- Create: `self-storage-hosting/tests/helpers/links.ts`
- Create: `self-storage-hosting/tests/source-links.test.ts`
- Create: `self-storage-hosting/tests/rendered.test.ts`

**Interfaces:**
- Consumes: `ROUTES`, `NAV`, `FOOTER`, `NON_ROUTE_PATHS`, `NavLink` and `NavItem` from `lib/site.ts`; `PKG_ROOT` and `walkFrom` from `tests/helpers/walk.ts`; `canonicalFor` from `lib/seo.ts`; `assertNoForbiddenTypes` from `lib/schema.ts`.
- Produces the names below. Every later task relies on them exactly.
  - `isLive(href: string): boolean`. It strips any `#fragment`. It is true for `NON_ROUTE_PATHS`, and otherwise returns `ROUTES[path]?.built === true`.
  - `assertLive(href: string, context: string): void`. It throws `Error(\`${context} links to ${href}, which is not a built route\`)`.
  - `liveNav(): { utility: NavLink[]; main: NavItem[] }`.
  - `liveFooter(): { heading: string; links: NavLink[] }[]`.
  - `tests/helpers/pages.ts` exports `pageFiles(): Map<string, string>` (URL → absolute page.tsx path) and `pageMetaArg(src: string): string | null`.
  - `tests/helpers/links.ts` exports `allowedLink(path: string): boolean`. It holds the **interim** link rule, and Task 15 tightens it in this one place. Both `tests/source-links.test.ts` and `tests/rendered.test.ts` use it.
  - `tests/rendered.test.ts` checks the HTML that `next build` wrote. It runs only with `RENDERED=1`, after a build: `npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts`. **Every later task that adds or changes a page runs it** in its gates step.

- [ ] **Step 1: Write the failing behaviour tests for the live nav**

In `self-storage-hosting/tests/links.test.ts`, replace the two import lines at the top with:

```ts
import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  ROUTES,
  NAV,
  FOOTER,
  indexableRoutes,
  SITE,
  NON_ROUTE_PATHS,
  isLive,
  assertLive,
  liveNav,
  liveFooter,
} from "@/lib/site";
import { PKG_ROOT, walkFrom } from "./helpers/walk";
```

Then append at the end of the file:

```ts
// ROUTES is a mutable Record. These cases flip `built` on a few entries so
// liveNav/liveFooter are tested in every state the site passes through while
// Plan 2 lands. The originals are restored even when an assertion throws.
function withBuilt(overrides: Record<string, boolean>, run: () => void) {
  const prev = Object.fromEntries(Object.keys(overrides).map((k) => [k, ROUTES[k].built]));
  try {
    for (const [k, v] of Object.entries(overrides)) ROUTES[k].built = v;
    run();
  } finally {
    for (const [k, v] of Object.entries(prev)) ROUTES[k].built = v;
  }
}

describe("live links", () => {
  it("isLive ignores the fragment and accepts non-route files", () => {
    expect(isLive("/about-us#story")).toBe(true);
    expect(isLive("/sitemap.xml")).toBe(true);
    expect(isLive("/no-such-page")).toBe(false);
  });

  it("assertLive names the context and the dead href", () => {
    expect(() => assertLive("/no-such-page", "Test link")).toThrow(
      "Test link links to /no-such-page, which is not a built route"
    );
    expect(() => assertLive("/contact", "Test link")).not.toThrow();
  });

  it("drops a main item whose own page is not built, even if a child is", () => {
    withBuilt({ "/solutions": false, "/solutions/web-hosting": true }, () => {
      expect(liveNav().main.map((i) => i.href)).not.toContain("/solutions");
    });
  });

  it("keeps only built children, and drops the children key when none remain", () => {
    withBuilt(
      {
        "/solutions": true,
        "/solutions/access-control-hosting": true,
        "/solutions/web-hosting": false,
      },
      () => {
        const item = liveNav().main.find((i) => i.href === "/solutions");
        expect(item?.children?.map((c) => c.href)).toEqual(["/solutions/access-control-hosting"]);
      }
    );
    withBuilt(
      {
        "/solutions": true,
        "/solutions/access-control-hosting": false,
        "/solutions/web-hosting": false,
      },
      () => {
        const item = liveNav().main.find((i) => i.href === "/solutions");
        expect(item).toBeDefined();
        // No key at all, not an empty array. MainNav renders a dropdown for
        // any truthy `children`, and an empty dropdown is a dead control.
        expect(item && "children" in item).toBe(false);
      }
    );
  });

  it("drops a footer column once every link in it is dead", () => {
    withBuilt(
      { "/solutions/access-control-hosting": false, "/solutions/web-hosting": false },
      () => {
        expect(liveFooter().map((c) => c.heading)).not.toContain("Solutions");
      }
    );
  });

  it("renders nothing that is not live", () => {
    const { utility, main } = liveNav();
    const hrefs = [
      ...utility,
      ...main,
      ...main.flatMap((i) => i.children ?? []),
      ...liveFooter().flatMap((c) => c.links),
    ].map((l) => l.href);
    // Non-vacuous: /about-us is built, so the list is never empty.
    expect(hrefs).toContain("/about-us");
    expect(hrefs.filter((h) => !isLive(h))).toEqual([]);
  });

  it("no page or component reads NAV or FOOTER directly", () => {
    // The chrome must render liveNav()/liveFooter(). Reading the raw tables
    // is exactly how fourteen dead links reached the live site. The file list
    // comes from the source tree rather than naming the three chrome files,
    // so a new component that reaches for NAV is caught too.
    const files = walkFrom("app", /\.tsx?$/).concat(walkFrom("components", /\.tsx?$/));
    const rel = (f: string) => path.relative(PKG_ROOT, f).split(path.sep).join("/");
    const raw = files.filter((f) => /\bNAV\b|\bFOOTER\b/.test(readFileSync(f, "utf8"))).map(rel);
    expect(raw, `read the raw nav tables instead of liveNav()/liveFooter(): ${raw.join(", ")}`).toEqual([]);
    const live = files.filter((f) => /\blive(?:Nav|Footer)\(\)/.test(readFileSync(f, "utf8")));
    expect(live.length, "TopBar, MainNav and Footer should all call a live helper").toBeGreaterThanOrEqual(3);
  });
});
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `cd self-storage-hosting && npx vitest run tests/links.test.ts`
Expected: FAIL, because `isLive`, `assertLive`, `liveNav` and `liveFooter` do not exist yet.

- [ ] **Step 3: Implement the helpers in `lib/site.ts`**

Append to `self-storage-hosting/lib/site.ts`, after `indexableRoutes`:

```ts
/**
 * True when `href` leads somewhere real: a built page, or a file such as the
 * sitemap. A `#fragment` is ignored here. Whether the anchor exists on the
 * page is checked by tests/source-links.test.ts.
 */
export function isLive(href: string): boolean {
  const path = href.split("#")[0];
  if (NON_ROUTE_PATHS.includes(path)) return true;
  return ROUTES[path]?.built === true;
}

/**
 * Throws when `href` is not live. Components that take a link as a prop
 * (Breadcrumbs, CtaBand) call this while rendering. Every marketing page is
 * prerendered, so a dead link fails `next build` instead of shipping.
 */
export function assertLive(href: string, context: string): void {
  if (!isLive(href)) {
    throw new Error(`${context} links to ${href}, which is not a built route`);
  }
}

/**
 * NAV with every dead link removed. A main item survives only if its own page
 * is built. Its children are filtered. When none remain, the `children` key
 * is dropped entirely, because MainNav renders a dropdown for any `children`
 * value and an empty dropdown is a dead control.
 */
export function liveNav(): { utility: NavLink[]; main: NavItem[] } {
  return {
    utility: NAV.utility.filter((l) => isLive(l.href)),
    main: NAV.main
      .filter((item) => isLive(item.href))
      .map(({ children, ...item }) => {
        const live = (children ?? []).filter((c) => isLive(c.href));
        return live.length > 0 ? { ...item, children: live } : item;
      }),
  };
}

/** FOOTER with every dead link removed, and any column left empty dropped. */
export function liveFooter(): { heading: string; links: NavLink[] }[] {
  return FOOTER.map((col) => ({ ...col, links: col.links.filter((l) => isLive(l.href)) })).filter(
    (col) => col.links.length > 0
  );
}
```

Also update the comment above `ROUTES`. Change the sentence "Nav renders from this table in full so the site's shape is visible, but" to:

```ts
// Nav and footer render through liveNav()/liveFooter(), which drop anything
// not yet built, and
```

The comment then continues unchanged with "Plan 1 only builds three pages -- …".

- [ ] **Step 4: Switch the three chrome components to the live helpers**

**TopBar.** Replace `self-storage-hosting/components/nav/TopBar.tsx` in full. The markup and classes are unchanged except that it reads `liveNav()`. When there are no links it returns `null`, so the page never carries an empty "Utility" landmark:

```tsx
import Link from "next/link";
import { liveNav } from "@/lib/site";
import { CHROME, FOCUS_RING } from "./chrome";

export default function TopBar() {
  const { utility } = liveNav();
  // An empty <nav> is still announced as a landmark. Until a utility page is
  // built there is nothing to put in the bar, so render no bar at all.
  if (utility.length === 0) return null;
  return (
    <div className={CHROME}>
      <nav
        aria-label="Utility"
        className="mx-auto flex h-7 max-w-7xl items-center justify-end px-4 text-xs sm:px-6"
      >
        {utility.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex h-full items-center px-3 hover:underline ${FOCUS_RING}`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
```

**MainNav.** In `self-storage-hosting/components/nav/MainNav.tsx`:
1. Change line 9, `import { NAV } from "@/lib/site";`, to `import { liveNav } from "@/lib/site";`.
2. Add `const { main } = liveNav();` as the first line inside `MainNav()`, above the two `useState` calls.
3. Replace both `NAV.main.map(` with `main.map(`: line 54 (desktop) and line 153 (mobile panel).
4. Change nothing else.

**Footer.** In `self-storage-hosting/components/Footer.tsx`:
1. Change the import to `import { liveFooter, SITE, NON_ROUTE_PATHS } from "@/lib/site";`.
2. Replace `{FOOTER.map((col) => (` with `{liveFooter().map((col) => (`.

- [ ] **Step 5: Run the links tests to verify they pass**

Run: `cd self-storage-hosting && npx vitest run tests/links.test.ts`
Expected: PASS for every case, including the seven existing ones.

- [ ] **Step 6: Move the page helpers into `tests/helpers/pages.ts`**

Create `self-storage-hosting/tests/helpers/pages.ts`:

```ts
import path from "node:path";
import { PKG_ROOT, walkFrom } from "./walk";

const APP_DIR = path.join(PKG_ROOT, "app");

// Maps each routable URL to the page.tsx that serves it. Route groups like
// (marketing) and (auth) do not appear in the URL.
export function pageFiles(): Map<string, string> {
  const pages = new Map<string, string>();
  for (const file of walkFrom("app", /^page\.tsx$/)) {
    const rel = path.relative(APP_DIR, path.dirname(file));
    const segments = rel === "" ? [] : rel.split(path.sep).filter((s) => !s.startsWith("("));
    pages.set(segments.length === 0 ? "/" : "/" + segments.join("/"), file);
  }
  return pages;
}

// The source text of the `pageMeta({ ... })` argument, braces balanced, or null
// if the file does not call it. Scoping an assertion to this slice is the
// whole point. `path:` also appears in every breadcrumb entry, so searching
// the whole file would let a page whose breadcrumb names the right route pass
// with the WRONG canonical in pageMeta. Brace counting is enough because
// pageMeta's arguments are plain strings with no braces in them. A template
// literal containing "{" would need a real parser.
export function pageMetaArg(src: string): string | null {
  const call = src.search(/pageMeta\s*\(\s*\{/);
  if (call === -1) return null;
  const open = src.indexOf("{", call);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}" && --depth === 0) return src.slice(open, i + 1);
  }
  return null;
}
```

Then edit `tests/sitemap-coverage.test.ts`:
1. Delete its local `pageFiles` and `pageMetaArg` functions and the comments directly above them.
2. Add `import { pageFiles, pageMetaArg } from "./helpers/pages";` below the `walkFrom` import.
3. Keep `APP_DIR` and the `walkFrom` import. The layout test still uses both.

- [ ] **Step 7: Extend the pageMeta guards from indexable routes to every built route**

The noindex routes (`/case-studies`, `/user/login`, `/user/register`) are built later in this plan. A noindex page with a wrong canonical, or one that overrides its own `noindex`, is as broken as an indexable one. So the guards move from `indexableRoutes()` to every built route.

1. In `tests/sitemap-coverage.test.ts`, add this helper directly below `UNMANAGED_PAGES`:

```ts
const builtRoutes = () =>
  Object.entries(ROUTES)
    .filter(([, m]) => m.built)
    .map(([r]) => r);
```

2. Replace the whole test `"gives every built, indexable route its own canonical via pageMeta"` (the last `it` in `describe("canonical declarations", ...)`) with the block below. It is that test re-scoped to `builtRoutes()`, followed by three new cases:

```ts
  it("gives every built route its own canonical via pageMeta", () => {
    const pages = pageFiles();
    for (const route of builtRoutes()) {
      const file = pages.get(route);
      expect(file, `${route} is flagged built but has no page.tsx on disk`).toBeDefined();
      const arg = pageMetaArg(readFileSync(file!, "utf8"));
      expect(arg, `${route} must call pageMeta with an object literal`).not.toBeNull();
      // Built from a plain string with the backslash doubled, so the regex
      // engine receives `\s` (whitespace) rather than a literal "s". A single
      // backslash, in either a template literal or a quoted string, collapses
      // to a bare "s". Routes contain only "/", letters and hyphens, so none
      // of them carry a regex metacharacter.
      expect(
        arg!,
        `${route} must declare its own path inside the pageMeta call, not only in a breadcrumb`
      ).toMatch(new RegExp('path:\\s*["\']' + route + '["\']'));
    }
  });

  it("never overrides the route manifest's index decision", () => {
    // pageMeta() already defaults noindex from ROUTES. An explicit override in
    // the wrong direction is the only way a page can contradict the manifest,
    // the sitemap and robots.txt all at once.
    const pages = pageFiles();
    for (const route of builtRoutes()) {
      const arg = pageMetaArg(readFileSync(pages.get(route)!, "utf8"))!;
      const wrong = ROUTES[route].indexable ? /noindex:\s*true/ : /noindex:\s*false/;
      expect(arg, `${route} overrides ROUTES["${route}"].indexable in its pageMeta call`).not.toMatch(
        wrong
      );
    }
  });

  it("gives every built page exactly one h1", () => {
    // Spec 7.6(4). A page's h1 lives in its page.tsx. No shared component in
    // this repo renders one, so the page file is the whole measurement.
    const pages = pageFiles();
    for (const route of builtRoutes()) {
      const count = (readFileSync(pages.get(route)!, "utf8").match(/<h1\b/g) ?? []).length;
      expect(count, `${route} has ${count} <h1> elements`).toBe(1);
    }
  });

  it("gives every built page a unique title and a unique description of at most 155 characters", () => {
    const pages = pageFiles();
    const seen = { title: new Map<string, string>(), description: new Map<string, string>() };
    for (const route of builtRoutes()) {
      const arg = pageMetaArg(readFileSync(pages.get(route)!, "utf8"))!;
      for (const key of ["title", "description"] as const) {
        const m = arg.match(key === "title" ? /title:\s*"([^"]+)"/ : /description:\s*"([^"]+)"/);
        expect(m, `${route}: pageMeta ${key} must be a double-quoted string literal`).not.toBeNull();
        const value = m![1];
        const clash = seen[key].get(value);
        expect(clash, `${route} reuses the ${key} of ${clash}: "${value}"`).toBeUndefined();
        seen[key].set(value, route);
        if (key === "description") {
          expect(value.length, `${route} description is ${value.length} characters`).toBeLessThanOrEqual(155);
        }
      }
    }
    expect(seen.title.size).toBe(builtRoutes().length);
  });
```

- [ ] **Step 8: Write the shared link rule and the source-link guard**

Create `self-storage-hosting/tests/helpers/links.ts`. The source guard (this step) and the rendered-HTML check (Step 9) both import it, so the rule lives in one place:

```ts
import { ROUTES, isLive } from "@/lib/site";

// Which internal paths a link may name.
//
// INTERIM RULE. Task 15 of the remaining-pages plan replaces the body of
// allowedLink with `return isLive(p);`. Pages land one at a time, and the home
// and about-us pages already link /solutions, /demo and both solution pages,
// which later tasks build. Until then a link may name a route that is in
// ROUTES but not yet built. It may never name /resources (Plan 3) or anything
// outside ROUTES.
const isPlan3 = (p: string) => p === "/resources" || p.startsWith("/resources/");

export function allowedLink(p: string): boolean {
  return isLive(p) || (p in ROUTES && !isPlan3(p));
}
```

Create `self-storage-hosting/tests/source-links.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { NAV, FOOTER, NON_ROUTE_PATHS, isLive } from "@/lib/site";
import { PKG_ROOT, walkFrom } from "./helpers/walk";
import { pageFiles } from "./helpers/pages";
import { allowedLink } from "./helpers/links";

// Every literal internal href in app/ and components/, in the three shapes
// this codebase writes them: `href="/x"`, `href={"/x"}` and `href: "/x"` (in
// data arrays and CtaBand props). The capture stops before a query or a
// fragment. This must be a regex literal, not a string: `\s` inside a string
// collapses to a bare "s" (see MEMORY.md -> shell-escaping-collapses-here).
const HREF = /\bhref\s*(?:=\s*\{?\s*|:\s*)["'](\/[^"'?#]*)/g;

const sources = walkFrom("app", /\.tsx?$/)
  .concat(walkFrom("components", /\.tsx?$/))
  .map((f) => ({
    file: path.relative(PKG_ROOT, f).split(path.sep).join("/"),
    text: readFileSync(f, "utf8"),
  }));

function literalHrefs(): { file: string; href: string }[] {
  return sources.flatMap(({ file, text }) =>
    [...text.matchAll(HREF)].map((m) => ({ file, href: m[1] }))
  );
}

describe("source links", () => {
  it("finds the links it is meant to check", () => {
    const hrefs = literalHrefs().map((h) => h.href);
    expect(hrefs.length).toBeGreaterThanOrEqual(10);
    expect(hrefs).toContain("/contact");
  });

  it("every literal internal href points somewhere real", () => {
    const bad = literalHrefs()
      .filter((h) => !allowedLink(h.href))
      .map((h) => `${h.file} -> ${h.href}`);
    expect(bad, `dead or forbidden links: ${bad.join(", ")}`).toEqual([]);
  });

  it("links out over https only", () => {
    const bad = sources
      .filter((s) => /\bhref\s*(?:=\s*\{?\s*|:\s*)["']http:\/\//.test(s.text))
      .map((s) => s.file);
    expect(bad, `plain http:// links in: ${bad.join(", ")}`).toEqual([]);
  });
});

// A literal internal href that carries a #fragment, in the same three shapes
// as HREF. Captures the path and the fragment together.
const FRAGMENT_HREF = /\bhref\s*(?:=\s*\{?\s*|:\s*)["'](\/[^"'?#]*#[^"']+)["']/g;

describe("fragment links", () => {
  it("every #fragment link to a built page has a matching id", () => {
    const pages = pageFiles();
    const literal = sources.flatMap(({ text }) => [...text.matchAll(FRAGMENT_HREF)].map((m) => m[1]));
    const hrefs = [
      ...NAV.utility,
      ...NAV.main,
      ...NAV.main.flatMap((i) => i.children ?? []),
      ...FOOTER.flatMap((c) => c.links),
    ]
      .map((l) => l.href)
      .filter((h) => h.includes("#"))
      .concat(literal);
    const checked: string[] = [];
    const missing: string[] = [];
    for (const href of hrefs) {
      const [route, frag] = href.split("#");
      // An unbuilt route is not rendered (liveNav/liveFooter drop it), so
      // there is no anchor to check yet.
      if (NON_ROUTE_PATHS.includes(route) || !isLive(route)) continue;
      const file = pages.get(route);
      if (!file) {
        missing.push(`${href} (no page.tsx)`);
        continue;
      }
      checked.push(href);
      if (!readFileSync(file, "utf8").includes(`id="${frag}"`)) missing.push(href);
    }
    // /about-us#story, #careers and #news exist from Plan 1.
    expect(checked.length).toBeGreaterThanOrEqual(3);
    expect(missing, `fragment links with no matching id: ${missing.join(", ")}`).toEqual([]);
  });
});
```

- [ ] **Step 9: Write the rendered-HTML check**

The source guards read `.tsx` files. This test reads what `next build` actually wrote, so it also sees links, headings and JSON-LD that come from data rather than literals.

Two facts about that output shape the test:
- Prerendered pages live at `.next/server/app/<route>.html`. `/` is `index.html`, and route groups such as `(marketing)` are dropped, so `/about-us` is `about-us.html` and `/solutions/web-hosting` is `solutions/web-hosting.html`.
- Next inlines the React Server Components payload as `<script>self.__next_f.push(...)</script>` tags, and that payload repeats every text string on the page. A plain-text count over the raw file comes out doubled. So the test strips every `<script>` except JSON-LD before it counts or collects links.

Create `self-storage-hosting/tests/rendered.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { ROUTES } from "@/lib/site";
import { canonicalFor } from "@/lib/seo";
import { assertNoForbiddenTypes } from "@/lib/schema";
import { PKG_ROOT } from "./helpers/walk";
import { allowedLink } from "./helpers/links";

// Checks the HTML that `next build` wrote, not the source that produced it.
// It needs a fresh build, so a plain `npm test` skips it. Run it with:
//   npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts
const RUN = process.env.RENDERED === "1";
const OUT = path.join(PKG_ROOT, ".next", "server", "app");
const built = Object.keys(ROUTES).filter((r) => ROUTES[r].built);

const htmlFile = (route: string) =>
  path.join(OUT, route === "/" ? "index.html" : `${route.slice(1)}.html`);
const read = (route: string) => readFileSync(htmlFile(route), "utf8");

// Drop every <script> except JSON-LD. The React Server Components payload
// repeats each string on the page, so counting without this doubles.
function visible(html: string): string {
  return html.replace(/<script\b(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/g, "");
}

function jsonLd(html: string): unknown[] {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    (m) => JSON.parse(m[1]) as unknown
  );
}

describe.skipIf(!RUN)("rendered HTML", () => {
  it("has a prerendered file for every built route", () => {
    expect(built.length).toBeGreaterThanOrEqual(3);
    const missing = built.filter((r) => !existsSync(htmlFile(r)));
    expect(missing, `no prerendered HTML for: ${missing.join(", ")}`).toEqual([]);
  });

  it.each(built)("%s renders exactly one h1", (r) => {
    const n = (visible(read(r)).match(/<h1\b/g) ?? []).length;
    expect(n, `${r} renders ${n} h1 elements`).toBe(1);
  });

  it("gives every built route its own title and description", () => {
    const seen = new Map<string, string>();
    const clashes: string[] = [];
    for (const r of built) {
      const html = read(r);
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
      const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
      expect(title, `${r} has no <title>`).toBeTruthy();
      expect(desc, `${r} has no meta description`).toBeTruthy();
      for (const [kind, value] of [["title", title], ["description", desc]] as const) {
        const key = `${kind}:${value}`;
        const other = seen.get(key);
        if (other) clashes.push(`${r} reuses the ${kind} of ${other}`);
        else seen.set(key, r);
      }
    }
    expect(clashes).toEqual([]);
  });

  it.each(built)("%s renders its canonical and the right robots rule", (r) => {
    const html = read(r);
    expect(html).toContain(`<link rel="canonical" href="${canonicalFor(r)}"/>`);
    const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? "";
    expect(robots.includes("noindex"), `${r} robots is "${robots}"`).toBe(!ROUTES[r].indexable);
  });

  it("renders only links the link rule allows", () => {
    let checked = 0;
    const bad: string[] = [];
    for (const r of built) {
      for (const m of visible(read(r)).matchAll(/<a\b[^>]*\shref="(\/[^"?#]*)/g)) {
        checked++;
        if (!allowedLink(m[1])) bad.push(`${r} -> ${m[1]}`);
      }
    }
    // Every page carries at least the logo, a nav link and a footer link.
    expect(checked).toBeGreaterThanOrEqual(built.length * 3);
    expect(bad, `rendered links that must not exist: ${bad.join(", ")}`).toEqual([]);
  });

  it.each(built)("%s emits only allowed JSON-LD, with breadcrumbs off the home page", (r) => {
    const blocks = jsonLd(read(r));
    expect(blocks.length, `${r} emits no JSON-LD`).toBeGreaterThan(0);
    for (const b of blocks) assertNoForbiddenTypes(b);
    const crumbs = blocks.some((b) => JSON.stringify(b).includes('"@type":"BreadcrumbList"'));
    expect(crumbs, `${r} BreadcrumbList present`).toBe(r !== "/");
  });
});
```

Later tasks add tests inside this `describe` and reuse `built`, `read`, `visible` and `jsonLd`.

Run it against a fresh build (in Git Bash, not PowerShell, because of the `RENDERED=1` prefix):

Run: `cd self-storage-hosting && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts`
Expected: PASS for `/`, `/about-us` and `/contact`.

Then run `npx vitest run tests/rendered.test.ts` without the variable.
Expected: the suite is reported as skipped, not failed.

- [ ] **Step 10: Run the whole suite and the gates**

Run: `cd self-storage-hosting && npm test && npm run lint && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts`
Expected: all pass, and the build output still lists `/`, `/about-us` and `/contact`.

What the site shows afterwards:
- The desktop nav shows only "About Us" and "Talk to Sales".
- The utility bar is gone until Task 3 builds `/demo`.
- The footer shows the Company column, plus a Legal column holding only "Sitemap".

This is correct: it is exactly what is built.

- [ ] **Step 11: Commit**

```bash
git add self-storage-hosting/lib/site.ts self-storage-hosting/components/nav/TopBar.tsx self-storage-hosting/components/nav/MainNav.tsx self-storage-hosting/components/Footer.tsx self-storage-hosting/tests/helpers/pages.ts self-storage-hosting/tests/helpers/links.ts self-storage-hosting/tests/sitemap-coverage.test.ts self-storage-hosting/tests/links.test.ts self-storage-hosting/tests/source-links.test.ts self-storage-hosting/tests/rendered.test.ts
git commit -m "feat(nav): render only built routes; guard every link in source and in the build"
```

- [ ] **Step 12: Probe every new guard**

For each row:
1. Make the mutation.
2. Run the named test and confirm it FAILS, with a message naming the offender.
3. Restore with `git checkout -- <file>` before the next probe.

| Mutation | Test to run | Must fail naming |
|---|---|---|
| In `components/Footer.tsx`, change `liveFooter().map(` back to `FOOTER.map(` and add `FOOTER` to the import | `tests/links.test.ts` | `components/Footer.tsx` |
| In `app/(marketing)/about-us/page.tsx`, add `<a href="/resources">x</a>` inside the News section | `tests/source-links.test.ts` | `about-us/page.tsx -> /resources` |
| Same file, add `<a href="/nowhere">x</a>` | `tests/source-links.test.ts` | `-> /nowhere` |
| Same file, add `<a href="http://example.com">x</a>` | `tests/source-links.test.ts` | `about-us/page.tsx` |
| Same file, change `id="careers"` to `id="career"` | `tests/source-links.test.ts` | `/about-us#careers` |
| In `app/(marketing)/contact/page.tsx`, add `noindex: true,` inside `pageMeta({ … })` | `tests/sitemap-coverage.test.ts` | `/contact overrides` |
| Same file, add a second `<h1>x</h1>` | `tests/sitemap-coverage.test.ts` | `/contact has 2` |
| Same file, replace the description with the about-us description string | `tests/sitemap-coverage.test.ts` | `reuses the description of /about-us` |
| In `lib/site.ts`, make `liveFooter` return `FOOTER` unfiltered, then `npm run build` | `RENDERED=1 npx vitest run tests/rendered.test.ts` | `-> /resources` |
| In `app/(marketing)/contact/page.tsx`, add `noindex: true,` inside `pageMeta({ … })`, then `npm run build` | `RENDERED=1 npx vitest run tests/rendered.test.ts` | `/contact robots is "noindex, nofollow"` |

The two rendered probes each need a build. After restoring the file, run `npm run build` once more so `.next` matches the committed source.

Finish with `git status --short`. It must show nothing except the pre-existing untracked `.claude/` and `.serena/`.

---

### Task 2: Breadcrumbs, CtaBand, and wider contrast coverage

Spec §4.4 requires breadcrumbs on every page below the top level. Today they exist only as invisible JSON-LD on two pages. This task does three things:

1. **Breadcrumbs component.** A visible, accessible trail that also emits the JSON-LD, so the two can never disagree.
2. **CtaBand component.** The dark call-to-action strip shared by the new pages. Like Breadcrumbs, it throws at build time on a dead link.
3. **Wider contrast coverage.** The contrast guard gains the primary, secondary and accent text colours. Pages already use them, and no row measures them today.

**Files:**
- Create: `self-storage-hosting/components/Breadcrumbs.tsx`
- Create: `self-storage-hosting/components/CtaBand.tsx`
- Create: `self-storage-hosting/tests/breadcrumbs.test.ts`
- Modify: `self-storage-hosting/tests/contrast.test.ts` (the coverage regex and the `PAIRS` table)
- Modify: `self-storage-hosting/tests/content-policy.test.ts` (one new `FORBIDDEN` row)
- Modify: `self-storage-hosting/app/(marketing)/about-us/page.tsx` (breadcrumb, telemetry pillar)
- Modify: `self-storage-hosting/app/(marketing)/contact/page.tsx` (breadcrumb)

**Interfaces:**
- Consumes: `assertLive` and `pageFiles` from Task 1; `breadcrumbSchema` from `lib/schema.ts`; `JsonLd`; `FOCUS_RING` and `FOCUS_RING_LIGHT` from `components/ui/focus.ts`.
- Produces:
  - `components/Breadcrumbs.tsx`:
    - Default export `Breadcrumbs({ crumbs }: { crumbs: Crumb[] })`, plus `export type Crumb = { name: string; path: string }`.
    - It renders its own JSON-LD. **Pages must never call `breadcrumbSchema` themselves.**
    - Place it as the first child of the page's fragment.
  - `components/CtaBand.tsx`:
    - Default export `CtaBand({ heading, text, primary, secondary }: { heading: string; text: string; primary: CtaLink; secondary?: CtaLink })`, plus `export type CtaLink = { href: string; label: string }`.
    - Render it as a direct child of the page fragment. It brings its own `<section>` and gutters.
  - The breadcrumb guard in `tests/breadcrumbs.test.ts`. Every built route except `/` must render `<Breadcrumbs crumbs={[…]} />`, whose first `path` is `"/"` and whose last `path` is the route itself.

- [ ] **Step 1: Write the failing tests**

Create `self-storage-hosting/tests/breadcrumbs.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { ROUTES } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import { pageFiles } from "./helpers/pages";

// The source text of the `crumbs={[ ... ]}` attribute, brackets balanced, or
// null if the file renders no <Breadcrumbs>. It is scoped to this slice for
// the same reason pageMetaArg is: `path:` also appears in pageMeta, so a
// whole-file search would let a page pass on its canonical alone. Crumb names
// are plain strings with no brackets in them, so bracket counting is enough.
function crumbsArg(src: string): string | null {
  const tag = src.indexOf("<Breadcrumbs");
  if (tag === -1) return null;
  const attr = src.indexOf("crumbs=", tag);
  if (attr === -1) return null;
  const open = src.indexOf("[", attr);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]" && --depth === 0) return src.slice(open, i + 1);
  }
  return null;
}

describe("Breadcrumbs", () => {
  // Server components are plain functions. Calling one runs its body,
  // including assertLive, without a DOM, which is all this needs.
  it("throws at render on a crumb that points at an unbuilt route", () => {
    expect(() =>
      Breadcrumbs({
        crumbs: [
          { name: "Home", path: "/" },
          { name: "Nowhere", path: "/nowhere" },
        ],
      })
    ).toThrow('Breadcrumb "Nowhere" links to /nowhere, which is not a built route');
  });

  it("renders for built crumbs", () => {
    expect(() =>
      Breadcrumbs({
        crumbs: [
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ],
      })
    ).not.toThrow();
  });
});

describe("CtaBand", () => {
  it("throws at render when either button points at an unbuilt route", () => {
    expect(() =>
      CtaBand({ heading: "h", text: "t", primary: { href: "/nowhere", label: "Go" } })
    ).toThrow(/\/nowhere, which is not a built route/);
    expect(() =>
      CtaBand({
        heading: "h",
        text: "t",
        primary: { href: "/contact", label: "Go" },
        secondary: { href: "/nowhere", label: "Also" },
      })
    ).toThrow(/\/nowhere, which is not a built route/);
  });
});

describe("breadcrumb coverage", () => {
  it("every built page below the top level renders Breadcrumbs from Home to itself", () => {
    const pages = pageFiles();
    const routes = Object.entries(ROUTES)
      .filter(([r, m]) => m.built && r !== "/")
      .map(([r]) => r);
    expect(routes.length).toBeGreaterThanOrEqual(2);
    for (const route of routes) {
      const file = pages.get(route);
      expect(file, `${route} is flagged built but has no page.tsx`).toBeDefined();
      const src = readFileSync(file!, "utf8");
      const arg = crumbsArg(src);
      expect(arg, `${route} must render <Breadcrumbs crumbs={[...]} />`).not.toBeNull();
      const paths = [...arg!.matchAll(/path:\s*["']([^"']+)["']/g)].map((m) => m[1]);
      expect(paths[0], `${route}: the first crumb must be Home ("/")`).toBe("/");
      expect(paths[paths.length - 1], `${route}: the last crumb must be the page itself`).toBe(route);
      // Breadcrumbs emits the BreadcrumbList itself. A page that also builds
      // one by hand ships two, and they drift.
      expect(src, `${route} builds a BreadcrumbList by hand`).not.toMatch(/breadcrumbSchema\s*\(/);
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd self-storage-hosting && npx vitest run tests/breadcrumbs.test.ts`
Expected: FAIL, because `@/components/Breadcrumbs` and `@/components/CtaBand` do not exist.

- [ ] **Step 3: Create `components/Breadcrumbs.tsx`**

```tsx
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { assertLive } from "@/lib/site";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

export type Crumb = { name: string; path: string };

/**
 * The visible trail and its BreadcrumbList JSON-LD, built from one list so
 * the two can never disagree. Every crumb must be a built route. assertLive
 * throws during prerender, which fails `next build` rather than shipping a
 * trail that leads to a 404.
 */
export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  for (const c of crumbs) assertLive(c.path, `Breadcrumb "${c.name}"`);
  const last = crumbs.length - 1;
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 pt-6 text-sm sm:px-6">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-text-700">
          {crumbs.map((c, i) => (
            <li key={c.path} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === last ? (
                <span aria-current="page" className="font-medium text-text-900">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className={`underline hover:text-text-900 ${FOCUS_RING_LIGHT}`}>
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
```

- [ ] **Step 4: Create `components/CtaBand.tsx`**

```tsx
import Link from "next/link";
import { assertLive } from "@/lib/site";
import { FOCUS_RING } from "@/components/ui/focus";

export type CtaLink = { href: string; label: string };

/**
 * The dark call-to-action strip at the foot of a page. Both targets are
 * checked at render, so a CTA can never point at a page that is not built.
 * The colours are the dark-chrome pairs (text-50 and accent-200 on
 * primary-700, text-950 on accent-50), and the contrast test measures each.
 */
export default function CtaBand({
  heading,
  text,
  primary,
  secondary,
}: {
  heading: string;
  text: string;
  primary: CtaLink;
  secondary?: CtaLink;
}) {
  assertLive(primary.href, `CTA "${primary.label}"`);
  if (secondary) assertLive(secondary.href, `CTA "${secondary.label}"`);
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-primary-700 p-8 text-text-50 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold">{heading}</h2>
          <p className="mt-1 text-accent-200">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={primary.href}
            className={`rounded-full bg-accent-50 px-6 py-3 font-semibold text-text-950 hover:bg-accent-200 ${FOCUS_RING}`}
          >
            {primary.label}
          </Link>
          {secondary && (
            <Link
              href={secondary.href}
              className={`rounded-full border border-text-50 px-6 py-3 text-text-50 hover:bg-primary-800 ${FOCUS_RING}`}
            >
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Retrofit /about-us and /contact to use Breadcrumbs**

In `app/(marketing)/about-us/page.tsx`:
1. Delete the imports on lines 14–15: `import { breadcrumbSchema } from "@/lib/schema";` and `import JsonLd from "@/components/JsonLd";`. `noUnusedLocals` fails the build if they are left behind.
2. Add `import Breadcrumbs from "@/components/Breadcrumbs";`.
3. Replace the `<JsonLd data={breadcrumbSchema([ … ])} />` element at the top of `AboutUsPage`'s fragment with:

```tsx
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about-us" },
        ]}
      />
```

In `app/(marketing)/contact/page.tsx`:
1. Delete the two imports on lines 3–4.
2. Import `Breadcrumbs`.
3. Replace the `<JsonLd … />` element with:

```tsx
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />
```

- [ ] **Step 6: Run the breadcrumb tests**

Run: `cd self-storage-hosting && npx vitest run tests/breadcrumbs.test.ts`
Expected: PASS.

- [ ] **Step 7: Write the failing content-policy row for "real time"**

Spec §13 says to remove "in real time" or qualify it with a measured figure. The about-us pillar "Real-Time Telemetry" slipped through Plan 1.

In `tests/content-policy.test.ts`, add this row to `FORBIDDEN`, directly after the `\bPMS\b` row:

```ts
  [/\breal[- ]time\b/i, 'Spec 13: remove "real time" or qualify it with a measured figure'],
```

Run: `cd self-storage-hosting && npx vitest run tests/content-policy.test.ts`
Expected: FAIL, naming `app/(marketing)/about-us/page.tsx`.

- [ ] **Step 8: Fix the telemetry pillar**

In `app/(marketing)/about-us/page.tsx`, replace the `pillars` entry whose `title` is `"Real-Time Telemetry"` with:

```ts
  {
    icon: BiPulse,
    title: "Device Telemetry",
    desc: "Status for locks, gates, sensors and battery health, with actionable alerts rather than noise.",
  },
```

"Live status" is removed too. It makes the same unmeasured claim in other words.

Run: `cd self-storage-hosting && npx vitest run tests/content-policy.test.ts`
Expected: PASS.

- [ ] **Step 9: Widen the contrast coverage and add the missing rows**

Today the coverage test only scans `text-text-*` and `border-text-*`. The site also colours text from the brand ramps, and none of these tokens has a row:
- `text-primary-700`: icons on about-us, and the about-us CTA.
- `text-secondary-700`: pillar and bridge icons.
- `text-accent-700`: icons.
- `text-accent-800`: the contact form's success status.

In `tests/contrast.test.ts`, inside `"tests every text and border token the source actually uses"`, replace the inner `for` loop with:

```ts
      // Text drawn from the brand ramps is measured too. Borders from those
      // ramps are deliberately not: border-primary-500 divides the mobile
      // menu at 2.42:1 on primary-700, a decorative separator with no WCAG
      // minimum, and hover:border-accent-700 on the home cards is a hover
      // flourish on a card that already has a visible border. text-red-700
      // (form errors) is Tailwind's default palette, not a --color-* token in
      // globals.css, so it cannot be read from here.
      for (const m of text.matchAll(
        /\b(?:text|border)-(text-\d{2,3})\b|\btext-((?:primary|secondary|accent)-\d{2,3})\b/g
      ))
        used.add(m[1] ?? m[2]);
```

Add these rows to `PAIRS`, directly after the `"about-us body copy and borders"` row. The ratios were computed from `globals.css`:

```ts
  // Text and icons drawn from the brand ramps. These tokens were in use on
  // about-us, the home page and the contact form with no row measuring them,
  // because the coverage scan only looked at the text-* ramp.
  // Icons are non-text (WCAG 1.4.11, 3:1) but are held to the text minimum
  // here, because the same tokens are used for text on the new pages.
  ["primary text and links on light", "primary-700", "background-50", 4.5], // 5.79:1
  ["primary icons on their accent tile", "primary-700", "accent-50", 4.5], // 5.84:1
  ["accent icons on light", "accent-700", "background-50", 4.5], // 5.25:1
  ["form success status", "accent-800", "background-50", 4.5], // 9.00:1
  ["secondary icons on their tint", "secondary-700", "secondary-50", 4.5], // 5.57:1
```

The coverage test keys only on the foreground token. So deleting just one of the two `primary-700` rows leaves the token covered, and that probe below deletes both.

Run: `cd self-storage-hosting && npx vitest run tests/contrast.test.ts`
Expected: PASS.

- [ ] **Step 10: Gates and commit**

Run: `cd self-storage-hosting && npm test && npm run lint && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts`
Expected: all pass.

```bash
git add self-storage-hosting/components/Breadcrumbs.tsx self-storage-hosting/components/CtaBand.tsx self-storage-hosting/tests/breadcrumbs.test.ts self-storage-hosting/tests/contrast.test.ts self-storage-hosting/tests/content-policy.test.ts "self-storage-hosting/app/(marketing)/about-us/page.tsx" "self-storage-hosting/app/(marketing)/contact/page.tsx"
git commit -m "feat(ui): visible breadcrumbs and CTA band that refuse dead links; measure brand-ramp text contrast"
```

- [ ] **Step 11: Probe the guards**

| Mutation | Run | Must fail naming |
|---|---|---|
| In `contact/page.tsx`, delete the `<Breadcrumbs … />` element | `npx vitest run tests/breadcrumbs.test.ts` | `/contact must render <Breadcrumbs` |
| In `contact/page.tsx`, change the last crumb's path to `"/about-us"` | `npx vitest run tests/breadcrumbs.test.ts` | `/contact: the last crumb` |
| In `about-us/page.tsx`, add `{ name: "Nowhere", path: "/nowhere" },` as the second crumb | `npm run build` | `Breadcrumb "Nowhere" links to /nowhere` |
| In `contrast.test.ts`, delete the `"form success status"` row | `npx vitest run tests/contrast.test.ts` | `accent-800` |
| In `contrast.test.ts`, delete both `primary-700` rows | `npx vitest run tests/contrast.test.ts` | `primary-700` |

Restore with `git checkout -- <file>` after each probe. Finish with `git status --short`.

---


### Task 3: /demo, and the form variant behind it

Spec §6.6 describes /demo as a qualification form: facility count, current FMS, current gate or access system, and timeline. It also sets expectations on what the demo covers, and it uses the same infrastructure as /contact. The contact form already collects the first three fields. This task:

- adds a validated `timeline` field;
- makes the free-text message optional on a demo request;
- gives `ContactForm` a `variant` prop;
- builds the page;
- repoints the about-us "Book a demo" CTA, which currently goes to /contact, at /demo through `CtaBand`.

**Files:**
- Modify: `self-storage-hosting/lib/contact.ts`
- Modify: `self-storage-hosting/tests/contact.test.ts`
- Modify: `self-storage-hosting/components/ContactForm.tsx`
- Modify: `self-storage-hosting/app/(marketing)/contact/page.tsx`
- Create: `self-storage-hosting/app/(marketing)/demo/page.tsx`
- Modify: `self-storage-hosting/app/(marketing)/about-us/page.tsx` (CTA section only)
- Modify: `self-storage-hosting/lib/site.ts` (`"/demo"` → `built: true`)
- Modify: `self-storage-hosting/tests/sitemap-coverage.test.ts` (the "is actually checking something" array)

**Interfaces:**
- Consumes: `Breadcrumbs` and `CtaBand` (Task 2); `ROUTES` (Task 1).
- Produces:
  - `TIMELINE_OPTIONS`, exported from `lib/contact.ts`: `readonly ["As soon as possible", "Within 3 months", "In 3–6 months", "Just researching"]`.
  - `ContactPayload.timeline?: string`.
  - `ContactForm({ variant = "contact" }: { variant?: "contact" | "demo" })`. The old `subject` prop is removed. The component derives `subject` itself: `"demo"` for the demo variant, `"general"` otherwise.
  - A built `/demo` route. Tasks 4–6 link to it through `CtaBand`.

- [ ] **Step 1: Write the failing validation tests**

In `self-storage-hosting/tests/contact.test.ts`, change the second import line to:

```ts
import { validateContact, interpretResponse, TIMELINE_OPTIONS } from "@/lib/contact";
```

Add this `describe` block directly after the closing `});` of `describe("validateContact", ...)`:

```ts
describe("demo requests", () => {
  const demo = { name: "Dana Reyes", email: "dana@example.com", subject: "demo" };

  // Every case below asserts unconditionally, in the style of the "trims
  // whitespace" case above. A branch that only asserts when r.ok is true
  // passes vacuously when the validator wrongly rejects.
  it("may omit the message, because the qualification fields say what they want", () => {
    expect(validateContact(demo)).toMatchObject({ ok: true, value: { subject: "demo" } });
  });

  it("still requires a message on the general form", () => {
    const r = validateContact({ ...demo, subject: "general" });
    expect(r.ok ? [] : Object.keys(r.errors)).toEqual(["message"]);
  });

  it("still caps a demo message at 5000 characters", () => {
    expect(validateContact({ ...demo, message: "x".repeat(5001) }).ok).toBe(false);
  });

  it("keeps a timeline that is one of the listed options", () => {
    expect(validateContact({ ...demo, timeline: TIMELINE_OPTIONS[1] })).toMatchObject({
      ok: true,
      value: { timeline: "Within 3 months" },
    });
  });

  it("drops a timeline that is not one of the listed options", () => {
    const r = validateContact({ ...demo, timeline: "Tomorrow, or else" });
    expect(r.ok ? r.value.timeline : "rejected instead of dropped").toBeUndefined();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd self-storage-hosting && npx vitest run tests/contact.test.ts`
Expected: FAIL. `TIMELINE_OPTIONS` is not exported, and a demo request with no message is rejected.

- [ ] **Step 3: Implement in `lib/contact.ts`**

1. Add `timeline?: string;` to `ContactPayload`, directly after `gateSystem?: string;`.
2. Directly above `export type ValidationResult`, add:

```ts
// The /demo form's timeline select. A value that is not on this list is
// dropped, not rejected. The select cannot produce one, so it came from a
// script, and turning away a genuine lead over a field nobody typed would be
// the wrong trade.
export const TIMELINE_OPTIONS = [
  "As soon as possible",
  "Within 3 months",
  "In 3–6 months",
  "Just researching",
] as const;

function timeline(v: unknown): string | undefined {
  const s = str(v);
  return (TIMELINE_OPTIONS as readonly string[]).includes(s) ? s : undefined;
}
```

3. In `validateContact`, add this directly after `const message = str(raw.message);`:

```ts
  // A demo request's qualification fields (facility count, FMS, gate system,
  // timeline) already say what the visitor wants, so the free-text box is
  // optional there. The general form has nothing else to go on.
  const isDemo = str(raw.subject) === "demo";
```

4. Replace the two `message` lines:

```ts
  if (!message) errors.message = "Please tell us what you need.";
  else if (message.length > 5000) errors.message = "Please keep your message under 5000 characters.";
```

with:

```ts
  if (!message) {
    if (!isDemo) errors.message = "Please tell us what you need.";
  } else if (message.length > 5000) {
    errors.message = "Please keep your message under 5000 characters.";
  }
```

5. In the returned `value`, add `timeline: timeline(raw.timeline),` directly after `gateSystem: opt(raw.gateSystem),`.

The route needs no change. It builds the email from `Object.entries(result.value)` and skips empty values, so `timeline` is included when present, and an empty demo `message` is left out.

- [ ] **Step 4: Run to verify it passes**

Run: `cd self-storage-hosting && npx vitest run tests/contact.test.ts`
Expected: PASS for every case, including all existing ones.

- [ ] **Step 5: Give `ContactForm` a `variant`**

In `self-storage-hosting/components/ContactForm.tsx`:

1. Change the import from `@/lib/contact` to:

```tsx
import { interpretResponse, TIMELINE_OPTIONS } from "@/lib/contact";
```

2. Replace the signature line `export default function ContactForm({ subject = "general" }: { subject?: string }) {` with:

```tsx
// "demo" adds the timeline question, makes the message optional and changes
// the button label. The subject tells the two apart in the inbox. It is
// derived here, not passed in, so a page cannot send a subject the validator
// does not know.
export default function ContactForm({ variant = "contact" }: { variant?: "contact" | "demo" }) {
  const isDemo = variant === "demo";
  const subject = isDemo ? "demo" : "general";
```

The existing `JSON.stringify({ ...data, subject })` line needs no change.

3. Add the timeline select directly after the closing `</div>` of the `gateSystem` field block, and before the `message` field block:

```tsx
        {isDemo && (
          <div className="sm:col-span-2">
            <label htmlFor="timeline" className="font-medium">
              When are you looking to switch?{" "}
              <span className="font-normal text-text-700">(optional)</span>
            </label>
            <select id="timeline" name="timeline" defaultValue="" className={field}>
              <option value="">Choose one</option>
              {TIMELINE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}
```

4. In the `message` field block, replace the `<label>` element with:

```tsx
          <label htmlFor="message" className="font-medium">
            {isDemo ? (
              <>
                Anything we should know?{" "}
                <span className="font-normal text-text-700">(optional)</span>
              </>
            ) : (
              <>
                What do you need? <span aria-hidden="true">*</span>
              </>
            )}
          </label>
```

and change the textarea's `required` to `required={!isDemo}`.

5. Replace the button's content `{status === "sending" ? "Sending…" : "Send message"}` with:

```tsx
        {status === "sending" ? "Sending…" : isDemo ? "Request a demo" : "Send message"}
```

6. In the same button's `className`, replace `disabled:opacity-60` with `disabled:bg-background-200`. The Global Constraints forbid `opacity-*` on anything that carries text, and the contrast test cannot see a faded colour. The login and register form (Task 14) uses the same disabled style.

In `app/(marketing)/contact/page.tsx`, replace `<ContactForm subject="general" />` with `<ContactForm />`.

- [ ] **Step 6: Create the /demo page**

Create `self-storage-hosting/app/(marketing)/demo/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

export const metadata: Metadata = pageMeta({
  title: "Request a Demo",
  description:
    "See how cloud access control would work with your gate system and facility software. Book a tailored walkthrough.",
  path: "/demo",
});

// What a visitor can expect from the call. Nothing here promises a result,
// a timeframe or a price. It describes what we walk through.
const covers = [
  "How your gate controllers, keypads and smart locks would connect to the cloud, and what stays on site.",
  "How gate codes, move-ins and lockouts would flow from your facility management software to the gate.",
  "What happens at your site when the internet connection drops, and when it comes back.",
  "What moving off an office PC, or off hardware that is no longer supported, would involve for your facilities.",
  "Facility websites, if you want to see those as well.",
];

export default function DemoPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Request a Demo", path: "/demo" },
        ]}
      />
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Request a demo</h1>
          <p className="mt-4 text-lg text-text-800">
            A walkthrough built around your facilities: the gate hardware on site, the facility
            management software you run, and how many locations you manage. The more you tell us
            below, the more of the demo is about your setup rather than a generic one.
          </p>

          <h2 className="mt-10 text-xl font-semibold">What the demo covers</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
            {covers.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>

          <h2 className="mt-10 text-xl font-semibold">What happens next</h2>
          <p className="mt-3 text-text-800">
            We reply within one business day to arrange a time. If part of your setup needs checking
            before we can show it, such as an older controller or a less common FMS, we will tell you
            before the call rather than during it.
          </p>
          <p className="mt-3 text-text-800">
            Only have a question?{" "}
            <Link href="/contact" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
              Send us a message
            </Link>{" "}
            instead.
          </p>
        </div>

        <div>
          <ContactForm variant="demo" />
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 7: Point the about-us CTA at /demo through `CtaBand`**

In `app/(marketing)/about-us/page.tsx`:

1. Replace the whole `{/* CTA */}` section, from the comment through its closing `</section>` and including the "Book a demo" and "Go to homepage" links, with:

```tsx
      <CtaBand
        heading="Ready to modernize your sites?"
        text="Get a tailored plan for your facilities and integrations."
        primary={{ href: "/demo", label: "Book a demo" }}
        secondary={{ href: "/contact", label: "Talk to us" }}
      />
```

2. Add `import CtaBand from "@/components/CtaBand";`.
3. `FOCUS_RING` was used only by that CTA. Change the import to `import { FOCUS_RING_LIGHT } from "@/components/ui/focus";`, or lint fails on the unused name.

"Go to homepage" is dropped deliberately. The logo and the breadcrumb already lead home, and a CTA band's second button should be the second-most-likely next step.

- [ ] **Step 8: Flip the route and update the coverage array**

In `lib/site.ts`, change the `"/demo"` entry to `built: true`.

In `tests/sitemap-coverage.test.ts`, change the "is actually checking something" expectation to:

```ts
    expect(indexableRoutes()).toEqual(["/", "/about-us", "/contact", "/demo"]);
```

- [ ] **Step 9: Gates, then check the rendered HTML**

Run: `cd self-storage-hosting && npm run lint && npm test && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts`
Expected: all pass, and the build lists `/demo` as static.

Run the checks below against the prerendered HTML. It is what a crawler and a screen reader actually receive.

```bash
cd self-storage-hosting
grep -c 'name="timeline"' .next/server/app/demo.html
grep -c 'name="timeline"' .next/server/app/contact.html
grep -o 'Request a demo</button>' .next/server/app/demo.html
grep -o 'aria-label="Breadcrumb"' .next/server/app/demo.html
grep -o '"@type":"BreadcrumbList"' .next/server/app/demo.html
```

Expected:

| Check | Result |
|---|---|
| `demo.html` contains `name="timeline"` | `1` |
| `contact.html` contains `name="timeline"` | `0` |
| button label | one line each |
| breadcrumb `aria-label` | one line each |
| `BreadcrumbList` | one line each |

`grep -c` exits 1 when the count is 0. That is expected for `contact.html`.

- [ ] **Step 10: Commit**

```bash
git add self-storage-hosting/lib/contact.ts self-storage-hosting/tests/contact.test.ts self-storage-hosting/components/ContactForm.tsx "self-storage-hosting/app/(marketing)/contact/page.tsx" "self-storage-hosting/app/(marketing)/demo/page.tsx" "self-storage-hosting/app/(marketing)/about-us/page.tsx" self-storage-hosting/lib/site.ts self-storage-hosting/tests/sitemap-coverage.test.ts
git commit -m "feat(demo): /demo qualification form with a validated timeline; about-us CTA books a demo"
```

- [ ] **Step 11: Probe**

| Mutation | Run | Must fail naming |
|---|---|---|
| In `lib/contact.ts`, change `if (!isDemo) errors.message = …` to `errors.message = …` (always required) | `npx vitest run tests/contact.test.ts` | `may omit the message` |
| In `lib/contact.ts`, make `timeline()` return `s \|\| undefined` | `npx vitest run tests/contact.test.ts` | `drops a timeline` |
| In `lib/site.ts`, set `"/demo"` back to `built: false` | `npx vitest run tests/sitemap-coverage.test.ts` | `/demo` (on disk but not flagged built) |

Restore with `git checkout -- <file>` after each. Finish with `git status --short`.

---

### Task 4: /solutions

Spec D11 and §6.3 call for about 350 words, two cards, and a genuine "which do I need?" comparison rather than a link list. The page is also the breadcrumb parent for both solution pages. That is why it lands before them: `Breadcrumbs` throws on an unbuilt crumb.

Until Tasks 5 and 6 land, the two card links point at unbuilt routes. The interim link rule in `tests/helpers/links.ts` allows exactly this, as it already does for the home page's links.

**Files:**
- Create: `self-storage-hosting/app/(marketing)/solutions/page.tsx`
- Modify: `self-storage-hosting/lib/site.ts` (`"/solutions"` → `built: true`)
- Modify: `self-storage-hosting/tests/sitemap-coverage.test.ts` (array)

**Interfaces:**
- Consumes: `Breadcrumbs` and `CtaBand` (Task 2); a built `/demo` (Task 3).
- Produces: a built `/solutions`. Tasks 5 and 6 name it as their middle breadcrumb, with `{ name: "Solutions", path: "/solutions" }`.

- [ ] **Step 1: Create the page**

Create `self-storage-hosting/app/(marketing)/solutions/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

export const metadata: Metadata = pageMeta({
  title: "Solutions",
  description:
    "Cloud access control hosting and facility websites built for independent self-storage operators. Compare both solutions.",
  path: "/solutions",
});

const solutions = [
  {
    href: "/solutions/access-control-hosting",
    name: "Access control hosting",
    summary:
      "Your gate controllers, keypads and smart locks, run from the cloud instead of from a PC in the office. Gate codes, move-ins and lockouts flow from your facility management software to the gate without a sync program to babysit.",
    bestFor:
      "Operators whose gate software lives on an office PC, or who run gate hardware its manufacturer no longer sells or supports.",
  },
  {
    href: "/solutions/web-hosting",
    name: "Facility websites",
    summary:
      "A website for each facility on your own domain, with an SSL certificate, a CDN, forms that capture leads, and optional online move-ins where your facility management software supports them.",
    bestFor:
      "Operators with a dated site, no site at all, or a site nobody on the team can update.",
  },
];

// A real comparison, one problem per row. The spec forbids a link list here.
const needs = [
  {
    situation: "Your gate software runs on a PC in the office that has to stay switched on",
    fit: "Access control hosting",
  },
  {
    situation: "New gate codes or lockouts are slow to reach the keypad, or sometimes never arrive",
    fit: "Access control hosting",
  },
  {
    situation: "Your website looks dated, or nobody on the team can update it",
    fit: "Facility websites",
  },
  {
    situation:
      "You want tenants to check availability or move in online, where your FMS supports it",
    fit: "Facility websites",
  },
  {
    situation: "You are replacing end-of-life gate hardware and want a new website at the same time",
    fit: "Both",
  },
];

export default function SolutionsPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
        ]}
      />

      <section className="mx-auto max-w-4xl px-4 pt-12 pb-10 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">
          Solutions for independent self-storage operators
        </h1>
        <p className="mt-4 text-lg text-text-800">
          We do two things. We run self-storage access control from the cloud, and we build and host
          facility websites. Each works on its own, and you can start with either. Both are built for
          operators who run a handful of facilities without an IT department.
        </p>
      </section>

      <section
        aria-label="Our solutions"
        className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 md:grid-cols-2"
      >
        {solutions.map((s) => (
          <article
            key={s.href}
            className="flex flex-col rounded-2xl border border-background-200 bg-background-50 p-6 shadow-sm"
          >
            <h2 className="text-2xl font-semibold">{s.name}</h2>
            <p className="mt-3 text-text-800">{s.summary}</p>
            <p className="mt-4 text-text-700">
              <span className="font-semibold text-text-900">Best for: </span>
              {s.bestFor}
            </p>
            <Link
              href={s.href}
              className={`mt-6 inline-flex items-center gap-1 self-start font-semibold text-primary-700 underline ${FOCUS_RING_LIGHT}`}
            >
              Explore {s.name.toLowerCase()}
              <BiRightArrowAlt aria-hidden="true" />
            </Link>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold">Which do I need?</h2>
        <p className="mt-3 text-text-800">
          Start from the problem in front of you today. The other can wait.
        </p>
        <table className="mt-6 w-full border-collapse text-left">
          <caption className="sr-only">Which solution fits each situation</caption>
          <thead>
            <tr className="border-b border-background-300">
              <th scope="col" className="py-3 pr-4 font-semibold">
                If this sounds like you
              </th>
              <th scope="col" className="py-3 font-semibold">
                Start with
              </th>
            </tr>
          </thead>
          <tbody>
            {needs.map((n) => (
              <tr key={n.situation} className="border-b border-background-200 align-top">
                <th scope="row" className="py-3 pr-4 font-normal text-text-800">
                  {n.situation}
                </th>
                <td className="py-3 font-medium text-text-900">{n.fit}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-6 text-text-800">
          You do not have to move both at once. Start with whichever problem costs you more today,
          and add the other when it suits you.
        </p>
      </section>

      <CtaBand
        heading="Not sure which fits?"
        text="Tell us about your facilities and we will point you to the right starting place."
        primary={{ href: "/contact", label: "Talk to us" }}
        secondary={{ href: "/demo", label: "Request a demo" }}
      />
    </>
  );
}
```

- [ ] **Step 2: Flip the route and update the array**

In `lib/site.ts`, set `"/solutions"` to `built: true`.

In `tests/sitemap-coverage.test.ts`, set the expectation to:

```ts
    expect(indexableRoutes()).toEqual(["/", "/about-us", "/contact", "/solutions", "/demo"]);
```

- [ ] **Step 3: Gates and rendered checks**

Run: `cd self-storage-hosting && npm run lint && npm test && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts`
Expected: all pass.

```bash
cd self-storage-hosting
grep -c '<h1' .next/server/app/solutions.html
grep -o '<th scope="row"' .next/server/app/solutions.html | wc -l
grep -o 'href="/solutions"' .next/server/app/about-us.html | head -1
```

Expected results:
- `<h1` count: `1`.
- Row headers: `5`.
- One `href="/solutions"` line. The about-us hero link has pointed at this route since Plan 1, and now it resolves.

- [ ] **Step 4: Commit**

```bash
git add "self-storage-hosting/app/(marketing)/solutions/page.tsx" self-storage-hosting/lib/site.ts self-storage-hosting/tests/sitemap-coverage.test.ts
git commit -m "feat(solutions): /solutions index with a which-do-I-need comparison"
```

- [ ] **Step 5: Probe**

| Mutation | Run | Must fail naming |
|---|---|---|
| In `lib/site.ts`, set `"/solutions"` back to `built: false` | `npm run build` | `Breadcrumb "Solutions" links to /solutions` |
| In `solutions/page.tsx`, change the last crumb's path to `"/"` | `npx vitest run tests/breadcrumbs.test.ts` | `/solutions: the last crumb` |
| In `solutions/page.tsx`, change the pageMeta `path` to `"/solution"` | `npx vitest run tests/sitemap-coverage.test.ts` | `/solutions must declare its own path` |

Restore with `git checkout -- <file>` after each. Finish with `git status --short`.

---


### Task 5: /solutions/access-control-hosting

This is the site's highest-priority page (spec §6.1). Its argument is the office PC. Every third-party fact on it comes from Appendix A.4 or A.3 and carries a link to its source. The cited documents live in one module, `lib/sources.ts`. Pages link them from there instead of restating URLs. /support (Task 7) reuses one of them.

This task also puts the outage wording in one place. Today the home page and /about-us each paraphrase it differently, and the about-us answer ("changes resync automatically") can be read as the open §14 D3 claim about admin changes made during an outage. After this task, every page renders the constant `OUTAGE_BEHAVIOR` from `lib/claims.ts`, and the content-policy guard fails on a paraphrase anywhere else.

Three rulings this page makes against the spec's blueprint, all from Global Constraints:
- **Spec §6.1(1)** puts "works offline" in the hero sub. The hero leaves it out, because the page must never lead with offline operation and the only allowed outage wording is the approved sentence pair.
- **Spec §6.1(4)** makes outage behaviour its own section. Here it is a subsection at the end of "How it works", so no section leads with it. It renders `OUTAGE_BEHAVIOR` and nothing else.
- **Spec §5** gives this page the description "Host your gate controllers, keypads and smart locks in the cloud. Works offline, reconciles the audit trail on reconnect." That sentence uses a banned phrase ("audit trail"), leads with offline operation, and paraphrases the outage wording. The plan uses the description in Step 6's `pageMeta` call instead, which keeps the spec's subject (gate hardware run from the cloud) and drops all three.

**Files:**
- Create: `self-storage-hosting/lib/sources.ts`
- Create: `self-storage-hosting/tests/sources.test.ts`
- Create: `self-storage-hosting/components/SourceLink.tsx`
- Create: `self-storage-hosting/lib/claims.ts`
- Create: `self-storage-hosting/app/(marketing)/solutions/access-control-hosting/page.tsx`
- Modify: `self-storage-hosting/tests/content-policy.test.ts` (one `FORBIDDEN` row, one new test)
- Modify: `self-storage-hosting/app/(marketing)/about-us/page.tsx` (one FAQ answer)
- Modify: `self-storage-hosting/app/(marketing)/page.tsx` (one FAQ answer)
- Modify: `self-storage-hosting/lib/site.ts` (`"/solutions/access-control-hosting"` → `built: true`)
- Modify: `self-storage-hosting/tests/sitemap-coverage.test.ts` (array)

**Interfaces:**
- Consumes: `Breadcrumbs`, `CtaBand` (Task 2); `Faq` and `FaqItem` from `components/Faq.tsx`; `FOCUS_RING_LIGHT` from `components/ui/focus.ts`; a built `/solutions` (Task 4) and `/demo` (Task 3).
- Produces:
  - `lib/sources.ts`: `export type Source = { url: string; title: string; publisher: string; verifiedOn: string }` and `export const SOURCES`. The keys are `storableEasyDigiGate`, `storableEasyGateSync`, `digiGateManual`, `ptiFacts`, `ptiContinuousLearning` and `ptiMigrationManual`.
  - `components/SourceLink.tsx`: default export `SourceLink({ source }: { source: Source })`. It renders `Publisher: Title` as an underlined link on a light surface.
  - `lib/claims.ts`: `export const OUTAGE_BEHAVIOR: string`. Any page that talks about outage behaviour renders this constant.
  - An `id="end-of-life"` section on the page. Task 7 links `/solutions/access-control-hosting#end-of-life`.
  - `tests/sources.test.ts`: every source is https with a valid ISO `verifiedOn`, and at least one page cites it. Task 7 adds citations. It adds no keys.

- [ ] **Step 1: Write the failing source tests**

Create `self-storage-hosting/tests/sources.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { SOURCES } from "@/lib/sources";
import { walkFrom } from "./helpers/walk";

const entries = Object.entries(SOURCES);

describe("cited sources", () => {
  it("has the sources this site cites", () => {
    expect(entries.length).toBeGreaterThanOrEqual(6);
  });

  it.each(entries)("%s is https and carries a real verification date", (_key, s) => {
    expect(new URL(s.url).protocol).toBe("https:");
    expect(s.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    // Round-trips only for a real calendar date: 2026-02-30 comes back as 03-02.
    expect(new Date(`${s.verifiedOn}T00:00:00Z`).toISOString().slice(0, 10)).toBe(s.verifiedOn);
    expect(s.title.trim()).not.toBe("");
    expect(s.publisher.trim()).not.toBe("");
  });

  it("every source is cited by at least one page", () => {
    // A source nobody cites is a URL nobody re-checks. Keys are matched as
    // `SOURCES.<key>` in page source, which is the only way a page reaches them.
    const pages = walkFrom("app", /^page\.tsx$/).map((f) => readFileSync(f, "utf8")).join("\n");
    const uncited = entries.map(([k]) => k).filter((k) => !pages.includes(`SOURCES.${k}`));
    expect(uncited, `sources no page cites: ${uncited.join(", ")}`).toEqual([]);
  });
});
```

Run: `cd self-storage-hosting && npx vitest run tests/sources.test.ts`
Expected: FAIL, because `@/lib/sources` does not exist.

- [ ] **Step 2: Create `lib/sources.ts`**

```ts
// Third-party documents this site cites, each checked by hand on the date
// given. Pages link these instead of restating vendor claims from memory.
// When a URL moves or its content changes, fix it here, re-check every page
// that cites it, and update verifiedOn.
export type Source = { url: string; title: string; publisher: string; verifiedOn: string };

export const SOURCES = {
  storableEasyDigiGate: {
    url: "https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-integrations/digi-gate-integration~7609004328930853160",
    title: "DigiGate integration guide",
    publisher: "Storable",
    verifiedOn: "2026-09-18",
  },
  storableEasyGateSync: {
    url: "https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-troubleshooting/what-should-i-do-if-the-gate-sync-is-not-working~7609015167005715714",
    title: "What to do if the gate sync is not working",
    publisher: "Storable",
    verifiedOn: "2026-09-18",
  },
  digiGateManual: {
    url: "https://www.ptisecurity.com/documents/access-control/controllers/controllers-archive/digigate-archive/DigiGate_Install_Manual_1100_044___Ver2.5__.pdf",
    title: "DigiGate installation manual, archived (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-18",
  },
  ptiFacts: {
    url: "https://www.ptisecurity.com/us/en/facts",
    title: "Facts, including legacy products",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-18",
  },
  ptiContinuousLearning: {
    url: "https://www.ptisecurity.com/us/en/get_support/continuous-learning",
    title: "Continuous learning",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-18",
  },
  ptiMigrationManual: {
    url: "https://www.ptisecurity.com/documents/access-control/controllers/controllers-current/FalconXT%20to%20CloudController%20Migration.pdf",
    title: "FalconXT to CloudController migration manual (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-18",
  },
} satisfies Record<string, Source>;
```

- [ ] **Step 3: Create `components/SourceLink.tsx`**

```tsx
import type { Source } from "@/lib/sources";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

/**
 * A citation link on a light surface, reading "Publisher: Title". The link
 * text names the publisher, so a screen-reader user browsing a list of links
 * still knows whose document each one is. Where the target is a PDF, the
 * title says so.
 */
export default function SourceLink({ source }: { source: Source }) {
  return (
    <a href={source.url} className={`font-medium underline ${FOCUS_RING_LIGHT}`}>
      {source.publisher}: {source.title}
    </a>
  );
}
```

Run: `cd self-storage-hosting && npx vitest run tests/sources.test.ts`
Expected: the first two cases PASS. "every source is cited by at least one page" FAILS and lists all six keys. The page in Step 6 cites all six.

- [ ] **Step 4: Write the failing outage-wording guard**

In `self-storage-hosting/tests/content-policy.test.ts`, add after the `SCHEMA` constant:

```ts
// The one file allowed to state outage behaviour in words. Every page renders
// its OUTAGE_BEHAVIOR constant instead of paraphrasing it.
const CLAIMS = path.join("lib", "claims.ts");
```

Add this row to `FORBIDDEN`, directly after the `\bPMS\b` row:

```ts
  [
    // Spec 14 D3 is open: say nothing about admin changes made during an
    // outage. Paraphrases drift towards exactly that ("changes resync").
    /\bkeeps? enforcing\b|last-known rules|\bresync/i,
    "Outage wording: render OUTAGE_BEHAVIOR from lib/claims.ts instead of paraphrasing it (spec 14 D3)",
    CLAIMS,
  ],
```

Add this test inside `describe("content policy", …)`, after "actually walked real files":

```ts
  it("renders the outage wording from lib/claims.ts", () => {
    // Keeps the row above honest: if no page used the constant, the row
    // would pass just as well on a site that had dropped the answer entirely.
    const users = files
      .filter((f) => f.file !== CLAIMS && /\bOUTAGE_BEHAVIOR\b/.test(f.text))
      .map((f) => f.file);
    // The home page, /about-us and /solutions/access-control-hosting.
    expect(users.length, `OUTAGE_BEHAVIOR is rendered by: ${users.join(", ")}`).toBeGreaterThanOrEqual(3);
  });
```

Run: `cd self-storage-hosting && npx vitest run tests/content-policy.test.ts`
Expected: FAIL twice.
- The new row names `page.tsx` under `(marketing)` (the home page's "keeps enforcing") and `about-us` (its "last-known rules" and "resync"). Paths print with the OS separator.
- The new test reports `OUTAGE_BEHAVIOR is rendered by: ` with nothing after it.

- [ ] **Step 5: Create `lib/claims.ts` and use it on the two existing pages**

Create `self-storage-hosting/lib/claims.ts`:

```ts
// Claims the owner approved word for word. Pages render these constants
// rather than paraphrasing them, and tests/content-policy.test.ts fails on a
// paraphrase anywhere else.
//
// Outage behaviour (spec §6.1(4)). It says nothing about admin changes made
// during an outage, because spec §14 D3 is still open. Never make it the
// opening line of a page or section.
export const OUTAGE_BEHAVIOR =
  "Controllers keep enforcing the last rules they received. Site events recorded during an outage are sent up when the connection returns.";
```

In `app/(marketing)/page.tsx`:
- Add `import { OUTAGE_BEHAVIOR } from "@/lib/claims";` after the existing `@/lib/…` imports.
- In `faqs`, the entry `q: "What happens if the site loses internet?"` currently has `a: "The on-site controller keeps enforcing the access rules it already has, so tenants can still get in and out while the connection is down."`. Replace that `a:` line with `a: OUTAGE_BEHAVIOR,`.

In `app/(marketing)/about-us/page.tsx`:
- Add `import { OUTAGE_BEHAVIOR } from "@/lib/claims";` after the existing `@/lib/…` imports.
- In `faqs`, the entry `q: "What if site internet goes down?"` currently has `a: "Local controllers keep enforcing last-known rules. When the connection returns, changes resync automatically."`. Replace that `a:` line with `a: OUTAGE_BEHAVIOR,`.

Run: `cd self-storage-hosting && npx vitest run tests/content-policy.test.ts`
Expected: the row PASSES. "renders the outage wording from lib/claims.ts" still FAILS, with 2 files. The page in Step 6 makes it 3.

- [ ] **Step 6: Create the page**

Create `self-storage-hosting/app/(marketing)/solutions/access-control-hosting/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { SOURCES } from "@/lib/sources";
import { OUTAGE_BEHAVIOR } from "@/lib/claims";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import Faq, { type FaqItem } from "@/components/Faq";
import SourceLink from "@/components/SourceLink";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

export const metadata: Metadata = pageMeta({
  title: "Cloud Self-Storage Access Control",
  description:
    "Run gate controllers, keypads and smart locks from the cloud instead of an office PC. Built for independent self-storage operators. Request a quote.",
  path: "/solutions/access-control-hosting",
});

// Generic risks of any single desktop computer. None is a claim about a
// specific vendor's product, which is why none carries a citation.
const pcRisks = [
  "The PC or its disk fails, and the gate stops receiving changes until the machine is replaced and set up again.",
  "A Windows update restarts it overnight, and the sync program may not come back on its own.",
  "Someone switches it off, or closes the program, at the end of the day.",
  "Reaching it from home means a VPN or port forwarding, on an internet connection whose IP address can change.",
  "Fixing it means a trip to the site, often after hours.",
  "Backups and restores are nobody's job until the day they are needed.",
  "Its operating system reaches the end of its support life, and the gate software has to move with it.",
];

const flow = [
  {
    name: "Your facility management software",
    desc: "Where tenants, units and gate codes already live.",
  },
  {
    name: "Our cloud service",
    desc: "Receives changes from your FMS and holds each facility's access rules.",
  },
  {
    name: "A small bridge at the site",
    desc: "Keeps a connection to the cloud and passes changes to your controllers.",
  },
  {
    name: "Your gate, keypads and locks",
    desc: "Enforce the rules at the gate and at the unit door.",
  },
];

// The same four categories, and the same capabilities, as /about-us.
const hardware = [
  {
    name: "Gate controllers",
    desc: "Tenant access, schedules and zones, with remote open, lockout and suspend.",
  },
  {
    name: "Keypads and readers",
    desc: "PIN, card or mobile credentials, with time profiles and holiday rules.",
  },
  { name: "Smart locks", desc: "Unit-level control, with a record of every action." },
  {
    name: "Door alarms and sensors",
    desc: "Alarms, motion sensors and battery monitoring, with muted and maintenance modes.",
  },
];

// Spec 14 F is open: these are capability offers, never integration status.
// INSOMNIAC(R) carries its mark once, in the prose above this list, which
// renders first.
const bridges = [
  { from: "Storable Edge", to: "INSOMNIAC CIA" },
  { from: "Storable Edge", to: "DigiGate" },
  { from: "Storable Easy", to: "INSOMNIAC CIA" },
  { from: "Storable Easy", to: "DigiGate" },
];

// Outage behaviour is answered once, under "How it works", not repeated here.
const faqs: FaqItem[] = [
  {
    q: "Do we still need a PC in the office for the gate?",
    a: "Not for access control. The gate software runs in the cloud, and a small bridge at the site talks to your controllers. If your facility management software is a desktop program, it still needs a computer to run on, but the gate no longer depends on that computer staying on.",
  },
  {
    q: "What hardware do you work with?",
    a: "Gate controllers, keypads and readers, smart locks, and door alarms and sensors. Tell us which models you run and we will confirm what connecting them involves.",
  },
  {
    q: "Which facility management software can you connect?",
    a: "We can bridge Storable Edge and Storable Easy to INSOMNIAC CIA and to DigiGate. Running something else? Tell us your setup and we will say plainly whether we can bridge it.",
  },
  {
    q: "Our gate hardware is no longer supported by its manufacturer. Can you help?",
    a: "Tell us what is on site. We will tell you plainly whether we can work with it as it is, and what replacing it would involve if not.",
  },
  {
    q: "How is our data protected?",
    a: "Served over TLS. Ask us for our current security posture.",
  },
  {
    q: "What does it cost?",
    a: "Pricing depends on how many facilities you run and what hardware is on site. Request a quote and we will price it for your portfolio.",
  },
];

export default function AccessControlHostingPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: "Access Control Hosting", path: "/solutions/access-control-hosting" },
        ]}
      />

      {/* 1. Hero: leads with the office PC. Offline operation is never the lead (spec 3.2). */}
      <section className="mx-auto max-w-4xl px-4 pt-12 pb-12 sm:px-6">
        <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
          Cloud-hosted access control for self-storage
        </h1>
        <p className="mt-5 text-lg text-text-800">
          Run your gate controllers, keypads and smart locks from the cloud instead of from a Windows
          PC in the office. Tenants, access levels and lockouts flow from your facility management
          software to the gate, with no office computer in the middle.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className={`rounded-full bg-accent-500 px-6 py-3 font-semibold text-text-950 hover:bg-accent-400 ${FOCUS_RING_LIGHT}`}
          >
            Request a quote
          </Link>
          <Link
            href="/demo"
            className={`rounded-full border border-text-700 px-6 py-3 font-semibold text-text-900 hover:bg-background-100 ${FOCUS_RING_LIGHT}`}
          >
            Request a demo
          </Link>
        </div>
      </section>

      {/* 2. The problem: Appendix A.4 only, paraphrased and cited. The spec
          3.2(2) wording about a 24/7 polling PC and a "System Controller PC"
          failed verification and must not be used. */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">The problem: gate software on an office PC</h2>
        <p className="mt-4 text-text-800">
          In some gate setups, the link between the facility management software and the gate runs
          through a desktop computer. The vendors&apos; own documentation shows how much depends on
          that one machine.
        </p>
        <ul className="mt-6 space-y-4 text-text-800">
          <li>
            Storable Easy&apos;s DigiGate integration uses a gate sync program on the computer, set
            to run a program called digisend.exe after each download. Storable&apos;s guide says
            DigiGate should stay open for communication to work properly.{" "}
            <SourceLink source={SOURCES.storableEasyDigiGate} />
          </li>
          <li>
            Storable Easy&apos;s gate sync troubleshooting guide says the computer must stay turned
            on around the clock for the gate to sync correctly, with a Windows service checking for
            changes every five minutes. <SourceLink source={SOURCES.storableEasyGateSync} />
          </li>
          <li>
            The DigiGate installation manual has the owner supply the office PC, which runs the
            DigiGate software and programs the gate&apos;s system controller over a serial cable. It
            advises turning off the PC&apos;s standby and hibernation. Once programmed, the controller
            can run the gate without the PC switched on, but the PC is still how changes are
            programmed into it. <SourceLink source={SOURCES.digiGateManual} />
          </li>
        </ul>
        <p className="mt-8 text-text-800">
          That is a lot to hang on one desktop computer, and the ways it goes wrong are familiar:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          {pcRisks.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      {/* 3. How it works, ending with outage behaviour. It is a subsection so
          that no section opens with it, and it renders only OUTAGE_BEHAVIOR. */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">How it works</h2>
        <p className="mt-4 max-w-3xl text-text-800">
          The office PC&apos;s job moves to the cloud. A small bridge stays at the site to talk to
          your controllers.
        </p>
        <ol className="mt-8 grid gap-4 md:grid-cols-4">
          {flow.map((s, i) => (
            <li
              key={s.name}
              className="rounded-2xl border border-background-200 bg-background-50 p-5 shadow-sm"
            >
              <span className="text-sm font-semibold text-primary-700">Step {i + 1}</span>
              <h3 className="mt-1 text-lg font-semibold">{s.name}</h3>
              <p className="mt-2 text-text-700">{s.desc}</p>
            </li>
          ))}
        </ol>
        <h3 className="mt-10 text-xl font-semibold">If a site loses its connection</h3>
        <p className="mt-3 max-w-3xl text-text-800">{OUTAGE_BEHAVIOR}</p>
      </section>

      {/* 4. Hardware */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Hardware we work with</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {hardware.map((h) => (
            <li
              key={h.name}
              className="rounded-2xl border border-background-200 bg-background-50 p-5 shadow-sm"
            >
              <h3 className="text-lg font-semibold">{h.name}</h3>
              <p className="mt-2 text-text-700">{h.desc}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-text-800">
          Tell us which models you run and we will confirm what connecting them involves.
        </p>
      </section>

      {/* 5. FMS bridges */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">
          From your facility management software to the gate
        </h2>
        <p className="mt-4 text-text-800">
          Our bridges carry tenants, units, access levels and lockouts from your FMS to your access
          control, including OpenTech Alliance&apos;s INSOMNIAC® CIA and DigiGate.{" "}
          <Link href="/about-us" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            More about our FMS bridges
          </Link>
          .
        </p>
        <ul className="mt-6 space-y-2 text-text-800">
          {bridges.map(({ from, to }) => (
            <li key={`${from}-${to}`}>
              We can bridge {from} to {to}. Tell us your setup.
            </li>
          ))}
        </ul>
        <p className="mt-6 text-text-800">
          Running different software?{" "}
          <Link href="/contact" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            Tell us which FMS you run
          </Link>
          .
        </p>
      </section>

      {/* 6. Security: TLS only until spec 14 B is answered. */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Security</h2>
        <p className="mt-4 text-text-800">
          Served over TLS.{" "}
          <Link href="/contact" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            Ask us for our current security posture
          </Link>
          .
        </p>
      </section>

      {/* 7. End-of-life hardware: Appendix A.3 only. No dates, because PTI
          publishes none. /support links here by its id. */}
      <section id="end-of-life" className="mx-auto max-w-4xl scroll-mt-24 px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Moving off end-of-life gate hardware</h2>
        <p className="mt-4 text-text-800">
          PTI Security Systems lists DigiGate, FalconXT, the StorLogix Cloud Adaptor and StorLogix
          Desktop among its legacy products, which it no longer sells or supports.{" "}
          <SourceLink source={SOURCES.ptiFacts} />
        </p>
        <p className="mt-4 text-text-800">
          CloudController is PTI&apos;s go-forward controller. PTI provides training and a migration
          manual for moving FalconXT sites to it. <SourceLink source={SOURCES.ptiContinuousLearning} />{" "}
          <SourceLink source={SOURCES.ptiMigrationManual} />
        </p>
        <p className="mt-4 text-text-800">
          If you are weighing that move, tell us what is on site. We will say plainly what we can
          bridge, what we cannot, and what each path would involve for your facilities.
        </p>
        <p className="mt-4 text-sm text-text-700">
          We are not affiliated with PTI Security Systems, OpenTech Alliance or Storable. Product
          names are the property of their owners.
        </p>
      </section>

      {/* 8. FAQ: accordion semantics only. Never FAQPage JSON-LD (spec 7.2). */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Frequently asked questions</h2>
        <div className="mt-8">
          <Faq items={faqs} />
        </div>
      </section>

      {/* 9. CTA */}
      <CtaBand
        heading="Get the gate software off the office PC"
        text="Tell us how many facilities you run and what is on site, and we will send a quote."
        primary={{ href: "/contact", label: "Request a quote" }}
        secondary={{ href: "/demo", label: "Request a demo" }}
      />
    </>
  );
}
```

Two things the page deliberately does not do:
- It does not link a `/resources` article, although spec §6.1(6) and (8) ask for links to the compatibility and migration articles. Those articles are Plan 3, and nothing in this plan may link `/resources`. Plan 3 adds the links.
- It gives no date for any PTI product. PTI's own pages give none (Appendix A.3).

- [ ] **Step 7: Flip the route and update the array**

In `lib/site.ts`, set `"/solutions/access-control-hosting"` to `built: true`.

In `tests/sitemap-coverage.test.ts`, set the expectation to:

```ts
    expect(indexableRoutes()).toEqual([
      "/",
      "/about-us",
      "/contact",
      "/solutions",
      "/solutions/access-control-hosting",
      "/demo",
    ]);
```

- [ ] **Step 8: Gates and rendered checks**

Run: `cd self-storage-hosting && npm run lint && npm test && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts`
Expected: all pass. That includes `tests/sources.test.ts` (all six keys are now cited) and "renders the outage wording from lib/claims.ts" (three files).

The rendered test already covers one h1, the canonical, the breadcrumb JSON-LD and the page's links. These greps check what is particular to this page. They match attributes, which appear once each in the HTML. A plain-text grep would count everything twice, because the inline React Server Components payload repeats each string.

```bash
cd self-storage-hosting
F=.next/server/app/solutions/access-control-hosting.html
grep -o 'href="https://www.ptisecurity.com' $F | wc -l
grep -o 'href="https://support.storageunitsoftware.com' $F | wc -l
grep -oi 'audit' $F | wc -l
```

Expected:

| Check | Result |
|---|---|
| PTI links | `4` (the manual, the facts page, continuous learning, the migration manual) |
| Storable links | `2` |
| `audit` | `0` |

Then read the page against the §15 do-not-do list by eye. There must be no date for any third-party product, no "partner" or "certified", and no competitor name in the title or H1.

- [ ] **Step 9: Commit**

```bash
git add self-storage-hosting/lib/sources.ts self-storage-hosting/tests/sources.test.ts self-storage-hosting/components/SourceLink.tsx self-storage-hosting/lib/claims.ts self-storage-hosting/tests/content-policy.test.ts "self-storage-hosting/app/(marketing)/solutions/access-control-hosting/page.tsx" "self-storage-hosting/app/(marketing)/about-us/page.tsx" "self-storage-hosting/app/(marketing)/page.tsx" self-storage-hosting/lib/site.ts self-storage-hosting/tests/sitemap-coverage.test.ts
git commit -m "feat(solutions): access control hosting page, argued from cited vendor documentation"
```

- [ ] **Step 10: Probe**

| Mutation | Run | Must fail naming |
|---|---|---|
| In `lib/sources.ts`, change `ptiFacts.url` to start with `http://` | `npx vitest run tests/sources.test.ts` | `ptiFacts` |
| In the page, delete `<SourceLink source={SOURCES.ptiContinuousLearning} />` | `npx vitest run tests/sources.test.ts` | `ptiContinuousLearning` |
| In the page, change `Served over TLS.` to `Served over TLS, with audit logs.` | `npx vitest run tests/content-policy.test.ts` | `access-control-hosting` |
| In `app/(marketing)/page.tsx`, change `a: OUTAGE_BEHAVIOR,` back to the old string quoted in Step 5 | `npx vitest run tests/content-policy.test.ts` | the home page's `page.tsx` under `(marketing)`, for the outage row. The "renders the outage wording" test also fails, with 2 files |
| In `lib/site.ts`, set the route back to `built: false` | `npm run build` | `Breadcrumb "Access Control Hosting" links to /solutions/access-control-hosting` |

Restore with `git checkout -- <file>` after each. Finish with `git status --short`.

---


### Task 6: /solutions/web-hosting

Spec §6.2 calls this the best winnable money page, because fewer sites compete for facility websites than for access control. The spec fixes the skeleton: hero, then who it's for, what's included, why the basics matter for search, how it connects to the FMS, the FAQ and the CTA.

The page offers only what the site already offers elsewhere: your own domain, SSL, a CDN, forms and lead capture, and optional online move-ins (all from the home page FAQ), plus unit availability (spec §6.2). Where a feature depends on the facility's FMS, the copy says so. The search section explains why those basics matter. It adds no new feature and no performance number.

After this task, every link to `/solutions/*` on the home page, /about-us and /solutions resolves.

One ruling against the spec: §5 gives this page the description "Fast, secure websites for storage facilities…". The plan drops "Fast, secure", because both are unverified outcome claims (Global Constraints). The description names the features instead.

**Files:**
- Create: `self-storage-hosting/app/(marketing)/solutions/web-hosting/page.tsx`
- Modify: `self-storage-hosting/lib/site.ts` (`"/solutions/web-hosting"` → `built: true`)
- Modify: `self-storage-hosting/tests/sitemap-coverage.test.ts` (array)

**Interfaces:**
- Consumes:
  - `Breadcrumbs` and `CtaBand` (Task 2);
  - `Faq` and `FaqItem` from `components/Faq.tsx`;
  - `FOCUS_RING_LIGHT` from `components/ui/focus.ts`;
  - a built `/solutions` (Task 4) and `/solutions/access-control-hosting` (Task 5).
- Produces: a built `/solutions/web-hosting`.

- [ ] **Step 1: Create the page**

Create `self-storage-hosting/app/(marketing)/solutions/web-hosting/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import Faq, { type FaqItem } from "@/components/Faq";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

export const metadata: Metadata = pageMeta({
  title: "Self-Storage Facility Websites",
  description:
    "Websites for self-storage facilities on your own domain, with SSL, a CDN, lead capture forms and optional online move-ins. Request a quote.",
  path: "/solutions/web-hosting",
});

const audience = [
  "You run one facility or a handful, without an IT department.",
  "Your current site looks dated, or nobody on the team can update it.",
  "The hours, prices or unit sizes on your site no longer match the office.",
  "You have no website yet.",
];

// Only what the home page and /solutions already offer, plus unit
// availability (spec 6.2). Where a feature depends on the facility's FMS,
// the copy says so.
const included = [
  {
    name: "Your own domain",
    desc: "The site runs on your domain name, so the name tenants search for leads straight to you.",
  },
  {
    name: "SSL certificate",
    desc: "Every page is served over HTTPS, so browsers do not flag the site as “Not secure”.",
  },
  {
    name: "Content delivery network",
    desc: "Pages are served through a CDN, which delivers them from locations close to each visitor.",
  },
  {
    name: "Forms and lead capture",
    desc: "Inquiry forms that send each lead to your team while the tenant is still deciding.",
  },
  {
    name: "Unit availability",
    desc: "Where your facility management software supports it, the site can show which unit sizes are available.",
  },
  {
    name: "Optional online move-ins",
    desc: "Where your facility management software supports it, tenants can rent a unit online without calling the office.",
  },
];

// Why the included basics help a facility get found. Each point follows from
// a feature above. None is a promise about rankings or speed.
const basics = [
  {
    lead: "Your domain keeps the credit.",
    text: "Every link to your site builds up under your own name, not under a directory or a platform you do not control.",
  },
  {
    lead: "HTTPS is expected.",
    text: "Browsers mark pages without it as “Not secure”. That is the wrong first impression for a business that sells secure storage.",
  },
  {
    lead: "Distance costs time.",
    text: "A CDN serves each page from a location near the visitor, so it has less distance to travel.",
  },
];

const faqs: FaqItem[] = [
  {
    q: "Can we keep our domain name?",
    a: "Yes. The site runs on your own domain.",
  },
  {
    q: "Can tenants rent a unit online?",
    a: "Where your facility management software supports online move-ins, yes. Tell us which FMS you run and we will confirm what it supports.",
  },
  {
    q: "We already have a website. Can you replace it?",
    a: "Yes. Tell us what is on your current site and what you would like to change, and we will scope the new one.",
  },
  {
    q: "Do we need your access control hosting as well?",
    a: "No. Facility websites work on their own. You can add access control hosting later, or not at all.",
  },
  {
    q: "Is the site secure?",
    a: "Every page is served over TLS, with an SSL certificate on your domain. Ask us for our current security posture.",
  },
  {
    q: "What does it cost?",
    a: "Pricing depends on how many facilities you run and what each site needs. Request a quote and we will price it for your portfolio.",
  },
];

export default function WebHostingPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: "Facility Websites", path: "/solutions/web-hosting" },
        ]}
      />

      {/* 1. Hero */}
      <section className="mx-auto max-w-4xl px-4 pt-12 pb-12 sm:px-6">
        <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
          Websites for self-storage facilities
        </h1>
        <p className="mt-5 text-lg text-text-800">
          A website for each facility on your own domain, with an SSL certificate, a CDN, forms
          that capture leads, and optional online move-ins where your facility management software
          supports them.
        </p>
        <Link
          href="/contact"
          className={`mt-8 inline-flex rounded-full bg-accent-500 px-6 py-3 font-semibold text-text-950 hover:bg-accent-400 ${FOCUS_RING_LIGHT}`}
        >
          Request a quote
        </Link>
      </section>

      {/* 2. Who it's for */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Who it is for</h2>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-text-800">
          {audience.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>

      {/* 3. What's included */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">What is included</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {included.map((f) => (
            <li
              key={f.name}
              className="rounded-2xl border border-background-200 bg-background-50 p-5 shadow-sm"
            >
              <h3 className="text-lg font-semibold">{f.name}</h3>
              <p className="mt-2 text-text-700">{f.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. Why the basics matter for search */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Why the basics matter for search</h2>
        <ul className="mt-6 space-y-4 text-text-800">
          {basics.map((b) => (
            <li key={b.lead}>
              <strong className="font-semibold text-text-900">{b.lead}</strong> {b.text}
            </li>
          ))}
        </ul>
      </section>

      {/* 5. How it connects to the FMS */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">
          How it connects to your facility management software
        </h2>
        <p className="mt-4 text-text-800">
          Unit availability and online move-ins come from your facility management software. Which
          of them your site can offer depends on the FMS you run and what it allows.{" "}
          <Link href="/contact" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            Tell us which FMS you run
          </Link>{" "}
          and we will confirm what your site can do with it.
        </p>
        <p className="mt-4 text-text-800">
          Running your gate from an office PC as well?{" "}
          <Link
            href="/solutions/access-control-hosting"
            className={`font-semibold underline ${FOCUS_RING_LIGHT}`}
          >
            See access control hosting
          </Link>
          .
        </p>
      </section>

      {/* 6. FAQ: accordion semantics only. Never FAQPage JSON-LD (spec 7.2). */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Frequently asked questions</h2>
        <div className="mt-8">
          <Faq items={faqs} />
        </div>
      </section>

      {/* 7. CTA */}
      <CtaBand
        heading="Get a quote for your facility website"
        text="Tell us how many facilities you run and what your current site does, and we will send a quote."
        primary={{ href: "/contact", label: "Request a quote" }}
        secondary={{ href: "/solutions/access-control-hosting", label: "Explore access control hosting" }}
      />
    </>
  );
}
```

The page does not link `/resources`, although spec §4.4 asks both solution pages to. That hub belongs to Plan 3, which adds the link.

- [ ] **Step 2: Flip the route and update the array**

In `lib/site.ts`, set `"/solutions/web-hosting"` to `built: true`.

In `tests/sitemap-coverage.test.ts`, set the expectation to:

```ts
    expect(indexableRoutes()).toEqual([
      "/",
      "/about-us",
      "/contact",
      "/solutions",
      "/solutions/access-control-hosting",
      "/solutions/web-hosting",
      "/demo",
    ]);
```

- [ ] **Step 3: Gates and rendered checks**

Run: `cd self-storage-hosting && npm run lint && npm test && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts`
Expected: all pass. The rendered test now covers seven routes.

Then confirm that the chrome now renders the route:

```bash
cd self-storage-hosting
grep -o 'href="/solutions/web-hosting"' .next/server/app/index.html | wc -l
```

Expected: at least `2`, from the home page's own card and the footer's Solutions column. The number is higher if the nav writes its dropdown into the HTML. Before this task the count was `1`, the card alone. `1` after this task means `liveFooter()` is still filtering the route out.

- [ ] **Step 4: Commit**

```bash
git add "self-storage-hosting/app/(marketing)/solutions/web-hosting/page.tsx" self-storage-hosting/lib/site.ts self-storage-hosting/tests/sitemap-coverage.test.ts
git commit -m "feat(solutions): facility websites page"
```

- [ ] **Step 5: Probe**

| Mutation | Run | Must fail naming |
|---|---|---|
| In `lib/site.ts`, set `"/solutions/web-hosting"` back to `built: false` | `npm run build` | `Breadcrumb "Facility Websites" links to /solutions/web-hosting` |
| In the page, replace the description with the home page's description string | `npx vitest run tests/sitemap-coverage.test.ts` | `/solutions/web-hosting reuses the description of /` |
| In the page, change the pageMeta `path` to `"/solutions/webhosting"` | `npx vitest run tests/sitemap-coverage.test.ts` | `/solutions/web-hosting must declare its own path` |

Restore with `git checkout -- <file>` after each. Finish with `git status --short`.

---

### Task 7: /support, and the vendor directory behind it

This task implements spec §6.7 and D8. The page publishes three useful sections:

1. **Which system am I running?** How to find the name of each system on site, plus PTI's own list of legacy products.
2. **Symptoms and likely causes.** Three common gate-sync symptoms, their usual causes, and what to check first.
3. **Vendor support directory.** A link to each vendor's own support desk (Appendix A.2).

D8 also sets a hard rule: the page must not compete for a vendor's own support searches. So **no vendor, product or company name may appear in the page's title, meta description or h1**, and a test enforces it. The body may name vendors, because the directory is useless without them. The section headings stay brand-free as well.

The directory publishes links only. Appendix A.2 found phone numbers that conflict across the vendors' own pages, so the page publishes none, and a test enforces that too. For the same reason, the meta description ends "find each vendor's support desk" rather than the spec §5 wording "find vendor support contacts".

**Files:**
- Create: `self-storage-hosting/lib/vendors.ts`
- Create: `self-storage-hosting/tests/vendors.test.ts`
- Create: `self-storage-hosting/app/(marketing)/support/page.tsx`
- Modify: `self-storage-hosting/lib/site.ts` (`"/support"` → `built: true`)
- Modify: `self-storage-hosting/tests/sitemap-coverage.test.ts` (array)

**Interfaces:**
- Consumes:
  - `Breadcrumbs` and `CtaBand` (Task 2);
  - `SOURCES`, `SourceLink` and the `id="end-of-life"` section (Task 5);
  - `pageFiles` and `pageMetaArg` from `tests/helpers/pages.ts` (Task 1);
  - `PKG_ROOT` from `tests/helpers/walk.ts`.
- Produces: `lib/vendors.ts`, exporting `export type Vendor = { company: string; products: string; url: string; verifiedOn: string }` and `export const VENDORS: Vendor[]`. Task 11's trademark list must cover every name that appears in `VENDORS`.

- [ ] **Step 1: Write the failing vendor tests**

Create `self-storage-hosting/tests/vendors.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { VENDORS } from "@/lib/vendors";
import { PKG_ROOT } from "./helpers/walk";
import { pageFiles, pageMetaArg } from "./helpers/pages";

// Every vendor, company and product name that appears on /support, one word
// each. Spec D8: none may appear in the page's title, description or h1.
const WATCHLIST = [
  "PTI",
  "StorLogix",
  "FalconXT",
  "CloudController",
  "DigiGate",
  "OpenTech",
  "INSOMNIAC",
  "Storable",
  "Sitelink",
  "Janus",
  "Nokē",
  "Noke",
  "DoorKing",
  "DKS",
];

// Lower-cased words. Splitting on anything that is not a letter or a digit
// keeps "Nokē" whole, where a \b-bounded regex would not match it at all.
const words = (s: string) => new Set(s.toLowerCase().split(/[^a-z0-9ē]+/).filter(Boolean));

function supportSource(): string {
  const file = pageFiles().get("/support");
  expect(file, "/support has no page.tsx").toBeDefined();
  return readFileSync(file!, "utf8");
}

describe("vendor directory", () => {
  it("lists every vendor in Appendix A.2", () => {
    expect(VENDORS.length).toBeGreaterThanOrEqual(8);
  });

  it.each(VENDORS.map((v) => [v.products, v] as const))(
    "%s links over https with a real check date",
    (_name, v) => {
      expect(new URL(v.url).protocol).toBe("https:");
      expect(v.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      // Round-trips only for a real calendar date: 2026-02-30 comes back as 03-02.
      expect(new Date(`${v.verifiedOn}T00:00:00Z`).toISOString().slice(0, 10)).toBe(v.verifiedOn);
      expect(v.company.trim()).not.toBe("");
      expect(v.products.trim()).not.toBe("");
    }
  );

  it("has every vendor's company on the watchlist", () => {
    // A vendor added to VENDORS without a watchlist entry could slip its name
    // into the /support title unnoticed.
    const listed = new Set(WATCHLIST.map((w) => w.toLowerCase()));
    const missing = VENDORS.map((v) => v.company.split(" ")[0]).filter(
      (w) => !listed.has(w.toLowerCase())
    );
    expect(missing, `add these to WATCHLIST: ${missing.join(", ")}`).toEqual([]);
  });

  it("publishes no phone numbers", () => {
    const text = readFileSync(path.join(PKG_ROOT, "lib", "vendors.ts"), "utf8") + supportSource();
    const phones = text.match(/\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/g) ?? [];
    expect(phones, `phone numbers found: ${phones.join(", ")}`).toEqual([]);
  });

  it("keeps vendor names out of the /support title, description and h1", () => {
    const src = supportSource();
    const meta = pageMetaArg(src);
    const h1 = src.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1];
    expect(meta, "/support must call pageMeta").not.toBeNull();
    expect(h1, "/support must have an h1").toBeDefined();
    const seen = words(`${meta} ${h1}`);
    const named = WATCHLIST.filter((n) => seen.has(n.toLowerCase()));
    expect(named, `/support names a vendor in its title, description or h1: ${named.join(", ")}`).toEqual([]);
  });
});
```

Run: `cd self-storage-hosting && npx vitest run tests/vendors.test.ts`
Expected: FAIL, because `@/lib/vendors` does not exist.

- [ ] **Step 2: Create `lib/vendors.ts`**

```ts
// Where each vendor's own support lives (Appendix A.2), checked by hand on
// verifiedOn. Links only: the vendors' own pages disagree about phone
// numbers, so none are published. Rendered by /support.
export type Vendor = {
  company: string;
  products: string;
  url: string;
  verifiedOn: string;
};

export const VENDORS: Vendor[] = [
  {
    company: "PTI Security Systems",
    products: "StorLogix, StorLogix Cloud, FalconXT and CloudController",
    url: "https://www.ptisecurity.com/us/en/get_support",
    verifiedOn: "2026-09-18",
  },
  {
    company: "OpenTech Alliance",
    products: "INSOMNIAC® CIA",
    url: "https://opentechalliance.com/support/",
    verifiedOn: "2026-09-18",
  },
  {
    company: "Storable",
    products: "Sitelink by Storable",
    url: "https://support.sitelink.com/",
    verifiedOn: "2026-09-18",
  },
  {
    company: "Storable",
    products: "Storable Edge",
    url: "https://help.storedge.com/",
    verifiedOn: "2026-09-18",
  },
  {
    company: "Storable",
    products: "Storable Easy",
    url: "https://www.storageunitsoftware.com/support/",
    verifiedOn: "2026-09-18",
  },
  {
    company: "Storable",
    products: "Any other Storable product",
    url: "https://www.storable.com/support/",
    verifiedOn: "2026-09-18",
  },
  {
    company: "Janus International",
    products: "Nokē Smart Entry",
    url: "https://www.janusintl.com/knowledge",
    verifiedOn: "2026-09-18",
  },
  {
    company: "DoorKing",
    products: "DKS products",
    url: "https://www.doorking.com/tech-support/",
    verifiedOn: "2026-09-18",
  },
];
```

Two copy rules decide how these strings are written:
- `INSOMNIAC® CIA` carries its mark because this table is the first place /support names that product, and the only one.
- `Sitelink by Storable` is written in full because this row is the page's first mention of Sitelink.

Run: `cd self-storage-hosting && npx vitest run tests/vendors.test.ts`
Expected:
- PASS: the list, https and watchlist cases.
- FAIL with "/support has no page.tsx": "publishes no phone numbers" and "keeps vendor names out…". Step 3 creates the page.

- [ ] **Step 3: Create the page**

Create `self-storage-hosting/app/(marketing)/support/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { SOURCES } from "@/lib/sources";
import { VENDORS } from "@/lib/vendors";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import SourceLink from "@/components/SourceLink";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

// Spec D8: no vendor, product or company name in the title, the description
// or the h1. tests/vendors.test.ts enforces it.
export const metadata: Metadata = pageMeta({
  title: "Support & Diagnostics",
  description:
    "Diagnose gate and access-control sync problems, identify which system you're running, and find each vendor's support desk.",
  path: "/support",
});

const findTheName = [
  "The facility management software (FMS): the name on the program or website your office logs into every day for tenants and billing.",
  "The gate software: the name on the login screen or title bar of the program that manages gate codes. In some setups it runs on a PC in the office.",
  "The keypads and controller: the maker's name is usually printed on the keypad faceplate or on a label inside the controller cabinet.",
];

// Generic causes, true of most FMS-to-gate setups. The one vendor-specific
// fact carries its citation.
const diagnostics = [
  {
    symptom: "New gate codes are not reaching the keypad",
    causes: [
      "The computer that runs the gate sync is switched off, asleep, or restarting after an update.",
      "The sync program or service on that computer has stopped.",
      "The site's internet connection is down, so changes from a cloud-hosted FMS cannot reach it.",
      "The change was never saved in the FMS, so there was nothing new to send.",
    ],
    check:
      "Start with the computer. Is it on, awake and logged in, and is the gate software open? Then check that the sync program is running.",
    cite: true,
  },
  {
    symptom: "Lockouts are not being applied at the gate",
    causes: [
      "The same sync problem as above. If new codes are not arriving, lockouts are not arriving either.",
      "If your FMS applies lockouts automatically after a set number of days past due, that day may not have come yet.",
    ],
    check:
      "Confirm that new codes are arriving first. If they are and lockouts are not, check how your FMS is set to apply lockouts.",
    cite: false,
  },
  {
    symptom: "A tenant's code is not opening the gate",
    causes: [
      "The code was changed in the FMS and the change has not synced yet.",
      "The tenant is outside the access hours set for their account or for the gate.",
      "The tenant is locked out, on purpose or by mistake.",
      "The keypad has lost power or its connection to the controller.",
    ],
    check:
      "Look the tenant up in the FMS and in the gate software. If the two disagree, it is a sync problem, so go back to the first symptom.",
    cite: false,
  },
];

// The link text for each support desk. Four rows belong to Storable, so the
// company name would give four identical links to four places (WCAG 2.4.4).
const host = (url: string) => new URL(url).host.replace(/^www\./, "");

export default function SupportPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Support", path: "/support" },
        ]}
      />

      <section className="mx-auto max-w-4xl px-4 pt-12 pb-10 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Support and diagnostics for self-storage gates</h1>
        <p className="mt-4 text-lg text-text-800">
          Start by working out which systems you run, then match your symptom below. If the fix
          belongs to your vendor, their support desk is listed at the end of the page.
        </p>
        <p className="mt-4 text-text-800">
          Already one of our customers?{" "}
          <Link href="/contact" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            Contact us
          </Link>{" "}
          and we will look into it directly.
        </p>
      </section>

      {/* 1. Identification. No vendor names in this heading (spec D8). */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Which system am I running?</h2>
        <p className="mt-4 text-text-800">
          Most facilities run two systems: the software the office uses for tenants and billing, and
          the access control that runs the gate and keypads. Each has a name you can find in a
          minute.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          {findTheName.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="mt-4 text-text-800">Then find the maker in the vendor directory below.</p>
        <p className="mt-4 text-text-800">
          PTI Security Systems lists DigiGate, FalconXT, the StorLogix Cloud Adaptor and StorLogix
          Desktop among its legacy products, which it no longer sells or supports.{" "}
          <SourceLink source={SOURCES.ptiFacts} /> If one of those is on site, read about{" "}
          <Link
            href="/solutions/access-control-hosting#end-of-life"
            className={`font-semibold underline ${FOCUS_RING_LIGHT}`}
          >
            moving off end-of-life gate hardware
          </Link>
          .
        </p>
      </section>

      {/* 2. Diagnostics */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Symptoms and likely causes</h2>
        {diagnostics.map((d) => (
          <div key={d.symptom} className="mt-8">
            <h3 className="text-xl font-semibold">{d.symptom}</h3>
            <p className="mt-3 font-medium text-text-900">Likely causes</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-text-800">
              {d.causes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="mt-3 text-text-800">
              <span className="font-medium text-text-900">Check first: </span>
              {d.check}
            </p>
            {d.cite && (
              <p className="mt-3 text-text-800">
                If you run Storable Easy, Storable&apos;s troubleshooting guide says the computer must
                stay on around the clock for the gate to sync, and names the Windows service to look
                for. <SourceLink source={SOURCES.storableEasyGateSync} />
              </p>
            )}
          </div>
        ))}
        <p className="mt-10 text-text-800">
          If the sync computer keeps turning out to be the problem, it can be taken out of the chain
          altogether.{" "}
          <Link
            href="/solutions/access-control-hosting"
            className={`font-semibold underline ${FOCUS_RING_LIGHT}`}
          >
            See how cloud-hosted access control works
          </Link>
          .
        </p>
      </section>

      {/* 3. Vendor directory: Appendix A.2 links only, no phone numbers. */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Vendor support directory</h2>
        <p className="mt-4 text-text-800">
          Each vendor runs its own support desk. Their sites carry their current phone numbers and
          hours.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Support desks for self-storage software and gate systems</caption>
            <thead>
              <tr className="border-b border-background-300">
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Product
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Made by
                </th>
                <th scope="col" className="py-3 font-semibold">
                  Support
                </th>
              </tr>
            </thead>
            <tbody>
              {VENDORS.map((v) => (
                <tr key={v.url} className="border-b border-background-200 align-top">
                  <th scope="row" className="py-3 pr-4 font-normal text-text-800">
                    {v.products}
                  </th>
                  <td className="py-3 pr-4 text-text-800">{v.company}</td>
                  <td className="py-3">
                    <a
                      href={v.url}
                      className={`font-medium text-primary-700 underline ${FOCUS_RING_LIGHT}`}
                    >
                      {host(v.url)}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm text-text-700">
          We are not affiliated with any company listed here and cannot act on their behalf. Product
          names are the property of their owners.
        </p>
      </section>

      <CtaBand
        heading="Take the office PC out of the gate sync"
        text="Cloud-hosted access control runs the sync from the cloud instead of from a computer at the site."
        primary={{ href: "/solutions/access-control-hosting", label: "See access control hosting" }}
        secondary={{ href: "/contact", label: "Talk to us" }}
      />
    </>
  );
}
```

Notes for the implementer:
- Every colour pair on this page already has a contrast row. `text-primary-700` on the page background is the "primary text and links on light" row from Task 2.
- Spec §6.7 asks /support to link to article 2. That article belongs to Plan 3, which adds the link.
- "Most facilities run two systems" describes the category. It is not a statistic, so leave it unquantified.

Run: `cd self-storage-hosting && npx vitest run tests/vendors.test.ts tests/sources.test.ts`
Expected: PASS.

- [ ] **Step 4: Flip the route and update the array**

In `lib/site.ts`, set `"/support"` to `built: true`.

In `tests/sitemap-coverage.test.ts`, set the expectation to:

```ts
    expect(indexableRoutes()).toEqual([
      "/",
      "/about-us",
      "/contact",
      "/solutions",
      "/solutions/access-control-hosting",
      "/solutions/web-hosting",
      "/support",
      "/demo",
    ]);
```

- [ ] **Step 5: Gates and rendered checks**

Run: `cd self-storage-hosting && npm run lint && npm test && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts`
Expected: all pass. `tests/source-links.test.ts` now also checks the `/solutions/access-control-hosting#end-of-life` fragment against that page's `id="end-of-life"`.

```bash
cd self-storage-hosting
grep -o '<th scope="row"' .next/server/app/support.html | wc -l
grep -o 'href="/support"' .next/server/app/index.html | wc -l
```

Expected:
- Row headers: `8`, one per vendor.
- `href="/support"` on the home page: at least `2`, from the utility bar and the footer's Resources column. Before this task it was `0`.

- [ ] **Step 6: Commit**

```bash
git add self-storage-hosting/lib/vendors.ts self-storage-hosting/tests/vendors.test.ts "self-storage-hosting/app/(marketing)/support/page.tsx" self-storage-hosting/lib/site.ts self-storage-hosting/tests/sitemap-coverage.test.ts
git commit -m "feat(support): diagnostics page and vendor support directory"
```

- [ ] **Step 7: Probe**

| Mutation | Run | Must fail naming |
|---|---|---|
| In the support page, change the title to `"DigiGate Support & Diagnostics"` | `npx vitest run tests/vendors.test.ts` | `DigiGate` |
| In the support page, change the h1 text to `Sitelink and gate support` | `npx vitest run tests/vendors.test.ts` | `Sitelink` |
| In `lib/vendors.ts`, change the DoorKing `products` to `"DKS products (800) 555-0100"` | `npx vitest run tests/vendors.test.ts` | `(800) 555-0100` |
| In `lib/vendors.ts`, add a row with `company: "Acme Gates"` (any https URL, any valid date) | `npx vitest run tests/vendors.test.ts` | `Acme` |
| In `lib/vendors.ts`, change the Janus URL to `http://www.janusintl.com/knowledge` | `npx vitest run tests/vendors.test.ts` | `Nokē Smart Entry` |
| In the ACH page, change `id="end-of-life"` to `id="eol"` | `npx vitest run tests/source-links.test.ts` | `/solutions/access-control-hosting#end-of-life` |
| In `lib/site.ts`, set `"/support"` back to `built: false` | `npm run build` | `Breadcrumb "Support" links to /support` |

Restore with `git checkout -- <file>` after each. Finish with `git status --short`.

---


### Task 8: /events

This task implements spec §6.8 and §12. The page lists only events that were confirmed on the organizer's own site. Each row links that page and shows the date it was checked there, and each row carries its own `Event` JSON-LD. The data is Appendix A.1, all 13 events, checked 2026-09-18.

The list decays faster than anything else on the site (spec §14 E1), so the page does not depend on a redeploy to stay honest. It regenerates at most once a day (`revalidate = 86400`) and shows only events whose last day has not passed. When every event has passed, it says so. It never shows a past event as upcoming.

Rulings where Appendix A.1 and the spec disagree. The appendix wins in each case, because it was checked against the organizers' own pages after the spec was written:
- **SSAA venue.** Spec §12 says "The Star Grand Gold Coast, Broadbeach". The organizer's page says "The Star Gold Coast", with no street address. The plan uses the organizer's wording.
- **Regional shows.** Spec §12 lists them as "confirmed on SSA's All-Events page only". Appendix A.1 confirmed each one on its own organizer's site, and each row links that site.
- **Organizer names.** Abbreviations such as NVSSA are used wherever the full name was not verified.

Dates are shown US style ("November 10–12, 2026") by `lib/dates.ts`. It is pure string work with no `Intl` and no time zone. An event on 2026-10-07 is on October 7 wherever the server runs, and the prerendered HTML is the same on every machine.

**Files:**
- Create: `self-storage-hosting/tests/events.test.ts`
- Create: `self-storage-hosting/lib/dates.ts`
- Create: `self-storage-hosting/lib/events.ts`
- Modify: `self-storage-hosting/lib/schema.ts` (`eventSchema` and a new `PostalAddressInput` type)
- Modify: `self-storage-hosting/tests/schema.test.ts` (both `eventSchema` calls)
- Create: `self-storage-hosting/app/(marketing)/events/page.tsx`
- Modify: `self-storage-hosting/tests/rendered.test.ts` (one new test)
- Modify: `self-storage-hosting/lib/site.ts` (`"/events"` → `built: true`)
- Modify: `self-storage-hosting/tests/sitemap-coverage.test.ts` (array)

**Interfaces:**
- Consumes:
  - `Breadcrumbs` and `CtaBand` (Task 2);
  - `JsonLd` from `components/JsonLd.tsx`;
  - `pageFiles` (Task 1);
  - `read`, `visible` and `jsonLd` inside `tests/rendered.test.ts` (Task 1).
- Produces:
  - `lib/dates.ts`: `formatDate(iso: string): string` and `formatDateRange(start: string, end?: string): string`. Both throw on a malformed or impossible date. Tasks 10 and 11 use `formatDate` for "last updated" lines.
  - `lib/schema.ts`: `export type PostalAddressInput = { streetAddress?: string; addressLocality: string; addressRegion: string; postalCode?: string; addressCountry: string }`.
  - The new `eventSchema` signature: `eventSchema(e: { name: string; startDate: string; endDate?: string; locationName: string; address: PostalAddressInput; organizer: string; url: string })`.
  - `lib/events.ts`: `IndustryEvent`, `EVENTS` and `upcomingEvents(today: string, events?: readonly IndustryEvent[]): IndustryEvent[]`.

- [ ] **Step 1: Write the failing date and event tests**

Create `self-storage-hosting/tests/events.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { formatDate, formatDateRange } from "@/lib/dates";
import { EVENTS, upcomingEvents, type IndustryEvent } from "@/lib/events";
import { PKG_ROOT } from "./helpers/walk";
import { pageFiles } from "./helpers/pages";

describe("formatDate", () => {
  it("writes a US-style date", () => {
    expect(formatDate("2026-10-07")).toBe("October 7, 2026");
  });

  it("rejects a malformed or impossible date", () => {
    expect(() => formatDate("2026-10-7")).toThrow('Not an ISO calendar date: "2026-10-7"');
    expect(() => formatDate("2026-02-30")).toThrow('Not an ISO calendar date: "2026-02-30"');
  });
});

describe("formatDateRange", () => {
  it.each<[string, string | undefined, string]>([
    ["2026-10-07", undefined, "October 7, 2026"],
    ["2026-10-07", "2026-10-07", "October 7, 2026"],
    ["2026-11-10", "2026-11-12", "November 10–12, 2026"],
    ["2027-03-30", "2027-04-02", "March 30 – April 2, 2027"],
    ["2026-12-30", "2027-01-02", "December 30, 2026 – January 2, 2027"],
  ])("%s to %s reads %s", (start, end, want) => {
    expect(formatDateRange(start, end)).toBe(want);
  });

  it("rejects a range that ends before it starts", () => {
    expect(() => formatDateRange("2026-11-12", "2026-11-10")).toThrow(
      "Range ends before it starts: 2026-11-12 to 2026-11-10"
    );
  });
});

// A complete event with throwaway details, for testing the filter.
const ev = (name: string, startDate: string, endDate?: string): IndustryEvent => ({
  name,
  startDate,
  endDate,
  venue: "Sample Hall",
  address: { addressLocality: "Springfield", addressRegion: "IL", addressCountry: "US" },
  organizer: "Sample Association",
  source: "https://example.org/",
  verifiedOn: "2026-01-01",
});

describe("upcomingEvents", () => {
  const sample = [ev("B", "2026-11-10", "2026-11-12"), ev("A", "2026-10-07")];

  it("keeps an event through its last day, then drops it", () => {
    expect(upcomingEvents("2026-11-12", sample).map((e) => e.name)).toEqual(["B"]);
    expect(upcomingEvents("2026-11-13", sample)).toEqual([]);
  });

  it("keeps a one-day event on its day", () => {
    expect(upcomingEvents("2026-10-07", sample).map((e) => e.name)).toEqual(["A", "B"]);
  });

  it("sorts by start date without reordering its input", () => {
    expect(upcomingEvents("2026-01-01", sample).map((e) => e.name)).toEqual(["A", "B"]);
    expect(sample.map((e) => e.name)).toEqual(["B", "A"]);
  });
});

function eventsText(): string {
  const page = pageFiles().get("/events");
  expect(page, "/events has no page.tsx").toBeDefined();
  return readFileSync(path.join(PKG_ROOT, "lib", "events.ts"), "utf8") + readFileSync(page!, "utf8");
}

describe("EVENTS", () => {
  it("lists every event verified in Appendix A.1", () => {
    expect(EVENTS.length).toBeGreaterThanOrEqual(13);
  });

  it.each(EVENTS.map((e) => [e.name, e] as const))("%s is sourced, dated and placed", (_name, e) => {
    expect(new URL(e.source).protocol).toBe("https:");
    expect(() => formatDateRange(e.startDate, e.endDate)).not.toThrow();
    expect(() => formatDate(e.verifiedOn)).not.toThrow();
    // Checked while it was still ahead. An event checked after it began was
    // never confirmed as upcoming.
    expect(e.verifiedOn <= e.startDate, `${e.name} was checked after it started`).toBe(true);
    for (const v of [e.venue, e.organizer, e.address.addressLocality, e.address.addressRegion]) {
      expect(v.trim()).not.toBe("");
    }
  });

  it("leaves out every event no organizer confirmed (spec 12, 15)", () => {
    // \b keeps "NCSSA" (confirmed) from matching "CSSA" (not confirmed).
    const found = eventsText().match(/\bNeSSA\b|\bFSSA\b|\bCSSA\b|Holiday Gala|Fall Retreat|Executive Summit/g) ?? [];
    expect(found, `unconfirmed events named: ${found.join(", ")}`).toEqual([]);
  });

  it("says nothing unverified about an event's history (spec 12)", () => {
    const found = eventsText().match(/\b(?:renamed|rebranded|discontinued|sold to|acquired by)\b/gi) ?? [];
    expect(found, `unverified history claims: ${found.join(", ")}`).toEqual([]);
  });
});
```

Run: `cd self-storage-hosting && npx vitest run tests/events.test.ts`
Expected: FAIL, because `@/lib/dates` and `@/lib/events` do not exist.

- [ ] **Step 2: Create `lib/dates.ts`**

```ts
// Formats ISO calendar dates (YYYY-MM-DD) for display, US style. This is pure
// string work, with no Intl and no time zone. An event on 2026-10-07 is on
// October 7 wherever the server runs, and Intl output can also vary with the
// Node ICU build, which would make the prerendered HTML differ by machine.
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parts(iso: string): { y: number; m: number; d: number } {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (match) {
    const [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
    // Date.UTC rolls an impossible date over (2026-02-30 becomes March 2), so
    // a mismatch means the calendar has no such day.
    const probe = new Date(Date.UTC(y, m - 1, d));
    if (probe.getUTCFullYear() === y && probe.getUTCMonth() === m - 1 && probe.getUTCDate() === d) {
      return { y, m, d };
    }
  }
  throw new Error(`Not an ISO calendar date: "${iso}"`);
}

/** "2026-10-07" → "October 7, 2026" */
export function formatDate(iso: string): string {
  const { y, m, d } = parts(iso);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/**
 * "2026-11-10", "2026-11-12" → "November 10–12, 2026"
 * "2027-03-30", "2027-04-02" → "March 30 – April 2, 2027"
 * A missing or equal end date gives a single date.
 */
export function formatDateRange(start: string, end?: string): string {
  const a = parts(start);
  if (end === undefined || end === start) return formatDate(start);
  const b = parts(end);
  if (end < start) throw new Error(`Range ends before it starts: ${start} to ${end}`);
  if (a.y !== b.y) return `${formatDate(start)} – ${formatDate(end)}`;
  if (a.m !== b.m) return `${MONTHS[a.m - 1]} ${a.d} – ${MONTHS[b.m - 1]} ${b.d}, ${b.y}`;
  return `${MONTHS[a.m - 1]} ${a.d}–${b.d}, ${a.y}`;
}
```

Run: `cd self-storage-hosting && npx vitest run tests/events.test.ts`
Expected: still FAIL, because `@/lib/events` does not exist. Vitest reports the import error rather than per-test results.

- [ ] **Step 3: Give `eventSchema` a postal address, an organizer and a status**

Google's Event documentation expects the location's address as a `PostalAddress`, not a bare string. It also recommends `organizer` and `eventStatus`.

In `self-storage-hosting/tests/schema.test.ts`, replace the whole test `"emits Event with a place location"` with:

```ts
  it("emits Event with a postal address, an organizer and a status", () => {
    const s = eventSchema({
      name: "Sample Conference",
      startDate: "2026-11-10",
      endDate: "2026-11-12",
      locationName: "Sample Convention Center",
      address: { addressLocality: "Springfield", addressRegion: "IL", addressCountry: "US" },
      organizer: "Sample Association",
      url: "https://example.org/conference",
    });
    expect(s["@type"]).toBe("Event");
    expect(s.eventStatus).toBe("https://schema.org/EventScheduled");
    expect(s.location["@type"]).toBe("Place");
    expect(s.location.address).toMatchObject({ "@type": "PostalAddress", addressLocality: "Springfield" });
    expect(s.organizer).toEqual({ "@type": "Organization", name: "Sample Association" });
  });
```

In the same file, in `"passes every schema this site actually emits"`, replace the `eventSchema({ … })` argument with:

```ts
        eventSchema({
          name: "n",
          startDate: "2026-11-10",
          locationName: "l",
          address: { addressLocality: "c", addressRegion: "r", addressCountry: "US" },
          organizer: "o",
          url: "https://example.org/",
        })
```

Run: `cd self-storage-hosting && npx vitest run tests/schema.test.ts`
Expected: FAIL. `eventStatus` is undefined and `location.address` is a string.

In `self-storage-hosting/lib/schema.ts`, replace the whole `eventSchema` function with:

```ts
export type PostalAddressInput = {
  streetAddress?: string;
  addressLocality: string;
  addressRegion: string;
  postalCode?: string;
  addressCountry: string;
};

export function eventSchema(e: {
  name: string;
  startDate: string;
  endDate?: string;
  locationName: string;
  address: PostalAddressInput;
  organizer: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.name,
    startDate: e.startDate,
    endDate: e.endDate ?? e.startDate,
    // Every listed event was confirmed on its organizer's own page.
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: e.locationName,
      address: { "@type": "PostalAddress", ...e.address },
    },
    organizer: { "@type": "Organization", name: e.organizer },
    url: e.url,
  };
}
```

Run: `cd self-storage-hosting && npx vitest run tests/schema.test.ts`
Expected: PASS.

- [ ] **Step 4: Create `lib/events.ts`**

```ts
import type { PostalAddressInput } from "./schema";

// Self-storage industry events, each confirmed on its organizer's own page on
// verifiedOn (Appendix A.1). Only confirmed events belong here. Dates are
// calendar dates at the venue.
//
// Review every quarter (spec 14 E1): re-check each source, update verifiedOn,
// and add newly announced events. /events hides an event once its last day
// has passed, so an outdated row disappears on its own, but new events only
// appear when someone adds them.
export type IndustryEvent = {
  name: string;
  startDate: string;
  endDate?: string;
  /** Times or sub-schedules exactly as the organizer states them. */
  detail?: string;
  venue: string;
  address: PostalAddressInput;
  organizer: string;
  /** The organizer's own page for the event. */
  source: string;
  verifiedOn: string;
};

export const EVENTS: IndustryEvent[] = [
  {
    name: "OHSSA Networking Event",
    startDate: "2026-09-23",
    detail: "Evening, 6–8 pm",
    venue: "Pin Mechanical Company",
    address: {
      streetAddress: "4117 Worth Avenue",
      addressLocality: "Columbus",
      addressRegion: "OH",
      addressCountry: "US",
    },
    organizer: "OHSSA",
    source: "https://www.ohiossa.org/Events/Upcoming-Events",
    verifiedOn: "2026-09-18",
  },
  {
    name: "NVSSA Education Day",
    startDate: "2026-10-06",
    detail: "8:30 am – 3:00 pm",
    venue: "Peppermill",
    address: { addressLocality: "Reno", addressRegion: "NV", addressCountry: "US" },
    organizer: "NVSSA",
    source: "https://www.nvssa.org/Events/Upcoming-Events",
    verifiedOn: "2026-09-18",
  },
  {
    name: "VASSA Seminar",
    startDate: "2026-10-07",
    venue: "The Westin Richmond",
    address: {
      streetAddress: "6631 West Broad Street",
      addressLocality: "Richmond",
      addressRegion: "VA",
      postalCode: "23230",
      addressCountry: "US",
    },
    organizer: "VASSA",
    source: "https://www.virginiassa.org/Events/Upcoming-Events",
    verifiedOn: "2026-09-18",
  },
  {
    name: "IL-SSA Fall Summit",
    startDate: "2026-10-07",
    venue: "I-Hotel & Illinois Conference Center",
    address: {
      streetAddress: "1900 S First St",
      addressLocality: "Champaign",
      addressRegion: "IL",
      postalCode: "61820",
      addressCountry: "US",
    },
    organizer: "IL-SSA",
    source: "https://www.ilselfstorage.org/Events/Upcoming-Events",
    verifiedOn: "2026-09-18",
  },
  {
    name: "Southeastern Self Storage Conference & Trade Show",
    startDate: "2026-10-25",
    endDate: "2026-10-27",
    venue: "Hyatt Regency Greenville",
    address: {
      streetAddress: "220 N Main Street",
      addressLocality: "Greenville",
      addressRegion: "SC",
      postalCode: "29601",
      addressCountry: "US",
    },
    organizer: "GASSA and SCSSA",
    source: "https://gascstorageconference.com/",
    verifiedOn: "2026-09-18",
  },
  {
    name: "NCSSA Convention & Trade Show",
    startDate: "2026-11-09",
    endDate: "2026-11-10",
    venue: "Grandover Resort and Spa",
    address: {
      streetAddress: "1000 Club Road",
      addressLocality: "Greensboro",
      addressRegion: "NC",
      postalCode: "27407",
      addressCountry: "US",
    },
    organizer: "NCSSA",
    source: "https://www.ncssaonline.org/aws/NCSSA/pt/sp/conference",
    verifiedOn: "2026-09-18",
  },
  {
    name: "Self Storage Week 2026",
    startDate: "2026-11-10",
    endDate: "2026-11-12",
    detail: "Trade show November 11–12",
    venue: "The Star Gold Coast",
    address: { addressLocality: "Gold Coast", addressRegion: "QLD", addressCountry: "AU" },
    organizer: "SSAA",
    source: "https://selfstorage.org.au/convention26/",
    verifiedOn: "2026-09-18",
  },
  {
    name: "SSAM Conference & Trade Show",
    startDate: "2026-11-16",
    endDate: "2026-11-17",
    venue: "MGM Grand Detroit",
    address: { addressLocality: "Detroit", addressRegion: "MI", addressCountry: "US" },
    organizer: "SSAM",
    source: "https://www.selfstoragemichigan.org/Events/SSAM-Annual-Conference-Trade-Show",
    verifiedOn: "2026-09-18",
  },
  {
    name: "2027 Executive Ski Workshop",
    startDate: "2027-01-11",
    endDate: "2027-01-14",
    venue: "Telluride Conference Center",
    address: { addressLocality: "Telluride", addressRegion: "CO", addressCountry: "US" },
    organizer: "Self Storage Association (SSA)",
    source: "https://www.selfstorage.org/Events-Education/Events/Executive-Ski-Workshop",
    verifiedOn: "2026-09-18",
  },
  {
    name: "Inside Self-Storage World Expo",
    startDate: "2027-03-30",
    endDate: "2027-04-02",
    detail: "Education March 30 – April 2; exhibits March 31 – April 1",
    venue: "Caesars Forum Conference Center",
    address: {
      streetAddress: "3911 Koval Lane",
      addressLocality: "Las Vegas",
      addressRegion: "NV",
      postalCode: "89109",
      addressCountry: "US",
    },
    organizer: "Inside Self-Storage (Informa Markets)",
    source: "https://www.issworldexpo.com/",
    verifiedOn: "2026-09-18",
  },
  {
    name: "ISC West",
    startDate: "2027-04-05",
    endDate: "2027-04-09",
    detail: "SIA Education@ISC April 5–8; exhibit hall April 7–9",
    venue: "The Venetian Expo",
    address: {
      streetAddress: "201 Sands Ave",
      addressLocality: "Las Vegas",
      addressRegion: "NV",
      postalCode: "89169",
      addressCountry: "US",
    },
    organizer: "RX",
    source: "https://www.discoverisc.com/west/en-us/explore/hours-and-location.html",
    verifiedOn: "2026-09-18",
  },
  {
    name: "2027 SSA Spring Conference & Trade Show",
    startDate: "2027-04-28",
    endDate: "2027-04-30",
    venue: "Savannah Convention Center",
    address: { addressLocality: "Savannah", addressRegion: "GA", addressCountry: "US" },
    organizer: "Self Storage Association (SSA)",
    // SSA's calendar is the only place SSA states this event.
    source: "https://www.selfstorage.org/Events-Education/All-Events",
    verifiedOn: "2026-09-18",
  },
  {
    name: "2027 SSA Fall Conference & Trade Show",
    startDate: "2027-09-07",
    endDate: "2027-09-10",
    venue: "Aria Resort & Casino",
    address: { addressLocality: "Las Vegas", addressRegion: "NV", addressCountry: "US" },
    organizer: "Self Storage Association (SSA)",
    source: "https://www.selfstorage.org/Events-Education/Events/National-Fall-Conference",
    verifiedOn: "2026-09-18",
  },
];

/**
 * Events whose last day is `today` (YYYY-MM-DD) or later, earliest first.
 * Returns a new array and leaves `events` as it was.
 */
export function upcomingEvents(today: string, events: readonly IndustryEvent[] = EVENTS): IndustryEvent[] {
  return events
    .filter((e) => (e.endDate ?? e.startDate) >= today)
    .sort((a, b) => (a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0));
}
```

Run: `cd self-storage-hosting && npx vitest run tests/events.test.ts`
Expected:
- PASS: every `formatDate`, `formatDateRange`, `upcomingEvents` and per-event case.
- FAIL with "/events has no page.tsx": the two cases that read the page source. Step 5 creates the page.

- [ ] **Step 5: Create the page**

Create `self-storage-hosting/app/(marketing)/events/page.tsx`:

```tsx
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { eventSchema } from "@/lib/schema";
import { upcomingEvents, type IndustryEvent } from "@/lib/events";
import { formatDate, formatDateRange } from "@/lib/dates";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

// Regenerated at most once a day, so an event leaves the page within a day of
// ending, with no redeploy. Next reads this value statically: keep it a
// literal number, not an expression.
export const revalidate = 86400;

export const metadata: Metadata = pageMeta({
  title: "Industry Events",
  description:
    "Confirmed self-storage industry conferences and trade shows, each verified against the organizer's own listing.",
  path: "/events",
});

const host = (url: string) => new URL(url).host.replace(/^www\./, "");

function place(e: IndustryEvent): string {
  const { addressLocality, addressRegion, addressCountry } = e.address;
  const country = addressCountry === "US" ? "" : addressCountry === "AU" ? ", Australia" : `, ${addressCountry}`;
  return `${e.venue}, ${addressLocality}, ${addressRegion}${country}`;
}

export default function EventsPage() {
  // Today's date in UTC. An event drops off at the first regeneration after
  // its last day has ended in UTC.
  const events = upcomingEvents(new Date().toISOString().slice(0, 10));

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Events", path: "/events" },
        ]}
      />

      <section className="mx-auto max-w-4xl px-4 pt-12 pb-10 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Self-storage industry events</h1>
        <p className="mt-4 text-lg text-text-800">
          Conferences, trade shows and state association meetings for self-storage operators. Each
          listing links to the organizer&apos;s own page and shows the date we last checked it there.
        </p>
        <p className="mt-4 text-text-800">
          Organizers sometimes change dates and venues. Confirm on the organizer&apos;s page before
          you book travel.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Upcoming events</h2>
        {events.length === 0 ? (
          <p className="mt-6 text-text-800">No confirmed events are listed right now.</p>
        ) : (
          <ol className="mt-8 space-y-4">
            {events.map((e) => (
              <li
                key={`${e.name}-${e.startDate}`}
                className="rounded-2xl border border-background-200 bg-background-50 p-5 shadow-sm"
              >
                <JsonLd
                  data={eventSchema({
                    name: e.name,
                    startDate: e.startDate,
                    endDate: e.endDate,
                    locationName: e.venue,
                    address: e.address,
                    organizer: e.organizer,
                    url: e.source,
                  })}
                />
                <h3 className="text-lg font-semibold">{e.name}</h3>
                <p className="mt-1 font-medium text-text-900">{formatDateRange(e.startDate, e.endDate)}</p>
                {e.detail && <p className="text-text-700">{e.detail}</p>}
                <p className="mt-2 text-text-800">{place(e)}</p>
                <p className="text-text-800">Organizer: {e.organizer}</p>
                <p className="mt-3 text-sm text-text-700">
                  Source:{" "}
                  <a href={e.source} className={`font-medium underline ${FOCUS_RING_LIGHT}`}>
                    {host(e.source)}
                  </a>
                  . Checked {formatDate(e.verifiedOn)}.
                </p>
              </li>
            ))}
          </ol>
        )}
        <p className="mt-8 text-sm text-text-700">
          We are not affiliated with any organizer listed here. Event names belong to their
          organizers.
        </p>
      </section>

      <CtaBand
        heading="Know of an event we should list?"
        text="Send us the organizer's page and we will check it before it goes up."
        primary={{ href: "/contact", label: "Tell us about it" }}
        secondary={{ href: "/solutions", label: "See our solutions" }}
      />
    </>
  );
}
```

Notes for the implementer:
- Each row's link text is the organizer's host name. Three rows share `selfstorage.org`. The link still makes sense in context: it sits in the list item under that event's own heading, which is what WCAG 2.4.4 asks for.
- The page does not claim that we attend any of these events. Do not add "See you there" or similar copy.
- Google's Event markup must match what the page shows. Each row renders its JSON-LD and its visible dates from the same object, and the rendered test in Step 6 checks that they agree.

Run: `cd self-storage-hosting && npx vitest run tests/events.test.ts`
Expected: PASS.

- [ ] **Step 6: Check the rendered events against their markup**

In `self-storage-hosting/tests/rendered.test.ts`:
1. Add `import { formatDateRange } from "@/lib/dates";` below the `@/lib/schema` import.
2. Add this test inside `describe.skipIf(!RUN)("rendered HTML", …)`, after the JSON-LD test:

```ts
  it("shows a visible row for every Event it marks up on /events", () => {
    const html = read("/events");
    const shown = visible(html);
    const events = jsonLd(html).filter(
      (b): b is { name: string; url: string; startDate: string; endDate: string } =>
        (b as { "@type"?: unknown })["@type"] === "Event"
    );
    // When this fails, every listed event has passed. It is not a code bug:
    // lib/events.ts is due its quarterly review (spec 14 E1).
    expect(events.length, "/events rendered no upcoming events; review lib/events.ts").toBeGreaterThan(0);
    for (const e of events) {
      expect(shown, `${e.name}: no visible link to ${e.url}`).toContain(`href="${e.url}"`);
      expect(shown, `${e.name}: the visible dates do not match the markup`).toContain(
        formatDateRange(e.startDate, e.endDate)
      );
    }
  });
```

This check stays green through the last listed event, on 2027-09-10. After that it fails until someone reviews the list. It runs only with `RENDERED=1`, so it never blocks a Netlify build.

- [ ] **Step 7: Flip the route and update the array**

In `lib/site.ts`, set `"/events"` to `built: true`.

In `tests/sitemap-coverage.test.ts`, set the expectation to:

```ts
    expect(indexableRoutes()).toEqual([
      "/",
      "/about-us",
      "/contact",
      "/solutions",
      "/solutions/access-control-hosting",
      "/solutions/web-hosting",
      "/events",
      "/support",
      "/demo",
    ]);
```

- [ ] **Step 8: Gates and rendered checks**

Run: `cd self-storage-hosting && npm run lint && npm test && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts`
Expected: all pass, including the new /events check.

Then confirm that the build registered the daily regeneration:

```bash
cd self-storage-hosting
node -e "console.log(require('./.next/prerender-manifest.json').routes['/events'].initialRevalidateSeconds)"
grep -o 'href="/events"' .next/server/app/index.html | wc -l
```

Expected:
- `86400`. `false` means the `revalidate` export is missing or is not a literal.
- At least `1`: the footer's Resources column now shows Events. Before this task the count was `0`.

- [ ] **Step 9: Commit**

```bash
git add self-storage-hosting/tests/events.test.ts self-storage-hosting/lib/dates.ts self-storage-hosting/lib/events.ts self-storage-hosting/lib/schema.ts self-storage-hosting/tests/schema.test.ts "self-storage-hosting/app/(marketing)/events/page.tsx" self-storage-hosting/tests/rendered.test.ts self-storage-hosting/lib/site.ts self-storage-hosting/tests/sitemap-coverage.test.ts
git commit -m "feat(events): verified industry events with per-row sources, regenerated daily"
```

- [ ] **Step 10: Probe**

| Mutation | Run | Must fail naming |
|---|---|---|
| In `lib/events.ts`, change the VASSA `startDate` to `"2026-02-30"` | `npx vitest run tests/events.test.ts` | `VASSA Seminar` |
| In `lib/events.ts`, change the NCSSA `verifiedOn` to `"2026-11-11"` | `npx vitest run tests/events.test.ts` | `NCSSA Convention & Trade Show was checked after it started` |
| In `lib/events.ts`, add a comment `// FSSA Holiday Gala` above `EVENTS` | `npx vitest run tests/events.test.ts` | `FSSA` |
| In the page, add `<p>Formerly known as X, renamed in 2025.</p>` under the h1 | `npx vitest run tests/events.test.ts` | `renamed` |
| In the page, change the visible `formatDateRange(e.startDate, e.endDate)` (the one inside the `<p>`, not the JSON-LD) to `formatDateRange(e.startDate)`, then `npm run build` | `RENDERED=1 npx vitest run tests/rendered.test.ts` | the first multi-day event's name, then `the visible dates do not match the markup` |
| In the page, change `export const revalidate = 86400;` to `export const revalidate = 60 * 60 * 24;`, then `npm run build` | the `node -e` line from Step 8 | prints something other than `86400`, or the build fails because the value is not statically analyzable |

After the rendered probes, restore the file and run `npm run build` again so `.next` matches the committed source. Restore with `git checkout -- <file>` after each. Finish with `git status --short`.

---

### Task 9: /case-studies

Spec §6.9 and D14. There are no case studies yet, and the page says so plainly. It explains what we will measure when an operator moves their gate off the office PC, and it invites operators to be a first reference. The spec's three measures are: truck rolls avoided, sync failure rate, and time to provision a new site.

The route is `noindex` and out of the sitemap. `ROUTES` already says `indexable: false`, `pageMeta()` turns that into `noindex, nofollow`, and `robots.ts` already disallows the path. Nothing links to the page yet. It exists so the owner can send the link to an operator.

A test holds the page to D2: its source publishes no numbers, no quotes and no images. Any number on this page would have to be a customer result, and there are none.

**Files:**
- Create: `self-storage-hosting/tests/case-studies.test.ts`
- Create: `self-storage-hosting/app/(marketing)/case-studies/page.tsx`
- Modify: `self-storage-hosting/lib/site.ts` (`"/case-studies"` → `built: true`)

The sitemap-coverage array does not change, because the route is not indexable.

**Interfaces:**
- Consumes: `Breadcrumbs` and `CtaBand` (Task 2); `pageFiles` (Task 1); a built `/solutions/access-control-hosting` (Task 5).
- Produces: a built, noindexed `/case-studies`.

- [ ] **Step 1: Write the failing test**

Create `self-storage-hosting/tests/case-studies.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { ROUTES } from "@/lib/site";
import { pageFiles } from "./helpers/pages";

function source(): string {
  const file = pageFiles().get("/case-studies");
  expect(file, "/case-studies has no page.tsx").toBeDefined();
  return readFileSync(file!, "utf8");
}

describe("/case-studies", () => {
  it("stays out of the index", () => {
    expect(ROUTES["/case-studies"].indexable).toBe(false);
  });

  it("publishes no numbers (spec D2)", () => {
    // Class names carry digits (px-4, max-w-4xl), so they are removed first.
    // Everything else on this page is words: any number would have to be a
    // customer result, and there are none yet. That includes comments, so the
    // page's own comments must not cite spec sections by number either.
    const text = source().replace(/className=(?:"[^"]*"|\{`[^`]*`\})/g, "");
    const lines = text.split("\n").filter((l) => /\d/.test(l));
    expect(lines, `lines with a number: ${lines.join(" | ")}`).toEqual([]);
  });

  it("publishes no quotes, logos or images (spec D2)", () => {
    const found = source().match(/<(?:blockquote|img|Image|figure|svg)\b/g) ?? [];
    expect(found, `testimonial or logo markup: ${found.join(", ")}`).toEqual([]);
  });
});
```

Run: `cd self-storage-hosting && npx vitest run tests/case-studies.test.ts`
Expected: "stays out of the index" PASSES. The other two FAIL with "/case-studies has no page.tsx".

- [ ] **Step 2: Create the page**

Create `self-storage-hosting/app/(marketing)/case-studies/page.tsx`. The file must contain no digit outside a `className`, including in comments. That is why its comment does not cite the spec section.

```tsx
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";

// noindex comes from ROUTES["/case-studies"].indexable === false, through
// pageMeta. Add no numbers, quotes or logos here until a real operator has
// agreed to publish real results. tests/case-studies.test.ts enforces it.
export const metadata: Metadata = pageMeta({
  title: "Case Studies",
  description:
    "What we measure when an operator moves gate access control off the office PC, and how to become one of our first references.",
  path: "/case-studies",
});

const measures = [
  {
    name: "Truck rolls avoided",
    desc: "Trips to a facility to restart, update or repair the computer that runs the gate. We count them per facility, before the move and after it.",
  },
  {
    name: "Sync failure rate",
    desc: "How often a change made in the facility management software fails to reach the gate the first time. We measure it from the event history.",
  },
  {
    name: "Time to provision a new site",
    desc: "The time from a signed agreement to the first tenant code working at the gate.",
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
        ]}
      />

      <section className="mx-auto max-w-4xl px-4 pt-12 pb-10 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Case studies</h1>
        <p className="mt-4 text-lg text-text-800">
          We have not published a case study yet. When we do, it will report measurements from the
          operator&apos;s own facilities, and it will name the operator only with their permission.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">What we will measure</h2>
        <ul className="mt-6 space-y-4">
          {measures.map((m) => (
            <li
              key={m.name}
              className="rounded-2xl border border-background-200 bg-background-50 p-5 shadow-sm"
            >
              <h3 className="text-lg font-semibold">{m.name}</h3>
              <p className="mt-2 text-text-700">{m.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Be one of our first references</h2>
        <p className="mt-4 text-text-800">
          If your gate still depends on an office PC, we would like to measure the move with you.
          You see the numbers first, and nothing is published without your permission.
        </p>
      </section>

      <CtaBand
        heading="Become a first reference"
        text="Tell us about your facilities and what runs your gate today."
        primary={{ href: "/contact", label: "Talk to us" }}
        secondary={{ href: "/solutions/access-control-hosting", label: "See access control hosting" }}
      />
    </>
  );
}
```

"The event history" is the approved term. Never write "audit log" (Global Constraints).

Run: `cd self-storage-hosting && npx vitest run tests/case-studies.test.ts`
Expected: PASS.

- [ ] **Step 3: Flip the route**

In `lib/site.ts`, set `"/case-studies"` to `built: true`. Leave the sitemap-coverage array alone.

- [ ] **Step 4: Gates and rendered checks**

Run: `cd self-storage-hosting && npm run lint && npm test && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts`
Expected: all pass. The rendered test checks that `/case-studies` renders `noindex`, and `tests/sitemap-coverage.test.ts` checks that it stays out of the sitemap.

```bash
cd self-storage-hosting
grep -o '<meta name="robots" content="[^"]*"' .next/server/app/case-studies.html
grep -c 'case-studies' .next/server/app/sitemap.xml.body
```

Expected:
- `<meta name="robots" content="noindex, nofollow"`
- `0`. If the file is not at that path, find it with `ls .next/server/app | grep sitemap` and grep that file instead. The count must still be `0`.

- [ ] **Step 5: Commit**

```bash
git add self-storage-hosting/tests/case-studies.test.ts "self-storage-hosting/app/(marketing)/case-studies/page.tsx" self-storage-hosting/lib/site.ts
git commit -m "feat(case-studies): noindexed page that states what we will measure, with no invented results"
```

- [ ] **Step 6: Probe**

| Mutation | Run | Must fail naming |
|---|---|---|
| In the page, change the first measure's `desc` to `"Customers cut truck rolls by 40%."` | `npx vitest run tests/case-studies.test.ts` | `40%` |
| In the page, add `<blockquote>Great service.</blockquote>` under the h1 | `npx vitest run tests/case-studies.test.ts` | `<blockquote` |
| In the page, add `noindex: false,` inside `pageMeta({ … })` | `npx vitest run tests/sitemap-coverage.test.ts` | `/case-studies overrides` |
| In `lib/site.ts`, set `"/case-studies"` back to `built: false` | `npm run build` | `Breadcrumb "Case Studies" links to /case-studies` |

Restore with `git checkout -- <file>` after each. Finish with `git status --short`.

---


### Task 10: /legal/privacy and /legal/terms

Spec §6.11 and §4.3. These pages are **drafts of the owner's policies, not legal advice.** Spec §14 C leaves the legal entity name and the policy content to the owner or counsel. So these drafts do two things only:
- state the site's real data flows, each one checked against the code;
- set plain rules for using the website.

They never invent a legal entity, a governing-law or dispute clause, or a retention period. `tests/legal.test.ts` enforces that.

The privacy policy must stay true as the code changes, so the same test ties each claim to the code that makes it true:

| The policy says | Where that is true | What fails if it drifts |
|---|---|---|
| The forms collect name, email address, message, company, phone number, number of facilities, facility management software, gate or access system, and timeline | `validateContact()` in `lib/contact.ts`, which after Task 3 returns exactly those fields plus `subject` | A new form field with no line in the policy |
| Messages go by email through Resend | `app/api/contact/route.ts` posts to `https://api.resend.com/emails` | The route switching email providers |
| One cookie, `token`, lasting seven days | `COOKIE_NAME` and `maxAge` in `backend/src/routes/user.routes.ts` | Either value changing |
| Passwords are stored as a one-way hash | `bcrypt.hash(` in the same file | The backend no longer hashing |
| No analytics and no third-party scripts | `package.json` and the source of `app/`, `components/` and `lib/` | A tracking package or script tag |
| Fonts and images come from this website | The built HTML (a new rendered check) | Any `src`, `srcset` or fetched `<link>` pointing at another origin |

Facts checked on 2026-09-18 that the pages rely on:
- The live site answers with `Server: cloudflare` and an `x-nf-request-id` header, so it is Netlify behind Cloudflare. The home page sets no cookie.
- The contact route keeps each IP address in an in-memory `Map` for rate limiting. It writes no IP to a log or a database. An entry is swept only when the table grows past its prune threshold. So the policy says "held in the server's memory" and "lost when the server restarts", never "kept for one minute".
- `next/font` self-hosts Inter. The built HTML loads the font from `/_next/static/media/`, not from a font provider.

Ruling on the password sentence. The Global Constraints allow no security claim beyond TLS. "A one-way hash of your password" is different: it is an entry in the data inventory, meaning what the account database actually holds. Spec §6.11 requires the policy to disclose the auth data, and the backend code shows the fact. Writing "stores your password" instead would be false. The `#security` section still says only the approved TLS sentence.

**Files:**
- Create: `self-storage-hosting/lib/legal.ts`
- Create: `self-storage-hosting/tests/legal.test.ts`
- Create: `self-storage-hosting/app/(marketing)/legal/privacy/page.tsx`
- Create: `self-storage-hosting/app/(marketing)/legal/terms/page.tsx`
- Modify: `self-storage-hosting/tests/rendered.test.ts` (one new test, and `SITE` added to an import)
- Modify: `self-storage-hosting/lib/site.ts` (two `built` flags and the footer Security link)
- Modify: `self-storage-hosting/tests/sitemap-coverage.test.ts` (array)

**Interfaces:**
- Consumes:
  - `formatDate` from `lib/dates.ts` (Task 8);
  - `Breadcrumbs` (Task 2);
  - `pageFiles` (Task 1);
  - `validateContact` from `lib/contact.ts`, including Task 3's `timeline` field;
  - `read` and `built` inside `tests/rendered.test.ts` (Task 1).
- Produces:
  - `lib/legal.ts`: `LEGAL_UPDATED`, an object with one ISO date per legal page. Task 11 adds the `trademarks` and `accessibility` keys.
  - `tests/legal.test.ts`: `LEGAL_PAGES`. Task 11 appends its two routes.
  - The privacy page has `id="security"`. The footer links it as `/legal/privacy#security` (spec §4.3).
  - The terms page has the sentence `We do not control those websites.` Task 11 appends a trademarks link after it.

- [ ] **Step 1: Write the failing test**

Create `self-storage-hosting/tests/legal.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { ROUTES } from "@/lib/site";
import { LEGAL_UPDATED } from "@/lib/legal";
import { formatDate } from "@/lib/dates";
import { validateContact } from "@/lib/contact";
import { PKG_ROOT, walkFrom } from "./helpers/walk";
import { pageFiles } from "./helpers/pages";

// Every legal page these guards read. A new /legal/ route must be added here:
// the first test fails until it is.
const LEGAL_PAGES = ["/legal/privacy", "/legal/terms"];

function source(route: string): string {
  const file = pageFiles().get(route);
  expect(file, `${route} has no page.tsx`).toBeDefined();
  return readFileSync(file!, "utf8");
}

describe("legal pages", () => {
  it("guards every built legal page", () => {
    const built = Object.keys(ROUTES).filter((r) => r.startsWith("/legal/") && ROUTES[r].built);
    const unguarded = built.filter((r) => !LEGAL_PAGES.includes(r));
    expect(unguarded, `add these to LEGAL_PAGES: ${unguarded.join(", ")}`).toEqual([]);
  });

  it.each(LEGAL_PAGES)("%s names no legal entity, governing law or dispute process", (route) => {
    // Spec 14 C: the legal entity is an owner input that does not exist yet,
    // and the law that applies and how disputes are settled are counsel's to
    // write. A draft that states them reads as settled when it is not.
    const found =
      source(route).match(
        /\b(?:LLC|L\.L\.C\.|Inc\.|Incorporated|Ltd\b|Corp\.|Corporation|GmbH)|governing law|governed by|laws of the|jurisdiction|arbitration|class action/gi
      ) ?? [];
    expect(found, `${route} states: ${found.join(", ")}`).toEqual([]);
  });

  it.each(LEGAL_PAGES)("%s sets no retention period", (route) => {
    // How long messages and accounts are kept is the owner's decision. The one
    // duration these pages state is the sign-in cookie's lifetime, which the
    // backend sets in code.
    const found = source(route).match(/\b(?:retain\w*|retention|kept for|keep \w+ for|delete\w* after)\b/gi) ?? [];
    expect(found, `${route} states a retention period: ${found.join(", ")}`).toEqual([]);
  });

  it.each(Object.entries(LEGAL_UPDATED))("the %s page's last-updated date is real and not in the future", (page, iso) => {
    expect(() => formatDate(iso)).not.toThrow();
    const today = new Date().toISOString().slice(0, 10);
    expect(iso <= today, `${page} is dated ${iso}, which is in the future`).toBe(true);
  });
});

describe("/legal/privacy matches what the site does", () => {
  // Each field the contact and demo forms send, and the words the policy uses
  // for it.
  const DISCLOSED: Record<string, string> = {
    name: "your name",
    email: "email address",
    message: "message",
    company: "company",
    phone: "phone number",
    facilityCount: "number of facilities",
    fms: "facility management software",
    gateSystem: "gate or access system",
    timeline: "timeline",
  };
  // Set by the form component to say which form was used. The visitor never types it.
  const SET_BY_THE_FORM = ["subject"];

  it("names every field the forms collect", () => {
    const r = validateContact({ name: "Dana Reyes", email: "dana@example.com", message: "Hello" });
    if (!r.ok) throw new Error("a minimal valid message was rejected");
    // validateContact returns every field key, set or not.
    const fields = Object.keys(r.value).filter((k) => !SET_BY_THE_FORM.includes(k));
    expect(fields.length).toBeGreaterThanOrEqual(9);
    const unlisted = fields.filter((k) => !(k in DISCLOSED));
    expect(unlisted, `form fields the policy does not cover; add them to DISCLOSED and the policy: ${unlisted.join(", ")}`).toEqual([]);
    const policy = source("/legal/privacy");
    const unsaid = Object.entries(DISCLOSED)
      .filter(([, words]) => !policy.includes(words))
      .map(([field]) => field);
    expect(unsaid, `the policy does not mention: ${unsaid.join(", ")}`).toEqual([]);
  });

  it("names the email provider the contact route sends through", () => {
    const route = readFileSync(path.join(PKG_ROOT, "app", "api", "contact", "route.ts"), "utf8");
    const provider = /fetch\(\s*"https:\/\/(?:api\.)?([a-z0-9-]+)\./.exec(route)?.[1];
    expect(provider, "no outbound email call found in app/api/contact/route.ts").toBeDefined();
    expect(source("/legal/privacy").toLowerCase(), `the policy does not name ${provider}`).toContain(provider!);
  });

  it("describes the account data and the cookie the backend actually uses", () => {
    const server = readFileSync(path.join(PKG_ROOT, "..", "backend", "src", "routes", "user.routes.ts"), "utf8");
    expect(server, "the backend cookie is no longer named token").toMatch(/COOKIE_NAME\s*=\s*"token"/);
    expect(server, "the backend cookie no longer lasts seven days").toMatch(
      /maxAge:\s*7\s*\*\s*24\s*\*\s*60\s*\*\s*60\s*\*\s*1000/
    );
    expect(server, "the backend no longer hashes passwords").toMatch(/bcrypt\.hash\(/);
    const policy = source("/legal/privacy");
    for (const words of ["<code>token</code>", "seven days", "one-way hash"]) {
      expect(policy, `the policy no longer says "${words}"`).toContain(words);
    }
  });

  it("stays true that the site uses no analytics or third-party scripts", () => {
    const pkg = JSON.parse(readFileSync(path.join(PKG_ROOT, "package.json"), "utf8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    const trackers = deps.filter((d) =>
      /analytics|speed-insights|third-parties|gtag|posthog|plausible|mixpanel|segment|hotjar|sentry|datadog|logrocket|fullstory/i.test(d)
    );
    expect(trackers, `tracking packages; update the privacy policy first: ${trackers.join(", ")}`).toEqual([]);

    const files = ["app", "components", "lib"].flatMap((d) => walkFrom(d, /\.tsx?$/));
    expect(files.length).toBeGreaterThan(10);
    const scripts = files
      .filter((f) =>
        /googletagmanager|google-analytics|\bgtag\(|plausible\.io|posthog|hotjar|clarity\.ms|<Script\b|from "next\/script"/.test(
          readFileSync(f, "utf8")
        )
      )
      .map((f) => path.relative(PKG_ROOT, f));
    expect(scripts, `tracking or third-party scripts; update the privacy policy first: ${scripts.join(", ")}`).toEqual([]);
  });
});
```

Run: `cd self-storage-hosting && npx vitest run tests/legal.test.ts`
Expected: FAIL, because `@/lib/legal` does not exist.

- [ ] **Step 2: Create `lib/legal.ts`**

```ts
// The date each legal page's wording last changed, shown at the top of that
// page. Change a page's date in the same commit that changes its text.
//
// These pages are drafts of the owner's policies, not legal advice. The owner
// or counsel must review them before PR #1 merges (spec 6.11, 14 C).
export const LEGAL_UPDATED = {
  privacy: "2026-09-18",
  terms: "2026-09-18",
} as const;
```

Run: `cd self-storage-hosting && npx vitest run tests/legal.test.ts`
Expected:
- PASS: "guards every built legal page", the two `LEGAL_UPDATED` date cases, and "stays true that the site uses no analytics or third-party scripts".
- FAIL with "/legal/privacy has no page.tsx" or "/legal/terms has no page.tsx": every case that reads a page.

- [ ] **Step 3: Create the privacy policy**

Create `self-storage-hosting/app/(marketing)/legal/privacy/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { LEGAL_UPDATED } from "@/lib/legal";
import { formatDate } from "@/lib/dates";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

// DRAFT FOR OWNER OR COUNSEL REVIEW BEFORE PR #1 MERGES. Not legal advice.
//
// This page describes what the website's code does with personal
// information, checked against the code on the date in lib/legal.ts. The
// owner or counsel must still decide, at least:
//   - the legal entity that operates the site (spec 14 C);
//   - how long messages and account details are kept;
//   - whether privacy requests need a route other than the contact form;
//   - whether any law-specific sections are needed, for example for US
//     state privacy laws;
//   - whether Cloudflare's bot protection sets a cookie of its own on this
//     zone. If it does, disclose it under "Cookies".
// This page states none of those. tests/legal.test.ts keeps it that way, and
// keeps the data-flow facts below in step with the code.

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy",
  description:
    "What this website collects when you send a message or create an account, where it goes, and the one cookie it uses.",
  path: "/legal/privacy",
});

const link = `font-semibold underline ${FOCUS_RING_LIGHT}`;

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/legal/privacy" },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Privacy policy</h1>
        <p className="mt-2 text-sm text-text-700">Last updated {formatDate(LEGAL_UPDATED.privacy)}</p>
        <p className="mt-6 text-text-800">
          This policy explains what this website collects, why, and where it goes. It covers this
          website only. If you become a customer, the written agreement for our services covers the
          information those services handle.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">When you send us a message</h2>
        <p className="mt-4 text-text-800">
          The contact form and the demo request form both ask for your name, your email address and
          a message (optional on the demo form). You can also tell us your company, phone number,
          number of facilities, facility management software and gate or access system, and, on the
          demo form, your timeline.
        </p>
        <p className="mt-4 text-text-800">
          We use what you send to reply to you and to prepare for the conversation you asked for.
          Our server checks the form, then sends it as an email through Resend, an email delivery
          service, to our business inbox. Your email address is set as the reply-to address, so our
          answer comes straight back to you. The website itself keeps no copy.
        </p>
        <p className="mt-4 text-text-800">
          To stop the forms being flooded, our server also reads your IP address and counts the
          messages sent from it each minute. That count is held in the server&apos;s memory only. It
          is not written to a database or a log, it is not sent anywhere, and it is lost when the
          server restarts.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">When you create an account</h2>
        <p className="mt-4 text-text-800">
          Our account server stores your email address, your name if you give one, a one-way hash
          of your password (never the password itself), and the dates the account was created and
          last changed. We use them to sign you in.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Cookies</h2>
        <p className="mt-4 text-text-800">
          Signing in or creating an account sets one cookie, named <code>token</code>, from our
          account server. It keeps you signed in, and it expires seven days after you sign in or
          when you log out.
        </p>
        <p className="mt-4 text-text-800">
          Our own code sets no other cookie. This site uses no analytics, advertising or tracking
          cookies.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What this site does not use</h2>
        <p className="mt-4 text-text-800">
          This site uses no analytics or advertising, and it loads no scripts from other companies.
          Fonts and images are served from this website itself.
        </p>
        <p className="mt-4 text-text-800">
          Some pages link to other websites, such as vendor support pages and event organizers&apos;
          pages. Those websites have their own privacy policies.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Who handles your information</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-text-800">
          <li>
            Netlify hosts this website, and Cloudflare sits in front of it. Like any web host, they
            process your IP address and browser details to deliver each page, and they may keep
            request logs under their own policies.
          </li>
          <li>Resend delivers form messages to our inbox.</li>
          <li>The provider that hosts our business email stores the messages we receive.</li>
          <li>Our account server and its database store account details.</li>
        </ul>
        <p className="mt-4 text-text-800">
          We do not sell personal information or share it for advertising.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Your choices</h2>
        <p className="mt-4 text-text-800">
          You can ask us what we hold about you, and ask us to correct or delete it. Send the request
          through the{" "}
          <Link href="/contact" className={link}>
            contact form
          </Link>
          .
        </p>

        <section id="security" className="scroll-mt-24">
          <h2 className="mt-10 text-2xl font-semibold">Security</h2>
          <p className="mt-4 text-text-800">
            Served over TLS.{" "}
            <Link href="/contact" className={link}>
              Ask us for our current security posture
            </Link>
            .
          </p>
        </section>

        <h2 className="mt-10 text-2xl font-semibold">Changes to this policy</h2>
        <p className="mt-4 text-text-800">
          When this policy changes, the date at the top of this page changes with it.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Questions</h2>
        <p className="mt-4 text-text-800">
          Ask us through the{" "}
          <Link href="/contact" className={link}>
            contact form
          </Link>
          .
        </p>
      </article>
    </>
  );
}
```

Notes for the implementer:
- The Security section is the approved TLS sentence and nothing else. Do not add HSTS, hashing or hosting-provider security features to it (Global Constraints).
- The page publishes no email address, phone number or postal address (spec §14 A). Every request goes through `/contact`.
- The IP sentence says "each minute", matching `WINDOW_MS = 60_000` in the route. It never says how long an entry stays in memory, because the route does not bound that.

- [ ] **Step 4: Create the terms page**

Create `self-storage-hosting/app/(marketing)/legal/terms/page.tsx`. Its comment must not use the words the legal guard rejects (such as "governing law" or "jurisdiction"), because the guard reads comments too.

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { LEGAL_UPDATED } from "@/lib/legal";
import { formatDate } from "@/lib/dates";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

// DRAFT FOR OWNER OR COUNSEL REVIEW BEFORE PR #1 MERGES. Not legal advice.
//
// Plain rules for using this website, and nothing more. The owner or counsel
// must still decide, at least:
//   - the legal entity that offers these terms (spec 14 C);
//   - which law applies and how disputes are settled;
//   - any warranty disclaimer and any limit on liability.
// This page states none of those, and tests/legal.test.ts keeps it that way.
// Terms for the services themselves belong in each customer's written
// agreement, not here.

export const metadata: Metadata = pageMeta({
  title: "Terms of Service",
  description:
    "The rules for using this website: what its information is for, how to use its forms and accounts, and how these terms change.",
  path: "/legal/terms",
});

const link = `font-semibold underline ${FOCUS_RING_LIGHT}`;

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Terms of Service", path: "/legal/terms" },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Terms of service</h1>
        <p className="mt-2 text-sm text-text-700">Last updated {formatDate(LEGAL_UPDATED.terms)}</p>
        <p className="mt-6 text-text-800">
          These terms apply when you use this website. The services we provide to self-storage
          operators are covered by a separate written agreement, and that agreement governs those
          services.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What the information here is for</h2>
        <p className="mt-4 text-text-800">
          This website describes our services and the self-storage systems they work with. It is
          general information, not a promise about your facilities. What we will provide to you is
          set out in a written agreement.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Other companies&apos; products and pages</h2>
        <p className="mt-4 text-text-800">
          We name other companies&apos; products to describe what our services work with, and we link
          to those companies&apos; own pages for support and events. We check those facts against the
          companies&apos; own pages on the dates shown, but they can change. We do not control those
          websites.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Using the forms</h2>
        <p className="mt-4 text-text-800">
          Send only information that is accurate and that you are entitled to share. Do not use the
          forms to send advertising or anything harmful. We may block messages that look automated.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Accounts</h2>
        <p className="mt-4 text-text-800">
          If you create an account, keep your password to yourself, and tell us if you think someone
          else has used it.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Using the site fairly</h2>
        <p className="mt-4 text-text-800">
          Do not try to break or overload this website, get around its protections, or reach parts
          of it that are not meant for you.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Changes to these terms</h2>
        <p className="mt-4 text-text-800">
          When these terms change, the date at the top of this page changes with them.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Questions</h2>
        <p className="mt-4 text-text-800">
          Ask us through the{" "}
          <Link href="/contact" className={link}>
            contact form
          </Link>
          .
        </p>
      </article>
    </>
  );
}
```

"Governs" in the intro is not "governed by", so the legal guard allows it. The sentence says which document covers the services. It does not say which law applies.

Run: `cd self-storage-hosting && npx vitest run tests/legal.test.ts`
Expected: PASS.

- [ ] **Step 5: Add the footer Security link, flip both routes, update the array**

In `lib/site.ts`, in the `FOOTER` column whose heading is `"Legal"`, add the Security link directly after the Privacy Policy link (spec §4.3):

```ts
      { href: "/legal/privacy", label: "Privacy Policy" },
      { href: "/legal/privacy#security", label: "Security" },
```

In the same file, set `"/legal/privacy"` and `"/legal/terms"` to `built: true`.

The fragment check in `tests/source-links.test.ts` (Task 1) now reads the privacy page for `id="security"`. It skipped this link while the route was unbuilt.

In `tests/sitemap-coverage.test.ts`, set the expectation to:

```ts
    expect(indexableRoutes()).toEqual([
      "/",
      "/about-us",
      "/contact",
      "/solutions",
      "/solutions/access-control-hosting",
      "/solutions/web-hosting",
      "/events",
      "/support",
      "/demo",
      "/legal/privacy",
      "/legal/terms",
    ]);
```

- [ ] **Step 6: Check the built pages load nothing from another origin**

The policy says fonts and images come from this website and that no third-party scripts load. The source guard in Step 1 covers packages and script tags. This check covers everything the build actually wrote, including anything a framework adds.

In `self-storage-hosting/tests/rendered.test.ts`:
1. Change `import { ROUTES } from "@/lib/site";` to `import { ROUTES, SITE } from "@/lib/site";`.
2. Add this test inside `describe.skipIf(!RUN)("rendered HTML", …)`, after the /events test:

```ts
  it("loads nothing from another origin, as /legal/privacy says", () => {
    // Tags whose URL the browser fetches while it renders the page. Links a
    // visitor clicks (<a>) and the canonical and alternate <link>s are not
    // fetched, so they are not counted. Read the raw HTML: visible() drops
    // <script src> tags, and those are exactly what this test is for.
    const fetched = built.flatMap((r) =>
      [...read(r).matchAll(/<(?:script|img|iframe|link|source|video|audio)\b[^>]*>/g)]
        .map((m) => m[0])
        .filter((tag) => !/\brel="(?:canonical|alternate)"/.test(tag))
        .map((tag) => ({ r, tag }))
    );
    // Proves the tag scan matches the markup Next actually writes.
    expect(fetched.some(({ tag }) => /\bsrc="\/_next\/static\//.test(tag))).toBe(true);
    const offsite = fetched.flatMap(({ r, tag }) =>
      [...tag.matchAll(/\b(?:src|href|srcset)="(https?:\/\/[^"\s]+)/g)]
        .map((u) => u[1])
        .filter((u) => !u.startsWith(SITE.url))
        .map((u) => `${r} -> ${u}`)
    );
    expect(offsite, `off-site resources: ${offsite.join(", ")}`).toEqual([]);
  });
```

- [ ] **Step 7: Gates and rendered checks**

Run: `cd self-storage-hosting && npm run lint && npm test && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts`
Expected: all pass, including the new off-site check.

```bash
cd self-storage-hosting
grep -o 'href="/legal/privacy#security"' .next/server/app/index.html | wc -l
grep -o 'id="security"' .next/server/app/legal/privacy.html | wc -l
grep -o '<meta name="robots" content="[^"]*"' .next/server/app/legal/terms.html
```

Expected:
- `1`: the footer's Security link, now live. Before this task the count was `0`.
- `1`.
- No output. The legal pages are indexable, and `pageMeta()` writes a robots tag only for `noindex`.

- [ ] **Step 8: Commit**

```bash
git add self-storage-hosting/lib/legal.ts self-storage-hosting/tests/legal.test.ts "self-storage-hosting/app/(marketing)/legal/privacy/page.tsx" "self-storage-hosting/app/(marketing)/legal/terms/page.tsx" self-storage-hosting/tests/rendered.test.ts self-storage-hosting/lib/site.ts self-storage-hosting/tests/sitemap-coverage.test.ts
git commit -m "feat(legal): privacy policy and terms drafted from the site's real data flows, pending owner review"
```

- [ ] **Step 9: Probe**

| Mutation | Run | Must fail naming |
|---|---|---|
| In `lib/contact.ts`, add `referrer: opt(raw.referrer),` to the returned `value` | `npx vitest run tests/legal.test.ts` | `referrer` |
| In the privacy page, delete the words `phone number,` from the first form paragraph | `npx vitest run tests/legal.test.ts` | `the policy does not mention: phone` |
| In the terms page, add `<p>These terms are governed by the laws of the State of Delaware.</p>` under the h1 | `npx vitest run tests/legal.test.ts` | `governed by, laws of the` |
| In the privacy page, add `<p>We retain messages for twelve months.</p>` under the h1 | `npx vitest run tests/legal.test.ts` | `retain` |
| In `app/api/contact/route.ts`, change `https://api.resend.com/emails` to `https://api.postmarkapp.com/email` | `npx vitest run tests/legal.test.ts` | `the policy does not name postmarkapp` |
| In `package.json`, add `"@vercel/analytics": "1.5.0",` to `dependencies`. Do not install it. | `npx vitest run tests/legal.test.ts` | `@vercel/analytics` |
| In `backend/src/routes/user.routes.ts`, change `maxAge: 7 *` to `maxAge: 30 *` | `npx vitest run tests/legal.test.ts` | `no longer lasts seven days` |
| In `lib/legal.ts`, change the privacy date to `"2099-01-01"` | `npx vitest run tests/legal.test.ts` | `privacy is dated 2099-01-01, which is in the future` |
| In the privacy page, change `id="security"` to `id="sec"` | `npx vitest run tests/source-links.test.ts` | `/legal/privacy#security` |
| In the privacy page, add `<img src="https://example.com/pixel.gif" alt="" />` under the h1, then `npm run build` | `RENDERED=1 npx vitest run tests/rendered.test.ts` | `/legal/privacy -> https://example.com/pixel.gif` |
| In `lib/site.ts`, set `"/legal/terms"` back to `built: false` | `npm run build` | `Breadcrumb "Terms of Service" links to /legal/terms` |

After the rendered probe, restore the file and run `npm run build` again so `.next` matches the committed source. Restore with `git checkout -- <file>` after each; the backend probe needs `git checkout -- backend/src/routes/user.routes.ts` from the repo root. Finish with `git status --short`.

---

### Task 11: /legal/trademarks and /legal/accessibility

Spec §6.11, §7.5 and §15.4.

The trademarks page lists every third-party name the site uses, grouped by owner, and says there is no affiliation. Rules for writing it:
- Owners are plain company names, never with a legal suffix, because their legal entities were not verified.
- The page claims no registration status for any mark. Spec §13 says DigiGate is "not verified as a registered trademark".
- INSOMNIAC® keeps the ® its owner uses, once per page, at first use.

A test keeps the list complete: every name on a shared watchlist that appears anywhere in the site source must be listed on the page. The watchlist already exists in `tests/vendors.test.ts` (Task 7). This task moves it into `tests/helpers/brands.ts` so both guards use one list, and adds the three service providers the privacy policy names. A name that is not on the watchlist is invisible to this guard, which is why the helper's comment says to add each new company or product there the first time the site mentions it.

The ® rule is checked in the built HTML, not the source, because the first use on a page can come from data in another file. INSOMNIAC appears on /about-us, /contact, /demo, /solutions/access-control-hosting, /support and /legal/trademarks. On each built page, the first INSOMNIAC must carry ®, and no later one may.

The accessibility statement claims only what this codebase does and checks today. It claims no conformance level, because there has been no outside audit. Every claim on it is backed by one of these:

| Claim | Backed by |
|---|---|
| Text contrast checked at 4.5:1, focus outlines at 3:1 | `tests/contrast.test.ts` (4.5 and 3.0 rows) |
| One main heading per page | `tests/rendered.test.ts` (Task 1) |
| "Skip to content" link | `app/(marketing)/layout.tsx`, `app/not-found.tsx`, and later `components/SiteChrome.tsx` (Task 14) |
| Visible keyboard focus outline | `FOCUS_RING` / `FOCUS_RING_LIGHT` in `components/ui/focus.ts` |
| Invalid fields are marked and linked to their message; the result is announced | `aria-invalid`, `aria-describedby` and the `role="status"` `aria-live="polite"` region in `components/ContactForm.tsx` |
| Motion off under reduced-motion settings | the `prefers-reduced-motion: reduce` block in `app/globals.css` |
| Informative images described, decorative ones hidden | the hero's `alt` in `app/(marketing)/page.tsx`, and the logo's `alt=""` in `components/nav/MainNav.tsx` |
| Page language set | `<html lang="en">` in `app/layout.tsx` |

Task 14's `AuthForm` must meet the same form claim. Its task says so.

**Files:**
- Create: `self-storage-hosting/tests/helpers/brands.ts`
- Modify: `self-storage-hosting/tests/vendors.test.ts` (imports the watchlist instead of defining it)
- Create: `self-storage-hosting/lib/trademarks.ts`
- Create: `self-storage-hosting/tests/trademarks.test.ts`
- Modify: `self-storage-hosting/lib/legal.ts` (two dates)
- Modify: `self-storage-hosting/tests/legal.test.ts` (`LEGAL_PAGES`)
- Create: `self-storage-hosting/app/(marketing)/legal/trademarks/page.tsx`
- Create: `self-storage-hosting/app/(marketing)/legal/accessibility/page.tsx`
- Modify: `self-storage-hosting/app/(marketing)/legal/terms/page.tsx` (a link to the trademarks page)
- Modify: `self-storage-hosting/tests/rendered.test.ts` (one new test)
- Modify: `self-storage-hosting/lib/site.ts` (two `built` flags)
- Modify: `self-storage-hosting/tests/sitemap-coverage.test.ts` (array)

**Interfaces:**
- Consumes:
  - `LEGAL_UPDATED` and `LEGAL_PAGES` (Task 10);
  - `formatDate` (Task 8);
  - `Breadcrumbs` (Task 2);
  - `walkFrom` from `tests/helpers/walk.ts`;
  - `read` and `built` inside `tests/rendered.test.ts` (Task 1);
  - the terms sentence `We do not control those websites.` (Task 10).
- Produces:
  - `tests/helpers/brands.ts`: `WATCHLIST: string[]` and `words(s: string): Set<string>`.
  - `lib/trademarks.ts`: `type ThirdPartyMark = { owner: string; marks: string[] }` and `THIRD_PARTY_MARKS: ThirdPartyMark[]`.

- [ ] **Step 1: Move the watchlist into a shared helper**

Create `self-storage-hosting/tests/helpers/brands.ts`:

```ts
// Third-party company, product and service names this site prints, one word
// each. Two guards use this list:
//   - tests/vendors.test.ts keeps them out of the /support title, description
//     and h1 (spec D8);
//   - tests/trademarks.test.ts requires every one the site uses to be listed
//     on /legal/trademarks.
// Add a name here the first time the site mentions a new company or product.
// A name missing from this list is invisible to both guards.
export const WATCHLIST = [
  "PTI",
  "StorLogix",
  "FalconXT",
  "CloudController",
  "DigiGate",
  "OpenTech",
  "INSOMNIAC",
  "Storable",
  "Sitelink",
  "Janus",
  "Nokē",
  "Noke",
  "DoorKing",
  "DKS",
  "Netlify",
  "Cloudflare",
  "Resend",
];

// Lower-cased words. Splitting on anything that is not a letter or a digit
// keeps "Nokē" whole, where a \b-bounded regex would not match it at all.
export const words = (s: string) => new Set(s.toLowerCase().split(/[^a-z0-9ē]+/).filter(Boolean));
```

In `self-storage-hosting/tests/vendors.test.ts`:
1. Delete the `WATCHLIST` array and its comment, and the `words` function and its comment.
2. Add `import { WATCHLIST, words } from "./helpers/brands";` after the `./helpers/pages` import.

Nothing else changes. The /support title check now also covers the three new names, which is stricter and still true.

Run: `cd self-storage-hosting && npx vitest run tests/vendors.test.ts`
Expected: PASS, the same as before the move.

- [ ] **Step 2: Write the failing trademark test**

Create `self-storage-hosting/tests/trademarks.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { THIRD_PARTY_MARKS } from "@/lib/trademarks";
import { walkFrom } from "./helpers/walk";
import { WATCHLIST, words } from "./helpers/brands";

// Everything the site renders comes from these three directories.
const siteText = ["app", "components", "lib"]
  .flatMap((d) => walkFrom(d, /\.tsx?$/))
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");

describe("/legal/trademarks", () => {
  const used = words(siteText);
  const listed = words(THIRD_PARTY_MARKS.flatMap((m) => [m.owner, ...m.marks]).join(" "));

  it("finds the names it is meant to check", () => {
    for (const w of ["digigate", "storable", "insomniac"]) {
      expect(used.has(w), `"${w}" not found in the site source`).toBe(true);
    }
  });

  it("lists every third-party name the site uses", () => {
    const missing = WATCHLIST.filter((w) => used.has(w.toLowerCase()) && !listed.has(w.toLowerCase()));
    expect(missing, `named on the site but not on /legal/trademarks: ${missing.join(", ")}`).toEqual([]);
  });

  it("names each owner without a legal suffix it has not verified", () => {
    const suffixed = THIRD_PARTY_MARKS.map((m) => m.owner).filter((o) =>
      /\b(?:LLC|Inc\.?|Incorporated|Ltd|Corp\.?|Corporation|GmbH)\b/.test(o)
    );
    expect(suffixed, `unverified legal entity names: ${suffixed.join(", ")}`).toEqual([]);
  });
});
```

Run: `cd self-storage-hosting && npx vitest run tests/trademarks.test.ts`
Expected: FAIL, because `@/lib/trademarks` does not exist.

- [ ] **Step 3: Create `lib/trademarks.ts`**

Every owner and mark below appears in Appendix A (A.2 for the vendors, A.3 for PTI's product names) or was checked for Task 10 (Netlify, Cloudflare, Resend).

```ts
// Third-party names this site uses, grouped by the company that owns them.
// /legal/trademarks renders this list, and tests/trademarks.test.ts fails
// when the site prints a watchlisted name that is missing here.
//
// Owners are plain company names, never with a legal suffix: their legal
// entities were not verified. No registration status is claimed for any
// mark. INSOMNIAC® keeps the ® its owner uses.
export type ThirdPartyMark = { owner: string; marks: string[] };

export const THIRD_PARTY_MARKS: ThirdPartyMark[] = [
  {
    owner: "PTI Security Systems",
    marks: ["PTI", "StorLogix", "StorLogix Cloud", "FalconXT", "CloudController", "DigiGate"],
  },
  { owner: "OpenTech Alliance", marks: ["OpenTech Alliance", "INSOMNIAC® CIA"] },
  { owner: "Storable", marks: ["Storable", "Sitelink", "Storable Edge", "Storable Easy"] },
  { owner: "Janus International", marks: ["Janus", "Nokē", "Nokē Smart Entry"] },
  { owner: "DoorKing", marks: ["DoorKing", "DKS"] },
  { owner: "Netlify", marks: ["Netlify"] },
  { owner: "Cloudflare", marks: ["Cloudflare"] },
  { owner: "Resend", marks: ["Resend"] },
];
```

Run: `cd self-storage-hosting && npx vitest run tests/trademarks.test.ts`
Expected: PASS.

- [ ] **Step 4: Register the two new legal pages**

In `lib/legal.ts`, add two keys to `LEGAL_UPDATED`:

```ts
export const LEGAL_UPDATED = {
  privacy: "2026-09-18",
  terms: "2026-09-18",
  trademarks: "2026-09-18",
  accessibility: "2026-09-18",
} as const;
```

In `tests/legal.test.ts`, change `LEGAL_PAGES` to:

```ts
const LEGAL_PAGES = ["/legal/privacy", "/legal/terms", "/legal/trademarks", "/legal/accessibility"];
```

Run: `cd self-storage-hosting && npx vitest run tests/legal.test.ts`
Expected: FAIL with "/legal/trademarks has no page.tsx" and "/legal/accessibility has no page.tsx". Every other case passes.

- [ ] **Step 5: Create the trademarks page**

Create `self-storage-hosting/app/(marketing)/legal/trademarks/page.tsx`. Nothing above the list may name INSOMNIAC, because the list's `INSOMNIAC® CIA` must be the page's first use.

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { LEGAL_UPDATED } from "@/lib/legal";
import { formatDate } from "@/lib/dates";
import { THIRD_PARTY_MARKS } from "@/lib/trademarks";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

// DRAFT FOR OWNER OR COUNSEL REVIEW BEFORE PR #1 MERGES. Not legal advice.
//
// Lists the third-party names the site uses (lib/trademarks.ts) and says why
// we use them. It claims no registration status for any mark, and it names
// owners as plain company names because their legal entities were not
// verified. Spec 15: never imply a partnership or endorsement.

export const metadata: Metadata = pageMeta({
  title: "Trademarks",
  description:
    "The third-party company and product names this site mentions, who owns them, and why we name them. No affiliation is implied.",
  path: "/legal/trademarks",
});

export default function TrademarksPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Trademarks", path: "/legal/trademarks" },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Trademarks</h1>
        <p className="mt-2 text-sm text-text-700">Last updated {formatDate(LEGAL_UPDATED.trademarks)}</p>
        <p className="mt-6 text-text-800">
          This site names other companies and their products so we can say plainly which systems
          our services work with, and where to find each vendor&apos;s own support. Those names
          belong to their owners. We use them only to identify those companies and their products.
        </p>
        <p className="mt-4 text-text-800">
          Naming a company here does not mean it sponsors or endorses us. We are not affiliated with
          any of them.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Names we use, by owner</h2>
        <dl className="mt-4 divide-y divide-background-200 border-y border-background-200">
          {THIRD_PARTY_MARKS.map((m) => (
            <div key={m.owner} className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-semibold text-text-900">{m.owner}</dt>
              <dd className="text-text-800 sm:col-span-2">{m.marks.join(", ")}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 text-text-800">
          Event and association names on our events page belong to their organizers.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">If you own one of these names</h2>
        <p className="mt-4 text-text-800">
          If you want us to change how we use your name, tell us through the{" "}
          <Link href="/contact" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            contact form
          </Link>
          .
        </p>
      </article>
    </>
  );
}
```

- [ ] **Step 6: Create the accessibility statement**

Create `self-storage-hosting/app/(marketing)/legal/accessibility/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { LEGAL_UPDATED } from "@/lib/legal";
import { formatDate } from "@/lib/dates";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

// DRAFT FOR OWNER REVIEW BEFORE PR #1 MERGES.
//
// Every claim in "What we check" is backed by code or a test in this
// repository (see the table in the plan's Task 11). It claims no conformance
// level, because there has been no outside audit. Keep it that way until
// there is one. When spec 14 A supplies a business email or phone number, add
// it under "Tell us about a barrier": a visitor who cannot use the contact
// form has no other way to reach us today.

export const metadata: Metadata = pageMeta({
  title: "Accessibility Statement",
  description:
    "How this website is built and checked for accessibility, its known limitations, and how to tell us about a barrier.",
  path: "/legal/accessibility",
});

const checks = [
  "Text is checked against its background for a contrast ratio of at least 4.5 to 1, and keyboard focus outlines for at least 3 to 1, by automated tests we run before every change.",
  "Each page has a single main heading, and a “Skip to content” link is the first thing you reach with the keyboard.",
  "Links, buttons and form fields show a visible outline when you reach them with the keyboard.",
  "Form fields have visible labels. A field with a problem is marked as invalid and linked to a message that explains it, and the result of sending a form is announced to screen readers.",
  "Animations and transitions switch off when your device asks for reduced motion.",
  "Images that carry information have a text description. Decorative images are hidden from screen readers.",
  "Each page declares its language, so screen readers pronounce it correctly.",
];

export default function AccessibilityPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Accessibility Statement", path: "/legal/accessibility" },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Accessibility statement</h1>
        <p className="mt-2 text-sm text-text-700">
          Last updated {formatDate(LEGAL_UPDATED.accessibility)}
        </p>
        <p className="mt-6 text-text-800">
          We want everyone who runs or works at a self-storage facility to be able to use this
          website, including people who use a keyboard, a screen reader, magnification or voice
          control.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Our target</h2>
        <p className="mt-4 text-text-800">
          We build this site to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level
          AA. This statement is based on our own checks, not an outside audit.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What we check</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-text-800">
          {checks.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>

        <h2 className="mt-10 text-2xl font-semibold">Known limitations</h2>
        <p className="mt-4 text-text-800">
          Some pages link to other companies&apos; websites, such as vendor support pages and event
          organizers&apos; pages. We do not control how accessible those websites are.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Tell us about a barrier</h2>
        <p className="mt-4 text-text-800">
          If any part of this site does not work for you, tell us through the{" "}
          <Link href="/contact" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            contact form
          </Link>
          . Say which page it was, what you were trying to do, and which browser or assistive
          technology you use.
        </p>
      </article>
    </>
  );
}
```

Contrast ratios are written in words ("4.5 to 1"), not "4.5:1". That is only a style choice. No guard reads this page for digits.

Run: `cd self-storage-hosting && npx vitest run tests/legal.test.ts`
Expected: PASS.

- [ ] **Step 7: Link the trademarks page from the terms**

In `self-storage-hosting/app/(marketing)/legal/terms/page.tsx`, replace:

```tsx
          companies&apos; own pages on the dates shown, but they can change. We do not control those
          websites.
        </p>
```

with:

```tsx
          companies&apos; own pages on the dates shown, but they can change. We do not control those
          websites. Their names belong to their owners: see our{" "}
          <Link href="/legal/trademarks" className={link}>
            trademarks page
          </Link>
          .
        </p>
```

The terms text changed, so its date should change too. `LEGAL_UPDATED.terms` is already `"2026-09-18"`. If this task runs on a later day, set `terms` and both new keys to that day's date.

- [ ] **Step 8: Check the ® rule in the built HTML**

Add this test to `self-storage-hosting/tests/rendered.test.ts`, inside `describe.skipIf(!RUN)("rendered HTML", …)`, after the off-site test:

```ts
  it("marks INSOMNIAC with ® at its first use on each page, and only there (spec 13)", () => {
    const checked: string[] = [];
    const bad: string[] = [];
    for (const r of built) {
      const html = read(r);
      // The body without any script. The RSC payload and JSON-LD repeat text
      // that is not a separate use on the page. Attributes stay in, because a
      // placeholder is visible text.
      const body = html.slice(html.indexOf("<body")).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
      const uses = [...body.matchAll(/INSOMNIAC(®|&reg;|&#174;)?/g)].map((m) => m[1] !== undefined);
      if (uses.length === 0) continue;
      checked.push(r);
      if (!uses[0]) bad.push(`${r}: the first INSOMNIAC has no ®`);
      if (uses.slice(1).some(Boolean)) bad.push(`${r}: ® repeated after the first use`);
    }
    // /about-us, /contact, /demo, access control hosting, /support, /legal/trademarks.
    expect(checked.length).toBeGreaterThanOrEqual(5);
    expect(bad, bad.join("; ")).toEqual([]);
  });
```

- [ ] **Step 9: Flip both routes and update the array**

In `lib/site.ts`, set `"/legal/trademarks"` and `"/legal/accessibility"` to `built: true`.

In `tests/sitemap-coverage.test.ts`, set the expectation to:

```ts
    expect(indexableRoutes()).toEqual([
      "/",
      "/about-us",
      "/contact",
      "/solutions",
      "/solutions/access-control-hosting",
      "/solutions/web-hosting",
      "/events",
      "/support",
      "/demo",
      "/legal/privacy",
      "/legal/terms",
      "/legal/trademarks",
      "/legal/accessibility",
    ]);
```

- [ ] **Step 10: Gates and rendered checks**

Run: `cd self-storage-hosting && npm run lint && npm test && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts`
Expected: all pass, including the ® check.

```bash
cd self-storage-hosting
grep -o 'INSOMNIAC[^ <]*' .next/server/app/legal/trademarks.html | head -1
grep -o 'href="/legal/trademarks"' .next/server/app/legal/terms.html | wc -l
grep -o 'href="/legal/accessibility"' .next/server/app/index.html | wc -l
```

Expected:
- `INSOMNIAC®`.
- `2`: the new terms link and the footer's Trademarks link.
- `1`: the footer's Accessibility link, now live.

- [ ] **Step 11: Commit**

```bash
git add self-storage-hosting/tests/helpers/brands.ts self-storage-hosting/tests/vendors.test.ts self-storage-hosting/lib/trademarks.ts self-storage-hosting/tests/trademarks.test.ts self-storage-hosting/lib/legal.ts self-storage-hosting/tests/legal.test.ts "self-storage-hosting/app/(marketing)/legal/trademarks/page.tsx" "self-storage-hosting/app/(marketing)/legal/accessibility/page.tsx" "self-storage-hosting/app/(marketing)/legal/terms/page.tsx" self-storage-hosting/tests/rendered.test.ts self-storage-hosting/lib/site.ts self-storage-hosting/tests/sitemap-coverage.test.ts
git commit -m "feat(legal): trademarks list kept complete by test, and an accessibility statement backed by real checks"
```

- [ ] **Step 12: Probe**

| Mutation | Run | Must fail naming |
|---|---|---|
| In `lib/trademarks.ts`, delete the DoorKing entry | `npx vitest run tests/trademarks.test.ts` | `DoorKing, DKS` |
| In `lib/trademarks.ts`, change the Storable owner to `"Storable, Inc."` | `npx vitest run tests/trademarks.test.ts` | `Storable, Inc.` |
| In the accessibility page, add `<p>We keep feedback for two years.</p>` under the h1 | `npx vitest run tests/legal.test.ts` | `keep feedback for` |
| In the about-us page, change `INSOMNIAC® CIA` in the bridges paragraph to `INSOMNIAC CIA`, then `npm run build` | `RENDERED=1 npx vitest run tests/rendered.test.ts` | `/about-us: the first INSOMNIAC has no ®` |
| In `lib/vendors.ts`, change the DoorKing products to `"DKS products, and INSOMNIAC® CIA readers"`, then `npm run build` | `RENDERED=1 npx vitest run tests/rendered.test.ts` | `/support: ® repeated after the first use` |
| In `lib/site.ts`, set `"/legal/accessibility"` back to `built: false` | `npm run build` | `Breadcrumb "Accessibility Statement" links to /legal/accessibility` |

After the rendered probes, restore the files and run `npm run build` again so `.next` matches the committed source. Restore with `git checkout -- <file>` after each. Finish with `git status --short`.

---


### Task 12: Validate auth input before it reaches a query

Spec §9 (the user approved the backend repair: "go ahead, fix the backend too"). Plan 1 made the frontend and backend agree on paths, cookies and CORS. What remains is the input itself. Today `backend/src/routes/user.routes.ts` hands `req.body` straight to Mongoose:

| Request | What happens today |
|---|---|
| `POST /login` with `{"email": {"$ne": null}, "password": "…"}` | `User.findOne({ email: { $ne: null } })` is a query operator. It returns the first account in the collection, and the password is then tried against that account. A caller can guess passwords without knowing any email address. |
| `POST /register` with `{"email": {"$gt": ""}, …}` | The operator reaches `findOne`, and the answer (409 or not) tells the caller whether any account exists. |
| `POST /login` with no password | `bcrypt.compare(undefined, hash)` throws, so the caller gets a 500 instead of a 400. |
| `POST /register` with a 3-character password, a 200-character password, or `name` as an object | All accepted, or turned into a 500. bcrypt reads only the first 72 bytes of a password, so a longer one is stored as something weaker than it looks. |
| Two registrations for the same new email at once | Both pass the `findOne` check. The unique index stops the second, but as a 500. |

The fix is one function, `readCredentials()`. It turns the body into plain strings, or refuses it with `400 BAD_INPUT`, before any query runs. Login checks only the shape, so an account made before these rules existed can still sign in. Register also checks the email format, the password length, and bcrypt's 72-byte limit (`bcrypt.truncates()`, which bcryptjs 3 provides).

**Three lines in this file are read by `tests/legal.test.ts` (Task 10)** to keep the privacy policy true: `const COOKIE_NAME = "token";`, the `maxAge: 7 * 24 * 60 * 60 * 1000` line and the `bcrypt.hash(` call. Do not change them.

**Files:**
- Modify: `backend/src/routes/user.routes.ts`
- Modify: `backend/tests/app.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:
  - These four lines in `user.routes.ts`, which `self-storage-hosting/tests/auth-form.test.ts` (Task 13) reads to keep the forms' rules in step:
    - `const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;`
    - `const MAX_EMAIL = 254;`
    - `const MIN_PASSWORD = 8;`
    - `const MAX_NAME = 100;`
  - The call `bcrypt.truncates(password)`.
  - Error codes the frontend maps to messages (Task 13): `BAD_INPUT` (400), `INVALID_LOGIN` (401), `EMAIL_TAKEN` (409). The envelope stays `{ code, message }`.

- [ ] **Step 1: Write the failing tests**

In `backend/tests/app.test.ts`:

1. Change the first import line to:

```ts
import { describe, it, expect, vi, afterEach } from "vitest";
```

2. Add this import after `import { User } from "../src/models/User";`:

```ts
import bcrypt from "bcryptjs";
```

3. Two existing tests register with `password: "x"`. From this task on, that is refused with a 400 before any query runs, and both tests need the query to run and fail. In `"hides internal error details from the client on 500s"`, change the body to:

```ts
        .send({ email: "leak-check@example.com", password: "long-enough-1", name: "x" });
```

In `"answers a route-level error and the global-handler error with the same envelope shape"`, change it to:

```ts
        .send({ email: "leak-check-2@example.com", password: "long-enough-1", name: "x" });
```

4. Add this block after the `describe("app wiring", …)` block and before `describe("User model", …)`:

```ts
describe("auth input", () => {
  const app = createApp();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Stands in for the database. Every case below is decided before a query
  // runs, or by what the query returns, so none of them needs a connection.
  // The spies also record the filter each query received, which is the thing
  // an operator-injection fix has to control.
  function stubUsers() {
    const findOne = vi.spyOn(User, "findOne").mockResolvedValue(null as never);
    const create = vi.spyOn(User, "create").mockImplementation((async (doc: { email: string; name?: string }) => ({
      _id: "u1",
      email: doc.email,
      name: doc.name,
      createdAt: new Date("2026-09-18T00:00:00.000Z"),
    })) as never);
    return { findOne, create };
  }

  it.each<[string, Record<string, unknown>]>([
    ["an operator object as the email", { email: { $ne: null }, password: "whatever-123" }],
    ["an operator object as the password", { email: "dana@example.com", password: { $ne: null } }],
    ["a missing password", { email: "dana@example.com" }],
    ["a blank email", { email: "   ", password: "whatever-123" }],
  ])("login refuses %s before querying", async (_label, body) => {
    const { findOne } = stubUsers();
    const res = await request(app).post("/api/users/login").send(body);
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("BAD_INPUT");
    expect(findOne).not.toHaveBeenCalled();
  });

  it.each<[string, Record<string, unknown>, RegExp]>([
    ["an operator object as the email", { email: { $gt: "" }, password: "long-enough-1" }, /email/i],
    ["a malformed email", { email: "dana-at-example", password: "long-enough-1" }, /email/i],
    ["a password under 8 characters", { email: "dana@example.com", password: "short" }, /8 characters/],
    // 40 characters, but 80 bytes: the limit is bcrypt's, and bcrypt counts bytes.
    ["a password over 72 bytes", { email: "dana@example.com", password: "é".repeat(40) }, /too long/i],
    ["a name that is not text", { email: "dana@example.com", password: "long-enough-1", name: { $ne: "" } }, /name/i],
    ["a name over 100 characters", { email: "dana@example.com", password: "long-enough-1", name: "a".repeat(101) }, /name/i],
  ])("register refuses %s before querying", async (_label, body, message) => {
    const { findOne, create } = stubUsers();
    const res = await request(app).post("/api/users/register").send(body);
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("BAD_INPUT");
    expect(res.body.message).toMatch(message);
    expect(findOne).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });

  it("looks the email up trimmed and lower-cased", async () => {
    const { findOne } = stubUsers();
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "  Dana@Example.COM ", password: "whatever-123" });
    expect(res.status).toBe(401);
    expect(res.body.code).toBe("INVALID_LOGIN");
    expect(findOne).toHaveBeenCalledWith({ email: "dana@example.com" });
  });

  it("registers a valid account with a hashed password and sets the sign-in cookie", async () => {
    const { create } = stubUsers();
    const res = await request(app)
      .post("/api/users/register")
      .send({ email: "Dana@Example.com", password: "long-enough-1", name: "  Dana  " });
    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ id: "u1", email: "dana@example.com", name: "Dana" });
    const doc = create.mock.calls[0][0] as unknown as { email: string; passwordHash: string; name?: string };
    expect(doc.email).toBe("dana@example.com");
    expect(doc.name).toBe("Dana");
    expect(await bcrypt.compare("long-enough-1", doc.passwordHash)).toBe(true);
    expect(String(res.headers["set-cookie"])).toMatch(/^token=/);
  });

  it("answers a duplicate-key race with EMAIL_TAKEN, not a 500", async () => {
    // Two requests for the same new email can both pass the findOne check.
    // The unique index on email stops the second one inside create().
    const { create } = stubUsers();
    create.mockRejectedValueOnce(Object.assign(new Error("E11000 duplicate key error"), { code: 11000 }));
    const res = await request(app)
      .post("/api/users/register")
      .send({ email: "dana@example.com", password: "long-enough-1" });
    expect(res.status).toBe(409);
    expect(res.body).toEqual({ code: "EMAIL_TAKEN", message: "Email already registered" });
  });
});
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `cd backend && npx vitest run tests/app.test.ts`

Expected:
- FAIL: every "login refuses …" case (the current code answers 401 or 500), every "register refuses …" case (200 or 500), "looks the email up trimmed and lower-cased", and "answers a duplicate-key race …" (500).
- FAIL, on the user's `email` and `name` only: "registers a valid account …". Today's handler returns the email and name exactly as sent (`"Dana@Example.com"`, `"  Dana  "`). The model's `lowercase` setter never runs, because `User.create` is mocked. The status, the hashed password and the cookie already hold. Note in your report which assertions failed.
- PASS: every other existing test, including the two whose passwords you changed.

- [ ] **Step 3: Implement `readCredentials` and use it in both routes**

In `backend/src/routes/user.routes.ts`, add this block directly after the closing `} as const;` of `cookieOpts`:

```ts
// The rules the login and register forms apply before sending
// (self-storage-hosting/lib/auth-form.ts). The frontend's
// tests/auth-form.test.ts reads these four lines, so change both files
// together.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL = 254;
const MIN_PASSWORD = 8;
const MAX_NAME = 100;

const EMAIL_TAKEN = { code: "EMAIL_TAKEN", message: "Email already registered" } as const;

type Credentials = { email: string; password: string; name?: string };

/**
 * Reads the body into plain strings before anything reaches a query.
 *
 * express.json() passes through whatever JSON the client sent, so `email` can
 * arrive as an object such as { "$ne": null }. Handed to findOne as is, that
 * is a query operator, and it matches the first account in the collection.
 * Requiring strings here keeps every filter below a literal value.
 *
 * Login checks only the shape. An account made before these rules existed
 * must still be able to sign in, so the stricter rules apply at register.
 */
function readCredentials(
  body: unknown,
  mode: "login" | "register"
): { ok: true; value: Credentials } | { ok: false; message: string } {
  const raw = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  if (typeof raw.email !== "string" || typeof raw.password !== "string") {
    return { ok: false, message: "email & password required" };
  }
  const email = raw.email.trim().toLowerCase();
  const password = raw.password;
  if (!email || !password) return { ok: false, message: "email & password required" };
  if (email.length > MAX_EMAIL) return { ok: false, message: "Email is too long" };
  if (mode === "login") return { ok: true, value: { email, password } };

  if (!EMAIL_PATTERN.test(email)) return { ok: false, message: "Enter a valid email address" };
  if (password.length < MIN_PASSWORD) {
    return { ok: false, message: `Password must be at least ${MIN_PASSWORD} characters` };
  }
  // bcrypt reads only the first 72 bytes of a password and ignores the rest,
  // so a longer one would be stored as something weaker than it looks.
  if (bcrypt.truncates(password)) return { ok: false, message: "Password is too long" };
  if (raw.name != null && typeof raw.name !== "string") {
    return { ok: false, message: "Name must be text" };
  }
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  if (name.length > MAX_NAME) {
    return { ok: false, message: `Name must be at most ${MAX_NAME} characters` };
  }
  return { ok: true, value: { email, password, name: name || undefined } };
}
```

Replace the whole `/register` handler with:

```ts
authRouter.post("/register", async (req, res) => {
  const input = readCredentials(req.body, "register");
  if (!input.ok) return res.status(400).json({ code: "BAD_INPUT", message: input.message });
  const { email, password, name } = input.value;

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json(EMAIL_TAKEN);

  const passwordHash = await bcrypt.hash(password, 12);
  // Two requests for the same new email can both pass the check above. The
  // unique index on email stops the second one here. Answer it the same way.
  const user = await User.create({ email, passwordHash, name }).catch((err: unknown) => {
    if ((err as { code?: unknown } | null)?.code === 11000) return null;
    throw err;
  });
  if (!user) return res.status(409).json(EMAIL_TAKEN);

  const token = signToken({ sub: String(user._id), email: user.email });
  res.cookie(COOKIE_NAME, token, cookieOpts);
  res.json({
    user: {
      id: String(user._id),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
  });
});
```

Before replacing it, read the current `/register` handler. If its `signToken(...)` call or its `res.json({ user: … })` fields differ from the block above, keep the current file's versions of those lines. This task changes only input handling and the duplicate-key race.

In the `/login` handler, replace its first line, `const { email, password } = req.body || {};`, with:

```ts
  const input = readCredentials(req.body, "login");
  if (!input.ok) return res.status(400).json({ code: "BAD_INPUT", message: input.message });
  const { email, password } = input.value;
```

Leave the rest of `/login`, and all of `/profile` and `/logout`, unchanged.

- [ ] **Step 4: Run the tests and the type check**

Run: `cd backend && npm test && npx tsc --noEmit`
Expected: every test passes, and tsc prints nothing.

The frontend's legal guard reads this file. Confirm it still passes:

Run: `cd self-storage-hosting && npx vitest run tests/legal.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/src/routes/user.routes.ts backend/tests/app.test.ts
git commit -m "fix(backend): read auth input as plain strings before any query; refuse operator objects and weak or over-long passwords"
```

- [ ] **Step 6: Probe**

Each probe runs in `backend/` against `npx vitest run tests/app.test.ts`.

| Mutation in `backend/src/routes/user.routes.ts` | Must fail naming |
|---|---|
| In `/login`, replace `const input = readCredentials(req.body, "login");` with `const input = { ok: true as const, value: req.body };` | `login refuses an operator object as the email before querying` |
| Delete `.toLowerCase()` from `readCredentials` | `looks the email up trimmed and lower-cased` |
| Change `if (bcrypt.truncates(password))` to `if (password.length > 72)` | `register refuses a password over 72 bytes before querying` |
| In the `.catch` on `User.create`, change `11000` to `11001` | `answers a duplicate-key race with EMAIL_TAKEN, not a 500` |

Run only vitest for these probes. tsc is not the gate being probed. Restore with `git checkout -- backend/src/routes/user.routes.ts` from the repo root after each. Finish with `git status --short`.

---

### Task 13: Typed auth errors and checked responses in the auth client

Spec §9 and §6.10. The login and register forms (Task 14) need four things from `lib/auth-context.tsx` that it does not give them today:

1. **Whether accounts work at all.** `NEXT_PUBLIC_API_BASE` is inlined at build time. When it is unset, `login()` today calls `fetch("undefined/api/users/login")`, which is a relative URL on this site. The context will expose `available`, and every request will fail fast with a typed error instead.
2. **Errors a form can explain.** Today every failure is a bare `Error` carrying the server's own message, such as "Invalid credentials" or "email & password required". Every failure will leave as an `AuthError` with a `code`, and `friendlyAuthError()` turns the code into plain words. It never shows the server's text, which is not written for visitors.
3. **A checked user.** `data.user as User` trusts whatever the server sends. `toUser()` checks the shape and throws `AuthError("BAD_RESPONSE")` otherwise.
4. **The same rules the server applies**, so a visitor hears about a short password before a round trip. `validateAuthInput()` mirrors Task 12's rules, and a test fails when the two files drift.

The failed profile check is also swallowed today: `refreshProfile().catch(() => setReady(true))`. It will log the reason instead. `setReady(true)` already runs in `refreshProfile`'s `finally`.

The context's `error` state goes. The form keeps its own message (Task 14), and nothing else reads `error`. Two places holding the last error would drift.

All of this goes in a new pure module, `lib/auth-form.ts`, so it can be tested without React. `tests/auth-config.test.ts` keeps its source-text shape for the context, and gains three checks.

**Files:**
- Create: `self-storage-hosting/lib/auth-form.ts`
- Create: `self-storage-hosting/tests/auth-form.test.ts`
- Modify: `self-storage-hosting/lib/auth-context.tsx` (replaced in full)
- Modify: `self-storage-hosting/tests/auth-config.test.ts`

**Interfaces:**
- Consumes: Task 12's four constant lines, `bcrypt.truncates(password)`, and the codes `BAD_INPUT`, `INVALID_LOGIN` and `EMAIL_TAKEN` in `backend/src/routes/user.routes.ts`.
- Produces:
  - `lib/auth-form.ts`:
    - `type AuthMode = "login" | "register"`
    - `type AuthInput = { email: string; password: string; name?: string }`
    - `type User = { id: string; email: string; name?: string; createdAt?: string }`
    - `EMAIL_PATTERN`, `MAX_EMAIL` (254), `MIN_PASSWORD` (8), `MAX_PASSWORD_BYTES` (72), `MAX_NAME` (100)
    - `class AuthError extends Error { readonly code: string }`, constructed as `new AuthError(code, message)`
    - `validateAuthInput(mode: AuthMode, input: AuthInput): Record<string, string>`, returning field errors keyed `email`, `password` or `name`
    - `toUser(data: unknown): User`
    - `friendlyAuthError(err: unknown): string`
  - `useAuth()` returns `{ user, ready, available, login, register, logout, refreshProfile }`. `login`, `register` and `logout` reject with an `AuthError`. There is no `error` field any more.

- [ ] **Step 1: Write the failing test for the pure module**

Create `self-storage-hosting/tests/auth-form.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  AuthError,
  EMAIL_PATTERN,
  MAX_EMAIL,
  MAX_NAME,
  MAX_PASSWORD_BYTES,
  MIN_PASSWORD,
  friendlyAuthError,
  toUser,
  validateAuthInput,
  type AuthInput,
} from "@/lib/auth-form";
import { PKG_ROOT } from "./helpers/walk";

const ok: AuthInput = { email: "dana@example.com", password: "long-enough-1" };

describe("validateAuthInput", () => {
  it("accepts a valid login and a valid registration", () => {
    expect(validateAuthInput("login", ok)).toEqual({});
    expect(validateAuthInput("register", { ...ok, name: "Dana" })).toEqual({});
  });

  it("asks for both fields on either form", () => {
    for (const mode of ["login", "register"] as const) {
      expect(Object.keys(validateAuthInput(mode, { email: " ", password: "" })).sort()).toEqual([
        "email",
        "password",
      ]);
    }
  });

  it.each<[string, AuthInput, string]>([
    ["a malformed email", { ...ok, email: "dana-at-example" }, "email"],
    ["an email over the length limit", { ...ok, email: `${"a".repeat(MAX_EMAIL)}@x.co` }, "email"],
    ["a password under the minimum", { ...ok, password: "a".repeat(MIN_PASSWORD - 1) }, "password"],
    // 40 characters but 80 bytes. The limit is bcrypt's, and bcrypt counts bytes.
    ["a 40-character password that is 80 bytes", { ...ok, password: "é".repeat(40) }, "password"],
    ["a name over the length limit", { ...ok, name: "a".repeat(MAX_NAME + 1) }, "name"],
  ])("register rejects %s", (_label, input, field) => {
    expect(Object.keys(validateAuthInput("register", input))).toEqual([field]);
  });

  it("accepts a password of exactly the minimum length and exactly the byte limit", () => {
    expect(validateAuthInput("register", { ...ok, password: "a".repeat(MIN_PASSWORD) })).toEqual({});
    expect(validateAuthInput("register", { ...ok, password: "a".repeat(MAX_PASSWORD_BYTES) })).toEqual({});
  });

  it("checks only that login fields are filled, so older accounts can still sign in", () => {
    expect(validateAuthInput("login", { email: "dana-at-example", password: "short" })).toEqual({});
  });
});

// The code an AuthError carries, "not an AuthError" for any other throw, or
// undefined when nothing was thrown.
function codeOf(run: () => unknown): string | undefined {
  try {
    run();
  } catch (e) {
    return e instanceof AuthError ? e.code : "not an AuthError";
  }
  return undefined;
}

describe("toUser", () => {
  it("keeps the fields the server sends", () => {
    const user = { id: "u1", email: "dana@example.com", name: "Dana", createdAt: "2026-09-18T00:00:00.000Z" };
    expect(toUser({ user })).toEqual(user);
  });

  it("drops a name or date that is not text", () => {
    expect(toUser({ user: { id: "u1", email: "dana@example.com", name: 5, createdAt: null } })).toEqual({
      id: "u1",
      email: "dana@example.com",
    });
  });

  it.each<[string, unknown]>([
    ["an empty body", null],
    ["a body with no user", {}],
    ["a numeric id", { user: { id: 1, email: "dana@example.com" } }],
    ["a user with no email", { user: { id: "u1" } }],
  ])("refuses %s", (_label, data) => {
    expect(codeOf(() => toUser(data))).toBe("BAD_RESPONSE");
  });
});

describe("friendlyAuthError", () => {
  it.each<[string, RegExp]>([
    ["INVALID_LOGIN", /do not match an account/],
    ["EMAIL_TAKEN", /already uses that email address/],
    ["BAD_INPUT", /check your email address and password/],
    ["NETWORK", /could not reach/],
    ["UNAVAILABLE", /not available/],
  ])("explains %s in plain words", (code, words) => {
    expect(friendlyAuthError(new AuthError(code, "server wording"))).toMatch(words);
  });

  it("never shows the server's own message, which is not written for visitors", () => {
    for (const code of ["SERVER_ERROR", "BAD_RESPONSE", "HTTP_ERROR", "constructor", "INVALID_LOGIN"]) {
      expect(friendlyAuthError(new AuthError(code, "E11000 duplicate key users.email"))).not.toContain("E11000");
    }
    expect(friendlyAuthError(new Error("E11000 duplicate key"))).not.toContain("E11000");
    expect(friendlyAuthError("not even an error")).toMatch(/went wrong/);
  });
});

describe("the account server's rules", () => {
  it("are the rules the forms apply", () => {
    const server = readFileSync(path.join(PKG_ROOT, "..", "backend", "src", "routes", "user.routes.ts"), "utf8");
    const expected = [
      `const EMAIL_PATTERN = /${EMAIL_PATTERN.source}/;`,
      `const MAX_EMAIL = ${MAX_EMAIL};`,
      `const MIN_PASSWORD = ${MIN_PASSWORD};`,
      `const MAX_NAME = ${MAX_NAME};`,
      // bcrypt's own check of its 72-byte limit, which MAX_PASSWORD_BYTES mirrors.
      "bcrypt.truncates(password)",
    ];
    const missing = expected.filter((line) => !server.includes(line));
    expect(missing, `backend/src/routes/user.routes.ts no longer says: ${missing.join(" | ")}`).toEqual([]);
    expect(MAX_PASSWORD_BYTES).toBe(72);
  });
});
```

Run: `cd self-storage-hosting && npx vitest run tests/auth-form.test.ts`
Expected: FAIL, because `@/lib/auth-form` does not exist.

- [ ] **Step 2: Create `lib/auth-form.ts`**

```ts
// Rules, types and messages for the login and register forms, kept free of
// React so they can be tested directly. The account server applies the same
// rules (backend/src/routes/user.routes.ts), and tests/auth-form.test.ts
// fails when the two drift apart.

export type AuthMode = "login" | "register";
export type AuthInput = { email: string; password: string; name?: string };
export type User = { id: string; email: string; name?: string; createdAt?: string };

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MAX_EMAIL = 254;
export const MIN_PASSWORD = 8;
// bcrypt reads only the first 72 bytes of a password. That is bytes, not
// characters: "é" is one character and two bytes.
export const MAX_PASSWORD_BYTES = 72;
export const MAX_NAME = 100;

/** A failed account request. `code` is the server's code, or one of ours. */
export class AuthError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

/**
 * Field errors keyed by field name, or {} when the input can be sent.
 * Login checks only that both fields are filled, as the server does, so an
 * account made before the register rules existed can still sign in.
 */
export function validateAuthInput(mode: AuthMode, input: AuthInput): Record<string, string> {
  const errors: Record<string, string> = {};
  const register = mode === "register";

  const email = input.email.trim();
  if (!email) errors.email = "Please enter your email address.";
  else if (email.length > MAX_EMAIL) errors.email = "That email address is too long.";
  else if (register && !EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email address.";

  const password = input.password;
  if (!password) errors.password = register ? "Please choose a password." : "Please enter your password.";
  else if (register && password.length < MIN_PASSWORD) {
    errors.password = `Please use at least ${MIN_PASSWORD} characters.`;
  } else if (register && new TextEncoder().encode(password).length > MAX_PASSWORD_BYTES) {
    errors.password = "That password is too long. Please use a shorter one.";
  }

  if (register && (input.name ?? "").trim().length > MAX_NAME) {
    errors.name = `Please keep your name to ${MAX_NAME} characters or fewer.`;
  }
  return errors;
}

/** The `user` in a server response, checked. Throws AuthError("BAD_RESPONSE") otherwise. */
export function toUser(data: unknown): User {
  const user = (data as { user?: unknown } | null)?.user;
  if (!user || typeof user !== "object") {
    throw new AuthError("BAD_RESPONSE", "The account server sent no user");
  }
  const { id, email, name, createdAt } = user as Record<string, unknown>;
  if (typeof id !== "string" || typeof email !== "string") {
    throw new AuthError("BAD_RESPONSE", "The account server sent an incomplete user");
  }
  return {
    id,
    email,
    ...(typeof name === "string" && name ? { name } : {}),
    ...(typeof createdAt === "string" ? { createdAt } : {}),
  };
}

// A Map, not an object: an object literal would answer a code such as
// "constructor" with a function from its prototype.
const FRIENDLY = new Map<string, string>([
  ["INVALID_LOGIN", "That email and password do not match an account."],
  ["EMAIL_TAKEN", "An account already uses that email address. Try logging in instead."],
  ["BAD_INPUT", "Please check your email address and password, then try again."],
  ["NETWORK", "We could not reach the account server. Please check your connection and try again."],
  ["UNAVAILABLE", "Signing in is not available right now."],
]);
const FALLBACK = "Something went wrong. Please try again in a moment.";

/** Plain words for any failure. Never the server's own message. */
export function friendlyAuthError(err: unknown): string {
  return (err instanceof AuthError && FRIENDLY.get(err.code)) || FALLBACK;
}
```

Run: `cd self-storage-hosting && npx vitest run tests/auth-form.test.ts`
Expected: PASS.

- [ ] **Step 3: Add the failing context checks**

In `self-storage-hosting/tests/auth-config.test.ts`, add these three cases at the end of the `describe` block, after `"reads the API base from exactly one constant"`:

```ts
  it("says when accounts are unavailable instead of calling an undefined address", () => {
    // Without an API base, `${API}/api/users/login` is "undefined/api/users/login",
    // which the browser resolves against this site.
    expect(src).toMatch(/available:\s*boolean/);
    expect(src).toMatch(/if \(!API\) throw new AuthError\("UNAVAILABLE"/);
  });

  it("checks the user the server sends instead of casting it", () => {
    expect(src, "a response is cast to User").not.toMatch(/\bas User\b/);
    expect((src.match(/\btoUser\(/g) ?? []).length, "login, register and the profile check should each call toUser").toBe(3);
  });

  it("logs a failed profile check instead of swallowing it", () => {
    expect(src).toMatch(/refreshProfile\(\)\.catch\(\(err\) => console\.error\(/);
  });
```

Run: `cd self-storage-hosting && npx vitest run tests/auth-config.test.ts`
Expected: FAIL on the three new cases. The six existing cases pass.

- [ ] **Step 4: Replace `lib/auth-context.tsx`**

Replace `self-storage-hosting/lib/auth-context.tsx` in full. The existing checks in `tests/auth-config.test.ts` still hold:
- The file names the env var once.
- Each of its two `fetch(` calls sends `credentials: "include"`.
- It never contains the word "token".

Keep comments free of the strings `fetch(` and `credentials`, because that test counts them.

```tsx
"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthError, toUser, type User } from "@/lib/auth-form";

const API = process.env.NEXT_PUBLIC_API_BASE;
const AVAILABLE = Boolean(API);

type AuthCtx = {
  user: User | null;
  ready: boolean;
  // False when the site was built without an account server address. The
  // forms say so, instead of sending requests that cannot work.
  available: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

// The server answers every failure with { code, message }. The code is kept
// so the form can explain it with friendlyAuthError(). The message is for
// the console, not for visitors.
function errorFrom(data: unknown, status: number): AuthError {
  const { code, message } = (data ?? {}) as { code?: unknown; message?: unknown };
  return new AuthError(
    typeof code === "string" ? code : "HTTP_ERROR",
    typeof message === "string" ? message : `Request failed (${status})`
  );
}

async function post(path: string, body: unknown): Promise<unknown> {
  if (!API) throw new AuthError("UNAVAILABLE", "NEXT_PUBLIC_API_BASE is not set");
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });
  } catch (e) {
    throw new AuthError("NETWORK", e instanceof Error ? e.message : String(e));
  }
  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) throw errorFrom(data, res.status);
  return data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // When there is no API base there is nothing to await, so ready starts true.
  const [ready, setReady] = useState(!API);

  const refreshProfile = useCallback(async () => {
    if (!API) return;
    try {
      const res = await fetch(`${API}/api/users/profile`, { credentials: "include" });
      if (res.status === 401) {
        setUser(null);
        return;
      }
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) throw errorFrom(data, res.status);
      setUser(toUser(data));
    } finally {
      setReady(true);
    }
  }, []);

  // Runs only after mount, so nothing here affects prerendered HTML.
  useEffect(() => {
    if (!API) {
      console.error("NEXT_PUBLIC_API_BASE is not set; signing in is unavailable.");
      return;
    }
    // A failed check leaves the visitor signed out, which is safe. The reason
    // still has to reach the console instead of disappearing.
    refreshProfile().catch((err) => console.error("Could not check the signed-in account:", err));
  }, [refreshProfile]);

  const login = useCallback(async (email: string, password: string) => {
    setUser(toUser(await post("/api/users/login", { email, password })));
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    setUser(toUser(await post("/api/users/register", { email, password, name })));
  }, []);

  const logout = useCallback(async () => {
    await post("/api/users/logout", {});
    setUser(null);
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({ user, ready, available: AVAILABLE, login, register, logout, refreshProfile }),
    [user, ready, login, register, logout, refreshProfile]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
```

Run: `cd self-storage-hosting && npx vitest run tests/auth-config.test.ts tests/auth-form.test.ts`
Expected: PASS, all nine auth-config cases and every auth-form case.

- [ ] **Step 5: Gates**

Run: `cd self-storage-hosting && npm run lint && npm test && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts`
Expected: all pass. No page uses the provider yet, so the built HTML does not change.

- [ ] **Step 6: Commit**

```bash
git add self-storage-hosting/lib/auth-form.ts self-storage-hosting/tests/auth-form.test.ts self-storage-hosting/lib/auth-context.tsx self-storage-hosting/tests/auth-config.test.ts
git commit -m "feat(auth): typed auth errors, checked user responses and the server's own input rules in the client"
```

- [ ] **Step 7: Probe**

| Mutation | Run | Must fail naming |
|---|---|---|
| In `backend/src/routes/user.routes.ts`, change `const MIN_PASSWORD = 8;` to `const MIN_PASSWORD = 6;` | `npx vitest run tests/auth-form.test.ts` | `const MIN_PASSWORD = 8;` |
| In `lib/auth-form.ts`, change `new TextEncoder().encode(password).length` to `password.length` | `npx vitest run tests/auth-form.test.ts` | `a 40-character password that is 80 bytes` |
| In `lib/auth-form.ts`, change `FRIENDLY.get(err.code)` to `(FRIENDLY.get(err.code) ?? err.message)` | `npx vitest run tests/auth-form.test.ts` | `never shows the server's own message` |
| In `lib/auth-context.tsx`, change `setUser(toUser(data));` to `setUser((data as { user: unknown }).user as User);` | `npx vitest run tests/auth-config.test.ts` | `a response is cast to User` |
| In `lib/auth-context.tsx`, delete the line `if (!API) throw new AuthError("UNAVAILABLE", "NEXT_PUBLIC_API_BASE is not set");` | `npx vitest run tests/auth-config.test.ts` | `says when accounts are unavailable` |

Run each from `self-storage-hosting/`. Restore with `git checkout -- <file>` after each. The backend probe needs `git checkout -- backend/src/routes/user.routes.ts` from the repo root. Finish with `git status --short`.

---

### Task 14: /user/login and /user/register

Spec §6.10, §7.5 and §4.1. Both routes are noindex and are already disallowed in `robots.ts`. The requirements, from §6.10:
- real `<label>` elements, never a placeholder used as a label;
- `autocomplete="current-password"` on login and `"new-password"` on register;
- errors wired with `aria-describedby`, and the result announced in a live region;
- submit disabled while the auth context is unresolved;
- `noindex`.

`/legal/accessibility` (Task 11) already promises that every form on the site marks invalid fields, links them to their message, and announces the result. A new guard, `tests/form-a11y.test.ts`, holds every form component in `components/` to that promise, and to labels on every field.

**Where the provider goes.** Only these two pages need the signed-in state, so a new `(auth)` route group gets its own layout with `AuthProvider`. Marketing pages never mount it, so they never call the account server. The URLs stay `/user/login` and `/user/register`, because route groups do not appear in the URL.

**One page frame.** The skip link, both nav bars, `<main id="main">` and the footer are written out twice today, in `app/(marketing)/layout.tsx` and `app/not-found.tsx`. The `(auth)` layout would be a third copy. They move into `components/SiteChrome.tsx`, and a rendered check confirms that every built page starts with the skip link and has exactly one `<main id="main">`.

**When accounts are unavailable.** `NEXT_PUBLIC_API_BASE` is inlined at build time. If a build has none, the form would send requests that cannot work. So `AuthForm` shows one plain sentence instead, pointing to the contact form. The local gates build without the variable, so the rendered pages show that sentence. Step 8 builds once with it to check the form's own markup.

The h1 stays in each `page.tsx`, not in `AuthForm`. `tests/sitemap-coverage.test.ts` counts h1s in the page file (Task 1).

**Files:**
- Create: `self-storage-hosting/tests/form-a11y.test.ts`
- Create: `self-storage-hosting/components/SiteChrome.tsx`
- Modify: `self-storage-hosting/app/(marketing)/layout.tsx` (uses SiteChrome)
- Modify: `self-storage-hosting/app/not-found.tsx` (uses SiteChrome)
- Modify: `self-storage-hosting/components/nav/MainNav.tsx` (one comment names SiteChrome)
- Modify: `self-storage-hosting/tests/rendered.test.ts` (one new test)
- Create: `self-storage-hosting/components/AuthForm.tsx`
- Create: `self-storage-hosting/app/(auth)/layout.tsx`
- Create: `self-storage-hosting/app/(auth)/user/login/page.tsx`
- Create: `self-storage-hosting/app/(auth)/user/register/page.tsx`
- Modify: `self-storage-hosting/lib/site.ts` (two `built` flags)

**Interfaces:**
- Consumes:
  - `useAuth()` returning `{ user, ready, available, login, register, logout }`, which reject with `AuthError` (Task 13);
  - `validateAuthInput`, `friendlyAuthError`, `MIN_PASSWORD`, `MAX_NAME` and `AuthMode` from `lib/auth-form.ts` (Task 13);
  - `Breadcrumbs` with `crumbs: { name: string; path: string }[]`, which calls `assertLive(c.path, \`Breadcrumb "${c.name}"\`)` (Task 2);
  - `read`, `visible` and `built` inside `tests/rendered.test.ts` (Task 1);
  - `/legal/privacy`, built in Task 10.
- Produces:
  - `SiteChrome({ children, mainClassName? })`. `mainClassName` defaults to `"flex-1"`.
  - `AuthForm({ mode }: { mode: AuthMode })`.

- [ ] **Step 1: Write the failing form guard**

Create `self-storage-hosting/tests/form-a11y.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { PKG_ROOT, walkFrom } from "./helpers/walk";

// Every component that renders a <form>. Found from the source tree, so a new
// form is held to /legal/accessibility the day it is written.
const forms: [string, string][] = walkFrom("components", /\.tsx$/)
  .map((f): [string, string] => [path.relative(PKG_ROOT, f).split(path.sep).join("/"), readFileSync(f, "utf8")])
  .filter(([, src]) => /<form\b/.test(src));

// Each form control's opening tag, up to the next "<". The attribute values in
// these files are strings, identifiers and ternaries, none of which contain
// "<", so the slice holds the whole tag.
function controls(src: string) {
  return [...src.matchAll(/<(input|select|textarea)\b([^<]*)/g)].map((m) => ({
    attrs: m[2],
    id: m[2].match(/\bid="([^"]+)"/)?.[1] ?? `a <${m[1]}> with no id`,
  }));
}

describe("forms keep the promises made on /legal/accessibility", () => {
  it("finds the site's forms", () => {
    expect(forms.map(([file]) => file)).toEqual(
      expect.arrayContaining(["components/ContactForm.tsx", "components/AuthForm.tsx"])
    );
  });

  it.each(forms)("%s gives every field a visible label", (file, src) => {
    const unlabelled = controls(src)
      .map((c) => c.id)
      .filter((id) => !src.includes(`htmlFor="${id}"`));
    expect(unlabelled, `${file}: fields with no <label htmlFor>: ${unlabelled.join(", ")}`).toEqual([]);
  });

  it.each(forms)("%s marks invalid fields and links each to its message", (file, src) => {
    const checked = controls(src).filter((c) => /aria-invalid=/.test(c.attrs));
    expect(checked.length, `${file} marks no field invalid`).toBeGreaterThan(0);
    const unlinked = checked.filter((c) => !/aria-describedby=/.test(c.attrs)).map((c) => c.id);
    expect(unlinked, `${file}: invalid fields not linked to a message: ${unlinked.join(", ")}`).toEqual([]);
    const targets = new Set([...src.matchAll(/"([A-Za-z]+-(?:error|hint))"/g)].map((m) => m[1]));
    const missing = [...targets].filter((t) => !src.includes(`id="${t}"`));
    expect(missing, `${file}: aria-describedby names no element: ${missing.join(", ")}`).toEqual([]);
  });

  it.each(forms)("%s announces its result in a live region", (file, src) => {
    expect(src, `${file} has no role="status" aria-live="polite" region`).toMatch(
      /role="status"\s+aria-live="polite"|aria-live="polite"\s+role="status"/
    );
  });

  it.each(forms)("%s tells password managers what each password field holds", (file, src) => {
    const bare = controls(src)
      .filter((c) => /type="password"/.test(c.attrs) && !/autoComplete=/.test(c.attrs))
      .map((c) => c.id);
    expect(bare, `${file}: password fields with no autoComplete: ${bare.join(", ")}`).toEqual([]);
  });

  it("uses the password autocomplete values spec 6.10 names", () => {
    const auth = forms.find(([file]) => file === "components/AuthForm.tsx")?.[1] ?? "";
    expect(auth).toContain('"current-password"');
    expect(auth).toContain('"new-password"');
  });
});
```

Run: `cd self-storage-hosting && npx vitest run tests/form-a11y.test.ts`
Expected:
- FAIL: "finds the site's forms" and "uses the password autocomplete values spec 6.10 names", because `components/AuthForm.tsx` does not exist.
- PASS: every `components/ContactForm.tsx` case. That confirms the guard reads the existing form correctly.

- [ ] **Step 2: Move the page frame into `SiteChrome`**

Create `self-storage-hosting/components/SiteChrome.tsx`:

```tsx
import TopBar from "@/components/nav/TopBar";
import MainNav from "@/components/nav/MainNav";
import Footer from "@/components/Footer";

/**
 * The frame every page shares: the skip link, both nav bars, <main> and the
 * footer. The skip link has to be the first thing a keyboard reaches and has
 * to point at <main id="main">, so the frame is written once, here.
 * tests/rendered.test.ts checks both on every built page.
 */
export default function SiteChrome({
  children,
  mainClassName = "flex-1",
}: {
  children: React.ReactNode;
  mainClassName?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent-50 focus:px-4 focus:py-2 focus:text-text-950"
      >
        Skip to content
      </a>
      <TopBar />
      <MainNav />
      <main id="main" className={mainClassName}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

Before writing it, open `app/(marketing)/layout.tsx`. If its wrapper `div`, skip link or `main` classes differ from the block above, copy the layout's classes into SiteChrome. This step moves markup. It does not change it.

Replace `self-storage-hosting/app/(marketing)/layout.tsx` in full:

```tsx
import SiteChrome from "@/components/SiteChrome";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
```

In `self-storage-hosting/app/not-found.tsx`:
1. Replace the three imports of `TopBar`, `MainNav` and `Footer` with `import SiteChrome from "@/components/SiteChrome";`.
2. Replace everything from the opening `<div className="flex min-h-screen flex-col">` through the opening `<main …>` tag with:

```tsx
    <SiteChrome mainClassName="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-20 text-center">
```

3. Replace everything from the closing `</main>` through the closing `</div>` with `</SiteChrome>`.

The content between them (the "Oops!" line, the h1, the paragraph and the "Go to homepage" link) does not change.

In `self-storage-hosting/components/nav/MainNav.tsx`, the Escape-key comment says the skip link "is rendered by the marketing layout OUTSIDE <header>". Change "by the marketing layout" to "by SiteChrome". Change nothing else in that file.

- [ ] **Step 3: Check the frame in the built HTML**

Add this test to `self-storage-hosting/tests/rendered.test.ts`, inside `describe.skipIf(!RUN)("rendered HTML", …)`, after the INSOMNIAC test:

```ts
  it.each(built)("%s starts with a skip link to its one <main id=\"main\">", (r) => {
    // /legal/accessibility says the skip link is the first thing a keyboard
    // reaches. The first link in <body> is the first focusable element here:
    // nothing before it is a button or a field.
    const html = visible(read(r));
    const body = html.slice(html.indexOf("<body"));
    expect(body.match(/<a\b[^>]*>/)?.[0] ?? "", `${r}: the first link is not the skip link`).toMatch(
      /\bhref="#main"/
    );
    const mains = (body.match(/<main\b[^>]*\bid="main"/g) ?? []).length;
    expect(mains, `${r} has ${mains} <main id="main"> elements`).toBe(1);
  });
```

Run: `cd self-storage-hosting && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts`
Expected: PASS for every built page. The frame's markup did not change, only where it is written.

- [ ] **Step 4: Create `AuthForm`**

Create `self-storage-hosting/components/AuthForm.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { friendlyAuthError, validateAuthInput, MAX_NAME, MIN_PASSWORD, type AuthMode } from "@/lib/auth-form";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

/**
 * The login and register form. /legal/accessibility promises what every form
 * on the site does, and tests/form-a11y.test.ts holds this file to it: a
 * visible label for each field, invalid fields marked and linked to their
 * message, and the result announced in a live region. The page renders the
 * h1, not this component.
 */
export default function AuthForm({ mode }: { mode: AuthMode }) {
  const { user, ready, available, login, register, logout } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  // Runs one account request, then says how it went in the live region.
  async function run(request: () => Promise<void>, done: string) {
    setBusy(true);
    setMessage("");
    try {
      await request();
      setFailed(false);
      setMessage(done);
    } catch (err) {
      setFailed(true);
      setMessage(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const input = {
      email: String(data.get("email") ?? "").trim(),
      password: String(data.get("password") ?? ""),
      name: String(data.get("name") ?? "").trim(),
    };
    const found = validateAuthInput(mode, input);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setFailed(true);
      setMessage("Please fix the fields marked above.");
      return;
    }
    await run(
      () =>
        mode === "login"
          ? login(input.email, input.password)
          : register(input.email, input.password, input.name || undefined),
      mode === "login" ? "You are signed in." : "Your account is ready, and you are signed in."
    );
  }

  const link = `font-semibold underline ${FOCUS_RING_LIGHT}`;
  const field = `mt-1 w-full rounded-lg border border-background-600 bg-white px-3 py-2 ${FOCUS_RING_LIGHT}`;
  const button = `mt-6 rounded-full bg-accent-500 px-6 py-3 font-semibold text-text-950 transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:bg-background-200 ${FOCUS_RING_LIGHT}`;

  if (!available) {
    return (
      <p className="mt-6 text-text-800">
        Signing in is not available right now. If you need help, use the{" "}
        <Link href="/contact" className={link}>
          contact form
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="mt-6">
      {ready && user ? (
        <div>
          <p className="text-text-800">
            You are signed in as <strong>{user.email}</strong>.
          </p>
          <button type="button" onClick={() => run(logout, "You are signed out.")} disabled={busy} className={button}>
            Log out
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={onSubmit} noValidate>
            {mode === "register" && (
              <div className="mb-5">
                <label htmlFor="name" className="font-medium">
                  Name <span className="font-normal text-text-700">(optional)</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={MAX_NAME}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={field}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-700">
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="email" className="font-medium">
                Email <span aria-hidden="true">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={field}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-700">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="mt-5">
              <label htmlFor="password" className="font-medium">
                Password <span aria-hidden="true">*</span>
              </label>
              {mode === "register" && (
                <p id="password-hint" className="mt-1 text-sm text-text-700">
                  At least {MIN_PASSWORD} characters.
                </p>
              )}
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                aria-invalid={!!errors.password}
                aria-describedby={
                  [mode === "register" ? "password-hint" : "", errors.password ? "password-error" : ""]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
                className={field}
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-700">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Disabled until the signed-in check has finished (spec 6.10). */}
            <button type="submit" disabled={!ready || busy} className={button}>
              {busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-text-800">
            {mode === "login" ? (
              <>
                New here?{" "}
                <Link href="/user/register" className={link}>
                  Create an account
                </Link>
                .
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/user/login" className={link}>
                  Log in
                </Link>
                .
              </>
            )}
          </p>
        </>
      )}

      {/* Stays mounted across the switch between the form and the signed-in
          view, so "You are signed in." is still announced. */}
      <p role="status" aria-live="polite" className={`mt-4 text-sm ${failed ? "text-red-700" : "text-accent-800"}`}>
        {message}
      </p>
    </div>
  );
}
```

Notes for the implementer:
- The disabled button uses `disabled:bg-background-200`, not `disabled:opacity-60`. The Global Constraints forbid `opacity-*` on anything carrying text. WCAG 1.4.3 does not require contrast on a disabled control, and the contrast guard measures text tokens, not backgrounds.
- Every field id is a string literal, and each `aria-describedby` target is written out as a literal (`"name-error"`, `"password-hint"` and so on). The form guard reads them that way. Do not build ids from a variable.
- The contact form's fields use the same ids (`name`, `email`). The two forms never share a page.

Run: `cd self-storage-hosting && npx vitest run tests/form-a11y.test.ts`
Expected: PASS, for both forms.

- [ ] **Step 5: Create the `(auth)` layout and both pages**

Create `self-storage-hosting/app/(auth)/layout.tsx`:

```tsx
import { AuthProvider } from "@/lib/auth-context";
import SiteChrome from "@/components/SiteChrome";

// Only the account pages need the signed-in state, so only they mount the
// provider. Marketing pages never call the account server.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SiteChrome>{children}</SiteChrome>
    </AuthProvider>
  );
}
```

Create `self-storage-hosting/app/(auth)/user/login/page.tsx`:

```tsx
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = pageMeta({
  title: "Log In",
  description: "Log in to your Self Storage Hosting account.",
  path: "/user/login",
});

export default function LoginPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Log In", path: "/user/login" },
        ]}
      />

      <div className="mx-auto max-w-md px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Log in</h1>
        <AuthForm mode="login" />
      </div>
    </>
  );
}
```

Create `self-storage-hosting/app/(auth)/user/register/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import AuthForm from "@/components/AuthForm";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

export const metadata: Metadata = pageMeta({
  title: "Create an Account",
  description: "Create a Self Storage Hosting account with your email address and a password.",
  path: "/user/register",
});

export default function RegisterPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Create an Account", path: "/user/register" },
        ]}
      />

      <div className="mx-auto max-w-md px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Create an account</h1>
        <AuthForm mode="register" />
        <p className="mt-8 text-sm text-text-700">
          Our{" "}
          <Link href="/legal/privacy" className={`underline ${FOCUS_RING_LIGHT}`}>
            privacy policy
          </Link>{" "}
          explains what we store when you create an account.
        </p>
      </div>
    </>
  );
}
```

`pageMeta()` sets `noindex` from `ROUTES`, where both routes are `indexable: false`. Do not pass `noindex` yourself. Before writing the pages, open one built page from an earlier task, for example `app/(marketing)/legal/privacy/page.tsx` (Task 10). If its `pageMeta` import path or its `Breadcrumbs` usage differs from the blocks above, follow that page.

- [ ] **Step 6: Flip both routes**

In `lib/site.ts`, set `"/user/login"` and `"/user/register"` to `built: true`.

The utility bar's "Login" link (`NAV.utility`, rendered through `liveNav()`) is now live, so it appears on every page. `indexableRoutes()` is unchanged because both routes are noindex. Leave the array in `tests/sitemap-coverage.test.ts` as Task 11 left it.

- [ ] **Step 7: Gates and rendered checks**

Run: `cd self-storage-hosting && npm run lint && npm test && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts`
Expected: all pass. The rendered checks now include `/user/login` and `/user/register`, with `noindex` robots, one h1, and the skip link.

```bash
cd self-storage-hosting
grep -o '<meta name="robots" content="[^"]*"' .next/server/app/user/login.html
grep -o 'href="/user/login"' .next/server/app/index.html | wc -l
grep -c 'Signing in is not available right now' .next/server/app/user/login.html
```

Expected:
- A robots meta whose content starts with `noindex`.
- `1` or more: the utility bar's Login link.
- `1`: this build has no `NEXT_PUBLIC_API_BASE`, so the page shows the unavailable sentence instead of a form that cannot work.

- [ ] **Step 8: Check the form's own markup in a build that has an API base**

In Git Bash:

```bash
cd self-storage-hosting
NEXT_PUBLIC_API_BASE=http://localhost:4000 npm run build
grep -o 'autocomplete="[^"]*"' .next/server/app/user/login.html
grep -o 'autocomplete="[^"]*"' .next/server/app/user/register.html
grep -o '<button type="submit"[^>]*>' .next/server/app/user/login.html
npm run build
```

Expected:
- login: `autocomplete="email"` and `autocomplete="current-password"`.
- register: `autocomplete="name"`, `autocomplete="email"` and `autocomplete="new-password"`.
- The submit button carries `disabled=""`. The prerendered page has not finished its signed-in check, so submit starts disabled (spec §6.10).
- The final `npm run build` puts `.next` back to the normal build, without the variable.

- [ ] **Step 9: Commit**

```bash
git add self-storage-hosting/tests/form-a11y.test.ts self-storage-hosting/components/SiteChrome.tsx "self-storage-hosting/app/(marketing)/layout.tsx" self-storage-hosting/app/not-found.tsx self-storage-hosting/components/nav/MainNav.tsx self-storage-hosting/tests/rendered.test.ts self-storage-hosting/components/AuthForm.tsx "self-storage-hosting/app/(auth)/layout.tsx" "self-storage-hosting/app/(auth)/user/login/page.tsx" "self-storage-hosting/app/(auth)/user/register/page.tsx" self-storage-hosting/lib/site.ts
git commit -m "feat(auth): accessible login and register pages on a shared page frame"
```

- [ ] **Step 10: Probe**

| Mutation | Run | Must fail naming |
|---|---|---|
| In `components/AuthForm.tsx`, delete `aria-describedby={errors.email ? "email-error" : undefined}` | `npx vitest run tests/form-a11y.test.ts` | `components/AuthForm.tsx: invalid fields not linked to a message: email` |
| In `components/AuthForm.tsx`, change `htmlFor="password"` to `htmlFor="pw"` | `npx vitest run tests/form-a11y.test.ts` | `components/AuthForm.tsx: fields with no <label htmlFor>: password` |
| In `components/AuthForm.tsx`, change `id="password-hint"` to `id="pw-hint"` | `npx vitest run tests/form-a11y.test.ts` | `aria-describedby names no element: password-hint` |
| In `components/AuthForm.tsx`, delete `role="status"` | `npx vitest run tests/form-a11y.test.ts` | `components/AuthForm.tsx has no role="status"` |
| In `components/SiteChrome.tsx`, change `href="#main"` to `href="#content"`, then `npm run build` | `RENDERED=1 npx vitest run tests/rendered.test.ts` | `the first link is not the skip link` |
| In `lib/site.ts`, set `"/user/login"` back to `built: false` | `npm run build` | `Breadcrumb "Log In" links to /user/login` |

After the rendered probe, restore the file and run `npm run build` again so `.next` matches the committed source. Restore with `git checkout -- <file>` after each. Finish with `git status --short`.

---


### Task 15: Close the interim link rule and record the deploy steps

Spec §4.1 and §7.6. Since Task 1, both link guards (`tests/source-links.test.ts` and the rendered check) have used an **interim** rule. A link could name a route that is in `ROUTES` but not yet built, because the home and about-us pages linked pages that Tasks 3–6 built later. Every page this plan builds now exists. The rule becomes the one the site is meant to keep: **a link may name a built route and nothing else.**

This task also writes down what only the owner can do after deploy: switching accounts on, checking cookies, watching `/events` refresh, the quarterly events review and the legal review.

**Files:**
- Modify: `self-storage-hosting/tests/helpers/links.ts`
- Modify: `docs/deploy-checklist.md`

**Interfaces:**
- Consumes: `isLive(path: string): boolean` from `lib/site.ts` (Task 1), and every page built by Tasks 3–14.
- Produces: `allowedLink(p)` returns exactly `isLive(p)`.

- [ ] **Step 1: Show the gap the interim rule leaves**

In Git Bash, from `self-storage-hosting/`:

```bash
grep -n "built: false" lib/site.ts
```

Expected: exactly one line, for `"/resources"`, which is Plan 3's route. If any other route is still `built: false`, stop and report it. An earlier task did not finish.

Now show that the interim rule would let a dead link through. In `lib/site.ts`, set `"/demo"` to `built: false`, then run:

```bash
npx vitest run tests/source-links.test.ts
```

Expected: PASS. Pages across the site still link `/demo`, and the interim rule allows it because `/demo` is in `ROUTES`. That is the gap this task closes.

Restore with `git checkout -- lib/site.ts`.

- [ ] **Step 2: Tighten the rule**

Replace `self-storage-hosting/tests/helpers/links.ts` in full:

```ts
import { isLive } from "@/lib/site";

// Which internal paths a link may name: built routes only.
//
// Both link guards use this: tests/source-links.test.ts for every href
// literal in the source, and tests/rendered.test.ts for every link in the
// built HTML. A page that is not built yet is added to ROUTES with
// `built: false`, and no link may name it until the commit that builds it
// flips the flag.
export function allowedLink(p: string): boolean {
  return isLive(p);
}
```

The old body's `ROUTES` import and `isPlan3` helper go with it. `/resources` is `built: false`, so `isLive` already refuses it. With `noUnusedLocals` on, keeping either would fail the build.

- [ ] **Step 3: Run every gate**

In Git Bash:

```bash
cd self-storage-hosting && npm run lint && npm test && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts
cd ../backend && npm test && npx tsc --noEmit
```

Expected: everything passes. If a link guard fails, it names a page and a link to a route that is not built. That is a real dead link. Remove the link. Do not loosen the rule.

- [ ] **Step 4: Probe the tightened rule**

Repeat Step 1's mutation: in `lib/site.ts`, set `"/demo"` to `built: false`, then run:

```bash
npx vitest run tests/source-links.test.ts
```

Expected: FAIL, with `dead or forbidden links:` naming `-> /demo` for each file that links it. The same mutation passed in Step 1, so this failure comes from the new rule.

Restore with `git checkout -- lib/site.ts`, then run `git status --short`. Expect only the two files this task changes.

- [ ] **Step 5: Add the Plan 2 deploy steps**

Append this section to the end of `docs/deploy-checklist.md`, after the existing hosting item and a blank line:

```markdown

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
```

- [ ] **Step 6: Commit**

```bash
git add self-storage-hosting/tests/helpers/links.ts docs/deploy-checklist.md
git commit -m "test(links): allow links to built routes only; add the Plan 2 deploy steps"
```

---

## After the last task

The controller does these, not an implementer:

1. Update PR #1's title and body. Summarize Plans 1 and 2, and keep the merge hold. Its reason changes from "until Plan 2" to "until the owner-blocked items in `docs/deploy-checklist.md` that are marked before PR #1 merges": the legal review and the cookie check.
2. Verify the preview deploy by loading every built route and confirming the home page's links. Never send a valid POST to `/api/contact`. Probe it only with an invalid body such as `{}`.
3. Leave these to the owner. Each one is in `docs/deploy-checklist.md`:
   - the apex-to-www redirect;
   - the Rich Results Test, Lighthouse and Search Console;
   - spec §14 A, B, C, D3, E1 and F;
   - the legal review;
   - the backend deploy and `NEXT_PUBLIC_API_BASE`.

---


## Appendix A: Verified third-party facts

Only verified items, all checked 2026-09-18.

### A.1 Events

All are future relative to 2026-09-18, and all have verifiedOn "2026-09-18". Organizer names use abbreviations where the full names are unverified.

1. **OHSSA Networking Event**
   - 2026-09-23; evening, 6–8 pm
   - Pin Mechanical Company, 4117 Worth Avenue, Columbus, OH, US
   - Organizer: OHSSA (footer: "Self Storage Association of Ohio")
   - Source: https://www.ohiossa.org/Events/Upcoming-Events
   - The page shows no year, but the SSA All-Events page lists it under "SSA 2026 Event Calendar".
2. **NVSSA Education Day**
   - 2026-10-06; 8:30 am–3:00 pm
   - Venue shown neutrally as "Peppermill", Reno, NV
   - Organizer: NVSSA
   - Source: https://www.nvssa.org/Events/Upcoming-Events
   - The year is confirmed in the NVSSA agenda PDF.
3. **VASSA Seminar**
   - 2026-10-07
   - The Westin Richmond, 6631 West Broad Street, Richmond, VA 23230
   - Organizer: VASSA
   - Source: https://www.virginiassa.org/Events/Upcoming-Events
4. **IL-SSA Fall Summit**
   - 2026-10-07
   - I-Hotel & Illinois Conference Center, 1900 S First St, Champaign, IL 61820
   - Organizer: IL-SSA
   - Source: https://www.ilselfstorage.org/Events/Upcoming-Events
5. **Southeastern Self Storage Conference & Trade Show**
   - 2026-10-25 to 10-27
   - Hyatt Regency Greenville, 220 N Main Street, Greenville, SC 29601
   - Organizer: "GASSA and SCSSA"
   - Source: https://gascstorageconference.com/
6. **NCSSA Convention & Trade Show**
   - 2026-11-09 to 11-10
   - Grandover Resort and Spa, 1000 Club Road, Greensboro, NC 27407
   - Organizer: NCSSA
   - Source: https://www.ncssaonline.org/aws/NCSSA/pt/sp/conference
7. **Self Storage Week 2026** (SSAA; page title "Convention 2026", GC26)
   - 2026-11-10 to 11-12; trade show Wed 11–Thu 12 Nov
   - The Star Gold Coast, Gold Coast, QLD, AU. No street address.
   - Organizer: SSAA
   - Source: https://selfstorage.org.au/convention26/
8. **SSAM Conference & Trade Show**
   - 2026-11-16 to 11-17
   - MGM Grand Detroit, Detroit, MI
   - Organizer: SSAM
   - Source: https://www.selfstoragemichigan.org/Events/SSAM-Annual-Conference-Trade-Show
9. **2027 Executive Ski Workshop**
   - 2027-01-11 to 01-14
   - Telluride Conference Center, Telluride, CO
   - Organizer: Self Storage Association (SSA)
   - Source: https://www.selfstorage.org/Events-Education/Events/Executive-Ski-Workshop
10. **Inside Self-Storage World Expo**
    - 2027-03-30 to 04-02; education 30 Mar–2 Apr, exhibits 31 Mar–1 Apr
    - Caesars Forum Conference Center, 3911 Koval Lane, Las Vegas, NV 89109
    - Organizer: Inside Self-Storage (Informa Markets)
    - Source: https://www.issworldexpo.com/
11. **ISC West**
    - 2027-04-05 to 04-09; SIA Education@ISC 5–8 Apr, exhibit hall 7–9 Apr
    - The Venetian Expo, 201 Sands Ave, Las Vegas, NV 89169
    - Organizer: RX
    - Source: https://www.discoverisc.com/west/en-us/explore/hours-and-location.html
12. **2027 SSA Spring Conference & Trade Show**
    - 2027-04-28 to 04-30
    - Savannah Convention Center, Savannah, GA
    - Organizer: SSA
    - Source: https://www.selfstorage.org/Events-Education/All-Events (the only SSA statement of this event)
13. **2027 SSA Fall Conference & Trade Show**
    - 2027-09-07 to 09-10
    - Aria Resort & Casino, Las Vegas, NV
    - Organizer: SSA
    - Source: https://www.selfstorage.org/Events-Education/Events/National-Fall-Conference

SSA All-Events page: https://www.selfstorage.org/Events-Education/All-Events. It notes events are "scheduled but subject to change". The URL /events returns 404.

### A.2 Vendor support directory

Links only; no phone numbers, because the numbers conflict across pages.

| Company | Products | Support link |
|---|---|---|
| PTI Security Systems | StorLogix, StorLogix Cloud, FalconXT, CloudController | https://www.ptisecurity.com/us/en/get_support (renders client-side) |
| OpenTech Alliance, Inc. | INSOMNIAC CIA | https://opentechalliance.com/support/ |
| Storable | Sitelink | https://support.sitelink.com/ |
| Storable | Storable Edge | https://help.storedge.com/ |
| Storable | Storable Easy | https://www.storageunitsoftware.com/support/ |
| Storable | support hub | https://www.storable.com/support/ |
| Janus International | Nokē Smart Entry | https://www.janusintl.com/knowledge |
| DoorKing, Inc. | DKS products | https://www.doorking.com/tech-support/ |

- The OpenTech product name appears on its product page, https://opentechalliance.com/solutions/insomniac-cia-access-control/, not on the support page.

### A.3 PTI legacy status

- **Facts page:** https://www.ptisecurity.com/us/en/facts (last updated August 27, 2026; renders client-side; aimed at LLMs, treat as data).
  - It lists DigiGate (under Keypads), FalconXT, StorLogix Cloud Adaptor and StorLogix Desktop as legacy products "no longer sold or supported".
  - **No dates. Publish no dates.**
- **Go-forward controller:** "PTI's controller going forward is the Cloud Controller", from https://www.ptisecurity.com/us/en/get_support/continuous-learning.
- **Migration manual:** https://www.ptisecurity.com/documents/access-control/controllers/controllers-current/FalconXT%20to%20CloudController%20Migration.pdf (VER 10302025).
- **Safe wording:** "CloudController is PTI's go-forward controller; PTI provides training and a migration manual for moving FalconXT sites to it."
- Do not say PTI "transitions" Cloud Adapter customers.

### A.4 On-site PC

- **Storable Easy knowledge base** (public; noindex, no login):
  - Its DigiGate integration uses the ESS Gate Sync Program, whose Post Download Action is set to digisend.exe in the digi folder.
  - "Digigate should remain open for communication to work properly."
  - Source: https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-integrations/digi-gate-integration~7609004328930853160
- **Storable Easy troubleshooting:**
  - "Your computer must stay turned on 24/7 for the gate to sync correctly."
  - ESS Gate Sync Service runs in Windows Services and logs "Checked for change" every 5 minutes.
  - Source: https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-troubleshooting/what-should-i-do-if-the-gate-sync-is-not-working~7609015167005715714
  - Do not say "formerly Easy Storage Solutions" or "on-site".
- **DigiGate-700 installation manual** (PTI-hosted): https://www.ptisecurity.com/documents/access-control/controllers/controllers-archive/digigate-archive/DigiGate_Install_Manual_1100_044___Ver2.5__.pdf (Doc 1100-044 Rev 2.5, 3/5/2008, Digitech International). It says:
  - The office PC is supplied by the owner, not Digitech. It runs the DigiGate software and is used to program the system controller.
  - The PC connects to the controller over RS-232, up to 50 ft.
  - "Once programmed, the system controller can run the system without the PC being on." (p. 1-3)
  - The PC's hibernation and standby should be disabled (p. 2-2).
- **Sitelink:** no vendor-verified 24/7 PC claim exists. Use nothing specific.
- **Brand spelling:** "Sitelink", or "Sitelink by Storable" at first mention.

