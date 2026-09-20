# Resources Hub and Articles Implementation Plan (Plan 3 of 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `/resources` and the five guides of spec §11. Each guide cites the vendors' own documents for every fact about their products. Each links the solution pages the way spec §4.4 and §6 require, and carries Article JSON-LD with real dates. Together they give the site pages that answer what facility operators search for when their gate hardware or its PC reaches end of life.

**Architecture:** One registry, `lib/articles.ts`, holds what the site knows about each article, and everything that must agree reads it:
- the route in `ROUTES`, and so the sitemap, both link guards and the hub;
- each page's h1, byline, `pageMeta` and Article JSON-LD.

Tests hold every registry entry to the same shape, in the source (`tests/articles.test.ts`) and in the built HTML (`tests/rendered.test.ts`). So each article task adds only an entry, the sources it cites and its page. Every vendor fact is a `SOURCES` entry, cited inline with `<SourceLink>` and listed by `<SourceList>` with the date it was checked. The pages are plain TSX: no MDX, no new dependency.

**Tech Stack:** Next.js 16.3.5 App Router, React 19.3.0, Tailwind CSS 4.3.3 (CSS-first tokens in `app/globals.css`), TypeScript ~5.8.3, Vitest ^3.2.7 (node environment, no DOM library). Hosting: Netlify behind Cloudflare.

**Spec:** `docs/superpowers/specs/2026-09-18-website-completion-seo-design.md`

**Starts from:** `main` at `13b2d11`, where PR #1 (Plans 1 and 2) merged. Work on the branch `claude/resources-articles`.

## Global Constraints

Every task's requirements implicitly include this section.

- **Working directory.** Run every command in `self-storage-hosting/`, in Git Bash. Paths in this plan are relative to the repo root.
- **Read the bundled Next docs before writing Next code.** `self-storage-hosting/AGENTS.md` says this is not the Next.js you know. The docs are in `self-storage-hosting/node_modules/next/dist/docs/`.
- **Pinned versions. No new dependencies.** `next@16.3.5`, `react@19.3.0`, `react-dom@19.3.0`, `tailwindcss@4.3.3`, `vitest@^3.2.7`. That rules out MDX: each article is a plain `page.tsx`.
- **Copy the given files exactly.** These are given in full:
  - the hub;
  - the five article pages;
  - the two components;
  - every `SOURCES` entry.

  Their wording was checked sentence by sentence against the vendors' own documents, the content policy, the trademark list and every rule below. If a test fails on copied text, stop and report it. Never reword a vendor fact to get past a guard.
- **JSON-LD.** Never emit these types: `FAQPage`, `SoftwareApplication`, `Product`, `aggregateRating`, `review`, `SearchAction`, `LocalBusiness`. `components/JsonLd.tsx` throws on them. The hub emits BreadcrumbList only. Each article emits Article and BreadcrumbList (spec §7.2).
- **Never publish** invented customers, testimonials, logos, case studies or metrics. **Never publish an unverified performance number.** That means no uptime percentage, latency figure or site count.
- **Never publish a security claim beyond TLS** until spec §14 B is answered. The approved wording is: "Served over TLS. Ask us for our current security posture." Softening an unverified claim into vaguer words still publishes it.
- **Never publish a per-vendor integration status** until spec §14 F is answered. The only bridge wording is: "We can bridge {FMS} to {gate system}. Tell us your setup."
- **Never write "audit log", "audit trail" or "audit export".** Say "event history".
- **Offline behaviour** is worded only in `OUTAGE_BEHAVIOR` in `lib/claims.ts`:
  - Render the constant. Never paraphrase it.
  - Say nothing about admin changes made during an outage (spec §14 D3).
  - Never lead a page or a section with offline operation (spec §3.2, §15.7).
- **Every vendor fact comes from the vendor's own published page.** Cite it inline with `<SourceLink source={SOURCES.x} />` and list it in the article's `<SourceList>`. Never cite trade press for a vendor fact. Every `SOURCES` entry in this plan was checked against its live page on 2026-09-19.
- **Third-party end-of-support dates.** Publish one only where the vendor itself published it, with the citation next to it. This plan publishes exactly two sets:
  - **PTI's archived end-of-life notice for its DigiTech products** (`SOURCES.ptiEolNotice`), in the DigiGate guide only. It gives May 28, 2021 for the Last Time Buy Date and the End of Direct Support, and December 3, 2021 for the End of Partner Support. The guide does not explain what those terms mean.
  - **Microsoft's:** Windows 10 end of support on October 14, 2025, and Microsoft's **consumer** Extended Security Updates program through October 12, 2027. Say "Microsoft's consumer ESU program". Never apply 2027 to commercial ESU.

  PTI's facts page gives no date for FalconXT, the StorLogix Cloud Adaptor or StorLogix Desktop. The trade-press dates for them are banned in every format by the content policy. Never say PTI "transitions" customers.
- **The office PC.** The spec's §3.2(2) wording failed verification: "designated PC", "System Controller PC", "every 2 minutes". The content policy bans it. Never say a Storable document puts a computer "on-site", at the facility or in the office (Plan 2, Appendix A.4).
- **Copy rules** (spec §13):
  - "Digi Gate" → **DigiGate**
  - "StorEdge" → **Storable Edge**
  - "Easy Storage Solutions" → **Storable Easy**
  - "SiteLink" → **Sitelink** (write **Sitelink by Storable** at first mention on a page)
  - "PMS" → **FMS**
  - "Stor-Guard" → **StorGuard**
  - OpenTech Alliance is the *company*. The product is **INSOMNIAC® CIA**, with ® once per page, at first use.
  - PTI's own prose spells its product **StorLogix Cloud Adaptor**. See ruling 1.
  - Never imply partnership or endorsement with PTI, OpenTech, Storable or Janus. Each article says it is not affiliated with the vendors it names.
- **Competitor names.** `/support` never names a competitor in its title, meta description or H1 (spec D8). The guides target product end-of-life and troubleshooting searches, never a vendor's brand-support searches.
- **Legal pages are drafts of the owner's policy, not legal advice.**
  - Never invent a legal entity name, a governing-law clause or a retention period.
  - Trademark owners carry no legal suffix.
  - A name whose owner was not confirmed from the owner's own site goes in `NAMES_WITHOUT_CONFIRMED_OWNER`, never under a guessed owner.
- **Contact details.** `SITE.contactEmail` stays `""`. No page publishes an email address, phone number or postal address (spec §14 A). Route people to `/contact`.
- **Dates are facts** (spec §7.3). Never set one of these to a day on which nothing happened:
  - `datePublished` is the day an article first goes live.
  - `dateModified` is set only when the facts on the page change.
  - `verifiedOn` is the day someone checked the source page.

  The sitemap dates the articles and nothing else.
- **An article's registry entry and its page land in the same commit.** The entry is what builds the route.
- **Never send a VALID body to the deployed `/api/contact`.** The preview may hold live Resend credentials, and a valid body sends a real email. Probe only with invalid bodies such as `{}`.
- **Port 3000 belongs to a long-lived server owned by the repo owner (PID 42384). Never stop it.** Any verification server uses port 3210 or higher, e.g. `npx next start -p 3210`. Stop only servers you started.
- **Commit only the files your task names.** Use `git add <path> <path>`, never `git add -A` or `git add .`. `.claude/` and `.serena/` must stay untracked **and** unignored.
- **No `opacity-*` utility on text.** The contrast test reads raw tokens and cannot see a composited colour.
- **Focus rings come from `components/ui/focus.ts`.** Use `FOCUS_RING_LIGHT` on light surfaces. Never inline a `focus-visible:outline-…` class.
- **Canonicals come from `pageMeta()` in `page.tsx` only.**
- **Every guard is probed.** After writing a guard:
  1. Commit.
  2. Mutate the real source it inspects, and run only that test.
  3. Confirm it fails **and names the offending file or route**.
  4. Restore with `git checkout -- <file>`. This is safe because you committed first.
  5. Confirm `git status --short` shows nothing you did not intend.

  A green guard is not evidence (see `MEMORY.md` → guards-must-be-probed). Each task's last step lists its probes.
- **Write regexes as regex literals in `.ts` files.** Never write them inside a `node -e` string or a shell heredoc: backslashes collapse on this machine.
- **Gates before every commit:** run `npm run lint`, `npm test`, `npm run build`, then `RENDERED=1 npx vitest run tests/rendered.test.ts`. All must pass.
- **Do not restore a `/* → 200` catch-all** in any form. **Dark mode is out of scope** (spec D13).

### Rulings

Decisions this plan makes where the spec is silent or its wording failed verification. Each states what it costs if wrong.

1. **"Adaptor", not "Adapter".** Spec §11 spells article 1's product "StorLogix Cloud Adapter". PTI's own pages spell it "Adaptor", and a vendor's spelling of its own product wins. Cost if wrong: one word in two guides and in the trademark list.
2. **An interim link rule, from Task 3 to Task 9.** The articles link one another, and each lands in its own task. From Task 3, `allowedLink` also accepts the five planned article paths, and only those. Task 9 removes them and proves the gap closed. Cost if wrong: nothing once Task 9 lands. Before then, a guide may link one that is not built yet. The branch does not merge before Task 9.
3. **Names without a confirmed owner.** Revenue Control Systems, Eight IO, BearBox and Cubby appear in a vendor's integration list. No site of their own was found. `/legal/trademarks` lists them without an owner, in a sentence of their own. Cost if wrong: counsel names the owners later. The deploy checklist says how.
4. **The source check date.** Every `SOURCES` entry carries `verifiedOn: "2026-09-19"`, including the six from Plan 2. That is the day the pages were actually re-checked. Never change it to the day you type it.
5. **Publication dates.** `datePublished` is the day a guide first goes live, and the guides go live when this branch merges and deploys. Each registry entry carries `datePublished: "2026-09-19"`, the day this plan was written. If you run an article task later, set that entry's date to the day you run it, because the articles test fails on a date in the future. If the branch merges after those dates, set all five to the merge day in one commit just before it merges (see "After the last task"). Cost if wrong: the Article JSON-LD and the sitemap give a publication day a few days early.
6. **The legal review is overdue, and the files say so.** PR #1 merged with the legal pages still marked as drafts. Task 9 says in the deploy checklist that the review is now overdue, instead of quietly dropping a deadline that has passed.

---

## Correction: the CloudController "go-forward" citation

Found by the Task 5 review on 2026-09-19, after Tasks 3 and 5 had been committed.
Fixed on the branch in commit `d42d91c`. **Read this before reusing any page copy
below that mentions the CloudController.**

**The defect.** Three pages claimed that PTI calls the CloudController its
go-forward controller and cited `SOURCES.ptiContinuousLearning`
(<https://www.ptisecurity.com/us/en/get_support/continuous-learning>). That page
does not carry the claim. A fourth sentence said the same page lists a
CloudController installation course, `HW-032`; it lists no course codes at all.

**The evidence.** `pdftotext` on PTI's StorLogix Cloud user's manual
(`SOURCES.ptiCloudManual`) returns, verbatim: "The CloudController unlocks
several new features and is the go-forward system controller for PTI."
`pdftotext` on `SOURCES.ptiMigrationManual` returns no occurrence of the string
"forward". Two independent renders of the Continuous Learning page show no
go-forward wording, no CloudController outside the navigation, and no course
codes. The claim is true and PTI-published — it simply lives in a different
document. Note that ptisecurity.com serves only its `<h1>` to browsers and to
plain fetches, so its pages must be checked with a renderer, never with curl.

**What changed in the code.** Four edits, all in `d42d91c`:

1. `resources/digigate-replacement/page.tsx` — "PTI's training page calls the
   CloudController its go-forward controller." became "PTI's StorLogix Cloud
   user's manual calls the CloudController its go-forward system controller.",
   citing `ptiCloudManual`; its `<SourceList>` swapped the same key.
2. `resources/falconxt-end-of-life/page.tsx` — "PTI calls the CloudController
   its controller going forward." took the same replacement and the same key
   swap in its `<SourceList>`.
3. `resources/falconxt-end-of-life/page.tsx` — the `HW-032` paragraph was
   deleted outright. Softening an unverified claim still publishes it, and the
   paragraph carried nothing else.
4. `solutions/access-control-hosting/page.tsx` (Plan 2 code, pre-existing) —
   the go-forward sentence now cites `ptiCloudManual`; `ptiContinuousLearning`
   stays on the following sentence, which it does support, alongside
   `ptiMigrationManual`.

**What a replay must do differently.** The task code blocks below are left as
written, because Tasks 3 and 5 are executed and rewriting them would hide what
actually shipped. A replay must apply the four edits above, and must also move
the creation of the `ptiCloudManual` source entry out of Task 4's sources step
and into Task 3's — Task 3 is the first task that needs to cite it, and the key
does not otherwise exist until Task 4.

**What no guard catches.** No test in this repo compares a claim against the
document cited beside it. All four gates were green, and the page was
byte-identical to its brief, with this defect present. Citation-to-claim truth
is checked by a reviewer reading the sources, and by nothing else.

## File Structure

| File | Status | Responsibility | Task |
|---|---|---|---|
| `self-storage-hosting/tests/events.test.ts` | Modify | `isIsoDate` tests | 1 |
| `self-storage-hosting/tests/seo.test.ts` | Modify | Article-time tests | 1 |
| `self-storage-hosting/tests/schema.test.ts` | Modify | `articleSchema` tests | 1 |
| `self-storage-hosting/lib/dates.ts` | Modify | `isIsoDate` | 1 |
| `self-storage-hosting/lib/seo.ts` | Modify | `assertArticleDates`; article times in `pageMeta` | 1 |
| `self-storage-hosting/lib/schema.ts` | Modify | `articleSchema` checks its path and dates and credits the company (1); a comment (9) | 1, 9 |
| `self-storage-hosting/tests/articles.test.ts` | Create | Each registry entry against its page: metadata, h1, byline, JSON-LD, disclaimer, Sources | 2–7 |
| `self-storage-hosting/tests/routing.test.ts` | Modify | The sitemap dates articles from the registry, and nothing else | 2 |
| `self-storage-hosting/tests/sitemap-coverage.test.ts` | Modify | The expected indexable routes gain `/resources` (2) and each guide (3–7) | 2–7 |
| `self-storage-hosting/tests/content-policy.test.ts` | Modify | Rows for the unverified dates, the on-site PC wording and "transitions" (2); a comment (9) | 2, 9 |
| `self-storage-hosting/lib/articles.ts` | Create | The article registry: `Article`, `ARTICLES`, `articlePath`, `article`. One entry per article task | 2–7 |
| `self-storage-hosting/app/(marketing)/resources/page.tsx` | Create | /resources, the hub | 2 |
| `self-storage-hosting/lib/site.ts` | Modify | `/resources` built; one `ROUTES` row per article, from the registry | 2 |
| `self-storage-hosting/app/sitemap.ts` | Modify | `lastModified` for the articles only | 2 |
| `self-storage-hosting/app/(marketing)/solutions/access-control-hosting/page.tsx` | Modify | A code comment (2); links to the guides (5–7) | 2, 5–7 |
| `self-storage-hosting/lib/sources.ts` | Modify | `verifiedOn` re-check (2); the sources each guide is first to cite (3–7) | 2–7 |
| `self-storage-hosting/tests/rendered.test.ts` | Modify | Built-article checks (2); /legal/trademarks prints every listed name (8) | 2, 8 |
| `self-storage-hosting/components/ArticleDates.tsx` | Create | The byline: published and updated dates | 3 |
| `self-storage-hosting/components/SourceList.tsx` | Create | The Sources section, with the date each source was checked | 3 |
| `self-storage-hosting/app/(marketing)/resources/falconxt-end-of-life/page.tsx` | Create | Article 1 | 3 |
| `self-storage-hosting/tests/trademarks.test.ts` | Modify | Ignores URLs (3); counts names without a confirmed owner as listed (8) | 3, 8 |
| `self-storage-hosting/tests/helpers/links.ts` | Modify | The interim link rule (3), removed (9) | 3, 9 |
| `self-storage-hosting/app/(marketing)/resources/gate-not-syncing/page.tsx` | Create | Article 2 | 4 |
| `self-storage-hosting/app/(marketing)/support/page.tsx` | Modify | Links article 2 (4), then articles 1 and 3 (5) | 4, 5 |
| `self-storage-hosting/app/(marketing)/resources/digigate-replacement/page.tsx` | Create | Article 3 | 5 |
| `self-storage-hosting/app/(marketing)/resources/self-storage-gate-compatibility/page.tsx` | Create | Article 4 | 6 |
| `self-storage-hosting/app/(marketing)/solutions/web-hosting/page.tsx` | Modify | Links article 4 and `/resources` | 6 |
| `self-storage-hosting/app/(marketing)/resources/self-storage-gate-server/page.tsx` | Create | Article 5 | 7 |
| `self-storage-hosting/tests/helpers/brands.ts` | Modify | `WATCHLIST` gains the names the guides print | 8 |
| `self-storage-hosting/lib/trademarks.ts` | Modify | The new names, and `NAMES_WITHOUT_CONFIRMED_OWNER` | 8 |
| `self-storage-hosting/app/(marketing)/legal/trademarks/page.tsx` | Modify | Prints the names without a confirmed owner (8); a comment (9) | 8, 9 |
| `self-storage-hosting/lib/legal.ts` | Modify | A comment: the legal review is overdue | 9 |
| `self-storage-hosting/app/(marketing)/legal/accessibility/page.tsx` | Modify | A comment | 9 |
| `self-storage-hosting/app/(marketing)/legal/privacy/page.tsx` | Modify | A comment | 9 |
| `self-storage-hosting/app/(marketing)/legal/terms/page.tsx` | Modify | A comment | 9 |
| `docs/deploy-checklist.md` | Modify | The overdue legal review; the Plan 3 section | 9 |

**Task order and why.**
- **Task 1 first.** Every article page calls `pageMeta` and `articleSchema` with dates.
- **Task 2 before any article.** It builds the hub and every per-article check, so each article is checked from the commit that adds it.
- **Tasks 3–7, in spec §11 order.** Each adds:
  - its registry entry;
  - the sources it is first to cite;
  - its page;
  - the links existing pages gain to it.

  No existing page links a guide before the task that builds it.
- **Task 8 once all five guides exist.** It lists the product names they print.
- **Task 9 last.** It closes the interim link rule, which is safe only once every guide is built.

---

### Task 1: Article dates in pageMeta and articleSchema

Plan 2 left two article hooks unused. `pageMeta()` accepts `ogType: "article"` but cannot carry a date, and `articleSchema()` in `lib/schema.ts` has no caller. Every article page will call both. This task makes the two agree on what a valid date is, and makes a wrong one fail the build instead of shipping:

- `isIsoDate()` answers "is this a real YYYY-MM-DD day?" without throwing.
- `assertArticleDates()` is the one check both callers share: real days, and no update before the publication.
- `pageMeta()` requires `publishedTime` on an article and refuses article times on any other page. It states `modifiedTime` only when there is one.
- `articleSchema()` accepts only a `/resources/<slug>` path and credits the company as author. The articles have no named author, and inventing one would be a fabrication (spec §15.1).

**Files:**
- Modify: `self-storage-hosting/tests/events.test.ts`
- Modify: `self-storage-hosting/tests/seo.test.ts`
- Modify: `self-storage-hosting/tests/schema.test.ts`
- Modify: `self-storage-hosting/lib/dates.ts`
- Modify: `self-storage-hosting/lib/seo.ts`
- Modify: `self-storage-hosting/lib/schema.ts`

**Interfaces:**
- Consumes: `parts(s)` in `lib/dates.ts` (private; throws on anything that is not a real YYYY-MM-DD day). `pageMeta(opts: PageMetaOpts): Metadata` and `canonicalFor(path)` in `lib/seo.ts`. `articleSchema(a: { headline; description; path; datePublished; dateModified? })` and `SITE` in `lib/schema.ts`.
- Produces:
  - `isIsoDate(s: string): boolean` in `lib/dates.ts`.
  - `assertArticleDates(context: string, published: string, modified?: string): void` in `lib/seo.ts`. It throws `${context}: "${d}" is not a YYYY-MM-DD calendar date` or `${context}: modified ${modified} is before published ${published}`.
  - `PageMetaOpts` gains `publishedTime?: string` and `modifiedTime?: string`. `pageMeta` throws `pageMeta: article ${path} needs a publishedTime` and `pageMeta: ${path} sets article times but its ogType is "${ogType}"`. An article's `openGraph` carries `publishedTime`, plus `modifiedTime` only when it is set.
  - `articleSchema` throws `articleSchema: "${path}" is not a /resources/<slug> path` and emits `author: { "@type": "Organization", name: SITE.name, url: SITE.url }`.

- [ ] **Step 1: Write the failing tests**

Add the `isIsoDate` tests to `self-storage-hosting/tests/events.test.ts`, next to the other `lib/dates.ts` tests:

In `self-storage-hosting/tests/events.test.ts`, replace:

```ts
import path from "node:path";
import { formatDate, formatDateRange } from "@/lib/dates";
import { EVENTS, upcomingEvents, type IndustryEvent } from "@/lib/events";
```

with:

```ts
import path from "node:path";
import { formatDate, formatDateRange, isIsoDate } from "@/lib/dates";
import { EVENTS, upcomingEvents, type IndustryEvent } from "@/lib/events";
```

In `self-storage-hosting/tests/events.test.ts`, replace:

```ts

describe("formatDateRange", () => {
```

with:

```ts

describe("isIsoDate", () => {
  it("accepts a real YYYY-MM-DD day", () => {
    expect(isIsoDate("2026-09-19")).toBe(true);
    expect(isIsoDate("2028-02-29")).toBe(true);
  });

  it("rejects anything else without throwing", () => {
    for (const s of ["2026-02-30", "2026-9-19", "09/19/2026", "2026-09-19T00:00:00Z", ""]) {
      expect(isIsoDate(s), s).toBe(false);
    }
  });
});

describe("formatDateRange", () => {
```

In `self-storage-hosting/tests/seo.test.ts`, the existing article test now needs a `publishedTime`, and six new tests pin the article rules:

In `self-storage-hosting/tests/seo.test.ts`, replace:

```ts
    expect(
      pageMeta({ title: "a", description: "d", path: "/a", ogType: "article" }).openGraph
    ).toMatchObject({ type: "article" });
```

with:

```ts
    expect(
      pageMeta({ title: "a", description: "d", path: "/a", ogType: "article", publishedTime: "2026-09-19" })
        .openGraph
    ).toMatchObject({ type: "article" });
```

In `self-storage-hosting/tests/seo.test.ts`, replace:

```ts

  it("emits noindex, nofollow when asked", () => {
```

with:

```ts

  it("gives an article its published and modified times", () => {
    const og = pageMeta({
      title: "a",
      description: "d",
      path: "/a",
      ogType: "article",
      publishedTime: "2026-09-19",
      modifiedTime: "2026-10-02",
    }).openGraph;
    expect(og).toMatchObject({ publishedTime: "2026-09-19", modifiedTime: "2026-10-02" });
  });

  it("states no modified time for an article that was never updated", () => {
    const og = pageMeta({ title: "a", description: "d", path: "/a", ogType: "article", publishedTime: "2026-09-19" })
      .openGraph;
    expect(og).not.toHaveProperty("modifiedTime");
  });

  it("refuses an article with no published time", () => {
    expect(() => pageMeta({ title: "a", description: "d", path: "/a", ogType: "article" })).toThrow(
      /needs a publishedTime/
    );
  });

  it("refuses article times on a page that is not an article", () => {
    expect(() => pageMeta({ title: "a", description: "d", path: "/a", publishedTime: "2026-09-19" })).toThrow(
      /sets article times/
    );
    expect(() => pageMeta({ title: "a", description: "d", path: "/a", modifiedTime: "2026-09-19" })).toThrow(
      /sets article times/
    );
  });

  it("refuses an article date that is not a real YYYY-MM-DD day", () => {
    for (const bad of ["2026-02-30", "09/19/2026", "2026-9-19"]) {
      expect(() =>
        pageMeta({ title: "a", description: "d", path: "/a", ogType: "article", publishedTime: bad })
      ).toThrow(/not a YYYY-MM-DD calendar date/);
    }
    expect(() =>
      pageMeta({
        title: "a",
        description: "d",
        path: "/a",
        ogType: "article",
        publishedTime: "2026-09-19",
        modifiedTime: "2026-13-01",
      })
    ).toThrow(/not a YYYY-MM-DD calendar date/);
  });

  it("refuses a modified time before the published time", () => {
    expect(() =>
      pageMeta({
        title: "a",
        description: "d",
        path: "/a",
        ogType: "article",
        publishedTime: "2026-09-19",
        modifiedTime: "2026-09-18",
      })
    ).toThrow(/is before published/);
  });

  it("emits noindex, nofollow when asked", () => {
```

In `self-storage-hosting/tests/schema.test.ts`, add three `articleSchema` tests before the Event test:

In `self-storage-hosting/tests/schema.test.ts`, replace:

```ts

  it("emits Event with a postal address, an organizer and a status", () => {
```

with:

```ts

  it("credits an article to the company, not an invented person", () => {
    const s = articleSchema({
      headline: "h",
      description: "d",
      path: "/resources/x",
      datePublished: "2026-09-18",
    }) as { author: unknown };
    expect(s.author).toEqual({ "@type": "Organization", name: SITE.name, url: SITE.url });
  });

  it("refuses an article path outside /resources/<slug>", () => {
    for (const path of ["/resources", "/resources/", "/about-us", "/resources/A_B", "/resources/x/y", "/resources/-x"]) {
      expect(() => articleSchema({ headline: "h", description: "d", path, datePublished: "2026-09-18" })).toThrow(
        /is not a \/resources\/<slug> path/
      );
    }
  });

  it("refuses article dates that are not real days or run backwards", () => {
    expect(() =>
      articleSchema({ headline: "h", description: "d", path: "/resources/x", datePublished: "2026-02-30" })
    ).toThrow(/not a YYYY-MM-DD calendar date/);
    expect(() =>
      articleSchema({
        headline: "h",
        description: "d",
        path: "/resources/x",
        datePublished: "2026-09-18",
        dateModified: "2026-09-17",
      })
    ).toThrow(/is before published/);
  });

  it("emits Event with a postal address, an organizer and a status", () => {
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
npx vitest run tests/events.test.ts tests/seo.test.ts tests/schema.test.ts
```

Expected: FAIL, `isIsoDate` is not a function, the seo tests expect throws that do not happen and times that are missing, and the schema tests find no `author` and no throw.

- [ ] **Step 3: Add isIsoDate**

In `self-storage-hosting/lib/dates.ts`, add `isIsoDate` above `formatDate`. It reuses `parts()`, which already rejects anything that is not a real day:

In `self-storage-hosting/lib/dates.ts`, replace:

```ts

/** "2026-10-07" → "October 7, 2026" */
```

with:

```ts

/** True only for a real calendar day written YYYY-MM-DD. */
export function isIsoDate(s: string): boolean {
  try {
    parts(s);
    return true;
  } catch {
    return false;
  }
}

/** "2026-10-07" → "October 7, 2026" */
```

- [ ] **Step 4: Give pageMeta article times**

In `self-storage-hosting/lib/seo.ts`, replace:

```ts
import { SITE, ROUTES } from "./site";
```

with:

```ts
import { SITE, ROUTES } from "./site";
import { isIsoDate } from "./dates";
```

In `self-storage-hosting/lib/seo.ts`, replace:

```ts
  image?: string;
};
```

with:

```ts
  image?: string;
  /** YYYY-MM-DD. Required when ogType is "article", refused otherwise. */
  publishedTime?: string;
  /** YYYY-MM-DD, no earlier than publishedTime. Articles only. */
  modifiedTime?: string;
};
```

Add `assertArticleDates` and `articleTimes` above `pageMeta`:

In `self-storage-hosting/lib/seo.ts`, replace:

```ts

export function pageMeta(opts: PageMetaOpts): Metadata {
```

with:

```ts

/**
 * Throws unless both dates are real YYYY-MM-DD days and the update does not
 * come before the publication. pageMeta and articleSchema both call this, so
 * the og:article times and the Article JSON-LD cannot disagree on what a
 * valid date is.
 */
export function assertArticleDates(context: string, published: string, modified?: string): void {
  for (const d of [published, modified]) {
    if (d !== undefined && !isIsoDate(d)) {
      throw new Error(`${context}: "${d}" is not a YYYY-MM-DD calendar date`);
    }
  }
  if (modified !== undefined && modified < published) {
    throw new Error(`${context}: modified ${modified} is before published ${published}`);
  }
}

function articleTimes(opts: PageMetaOpts): { publishedTime?: string; modifiedTime?: string } {
  const { path, ogType = "website", publishedTime, modifiedTime } = opts;
  if (ogType !== "article") {
    if (publishedTime !== undefined || modifiedTime !== undefined) {
      throw new Error(`pageMeta: ${path} sets article times but its ogType is "${ogType}"`);
    }
    return {};
  }
  if (publishedTime === undefined) {
    throw new Error(`pageMeta: article ${path} needs a publishedTime`);
  }
  assertArticleDates(`pageMeta ${path}`, publishedTime, modifiedTime);
  // An article that has never been updated has no modified time to state.
  return modifiedTime === undefined ? { publishedTime } : { publishedTime, modifiedTime };
}

export function pageMeta(opts: PageMetaOpts): Metadata {
```

Spread the article times into `openGraph`:

In `self-storage-hosting/lib/seo.ts`, replace:

```ts
      images,
    },
```

with:

```ts
      images,
      ...articleTimes(opts),
    },
```

- [ ] **Step 5: Make articleSchema check its path and dates, and credit the company**

In `self-storage-hosting/lib/schema.ts`, replace:

```ts
import { SITE } from "./site";
import { canonicalFor } from "./seo";
```

with:

```ts
import { SITE } from "./site";
import { canonicalFor, assertArticleDates } from "./seo";
```

In `self-storage-hosting/lib/schema.ts`, replace:

```ts
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
```

with:

```ts
  dateModified?: string;
}) {
  // Only a /resources/<slug> page is an article on this site. A typo'd path
  // would still build a valid-looking Article pointing at a page that is not
  // one, so refuse it here.
  if (!/^\/resources\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.path)) {
    throw new Error(`articleSchema: "${a.path}" is not a /resources/<slug> path`);
  }
  assertArticleDates(`articleSchema ${a.path}`, a.datePublished, a.dateModified);
  return {
    "@context": "https://schema.org",
```

In `self-storage-hosting/lib/schema.ts`, replace:

```ts
    dateModified: a.dateModified ?? a.datePublished,
    publisher: {
```

with:

```ts
    dateModified: a.dateModified ?? a.datePublished,
    // The articles are written by the company, not a named person, so the
    // author is the Organization. Inventing a byline would be a fabrication.
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: {
```

- [ ] **Step 6: Run the tests to verify they pass**

```bash
npx vitest run tests/events.test.ts tests/seo.test.ts tests/schema.test.ts
```

Expected: PASS.

- [ ] **Step 7: Run the gates**

In Git Bash, from `self-storage-hosting/`:

```bash
npm run lint && npm test && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts
```

Expected: lint is clean, every unit test passes, the build succeeds and every rendered check passes.

- [ ] **Step 8: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add self-storage-hosting/lib/dates.ts self-storage-hosting/lib/seo.ts self-storage-hosting/lib/schema.ts self-storage-hosting/tests/events.test.ts self-storage-hosting/tests/seo.test.ts self-storage-hosting/tests/schema.test.ts
git commit -m "feat(seo): article dates in pageMeta and articleSchema, checked in one place"
cd self-storage-hosting
```

---

### Task 2: The /resources hub and the article registry

This task adds everything the five articles share, before the first one exists:

- `lib/articles.ts` is the one list of articles. `ROUTES` (and so the sitemap and both link guards), the hub, and each page's h1, byline and Article JSON-LD all read it. It starts empty, and Tasks 3–7 each add one entry.
- `/resources` is the hub. Spec §5 fixes its title and description. It emits BreadcrumbList only: an ItemList or CollectionPage block earns no rich result here.
- The sitemap gives each article a `lastModified`: its `dateModified`, or else its `datePublished`. A person sets those dates when the facts change, so they are a real signal (spec §7.3). Every other page still carries none.
- `tests/articles.test.ts` and new rendered checks hold every article to the same shape. The per-article checks run once per registry entry, so they register nothing until Task 3 adds the first one.
- Three new content-policy rows keep out the facts that failed verification:
  - the trade-press end-of-support dates PTI never published;
  - the spec's §3.2(2) on-site PC wording;
  - the claim that PTI "transitions" customers.

  The outage row now also catches "re-sync".

The hub is live with an empty list until Task 3. Nothing is deployed before the branch merges after Task 9.

**Files:**
- Create: `self-storage-hosting/tests/articles.test.ts`
- Modify: `self-storage-hosting/tests/routing.test.ts`
- Modify: `self-storage-hosting/tests/sitemap-coverage.test.ts`
- Modify: `self-storage-hosting/tests/content-policy.test.ts`
- Create: `self-storage-hosting/lib/articles.ts`
- Create: `self-storage-hosting/app/(marketing)/resources/page.tsx`
- Modify: `self-storage-hosting/lib/site.ts`
- Modify: `self-storage-hosting/app/sitemap.ts`
- Modify: `self-storage-hosting/app/(marketing)/solutions/access-control-hosting/page.tsx` (a code comment only)
- Modify: `self-storage-hosting/lib/sources.ts` (`verifiedOn` dates only)
- Modify: `self-storage-hosting/tests/rendered.test.ts`

**Interfaces:**
- Consumes: `isIsoDate` from Task 1. From Plans 1 and 2: `ROUTES` and `indexableRoutes()` in `lib/site.ts`; `canonicalFor` and `pageMeta` in `lib/seo.ts`; `formatDate` in `lib/dates.ts`; `Breadcrumbs`, `CtaBand` and `FOCUS_RING_LIGHT`; `pageFiles()` in `tests/helpers/pages.ts`; `read`, `visible`, `rowText`, `jsonLd` and `built` inside `tests/rendered.test.ts`.
- Produces:
  - In `lib/articles.ts`: `type Article = { slug; headline; title; description; datePublished; dateModified? }` (all strings), `ARTICLES: readonly Article[]`, `articlePath(slug: string): string` (`/resources/${slug}`), and `article(slug: string): Article`, which throws `No article with slug "${slug}" in lib/articles.ts`. The file has **no imports**: `lib/site.ts` imports it, and everything imports `lib/site.ts`.
  - `ROUTES` gains one row per article straight after `"/resources"`: `{ title: a.title, indexable: true, built: true }`. Adding a registry entry is therefore also what builds the route. Each article task adds the entry and the page in the same commit.
  - `tests/articles.test.ts` checks each registry entry against its page:
    - the metadata literals;
    - `article("<slug>")`;
    - `<h1 …>{A.headline}</h1>`;
    - `<ArticleDates article={A} />`;
    - `<JsonLd data={articleSchema({ ...A, path: articlePath(A.slug) })} />`;
    - the words "not affiliated with";
    - a `<SourceList sources={[…]} />` that lists exactly the `SOURCES` keys the page cites.
  - `tests/rendered.test.ts` checks each built article:
    - one Article block, whose headline is the visible h1;
    - the og:article tags;
    - a `/solutions/` link in the first third of the body and another in the closing third (spec §4.4);
    - every table captioned;
    - every fragment link pointing at an id that exists.

- [ ] **Step 1: Write the failing tests**

Create `self-storage-hosting/tests/articles.test.ts`. Its first test pins how many articles exist. Each article task raises the number, and Task 7 renames the test once all five exist.

Create `self-storage-hosting/tests/articles.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import type { Metadata } from "next";
import { ARTICLES, article, articlePath } from "@/lib/articles";
import { ROUTES } from "@/lib/site";
import { canonicalFor } from "@/lib/seo";
import { isIsoDate } from "@/lib/dates";
import { pageFiles } from "./helpers/pages";

// A /resources/<slug> route, as opposed to the /resources hub itself.
const ARTICLE_ROUTE = /^\/resources\/[^/]+$/;

// The `sources={[ ... ]}` argument of a page's <SourceList>, brackets
// balanced, or null if the page renders none. Same idea as crumbsArg in
// tests/breadcrumbs.test.ts: SOURCES keys are plain identifiers with no
// brackets, so counting brackets is enough.
function sourceListArg(src: string): string | null {
  const tag = src.indexOf("<SourceList");
  if (tag === -1) return null;
  const attr = src.indexOf("sources=", tag);
  if (attr === -1) return null;
  const open = src.indexOf("[", attr);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]" && --depth === 0) return src.slice(open, i + 1);
  }
  return null;
}

const keysIn = (s: string) => new Set([...s.matchAll(/\bSOURCES\.(\w+)\b/g)].map((m) => m[1]));

describe("article registry", () => {
  it("has the articles built so far, with unique kebab-case slugs", () => {
    const slugs = ARTICLES.map((a) => a.slug);
    expect(slugs.length).toBe(0);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it("lists the same articles as ROUTES and as the pages on disk", () => {
    const registry = ARTICLES.map((a) => articlePath(a.slug)).sort();
    const routes = Object.keys(ROUTES)
      .filter((r) => ARTICLE_ROUTE.test(r))
      .sort();
    const pages = [...pageFiles().keys()].filter((r) => ARTICLE_ROUTE.test(r)).sort();
    expect(routes).toEqual(registry);
    expect(pages).toEqual(registry);
  });

  it("gives each article unique, short-enough text", () => {
    for (const key of ["headline", "title", "description"] as const) {
      const values = ARTICLES.map((a) => a[key]);
      expect(new Set(values).size, `duplicate ${key}`).toBe(values.length);
    }
    for (const a of ARTICLES) {
      // The layout appends " | Self Storage Hosting" (23 characters). 40 + 23
      // keeps the full <title> near the width search results show.
      expect(a.title.length, `${a.slug} title`).toBeLessThanOrEqual(40);
      expect(a.description.length, `${a.slug} description`).toBeLessThanOrEqual(155);
    }
  });

  it("dates each article with real days, none in the future", () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const a of ARTICLES) {
      expect(isIsoDate(a.datePublished), `${a.slug} datePublished`).toBe(true);
      expect(a.datePublished <= today, `${a.slug} is published in the future`).toBe(true);
      if (a.dateModified !== undefined) {
        expect(isIsoDate(a.dateModified), `${a.slug} dateModified`).toBe(true);
        expect(a.dateModified > a.datePublished, `${a.slug} dateModified must be after datePublished`).toBe(
          true
        );
        expect(a.dateModified <= today, `${a.slug} is modified in the future`).toBe(true);
      }
    }
  });

  it("throws on an unknown slug", () => {
    expect(() => article("no-such-article")).toThrow('No article with slug "no-such-article" in lib/articles.ts');
  });
});

describe.each(ARTICLES.map((a) => [a.slug, a] as const))("article page %s", (slug, a) => {
  const route = articlePath(slug);
  const file = pageFiles().get(route);
  const src = file ? readFileSync(file, "utf8") : "";

  it("exists", () => {
    expect(file, `${route} has no page.tsx`).toBeDefined();
  });

  it("exports the registry's title, description, canonical and dates", async () => {
    const mod = (await import(pathToFileURL(file!).href)) as { metadata: Metadata };
    const m = mod.metadata;
    expect(m.title).toBe(a.title);
    expect(m.description).toBe(a.description);
    expect(m.alternates?.canonical).toBe(canonicalFor(route));
    expect(m.openGraph).toMatchObject({ type: "article", publishedTime: a.datePublished });
    if (a.dateModified === undefined) expect(m.openGraph).not.toHaveProperty("modifiedTime");
    else expect(m.openGraph).toMatchObject({ modifiedTime: a.dateModified });
  });

  it("renders its own registry entry as the h1, byline and Article", () => {
    expect(src).toContain(`article("${slug}")`);
    expect(src).toMatch(/<h1\b[^>]*>\s*\{A\.headline\}\s*<\/h1>/);
    expect(src).toMatch(/<ArticleDates article=\{A\}\s*\/>/);
    expect(src).toMatch(/<JsonLd data=\{articleSchema\(\{\s*\.\.\.A,\s*path:\s*articlePath\(A\.slug\)\s*\}\)\}\s*\/>/);
  });

  it("says it is not affiliated with the companies it names", () => {
    expect(src).toContain("not affiliated with");
  });

  it("lists exactly the sources it cites", () => {
    const list = sourceListArg(src);
    expect(list, `${route} renders no <SourceList sources={[...]} />`).not.toBeNull();
    const listed = keysIn(list!);
    const cited = keysIn(src.replace(list!, ""));
    expect(listed.size, `${route} lists no sources`).toBeGreaterThan(0);
    expect([...cited].filter((k) => !listed.has(k)), `${route} cites these but does not list them`).toEqual([]);
    expect([...listed].filter((k) => !cited.has(k)), `${route} lists these but never cites them`).toEqual([]);
  });
});
```

In `self-storage-hosting/tests/routing.test.ts`, import the registry and check each article's sitemap date:

In `self-storage-hosting/tests/routing.test.ts`, replace:

```ts
import { SITE, ROUTES } from "@/lib/site";
```

with:

```ts
import { SITE, ROUTES } from "@/lib/site";
import { canonicalFor } from "@/lib/seo";
import { ARTICLES, articlePath } from "@/lib/articles";
```

In `self-storage-hosting/tests/routing.test.ts`, replace:

```ts

  it("covers exactly the indexable routes in the manifest", () => {
```

with:

```ts

  it("dates each article from lib/articles.ts and no other page", () => {
    const expected = new Map(
      ARTICLES.map((a) => [canonicalFor(articlePath(a.slug)), a.dateModified ?? a.datePublished])
    );
    for (const e of entries) {
      expect(e.lastModified, e.url).toBe(expected.get(e.url));
    }
    // Every article is in the sitemap, so every expected date was checked.
    for (const u of expected.keys()) expect(urls).toContain(u);
  });

  it("covers exactly the indexable routes in the manifest", () => {
```

In `self-storage-hosting/tests/sitemap-coverage.test.ts`, add `"/resources"` to the expected `indexableRoutes()` array:

In `self-storage-hosting/tests/sitemap-coverage.test.ts`, replace:

```ts
      "/solutions/web-hosting",
      "/events",
```

with:

```ts
      "/solutions/web-hosting",
      "/resources",
      "/events",
```

In `self-storage-hosting/tests/content-policy.test.ts`:
- add the three new rows after the latency row;
- widen the outage row to catch `re-sync`;
- fix the two comments that counted the rows.

In `self-storage-hosting/tests/content-policy.test.ts`, replace:

```ts
// blocklist. It enforces those two rules rather than breaking them, so it is
// exempted from those two patterns only -- not from the other eleven, which
// it must obey like every other file (spec-driven correction: a blanket
```

with:

```ts
// blocklist. It enforces those two rules rather than breaking them, so it is
// exempted from those two patterns only -- not from any of the others, which
// it must obey like every other file (spec-driven correction: a blanket
```

In `self-storage-hosting/tests/content-policy.test.ts`, replace:

```ts
    // outage. Paraphrases drift towards exactly that ("changes resync").
    /\bkeeps? enforcing\b|last-known rules|\bresync/i,
    "Outage wording: render OUTAGE_BEHAVIOR from lib/claims.ts instead of paraphrasing it (spec 14 D3)",
```

with:

```ts
    // outage. Paraphrases drift towards exactly that ("changes resync").
    /\bkeeps? enforcing\b|last-known rules|\bre-?sync/i,
    "Outage wording: render OUTAGE_BEHAVIOR from lib/claims.ts instead of paraphrasing it (spec 14 D3)",
```

In `self-storage-hosting/tests/content-policy.test.ts`, replace:

```ts
  [/<\s*\d+\s*ms/i, "Unsubstantiated latency claim — spec D3"],
  [/"FAQPage"|'FAQPage'/, "FAQ rich results were retired 2026-05-07 — spec 7.2", SCHEMA],
```

with:

```ts
  [/<\s*\d+\s*ms/i, "Unsubstantiated latency claim — spec D3"],
  [
    // Spec 3.1 took these from trade press, and PTI's own pages publish none
    // of them (Plan 2 Appendix A.3). Spec 11 forbids a third-party
    // end-of-support date the vendor has not stated itself. Windows 10's
    // October 14, 2025 is Microsoft's own date and does not match.
    /\b(?:Oct(?:ober)?\.?\s+1,?\s+(?:2025|2023)|1\s+Oct(?:ober)?\.?\s+(?:2025|2023)|Dec(?:ember)?\.?\s+1,?\s+2025|1\s+Dec(?:ember)?\.?\s+2025|2025-10-01|2025-12-01|2023-10-01|10\/0?1\/(?:2025|2023)|12\/0?1\/2025)\b/i,
    "PTI publishes no end-of-support dates for these products — spec 11 guardrail, Plan 2 Appendix A.3",
  ],
  [
    // Spec 3.2(2)'s on-site PC wording failed verification. The two-minute
    // figure comes only from a third party, never from Storable or PTI.
    /\bSystem Controller PC\b|\bdesignated PC\b|\bevery (?:2|two) minutes\b/i,
    "Unverified on-site PC wording from spec 3.2(2) — use Plan 2 Appendix A.4 instead",
  ],
  [
    // PTI's pages list legacy products and name CloudController as the
    // go-forward controller. They do not say PTI moves anyone onto it.
    /\btransition(?:s|ed|ing)?\b[^.]{0,60}\bcustomers\b/i,
    'Do not say PTI "transitions" customers — Plan 2 Appendix A.3',
  ],
  [/"FAQPage"|'FAQPage'/, "FAQ rich results were retired 2026-05-07 — spec 7.2", SCHEMA],
```

In `self-storage-hosting/tests/content-policy.test.ts`, replace:

```ts
  // found something, and something specific, so a broken walk fails loudly
  // instead of reporting thirteen vacuous passes.
  it("actually walked real files", () => {
```

with:

```ts
  // found something, and something specific, so a broken walk fails loudly
  // instead of reporting every row above as a vacuous pass.
  it("actually walked real files", () => {
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
npx vitest run tests/articles.test.ts tests/routing.test.ts tests/sitemap-coverage.test.ts tests/content-policy.test.ts
```

Expected: FAIL, the articles and routing tests cannot import `@/lib/articles`; sitemap-coverage finds no `/resources` among the indexable routes; and the new on-site PC row names `app/(marketing)/solutions/access-control-hosting/page.tsx`, whose code comment quotes the banned "System Controller PC".

- [ ] **Step 3: Create the article registry**

Create `self-storage-hosting/lib/articles.ts` with an empty list:

Create `self-storage-hosting/lib/articles.ts`:

```ts
// The /resources articles (spec §11). Each one is a static page at
// app/(marketing)/resources/<slug>/page.tsx. This list is what the rest of
// the site knows about them: ROUTES (and so the sitemap and link checks), the
// /resources hub, and each page's h1, dates and Article JSON-LD all read it.
//
// `title` and `description` are also written out literally in each page's
// pageMeta call, because tests/sitemap-coverage.test.ts reads them from the
// source to check they are unique and short enough. tests/articles.test.ts
// fails if the two copies drift.
//
// No imports: lib/site.ts imports this file, and everything imports lib/site.
export type Article = {
  slug: string;
  /** The h1 and the Article headline. */
  headline: string;
  /** The <title> before the " | Self Storage Hosting" suffix. */
  title: string;
  /** Meta description and hub summary, at most 155 characters. */
  description: string;
  /** YYYY-MM-DD, the day the page first went live. */
  datePublished: string;
  /** YYYY-MM-DD. Set it only when the facts on the page change. */
  dateModified?: string;
};

export const ARTICLES: readonly Article[] = [];

export const articlePath = (slug: string): string => `/resources/${slug}`;

export function article(slug: string): Article {
  const found = ARTICLES.find((a) => a.slug === slug);
  if (!found) throw new Error(`No article with slug "${slug}" in lib/articles.ts`);
  return found;
}
```

- [ ] **Step 4: Build the hub**

Create `self-storage-hosting/app/(marketing)/resources/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { ARTICLES, articlePath } from "@/lib/articles";
import { formatDate } from "@/lib/dates";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

// Spec §5 fixes this title and description. The hub is a plain list: no
// ItemList or CollectionPage JSON-LD, which earn no rich result here.
export const metadata: Metadata = pageMeta({
  title: "Resources",
  description:
    "Practical guides on self-storage access control, gate-to-software syncing and migrating off end-of-life hardware.",
  path: "/resources",
});

const link = `font-semibold underline ${FOCUS_RING_LIGHT}`;

export default function ResourcesPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
        ]}
      />

      <section className="mx-auto max-w-4xl px-4 pt-12 pb-10 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Self-storage access control guides</h1>
        <p className="mt-4 text-lg text-text-800">
          Plain answers for facility owners and managers: what to do about gate hardware your vendor
          no longer supports, why gate codes stop matching your software, and which systems work
          together. Every vendor fact links to the vendor&apos;s own document.
        </p>
      </section>

      <section aria-label="Guides" className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <ul className="divide-y divide-background-200 border-y border-background-200">
          {ARTICLES.map((a) => (
            <li key={a.slug} className="py-6">
              <h2 className="text-xl font-semibold sm:text-2xl">
                <Link href={articlePath(a.slug)} className={`underline ${FOCUS_RING_LIGHT}`}>
                  {a.headline}
                </Link>
              </h2>
              <p className="mt-2 text-text-800">{a.description}</p>
              <p className="mt-2 text-sm text-text-700">
                Published <time dateTime={a.datePublished}>{formatDate(a.datePublished)}</time>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Looking for something else?</h2>
        <p className="mt-4 text-text-800">
          If a gate is down right now, start with{" "}
          <Link href="/support" className={link}>
            support and diagnostics
          </Link>
          . To see what we run for operators, read about{" "}
          <Link href="/solutions/access-control-hosting" className={link}>
            cloud access control hosting
          </Link>{" "}
          and{" "}
          <Link href="/solutions/web-hosting" className={link}>
            facility websites
          </Link>
          .
        </p>
      </section>

      <CtaBand
        heading="Have a question these guides do not answer?"
        text="Tell us which software and gate system you run, and we will answer it."
        primary={{ href: "/contact", label: "Contact us" }}
        secondary={{ href: "/demo", label: "Request a demo" }}
      />
    </>
  );
}
```

In `self-storage-hosting/lib/site.ts`, import the registry. Then flip `/resources` to built and add the article rows. The Plan 1 and Plan 2 comments inside `ROUTES` go: their instructions are finished. The rule they carried ("flip `built` in the same commit that creates the page") moves into the comment above `ROUTES`.

In `self-storage-hosting/lib/site.ts`, replace:

```ts
export const SITE = {
```

with:

```ts
import { ARTICLES, articlePath } from "./articles";

export const SITE = {
```

In `self-storage-hosting/lib/site.ts`, replace:

```ts
// They are independent, and the sitemap needs BOTH. Nav and footer render
// through liveNav()/liveFooter(), which drop anything not yet built, and
// Plan 1 only builds three pages -- advertising the other fourteen in
// sitemap.xml would hand Google a list of URLs that 404. Plan 2 flips each
// `built` to true as it lands.
export const ROUTES: Record<string, { title: string; indexable: boolean; built: boolean }> = {
  // These three are Plan 1's own pages and are `built: true` ahead of their
  // page.tsx on purpose -- Task 12 creates /, Task 13 /about-us and Task 16
  // /contact, and Task 17's sitemap-coverage test asserts exactly this trio.
  // Do not "correct" them to false to match the rule below: that empties the
  // sitemap and fails that test. The rule below governs Plan 2's routes.
  "/": { title: "Home", indexable: true, built: true },
  "/about-us": { title: "About Us", indexable: true, built: true },
  "/contact": { title: "Contact", indexable: true, built: true },

  // Plan 2 builds everything below. Flip `built` in the same commit that
  // creates the page, never before.
  "/solutions": { title: "Solutions", indexable: true, built: true },
  "/solutions/access-control-hosting": { title: "Cloud Self-Storage Access Control", indexable: true, built: true },
  "/solutions/web-hosting": { title: "Self-Storage Facility Websites", indexable: true, built: true },
  "/resources": { title: "Resources", indexable: true, built: false },
  "/events": { title: "Industry Events", indexable: true, built: true },
```

with:

```ts
// They are independent, and the sitemap needs BOTH. Nav and footer render
// through liveNav()/liveFooter(), which drop anything not yet built, so a
// route listed here before its page exists is never advertised or linked.
// Flip `built` in the same commit that creates the page, never before.
// Order matters: the sitemap lists routes in this order.
export const ROUTES: Record<string, { title: string; indexable: boolean; built: boolean }> = {
  "/": { title: "Home", indexable: true, built: true },
  "/about-us": { title: "About Us", indexable: true, built: true },
  "/contact": { title: "Contact", indexable: true, built: true },
  "/solutions": { title: "Solutions", indexable: true, built: true },
  "/solutions/access-control-hosting": { title: "Cloud Self-Storage Access Control", indexable: true, built: true },
  "/solutions/web-hosting": { title: "Self-Storage Facility Websites", indexable: true, built: true },
  "/resources": { title: "Resources", indexable: true, built: true },
  // One row per article, straight after the hub, from lib/articles.ts.
  ...Object.fromEntries(
    ARTICLES.map((a) => [articlePath(a.slug), { title: a.title, indexable: true, built: true }])
  ),
  "/events": { title: "Industry Events", indexable: true, built: true },
```

In `self-storage-hosting/app/sitemap.ts`, date the articles and nothing else:

In `self-storage-hosting/app/sitemap.ts`, replace:

```ts
import { canonicalFor } from "@/lib/seo";
```

with:

```ts
import { canonicalFor } from "@/lib/seo";
import { ARTICLES, articlePath } from "@/lib/articles";
```

In `self-storage-hosting/app/sitemap.ts`, replace:

```ts

export default function sitemap(): MetadataRoute.Sitemap {
```

with:

```ts

// An article's lastModified is the date a person set in lib/articles.ts when
// its facts changed, so it is a real signal. The other pages have no such
// date. Stamping them with the build time on every deploy is false freshness
// that teaches crawlers to ignore the field, so they carry none.
const ARTICLE_DATES = new Map(
  ARTICLES.map((a) => [articlePath(a.slug), a.dateModified ?? a.datePublished])
);

export default function sitemap(): MetadataRoute.Sitemap {
```

In `self-storage-hosting/app/sitemap.ts`, replace:

```ts
export default function sitemap(): MetadataRoute.Sitemap {
  // No lastModified: these are static marketing pages, and stamping every URL
  // with the build/request time on every crawl is false freshness that trains
  // crawlers to ignore the signal. A per-route date belongs in the route
  // manifest (lib/site.ts) where a human sets it, if this is wanted later.
  return indexableRoutes().map((path) => ({
    url: canonicalFor(path),
  }));
}
```

with:

```ts
export default function sitemap(): MetadataRoute.Sitemap {
  return indexableRoutes().map((path) => {
    const lastModified = ARTICLE_DATES.get(path);
    return lastModified === undefined
      ? { url: canonicalFor(path) }
      : { url: canonicalFor(path), lastModified };
  });
}
```

- [ ] **Step 5: Reword the comment the new policy row catches, and record the source re-check**

The comment on `/solutions/access-control-hosting` quoted the banned phrase in order to ban it. Point at the policy test instead:

In `self-storage-hosting/app/(marketing)/solutions/access-control-hosting/page.tsx`, replace:

```tsx
      {/* 2. The problem: Appendix A.4 only, paraphrased and cited. The spec
          3.2(2) wording about a 24/7 polling PC and a "System Controller PC"
          failed verification and must not be used. */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
```

with:

```tsx
      {/* 2. The problem: Appendix A.4 only, paraphrased and cited. The spec
          3.2(2) wording about the office PC failed verification and must not
          be used; tests/content-policy.test.ts lists the banned phrases. */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
```

All six entries already in `self-storage-hosting/lib/sources.ts` were checked against their pages again on 2026-09-19, while this plan was written. The articles cite four of them. Record that check: replace all six occurrences of `verifiedOn: "2026-09-18"` with `verifiedOn: "2026-09-19"`. There are exactly six. Do not change it to the day you run this step. `verifiedOn` records when someone actually checked the page.

- [ ] **Step 6: Run the tests to verify they pass**

```bash
npx vitest run tests/articles.test.ts tests/routing.test.ts tests/sitemap-coverage.test.ts tests/content-policy.test.ts
```

Expected: PASS.

- [ ] **Step 7: Add the rendered checks for articles**

In `self-storage-hosting/tests/rendered.test.ts`, import the registry:

In `self-storage-hosting/tests/rendered.test.ts`, replace:

```ts
import { OUTAGE_BEHAVIOR } from "@/lib/claims";
import { PKG_ROOT, walk } from "./helpers/walk";
```

with:

```ts
import { OUTAGE_BEHAVIOR } from "@/lib/claims";
import { ARTICLES, articlePath } from "@/lib/articles";
import { PKG_ROOT, walk } from "./helpers/walk";
```

Then add these tests before the outage-wording test. The fragment check skips a target that is not built yet, because an article may link one that a later task builds. The interim link rule in Task 3 explains why.

In `self-storage-hosting/tests/rendered.test.ts`, replace:

```ts

  it("shows the exact outage wording where it is promised (spec 14 D3)", () => {
```

with:

```ts

  it.each(ARTICLES.map((a) => [articlePath(a.slug), a] as const))(
    "%s marks itself up as one Article that matches what it shows",
    (r, a) => {
      const html = read(r);
      const articles = jsonLd(html).filter((b) => (b as { "@type"?: unknown })["@type"] === "Article");
      expect(articles.length, `${r} emits ${articles.length} Article blocks`).toBe(1);
      const block = articles[0] as { headline: string; mainEntityOfPage: string; datePublished: string };
      expect(block.mainEntityOfPage).toBe(canonicalFor(r));
      expect(block.datePublished).toBe(a.datePublished);
      const h1 = visible(html).match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "";
      expect(block.headline, `${r}: the Article headline is not the visible h1`).toBe(rowText(h1));
      expect(html).toContain('<meta property="og:type" content="article"/>');
      expect(html).toContain(`<meta property="article:published_time" content="${a.datePublished}"/>`);
      expect(html.includes('property="article:modified_time"'), `${r} article:modified_time`).toBe(
        a.dateModified !== undefined
      );
    }
  );

  it("lists every article on /resources, which is not itself an Article", () => {
    const html = read("/resources");
    expect(jsonLd(html).some((b) => (b as { "@type"?: unknown })["@type"] === "Article")).toBe(false);
    expect(html).toContain('<meta property="og:type" content="website"/>');
    for (const a of ARTICLES) expect(html, `/resources does not link ${a.slug}`).toContain(`href="${articlePath(a.slug)}"`);
  });

  it.each(ARTICLES.map((a) => articlePath(a.slug)))(
    "%s links a solution page in its first third and again in its closing third (spec 4.4)",
    (r) => {
      // The article body: the <article> element up to its Sources section,
      // which is a reference list and not part of the argument.
      const html = visible(read(r));
      const start = html.indexOf("<article");
      const end = html.indexOf('aria-labelledby="sources"', start);
      expect(start, `${r} has no <article>`).toBeGreaterThan(-1);
      expect(end, `${r} has no Sources section inside its <article>`).toBeGreaterThan(start);
      // Offsets in the reader's text, not the markup: a table's tags would
      // otherwise count as much as the words around it. Each solution link's
      // opening tag becomes a private-use marker character, which survives
      // rowText and never occurs in the site's own text.
      const MARK = "\uE000";
      const text = rowText(
        html.slice(start, end).replace(/<a\b[^>]*\shref="\/solutions\/[^"]*"[^>]*>/g, ` ${MARK} `)
      );
      const at: number[] = [];
      for (let i = text.indexOf(MARK); i !== -1; i = text.indexOf(MARK, i + 1)) at.push(i / text.length);
      expect(at.length, `${r} never links a /solutions/ page`).toBeGreaterThan(0);
      expect(at[0], `${r}: first solution link is not in the first third`).toBeLessThan(1 / 3);
      expect(at[at.length - 1], `${r}: last solution link is not in the closing third`).toBeGreaterThan(2 / 3);
    }
  );

  it("points every fragment link at an id that exists on its target page", () => {
    const broken: string[] = [];
    let checked = 0;
    for (const r of built) {
      for (const m of visible(read(r)).matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)?#([^"]+)"/g)) {
        const target = m[1] ?? r;
        if (!ROUTES[target]?.built) continue; // links.test and the link rule own this case
        checked++;
        if (!visible(read(target)).includes(`id="${m[2]}"`)) broken.push(`${r} -> ${target}#${m[2]}`);
      }
    }
    // Every page has at least its skip link to #main.
    expect(checked).toBeGreaterThanOrEqual(built.length);
    expect(broken, `fragment links with no matching id: ${broken.join(", ")}`).toEqual([]);
  });

  it("captions every table", () => {
    const bad: string[] = [];
    for (const r of built) {
      for (const m of visible(read(r)).matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/g)) {
        if (!/^\s*<caption\b/.test(m[1])) bad.push(r);
      }
    }
    expect(bad, `tables with no <caption> as their first child: ${bad.join(", ")}`).toEqual([]);
  });

  it("shows the exact outage wording where it is promised (spec 14 D3)", () => {
```

- [ ] **Step 8: Run the gates**

In Git Bash, from `self-storage-hosting/`:

```bash
npm run lint && npm test && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts
```

Expected: lint is clean, every unit test passes, the build succeeds and every rendered check passes.

- [ ] **Step 9: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add self-storage-hosting/lib/articles.ts self-storage-hosting/lib/site.ts self-storage-hosting/lib/sources.ts self-storage-hosting/app/sitemap.ts "self-storage-hosting/app/(marketing)/resources/page.tsx" "self-storage-hosting/app/(marketing)/solutions/access-control-hosting/page.tsx" self-storage-hosting/tests/articles.test.ts self-storage-hosting/tests/routing.test.ts self-storage-hosting/tests/sitemap-coverage.test.ts self-storage-hosting/tests/content-policy.test.ts self-storage-hosting/tests/rendered.test.ts
git commit -m "feat(resources): /resources hub, the article registry, and the rules every article must pass"
cd self-storage-hosting
```

- [ ] **Step 10: Probe the new guards**

Each content-policy row below:
1. appends a comment line to the end of `self-storage-hosting/lib/articles.ts`, after the closing `}` of `article()`;
2. runs the policy test;
3. restores the file.

A failure counts only if it names `lib/articles.ts`. The three **Must PASS** rows prove the rows are not too wide. Microsoft's own Windows 10 date, an unrelated October date and Storable's documented five-minute check must all stay allowed.

| Mutation | Run | Must fail naming |
|---|---|---|
| Append `// probe: October 1, 2025` to `lib/articles.ts` | `npx vitest run tests/content-policy.test.ts` | `articles.ts` |
| Append `// probe: 1 Oct 2025` to `lib/articles.ts` | `npx vitest run tests/content-policy.test.ts` | `articles.ts` |
| Append `// probe: Dec. 1, 2025` to `lib/articles.ts` | `npx vitest run tests/content-policy.test.ts` | `articles.ts` |
| Append `// probe: 1 December 2025` to `lib/articles.ts` | `npx vitest run tests/content-policy.test.ts` | `articles.ts` |
| Append `// probe: Oct 1 2023` to `lib/articles.ts` | `npx vitest run tests/content-policy.test.ts` | `articles.ts` |
| Append `// probe: 2025-10-01` to `lib/articles.ts` | `npx vitest run tests/content-policy.test.ts` | `articles.ts` |
| Append `// probe: 2025-12-01` to `lib/articles.ts` | `npx vitest run tests/content-policy.test.ts` | `articles.ts` |
| Append `// probe: 2023-10-01` to `lib/articles.ts` | `npx vitest run tests/content-policy.test.ts` | `articles.ts` |
| Append `// probe: 10/01/2025` to `lib/articles.ts` | `npx vitest run tests/content-policy.test.ts` | `articles.ts` |
| Append `// probe: 12/1/2025` to `lib/articles.ts` | `npx vitest run tests/content-policy.test.ts` | `articles.ts` |
| Append `// probe: System Controller PC` to `lib/articles.ts` | `npx vitest run tests/content-policy.test.ts` | `articles.ts` |
| Append `// probe: a designated PC` to `lib/articles.ts` | `npx vitest run tests/content-policy.test.ts` | `articles.ts` |
| Append `// probe: every 2 minutes` to `lib/articles.ts` | `npx vitest run tests/content-policy.test.ts` | `articles.ts` |
| Append `// probe: every two minutes` to `lib/articles.ts` | `npx vitest run tests/content-policy.test.ts` | `articles.ts` |
| Append `// probe: PTI transitions its Cloud Adaptor customers` to `lib/articles.ts` | `npx vitest run tests/content-policy.test.ts` | `articles.ts` |
| Append `// probe: the gate will re-sync` to `lib/articles.ts` | `npx vitest run tests/content-policy.test.ts` | `articles.ts` |
| Append `// probe: October 14, 2025` to `lib/articles.ts` | `npx vitest run tests/content-policy.test.ts` | **Must PASS** (this row shows the gap) |
| Append `// probe: October 13, 2026` to `lib/articles.ts` | `npx vitest run tests/content-policy.test.ts` | **Must PASS** (this row shows the gap) |
| Append `// probe: every five minutes` to `lib/articles.ts` | `npx vitest run tests/content-policy.test.ts` | **Must PASS** (this row shows the gap) |
| In `app/sitemap.ts`, replace `? { url: canonicalFor(path) }` with `? { url: canonicalFor(path), lastModified: "2026-01-01" }`, which dates every page | `npx vitest run tests/routing.test.ts` | `dates each article from lib/articles.ts and no other page` and `2026-01-01` |

Restore each file with `git checkout -- <file>` after its row. This is safe because the task is already committed. If any row ran `npm run build`, run `npm run build` once more after the last row so `.next` matches the committed source. Finish with `git status --short`. It must print nothing except the untracked `.claude/` and `.serena/` folders, if this checkout has them.

---

### Task 3: Article 1: FalconXT and StorLogix Cloud Adaptor end of life

Article 1 of spec §11. Primary query `falconxt end of life`, commercial intent.

PTI's facts page lists FalconXT, the StorLogix Cloud Adaptor and StorLogix Desktop as legacy products "no longer sold or supported", and gives no dates. The guide covers:
- what each product is, and how to tell which one runs your gate;
- every path forward:
  - staying put for now;
  - PTI's CloudController, with the wiring table from PTI's migration manual and PTI's controller comparison chart;
  - keeping PTI keypads on another vendor's system;
  - switching vendors;
  - moving a PC's job to a hosted service such as ours.

It links the access control solution page in its opening and again in its conclusion. The conclusion link points at that page's `#end-of-life` section.

This first article also brings in what every article page uses:
- `ArticleDates`, the byline;
- `SourceList`, the dated Sources section at the foot of the article;
- two guard changes:
  - **`tests/trademarks.test.ts` stops counting URLs as printed words.** A vendor's URL is a link target, not text a reader sees. Without this, `https://www.janusintl.com/products/noke` counts as the site printing "Noke", a spelling it never shows. The failing run in Step 6 proves it.
  - **The interim link rule.** The articles link one another, and each lands in its own task, so an article may link one that a later task builds. From this task until Task 9, `allowedLink` also accepts the five planned article paths, and only those. Task 9 removes them. Linking a route before it exists is exactly what Plan 2's link rule forbids, so the exception is named and time-boxed in the one file both link guards share.

**Files:**
- Modify: `self-storage-hosting/tests/articles.test.ts`
- Modify: `self-storage-hosting/tests/sitemap-coverage.test.ts`
- Modify: `self-storage-hosting/lib/articles.ts`
- Modify: `self-storage-hosting/lib/sources.ts`
- Create: `self-storage-hosting/components/ArticleDates.tsx`
- Create: `self-storage-hosting/components/SourceList.tsx`
- Create: `self-storage-hosting/app/(marketing)/resources/falconxt-end-of-life/page.tsx`
- Modify: `self-storage-hosting/tests/trademarks.test.ts`
- Modify: `self-storage-hosting/tests/helpers/links.ts`

**Interfaces:**
- Consumes:
  - From Task 2: `article(slug)`, `articlePath(slug)`, the registry-driven `ROUTES` rows, and the article checks in `tests/articles.test.ts` and `tests/rendered.test.ts`.
  - From Task 1: `pageMeta({ …, ogType: "article", publishedTime, modifiedTime })` and `articleSchema({ headline, description, path, datePublished, dateModified? })`.
  - From Plan 2: `SOURCES` and `Source` (`lib/sources.ts`); `<SourceLink source={SOURCES.x} />`; `Breadcrumbs`; `CtaBand`; `JsonLd`; `FOCUS_RING_LIGHT`.
- Produces:
  - The `falconxt-end-of-life` entry in `ARTICLES`, which also builds `/resources/falconxt-end-of-life`.
  - The `SOURCES` keys listed in the sources step.
  - `ArticleDates({ article }: { article: Article })` in `components/ArticleDates.tsx`.
  - `SourceList({ sources }: { sources: Source[] })` in `components/SourceList.tsx`. It renders `<section aria-labelledby="sources">` with `<h2 id="sources">`.
  - The interim `allowedLink(p)`: `isLive(p)`, or `p` without its `#fragment` is one of the five article paths. Task 9 removes the second half.

- [ ] **Step 1: Write the failing test**

In `self-storage-hosting/tests/articles.test.ts`, raise the article count from 0 to 1:

```ts
    expect(slugs.length).toBe(0);
```

with:

```ts
    expect(slugs.length).toBe(1);
```

In `self-storage-hosting/tests/sitemap-coverage.test.ts`, add the route to the expected `indexableRoutes()` array, after `"/resources"`:

```ts
      "/resources/falconxt-end-of-life",
```

```bash
npx vitest run tests/articles.test.ts tests/sitemap-coverage.test.ts
```

Expected: FAIL, the count test finds 0 articles where it expects 1, and `indexableRoutes()` has no `/resources/falconxt-end-of-life`.

- [ ] **Step 2: Register the article**

The entry is what builds the route: `ROUTES` and the sitemap read it. `datePublished` is the day the page first goes live. If you run this task after 2026-09-19, set `datePublished` to the day you run it, because the articles test fails on a date in the future. Ruling 5 moves it to the merge day if the branch merges later.

In `self-storage-hosting/lib/articles.ts`, replace:

```ts
export const ARTICLES: readonly Article[] = [];
```

with:

```ts
export const ARTICLES: readonly Article[] = [
  {
    slug: "falconxt-end-of-life",
    headline: "PTI FalconXT and StorLogix Cloud Adaptor End of Life: Every Option You Actually Have",
    title: "FalconXT End of Life: Your Options",
    description:
      "PTI lists FalconXT and the StorLogix Cloud Adaptor as legacy products it no longer sells or supports. Every path forward, each one cited to its vendor.",
    datePublished: "2026-09-19",
  },
];
```

- [ ] **Step 3: Add the 18 sources the article is first to cite**

Each entry below was checked against the live page on 2026-09-19. Keep that `verifiedOn` date: it records when someone checked the page, not when you typed the entry. Titles are in our own words wherever the document's own title uses a spelling the content policy forbids. Keys: `ptiLlmsTxt`, `ptiCloudControllerManual`, `ptiNextGenBlog`, `ptiComparisonChart`, `ptiCloudFalconGuide`, `ptiDesktopRequirements`, `ptiDesktopToCloudBlog`, `storableAccessControl`, `opentechCia`, `opentechPtiKeypads`, `doorkingSelfStorage`, `janusNoke`, `janusFaq`, `storguardProducts`, `sentinelHardware`, `spiderdoorHome`, `spiderdoorSwitch`, `quikstorHome`.

In `self-storage-hosting/lib/sources.ts`, after the `ptiMigrationManual` entry, add one blank line and then:

```ts
  // Cited by the /resources articles. Titles are written in our words wherever
  // a document's own title uses a spelling the content policy forbids.
  ptiLlmsTxt: {
    url: "https://www.ptisecurity.com/LLMs.txt",
    title: "Canonical facts for AI systems (plain text)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiCloudControllerManual: {
    url: "https://www.ptisecurity.com/documents/access-control/controllers/controllers-current/cloud-controller-user-manual-91924.pdf",
    title: "CloudController user's manual (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiNextGenBlog: {
    url: "https://www.ptisecurity.com/us/en/about-us/articles-and-news/blogs/four-ways-the-next-gen-cloud-controller-improves-self-storage-security",
    title: "Four ways the next-gen Cloud Controller improves self-storage security",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiComparisonChart: {
    url: "https://www.ptisecurity.com/documents/access-control/controllers/controllers-current/controller-comparison-chart.pdf",
    title: "Controller comparison chart (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiCloudFalconGuide: {
    url: "https://www.ptisecurity.com/documents/access-control/storlogix-cloud/storlogix-cloud-archive/StorLogix%20CLoud%20and%20FalconXT%20User%20Guide.pdf",
    title: "StorLogix Cloud and FalconXT user guide, archived (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiDesktopRequirements: {
    url: "https://www.ptisecurity.com/documents/misc/misc-archive/Computer_System_Requirements___StorLogix_Desktop.pdf",
    title: "Computer requirements for StorLogix Desktop, archived (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiDesktopToCloudBlog: {
    url: "https://www.ptisecurity.com/us/en/about-us/articles-and-news/blogs/moving-from-desktop-to-cloud",
    title: "Moving from desktop to cloud",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  storableAccessControl: {
    url: "https://www.storable.com/products/access-control/",
    title: "Storable Access Control",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },

  opentechCia: {
    url: "https://opentechalliance.com/solutions/insomniac-cia-access-control/",
    title: "CIA access control",
    publisher: "OpenTech Alliance",
    verifiedOn: "2026-09-19",
  },
  opentechPtiKeypads: {
    url: "https://opentechalliance.com/blog/opentech-releases-pti-keypad-integration/",
    title: "OpenTech releases PTI keypad integration (2020)",
    publisher: "OpenTech Alliance",
    verifiedOn: "2026-09-19",
  },

  doorkingSelfStorage: {
    url: "https://www.doorking.com/consumers/self-storage/",
    title: "Self storage",
    publisher: "DoorKing",
    verifiedOn: "2026-09-19",
  },
  janusNoke: {
    url: "https://www.janusintl.com/products/noke",
    title: "Nokē Smart Entry product page",
    publisher: "Janus International",
    verifiedOn: "2026-09-19",
  },
  janusFaq: {
    url: "https://www.janusintl.com/access-control/faqs",
    title: "Access control FAQs",
    publisher: "Janus International",
    verifiedOn: "2026-09-19",
  },

  storguardProducts: {
    url: "https://stor-guard.com/products/",
    title: "Products",
    publisher: "StorGuard",
    verifiedOn: "2026-09-19",
  },
  sentinelHardware: {
    url: "https://www.sentinelsystems.com/hardware",
    title: "Access control hardware",
    publisher: "Sentinel Systems",
    verifiedOn: "2026-09-19",
  },
  spiderdoorHome: {
    url: "https://www.spiderdoor.com/",
    title: "Self-storage gate security",
    publisher: "SpiderDoor",
    verifiedOn: "2026-09-19",
  },
  spiderdoorSwitch: {
    url: "https://www.spiderdoor.com/switch-self-storage-access-control-system/",
    title: "Switching access control systems without downtime",
    publisher: "SpiderDoor",
    verifiedOn: "2026-09-19",
  },
  quikstorHome: {
    url: "https://quikstor.com/",
    title: "Self-storage management software",
    publisher: "QuikStor",
    verifiedOn: "2026-09-19",
  },
```

- [ ] **Step 4: Add the byline and Sources components**

`ArticleDates` renders under the h1. The `<time>` values it prints are the same YYYY-MM-DD strings the Article JSON-LD and og:article tags carry:

Create `self-storage-hosting/components/ArticleDates.tsx`:

```tsx
import type { Article } from "@/lib/articles";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/dates";

/**
 * The byline under an article's h1: who wrote it, when it went live and,
 * once its facts have changed, when it was updated. The <time> elements carry
 * the same YYYY-MM-DD values as the Article JSON-LD and og:article tags.
 */
export default function ArticleDates({ article }: { article: Article }) {
  const { datePublished, dateModified } = article;
  return (
    <p className="mt-4 text-sm text-text-700">
      By {SITE.name}. Published <time dateTime={datePublished}>{formatDate(datePublished)}</time>
      {dateModified !== undefined && dateModified !== datePublished && (
        <>
          . Updated <time dateTime={dateModified}>{formatDate(dateModified)}</time>
        </>
      )}
      .
    </p>
  );
}
```

`SourceList` is the Sources section at the foot of each article. The rendered solution-link check treats `aria-labelledby="sources"` as the end of the article body, so keep that attribute:

Create `self-storage-hosting/components/SourceList.tsx`:

```tsx
import type { Source } from "@/lib/sources";
import { formatDate } from "@/lib/dates";
import SourceLink from "@/components/SourceLink";

/**
 * The "Sources" section at the foot of an article: every document the page
 * cites, each with the date we last checked it. tests/articles.test.ts fails
 * if a page cites a SOURCES entry in its text that is missing from this list,
 * or lists one it never cites.
 */
export default function SourceList({ sources }: { sources: Source[] }) {
  return (
    <section aria-labelledby="sources" className="mt-12 border-t border-background-200 pt-8">
      <h2 id="sources" className="text-2xl font-semibold">
        Sources
      </h2>
      <p className="mt-2 text-sm text-text-700">
        Vendors move and revise their documents. Each one below was checked on the date shown.
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
        {sources.map((s) => (
          <li key={s.url}>
            <SourceLink source={s} />, checked {formatDate(s.verifiedOn)}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 5: Write the page**

Create `self-storage-hosting/app/(marketing)/resources/falconxt-end-of-life/page.tsx`. Copy it exactly. Every vendor fact in it is cited to the `SOURCES` entry that states it, and its wording has been checked against the content policy, the trademark list and the rules in Global Constraints.

Create `self-storage-hosting/app/(marketing)/resources/falconxt-end-of-life/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { articleSchema } from "@/lib/schema";
import { article, articlePath } from "@/lib/articles";
import { SOURCES } from "@/lib/sources";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ArticleDates from "@/components/ArticleDates";
import SourceLink from "@/components/SourceLink";
import SourceList from "@/components/SourceList";
import CtaBand from "@/components/CtaBand";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

const A = article("falconxt-end-of-life");

export const metadata: Metadata = pageMeta({
  title: "FalconXT End of Life: Your Options",
  description:
    "PTI lists FalconXT and the StorLogix Cloud Adaptor as legacy products it no longer sells or supports. Every path forward, each one cited to its vendor.",
  path: "/resources/falconxt-end-of-life",
  ogType: "article",
  publishedTime: A.datePublished,
  modifiedTime: A.dateModified,
});

const link = `font-semibold underline ${FOCUS_RING_LIGHT}`;

// Page 7 of the migration manual (ptiMigrationManual): wire labels and
// terminal names from its table.
type WireRow = { wire: string; falcon: string; cloud: string };

const WIRING: readonly WireRow[] = [
  { wire: "Red, 12VDC", falcon: "Port 1", cloud: "DC + Out on the Power Supply Board" },
  { wire: "Black, GND", falcon: "Port 2", cloud: "DC - on the Power Supply Board" },
  { wire: "White, Data +", falcon: "Port 3", cloud: "A on the IO Module" },
  { wire: "Shield", falcon: "Port 4", cloud: "GND on the IO Module" },
  { wire: "Green, Data -", falcon: "Port 5", cloud: "B on the IO Module" },
];

// The controller comparison chart (ptiComparisonChart). The chart prints a
// check or a cross; this table writes them as Yes and No.
type ChartRow = { feature: string; falcon: "Yes" | "No"; cloud: "Yes" | "No" };

const CHART: readonly ChartRow[] = [
  { feature: "Cloud native", falcon: "No", cloud: "Yes" },
  { feature: "Cloud-based software", falcon: "Yes", cloud: "Yes" },
  { feature: "Automatic firmware updates", falcon: "No", cloud: "Yes" },
  { feature: "Enhanced offline mode", falcon: "No", cloud: "Yes" },
  { feature: "Webhooks", falcon: "Yes", cloud: "Yes" },
  { feature: "SMS notifications", falcon: "Yes", cloud: "Yes" },
  { feature: "Email notifications", falcon: "Yes", cloud: "Yes" },
  { feature: "Push notifications", falcon: "Yes", cloud: "Yes" },
  { feature: "Browser notifications", falcon: "Yes", cloud: "Yes" },
  { feature: "Aggregated dashboard", falcon: "Yes", cloud: "Yes" },
  { feature: "Integrates with unit security devices", falcon: "Yes", cloud: "Yes" },
  { feature: "Integrates with mobile solutions", falcon: "Yes", cloud: "Yes" },
];

// Generic questions; no vendor facts.
const QUESTIONS: readonly string[] = [
  "Which of my current devices do you keep, and which do you replace? Go device by device: controller, keypads, door alarms, smart locks.",
  "Can my existing wire stay, or must new wire be pulled? Who pays for it?",
  "Who does the installation, and who answers for it if something fails in the first week?",
  "What additional equipment might the job need, and at what cost?",
  "Where must the new equipment be mounted, and what power and backup does it need?",
  "How do tenant codes and access history get into the new system: imported, or rebuilt from my FMS?",
  "Does it work with my FMS today, and what happens to the old integration while the new one goes in?",
  "How is the changeover staged, and how much downtime should I plan for?",
  "What does it cost up front, and what does it cost each year after that?",
  "Is the product you are quoting on your current product list?",
];

export default function ArticlePage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "FalconXT End of Life: Your Options", path: "/resources/falconxt-end-of-life" },
        ]}
      />
      <JsonLd data={articleSchema({ ...A, path: articlePath(A.slug) })} />

      <article className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{A.headline}</h1>
        <ArticleDates article={A} />
        <p className="mt-6 text-lg text-text-800">
          PTI Security Systems lists FalconXT and the StorLogix Cloud Adaptor among its legacy
          products, which it says it no longer sells or supports. PTI&apos;s pages publish no date
          for this, so this guide gives none. <SourceLink source={SOURCES.ptiFacts} />
        </p>
        <p className="mt-4 text-text-800">
          PTI&apos;s plain-text facts file says the same. It adds that FalconXT, the StorLogix Cloud
          Adaptor and StorLogix Desktop should not be described as current PTI products.{" "}
          <SourceLink source={SOURCES.ptiLlmsTxt} />
        </p>
        <p className="mt-4 text-text-800">
          If one of these runs your gate, this guide explains what each product is, how to tell
          which you have, and every realistic path forward: staying put for now, PTI&apos;s own
          CloudController, keeping your PTI keypads on another vendor&apos;s system, switching
          vendors, and, if a PC is part of your setup, moving its job to a hosted service such as
          our{" "}
          <Link href="/solutions/access-control-hosting" className={link}>
            cloud-hosted access control
          </Link>
          .
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What PTI says, and what it does not</h2>
        <p className="mt-4 text-text-800">
          PTI&apos;s facts page has a Legacy Products section. It describes the products listed
          there as &quot;no longer sold or supported&quot; by PTI. FalconXT and the StorLogix Cloud
          Adaptor sit under access control hardware. StorLogix Desktop sits under software. The same
          list also names the VP Standard Series keypads and DigiGate.{" "}
          <SourceLink source={SOURCES.ptiFacts} />
        </p>
        <p className="mt-4 text-text-800">
          Neither the facts page nor the plain-text file gives a date for any of this. Neither says
          whether, or for how long, a FalconXT will keep reporting to StorLogix Cloud through an
          adaptor, and neither mentions repairs or spare parts. If a date matters to your plans, ask
          PTI for it in writing.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">
          What you have: FalconXT, the adaptor and StorLogix Desktop
        </h2>
        <p className="mt-4 text-text-800">
          Which of these are on your site decides which options apply to you.
        </p>

        <h3 className="mt-8 text-xl font-semibold">FalconXT, the controller</h3>
        <p className="mt-4 text-text-800">
          FalconXT is a PTI access controller. PTI&apos;s controller comparison chart sets it side
          by side with the CloudController, feature by feature.{" "}
          <SourceLink source={SOURCES.ptiComparisonChart} /> PTI&apos;s migration manual shows the
          wires from Access Interface (AI) devices landing on ports 1 to 5 of the FalconXT&apos;s AI
          devices module. <SourceLink source={SOURCES.ptiMigrationManual} /> PTI&apos;s CloudController
          manual gives keypads, multiplexers and relay boards as examples of AI devices.{" "}
          <SourceLink source={SOURCES.ptiCloudControllerManual} />
        </p>

        <h3 className="mt-8 text-xl font-semibold">The StorLogix Cloud Adaptor, the link to the cloud</h3>
        <p className="mt-4 text-text-800">
          PTI&apos;s facts page describes StorLogix Cloud as central cloud management software.{" "}
          <SourceLink source={SOURCES.ptiFacts} /> PTI&apos;s 2023 blog on the CloudController says
          the FalconXT requires an adaptor to communicate through the cloud.{" "}
          <SourceLink source={SOURCES.ptiNextGenBlog} /> PTI&apos;s archived StorLogix Cloud and
          FalconXT user guide describes that adaptor as a small computer that lets the FalconXT
          communicate over the Internet. <SourceLink source={SOURCES.ptiCloudFalconGuide} />
        </p>

        <h3 className="mt-8 text-xl font-semibold">StorLogix Desktop, the PC software</h3>
        <p className="mt-4 text-text-800">
          StorLogix Desktop is PTI software that runs on a Windows computer. PTI&apos;s archived
          computer requirements for it call for Windows 10 or higher. Its hardware requirements list
          an installed and working FalconXT, plus at least one AI device or door controller
          connected to that FalconXT. <SourceLink source={SOURCES.ptiDesktopRequirements} />
        </p>

        <h3 className="mt-8 text-xl font-semibold">Which setup is yours?</h3>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            A FalconXT that reports to StorLogix Cloud: a controller and an adaptor, both on the
            legacy list. <SourceLink source={SOURCES.ptiFacts} />
          </li>
          <li>
            A FalconXT with StorLogix Desktop on a Windows computer: the controller and the software
            are both on the legacy list. <SourceLink source={SOURCES.ptiFacts} />
          </li>
          <li>
            A CloudController that reports to StorLogix Cloud: no adaptor is involved, and PTI lists
            the CloudController among its current products.{" "}
            <SourceLink source={SOURCES.ptiLlmsTxt} />
          </li>
        </ul>
        <p className="mt-4 text-text-800">
          If you cannot tell which you have, start with the section on identifying your system on
          our{" "}
          <Link href="/support" className={link}>
            support page
          </Link>
          .
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Your options</h2>
        <p className="mt-4 text-text-800">
          There are five realistic paths. They are not exclusive: you can stay put for a while and
          collect quotes on the others.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Stay where you are, for now</h3>
        <p className="mt-4 text-text-800">
          PTI&apos;s pages set no date for these products. They say that PTI no longer sells or
          supports them. <SourceLink source={SOURCES.ptiFacts} />
        </p>
        <p className="mt-4 text-text-800">
          PTI has written about the risk in general terms. A 2026 PTI blog on moving from desktop to
          cloud tells owners to weigh the expense they could face when a desktop system ultimately
          fails, whether from a hardware failure or because the computer&apos;s operating system no
          longer supports it. The blog is about desktop systems in general and does not name
          FalconXT. <SourceLink source={SOURCES.ptiDesktopToCloudBlog} />
        </p>
        <p className="mt-4 text-text-800">
          If you stay for now, use the time: write down what is on site and get quotes, so that a
          failed part does not leave you choosing in a hurry.
        </p>

        <h3 className="mt-8 text-xl font-semibold">PTI&apos;s own path: the CloudController</h3>
        <p className="mt-4 text-text-800">
          PTI calls the CloudController its controller going forward.{" "}
          <SourceLink source={SOURCES.ptiContinuousLearning} /> PTI describes it as cloud-native
          hardware that links a facility&apos;s on-site access control hardware to StorLogix Cloud
          without a separate adaptor. <SourceLink source={SOURCES.ptiLlmsTxt} /> PTI&apos;s
          2023 blog makes the same point: the CloudController does not need a cloud adaptor, where
          the FalconXT does. <SourceLink source={SOURCES.ptiNextGenBlog} />
        </p>
        <p className="mt-4 text-text-800">
          PTI&apos;s Continuous Learning page lists a CloudController installation course, HW-032,
          on replacing hardware and switching a site from a FalconXT to a CloudController. The page
          does not say whether the course is meant for owners or for installers.{" "}
          <SourceLink source={SOURCES.ptiContinuousLearning} />
        </p>
        <p className="mt-4 text-text-800">
          PTI also publishes a FalconXT to CloudController migration manual. Here is what it says
          the change involves, with one point from PTI&apos;s CloudController manual.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            <strong>Wiring.</strong> Page 7 maps each wire on the FalconXT&apos;s AI devices module
            to a terminal on the CloudController. The table below shows the mapping.{" "}
            <SourceLink source={SOURCES.ptiMigrationManual} />
          </li>
          <li>
            <strong>New wire or old.</strong> The CloudController user&apos;s manual reads
            differently. It says to use new wire during retrofits and change-outs, not wire already
            pulled on a site. <SourceLink source={SOURCES.ptiCloudControllerManual} /> The two
            documents do not settle which applies to you, so ask PTI or your installer whether your
            existing wire can stay.
          </li>
          <li>
            <strong>Who does the work.</strong> PTI recommends that a certified, licensed, qualified
            technician install and set up its equipment. PTI can recommend local dealers and
            installers. Checking their qualifications and negotiating any pricing or contracts is the
            customer&apos;s responsibility, unless PTI has been specifically contracted in writing
            to do so on the customer&apos;s behalf. <SourceLink source={SOURCES.ptiMigrationManual} />
          </li>
          <li>
            <strong>Extra equipment.</strong> The manual says troubleshooting and configuration may
            include buying additional equipment. It names none and gives no prices.{" "}
            <SourceLink source={SOURCES.ptiMigrationManual} />
          </li>
          <li>
            <strong>Placement.</strong> The CloudController is not intended for outdoor
            installation. <SourceLink source={SOURCES.ptiMigrationManual} />
          </li>
          <li>
            <strong>Power.</strong> For sites prone to brownouts, blackouts, electrical storms or
            other major power interruptions, the manual recommends installing a UPS. It says the
            controller and system power supplies must be on UPSs separate from the computer&apos;s.{" "}
            <SourceLink source={SOURCES.ptiMigrationManual} />
          </li>
        </ul>
        <p className="mt-4 text-text-800">
          The manual does not list which keypads or other AI devices carry over to a
          CloudController. <SourceLink source={SOURCES.ptiMigrationManual} /> Ask for that in
          writing too.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="mb-2 text-left text-sm text-text-700">
              Where each wire on the FalconXT&apos;s AI devices module moves on the CloudController,
              from page 7 of PTI&apos;s migration manual
            </caption>
            <thead>
              <tr className="border-b border-background-300">
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Wire
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  FalconXT AI devices module
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  CloudController terminal
                </th>
              </tr>
            </thead>
            <tbody>
              {WIRING.map((r) => (
                <tr key={r.falcon} className="border-b border-background-200 align-top">
                  <th scope="row" className="py-3 pr-4 font-normal text-text-800">
                    {r.wire}
                  </th>
                  <td className="py-3 pr-4 text-text-800">{r.falcon}</td>
                  <td className="py-3 pr-4 text-text-800">{r.cloud}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-text-800">
          PTI&apos;s controller comparison chart marks three features as CloudController only: cloud
          native, automatic firmware updates and enhanced offline mode. Every other row is checked
          for both controllers. <SourceLink source={SOURCES.ptiComparisonChart} /> PTI&apos;s 2023
          blog adds that updating a FalconXT&apos;s firmware means inserting a flash drive into the
          controller. <SourceLink source={SOURCES.ptiNextGenBlog} />
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="mb-2 text-left text-sm text-text-700">
              PTI&apos;s controller comparison chart. The chart prints a check or a cross; they are
              shown here as Yes and No.
            </caption>
            <thead>
              <tr className="border-b border-background-300">
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Feature
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  FalconXT
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  CloudController
                </th>
              </tr>
            </thead>
            <tbody>
              {CHART.map((r) => (
                <tr key={r.feature} className="border-b border-background-200 align-top">
                  <th scope="row" className="py-3 pr-4 font-normal text-text-800">
                    {r.feature}
                  </th>
                  <td className="py-3 pr-4 text-text-800">{r.falcon}</td>
                  <td className="py-3 pr-4 text-text-800">{r.cloud}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 text-xl font-semibold">Keep your PTI keypads, change what is behind them</h3>
        <p className="mt-4 text-text-800">
          In April 2020, OpenTech Alliance announced an integration that lets operators connect
          existing PTI Apex or VP keypads to INSOMNIAC® CIA, its cloud-based access control.{" "}
          <SourceLink source={SOURCES.opentechPtiKeypads} />
        </p>
        <p className="mt-4 text-text-800">
          Keep three things in mind. The announcement covers PTI keypads and does not mention the
          FalconXT controller. It says the older keypads do not have every feature that CIA
          includes. And it dates from 2020. <SourceLink source={SOURCES.opentechPtiKeypads} />{" "}
          OpenTech Alliance&apos;s current CIA page still offers the upgrade with existing PTI Apex or
          VP keypads. <SourceLink source={SOURCES.opentechCia} /> Confirm with OpenTech Alliance that
          it fits your keypads. Note too that PTI lists
          the VP Standard Series among its legacy products.{" "}
          <SourceLink source={SOURCES.ptiFacts} />
        </p>
        <p className="mt-4 text-text-800">
          What would stay and what would go on your site is a question for OpenTech Alliance and an
          installer.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Switch to another access control vendor</h3>
        <p className="mt-4 text-text-800">
          Several companies sell access control for self-storage. Each one below is described only
          by what its own pages say, in no particular order. This is not a complete list, and
          naming a vendor here is not a recommendation.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            <strong>Storable Access Control.</strong> Storable says its access control software is
            fully integrated and designed for self-storage operators, with access point management
            built into the Storable platform. In its answer on whether it integrates with existing
            gate hardware, the same page lists PTI/StorLogix and PTI/Falcon among the third-party
            gate providers its software integrates with. It does not say which Falcon model.{" "}
            <SourceLink source={SOURCES.storableAccessControl} />
          </li>
          <li>
            <strong>OpenTech Alliance&apos;s INSOMNIAC CIA.</strong> OpenTech Alliance says CIA
            gives you control of a single facility or thousands of properties from anywhere.{" "}
            <SourceLink source={SOURCES.opentechCia} />
          </li>
          <li>
            <strong>Janus International&apos;s Nokē Smart Entry.</strong> Janus International
            describes the Nokē system as a fully integrated smart access solution designed for
            self-storage facilities. <SourceLink source={SOURCES.janusNoke} /> Its FAQ says the
            legacy Nokē locking product was controlled by the PTI access control system, and that
            the current version uses unit controllers at the door to control each lock. If
            you have the older Nokē locks, ask Janus International what the current version needs.{" "}
            <SourceLink source={SOURCES.janusFaq} />
          </li>
          <li>
            <strong>DoorKing.</strong> DoorKing says it provides automated access solutions designed
            for self-storage operations. <SourceLink source={SOURCES.doorkingSelfStorage} />
          </li>
          <li>
            <strong>StorGuard.</strong> StorGuard says it offers security and software solutions to
            the self-storage industry. Its products page lists keypads and access controllers.{" "}
            <SourceLink source={SOURCES.storguardProducts} />
          </li>
          <li>
            <strong>Sentinel Systems.</strong> Sentinel Systems says its access control systems
            integrate with the major management software used in the self-storage industry.{" "}
            <SourceLink source={SOURCES.sentinelHardware} />
          </li>
          <li>
            <strong>SpiderDoor.</strong> SpiderDoor says it offers cellular and wireless gate access
            solutions to self-storage owners. <SourceLink source={SOURCES.spiderdoorHome} /> Its page
            on switching systems says it does not migrate data from your old access control system,
            and connects to your management software instead.{" "}
            <SourceLink source={SOURCES.spiderdoorSwitch} />
          </li>
          <li>
            <strong>QuikStor.</strong> QuikStor, whose home page presents it as self-storage
            management software, says it has a native access control system.{" "}
            <SourceLink source={SOURCES.quikstorHome} />
          </li>
        </ul>
        <p className="mt-4 text-text-800">
          Ask each vendor, in writing, which of your current devices it would keep and which it
          would replace. To see which gate systems several facility management software (FMS)
          products list as integrations, see our{" "}
          <Link href="/resources/self-storage-gate-compatibility" className={link}>
            gate compatibility matrix
          </Link>
          .
        </p>

        <h3 className="mt-8 text-xl font-semibold">Take the office PC out of the chain</h3>
        <p className="mt-4 text-text-800">
          This path is for sites where a PC is part of how the gate runs. If you run StorLogix
          Desktop, PTI&apos;s requirements put a Windows computer in that chain.{" "}
          <SourceLink source={SOURCES.ptiDesktopRequirements} /> Our guide to{" "}
          <Link href="/resources/self-storage-gate-server" className={link}>
            whether you still need a Windows PC to run your gate
          </Link>{" "}
          covers the wider question.
        </p>
        <p className="mt-4 text-text-800">
          This is the path we offer. The office PC&apos;s job moves to the cloud. A small bridge
          stays at the site to talk to your controllers. The chain runs from your FMS, to our cloud
          service, to that bridge at the site, to your gate, keypads and locks. We work with gate
          controllers, keypads and readers, smart locks, and door alarms and sensors.
        </p>
        <p className="mt-4 text-text-800">
          Tell us what is on site. We will tell you plainly whether we can work with it as it is,
          and what replacing it would involve if not. Pricing depends on how many facilities you run
          and what hardware is on site.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Questions to ask any vendor before you switch</h2>
        <p className="mt-4 text-text-800">
          Whichever path you take, including PTI&apos;s, get answers to these in writing before you
          sign anything.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          {QUESTIONS.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
        <p className="mt-4 text-text-800">
          Two vendors have written about these points. SpiderDoor says two access control systems
          cannot run fully in parallel, because your management software can control only one
          access control integration at a time. <SourceLink source={SOURCES.spiderdoorSwitch} /> Ask
          each vendor how it handles that with your FMS. The checklist in PTI&apos;s desktop-to-cloud
          blog tells owners to allow for some downtime while they switch over.{" "}
          <SourceLink source={SOURCES.ptiDesktopToCloudBlog} />
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What to do next</h2>
        <p className="mt-4 text-text-800">
          Start by writing down what is on site: the controller, any adaptor or PC, the keypads, and
          any door alarms or smart locks. If you are not sure which PTI setup you have, our{" "}
          <Link href="/support" className={link}>
            support page
          </Link>{" "}
          has a section to help you work it out.
        </p>
        <p className="mt-4 text-text-800">
          Next, put the questions above to PTI or a PTI dealer about a CloudController, and to at
          least one other vendor. Compare what each would keep, replace and charge. If DigiGate is
          also on your site, our{" "}
          <Link href="/resources/digigate-replacement" className={link}>
            DigiGate replacement guide
          </Link>{" "}
          covers it separately.
        </p>
        <p className="mt-4 text-text-800">
          If a PC in your office is part of your gate setup and you want it out of the chain, read
          how{" "}
          <Link href="/solutions/access-control-hosting" className={link}>
            our cloud-hosted access control
          </Link>{" "}
          works, or go straight to its section on{" "}
          <Link href="/solutions/access-control-hosting#end-of-life" className={link}>
            moving off end-of-life gate hardware
          </Link>
          . Tell us what is on site. We will tell you plainly whether we can work with it as it is,
          and what replacing it would involve if not.
        </p>

        <SourceList
          sources={[
            SOURCES.ptiFacts,
            SOURCES.ptiLlmsTxt,
            SOURCES.ptiComparisonChart,
            SOURCES.ptiMigrationManual,
            SOURCES.ptiCloudControllerManual,
            SOURCES.ptiNextGenBlog,
            SOURCES.ptiCloudFalconGuide,
            SOURCES.ptiDesktopRequirements,
            SOURCES.ptiDesktopToCloudBlog,
            SOURCES.ptiContinuousLearning,
            SOURCES.opentechPtiKeypads,
            SOURCES.storableAccessControl,
            SOURCES.opentechCia,
            SOURCES.janusNoke,
            SOURCES.janusFaq,
            SOURCES.doorkingSelfStorage,
            SOURCES.storguardProducts,
            SOURCES.sentinelHardware,
            SOURCES.spiderdoorHome,
            SOURCES.spiderdoorSwitch,
            SOURCES.quikstorHome,
          ]}
        />
        <p className="mt-8 text-sm text-text-700">
          We are not affiliated with PTI Security Systems, OpenTech Alliance, Storable, Janus
          International, DoorKing, StorGuard, Sentinel Systems, SpiderDoor, QuikStor or Microsoft.
          Product names are the property of their owners.
        </p>
      </article>

      <CtaBand
        heading="Not sure what to do about your FalconXT?"
        text="Tell us what is on site. We will tell you plainly whether we can work with it as it is, and what replacing it would involve if not."
        primary={{ href: "/contact", label: "Contact us" }}
        secondary={{ href: "/demo", label: "Request a demo" }}
      />
    </>
  );
}
```

- [ ] **Step 6: Watch the trademark guard misread a URL, then fix it**

```bash
npx vitest run tests/trademarks.test.ts
```

Expected: FAIL, `named on the site but not on /legal/trademarks: Noke`. Nothing prints "Noke". The word comes from the URL of the new `janusNoke` source.

In `self-storage-hosting/tests/trademarks.test.ts`, strip URLs before counting words:

In `self-storage-hosting/tests/trademarks.test.ts`, replace:

```ts

function wordsUnder(dir: string): Set<string> {
```

with:

```ts

// URLs are link targets, never printed text, so they are removed before the
// words are counted. Otherwise a vendor's URL slug (".../noke-smart-entry...")
// would count as the site printing a spelling it never shows a reader.
const URL_PATTERN = /https?:\/\/[^\s"'`)]+/g;

function wordsUnder(dir: string): Set<string> {
```

In `self-storage-hosting/tests/trademarks.test.ts`, replace:

```ts
    .filter((f) => f !== TRADEMARKS_FILE)
    .map((f) => readFileSync(f, "utf8"))
    .join("\n");
```

with:

```ts
    .filter((f) => f !== TRADEMARKS_FILE)
    .map((f) => readFileSync(f, "utf8").replace(URL_PATTERN, " "))
    .join("\n");
```

```bash
npx vitest run tests/trademarks.test.ts
```

Expected: PASS.

- [ ] **Step 7: Watch the link guard refuse the links to later articles, then add the interim rule**

```bash
npx vitest run tests/source-links.test.ts
```

Expected: FAIL, `dead or forbidden links`, naming the page's links to `/resources/digigate-replacement`, `/resources/self-storage-gate-compatibility` and `/resources/self-storage-gate-server`.

Replace `self-storage-hosting/tests/helpers/links.ts` in full. Only the comment's last paragraph, the list and the `return` line are new:

```ts
import { isLive } from "@/lib/site";

// Which internal paths a link may name: built routes only.
//
// Both link guards use this: tests/source-links.test.ts for every href
// literal in the source, and tests/rendered.test.ts for every link in the
// built HTML. A page that is not built yet is added to ROUTES with
// `built: false`, and no link may name it until the commit that builds it
// flips the flag.
//
// INTERIM, Plan 3 Tasks 3-7 only. The five articles link one another and
// each lands in its own task, so an article may name one that a later task
// builds. Plan 3 Task 9 deletes this list once all five are built.
const PLANNED_ARTICLES = new Set([
  "/resources/falconxt-end-of-life",
  "/resources/gate-not-syncing",
  "/resources/digigate-replacement",
  "/resources/self-storage-gate-compatibility",
  "/resources/self-storage-gate-server",
]);

export function allowedLink(p: string): boolean {
  return isLive(p) || PLANNED_ARTICLES.has(p.split("#")[0]);
}
```

```bash
npx vitest run tests/source-links.test.ts
```

Expected: PASS.

- [ ] **Step 8: Run the tests to verify they pass**

```bash
npx vitest run tests/articles.test.ts tests/sitemap-coverage.test.ts
```

Expected: PASS.

- [ ] **Step 9: Run the gates**

In Git Bash, from `self-storage-hosting/`:

```bash
npm run lint && npm test && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts
```

Expected: lint is clean, every unit test passes, the build succeeds and every rendered check passes.

- [ ] **Step 10: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add self-storage-hosting/tests/articles.test.ts self-storage-hosting/tests/sitemap-coverage.test.ts self-storage-hosting/lib/articles.ts self-storage-hosting/lib/sources.ts self-storage-hosting/components/ArticleDates.tsx self-storage-hosting/components/SourceList.tsx "self-storage-hosting/app/(marketing)/resources/falconxt-end-of-life/page.tsx" self-storage-hosting/tests/trademarks.test.ts self-storage-hosting/tests/helpers/links.ts
git commit -m "feat(resources): FalconXT end-of-life guide, with the byline and Sources list every article uses"
cd self-storage-hosting
```

- [ ] **Step 11: Probe the guards against this page**

The Task 2 guards have never seen an article. Mutate this one, run the named test, and confirm it fails and names the page. Build rows take a minute or two each.

| Mutation | Run | Must fail naming |
|---|---|---|
| In `app/sitemap.ts`, date every article `"2026-01-01"`: replace `a.dateModified ?? a.datePublished` with `"2026-01-01"` | `npx vitest run tests/routing.test.ts` | `resources/falconxt-end-of-life` and `2026-01-01` |
| Delete the page's `<ArticleDates article={A} />` line | `npx vitest run tests/articles.test.ts` | `article page falconxt-end-of-life` and `renders its own registry entry` |
| Change the page's pageMeta title literal to `"FalconXT End of Life"` | `npx vitest run tests/articles.test.ts` | `article page falconxt-end-of-life` and `exports the registry's title` |
| In the page's `<SourceList>`, delete the line `SOURCES.quikstorHome,` | `npx vitest run tests/articles.test.ts` | `cites these but does not list them` and `quikstorHome` |
| In the page's `<SourceList>`, add `SOURCES.digiGateManual,` as the first entry. The page never cites it | `npx vitest run tests/articles.test.ts` | `lists these but never cites them` and `digiGateManual` |
| In the page's `<JsonLd …/>`, pass `headline: "Not the h1"` after `...A` | `npm run build`, then `RENDERED=1 npx vitest run tests/rendered.test.ts` | `/resources/falconxt-end-of-life: the Article headline is not the visible h1` |
| On the hub, replace `{ARTICLES.map((a) => (` with `{ARTICLES.slice(1).map((a) => (` | `npm run build`, then `RENDERED=1 npx vitest run tests/rendered.test.ts` | `/resources does not link falconxt-end-of-life` |
| Retarget the page's first solution link (the one reading "cloud-hosted access control") from `/solutions/access-control-hosting` to `/support` | `npm run build`, then `RENDERED=1 npx vitest run tests/rendered.test.ts` | `/resources/falconxt-end-of-life: first solution link is not in the first third` |
| In "What to do next", retarget both closing solution links (the plain one and the `#end-of-life` one) to `/contact` | `npm run build`, then `RENDERED=1 npx vitest run tests/rendered.test.ts` | `/resources/falconxt-end-of-life: last solution link is not in the closing third` |
| Delete the wiring table's `<caption>…</caption>` (four lines) | `npm run build`, then `RENDERED=1 npx vitest run tests/rendered.test.ts` | `tables with no <caption> as their first child: /resources/falconxt-end-of-life` |
| Change `#end-of-life` in the closing link to `#end-of-lyfe` | `npm run build`, then `RENDERED=1 npx vitest run tests/rendered.test.ts` | `fragment links with no matching id` and `/resources/falconxt-end-of-life -> /solutions/access-control-hosting#end-of-lyfe` |
| Misspell the link to the DigiGate article: `/resources/digigate-replacment` | `npx vitest run tests/source-links.test.ts` | `dead or forbidden links` and `/resources/digigate-replacment` |
| Append `const probe = "https://example.com/noke-smart-entry";` to `lib/articles.ts` | `npx vitest run tests/trademarks.test.ts` | **Must PASS** (this row shows the gap) |
| Append `// probe: Noke Smart Entry` to `lib/articles.ts` | `npx vitest run tests/trademarks.test.ts` | `named on the site but not on /legal/trademarks: Noke` |

Restore each file with `git checkout -- <file>` after its row. This is safe because the task is already committed. If any row ran `npm run build`, run `npm run build` once more after the last row so `.next` matches the committed source. Finish with `git status --short`. It must print nothing except the untracked `.claude/` and `.serena/` folders, if this checkout has them.

---

### Task 4: Article 2: why your gate isn't syncing

Article 2 of spec §11. Primary query `gate not syncing storage software`, informational intent.

A diagnostic guide:
1. five questions that find which link in the chain is broken;
2. checks by facility software: Storable Easy, Storable Edge and Sitelink by Storable;
3. checks by gate system: PTI, OpenTech Alliance, DoorKing and Janus.

Each check is drawn from that vendor's own troubleshooting document and cited to it. It ends with when to take the problem to the vendor. Spec §6.7 asks `/support` to link this article, so this task adds the link to `/support`'s diagnostics.

**Files:**
- Modify: `self-storage-hosting/tests/articles.test.ts`
- Modify: `self-storage-hosting/tests/sitemap-coverage.test.ts`
- Modify: `self-storage-hosting/lib/articles.ts`
- Modify: `self-storage-hosting/lib/sources.ts`
- Create: `self-storage-hosting/app/(marketing)/resources/gate-not-syncing/page.tsx`
- Modify: `self-storage-hosting/app/(marketing)/support/page.tsx`

**Interfaces:**
- Consumes:
  - From Task 2: `article(slug)`, `articlePath(slug)`, the registry-driven `ROUTES` rows, and the article checks in `tests/articles.test.ts` and `tests/rendered.test.ts`.
  - From Task 1: `pageMeta({ …, ogType: "article", publishedTime, modifiedTime })` and `articleSchema({ headline, description, path, datePublished, dateModified? })`.
  - From Plan 2: `SOURCES` and `Source` (`lib/sources.ts`); `<SourceLink source={SOURCES.x} />`; `Breadcrumbs`; `CtaBand`; `JsonLd`; `FOCUS_RING_LIGHT`.
  - From Task 3: `ArticleDates` and `SourceList`, and the interim `allowedLink` in `tests/helpers/links.ts`.
- Produces:
  - The `gate-not-syncing` entry in `ARTICLES`, which also builds `/resources/gate-not-syncing`.
  - The `SOURCES` keys listed in the sources step.

- [ ] **Step 1: Write the failing test**

In `self-storage-hosting/tests/articles.test.ts`, raise the article count from 1 to 2:

```ts
    expect(slugs.length).toBe(1);
```

with:

```ts
    expect(slugs.length).toBe(2);
```

In `self-storage-hosting/tests/sitemap-coverage.test.ts`, add the route to the expected `indexableRoutes()` array, after `"/resources/falconxt-end-of-life"`:

```ts
      "/resources/gate-not-syncing",
```

```bash
npx vitest run tests/articles.test.ts tests/sitemap-coverage.test.ts
```

Expected: FAIL, the count test finds 1 article where it expects 2, and `indexableRoutes()` has no `/resources/gate-not-syncing`.

- [ ] **Step 2: Register the article**

The entry is what builds the route: `ROUTES` and the sitemap read it. `datePublished` is the day the page first goes live. If you run this task after 2026-09-19, set `datePublished` to the day you run it, because the articles test fails on a date in the future. Ruling 5 moves it to the merge day if the branch merges later.

In `self-storage-hosting/lib/articles.ts`, add this entry at the end of `ARTICLES`, after the `falconxt-end-of-life` entry:

```ts
  {
    slug: "gate-not-syncing",
    headline: "Why Your Gate Isn't Syncing With Your Storage Software: A Diagnostic Guide",
    title: "Gate Not Syncing With Storage Software",
    description:
      "Find out why gate codes stop matching your storage software, step by step, using the vendors' own troubleshooting documents.",
    datePublished: "2026-09-19",
  },
```

- [ ] **Step 3: Add the 20 sources the article is first to cite**

Each entry below was checked against the live page on 2026-09-19. Keep that `verifiedOn` date: it records when someone checked the page, not when you typed the entry. Titles are in our own words wherever the document's own title uses a spelling the content policy forbids. Keys: `ptiCloudManual`, `ptiKeypadMessages`, `ptiCloudAdapterGuide`, `storableEasyCommonProblems`, `storableEasyDoorKing`, `storableEasyStorLogix`, `storableEasyNoke`, `storableEasyCloudNode`, `storableAccessControlFaq`, `storableEdgeGateIntegration`, `storableEdgeDelinquency`, `storableEdgeGateReport`, `sitelinkGateNotUpdating`, `sitelinkLockoutPrereq`, `sitelinkGateReport`, `sitelinkWithholdCodes`, `opentechG600Guide`, `doorkingRamManual`, `janusAppTroubleshooting`, `janusNokeTraining`.

In `self-storage-hosting/lib/sources.ts`, after the `ptiDesktopToCloudBlog` entry, add:

```ts
  ptiCloudManual: {
    url: "https://www.ptisecurity.com/documents/access-control/storlogix-cloud/storlogix-cloud-current/storlogix-user-manual_071423-1.pdf",
    title: "StorLogix Cloud user's manual (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiKeypadMessages: {
    url: "https://www.ptisecurity.com/documents/keypads/keypads-general/troubleshooting_keypad_messages.pdf",
    title: "Troubleshooting keypad messages (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiCloudAdapterGuide: {
    url: "https://www.ptisecurity.com/documents/litmos-docs/storlogix-cloud/StorLogix%20Cloud%20Adapter%20Installation%20Guide.pdf",
    title: "Cloud Adapter installation guide (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  storableEasyCommonProblems: {
    url: "https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-troubleshooting/common-gate-problems~7609015150086836225",
    title: "Common gate problems (Storable Easy help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  storableEasyDoorKing: {
    url: "https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-integrations/doorking-gate-integration-and-troubleshooting~7609004327770822699",
    title: "DoorKing gate integration and troubleshooting (Storable Easy help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  storableEasyStorLogix: {
    url: "https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-integrations/pti-storlogix-gate-integration~7609004327358414196",
    title: "PTI StorLogix gate integration (Storable Easy help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  storableEasyNoke: {
    url: "https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-integrations/janus-noke-smart-entry-system~7609004324182144375",
    title: "Nokē Smart Entry integration (Storable Easy help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  storableEasyCloudNode: {
    url: "https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-troubleshooting/what-should-i-do-if-i-get-an-error-that-there-was-a-problem-communicating-with-the-cloud-node~7609015147653595240",
    title: "Error communicating with the cloud node (Storable Easy help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  storableAccessControlFaq: {
    url: "https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/storable-access-control/storable-access-control-faq~7609022205225526581",
    title: "Storable Access Control FAQ (Storable Easy help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
```

In `self-storage-hosting/lib/sources.ts`, after the `storableAccessControl` entry, add:

```ts
  storableEdgeGateIntegration: {
    url: "https://help.storedge.com/storable-edge/account-management/facility-level-software-settings/gate-integration~7616843970740718814",
    title: "Gate integration (Storable Edge help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  storableEdgeDelinquency: {
    url: "https://help.storedge.com/storable-edge/account-management/delinquency-settings/delinquency-stages~7616206212725672475",
    title: "Delinquency stages (Storable Edge help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  storableEdgeGateReport: {
    url: "https://help.storedge.com/storable-edge/edge-product-guides/facility-level-reports/gate-access-report~7618986903542044427",
    title: "Gate access report (Storable Edge help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  sitelinkGateNotUpdating: {
    url: "https://support.sitelink.com/sitelink/sitelink-product-guides/access-and-gates/third-party-gates/troubleshooting-gate-is-not-updating~7605336808232776280",
    title: "Troubleshooting a gate that is not updating (Sitelink help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  sitelinkLockoutPrereq: {
    url: "https://support.sitelink.com/sitelink/sitelink-product-guides/access-and-gates/third-party-gates/how-do-i-set-prerequisite-events-for-gate-lockout~7605339858688561093",
    title: "Prerequisite events for gate lockout (Sitelink help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  sitelinkGateReport: {
    url: "https://support.sitelink.com/sitelink/sitelink-product-guides/reporting/the-gate-access-report~7607938886650522488",
    title: "The gate access report (Sitelink help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  sitelinkWithholdCodes: {
    url: "https://support.sitelink.com/sitelink/sitelink-product-guides/online-move-ins/how-do-i-withhold-gate-codes-for-online-move-ins~7605341655154753291",
    title: "Withholding gate codes for online move-ins (Sitelink help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
```

In `self-storage-hosting/lib/sources.ts`, after the `opentechCia` entry, add:

```ts
  opentechG600Guide: {
    url: "https://opentechalliance.com/wp-content/uploads/2026/07/INSOMNIAC-CIA-G-600-Gateway-Installation-Guide.pdf",
    title: "CIA G-600 gateway installation guide (PDF)",
    publisher: "OpenTech Alliance",
    verifiedOn: "2026-09-19",
  },
```

In `self-storage-hosting/lib/sources.ts`, after the `doorkingSelfStorage` entry, add:

```ts
  doorkingRamManual: {
    url: "https://www.doorking.com/wp-content/uploads/2013/09/1835-066-K-4-10_V6-2c.pdf",
    title: "Remote Account Manager for Windows user's manual (PDF)",
    publisher: "DoorKing",
    verifiedOn: "2026-09-19",
  },
```

In `self-storage-hosting/lib/sources.ts`, after the `janusFaq` entry, add:

```ts
  janusAppTroubleshooting: {
    url: "https://www.janusintl.com/knowledge/basic-app-device-troubleshooting",
    title: "Troubleshooting tips for the mobile app",
    publisher: "Janus International",
    verifiedOn: "2026-09-19",
  },
  janusNokeTraining: {
    url: "https://www.janusintl.com/knowledge/nok%C4%93-smart-entry-training-manual",
    title: "Nokē Smart Entry training manual",
    publisher: "Janus International",
    verifiedOn: "2026-09-19",
  },
```

- [ ] **Step 4: Write the page**

Create `self-storage-hosting/app/(marketing)/resources/gate-not-syncing/page.tsx`. Copy it exactly. Every vendor fact in it is cited to the `SOURCES` entry that states it, and its wording has been checked against the content policy, the trademark list and the rules in Global Constraints.

Create `self-storage-hosting/app/(marketing)/resources/gate-not-syncing/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { articleSchema } from "@/lib/schema";
import { article, articlePath } from "@/lib/articles";
import { SOURCES } from "@/lib/sources";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ArticleDates from "@/components/ArticleDates";
import SourceLink from "@/components/SourceLink";
import SourceList from "@/components/SourceList";
import CtaBand from "@/components/CtaBand";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

const A = article("gate-not-syncing");

export const metadata: Metadata = pageMeta({
  title: "Gate Not Syncing With Storage Software",
  description:
    "Find out why gate codes stop matching your storage software, step by step, using the vendors' own troubleshooting documents.",
  path: "/resources/gate-not-syncing",
  ogType: "article",
  publishedTime: A.datePublished,
  modifiedTime: A.dateModified,
});

const link = `font-semibold underline ${FOCUS_RING_LIGHT}`;

type SymptomRow = {
  symptom: string;
  link: string;
  check: string;
  /** Whose document gives the check. The body cites each one. */
  owner: string;
};

// The "most likely link" is our reading of the vendors' documents, not their
// words. Every check here is cited where the body states it.
const SYMPTOMS: SymptomRow[] = [
  {
    symptom: "No new codes reach the gate, but old codes work",
    link: "The sync program, or its computer",
    check: "Computer on and awake, sync program running, and its log",
    owner: "Storable (Storable Easy and Storable Edge help)",
  },
  {
    symptom: "New codes reach the gate software but fail at the keypad",
    link: "Gate software to controller, or controller to keypad",
    check: "Gate software result files and any keypad message",
    owner: "Storable (Storable Easy's DoorKing guide); PTI",
  },
  {
    symptom: "One new tenant's code fails while others work",
    link: "That tenant's record",
    check: "Unit set up in the gate software; unit numbers and names match",
    owner: "Storable (Storable Edge help)",
  },
  {
    symptom: "Tenants who are behind on rent still get in",
    link: "The lockout rule in the FMS, or the sync",
    check: "The lockout stage or event, any never-lock or exempt flag, then a gate refresh",
    owner: "Storable (Sitelink and Storable Edge help)",
  },
  {
    symptom: "A PTI keypad on a FalconXT shows ACCESS SUSPENDED for a tenant who has paid",
    link: "The FMS and StorLogix disagree",
    check: "Unsuspend the tenant in both systems, and confirm the paid status reaches the FalconXT",
    owner: "PTI",
  },
  {
    symptom: "A PTI keypad on a FalconXT shows Please Wait, then the date and time",
    link: "Keypad to controller",
    check: "Baud rate, keypad address and wiring",
    owner: "PTI",
  },
  {
    symptom: "Code changes stopped when the internet went down",
    link: "The site's internet connection",
    check: "The router's internet access, then the gateway or node status",
    owner: "OpenTech Alliance; Storable",
  },
  {
    symptom: "A code works at some hours but not others",
    link: "Time zone or access level settings",
    check: "Time zone number in the FMS and the gate system",
    owner: "PTI",
  },
];

export default function ArticlePage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "Gate Not Syncing With Storage Software", path: "/resources/gate-not-syncing" },
        ]}
      />
      <JsonLd data={articleSchema({ ...A, path: articlePath(A.slug) })} />

      <article className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{A.headline}</h1>
        <ArticleDates article={A} />
        <p className="mt-6 text-lg text-text-800">
          Gate codes stop matching your storage software when one link in a chain breaks. Each
          change travels from your facility management software (FMS), through a sync program or
          bridge, into the gate system, and out to the keypad. Find the broken link and you have
          found the fault.
        </p>

        <ol className="mt-4 list-decimal space-y-2 pl-5 text-text-800">
          <li>
            <strong>The FMS,</strong> such as Storable Edge, Storable Easy or Sitelink by Storable,
            where you create tenants, codes and lockout rules.
          </li>
          <li>
            <strong>The sync program or bridge.</strong> It may be a program on a computer, such as
            Storable Easy&apos;s gate sync program, or a direct cloud-to-cloud connection. PTI
            Security Systems&apos; StorLogix Cloud manual names two ways to connect an FMS: a
            cloud-to-cloud API integration or the BridgeApp. <SourceLink source={SOURCES.ptiCloudManual} />
          </li>
          <li>
            <strong>The gate system</strong> that holds the codes, such as StorLogix Cloud,
            DoorKing&apos;s software, OpenTech Alliance&apos;s INSOMNIAC® CIA or Janus
            International&apos;s Nokē Smart Entry.
          </li>
          <li>
            <strong>The keypad,</strong> and its wiring back to the controller.
          </li>
        </ol>

        <p className="mt-4 text-text-800">
          The vendors&apos; own documents name these causes. Storable Easy says its gate sync program
          may have stopped running, often after a Windows update or because a firewall blocks it,
          and that the computer must stay on and must not sleep.{" "}
          <SourceLink source={SOURCES.storableEasyGateSync} /> Storable Edge&apos;s gate program runs
          on a Windows computer; its help adds antivirus software blocking the program, and unit
          numbers or tenant names that differ between Storable Edge and the gate software.{" "}
          <SourceLink source={SOURCES.storableEdgeGateIntegration} />{" "}
          Sometimes nothing is broken: a setting, such as Sitelink&apos;s option to withhold codes
          from online move-ins, is doing its job. <SourceLink source={SOURCES.sitelinkWithholdCodes} />
        </p>
        <p className="mt-4 text-text-800">
          If you already know which vendor owns the fault, our{" "}
          <Link href="/support" className={link}>
            support page
          </Link>{" "}
          lists each vendor&apos;s support desk.
        </p>
        <p className="mt-4 text-text-800">
          Our guide to{" "}
          <Link href="/resources/self-storage-gate-server" className={link}>
            whether you still need a Windows PC in the office
          </Link>{" "}
          looks at which setups depend on one. If that computer keeps failing, one option is our{" "}
          <Link href="/solutions/access-control-hosting" className={link}>
            cloud-hosted access control
          </Link>
          . The office PC&apos;s job moves to the cloud. A small bridge stays at the site to talk to
          your controllers.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Which link is broken? Five quick questions</h2>
        <p className="mt-4 text-text-800">
          This is general reasoning, not a vendor procedure.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            <strong>One tenant or everyone?</strong> If one new code fails while others added that
            day work, the chain is running: check that tenant&apos;s record. If nothing has arrived
            since a certain day, a link has stopped.
          </li>
          <li>
            <strong>Does a brand-new code work?</strong> Make a test change, wait for the interval
            your vendor gives, and try it at the keypad.
          </li>
          <li>
            <strong>Do old codes still work?</strong> If old codes work and new ones do not, look
            upstream at the sync. If nothing works, look at the controller, keypad, power and wiring.
          </li>
          <li>
            <strong>Did the change reach the gate software?</strong> If not, suspect the FMS or the
            sync link. If it did but the keypad refuses it, suspect the gate software, controller or
            keypad.
          </li>
          <li>
            <strong>What changed recently?</strong> A Windows update, new computer, new antivirus,
            power cut or new router each points at a different link.
          </li>
        </ul>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="mb-2 text-left text-sm text-text-700">
              Matching a symptom to a link is our reading, not the vendors&apos; words. Each check is
              cited below.
            </caption>
            <thead>
              <tr className="border-b border-background-300">
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Symptom
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Most likely broken link
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Check first
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Whose document
                </th>
              </tr>
            </thead>
            <tbody>
              {SYMPTOMS.map((r) => (
                <tr key={r.symptom} className="border-b border-background-200 align-top">
                  <th scope="row" className="py-3 pr-4 font-normal text-text-800">
                    {r.symptom}
                  </th>
                  <td className="py-3 pr-4 text-text-800">{r.link}</td>
                  <td className="py-3 pr-4 text-text-800">{r.check}</td>
                  <td className="py-3 pr-4 text-text-800">{r.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-10 text-2xl font-semibold">Checks by facility software</h2>
        <p className="mt-4 text-text-800">
          Each step comes from that vendor&apos;s own help pages. The order is ours.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Storable Easy</h3>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-text-800">
          <li>
            <strong>Read the log.</strong> Under the Setup tab, select Gate. A red X, or a
            &quot;Checked for change&quot; line that does not appear every 5 minutes, means the sync
            has stopped. <SourceLink source={SOURCES.storableEasyGateSync} />
          </li>
          <li>
            <strong>Restart the service.</strong> In the Windows Services list, find the gate sync
            program&apos;s service, right-click it and choose Restart, or Start if it is stopped. The
            guide also shows how to set it to restart after a failure.{" "}
            <SourceLink source={SOURCES.storableEasyGateSync} />
          </li>
          <li>
            <strong>Keep the computer on 24/7.</strong> A screensaver is fine. Sleep and hibernate
            are not. <SourceLink source={SOURCES.storableEasyGateSync} />
          </li>
        </ol>
        <p className="mt-4 text-text-800">Then check what your gate system needs:</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            <strong>DoorKing.</strong> Keep the DoorKing program closed after setup, or the run.bat
            file will not run. An IMPPASS file means Storable Easy&apos;s side is working. After an
            IMPFAIL, search DoorKing&apos;s events.log for &quot;invalid&quot;. A SNDFAIL file points
            to a problem between the computer running DoorKing&apos;s software and the gate
            controller. Changing the DoorKing account name after setup stops new codes working.{" "}
            <SourceLink source={SOURCES.storableEasyDoorKing} /> Storable Easy&apos;s DigiGate
            guide, by contrast, says DigiGate should stay open.{" "}
            <SourceLink source={SOURCES.storableEasyDigiGate} />
          </li>
          <li>
            <strong>PTI StorLogix.</strong> An ERR7.log file in the PTI folder can mean a unit number
            contains a space, which StorLogix does not allow (G 15 must be G15). After an update, the
            PTI.dat file should have become a RESULT.dat file.{" "}
            <SourceLink source={SOURCES.storableEasyStorLogix} />
          </li>
          <li>
            <strong>Nokē Smart Entry.</strong> If units are added or edited after the initial
            integration, Storable Easy asks you to contact its support and request that an updated
            unit file be sent to Nokē. <SourceLink source={SOURCES.storableEasyNoke} />
          </li>
          <li>
            <strong>A cloud node.</strong> If you see &quot;There was a problem communicating with
            your cloud node&quot; when changing a gate code or in the gate log, Storable Easy&apos;s help
            says the node has lost its internet connection, usually because of a problem with its
            router connection or because the internet is offline.{" "}
            <SourceLink source={SOURCES.storableEasyCloudNode} />
          </li>
        </ul>

        <h3 className="mt-8 text-xl font-semibold">Storable Edge</h3>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-text-800">
          <li>
            <strong>Keep both programs running.</strong> With DigiGate, DoorKing, PTI and five other
            gate programs Storable lists, Storable Edge&apos;s gate program must be installed on the
            same computer as the gate software. Storable says to keep both running at all times;
            Storable Edge sends gate code changes to the gate software every 5 minutes.{" "}
            <SourceLink source={SOURCES.storableEdgeGateIntegration} />
          </li>
          <li>
            <strong>Restart, then force a full update.</strong> Log in to the gate software&apos;s
            computer as an administrator. Go to File,
            click Stop Service, then Start Service. Open the Storable Edge gate program from your
            desktop, go to Gate Codes and click Force Full Update.{" "}
            <SourceLink source={SOURCES.storableEdgeGateIntegration} />
          </li>
          <li>
            <strong>Check what blocks or rejects changes.</strong> Make sure antivirus is not
            blocking the gate program, and that every unit exists in the gate software, since
            Storable Edge updates units but does not create them. Then find the gate provider file
            path listed in your Gate Integration setup, follow it on your computer and look for an
            error file. Storable says the common errors are mismatched unit numbers or tenant
            names.{" "}
            <SourceLink source={SOURCES.storableEdgeGateIntegration} />
          </li>
          <li>
            <strong>Check the lockout rules.</strong> The Gate Lockout action in the delinquency
            stages disables gate codes automatically and requires a gate integration.{" "}
            <SourceLink source={SOURCES.storableEdgeDelinquency} /> The Gate Access report shows
            whether a tenant&apos;s code is disabled now (Locked Out) and whether the tenant is
            excluded from the general lockout rule (Locked Out Exempt).{" "}
            <SourceLink source={SOURCES.storableEdgeGateReport} />
          </li>
        </ol>

        <h3 className="mt-8 text-xl font-semibold">Sitelink</h3>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-text-800">
          <li>
            <strong>Refresh the gate.</strong> With a third-party gate, not Storable Access,
            Sitelink&apos;s help says that if tenants who should be locked out get in, or new tenants
            cannot, the gate most likely needs refreshing. Go to Setup, then Gate Setup, and under
            Update Gate click All Tenants.{" "}
            <SourceLink source={SOURCES.sitelinkGateNotUpdating} />
          </li>
          <li>
            <strong>Check the lockout timing.</strong> Gate lockout is tied to a past-due event. If
            you set a prerequisite event, such as an overlock, the tenant is not locked out until the
            set number of days has passed after that event is processed.{" "}
            <SourceLink source={SOURCES.sitelinkLockoutPrereq} />
          </li>
          <li>
            <strong>Check the report.</strong> The Gate Access report puts an X in its Never Lock
            column for any tenant who should never be locked out.{" "}
            <SourceLink source={SOURCES.sitelinkGateReport} />
          </li>
          <li>
            <strong>Check online move-ins.</strong> If gate codes are withheld for online move-ins,
            those tenants must contact the office for their code.{" "}
            <SourceLink source={SOURCES.sitelinkWithholdCodes} />
          </li>
        </ol>

        <h2 className="mt-10 text-2xl font-semibold">Checks by gate system</h2>

        <h3 className="mt-8 text-xl font-semibold">PTI StorLogix Cloud</h3>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            <strong>The BridgeApp computer.</strong> PTI says the BridgeApp should be installed on
            the PC or server that also holds your FMS client, which does not have to be at the site,
            though it usually is. Its service continues to run in the background after you exit the
            app. <SourceLink source={SOURCES.ptiCloudManual} />
          </li>
          <li>
            <strong>A full gate update, then a test.</strong> Once all users and units are in the
            FMS, PTI says to run a full Gate Update to StorLogix Cloud. In Single Site mode, the
            Access Tester lets a site manager test a new tenant&apos;s code remotely at a chosen entry
            or exit device. <SourceLink source={SOURCES.ptiCloudManual} />
          </li>
          <li>
            <strong>The Interface Time Zone.</strong> This number, set in the FMS for a set of hours,
            carries over to StorLogix Cloud as the user&apos;s Access Level.{" "}
            <SourceLink source={SOURCES.ptiCloudManual} /> If a code works at some hours and not
            others, compare it in both systems.
          </li>
        </ul>

        <h3 className="mt-8 text-xl font-semibold">PTI keypad messages</h3>
        <p className="mt-4 text-text-800">
          PTI&apos;s facts page lists FalconXT and the StorLogix Cloud Adaptor as legacy products it
          no longer sells or supports. <SourceLink source={SOURCES.ptiFacts} /> If you run a
          FalconXT, see our{" "}
          <Link href="/resources/falconxt-end-of-life" className={link}>
            FalconXT end-of-life guide
          </Link>
          . PTI&apos;s keypad-message guide, written around the FalconXT, explains:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            <strong>ACCESS SUSPENDED</strong> generally means the user was locked out for unpaid
            rent. Unsuspend them in both your FMS and StorLogix. If your software shows the account
            paid, ask that software&apos;s technical support to confirm the information is reaching
            the FalconXT. <SourceLink source={SOURCES.ptiKeypadMessages} />
          </li>
          <li>
            <strong>ACCESS DENIED:</strong> compare the incorrect code, which the FalconXT prints in
            its event log, with the unit&apos;s code in StorLogix. For AREA CLOSED, check
            the user&apos;s permitted time zones in StorLogix.{" "}
            <SourceLink source={SOURCES.ptiKeypadMessages} />
          </li>
          <li>
            <strong>Please Wait, then the date and time:</strong> the keypad is not communicating
            with the FalconXT. Check the baud rate, that the keypad&apos;s address is correct and not
            duplicated, the wiring and RS485 line, and the terminal blocks.{" "}
            <SourceLink source={SOURCES.ptiKeypadMessages} />
          </li>
        </ul>

        <h3 className="mt-8 text-xl font-semibold">StorLogix Cloud Adaptor</h3>
        <p className="mt-4 text-text-800">
          PTI&apos;s installation guide for this legacy unit says the LEDs are the most useful
          troubleshooting aid: three solid LEDs about 55 seconds after power-up means all is well.
          If LED2, the cloud connection, is out, check that the Ethernet cable goes to a router
          with internet access, try a different router, and check that the office network can reach
          PTI&apos;s cloud servers. <SourceLink source={SOURCES.ptiCloudAdapterGuide} />
        </p>

        <h3 className="mt-8 text-xl font-semibold">OpenTech Alliance&apos;s INSOMNIAC CIA</h3>
        <p className="mt-4 text-text-800">
          OpenTech&apos;s G-600 Gateway guide lists installation checks that include the router
          having internet access and the Gateway reporting Online in the Control Center. It also
          says that if the site loses its internet connection, access codes and configuration
          cannot be updated until the connection is back, though the Gateway continues to operate
          using cached data. <SourceLink source={SOURCES.opentechG600Guide} />
        </p>

        <h3 className="mt-8 text-xl font-semibold">DoorKing</h3>
        <p className="mt-4 text-text-800">
          DoorKing&apos;s self-storage page describes its Remote Account Manager as a Windows
          application that runs on a host PC.{" "}
          <SourceLink source={SOURCES.doorkingSelfStorage} /> Its manual for version 6.2 (later
          versions may differ) says import errors are detailed in the summary or events.log file,
          and that account names must match the account names in the import file, capital letters
          included. <SourceLink source={SOURCES.doorkingRamManual} />
        </p>

        <h3 className="mt-8 text-xl font-semibold">Janus International&apos;s Nokē Smart Entry</h3>
        <p className="mt-4 text-text-800">
          If the rental has not been processed in the FMS, Janus says the tenant&apos;s details will
          not sync to the Nokē Web Portal and the activation text will not be sent. Once it is
          processed, the update can take 1 to 5 minutes to appear; you can click Update Customer
          Data or the Refresh icon. <SourceLink source={SOURCES.janusAppTroubleshooting} /> If delinquent or moved-out
          tenants still get in, Janus&apos;s training manual describes a Use Blacklist setting that
          blocks their access, and recommends it at facilities that use fobs.{" "}
          <SourceLink source={SOURCES.janusNokeTraining} />
        </p>

        <h2 className="mt-10 text-2xl font-semibold">When to take it to your vendor</h2>
        <p className="mt-4 text-text-800">
          Go to your vendor once you know which link failed and have tried its steps.
          Storable Easy says problems with its software and its gate sync program are within its
          support line&apos;s scope, while problems with the gate software and the gate itself will
          probably need your gate software company.{" "}
          <SourceLink source={SOURCES.storableEasyCommonProblems} /> Before you get in
          touch, note when the last change went through, which test code you tried, and any error
          files or keypad messages. Our{" "}
          <Link href="/support" className={link}>
            support page
          </Link>{" "}
          lists each vendor&apos;s support desk.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">If the sync computer keeps being the cause</h2>
        <p className="mt-4 text-text-800">
          If a computer that must stay on keeps failing, you have four broad options, each with its
          own requirements.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            <strong>Stay put and look after the computer.</strong> Keep it awake, set its service to
            restart after a failure where your vendor documents how, and keep antivirus from
            blocking the gate program.
          </li>
          <li>
            <strong>Use a direct cloud connection where your systems offer one.</strong> PTI&apos;s
            manual names a cloud-to-cloud API integration for StorLogix Cloud.{" "}
            <SourceLink source={SOURCES.ptiCloudManual} /> Our{" "}
            <Link href="/resources/self-storage-gate-compatibility" className={link}>
              compatibility matrix
            </Link>{" "}
            compares the vendors&apos; own integration lists.
          </li>
          <li>
            <strong>Use your FMS vendor&apos;s own access control, if it has one.</strong> Storable
            has its own product, Storable Access Control. <SourceLink source={SOURCES.storableAccessControlFaq} />
          </li>
          <li>
            <strong>Move the computer&apos;s job to the cloud.</strong> This is our service. The
            office PC&apos;s job moves to the cloud. A small bridge stays at the site to talk to your
            controllers. We can bridge Storable Edge and Storable Easy to OpenTech Alliance&apos;s
            INSOMNIAC CIA and to DigiGate. Tell us your setup. Read{" "}
            <Link href="/solutions/access-control-hosting" className={link}>
              how cloud-hosted access control works
            </Link>
            .
          </li>
        </ul>

        <SourceList
          sources={[
            SOURCES.ptiCloudManual,
            SOURCES.storableEasyGateSync,
            SOURCES.storableEdgeGateIntegration,
            SOURCES.sitelinkWithholdCodes,
            SOURCES.storableEasyDoorKing,
            SOURCES.storableEasyDigiGate,
            SOURCES.storableEasyStorLogix,
            SOURCES.storableEasyNoke,
            SOURCES.storableEasyCloudNode,
            SOURCES.storableEdgeDelinquency,
            SOURCES.storableEdgeGateReport,
            SOURCES.sitelinkGateNotUpdating,
            SOURCES.sitelinkLockoutPrereq,
            SOURCES.sitelinkGateReport,
            SOURCES.ptiFacts,
            SOURCES.ptiKeypadMessages,
            SOURCES.ptiCloudAdapterGuide,
            SOURCES.opentechG600Guide,
            SOURCES.doorkingSelfStorage,
            SOURCES.doorkingRamManual,
            SOURCES.janusAppTroubleshooting,
            SOURCES.janusNokeTraining,
            SOURCES.storableEasyCommonProblems,
            SOURCES.storableAccessControlFaq,
          ]}
        />
        <p className="mt-8 text-sm text-text-700">
          We are not affiliated with Storable, PTI Security Systems, OpenTech Alliance, DoorKing,
          Janus International or Microsoft. Product names are the property of their owners.
        </p>
      </article>

      <CtaBand
        heading="Talk to us about your gate sync"
        text="Tell us which facility software and gate system you run."
        primary={{ href: "/contact", label: "Contact us" }}
        secondary={{ href: "/demo", label: "Request a demo" }}
      />
    </>
  );
}
```

- [ ] **Step 5: Link the article from the pages that point to it**

On `/support`, link the article from the diagnostics (spec §6.7):

In `self-storage-hosting/app/(marketing)/support/page.tsx`, replace:

```tsx
        <p className="mt-10 text-text-800">
          If the sync computer keeps turning out to be the problem, it can be taken out of the
```

with:

```tsx
        <p className="mt-10 text-text-800">
          For step-by-step checks drawn from each vendor&apos;s own troubleshooting documents, read{" "}
          <Link
            href="/resources/gate-not-syncing"
            className={`font-semibold underline ${FOCUS_RING_LIGHT}`}
          >
            why your gate isn&apos;t syncing with your storage software
          </Link>
          .
        </p>
        <p className="mt-4 text-text-800">
          If the sync computer keeps turning out to be the problem, it can be taken out of the
```

- [ ] **Step 6: Run the tests to verify they pass**

```bash
npx vitest run tests/articles.test.ts tests/sitemap-coverage.test.ts
```

Expected: PASS.

- [ ] **Step 7: Run the gates**

In Git Bash, from `self-storage-hosting/`:

```bash
npm run lint && npm test && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts
```

Expected: lint is clean, every unit test passes, the build succeeds and every rendered check passes.

- [ ] **Step 8: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add self-storage-hosting/tests/articles.test.ts self-storage-hosting/tests/sitemap-coverage.test.ts self-storage-hosting/lib/articles.ts self-storage-hosting/lib/sources.ts "self-storage-hosting/app/(marketing)/resources/gate-not-syncing/page.tsx" "self-storage-hosting/app/(marketing)/support/page.tsx"
git commit -m "feat(resources): gate-not-syncing diagnostic guide; /support links it"
cd self-storage-hosting
```

- [ ] **Step 9: Probe the guards against this page**

Two spot checks that the per-article guards see this page, not only the first one.

| Mutation | Run | Must fail naming |
|---|---|---|
| In the page's `<SourceList>`, delete the line `SOURCES.storableAccessControlFaq,` | `npx vitest run tests/articles.test.ts` | `cites these but does not list them` and `storableAccessControlFaq` |
| Retarget the page's first solution link (the one reading "cloud-hosted access control") from `/solutions/access-control-hosting` to `/support` | `npm run build`, then `RENDERED=1 npx vitest run tests/rendered.test.ts` | `/resources/gate-not-syncing: first solution link is not in the first third` |

Restore each file with `git checkout -- <file>` after its row. This is safe because the task is already committed. If any row ran `npm run build`, run `npm run build` once more after the last row so `.next` matches the committed source. Finish with `git status --short`. It must print nothing except the untracked `.claude/` and `.serena/` folders, if this checkout has them.

---

### Task 5: Article 3: DigiGate replacement

Article 3 of spec §11. Primary query `digigate replacement`, commercial intent.

PTI's facts page lists DigiGate as a legacy product it no longer sells or supports, with no date. PTI's archived end-of-life notice for its DigiTech products does print dates. This is the **only** page that may publish them, cited to that notice (`SOURCES.ptiEolNotice`):
- May 28, 2021 for the Last Time Buy Date and the End of Direct Support;
- December 3, 2021 for the End of Partner Support.

It does not explain what those terms mean.

The guide covers:
- what keeps working without the PC. DigiGate's installation manual says that once programmed, the system controller can run the system without the PC being on;
- what depends on the PC;
- the replacement paths each vendor documents;
- what to gather before changing anything.

Spec §6.1(8) asks the access control page's end-of-life section to link articles 1 and 3. `/support`'s end-of-life pointer gets the same two links, and the access control page's also links `/resources`.

**Files:**
- Modify: `self-storage-hosting/tests/articles.test.ts`
- Modify: `self-storage-hosting/tests/sitemap-coverage.test.ts`
- Modify: `self-storage-hosting/lib/articles.ts`
- Modify: `self-storage-hosting/lib/sources.ts`
- Create: `self-storage-hosting/app/(marketing)/resources/digigate-replacement/page.tsx`
- Modify: `self-storage-hosting/app/(marketing)/solutions/access-control-hosting/page.tsx`
- Modify: `self-storage-hosting/app/(marketing)/support/page.tsx`

**Interfaces:**
- Consumes:
  - From Task 2: `article(slug)`, `articlePath(slug)`, the registry-driven `ROUTES` rows, and the article checks in `tests/articles.test.ts` and `tests/rendered.test.ts`.
  - From Task 1: `pageMeta({ …, ogType: "article", publishedTime, modifiedTime })` and `articleSchema({ headline, description, path, datePublished, dateModified? })`.
  - From Plan 2: `SOURCES` and `Source` (`lib/sources.ts`); `<SourceLink source={SOURCES.x} />`; `Breadcrumbs`; `CtaBand`; `JsonLd`; `FOCUS_RING_LIGHT`.
  - From Task 3: `ArticleDates` and `SourceList`, and the interim `allowedLink` in `tests/helpers/links.ts`.
- Produces:
  - The `digigate-replacement` entry in `ARTICLES`, which also builds `/resources/digigate-replacement`.
  - The `SOURCES` keys listed in the sources step.

- [ ] **Step 1: Write the failing test**

In `self-storage-hosting/tests/articles.test.ts`, raise the article count from 2 to 3:

```ts
    expect(slugs.length).toBe(2);
```

with:

```ts
    expect(slugs.length).toBe(3);
```

In `self-storage-hosting/tests/sitemap-coverage.test.ts`, add the route to the expected `indexableRoutes()` array, after `"/resources/gate-not-syncing"`:

```ts
      "/resources/digigate-replacement",
```

```bash
npx vitest run tests/articles.test.ts tests/sitemap-coverage.test.ts
```

Expected: FAIL, the count test finds 2 articles where it expects 3, and `indexableRoutes()` has no `/resources/digigate-replacement`.

- [ ] **Step 2: Register the article**

The entry is what builds the route: `ROUTES` and the sitemap read it. `datePublished` is the day the page first goes live. If you run this task after 2026-09-19, set `datePublished` to the day you run it, because the articles test fails on a date in the future. Ruling 5 moves it to the merge day if the branch merges later.

In `self-storage-hosting/lib/articles.ts`, add this entry at the end of `ARTICLES`, after the `gate-not-syncing` entry:

```ts
  {
    slug: "digigate-replacement",
    headline: "Still Running DigiGate? What to Do Now That Support Has Ended",
    title: "DigiGate Replacement Options",
    description:
      "PTI no longer sells or supports DigiGate. What its end-of-life notice says, what keeps running without the PC, and the realistic ways to replace it.",
    datePublished: "2026-09-19",
  },
```

- [ ] **Step 3: Add the 8 sources the article is first to cite**

Each entry below was checked against the live page on 2026-09-19. Keep that `verifiedOn` date: it records when someone checked the page, not when you typed the entry. Titles are in our own words wherever the document's own title uses a spelling the content policy forbids. Keys: `ptiCloudControllerPage`, `ptiEolNotice`, `ptiKnowledgeBase`, `ptiKbArchive`, `ptiReplaceSyscon`, `ptiSendDigiGateFiles`, `digiGateUsersGuide`, `storableEasyThirdPartyGates`.

In `self-storage-hosting/lib/sources.ts`, after the `ptiLlmsTxt` entry, add:

```ts
  ptiCloudControllerPage: {
    url: "https://www.ptisecurity.com/us/en/products/access-control/cloud-controller",
    title: "CloudController",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
```

In `self-storage-hosting/lib/sources.ts`, after the `ptiCloudAdapterGuide` entry, add:

```ts
  ptiEolNotice: {
    url: "https://www.ptisecurity.com/documents/access-control/controllers/controllers-archive/digigate-archive/End-of-Life-Notice_DigiTech-and-Falcon2000-with-Falcon-Base-Unit.pdf",
    title: "End of life notice: DigiTech and Falcon 2000 with Falcon Base Unit (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiKnowledgeBase: {
    url: "https://www.ptisecurity.com/us/en/get_support/knowledgebase",
    title: "Knowledge base",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiKbArchive: {
    url: "https://www.ptisecurity.com/us/en/get_support/archived_knowledgebase",
    title: "Knowledge base archives",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiReplaceSyscon: {
    url: "https://www.ptisecurity.com/documents/access-control/controllers/controllers-archive/falconxt-archive/Replacing_a_Digitech_System_Controller_with_a_Falcon_XT.pdf",
    title: "Replacing a Digitech system controller with a Falcon XT, archived (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiSendDigiGateFiles: {
    url: "https://www.ptisecurity.com/documents/access-control/controllers/controllers-archive/digigate-archive/Sending_Your_DigiGate_File_to_PTI_Security_Systems___Updated___V1.pdf",
    title: "Sending your DigiGate files to PTI Security Systems, archived (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  digiGateUsersGuide: {
    url: "https://www.ptisecurity.com/documents/access-control/controllers/controllers-archive/digigate-archive/DigiGate_for_Windows_Users_Guide___Ver_3.6____1_.pdf",
    title: "DigiGate for Windows user's guide, archived (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },

  storableEasyThirdPartyGates: {
    url: "https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-integrations/third-party-gate-integrations~7608999610974774984",
    title: "Third-party gate integrations (Storable Easy help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
```

- [ ] **Step 4: Write the page**

Create `self-storage-hosting/app/(marketing)/resources/digigate-replacement/page.tsx`. Copy it exactly. Every vendor fact in it is cited to the `SOURCES` entry that states it, and its wording has been checked against the content policy, the trademark list and the rules in Global Constraints.

Create `self-storage-hosting/app/(marketing)/resources/digigate-replacement/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { articleSchema } from "@/lib/schema";
import { article, articlePath } from "@/lib/articles";
import { SOURCES } from "@/lib/sources";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ArticleDates from "@/components/ArticleDates";
import SourceLink from "@/components/SourceLink";
import SourceList from "@/components/SourceList";
import CtaBand from "@/components/CtaBand";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

const A = article("digigate-replacement");

export const metadata: Metadata = pageMeta({
  title: "DigiGate Replacement Options",
  description:
    "PTI no longer sells or supports DigiGate. What its end-of-life notice says, what keeps running without the PC, and the realistic ways to replace it.",
  path: "/resources/digigate-replacement",
  ogType: "article",
  publishedTime: A.datePublished,
  modifiedTime: A.dateModified,
});

const link = `font-semibold underline ${FOCUS_RING_LIGHT}`;

// The DigiTech lines of the timeline in PTI's end-of-life notice, exactly as
// PTI printed them (SOURCES.ptiEolNotice). These are the only third-party
// end-of-support dates this page may print. The notice itself has no printed
// issue date, and PTI gives none for DigiGate's legacy status.
type Milestone = { key: string; date: string; milestone: string; products: string };

const EOL_TIMELINE: Milestone[] = [
  {
    key: "last-time-buy",
    date: "May 28, 2021",
    milestone: "Last Time Buy Date",
    products: "DigiTech, and Falcon 2000 & Base Unit",
  },
  {
    key: "end-of-direct-support",
    date: "May 28, 2021",
    milestone: "End of Direct Support",
    products: "DigiTech, and Falcon 2000 & Base Unit",
  },
  {
    key: "end-of-partner-support",
    date: "December 3, 2021",
    milestone: "End of Partner Support",
    products: "DigiTech",
  },
];

export default function ArticlePage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "DigiGate Replacement Options", path: "/resources/digigate-replacement" },
        ]}
      />
      <JsonLd data={articleSchema({ ...A, path: articlePath(A.slug) })} />

      <article className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{A.headline}</h1>
        <ArticleDates article={A} />
        <p className="mt-6 text-lg text-text-800">
          PTI Security Systems lists DigiGate among its legacy products, which it says it no longer
          sells or supports. Its facts page gives no date for that. <SourceLink source={SOURCES.ptiFacts} />{" "}
          Separately, an archived PTI end-of-life notice for its DigiTech products, which PTI keeps in
          its DigiGate archive, prints dates for DigiTech: May 28, 2021 for the Last Time Buy Date and
          the End of Direct Support, and December 3, 2021 for the End of Partner Support.{" "}
          <SourceLink source={SOURCES.ptiEolNotice} />
        </p>
        <p className="mt-4 text-text-800">
          What still works is a separate question. DigiGate&apos;s installation manual says that once
          programmed, the system controller can run the system without the PC being on. It also says
          the office PC runs the DigiGate software and is used to program the controller.{" "}
          <SourceLink source={SOURCES.digiGateManual} /> The user&apos;s guide describes move-ins,
          move-outs and lockouts in your management software passing to a DigiGate program, which
          sends them on to the controller. <SourceLink source={SOURCES.digiGateUsersGuide} />
        </p>
        <p className="mt-4 text-text-800">
          So you have two decisions: what replaces the hardware, and what to do about the PC while
          you work that out. Below is what PTI&apos;s documents say, how Storable Easy and Storable
          Edge connect to DigiGate, the replacement paths each vendor documents, and what to gather
          before you change anything. If you run Storable Edge or Storable Easy, there is also a way
          to{" "}
          <Link href="/solutions/access-control-hosting" className={link}>
            take the office PC out of the software-to-gate chain
          </Link>{" "}
          while you decide.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What PTI says about DigiGate now</h2>
        <p className="mt-4 text-text-800">
          PTI&apos;s facts page has a Legacy Products section. It lists DigiGate under keypads, next
          to the VP Standard Series and Digitech, and lists FalconXT and the StorLogix Cloud Adaptor
          under access control hardware. PTI says it no longer sells or supports the products in that
          section and considers them legacy. <SourceLink source={SOURCES.ptiFacts} />
        </p>
        <p className="mt-4 text-text-800">
          The same page says archived knowledge base materials are accurate for the dates they were
          published, but should not be used on their own to judge what PTI offers today.{" "}
          <SourceLink source={SOURCES.ptiFacts} /> That is how to read every older DigiGate document
          in this article.
        </p>
        <p className="mt-4 text-text-800">
          PTI&apos;s current knowledge base lists no DigiGate documents. It points readers who cannot
          find their product to its archive. <SourceLink source={SOURCES.ptiKnowledgeBase} /> Among
          the documents under the archive&apos;s DigiGate heading are an installation manual, a user
          manual, a guide to sending your DigiGate files to PTI, and an end-of-life notice that
          PTI&apos;s link calls
          &quot;Falcon2000 &amp; DigiGate End of Life Notice&quot;.{" "}
          <SourceLink source={SOURCES.ptiKbArchive} />
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What the end-of-life notice says</h2>
        <p className="mt-4 text-text-800">
          The notice is headed End of Life Notice: DigiTech &amp; Falcon 2000 with Falcon Base Unit.
          Its text names DigiTech and Digitech, never DigiGate. No issue date is printed on it.{" "}
          <SourceLink source={SOURCES.ptiEolNotice} /> The link to DigiGate is PTI&apos;s own filing
          of the notice under the DigiGate heading of its archive.{" "}
          <SourceLink source={SOURCES.ptiKbArchive} />
        </p>
        <p className="mt-4 text-text-800">
          It says PTI is discontinuing two solutions and all associated products: Falcon 2000 with
          Falcon Base Unit, software and hardware, and DigiTech, software and hardware. Its timeline
          gives these dates for DigiTech. <SourceLink source={SOURCES.ptiEolNotice} />
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="mb-2 text-left text-sm text-text-700">
              The DigiTech dates in PTI&apos;s end-of-life notice, as PTI printed them
            </caption>
            <thead>
              <tr className="border-b border-background-300">
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Date
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Milestone
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Products named
                </th>
              </tr>
            </thead>
            <tbody>
              {EOL_TIMELINE.map((m) => (
                <tr key={m.key} className="border-b border-background-200 align-top">
                  <th scope="row" className="py-3 pr-4 font-normal text-text-800">
                    {m.date}
                  </th>
                  <td className="py-3 pr-4 text-text-800">{m.milestone}</td>
                  <td className="py-3 pr-4 text-text-800">{m.products}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-text-800">
          This article gives those terms and dates as PTI printed them and does not interpret them.
        </p>
        <p className="mt-4 text-text-800">
          The notice gives PTI&apos;s reasons. It called the decision &quot;long overdue&quot;, saying
          many of the products&apos; components had been discontinued several years earlier and were
          obsolete, and that the products could not support the industry&apos;s technological demands.{" "}
          <SourceLink source={SOURCES.ptiEolNotice} />
        </p>
        <p className="mt-4 text-text-800">
          It says customers will be encouraged to contact their local PTI Partners for help
          maintaining or replacing Digitech systems, and that trained partners may have inventory of
          discontinued products while supplies last. It noted that stock and replacement units were
          limited. It strongly encourages migration to the new solution and products as soon as
          possible, without naming them. <SourceLink source={SOURCES.ptiEolNotice} />
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What keeps working, and what depends on the PC</h2>
        <p className="mt-4 text-text-800">
          Two older documents in PTI&apos;s DigiGate archive explain how the system fits together:
          the DigiGate-700 installation manual, dated 2008, and the
          DigiGate-700 for Windows user&apos;s guide, dated 2009.{" "}
          <SourceLink source={SOURCES.digiGateManual} />{" "}
          <SourceLink source={SOURCES.digiGateUsersGuide} />
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            The system controller, or Syscon, is the heart of the system, and every DigiGate site has one. It
            stores the access codes and tenant information, and decides whether a code entered at a
            keypad is valid. <SourceLink source={SOURCES.digiGateManual} />
          </li>
          <li>
            Once programmed, the controller can run the system without the PC being on. An internal
            battery keeps its programming in memory through a power failure.{" "}
            <SourceLink source={SOURCES.digiGateManual} />
          </li>
          <li>
            The office PC runs the DigiGate software and is used to program the controller. It
            connects over an RS-232 cable up to 50 feet long.{" "}
            <SourceLink source={SOURCES.digiGateManual} />
          </li>
          <li>
            The controller keeps a log of activity at the site and uploads it to the PC
            automatically when the PC runs the DigiGate program.{" "}
            <SourceLink source={SOURCES.digiGateManual} />
          </li>
          <li>
            The PC should have its Hibernation and Power Standby features turned off. The manual
            warns that otherwise the PC can have communication problems with the DigiGate system.{" "}
            <SourceLink source={SOURCES.digiGateManual} />
          </li>
          <li>
            When you move a tenant in or out, transfer them to a new unit, bring a delinquent tenant
            up to date or lock a tenant out, your management software writes each transaction to a
            Link file. It then calls a DigiGate program that updates DigiGate&apos;s databases and
            sends the information on to the controller.{" "}
            <SourceLink source={SOURCES.digiGateUsersGuide} />
          </li>
          <li>
            The 2009 user&apos;s guide names Windows 95, 98, NT, XP and Vista, and says that on any
            other operating system the program will not work correctly, if at all.{" "}
            <SourceLink source={SOURCES.digiGateUsersGuide} /> We found no PTI statement about later
            versions of Windows.
          </li>
        </ul>
        <p className="mt-4 text-text-800">
          Put together: the controller checks codes against what it already holds, while changes from
          your management software and your event history both pass through the DigiGate program on
          that PC. If the PC is what worries you,{" "}
          <Link href="/resources/self-storage-gate-server" className={link}>
            our guide to whether you still need a Windows PC for your gate
          </Link>{" "}
          looks at that question across vendors.
        </p>

        <h3 className="mt-8 text-xl font-semibold">If you run Storable Easy</h3>
        <p className="mt-4 text-text-800">
          Storable Easy&apos;s list of the gate software it can integrate with includes DigiGate.{" "}
          <SourceLink source={SOURCES.storableEasyThirdPartyGates} /> Its DigiGate guide has you
          install Storable Easy&apos;s gate sync program and set that program&apos;s Post Download
          Action to digisend.exe in the digi folder. You then set DigiGate to read the gate file
          Storable Easy creates. The guide says DigiGate needs to stay open for the communication to
          work. <SourceLink source={SOURCES.storableEasyDigiGate} />
        </p>
        <p className="mt-4 text-text-800">
          Storable Easy&apos;s general troubleshooting article for the gate sync says your computer
          has to stay on 24/7 for the gate to sync, and should not be allowed to sleep or hibernate.{" "}
          <SourceLink source={SOURCES.storableEasyGateSync} />
        </p>

        <h3 className="mt-8 text-xl font-semibold">If you run Storable Edge</h3>
        <p className="mt-4 text-text-800">
          Storable Edge&apos;s gate integration page lists DigiGate among the gate systems you can use
          with Storable Edge. Its requirements say Storable Edge&apos;s gate software must be
          installed on the same computer as the DigiGate gate software, and call for a computer with
          Windows Vista or Windows 7, 8 or 10. It says to keep both your gate software and Storable
          Edge&apos;s gate program running at all times, so that updates to your gate software and
          keypads are not interrupted. <SourceLink source={SOURCES.storableEdgeGateIntegration} />
        </p>
        <p className="mt-4 text-text-800">
          Either way, the chain from your software to your gate runs through a Windows computer
          running DigiGate, then over the RS-232 cable to the controller.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Your replacement paths</h2>
        <p className="mt-4 text-text-800">
          PTI&apos;s notice encourages migration but names no product. Here are the paths, each from
          the vendors&apos; own documents, starting with the one that involves no purchase.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Keep it running while you plan</h3>
        <p className="mt-4 text-text-800">
          The manual is the case for not rushing: once programmed, the controller can run the system
          without the PC being on. <SourceLink source={SOURCES.digiGateManual} /> The risk is
          everything around it. Changes still depend on the PC, and on software whose user&apos;s
          guide names Windows versions only up to Vista.{" "}
          <SourceLink source={SOURCES.digiGateUsersGuide} /> PTI lists DigiGate as no longer sold or
          supported. <SourceLink source={SOURCES.ptiFacts} /> Its end-of-life notice said stock was
          limited. <SourceLink source={SOURCES.ptiEolNotice} /> If you wait, keep that PC&apos;s hibernation
          and standby off, as the manual asks, and use the time to work through the checklist further
          down.
        </p>

        <h3 className="mt-8 text-xl font-semibold">PTI&apos;s go-forward controller: CloudController</h3>
        <p className="mt-4 text-text-800">
          PTI&apos;s training page calls the CloudController its go-forward controller.{" "}
          <SourceLink source={SOURCES.ptiContinuousLearning} /> Its facts page lists CloudController
          as current hardware that connects a facility&apos;s on-site access control hardware to
          PTI&apos;s StorLogix Cloud software without a separate adaptor.{" "}
          <SourceLink source={SOURCES.ptiFacts} /> The CloudController page describes a
          cloud-to-cloud configuration that connects your facility&apos;s access control hardware with
          portfolio-wide software. <SourceLink source={SOURCES.ptiCloudControllerPage} />
        </p>
        <p className="mt-4 text-text-800">
          The CloudController page does not mention DigiGate or Digitech.{" "}
          <SourceLink source={SOURCES.ptiCloudControllerPage} /> We found no PTI document about moving
          a DigiGate site onto CloudController. That does not mean it cannot be done. Ask PTI, or a
          PTI partner as the notice suggests, what your site would need and which of your existing
          parts it would keep.
        </p>

        <h3 className="mt-8 text-xl font-semibold">The archived FalconXT route</h3>
        <p className="mt-4 text-text-800">
          An archived PTI document, filed under FalconXT, explains how to replace the Digitech
          System Controller with a FalconXT while keeping Digitech keypads and other peripheral
          devices. <SourceLink source={SOURCES.ptiReplaceSyscon} /> PTI&apos;s facts page now lists
          FalconXT as a legacy product too. <SourceLink source={SOURCES.ptiFacts} /> If you took that
          route earlier or are weighing it,{" "}
          <Link href="/resources/falconxt-end-of-life" className={link}>
            our FalconXT end-of-life guide
          </Link>{" "}
          covers the options from there.
        </p>

        <h3 className="mt-8 text-xl font-semibold">OpenTech Alliance&apos;s PTI keypad integration</h3>
        <p className="mt-4 text-text-800">
          In an April 2020 announcement, OpenTech Alliance said a new integration lets operators
          connect existing PTI Apex or VP keypads to INSOMNIAC® CIA, its cloud-based access control.
          It added that the older keypads do not have all of the features included with CIA.{" "}
          <SourceLink source={SOURCES.opentechPtiKeypads} /> Its current CIA page still offers the
          upgrade with existing PTI Apex or VP keypads. <SourceLink source={SOURCES.opentechCia} />
        </p>
        <p className="mt-4 text-text-800">
          Neither page mentions DigiGate keypads. If yours are DigiGate keypads, ask OpenTech
          Alliance whether they can connect before you plan around it.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Storable Access Control, and the gate vendors Storable lists</h3>
        <p className="mt-4 text-text-800">
          Storable says Storable Access Control embeds access management directly into
          Storable&apos;s facility management software. <SourceLink source={SOURCES.storableAccessControl} />
        </p>
        <p className="mt-4 text-text-800">
          On the same page, answering whether Storable integrates with existing gate hardware,
          Storable says its software integrates with a variety of third-party gate providers, to
          assign gate codes and update the gate software with tenant status. Among the providers it
          names are DigiGate, DoorKing (its 1838 Multi-Door Access Controller), OpenTech
          Alliance&apos;s CIA, PTI&apos;s StorLogix and Falcon, QuikStor, Revenue Control Systems,
          StorGuard and SpiderDoor. <SourceLink source={SOURCES.storableAccessControl} />
        </p>
        <p className="mt-4 text-text-800">
          That answer is about Storable&apos;s software sending codes and tenant status to each
          vendor&apos;s gate software. It does not say which of your DigiGate keypads, wiring or other
          parts a new system could reuse, so ask each vendor about your site.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Before you replace anything</h2>
        <p className="mt-4 text-text-800">
          Two archived PTI documents show what PTI&apos;s own process involved when they were
          written: one for sending your DigiGate files to PTI, and one for replacing the controller. Treat
          them as a list of questions to ask, not as current instructions.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            <strong>Your DigiGate files.</strong> PTI&apos;s guide to sending your DigiGate files to
            PTI describes a program that finds and compresses the DigiGate files PTI needs and sends
            them to PTI. It has to be run from the PC that has DigiGate installed, and it asks for a
            sales order or quote number from a PTI salesperson.{" "}
            <SourceLink source={SOURCES.ptiSendDigiGateFiles} />
          </li>
          <li>
            <strong>Your setups.</strong> PTI&apos;s document on replacing the Digitech controller
            with a FalconXT uses the DigiGate application on the PC that ran the access system to
            print reports for configuring the new software.{" "}
            <SourceLink source={SOURCES.ptiReplaceSyscon} /> Keep that PC, and DigiGate on it,
            working until your new system is set up.
          </li>
          <li>
            <strong>Keypad Zones.</strong> An appendix to the same document explains that in
            DigiGate, each tenant is assigned a Keypad Zone that defines which devices they can use
            to enter or exit, and that each tenant&apos;s time zone is handled separately. The
            document also says complex setups, such as those involving elevators or lighting
            control, may need help from a local dealer or installer.{" "}
            <SourceLink source={SOURCES.ptiReplaceSyscon} />
          </li>
          <li>
            <strong>Your FMS settings.</strong> The document says your management software&apos;s
            settings will need to be changed to send information to the new program instead of
            DigiGate. PTI says it cannot give instructions for that step.{" "}
            <SourceLink source={SOURCES.ptiReplaceSyscon} />
          </li>
          <li>
            <strong>Downtime.</strong> For that procedure, the document warns that the access control
            system is inoperable during the changeover, and says to let customers in and out by
            opening gates or doors manually until it is finished.{" "}
            <SourceLink source={SOURCES.ptiReplaceSyscon} /> Ask any vendor how long your gate would
            be down.
          </li>
          <li>
            <strong>Your wiring.</strong> The installation manual describes Uni-Muxes
            daisy-chained to the controller on a two-conductor shielded RS-485 cable, and 700LX
            keypads connecting over the RS-485 data cable.{" "}
            <SourceLink source={SOURCES.digiGateManual} /> Note which of these you have before anyone
            quotes a replacement.
          </li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold">What to do next</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-text-800">
          <li>
            Write down what is on site: the controller, keypads, Uni-Muxes and any other
            devices, the PC and its version of Windows, and which FMS you run.
          </li>
          <li>Keep the DigiGate PC and its data until your new system is configured.</li>
          <li>
            Ask each vendor you are considering what your site would need, which of your parts it
            would keep, and how long the gate would be down.
          </li>
          <li>Decide what the office PC does in the meantime.</li>
        </ol>
        <p className="mt-4 text-text-800">
          On that last point: if you run Storable Edge or Storable Easy, one option is to take the
          office PC out of the chain between your software and your gate while you plan the hardware
          decision.
          The office PC&apos;s job moves to the cloud. A small bridge stays at the site to talk to
          your controllers.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>We can bridge Storable Edge to DigiGate. Tell us your setup.</li>
          <li>We can bridge Storable Easy to DigiGate. Tell us your setup.</li>
        </ul>
        <p className="mt-4 text-text-800">
          If your hardware is something else, or you are not sure what you have, tell us what is on
          site. We will tell you plainly whether we can work with it as it is, and what replacing it
          would involve if not. You can read{" "}
          <Link href="/solutions/access-control-hosting" className={link}>
            how our cloud access control hosting works
          </Link>{" "}
          first. For each vendor&apos;s own help pages, see our{" "}
          <Link href="/support" className={link}>
            support page
          </Link>
          .
        </p>

        <SourceList
          sources={[
            SOURCES.ptiFacts,
            SOURCES.ptiEolNotice,
            SOURCES.digiGateManual,
            SOURCES.digiGateUsersGuide,
            SOURCES.ptiKnowledgeBase,
            SOURCES.ptiKbArchive,
            SOURCES.storableEasyThirdPartyGates,
            SOURCES.storableEasyDigiGate,
            SOURCES.storableEasyGateSync,
            SOURCES.storableEdgeGateIntegration,
            SOURCES.ptiContinuousLearning,
            SOURCES.ptiCloudControllerPage,
            SOURCES.ptiReplaceSyscon,
            SOURCES.opentechPtiKeypads,
            SOURCES.opentechCia,
            SOURCES.storableAccessControl,
            SOURCES.ptiSendDigiGateFiles,
          ]}
        />
        <p className="mt-8 text-sm text-text-700">
          We are not affiliated with PTI Security Systems, Storable, OpenTech Alliance, DoorKing,
          QuikStor, Revenue Control Systems, StorGuard, SpiderDoor or Microsoft.
          Product names are the property of their owners.
        </p>
      </article>

      <CtaBand
        heading="Tell us what DigiGate hardware is on site"
        text="We will tell you plainly whether we can work with it as it is, and what replacing it would involve if not."
        primary={{ href: "/contact", label: "Contact us" }}
        secondary={{ href: "/demo", label: "Request a demo" }}
      />
    </>
  );
}
```

- [ ] **Step 5: Link the article from the pages that point to it**

Both end-of-life guides now exist. Link them from the access control page's end-of-life section (spec §6.1(8)), together with `/resources` (spec §4.4):

In `self-storage-hosting/app/(marketing)/solutions/access-control-hosting/page.tsx`, replace:

```tsx
        <p className="mt-4 text-text-800">
          If you are weighing that move, tell us what is on site. We will say plainly what we can
```

with:

```tsx
        <p className="mt-4 text-text-800">
          For FalconXT and DigiGate we have written up the options, each cited to its vendor:{" "}
          <Link
            href="/resources/falconxt-end-of-life"
            className={`font-semibold underline ${FOCUS_RING_LIGHT}`}
          >
            FalconXT end of life: your options
          </Link>{" "}
          and{" "}
          <Link
            href="/resources/digigate-replacement"
            className={`font-semibold underline ${FOCUS_RING_LIGHT}`}
          >
            DigiGate replacement options
          </Link>
          . More guides are in{" "}
          <Link href="/resources" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            Resources
          </Link>
          .
        </p>
        <p className="mt-4 text-text-800">
          If you are weighing that move, tell us what is on site. We will say plainly what we can
```

And from `/support`'s end-of-life pointer:

In `self-storage-hosting/app/(marketing)/support/page.tsx`, replace:

```tsx
            moving off end-of-life gate systems
          </Link>
          .
        </p>
```

with:

```tsx
            moving off end-of-life gate systems
          </Link>
          , or go straight to our guides:{" "}
          <Link href="/resources/falconxt-end-of-life" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            FalconXT end of life: your options
          </Link>{" "}
          and{" "}
          <Link href="/resources/digigate-replacement" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            DigiGate replacement options
          </Link>
          .
        </p>
```

- [ ] **Step 6: Run the tests to verify they pass**

```bash
npx vitest run tests/articles.test.ts tests/sitemap-coverage.test.ts
```

Expected: PASS.

- [ ] **Step 7: Run the gates**

In Git Bash, from `self-storage-hosting/`:

```bash
npm run lint && npm test && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts
```

Expected: lint is clean, every unit test passes, the build succeeds and every rendered check passes.

- [ ] **Step 8: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add self-storage-hosting/tests/articles.test.ts self-storage-hosting/tests/sitemap-coverage.test.ts self-storage-hosting/lib/articles.ts self-storage-hosting/lib/sources.ts "self-storage-hosting/app/(marketing)/resources/digigate-replacement/page.tsx" "self-storage-hosting/app/(marketing)/solutions/access-control-hosting/page.tsx" "self-storage-hosting/app/(marketing)/support/page.tsx"
git commit -m "feat(resources): DigiGate replacement guide; the access control page and /support link both end-of-life guides"
cd self-storage-hosting
```

- [ ] **Step 9: Probe the guards against this page**

Two spot checks that the per-article guards see this page, not only the first one.

| Mutation | Run | Must fail naming |
|---|---|---|
| In the page's `<SourceList>`, delete the line `SOURCES.ptiSendDigiGateFiles,` | `npx vitest run tests/articles.test.ts` | `cites these but does not list them` and `ptiSendDigiGateFiles` |
| Retarget the page's first solution link (the one reading "take the office PC out of the software-to-gate chain") from `/solutions/access-control-hosting` to `/support` | `npm run build`, then `RENDERED=1 npx vitest run tests/rendered.test.ts` | `/resources/digigate-replacement: first solution link is not in the first third` |

Restore each file with `git checkout -- <file>` after its row. This is safe because the task is already committed. If any row ran `npm run build`, run `npm run build` once more after the last row so `.next` matches the committed source. Finish with `git status --short`. It must print nothing except the untracked `.claude/` and `.serena/` folders, if this checkout has them.

---

### Task 6: Article 4: the gate compatibility matrix

Article 4 of spec §11. Primary query `self storage software gate compatibility`, commercial intent.

Two dated tables:
1. the gate systems that Storable Edge, Storable Easy and Sitelink by Storable each list as integrations;
2. the Storable products that the gate makers' own pages name.

Every row is sourced to the vendor's own page. The tables record what vendors publish, not a claim about what works. Where the page mentions our own bridges, it uses only the approved "We can bridge {FMS} to {gate system}. Tell us your setup." wording (spec §14 F).

Links:
- Spec §11 links this article to both solution pages.
- Spec §6.1(6) asks the access control page's FMS section to link it.
- The web hosting page gets the link together with `/resources`. That completes spec §4.4's "both solution pages link to `/resources`".

Who keeps the matrix current is spec §14 E2, which is still open. Task 9 records it in the deploy checklist.

**Files:**
- Modify: `self-storage-hosting/tests/articles.test.ts`
- Modify: `self-storage-hosting/tests/sitemap-coverage.test.ts`
- Modify: `self-storage-hosting/lib/articles.ts`
- Modify: `self-storage-hosting/lib/sources.ts`
- Create: `self-storage-hosting/app/(marketing)/resources/self-storage-gate-compatibility/page.tsx`
- Modify: `self-storage-hosting/app/(marketing)/solutions/access-control-hosting/page.tsx`
- Modify: `self-storage-hosting/app/(marketing)/solutions/web-hosting/page.tsx`

**Interfaces:**
- Consumes:
  - From Task 2: `article(slug)`, `articlePath(slug)`, the registry-driven `ROUTES` rows, and the article checks in `tests/articles.test.ts` and `tests/rendered.test.ts`.
  - From Task 1: `pageMeta({ …, ogType: "article", publishedTime, modifiedTime })` and `articleSchema({ headline, description, path, datePublished, dateModified? })`.
  - From Plan 2: `SOURCES` and `Source` (`lib/sources.ts`); `<SourceLink source={SOURCES.x} />`; `Breadcrumbs`; `CtaBand`; `JsonLd`; `FOCUS_RING_LIGHT`.
  - From Task 3: `ArticleDates` and `SourceList`, and the interim `allowedLink` in `tests/helpers/links.ts`.
- Produces:
  - The `self-storage-gate-compatibility` entry in `ARTICLES`, which also builds `/resources/self-storage-gate-compatibility`.
  - The `SOURCES` keys listed in the sources step.

- [ ] **Step 1: Write the failing test**

In `self-storage-hosting/tests/articles.test.ts`, raise the article count from 3 to 4:

```ts
    expect(slugs.length).toBe(3);
```

with:

```ts
    expect(slugs.length).toBe(4);
```

In `self-storage-hosting/tests/sitemap-coverage.test.ts`, add the route to the expected `indexableRoutes()` array, after `"/resources/digigate-replacement"`:

```ts
      "/resources/self-storage-gate-compatibility",
```

```bash
npx vitest run tests/articles.test.ts tests/sitemap-coverage.test.ts
```

Expected: FAIL, the count test finds 3 articles where it expects 4, and `indexableRoutes()` has no `/resources/self-storage-gate-compatibility`.

- [ ] **Step 2: Register the article**

The entry is what builds the route: `ROUTES` and the sitemap read it. `datePublished` is the day the page first goes live. If you run this task after 2026-09-19, set `datePublished` to the day you run it, because the articles test fails on a date in the future. Ruling 5 moves it to the merge day if the branch merges later.

In `self-storage-hosting/lib/articles.ts`, add this entry at the end of `ARTICLES`, after the `digigate-replacement` entry:

```ts
  {
    slug: "self-storage-gate-compatibility",
    headline: "Self-Storage Software and Gate Access Control: An Independent Compatibility Matrix",
    title: "Self-Storage Gate Compatibility Matrix",
    description:
      "Which gate systems Storable Edge, Storable Easy and Sitelink list as integrations, compared with the gate makers' own lists. Dated and sourced.",
    datePublished: "2026-09-19",
  },
```

- [ ] **Step 3: Add the 10 sources the article is first to cite**

Each entry below was checked against the live page on 2026-09-19. Keep that `verifiedOn` date: it records when someone checked the page, not when you typed the entry. Titles are in our own words wherever the document's own title uses a spelling the content policy forbids. Keys: `ptiIntegrationsTable`, `ptiStorableRelease`, `storableEasyKiosks`, `sitelinkGatesMarketplace`, `storableSpiderDoor`, `opentechSitelink2018`, `opentechPartners`, `janusNokePartners`, `storguardPartners`, `spiderdoorAccessControl`.

In `self-storage-hosting/lib/sources.ts`, after the `ptiCloudManual` entry, add:

```ts
  ptiIntegrationsTable: {
    url: "https://www.ptisecurity.com/us/en/pti-partners/pms-integrations",
    title: "Facility software integrations table",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
  ptiStorableRelease: {
    url: "https://www.ptisecurity.com/us/en/about-us/articles-and-news/news/pti-security-systems-and-storable-partner-integration",
    title: "PTI Security Systems and Storable partner integration",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
```

In `self-storage-hosting/lib/sources.ts`, after the `storableEasyNoke` entry, add:

```ts
  storableEasyKiosks: {
    url: "https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-integrations/insomniac-kiosks-and-storable-easy~7609004321378949717",
    title: "Kiosk integration with Storable Easy (Storable Easy help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
```

In `self-storage-hosting/lib/sources.ts`, after the `sitelinkWithholdCodes` entry, add:

```ts
  sitelinkGatesMarketplace: {
    url: "https://www.sitelink.com/marketplace/gate-access",
    title: "Gates and access partners (Sitelink marketplace)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  storableSpiderDoor: {
    url: "https://www.storable.com/resources/integration/spiderdoor/",
    title: "SpiderDoor integration",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
```

In `self-storage-hosting/lib/sources.ts`, after the `opentechPtiKeypads` entry, add:

```ts
  opentechSitelink2018: {
    url: "https://opentechalliance.com/blog/sitelink-first-to-integrate-with-insomniac-cias-api/",
    title: "Sitelink first to integrate with the CIA API (2018)",
    publisher: "OpenTech Alliance",
    verifiedOn: "2026-09-19",
  },
  opentechPartners: {
    url: "https://opentechalliance.com/integration-partners/",
    title: "Alliance partners",
    publisher: "OpenTech Alliance",
    verifiedOn: "2026-09-19",
  },
```

In `self-storage-hosting/lib/sources.ts`, after the `janusFaq` entry, add:

```ts
  janusNokePartners: {
    url: "https://www.janusintl.com/noke-smart-entry-integration-partners",
    title: "Nokē Smart Entry software integration partners",
    publisher: "Janus International",
    verifiedOn: "2026-09-19",
  },
```

In `self-storage-hosting/lib/sources.ts`, after the `storguardProducts` entry, add:

```ts
  storguardPartners: {
    url: "https://stor-guard.com/partners/",
    title: "Partners",
    publisher: "StorGuard",
    verifiedOn: "2026-09-19",
  },
```

In `self-storage-hosting/lib/sources.ts`, after the `spiderdoorSwitch` entry, add:

```ts
  spiderdoorAccessControl: {
    url: "https://www.spiderdoor.com/self-storage-access-control-systems/",
    title: "Self-storage access control systems",
    publisher: "SpiderDoor",
    verifiedOn: "2026-09-19",
  },
```

- [ ] **Step 4: Write the page**

Create `self-storage-hosting/app/(marketing)/resources/self-storage-gate-compatibility/page.tsx`. Copy it exactly. Every vendor fact in it is cited to the `SOURCES` entry that states it, and its wording has been checked against the content policy, the trademark list and the rules in Global Constraints.

Create `self-storage-hosting/app/(marketing)/resources/self-storage-gate-compatibility/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { articleSchema } from "@/lib/schema";
import { article, articlePath } from "@/lib/articles";
import { SOURCES } from "@/lib/sources";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ArticleDates from "@/components/ArticleDates";
import SourceLink from "@/components/SourceLink";
import SourceList from "@/components/SourceList";
import CtaBand from "@/components/CtaBand";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

const A = article("self-storage-gate-compatibility");

export const metadata: Metadata = pageMeta({
  title: "Self-Storage Gate Compatibility Matrix",
  description:
    "Which gate systems Storable Edge, Storable Easy and Sitelink list as integrations, compared with the gate makers' own lists. Dated and sourced.",
  path: "/resources/self-storage-gate-compatibility",
  ogType: "article",
  publishedTime: A.datePublished,
  modifiedTime: A.dateModified,
});

const link = `font-semibold underline ${FOCUS_RING_LIGHT}`;

// Table 1: each Storable product's own published gate list, read on
// 2026-09-19. "Listed" means that product's list names the system; "Not in
// the list" means it does not, which is not a finding of incompatibility.
type ListCell = { status: "Listed" | "Not in the list"; detail?: string };
type SoftwareRow = { key: string; gate: string; edge: ListCell; easy: ListCell; sitelink: ListCell };

const LISTED: ListCell = { status: "Listed" };
const NOT_LISTED: ListCell = { status: "Not in the list" };

const SOFTWARE_ROWS: SoftwareRow[] = [
  {
    key: "storable-access-control",
    gate: "Storable Access Control (Storable)",
    edge: { status: "Listed", detail: "Called a native Edge solution" },
    easy: LISTED,
    sitelink: { status: "Listed", detail: "As Access Control by Storable" },
  },
  { key: "digigate", gate: "DigiGate", edge: LISTED, easy: LISTED, sitelink: NOT_LISTED },
  {
    key: "doorking",
    gate: "DoorKing",
    edge: { status: "Listed", detail: "1838 Multi-Door Access Controller" },
    easy: LISTED,
    sitelink: NOT_LISTED,
  },
  {
    key: "cia",
    gate: "INSOMNIAC CIA (OpenTech Alliance)",
    edge: { status: "Listed", detail: "As OpenTech CIA" },
    easy: {
      status: "Not in the list",
      detail: "The list has an entry named Insomniac that does not say which product; see the note below",
    },
    sitelink: LISTED,
  },
  {
    key: "pti",
    gate: "PTI Security Systems",
    edge: { status: "Listed", detail: "StorLogix and Falcon, as separate entries" },
    easy: { status: "Listed", detail: "StorLogix and Falcon 2000, as separate entries" },
    sitelink: { status: "Listed", detail: "The company is named; no product is" },
  },
  { key: "quikstor", gate: "QuikStor", edge: LISTED, easy: LISTED, sitelink: NOT_LISTED },
  { key: "rcs", gate: "Revenue Control Systems", edge: LISTED, easy: NOT_LISTED, sitelink: NOT_LISTED },
  { key: "storguard", gate: "StorGuard", edge: LISTED, easy: LISTED, sitelink: LISTED },
  { key: "spiderdoor", gate: "SpiderDoor", edge: LISTED, easy: NOT_LISTED, sitelink: LISTED },
  {
    key: "winsen",
    gate: "WinSen (Sentinel Systems)",
    edge: { status: "Listed", detail: "Except the RSCM and Platinum versions" },
    easy: { status: "Listed", detail: "As Winsen Sentinel" },
    sitelink: { status: "Listed", detail: "As Sentinel Systems; the company is named, no product is" },
  },
  {
    key: "janus-smart-entry",
    gate: "Nokē Smart Entry (Janus International)",
    edge: NOT_LISTED,
    easy: LISTED,
    sitelink: NOT_LISTED,
  },
  { key: "eight-io", gate: "Eight IO", edge: NOT_LISTED, easy: LISTED, sitelink: NOT_LISTED },
  { key: "bearbox", gate: "BearBox", edge: NOT_LISTED, easy: NOT_LISTED, sitelink: LISTED },
];

// Table 2: the Storable products each gate maker's own page names, read on
// 2026-09-19. Several pages use earlier or other names for Storable's
// products; the cells give today's name and say so, and never print the old
// one. The last row is Storable's own page about one gate maker.
type MakerRow = {
  key: string;
  page: string;
  names: string;
  how: string;
  source: (typeof SOURCES)[keyof typeof SOURCES];
};

const MAKER_ROWS: MakerRow[] = [
  {
    key: "pti",
    page: "PTI Security Systems: facility software integrations table",
    names:
      "Storable Edge (listed under an earlier name, in two rows), Storable Easy (listed under another name), Sitelink",
    how: "Sitelink and Storable Easy: BridgeApp yes, API no. Storable Edge: one row with BridgeApp yes, API no, and a separate webhooks row with BridgeApp no, API yes.",
    source: SOURCES.ptiIntegrationsTable,
  },
  {
    key: "opentech-2018",
    page: "OpenTech Alliance: release dated September 19, 2018",
    names: "Sitelink",
    how: "Says Sitelink was the first vendor to integrate with the INSOMNIAC CIA API.",
    source: SOURCES.opentechSitelink2018,
  },
  {
    key: "doorking",
    page: "DoorKing: self-storage page",
    names:
      "Storable Edge (listed under an earlier name), Storable Easy (listed under another name, linked to the domain of Storable Easy's help center), Sitelink",
    how: "All three are on the list for the Remote Account Manager, which DoorKing describes as Windows software that runs on a host personal computer.",
    source: SOURCES.doorkingSelfStorage,
  },
  {
    key: "janus",
    page: "Janus International: Nokē Smart Entry integration partners (list revised July 2026)",
    names: "Storable Edge (listed under an earlier name), Storable Easy (listed under another name), Sitelink",
    how: "Not stated. The names are logos.",
    source: SOURCES.janusNokePartners,
  },
  {
    key: "storguard",
    page: "StorGuard: partners page",
    names: "Storable Edge (listed under an earlier name), Storable Easy (listed under another name), Sitelink",
    how: "Not stated.",
    source: SOURCES.storguardPartners,
  },
  {
    key: "sentinel",
    page: "Sentinel Systems: hardware page",
    names: "Storable Edge (listed under an earlier name), Sitelink",
    how: "Not stated. The names are logos under an access control compatibility heading.",
    source: SOURCES.sentinelHardware,
  },
  {
    key: "spiderdoor",
    page: "SpiderDoor: access control page",
    names: "Storable Edge (listed under an earlier name), Sitelink",
    how: "Not stated for each software product.",
    source: SOURCES.spiderdoorAccessControl,
  },
  {
    key: "spiderdoor-on-storable",
    page: "SpiderDoor integration page on Storable's own site",
    names: "Sitelink",
    how: "Says Sitelink and SpiderDoor communicate through the cloud, and that a computer at the site is no longer needed.",
    source: SOURCES.storableSpiderDoor,
  },
];

const th = "py-3 pr-4 font-semibold";
const td = "py-3 pr-4 text-text-800";

function Cell({ cell }: { cell: ListCell }) {
  return (
    <td className={td}>
      {cell.status}
      {cell.detail !== undefined && <span className="block text-sm text-text-700">{cell.detail}</span>}
    </td>
  );
}

export default function ArticlePage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "Self-Storage Gate Compatibility Matrix", path: "/resources/self-storage-gate-compatibility" },
        ]}
      />
      <JsonLd data={articleSchema({ ...A, path: articlePath(A.slug) })} />

      <article className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{A.headline}</h1>
        <ArticleDates article={A} />
        <p className="mt-6 text-lg text-text-800">
          If you run Storable Edge, Storable Easy or Sitelink by Storable, start with your own software&apos;s
          published gate list, then check the gate maker&apos;s page. The three Storable lists are not the same, and
          the gate makers&apos; pages do not always name the same pairings. We read all of them on September 19,
          2026. The two tables below report what they said that day, and the page cites where each comes from.
        </p>
        <p className="mt-4 text-text-800">
          Three cautions before you use them. Vendors revise these lists without notice, and most of the lists carry
          no date. A system that is not in a published list may still work with your software: the list simply does
          not name it. And a listing on one side is a reason to ask the other side, not a promise. Before you change
          hardware or software, ask both vendors, your software maker and your gate maker, about your exact setup.
        </p>
        <p className="mt-4 text-text-800">
          This page covers only Storable&apos;s three facility management software (FMS) products. Those are the
          lists we could check against the vendors&apos; own pages on the check date. Other software makers publish
          their own integration lists. If you run something else, read that maker&apos;s list and your gate
          maker&apos;s page directly.
        </p>
        <p className="mt-4 text-text-800">
          We have an interest in this topic, so here it is plainly. We can bridge Storable Edge and Storable Easy to
          OpenTech Alliance&apos;s INSOMNIAC® CIA and to DigiGate. Tell us your setup. You can read how our{" "}
          <Link href="/solutions/access-control-hosting" className={link}>
            access control hosting
          </Link>{" "}
          works. Nothing about us appears in the tables. They report only what the vendors publish.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">How to read the tables</h2>
        <p className="mt-4 text-text-800">
          &quot;Listed&quot; means the product&apos;s own published list named the gate system on September 19, 2026.
          &quot;Not in the list&quot; means that list did not name it. It is not a finding that the two cannot work
          together. Where a list uses its own name for a system, or adds a condition, the cell says so in smaller
          type.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What each Storable product lists</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="mb-2 text-left text-sm text-text-700">
              Table 1. Gate systems named in each Storable product&apos;s own published integration list, as checked
              on September 19, 2026.
            </caption>
            <thead>
              <tr className="border-b border-background-300">
                <th scope="col" className={th}>
                  Gate system
                </th>
                <th scope="col" className={th}>
                  Storable Edge
                </th>
                <th scope="col" className={th}>
                  Storable Easy
                </th>
                <th scope="col" className={th}>
                  Sitelink
                </th>
              </tr>
            </thead>
            <tbody>
              {SOFTWARE_ROWS.map((r) => (
                <tr key={r.key} className="border-b border-background-200 align-top">
                  <th scope="row" className="py-3 pr-4 font-normal text-text-800">
                    {r.gate}
                  </th>
                  <Cell cell={r.edge} />
                  <Cell cell={r.easy} />
                  <Cell cell={r.sitelink} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 text-xl font-semibold">Where each column comes from</h3>
        <p className="mt-4 text-text-800">
          Storable Edge: the gate integration article in Storable Edge&apos;s help center, which carries no date. It
          names WinSen except the RSCM (Remote Site Control Module) and Platinum versions. It also names Storable
          Access Control, which it calls a native Edge solution.{" "}
          <SourceLink source={SOURCES.storableEdgeGateIntegration} />
        </p>
        <p className="mt-4 text-text-800">
          Storable Easy: the third-party gate integrations article in Storable Easy&apos;s knowledge base, which
          names eleven gate software products and carries no date.{" "}
          <SourceLink source={SOURCES.storableEasyThirdPartyGates} /> One entry is named Insomniac. The Insomniac
          article in the same gate integrations section of Storable Easy&apos;s help is about Insomniac kiosks, which
          it says talk to Storable Easy through an API. It does not mention CIA access control.{" "}
          <SourceLink source={SOURCES.storableEasyKiosks} /> So Table 1 does not count that entry as a CIA gate
          listing. If you run Storable Easy and want CIA at the gate, ask Storable what the entry covers.
        </p>
        <p className="mt-4 text-text-800">
          Sitelink: the gates and access page of the Sitelink marketplace, which names seven partners. The same page
          says Sitelink integrates with many gate and access systems and tells operators to phone for an up-to-date
          list. <SourceLink source={SOURCES.sitelinkGatesMarketplace} /> So &quot;Not in the list&quot; in
          the Sitelink column tells you less than it does in the other two.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Storable&apos;s own access control product</h3>
        <p className="mt-4 text-text-800">
          All three lists name Storable Access Control, Storable&apos;s own product. Its product page answers a
          question about existing gate hardware by naming nine third-party gate providers, introduced with the words
          &quot;Some of these providers include&quot;: DigiGate, DoorKing (1838 Multi-Door Access Controller),
          OpenTech CIA, PTI/StorLogix, PTI/Falcon, QuikStor, Revenue Control Systems, StorGuard and SpiderDoor. The
          page does not present that list as complete, and it does not say which Storable software each provider
          works with. <SourceLink source={SOURCES.storableAccessControl} />
        </p>

        <h3 className="mt-8 text-xl font-semibold">A listing says nothing about hardware status</h3>
        <p className="mt-4 text-text-800">
          The Storable lists are about the software side. PTI&apos;s facts page lists DigiGate and FalconXT among
          legacy products that PTI no longer sells or supports, and it gives no dates for either.{" "}
          <SourceLink source={SOURCES.ptiFacts} /> Storable Edge&apos;s and Storable Easy&apos;s lists both name
          DigiGate, and both have a PTI Falcon entry (Storable Easy&apos;s says Falcon 2000). If DigiGate or FalconXT
          is on your site, read our guides to{" "}
          <Link href="/resources/digigate-replacement" className={link}>
            replacing DigiGate
          </Link>{" "}
          and{" "}
          <Link href="/resources/falconxt-end-of-life" className={link}>
            FalconXT end of life
          </Link>
          .
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What the gate makers publish</h2>
        <p className="mt-4 text-text-800">
          The other half of the check is the gate maker&apos;s own page. Table 2 shows which Storable products each
          one names, and what it says about how the connection runs. The last row is Storable&apos;s own page about
          one gate maker, SpiderDoor. Several of these pages use earlier or other names for Storable&apos;s products.
          The table gives today&apos;s name and says when a page uses a different one.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="mb-2 text-left text-sm text-text-700">
              Table 2. Storable products named on gate makers&apos; own pages, and on Storable&apos;s SpiderDoor
              page, as checked on September 19, 2026.
            </caption>
            <thead>
              <tr className="border-b border-background-300">
                <th scope="col" className={th}>
                  Page
                </th>
                <th scope="col" className={th}>
                  Storable products it names
                </th>
                <th scope="col" className={th}>
                  How it connects, if the page says
                </th>
                <th scope="col" className={th}>
                  Source
                </th>
              </tr>
            </thead>
            <tbody>
              {MAKER_ROWS.map((r) => (
                <tr key={r.key} className="border-b border-background-200 align-top">
                  <th scope="row" className="py-3 pr-4 font-normal text-text-800">
                    {r.page}
                  </th>
                  <td className={td}>{r.names}</td>
                  <td className={td}>{r.how}</td>
                  <td className={td}>
                    <SourceLink source={r.source} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-text-800">
          Read the two tables together. Where both sides name a pairing, you have two independent documents: Storable
          Easy lists Janus International&apos;s Nokē system, and Janus&apos;s page shows Storable Easy under another
          name. Where only one side names it, take that as a question for the other vendor. Janus&apos;s page shows
          Storable Edge, but Storable Edge&apos;s list does not name Nokē. DoorKing names Sitelink, but the Sitelink
          marketplace does not name DoorKing. Neither is a disagreement. One document is simply silent.
        </p>
        <p className="mt-4 text-text-800">
          OpenTech Alliance&apos;s integration partners page shows logos for Sitelink, Storable Edge and Storable
          Easy, the last under another name. It does not say which OpenTech product each logo refers to, so it is
          not in Table 2 as a CIA listing. <SourceLink source={SOURCES.opentechPartners} />
        </p>

        <h2 className="mt-10 text-2xl font-semibold">How the connection works, where the documents say</h2>
        <p className="mt-4 text-text-800">
          A listing tells you that a vendor names a pairing. It does not tell you what has to run, or where. These
          are the documents that say. Where a document is silent, so is this page.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Storable Edge</h3>
        <p className="mt-4 text-text-800">
          Storable Edge&apos;s gate article says its gate software must be installed on the same computer as the
          DigiGate, DoorKing, PTI, QuikStor, Revenue Control Systems, StorGuard, SpiderDoor or WinSen gate software.
          OpenTech CIA is on the same list but is not named in that sentence, and the article does not say how CIA
          connects. The article tells you to keep your gate software and Storable Edge&apos;s gate program running
          at all times, and says Storable Edge sends gate code changes to the gate software every 5 minutes. Its
          requirements include a computer running Windows Vista, 7, 8 or 10 with .NET Framework 3.5.{" "}
          <SourceLink source={SOURCES.storableEdgeGateIntegration} /> If that computer is getting old, our guide to{" "}
          <Link href="/resources/self-storage-gate-server" className={link}>
            whether you still need a gate PC
          </Link>{" "}
          covers what to weigh.
        </p>
        <p className="mt-4 text-text-800">
          PTI describes a second route for Storable Edge. In a release datelined March 16, 2026, PTI says it and
          Storable announced a webhook-based integration between StorLogix Cloud and Storable Edge, and that the
          integration eliminates the need for on-site syncing tools. <SourceLink source={SOURCES.ptiStorableRelease} />{" "}
          PTI&apos;s integrations table has two rows for Storable Edge: one marked BridgeApp, and a webhooks row
          marked API. <SourceLink source={SOURCES.ptiIntegrationsTable} /> Storable Edge&apos;s undated help article
          does not mention the webhook route. If you run PTI with Storable Edge, ask both vendors which route your
          site would use.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Storable Easy</h3>
        <p className="mt-4 text-text-800">
          Storable Easy&apos;s gate list says setup starts once one of the listed gate programs is downloaded on your
          computer. Storable&apos;s support team then connects it to Storable Easy.{" "}
          <SourceLink source={SOURCES.storableEasyThirdPartyGates} /> Its PTI StorLogix guide starts with installing
          the gate sync program. It says two later steps, setting up the StorLogix interface and selecting PTI as the
          gate system, can be skipped with the cloud-based version of PTI. It does not mark the first step as
          optional. <SourceLink source={SOURCES.storableEasyStorLogix} />
        </p>
        <p className="mt-4 text-text-800">
          Storable Easy&apos;s Nokē article describes a different route. It says codes saved in the gate key field are
          sent to Nokē through webhooks. <SourceLink source={SOURCES.storableEasyNoke} /> If codes stop matching
          between your software and the gate, our{" "}
          <Link href="/resources/gate-not-syncing" className={link}>
            gate sync diagnostic guide
          </Link>{" "}
          walks through the vendors&apos; own troubleshooting documents.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Sitelink</h3>
        <p className="mt-4 text-text-800">
          A few documents describe how specific Sitelink pairings connect. Storable&apos;s SpiderDoor integration
          page says Sitelink and SpiderDoor communicate through the cloud, and that you will no longer need a
          computer at the site. <SourceLink source={SOURCES.storableSpiderDoor} /> OpenTech Alliance announced in
          September 2018 that Sitelink was the first vendor to integrate with the INSOMNIAC CIA API.{" "}
          <SourceLink source={SOURCES.opentechSitelink2018} /> PTI&apos;s integrations table marks Sitelink under the
          BridgeApp, not the API. <SourceLink source={SOURCES.ptiIntegrationsTable} /> None of these documents covers
          Sitelink&apos;s other gate pairings.
        </p>

        <h3 className="mt-8 text-xl font-semibold">PTI&apos;s two routes</h3>
        <p className="mt-4 text-text-800">
          PTI&apos;s StorLogix Cloud manual says there are two ways to connect facility software to StorLogix Cloud:
          a cloud-to-cloud API integration or the BridgeApp. It says the BridgeApp should be installed on the PC or
          server that also houses your facility software client. PTI adds, &quot;This does not have to be at the actual site
          itself,&quot; though it says that usually is the case. If your software already has a cloud integration
          with StorLogix Cloud, the manual says the BridgeApp is unnecessary.{" "}
          <SourceLink source={SOURCES.ptiCloudManual} />
        </p>
        <p className="mt-4 text-text-800">
          PTI&apos;s table puts Sitelink and Storable Easy under the BridgeApp column and not the API column.{" "}
          <SourceLink source={SOURCES.ptiIntegrationsTable} /> The table describes software pairings, not any one
          site. Ask PTI which route your site would use, and where the software for it would run.
        </p>

        <h3 className="mt-8 text-xl font-semibold">DoorKing</h3>
        <p className="mt-4 text-text-800">
          DoorKing&apos;s self-storage page lists all three Storable products, two of them under other names, for its
          Remote Account Manager, which it describes as Windows software that runs on a host personal computer. Its
          list for DoorKing Cloud Software names one self-storage application only, and it is none of the three
          Storable products.{" "}
          <SourceLink source={SOURCES.doorkingSelfStorage} />
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Questions to ask both vendors</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-text-800">
          <li>
            Is my exact gate system, model and version on your current list? Storable Edge&apos;s list shows why the
            version matters: it names WinSen, except two versions of it.
          </li>
          <li>
            How does the connection run: software on a computer, or cloud to cloud? If it is a computer, which one,
            and does it have to stay on?
          </li>
          <li>How often do changes made in the software reach the gate?</li>
          <li>Does the gate maker still sell and support the hardware on my site?</li>
          <li>Can you give me the answer in writing, with the date?</li>
        </ol>

        <h2 className="mt-10 text-2xl font-semibold">What to do next</h2>
        <p className="mt-4 text-text-800">
          If your software and your gate maker both name each other and nothing on your site is on a legacy list,
          you may not need to change anything yet. Confirm the details with both vendors and note the date you
          asked.
        </p>
        <p className="mt-4 text-text-800">
          If something does need to change, you have more than one path. Storable offers its own access control
          product, and all three Storable lists name it. Storable Edge operators on PTI can ask both vendors about
          the webhook route PTI describes. Gate makers publish their own software lists, as Table 2 shows, so you can
          check a new gate against your software before you buy it.
        </p>
        <p className="mt-4 text-text-800">
          If the part you want to change is the computer your gate depends on, this is how our service handles it.
          The office PC&apos;s job moves to the cloud. A small bridge stays at the site to talk to your controllers.
          Tell us what is on site. We will tell you plainly whether we can work with it as it is, and what replacing
          it would involve if not. Pricing depends on how many facilities you run and what hardware is on site. See
          how our{" "}
          <Link href="/solutions/access-control-hosting" className={link}>
            access control hosting
          </Link>{" "}
          works. If you are reviewing your facility website at the same time, see our{" "}
          <Link href="/solutions/web-hosting" className={link}>
            web hosting
          </Link>{" "}
          too.
        </p>

        <SourceList
          sources={[
            SOURCES.storableEdgeGateIntegration,
            SOURCES.storableEasyThirdPartyGates,
            SOURCES.storableEasyKiosks,
            SOURCES.sitelinkGatesMarketplace,
            SOURCES.storableAccessControl,
            SOURCES.ptiFacts,
            SOURCES.ptiIntegrationsTable,
            SOURCES.opentechSitelink2018,
            SOURCES.doorkingSelfStorage,
            SOURCES.janusNokePartners,
            SOURCES.storguardPartners,
            SOURCES.sentinelHardware,
            SOURCES.spiderdoorAccessControl,
            SOURCES.storableSpiderDoor,
            SOURCES.opentechPartners,
            SOURCES.ptiStorableRelease,
            SOURCES.storableEasyStorLogix,
            SOURCES.storableEasyNoke,
            SOURCES.ptiCloudManual,
          ]}
        />
        <p className="mt-8 text-sm text-text-700">
          We are not affiliated with Storable, PTI Security Systems, OpenTech Alliance, DoorKing, Janus International,
          StorGuard, Sentinel Systems, SpiderDoor, QuikStor, Revenue Control Systems, Eight IO, BearBox or Microsoft.
          Product names are the property of their owners.
        </p>
      </article>

      <CtaBand
        heading="Check your software and gate pairing"
        text="Tell us which facility software and gate system each of your sites runs."
        primary={{ href: "/contact", label: "Contact us" }}
        secondary={{ href: "/demo", label: "Request a demo" }}
      />
    </>
  );
}
```

- [ ] **Step 5: Link the article from the pages that point to it**

Link the matrix from the access control page's integrations section (spec §6.1(6)):

In `self-storage-hosting/app/(marketing)/solutions/access-control-hosting/page.tsx`, replace:

```tsx
          </Link>
          .
        </p>
      </section>

      {/* 6. Security: TLS only until spec 14 B is answered. */}
```

with:

```tsx
          </Link>
          .
        </p>
        <p className="mt-4 text-text-800">
          Which gate systems each Storable product lists as an integration, compared with the gate
          makers&apos; own lists:{" "}
          <Link
            href="/resources/self-storage-gate-compatibility"
            className={`font-semibold underline ${FOCUS_RING_LIGHT}`}
          >
            our gate compatibility matrix
          </Link>
          .
        </p>
      </section>

      {/* 6. Security: TLS only until spec 14 B is answered. */}
```

And from the web hosting page, together with `/resources` (spec §4.4):

In `self-storage-hosting/app/(marketing)/solutions/web-hosting/page.tsx`, replace:

```tsx
        </p>
      </section>
```

with:

```tsx
        </p>
        <p className="mt-4 text-text-800">
          Checking which gate systems your software lists as integrations? See{" "}
          <Link
            href="/resources/self-storage-gate-compatibility"
            className={`font-semibold underline ${FOCUS_RING_LIGHT}`}
          >
            our gate compatibility matrix
          </Link>
          , or browse all our{" "}
          <Link href="/resources" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            guides for operators
          </Link>
          .
        </p>
      </section>
```

- [ ] **Step 6: Run the tests to verify they pass**

```bash
npx vitest run tests/articles.test.ts tests/sitemap-coverage.test.ts
```

Expected: PASS.

- [ ] **Step 7: Run the gates**

In Git Bash, from `self-storage-hosting/`:

```bash
npm run lint && npm test && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts
```

Expected: lint is clean, every unit test passes, the build succeeds and every rendered check passes.

- [ ] **Step 8: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add self-storage-hosting/tests/articles.test.ts self-storage-hosting/tests/sitemap-coverage.test.ts self-storage-hosting/lib/articles.ts self-storage-hosting/lib/sources.ts "self-storage-hosting/app/(marketing)/resources/self-storage-gate-compatibility/page.tsx" "self-storage-hosting/app/(marketing)/solutions/access-control-hosting/page.tsx" "self-storage-hosting/app/(marketing)/solutions/web-hosting/page.tsx"
git commit -m "feat(resources): gate compatibility matrix; both solution pages link it"
cd self-storage-hosting
```

- [ ] **Step 9: Probe the guards against this page**

Two spot checks that the per-article guards see this page, not only the first one.

| Mutation | Run | Must fail naming |
|---|---|---|
| In the page's `<SourceList>`, delete the line `SOURCES.ptiCloudManual,` | `npx vitest run tests/articles.test.ts` | `cites these but does not list them` and `ptiCloudManual` |
| Retarget the page's first solution link (the one reading "access control hosting") from `/solutions/access-control-hosting` to `/support` | `npm run build`, then `RENDERED=1 npx vitest run tests/rendered.test.ts` | `/resources/self-storage-gate-compatibility: first solution link is not in the first third` |

Restore each file with `git checkout -- <file>` after its row. This is safe because the task is already committed. If any row ran `npm run build`, run `npm run build` once more after the last row so `.next` matches the committed source. Finish with `git status --short`. It must print nothing except the untracked `.claude/` and `.serena/` folders, if this checkout has them.

---

### Task 7: Article 5: do you still need a gate server?

Article 5 of spec §11. Primary query `self storage gate server`, informational intent.

The guide covers:
- which gate setups still depend on a Windows PC, vendor by vendor, from each vendor's own documents;
- what Windows 10's end of support means for that computer.

The only dates it states are Microsoft's own:
- Windows 10 end of support on October 14, 2025;
- Microsoft's **consumer** Extended Security Updates program through October 12, 2027.

The 2027 date belongs to the consumer program. Never apply it to commercial ESU.

The access control page's problem section links it.

**Files:**
- Modify: `self-storage-hosting/tests/articles.test.ts`
- Modify: `self-storage-hosting/tests/sitemap-coverage.test.ts`
- Modify: `self-storage-hosting/lib/articles.ts`
- Modify: `self-storage-hosting/lib/sources.ts`
- Create: `self-storage-hosting/app/(marketing)/resources/self-storage-gate-server/page.tsx`
- Modify: `self-storage-hosting/app/(marketing)/solutions/access-control-hosting/page.tsx`

**Interfaces:**
- Consumes:
  - From Task 2: `article(slug)`, `articlePath(slug)`, the registry-driven `ROUTES` rows, and the article checks in `tests/articles.test.ts` and `tests/rendered.test.ts`.
  - From Task 1: `pageMeta({ …, ogType: "article", publishedTime, modifiedTime })` and `articleSchema({ headline, description, path, datePublished, dateModified? })`.
  - From Plan 2: `SOURCES` and `Source` (`lib/sources.ts`); `<SourceLink source={SOURCES.x} />`; `Breadcrumbs`; `CtaBand`; `JsonLd`; `FOCUS_RING_LIGHT`.
  - From Task 3: `ArticleDates` and `SourceList`, and the interim `allowedLink` in `tests/helpers/links.ts`.
- Produces:
  - The `self-storage-gate-server` entry in `ARTICLES`, which also builds `/resources/self-storage-gate-server`.
  - The `SOURCES` keys listed in the sources step.

- [ ] **Step 1: Write the failing test**

In `self-storage-hosting/tests/articles.test.ts`, all five articles now exist. Name the count test for what it checks from now on:

```ts
  it("has the articles built so far, with unique kebab-case slugs", () => {
    const slugs = ARTICLES.map((a) => a.slug);
    expect(slugs.length).toBe(4);
```

with:

```ts
  it("has five articles with unique kebab-case slugs", () => {
    const slugs = ARTICLES.map((a) => a.slug);
    expect(slugs.length).toBe(5);
```

In `self-storage-hosting/tests/sitemap-coverage.test.ts`, add the route to the expected `indexableRoutes()` array, after `"/resources/self-storage-gate-compatibility"`:

```ts
      "/resources/self-storage-gate-server",
```

```bash
npx vitest run tests/articles.test.ts tests/sitemap-coverage.test.ts
```

Expected: FAIL, the count test finds 4 articles where it expects 5, and `indexableRoutes()` has no `/resources/self-storage-gate-server`.

- [ ] **Step 2: Register the article**

The entry is what builds the route: `ROUTES` and the sitemap read it. `datePublished` is the day the page first goes live. If you run this task after 2026-09-19, set `datePublished` to the day you run it, because the articles test fails on a date in the future. Ruling 5 moves it to the merge day if the branch merges later.

In `self-storage-hosting/lib/articles.ts`, add this entry at the end of `ARTICLES`, after the `self-storage-gate-compatibility` entry:

```ts
  {
    slug: "self-storage-gate-server",
    headline: "Do You Still Need a Windows PC in the Office to Run Your Gate?",
    title: "Do You Still Need a Gate Server?",
    description:
      "Some gate setups still depend on a Windows PC at the facility. Which ones do, which do not, and what Windows 10 end of support means for yours.",
    datePublished: "2026-09-19",
  },
```

- [ ] **Step 3: Add the 8 sources the article is first to cite**

Each entry below was checked against the live page on 2026-09-19. Keep that `verifiedOn` date: it records when someone checked the page, not when you typed the entry. Titles are in our own words wherever the document's own title uses a spelling the content policy forbids. Keys: `ptiDesktopInstallGuide`, `sitelinkCiaNews`, `sitelinkRecommendedHardware`, `opentechK500Manual`, `doorkingCloudAccountManager`, `doorkingWindowsAccountManager`, `janusNoke1`, `microsoftWindowsEos`.

In `self-storage-hosting/lib/sources.ts`, after the `ptiDesktopRequirements` entry, add:

```ts
  ptiDesktopInstallGuide: {
    url: "https://www.ptisecurity.com/documents/access-control/storlogix-cloud/storlogix-cloud-archive/StorLogix_Desktop_Installation_Guide.pdf",
    title: "StorLogix Desktop installation guide, archived (PDF)",
    publisher: "PTI Security Systems",
    verifiedOn: "2026-09-19",
  },
```

In `self-storage-hosting/lib/sources.ts`, after the `sitelinkGatesMarketplace` entry, add:

```ts
  sitelinkCiaNews: {
    url: "https://www.sitelink.com/about/news/sitelink-integrates-with-opentechs-insomniac-cia-cloud-access-control",
    title: "Sitelink integrates with OpenTech's cloud access control (2018 news)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
  sitelinkRecommendedHardware: {
    url: "https://support.sitelink.com/sitelink/getting-started/recommended-hardware~7605736252733002576",
    title: "Recommended hardware (Sitelink help)",
    publisher: "Storable",
    verifiedOn: "2026-09-19",
  },
```

In `self-storage-hosting/lib/sources.ts`, after the `opentechCia` entry, add:

```ts
  opentechK500Manual: {
    url: "https://opentechalliance.com/wp-content/uploads/2016/10/INSOMNIAC-CIA-K-500-Keypad-Intallation-Manual.pdf",
    title: "CIA K-500 keypad installation manual (PDF)",
    publisher: "OpenTech Alliance",
    verifiedOn: "2026-09-19",
  },
```

In `self-storage-hosting/lib/sources.ts`, after the `doorkingSelfStorage` entry, add:

```ts
  doorkingCloudAccountManager: {
    url: "https://www.doorking.com/easyconnect/programming-options/cloud-account-manager-1830-series/",
    title: "Cloud Account Manager, 1830 series",
    publisher: "DoorKing",
    verifiedOn: "2026-09-19",
  },
  doorkingWindowsAccountManager: {
    url: "https://www.doorking.com/easyconnect/programming-options/1830-series-windows-account-manager/",
    title: "Windows Account Manager, 1830 series",
    publisher: "DoorKing",
    verifiedOn: "2026-09-19",
  },
```

In `self-storage-hosting/lib/sources.ts`, after the `doorkingRamManual` entry, add one blank line and then:

```ts
  janusNoke1: {
    url: "https://www.janusintl.com/noke1",
    title: "Nokē Smart Entry System",
    publisher: "Janus International",
    verifiedOn: "2026-09-19",
  },
```

In `self-storage-hosting/lib/sources.ts`, after the `janusNokeTraining` entry, add one blank line and then:

```ts
  microsoftWindowsEos: {
    url: "https://www.microsoft.com/en-us/windows/end-of-support",
    title: "End of support for Windows 10, Windows 8.1 and Windows 7",
    publisher: "Microsoft",
    verifiedOn: "2026-09-19",
  },
```

- [ ] **Step 4: Write the page**

Create `self-storage-hosting/app/(marketing)/resources/self-storage-gate-server/page.tsx`. Copy it exactly. Every vendor fact in it is cited to the `SOURCES` entry that states it, and its wording has been checked against the content policy, the trademark list and the rules in Global Constraints.

Create `self-storage-hosting/app/(marketing)/resources/self-storage-gate-server/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { articleSchema } from "@/lib/schema";
import { article, articlePath } from "@/lib/articles";
import { SOURCES } from "@/lib/sources";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ArticleDates from "@/components/ArticleDates";
import SourceLink from "@/components/SourceLink";
import SourceList from "@/components/SourceList";
import CtaBand from "@/components/CtaBand";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

const A = article("self-storage-gate-server");

export const metadata: Metadata = pageMeta({
  title: "Do You Still Need a Gate Server?",
  description:
    "Some gate setups still depend on a Windows PC at the facility. Which ones do, which do not, and what Windows 10 end of support means for yours.",
  path: "/resources/self-storage-gate-server",
  ogType: "article",
  publishedTime: A.datePublished,
  modifiedTime: A.dateModified,
});

const link = `font-semibold underline ${FOCUS_RING_LIGHT}`;

type SourceEntry = (typeof SOURCES)[keyof typeof SOURCES];

type ComputerRow = {
  key: string;
  system: string;
  says: string;
  sources: readonly SourceEntry[];
};

// Each row states only what that vendor's own document says, from the
// verified a5-* research claims. The "cia" row is the page's first mention of
// OpenTech Alliance's product, so it carries the ® and later mentions do not.
const COMPUTER_ROWS: readonly ComputerRow[] = [
  {
    key: "easy-sync",
    system: "Storable Easy gate sync program",
    says: "The computer must stay on 24/7 for the gate to sync. If the \"Checked for change\" message in Storable Easy does not appear every 5 minutes, the sync has stopped. The troubleshooting steps restart the program's service in the Windows Services app.",
    sources: [SOURCES.storableEasyGateSync],
  },
  {
    key: "easy-digigate",
    system: "Storable Easy with DigiGate",
    says: "The gate sync program's Post Download Action is set to digisend.exe, and DigiGate should stay open for communication to work properly.",
    sources: [SOURCES.storableEasyDigiGate],
  },
  {
    key: "edge",
    system: "Storable Edge gate program",
    says: "Must be installed on the same computer as the DigiGate, DoorKing, PTI, QuikStor, Revenue Control Systems, StorGuard, SpiderDoor or WinSen gate software. Storable Edge sends gate code changes to the gate software every 5 minutes; keep both programs running at all times.",
    sources: [SOURCES.storableEdgeGateIntegration],
  },
  {
    key: "digigate",
    system: "DigiGate (DigiGate-700 manual)",
    says: "The office PC runs the DigiGate software and programs the system controller, which can then run the system with the PC off.",
    sources: [SOURCES.digiGateManual],
  },
  {
    key: "storlogix-desktop",
    system: "PTI StorLogix Desktop",
    says: "The requirements only cover a computer dedicated to PTI software: Windows 10 or higher, with a working FalconXT connected by USB or Ethernet.",
    sources: [SOURCES.ptiDesktopRequirements],
  },
  {
    key: "storlogix-cloud",
    system: "PTI StorLogix Cloud",
    says: "StorLogix Desktop no longer has to be installed first; a site can be set up directly in the cloud. If your FMS is not yet integrated with PTI's API, the BridgeApp is required, on the PC or server that also holds your FMS client. If your FMS has a cloud integration with StorLogix Cloud, the BridgeApp is unnecessary.",
    sources: [SOURCES.ptiCloudManual],
  },
  {
    key: "cloudcontroller",
    system: "PTI CloudController",
    says: "PTI describes it as cloud-native, linking the site's access control hardware straight to StorLogix Cloud with no separate adaptor. PTI lists the StorLogix Cloud Adaptor as a legacy product.",
    sources: [SOURCES.ptiFacts],
  },
  {
    key: "cia",
    system: "OpenTech Alliance INSOMNIAC® CIA",
    says: "The software is stored in the cloud. The 2018 K-500 keypad manual describes a controller that communicates with a central database over the internet.",
    sources: [SOURCES.opentechCia, SOURCES.opentechK500Manual],
  },
  {
    key: "sitelink-cia",
    system: "Sitelink by Storable with INSOMNIAC CIA (2018)",
    says: "Sitelink said the pairing ends reliance on gate software running on a local PC, and that cloud access systems can operate without PCs at the store through the Sitelink API.",
    sources: [SOURCES.sitelinkCiaNews],
  },
  {
    key: "doorking-ram",
    system: "DoorKing Remote Account Manager",
    says: "Windows-based software that runs on a host personal computer.",
    sources: [SOURCES.doorkingSelfStorage],
  },
  {
    key: "doorking-wam",
    system: "DoorKing Windows Account Manager",
    says: "Designed to be installed on one PC.",
    sources: [SOURCES.doorkingWindowsAccountManager],
  },
  {
    key: "doorking-cloud",
    system: "DoorKing Cloud Account Manager",
    says: "A web browser-based tool for programming 1830 Series entry systems from any internet-connected device. DoorKing's cloud software requires the 1830-186 TCP/IP adapter, and DoorKing lists Cubby as the only self-storage software compatible with it.",
    sources: [SOURCES.doorkingCloudAccountManager, SOURCES.doorkingSelfStorage],
  },
  {
    key: "janus-smart-entry",
    system: "Janus International Nokē Smart Entry",
    says: "Wireless and cloud-based: tenants enter with a smartphone, and owners use a web portal. Each mesh hub location needs 110V power and internet access over Cat 6 wire.",
    sources: [SOURCES.janusNoke1],
  },
  {
    key: "sitelink-hardware",
    system: "Sitelink Web Edition",
    says: "A computer is required to use Sitelink Web Edition: Windows 11 or newer, with Windows 7, 8, 8.1 and 10 no longer supported. This is the computer you run Sitelink on, not a gate computer.",
    sources: [SOURCES.sitelinkRecommendedHardware],
  },
];

export default function ArticlePage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "Do You Still Need a Gate Server?", path: "/resources/self-storage-gate-server" },
        ]}
      />
      <JsonLd data={articleSchema({ ...A, path: articlePath(A.slug) })} />

      <article className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{A.headline}</h1>
        <ArticleDates article={A} />
        <p className="mt-6 text-lg text-text-800">
          It depends on your gate system and your facility management software (FMS). Some setups, as
          their own vendors document them, still depend on a Windows computer that stays on around the
          clock. <SourceLink source={SOURCES.storableEasyGateSync} /> For some cloud systems, the
          documents name no such computer for day-to-day management.{" "}
          <SourceLink source={SOURCES.opentechCia} />{" "}
          <SourceLink source={SOURCES.doorkingCloudAccountManager} />{" "}
          <SourceLink source={SOURCES.janusNoke1} />
        </p>
        <p className="mt-4 text-text-800">
          Here, a gate server means the computer that runs your gate software, or the one that runs the
          sync between your FMS and the gate. Despite the name, the documents below mostly call it a PC
          or simply your computer.
        </p>
        <p className="mt-4 text-text-800">
          Windows matters too: Microsoft ended support for Windows 10 on October 14, 2025.{" "}
          <SourceLink source={SOURCES.microsoftWindowsEos} /> The Windows section below covers what
          that means for a gate computer.
        </p>
        <p className="mt-4 text-text-800">
          One option, and the one we sell, is hosting: the office PC&apos;s job moves to the cloud, and
          a small bridge stays at the site to talk to your controllers. You can read how our{" "}
          <Link href="/solutions/access-control-hosting" className={link}>
            cloud access control hosting
          </Link>{" "}
          works. This guide covers the other options too.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What a gate server actually does</h2>
        <p className="mt-4 text-text-800">A gate computer can do two separate jobs.</p>

        <h3 className="mt-8 text-xl font-semibold">Job one: running the gate maker&apos;s software</h3>
        <p className="mt-4 text-text-800">
          The DigiGate-700 installation manual, which PTI Security Systems keeps in its document
          archive, is a clear example. It says the office PC runs the DigiGate software and is used to
          program the system controller. The PC connects to the controller by an RS-232 cable up to 50
          feet long, and receives the controller&apos;s activity log when it runs the DigiGate
          program. <SourceLink source={SOURCES.digiGateManual} /> The manual asks for the PC&apos;s
          hibernation and standby features to be turned off, and it is plain about the gate itself:
          &quot;Once programmed, the system controller can run the system without the PC being
          on.&quot; <SourceLink source={SOURCES.digiGateManual} />
        </p>

        <h3 className="mt-8 text-xl font-semibold">Job two: syncing your FMS with the gate</h3>
        <p className="mt-4 text-text-800">
          Storable Easy describes the chain. A change you make in Storable Easy goes to the gate sync
          program on your computer, which connects Storable Easy to your gate program, and the gate
          software sends it on to the gate. <SourceLink source={SOURCES.storableEasyCommonProblems} />{" "}
          Storable&apos;s troubleshooting page is direct: &quot;Your computer must stay turned on 24/7
          for the gate to sync correctly.&quot; <SourceLink source={SOURCES.storableEasyGateSync} /> A
          screensaver is fine, and so is logging off, but the computer should not sleep or hibernate.{" "}
          <SourceLink source={SOURCES.storableEasyGateSync} />{" "}
          <SourceLink source={SOURCES.storableEasyCommonProblems} />
        </p>
        <p className="mt-4 text-text-800">
          So the two jobs can differ when the computer is off: the DigiGate manual describes the gate
          itself, while Storable describes changes reaching it. A gate that still opens does not prove
          the computer is optional. If codes have stopped matching, our guide to{" "}
          <Link href="/resources/gate-not-syncing" className={link}>
            a gate that is not syncing
          </Link>{" "}
          walks through the checks.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">
          What each vendor&apos;s documents say about a computer
        </h2>
        <p className="mt-4 text-text-800">
          Each row reports what the vendor&apos;s own document says, including where it describes
          something other than a computer. A product missing from a list is not proof that it is
          incompatible; that document simply does not list it.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="mb-2 text-left text-sm text-text-700">
              What each vendor&apos;s own document says about a computer
            </caption>
            <thead>
              <tr className="border-b border-background-300">
                <th scope="col" className="py-3 pr-4 font-semibold">
                  System or integration
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  What its vendor&apos;s document says
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Source
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPUTER_ROWS.map((row) => (
                <tr key={row.key} className="border-b border-background-200 align-top">
                  <th scope="row" className="py-3 pr-4 font-normal text-text-800">
                    {row.system}
                  </th>
                  <td className="py-3 pr-4 text-text-800">{row.says}</td>
                  <td className="py-3 pr-4 text-text-800">
                    {row.sources.map((s, i) => (
                      <span key={s.url}>
                        {i > 0 && "; "}
                        <SourceLink source={s} />
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 text-xl font-semibold">Storable Easy and Storable Edge</h3>
        <p className="mt-4 text-text-800">
          Storable&apos;s help pages refer to your computer without saying where it has to be.
          Storable Edge&apos;s gate integration page lists INSOMNIAC CIA and Storable Access Control
          among its integrations, but its same-computer sentence does not name those two, and the page
          does not say whether they need the gate program. <SourceLink source={SOURCES.storableEdgeGateIntegration} /> Our{" "}
          <Link href="/resources/self-storage-gate-compatibility" className={link}>
            self-storage gate compatibility matrix
          </Link>{" "}
          compares which gate systems each Storable product lists.
        </p>

        <h3 className="mt-8 text-xl font-semibold">
          PTI: StorLogix Desktop, StorLogix Cloud and the BridgeApp
        </h3>
        <p className="mt-4 text-text-800">
          StorLogix Desktop&apos;s installation guide has you choose whether the computer is the
          StorLogix server or a workstation. <SourceLink source={SOURCES.ptiDesktopInstallGuide} />{" "}
          PTI&apos;s facts page lists StorLogix Desktop, FalconXT, the StorLogix Cloud Adaptor and
          DigiGate as legacy products it no longer sells or supports, and gives no dates for them.{" "}
          <SourceLink source={SOURCES.ptiFacts} />
        </p>
        <p className="mt-4 text-text-800">
          StorLogix Cloud does not remove the computer in every case. PTI&apos;s StorLogix Cloud manual
          says the BridgeApp is required if your FMS is not yet integrated with PTI&apos;s API, and describes it
          as a service that processes FMS flat files and keeps running in the background. PTI says to
          install it on the PC or server that also holds your FMS client, which does not have to be at
          the site, though it usually is. <SourceLink source={SOURCES.ptiCloudManual} /> PTI&apos;s
          facts page marks Sitelink, Storable Edge and Storable Easy as connecting through the BridgeApp
          rather than the API, with a separate Storable Edge webhooks row marked for the API.{" "}
          <SourceLink source={SOURCES.ptiFacts} /> Our guides to{" "}
          <Link href="/resources/falconxt-end-of-life" className={link}>
            FalconXT end of life
          </Link>{" "}
          and{" "}
          <Link href="/resources/digigate-replacement" className={link}>
            replacing DigiGate
          </Link>{" "}
          go further.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Cloud systems: INSOMNIAC CIA, DoorKing and Nokē</h3>
        <p className="mt-4 text-text-800">
          In the documents cited here, the CIA controller reaches its database over the internet,
          DoorKing&apos;s Cloud Account Manager runs in a web browser, and each Nokē mesh hub location
          needs internet access. None of these documents names a computer that has to stay on for
          day-to-day management.
        </p>
        <p className="mt-4 text-text-800">
          DoorKing documents both kinds. Its cloud page says previous programming methods required a
          dedicated PC. <SourceLink source={SOURCES.doorkingCloudAccountManager} /> Version 6.5 B of its
          Windows Account Manager can transfer the user database to the Cloud Account Manager.{" "}
          <SourceLink source={SOURCES.doorkingWindowsAccountManager} /> Check your FMS first:
          DoorKing&apos;s self-storage page lists Sitelink, Storable Edge and Storable Easy for its
          Remote Account Manager, but only Cubby for its cloud software.{" "}
          <SourceLink source={SOURCES.doorkingSelfStorage} />
        </p>
        <p className="mt-4 text-text-800">
          OpenTech Alliance&apos;s 2018 K-500 manual for CIA also says that if the internet connection
          is lost, the controller runs on its own from cached data, but no code or configuration
          changes are possible until the connection returns.{" "}
          <SourceLink source={SOURCES.opentechK500Manual} />
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Windows 10 end of support and your gate computer</h2>
        <p className="mt-4 text-text-800">
          Microsoft says Windows 10 reached end of support on October 14, 2025, and that it no longer
          provides software updates, security fixes or technical assistance for Windows 10 PCs.{" "}
          <SourceLink source={SOURCES.microsoftWindowsEos} /> Microsoft&apos;s consumer Extended
          Security Updates (ESU) program keeps enrolled Windows 10 devices on critical and important
          security updates through October 12, 2027, and Microsoft points commercial customers to a
          separate program, whose terms this guide does not cover.{" "}
          <SourceLink source={SOURCES.microsoftWindowsEos} />
        </p>
        <p className="mt-4 text-text-800">Now set that beside the Windows versions these documents name:</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            Storable Edge&apos;s gate integration requirements list Windows Vista, 7, 8 or 10, and do
            not mention Windows 11. <SourceLink source={SOURCES.storableEdgeGateIntegration} />
          </li>
          <li>
            DoorKing&apos;s Windows Account Manager page lists Windows 7, 8 and 10, and does not mention
            Windows 11. <SourceLink source={SOURCES.doorkingWindowsAccountManager} />
          </li>
          <li>
            Storable Easy recommends a computer running Windows 7 or later.{" "}
            <SourceLink source={SOURCES.storableEasyCommonProblems} />
          </li>
          <li>
            PTI&apos;s StorLogix Desktop requirements list Windows 10 or higher.{" "}
            <SourceLink source={SOURCES.ptiDesktopRequirements} />
          </li>
        </ul>
        <p className="mt-4 text-text-800">
          A page that does not mention Windows 11 is not saying the software fails on it, so ask the
          vendor before you upgrade or replace the computer.
        </p>
        <p className="mt-4 text-text-800">
          For a gate computer still on Windows 10, Microsoft&apos;s statement applies as it does to any
          Windows 10 PC: unless the computer is enrolled in ESU, Microsoft no longer provides it with
          security fixes. The choices for the computer itself are to enroll it in an ESU program that
          applies to it, to move the gate software to a newer Windows version your vendors confirm they
          support, or to move to a setup that does not need the computer.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">How to check your own site</h2>
        <p className="mt-4 text-text-800">Answer these for each facility before you change anything.</p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-text-800">
          <li>
            <strong>Is there a computer that has to stay on?</strong> Look for one that is never
            switched off, with sleep turned off and gate software open. In Storable Easy, open the Setup
            tab and select Gate: if you see a red X, or the &quot;Checked for change&quot; message does
            not appear every 5 minutes, Storable says the sync has stopped.{" "}
            <SourceLink source={SOURCES.storableEasyGateSync} />
          </li>
          <li>
            <strong>What runs on it?</strong> List each program: the gate maker&apos;s software, a sync
            program from your FMS, PTI&apos;s BridgeApp, and the FMS itself. Some run as services, as
            the table shows for Storable Easy, so check the Windows Services app as well as the screen.
          </li>
          <li>
            <strong>What does the vendor say happens if it is off?</strong> Find your system in the
            table above. Note whether the document means the gate itself or changes reaching it.
          </li>
          <li>
            <strong>Which Windows version does it run?</strong> Compare it with Microsoft&apos;s dates
            and your vendors&apos; listed versions above.
          </li>
          <li>
            <strong>What else depends on it?</strong> If your FMS runs on the same computer, retiring
            the gate software may not retire the computer. PTI&apos;s BridgeApp, described above, is
            one example.
          </li>
        </ol>

        <h2 className="mt-10 text-2xl font-semibold">Your options</h2>

        <h3 className="mt-8 text-xl font-semibold">Keep the current setup for now</h3>
        <p className="mt-4 text-text-800">
          If it works, you can keep it. That means keeping the computer on and awake as the documents
          above ask, checking that the sync is running, and settling the Windows 10 question with ESU or
          a newer Windows version your vendors confirm.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Move to your gate vendor&apos;s cloud product</h3>
        <p className="mt-4 text-text-800">
          For PTI sites, that is StorLogix Cloud, with CloudController as PTI&apos;s go-forward
          controller. If your FMS connects through the BridgeApp, a PC or server that holds your FMS
          client stays in the picture. <SourceLink source={SOURCES.ptiCloudManual} /> For DoorKing 1830
          Series entry systems, it is the Cloud Account Manager.{" "}
          <SourceLink source={SOURCES.doorkingCloudAccountManager} /> Check DoorKing&apos;s FMS list,
          described above, before you plan on it.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Choose a cloud access system that works with your FMS</h3>
        <p className="mt-4 text-text-800">
          OpenTech Alliance describes INSOMNIAC CIA, and Janus International describes Nokē Smart
          Entry, as cloud-based. <SourceLink source={SOURCES.opentechCia} />{" "}
          <SourceLink source={SOURCES.janusNoke1} /> Which FMS each one works with is a separate
          question; our{" "}
          <Link href="/resources/self-storage-gate-compatibility" className={link}>
            compatibility matrix
          </Link>{" "}
          sets out what each vendor publishes.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Use your FMS vendor&apos;s own access control</h3>
        <p className="mt-4 text-text-800">
          Storable Edge&apos;s gate integration page lists Storable Access Control among its
          integrations. <SourceLink source={SOURCES.storableEdgeGateIntegration} /> If you run Storable
          software, ask Storable what it would involve at your site.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Move the computer&apos;s job to a hosted service</h3>
        <p className="mt-4 text-text-800">
          This is what we do. The office PC&apos;s job moves to the cloud. A small bridge stays at the
          site to talk to your controllers. We can bridge Storable Edge and Storable Easy to OpenTech
          Alliance&apos;s INSOMNIAC CIA and to DigiGate. Tell us your setup.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What to do next</h2>
        <p className="mt-4 text-text-800">
          Start with the checklist. If you run DigiGate or FalconXT, read our guides to{" "}
          <Link href="/resources/digigate-replacement" className={link}>
            DigiGate replacement options
          </Link>{" "}
          or{" "}
          <Link href="/resources/falconxt-end-of-life" className={link}>
            FalconXT end of life
          </Link>{" "}
          first, since PTI lists both as legacy products. <SourceLink source={SOURCES.ptiFacts} /> If
          codes are not reaching the gate today, work through the{" "}
          <Link href="/resources/gate-not-syncing" className={link}>
            gate sync diagnostic guide
          </Link>{" "}
          before you change anything else.
        </p>
        <p className="mt-4 text-text-800">
          If hosting is the option you want to explore, read how our{" "}
          <Link href="/solutions/access-control-hosting" className={link}>
            cloud access control hosting
          </Link>{" "}
          works. Tell us what is on site. We will tell you plainly whether we can work with it as it is,
          and what replacing it would involve if not. Pricing depends on how many facilities you run and
          what hardware is on site.
        </p>

        <SourceList
          sources={[
            SOURCES.storableEasyGateSync,
            SOURCES.opentechCia,
            SOURCES.doorkingCloudAccountManager,
            SOURCES.janusNoke1,
            SOURCES.microsoftWindowsEos,
            SOURCES.digiGateManual,
            SOURCES.storableEasyCommonProblems,
            SOURCES.storableEasyDigiGate,
            SOURCES.storableEdgeGateIntegration,
            SOURCES.ptiDesktopRequirements,
            SOURCES.ptiCloudManual,
            SOURCES.ptiFacts,
            SOURCES.opentechK500Manual,
            SOURCES.sitelinkCiaNews,
            SOURCES.doorkingSelfStorage,
            SOURCES.doorkingWindowsAccountManager,
            SOURCES.sitelinkRecommendedHardware,
            SOURCES.ptiDesktopInstallGuide,
          ]}
        />
        <p className="mt-8 text-sm text-text-700">
          We are not affiliated with PTI Security Systems, Storable, OpenTech Alliance, DoorKing, Janus
          International or Microsoft, or with the makers of QuikStor, Revenue Control Systems,
          StorGuard, SpiderDoor, WinSen or Cubby. Product names are the property of their owners.
        </p>
      </article>

      <CtaBand
        heading="Is your gate tied to an office PC?"
        text="Tell us your facility software and what is on site. We will tell you plainly whether we can work with it as it is."
        primary={{ href: "/contact", label: "Contact us" }}
        secondary={{ href: "/demo", label: "Request a demo" }}
      />
    </>
  );
}
```

- [ ] **Step 5: Link the article from the pages that point to it**

Link the article from the access control page's problem section:

In `self-storage-hosting/app/(marketing)/solutions/access-control-hosting/page.tsx`, replace:

```tsx
        </ul>
      </section>
```

with:

```tsx
        </ul>
        <p className="mt-6 text-text-800">
          Which gate setups still depend on a Windows PC, vendor by vendor:{" "}
          <Link
            href="/resources/self-storage-gate-server"
            className={`font-semibold underline ${FOCUS_RING_LIGHT}`}
          >
            do you still need a gate server?
          </Link>
        </p>
      </section>
```

- [ ] **Step 6: Run the tests to verify they pass**

```bash
npx vitest run tests/articles.test.ts tests/sitemap-coverage.test.ts
```

Expected: PASS.

- [ ] **Step 7: Run the gates**

In Git Bash, from `self-storage-hosting/`:

```bash
npm run lint && npm test && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts
```

Expected: lint is clean, every unit test passes, the build succeeds and every rendered check passes.

- [ ] **Step 8: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add self-storage-hosting/tests/articles.test.ts self-storage-hosting/tests/sitemap-coverage.test.ts self-storage-hosting/lib/articles.ts self-storage-hosting/lib/sources.ts "self-storage-hosting/app/(marketing)/resources/self-storage-gate-server/page.tsx" "self-storage-hosting/app/(marketing)/solutions/access-control-hosting/page.tsx"
git commit -m "feat(resources): gate server guide; the access control page links it"
cd self-storage-hosting
```

- [ ] **Step 9: Probe the guards against this page**

Two spot checks that the per-article guards see this page, not only the first one.

| Mutation | Run | Must fail naming |
|---|---|---|
| In the page's `<SourceList>`, delete the line `SOURCES.ptiDesktopInstallGuide,` | `npx vitest run tests/articles.test.ts` | `cites these but does not list them` and `ptiDesktopInstallGuide` |
| Retarget the page's first solution link (the one reading "cloud access control hosting") from `/solutions/access-control-hosting` to `/support` | `npm run build`, then `RENDERED=1 npx vitest run tests/rendered.test.ts` | `/resources/self-storage-gate-server: first solution link is not in the first third` |

Restore each file with `git checkout -- <file>` after its row. This is safe because the task is already committed. If any row ran `npm run build`, run `npm run build` once more after the last row so `.next` matches the committed source. Finish with `git status --short`. It must print nothing except the untracked `.claude/` and `.serena/` folders, if this checkout has them.

---

### Task 8: Every name the guides print, on /legal/trademarks

The five guides print product names that the trademark guard does not watch yet, because Plans 1 and 2 never printed them. This task:
1. adds those words to `WATCHLIST`, which makes the guard fail;
2. adds the names to `lib/trademarks.ts`, which makes it pass;
3. makes `/legal/trademarks` show every name the list holds.

Two rulings, both in Global Constraints:
- An owner is named only where the owner's own site was found. Revenue Control Systems, Eight IO, BearBox and Cubby appear in a vendor's integration list, and no first-party page for them was found. They go in `NAMES_WITHOUT_CONFIRMED_OWNER`, which the page prints in a sentence of its own, without an owner.
- Owners carry no legal suffix. Sentinel Systems' own page spells its product "WinSen" in its heading and "Winsen" in running text. The list uses "WinSen".

**Files:**
- Modify: `self-storage-hosting/tests/helpers/brands.ts` (`WATCHLIST` only)
- Modify: `self-storage-hosting/lib/trademarks.ts`
- Modify: `self-storage-hosting/tests/trademarks.test.ts`
- Modify: `self-storage-hosting/tests/rendered.test.ts`
- Modify: `self-storage-hosting/app/(marketing)/legal/trademarks/page.tsx`

**Interfaces:**
- Consumes:
  - From Tasks 3-7: the five guide pages, which print the names.
  - From Plan 2: `THIRD_PARTY_MARKS`, `WATCHLIST`, and `words()` in `tests/trademarks.test.ts`, which since Task 3 ignores URLs.
- Produces:
  - `NAMES_WITHOUT_CONFIRMED_OWNER: string[]` in `lib/trademarks.ts`. Both `tests/trademarks.test.ts` and `/legal/trademarks` read it.

- [ ] **Step 1: Watch the new names**

In `self-storage-hosting/tests/helpers/brands.ts`, add these to `WATCHLIST`, after `"DKS",`:

```ts
  "BridgeApp",
  "Falcon",
  "DigiTech",
  "Apex",
  "StorGuard",
  "Sentinel",
  "WinSen",
  "SpiderDoor",
  "QuikStor",
  "Revenue",
  "Eight",
  "BearBox",
  "Cubby",
  "Microsoft",
  "Windows",
```

```bash
npx vitest run tests/trademarks.test.ts
```

Expected: FAIL, `named on the site but not on /legal/trademarks: …`, naming the words just added.

- [ ] **Step 2: List them**

Replace `self-storage-hosting/lib/trademarks.ts` in full. The PTI, Storable and DoorKing entries gain the product names the guides print. Five owners are new. The last export is new:

```ts
// Third-party names this site uses, grouped by the company that owns them.
// /legal/trademarks renders this list, and tests/trademarks.test.ts fails
// when the site prints a watchlisted name that is missing here.
//
// Owners are plain company names, never with a legal suffix: their legal
// entities were not verified. No registration status is claimed for any
// mark beyond the ® its owner prints on INSOMNIAC. INSOMNIAC® keeps the ®
// its owner uses.
export type ThirdPartyMark = { owner: string; marks: string[] };

export const THIRD_PARTY_MARKS: ThirdPartyMark[] = [
  {
    owner: "PTI Security Systems",
    marks: [
      "PTI",
      "StorLogix",
      "StorLogix Cloud",
      "StorLogix Desktop",
      "StorLogix Cloud Adaptor",
      "BridgeApp",
      "FalconXT",
      "Falcon 2000",
      "CloudController",
      "DigiGate",
      "DigiTech",
      "Apex",
      "VP Standard Series",
    ],
  },
  { owner: "OpenTech Alliance", marks: ["OpenTech Alliance", "INSOMNIAC® CIA"] },
  {
    owner: "Storable",
    marks: ["Storable", "Sitelink by Storable", "Storable Edge", "Storable Easy", "Storable Access Control"],
  },
  { owner: "Janus International", marks: ["Janus", "Nokē", "Nokē Smart Entry"] },
  {
    owner: "DoorKing",
    marks: ["DoorKing", "DKS", "Remote Account Manager", "Windows Account Manager", "Cloud Account Manager"],
  },
  // Each of these four publishes its own site under this name, the name
  // lib/sources.ts gives as the publisher. Sentinel Systems' own page offers
  // WinSen license keys and downloads to "existing Winsen customer[s]".
  { owner: "StorGuard", marks: ["StorGuard"] },
  { owner: "Sentinel Systems", marks: ["Sentinel Systems", "WinSen"] },
  { owner: "SpiderDoor", marks: ["SpiderDoor"] },
  { owner: "QuikStor", marks: ["QuikStor"] },
  { owner: "Microsoft", marks: ["Windows"] },
  { owner: "Netlify", marks: ["Netlify"] },
  { owner: "Cloudflare", marks: ["Cloudflare"] },
  { owner: "Resend", marks: ["Resend"] },
];

// Product names our guides print because a vendor's own list names them
// (Storable's, Sitelink's or DoorKing's), but whose owners we found no
// first-party page for. Naming an owner here would be a guess, so
// /legal/trademarks lists them in a sentence of their own instead.
export const NAMES_WITHOUT_CONFIRMED_OWNER: string[] = [
  "Revenue Control Systems",
  "Eight IO",
  "BearBox",
  "Cubby",
];
```

In `self-storage-hosting/tests/trademarks.test.ts`, a name counts as listed when the page shows it without an owner, too:

In `self-storage-hosting/tests/trademarks.test.ts`, replace:

```ts
import path from "node:path";
import { THIRD_PARTY_MARKS } from "@/lib/trademarks";
import { PKG_ROOT, walkFrom } from "./helpers/walk";
```

with:

```ts
import path from "node:path";
import { NAMES_WITHOUT_CONFIRMED_OWNER, THIRD_PARTY_MARKS } from "@/lib/trademarks";
import { PKG_ROOT, walkFrom } from "./helpers/walk";
```

In `self-storage-hosting/tests/trademarks.test.ts`, replace:

```ts
  for (const set of perDir.values()) for (const w of set) used.add(w);
  const listed = words(THIRD_PARTY_MARKS.flatMap((m) => [m.owner, ...m.marks]).join(" "));
```

with:

```ts
  for (const set of perDir.values()) for (const w of set) used.add(w);
  // A name counts as listed whether the page gives its owner or lists it
  // among the names whose owners we have not confirmed.
  const listed = words(
    [...THIRD_PARTY_MARKS.flatMap((m) => [m.owner, ...m.marks]), ...NAMES_WITHOUT_CONFIRMED_OWNER].join(" ")
  );
```

```bash
npx vitest run tests/trademarks.test.ts
```

Expected: PASS.

- [ ] **Step 3: Write the failing page test**

`tests/trademarks.test.ts` proves the list covers the site. Nothing yet proves the page prints the list.

In `self-storage-hosting/tests/rendered.test.ts`, import the list on the line after the `@/lib/articles` import:

```ts
import { NAMES_WITHOUT_CONFIRMED_OWNER, THIRD_PARTY_MARKS } from "@/lib/trademarks";
```

Then add this test just before the comment about the 404 page:

In `self-storage-hosting/tests/rendered.test.ts`, replace:

```ts

  // SiteChrome's other consumer: the 404 page (app/not-found.tsx). It has no
```

with:

```ts

  it("shows every name lib/trademarks.ts lists on /legal/trademarks", () => {
    // tests/trademarks.test.ts proves the list is complete; this proves the
    // page prints it, including the names whose owners we have not confirmed.
    const text = rowText(visible(read("/legal/trademarks")));
    const names = [
      ...THIRD_PARTY_MARKS.flatMap((m) => [m.owner, ...m.marks]),
      ...NAMES_WITHOUT_CONFIRMED_OWNER,
    ];
    const missing = names.filter((n) => !text.includes(n));
    expect(missing, `listed but not shown on /legal/trademarks: ${missing.join(", ")}`).toEqual([]);
  });

  // SiteChrome's other consumer: the 404 page (app/not-found.tsx). It has no
```

```bash
npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts
```

Expected: FAIL, `listed but not shown on /legal/trademarks: Revenue Control Systems, Eight IO, BearBox, Cubby`. The page already renders every `THIRD_PARTY_MARKS` entry.

- [ ] **Step 4: Print the names without an owner**

In `self-storage-hosting/app/(marketing)/legal/trademarks/page.tsx`:

In `self-storage-hosting/app/(marketing)/legal/trademarks/page.tsx`, replace:

```tsx
import { formatDate } from "@/lib/dates";
import { THIRD_PARTY_MARKS } from "@/lib/trademarks";
import Breadcrumbs from "@/components/Breadcrumbs";
```

with:

```tsx
import { formatDate } from "@/lib/dates";
import { NAMES_WITHOUT_CONFIRMED_OWNER, THIRD_PARTY_MARKS } from "@/lib/trademarks";
import Breadcrumbs from "@/components/Breadcrumbs";
```

In `self-storage-hosting/app/(marketing)/legal/trademarks/page.tsx`, replace:

```tsx
        <p className="mt-6 text-text-800">
          Event and association names on our events page belong to their organizers.
```

with:

```tsx
        <p className="mt-6 text-text-800">
          Our guides also name{" "}
          {new Intl.ListFormat("en", { type: "conjunction" }).format(NAMES_WITHOUT_CONFIRMED_OWNER)},
          because a vendor&apos;s own list names them. We have not confirmed who owns each of these
          names. They belong to their owners too.
        </p>

        <p className="mt-4 text-text-800">
          Event and association names on our events page belong to their organizers.
```

`lib/legal.ts` says to change a legal page's date in the same commit that changes its text. `LEGAL_UPDATED.trademarks` is already `"2026-09-19"`. If you run this task after 2026-09-19, set it to the day you run it and add `self-storage-hosting/lib/legal.ts` to the commit.

```bash
npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts
```

Expected: PASS.

- [ ] **Step 5: Run the gates**

In Git Bash, from `self-storage-hosting/`:

```bash
npm run lint && npm test && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts
```

Expected: lint is clean, every unit test passes, the build succeeds and every rendered check passes.

- [ ] **Step 6: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add self-storage-hosting/tests/helpers/brands.ts self-storage-hosting/lib/trademarks.ts self-storage-hosting/tests/trademarks.test.ts self-storage-hosting/tests/rendered.test.ts "self-storage-hosting/app/(marketing)/legal/trademarks/page.tsx"
git commit -m "feat(legal): /legal/trademarks lists every name the guides print, and says which owners are unconfirmed"
cd self-storage-hosting
```

- [ ] **Step 7: Probe the list, one new word at a time**

Each row removes the one entry that lists a new word. The guard must fail and name that word. The WinSen row changes only Sentinel Systems' marks. There is no row for Windows, which DoorKing's "Windows Account Manager" also lists: the guard compares words, so it cannot tell the two apart.

| Mutation | Run | Must fail naming |
|---|---|---|
| In `lib/trademarks.ts`, delete the line `"BridgeApp",` | `npx vitest run tests/trademarks.test.ts` | `named on the site but not on /legal/trademarks` and `BridgeApp` |
| In `lib/trademarks.ts`, delete the line `"Falcon 2000",` | `npx vitest run tests/trademarks.test.ts` | `named on the site but not on /legal/trademarks` and `Falcon` |
| In `lib/trademarks.ts`, delete the line `"DigiTech",` | `npx vitest run tests/trademarks.test.ts` | `named on the site but not on /legal/trademarks` and `DigiTech` |
| In `lib/trademarks.ts`, delete the line `"Apex",` | `npx vitest run tests/trademarks.test.ts` | `named on the site but not on /legal/trademarks` and `Apex` |
| In `lib/trademarks.ts`, delete the line `{ owner: "StorGuard", marks: ["StorGuard"] },` | `npx vitest run tests/trademarks.test.ts` | `named on the site but not on /legal/trademarks` and `StorGuard` |
| In `lib/trademarks.ts`, delete the line `{ owner: "Sentinel Systems", marks: ["Sentinel Systems", "WinSen"] },` | `npx vitest run tests/trademarks.test.ts` | `named on the site but not on /legal/trademarks` and `Sentinel` |
| In `lib/trademarks.ts`, drop `"WinSen"` from Sentinel Systems' marks | `npx vitest run tests/trademarks.test.ts` | `named on the site but not on /legal/trademarks` and `WinSen` |
| In `lib/trademarks.ts`, delete the line `{ owner: "SpiderDoor", marks: ["SpiderDoor"] },` | `npx vitest run tests/trademarks.test.ts` | `named on the site but not on /legal/trademarks` and `SpiderDoor` |
| In `lib/trademarks.ts`, delete the line `{ owner: "QuikStor", marks: ["QuikStor"] },` | `npx vitest run tests/trademarks.test.ts` | `named on the site but not on /legal/trademarks` and `QuikStor` |
| In `lib/trademarks.ts`, delete the line `{ owner: "Microsoft", marks: ["Windows"] },` | `npx vitest run tests/trademarks.test.ts` | `named on the site but not on /legal/trademarks` and `Microsoft` |
| In `lib/trademarks.ts`, delete the line `"Revenue Control Systems",` | `npx vitest run tests/trademarks.test.ts` | `named on the site but not on /legal/trademarks` and `Revenue` |
| In `lib/trademarks.ts`, delete the line `"Eight IO",` | `npx vitest run tests/trademarks.test.ts` | `named on the site but not on /legal/trademarks` and `Eight` |
| In `lib/trademarks.ts`, delete the line `"BearBox",` | `npx vitest run tests/trademarks.test.ts` | `named on the site but not on /legal/trademarks` and `BearBox` |
| In `lib/trademarks.ts`, delete the line `"Cubby",` | `npx vitest run tests/trademarks.test.ts` | `named on the site but not on /legal/trademarks` and `Cubby` |

Restore each file with `git checkout -- <file>` after its row. This is safe because the task is already committed. If any row ran `npm run build`, run `npm run build` once more after the last row so `.next` matches the committed source. Finish with `git status --short`. It must print nothing except the untracked `.claude/` and `.serena/` folders, if this checkout has them.

---

### Task 9: The link rule names built routes only again; the drafts and checklist say what is still open

All five guides are built, so the interim exception in `allowedLink` has done its job. Task 3 time-boxed it to this task. This task:
- shows the gap the exception leaves;
- removes the exception;
- shows the gap closed.

It also corrects comments that went stale when PR #1 merged:
- **The legal pages.** Four pages and `lib/legal.ts` say they must be reviewed "before PR #1 merges". PR #1 has merged with them still marked as drafts, so that review is now overdue. The deploy checklist says so plainly, and the comments drop the deadline that has passed. Each page keeps its "DRAFT FOR OWNER" marker, which is what the checklist's `git grep` finds.
- **"Plan 3".** Two comments speak of Plan 3 in the future tense.

Last, it adds the Plan 3 section to the deploy checklist, which covers:
- the new rich-result and indexing checks;
- who keeps the compatibility matrix current (spec §14 E2, still open), and how to re-check it without faking a modified date (spec §7.3);
- the four trademark names without a confirmed owner.

**Files:**
- Modify: `self-storage-hosting/tests/helpers/links.ts`
- Modify: `self-storage-hosting/lib/legal.ts`
- Modify: `self-storage-hosting/app/(marketing)/legal/accessibility/page.tsx`
- Modify: `self-storage-hosting/app/(marketing)/legal/privacy/page.tsx`
- Modify: `self-storage-hosting/app/(marketing)/legal/terms/page.tsx`
- Modify: `self-storage-hosting/app/(marketing)/legal/trademarks/page.tsx`
- Modify: `docs/deploy-checklist.md`
- Modify: `self-storage-hosting/lib/schema.ts`
- Modify: `self-storage-hosting/tests/content-policy.test.ts`

**Interfaces:**
- Consumes:
  - From Task 3: the interim `allowedLink`.
  - From Tasks 3-7: all five `ARTICLES` entries, so every article path is now `isLive`.
- Produces:
  - `allowedLink(p: string): boolean`, back to its Plan 2 body `return isLive(p);`.

- [ ] **Step 1: Show the gap the interim rule leaves**

Unregister the gate-server guide while its links stay in place. The link guard should fail. Under the interim rule it passes, because the old path is still on the planned list.

| Mutation | Run | Must fail naming |
|---|---|---|
| In `lib/articles.ts`, change `slug: "self-storage-gate-server",` to `slug: "self-storage-gate-server-renamed",` | `npx vitest run tests/source-links.test.ts` | **Must PASS** (this row shows the gap) |

Then undo it: `git checkout -- lib/articles.ts`. That is safe, because this task never changes that file.

- [ ] **Step 2: Remove the interim rule**

Replace `self-storage-hosting/tests/helpers/links.ts` in full with its Plan 2 form:

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

```bash
npx vitest run tests/source-links.test.ts
```

Expected: PASS. Every article path is built now, so nothing needs the exception.

- [ ] **Step 3: Say what is still open about the legal drafts**

In `self-storage-hosting/lib/legal.ts`, replace:

```ts
// or counsel must review them before PR #1 merges (spec 6.11, 14 C).
```

with:

```ts
// or counsel must still review them (spec 6.11, 14 C). PR #1 merged before
// that review, so it is overdue: see docs/deploy-checklist.md.
```

In each legal page, drop the deadline that has passed. Keep the marker.

In `self-storage-hosting/app/(marketing)/legal/accessibility/page.tsx`, replace:

```tsx
// DRAFT FOR OWNER REVIEW BEFORE PR #1 MERGES.
```

with:

```tsx
// DRAFT FOR OWNER REVIEW.
```

In `self-storage-hosting/app/(marketing)/legal/privacy/page.tsx`, replace:

```tsx
// DRAFT FOR OWNER OR COUNSEL REVIEW BEFORE PR #1 MERGES. Not legal advice.
```

with:

```tsx
// DRAFT FOR OWNER OR COUNSEL REVIEW. Not legal advice.
```

In `self-storage-hosting/app/(marketing)/legal/terms/page.tsx`, replace:

```tsx
// DRAFT FOR OWNER OR COUNSEL REVIEW BEFORE PR #1 MERGES. Not legal advice.
```

with:

```tsx
// DRAFT FOR OWNER OR COUNSEL REVIEW. Not legal advice.
```

In `self-storage-hosting/app/(marketing)/legal/trademarks/page.tsx`, replace:

```tsx
// DRAFT FOR OWNER OR COUNSEL REVIEW BEFORE PR #1 MERGES. Not legal advice.
```

with:

```tsx
// DRAFT FOR OWNER OR COUNSEL REVIEW. Not legal advice.
```

In `docs/deploy-checklist.md`, replace:

```markdown
- [ ] **Legal review, before PR #1 merges.** `git grep -n "DRAFT FOR OWNER" -- self-storage-hosting/app`
```

with:

```markdown
- [ ] **Legal review, now overdue.** PR #1 merged with the legal pages still
      marked as drafts. `git grep -n "DRAFT FOR OWNER" -- self-storage-hosting/app`
```

In the same file, replace:

```markdown
      Then disclose it in the privacy policy's "Cookies" section before
      PR #1 merges.
```

with:

```markdown
      Then disclose it in the privacy policy's "Cookies" section.
```

- [ ] **Step 4: Put the "Plan 3" comments in the present tense**

In `self-storage-hosting/lib/schema.ts`, replace:

```ts
          // Case-insensitive on purpose. Every @type this file emits today is
          // a hardcoded literal, but Plan 3 folds article and event data in
          // from outside, and "faqpage" must not slip past the one guard.
```

with:

```ts
          // Case-insensitive on purpose. Every @type this file emits is a
          // hardcoded literal, but articleSchema and eventSchema pass data from
          // lib/articles.ts and lib/events.ts through here, and "faqpage" must
          // not slip past the one guard.
```

In `self-storage-hosting/tests/content-policy.test.ts`, replace:

```ts
// inside this exact file, which Plan 3 will feed article/event data through).
```

with:

```ts
// inside this exact file, which article and event data pass through).
```

- [ ] **Step 5: Add the Plan 3 section to the deploy checklist**

At the end of `docs/deploy-checklist.md`, after one blank line, add:

```markdown
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
- [ ] **Trademark owners we could not confirm.** `/legal/trademarks` names
      Revenue Control Systems, Eight IO, BearBox and Cubby without an owner,
      because no first-party page for any of them was found. If counsel wants
      owners named, confirm each from the company's own site. Then move the
      name from `NAMES_WITHOUT_CONFIRMED_OWNER` into `THIRD_PARTY_MARKS` in
      `self-storage-hosting/lib/trademarks.ts`, and update
      `LEGAL_UPDATED.trademarks` in `self-storage-hosting/lib/legal.ts`.
```

- [ ] **Step 6: Run the gates**

In Git Bash, from `self-storage-hosting/`:

```bash
npm run lint && npm test && npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts
```

Expected: lint is clean, every unit test passes, the build succeeds and every rendered check passes.

- [ ] **Step 7: Commit**

```bash
cd "$(git rev-parse --show-toplevel)"
git add self-storage-hosting/tests/helpers/links.ts self-storage-hosting/lib/legal.ts "self-storage-hosting/app/(marketing)/legal/accessibility/page.tsx" "self-storage-hosting/app/(marketing)/legal/privacy/page.tsx" "self-storage-hosting/app/(marketing)/legal/terms/page.tsx" "self-storage-hosting/app/(marketing)/legal/trademarks/page.tsx" docs/deploy-checklist.md self-storage-hosting/lib/schema.ts self-storage-hosting/tests/content-policy.test.ts
git commit -m "chore(resources): links name built routes only again; drafts and checklist say what is still open"
cd self-storage-hosting
```

- [ ] **Step 8: Show the gap closed**

The same mutation as Step 1 must now fail.

| Mutation | Run | Must fail naming |
|---|---|---|
| In `lib/articles.ts`, change `slug: "self-storage-gate-server",` to `slug: "self-storage-gate-server-renamed",` | `npx vitest run tests/source-links.test.ts` | `dead or forbidden links` and `/resources/self-storage-gate-server` |

Restore each file with `git checkout -- <file>` after its row. This is safe because the task is already committed. If any row ran `npm run build`, run `npm run build` once more after the last row so `.next` matches the committed source. Finish with `git status --short`. It must print nothing except the untracked `.claude/` and `.serena/` folders, if this checkout has them.

---

## After the last task

The controller does these, not an implementer:

1. Push `claude/resources-articles` and open a pull request against `main`, ready for review. Summarize:
   - the hub and the five guides;
   - the rulings above;
   - the new Plan 3 section of `docs/deploy-checklist.md`.

   Do not enable auto-merge.
2. Verify the preview deploy:
   - Load `/resources` and each guide.
   - Check the hub lists all five.
   - Check `/sitemap.xml` gives each guide a `lastmod`.

   Never send a valid POST to `/api/contact`. Probe it only with an invalid body such as `{}`.
3. When the owner is ready to merge, compare the five `datePublished` values in `self-storage-hosting/lib/articles.ts` with the merge day (ruling 5). If the merge day is later, set all five to it in one commit on this branch, run the gates, and push. Change nothing else in that commit.
4. Leave these to the owner. Each one is in `docs/deploy-checklist.md`:
   - the overdue legal review;
   - the Rich Results Test and indexing requests for the new pages;
   - spec §14 E2: who keeps the compatibility matrix current;
   - the four trademark names without a confirmed owner.

---

## Appendix: Every source the guides cite

Every entry was checked against its live page on 2026-09-19. "Added in" is the task that adds the entry to `lib/sources.ts`. "Plan 2" entries exist already. "Cited by" lists the tasks whose guides cite it.

| Key | Publisher | Document | Added in | Cited by |
|---|---|---|---|---|
| `storableEasyDigiGate` | Storable | [DigiGate integration guide](https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-integrations/digi-gate-integration~7609004328930853160) | Plan 2 | Task 4, Task 5, Task 7 |
| `storableEasyGateSync` | Storable | [What to do if the gate sync is not working](https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-troubleshooting/what-should-i-do-if-the-gate-sync-is-not-working~7609015167005715714) | Plan 2 | Task 4, Task 5, Task 7 |
| `digiGateManual` | PTI Security Systems | [DigiGate installation manual, archived (PDF)](https://www.ptisecurity.com/documents/access-control/controllers/controllers-archive/digigate-archive/DigiGate_Install_Manual_1100_044___Ver2.5__.pdf) | Plan 2 | Task 5, Task 7 |
| `ptiFacts` | PTI Security Systems | [Facts, including legacy products](https://www.ptisecurity.com/us/en/facts) | Plan 2 | Task 3, Task 4, Task 5, Task 6, Task 7 |
| `ptiContinuousLearning` | PTI Security Systems | [Continuous learning](https://www.ptisecurity.com/us/en/get_support/continuous-learning) | Plan 2 | none after the go-forward correction; supports only "PTI provides training" on the access control page |
| `ptiMigrationManual` | PTI Security Systems | [FalconXT to CloudController migration manual (PDF)](https://www.ptisecurity.com/documents/access-control/controllers/controllers-current/FalconXT%20to%20CloudController%20Migration.pdf) | Plan 2 | Task 3 |
| `ptiLlmsTxt` | PTI Security Systems | [Canonical facts for AI systems (plain text)](https://www.ptisecurity.com/LLMs.txt) | Task 3 | Task 3 |
| `ptiCloudControllerPage` | PTI Security Systems | [CloudController](https://www.ptisecurity.com/us/en/products/access-control/cloud-controller) | Task 5 | Task 5 |
| `ptiCloudControllerManual` | PTI Security Systems | [CloudController user's manual (PDF)](https://www.ptisecurity.com/documents/access-control/controllers/controllers-current/cloud-controller-user-manual-91924.pdf) | Task 3 | Task 3 |
| `ptiNextGenBlog` | PTI Security Systems | [Four ways the next-gen Cloud Controller improves self-storage security](https://www.ptisecurity.com/us/en/about-us/articles-and-news/blogs/four-ways-the-next-gen-cloud-controller-improves-self-storage-security) | Task 3 | Task 3 |
| `ptiComparisonChart` | PTI Security Systems | [Controller comparison chart (PDF)](https://www.ptisecurity.com/documents/access-control/controllers/controllers-current/controller-comparison-chart.pdf) | Task 3 | Task 3 |
| `ptiCloudFalconGuide` | PTI Security Systems | [StorLogix Cloud and FalconXT user guide, archived (PDF)](https://www.ptisecurity.com/documents/access-control/storlogix-cloud/storlogix-cloud-archive/StorLogix%20CLoud%20and%20FalconXT%20User%20Guide.pdf) | Task 3 | Task 3 |
| `ptiDesktopRequirements` | PTI Security Systems | [Computer requirements for StorLogix Desktop, archived (PDF)](https://www.ptisecurity.com/documents/misc/misc-archive/Computer_System_Requirements___StorLogix_Desktop.pdf) | Task 3 | Task 3, Task 7 |
| `ptiDesktopInstallGuide` | PTI Security Systems | [StorLogix Desktop installation guide, archived (PDF)](https://www.ptisecurity.com/documents/access-control/storlogix-cloud/storlogix-cloud-archive/StorLogix_Desktop_Installation_Guide.pdf) | Task 7 | Task 7 |
| `ptiDesktopToCloudBlog` | PTI Security Systems | [Moving from desktop to cloud](https://www.ptisecurity.com/us/en/about-us/articles-and-news/blogs/moving-from-desktop-to-cloud) | Task 3 | Task 3 |
| `ptiCloudManual` | PTI Security Systems | [StorLogix Cloud user's manual (PDF)](https://www.ptisecurity.com/documents/access-control/storlogix-cloud/storlogix-cloud-current/storlogix-user-manual_071423-1.pdf) | Task 4, moved to Task 3 on a replay (see the Correction section) | Task 3, Task 4, Task 5, Task 6, Task 7 |
| `ptiIntegrationsTable` | PTI Security Systems | [Facility software integrations table](https://www.ptisecurity.com/us/en/pti-partners/pms-integrations) | Task 6 | Task 6 |
| `ptiStorableRelease` | PTI Security Systems | [PTI Security Systems and Storable partner integration](https://www.ptisecurity.com/us/en/about-us/articles-and-news/news/pti-security-systems-and-storable-partner-integration) | Task 6 | Task 6 |
| `ptiKeypadMessages` | PTI Security Systems | [Troubleshooting keypad messages (PDF)](https://www.ptisecurity.com/documents/keypads/keypads-general/troubleshooting_keypad_messages.pdf) | Task 4 | Task 4 |
| `ptiCloudAdapterGuide` | PTI Security Systems | [Cloud Adapter installation guide (PDF)](https://www.ptisecurity.com/documents/litmos-docs/storlogix-cloud/StorLogix%20Cloud%20Adapter%20Installation%20Guide.pdf) | Task 4 | Task 4 |
| `ptiEolNotice` | PTI Security Systems | [End of life notice: DigiTech and Falcon 2000 with Falcon Base Unit (PDF)](https://www.ptisecurity.com/documents/access-control/controllers/controllers-archive/digigate-archive/End-of-Life-Notice_DigiTech-and-Falcon2000-with-Falcon-Base-Unit.pdf) | Task 5 | Task 5 |
| `ptiKnowledgeBase` | PTI Security Systems | [Knowledge base](https://www.ptisecurity.com/us/en/get_support/knowledgebase) | Task 5 | Task 5 |
| `ptiKbArchive` | PTI Security Systems | [Knowledge base archives](https://www.ptisecurity.com/us/en/get_support/archived_knowledgebase) | Task 5 | Task 5 |
| `ptiReplaceSyscon` | PTI Security Systems | [Replacing a Digitech system controller with a Falcon XT, archived (PDF)](https://www.ptisecurity.com/documents/access-control/controllers/controllers-archive/falconxt-archive/Replacing_a_Digitech_System_Controller_with_a_Falcon_XT.pdf) | Task 5 | Task 5 |
| `ptiSendDigiGateFiles` | PTI Security Systems | [Sending your DigiGate files to PTI Security Systems, archived (PDF)](https://www.ptisecurity.com/documents/access-control/controllers/controllers-archive/digigate-archive/Sending_Your_DigiGate_File_to_PTI_Security_Systems___Updated___V1.pdf) | Task 5 | Task 5 |
| `digiGateUsersGuide` | PTI Security Systems | [DigiGate for Windows user's guide, archived (PDF)](https://www.ptisecurity.com/documents/access-control/controllers/controllers-archive/digigate-archive/DigiGate_for_Windows_Users_Guide___Ver_3.6____1_.pdf) | Task 5 | Task 5 |
| `storableEasyThirdPartyGates` | Storable | [Third-party gate integrations (Storable Easy help)](https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-integrations/third-party-gate-integrations~7608999610974774984) | Task 5 | Task 5, Task 6 |
| `storableEasyCommonProblems` | Storable | [Common gate problems (Storable Easy help)](https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-troubleshooting/common-gate-problems~7609015150086836225) | Task 4 | Task 4, Task 7 |
| `storableEasyDoorKing` | Storable | [DoorKing gate integration and troubleshooting (Storable Easy help)](https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-integrations/doorking-gate-integration-and-troubleshooting~7609004327770822699) | Task 4 | Task 4 |
| `storableEasyStorLogix` | Storable | [PTI StorLogix gate integration (Storable Easy help)](https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-integrations/pti-storlogix-gate-integration~7609004327358414196) | Task 4 | Task 4, Task 6 |
| `storableEasyNoke` | Storable | [Nokē Smart Entry integration (Storable Easy help)](https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-integrations/janus-noke-smart-entry-system~7609004324182144375) | Task 4 | Task 4, Task 6 |
| `storableEasyKiosks` | Storable | [Kiosk integration with Storable Easy (Storable Easy help)](https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-integrations/insomniac-kiosks-and-storable-easy~7609004321378949717) | Task 6 | Task 6 |
| `storableEasyCloudNode` | Storable | [Error communicating with the cloud node (Storable Easy help)](https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/gate-troubleshooting/what-should-i-do-if-i-get-an-error-that-there-was-a-problem-communicating-with-the-cloud-node~7609015147653595240) | Task 4 | Task 4 |
| `storableAccessControlFaq` | Storable | [Storable Access Control FAQ (Storable Easy help)](https://support.storageunitsoftware.com/storable-easy/easy-product-guides/access-control-and-gate-integrations/storable-access-control/storable-access-control-faq~7609022205225526581) | Task 4 | Task 4 |
| `storableAccessControl` | Storable | [Storable Access Control](https://www.storable.com/products/access-control/) | Task 3 | Task 3, Task 5, Task 6 |
| `storableEdgeGateIntegration` | Storable | [Gate integration (Storable Edge help)](https://help.storedge.com/storable-edge/account-management/facility-level-software-settings/gate-integration~7616843970740718814) | Task 4 | Task 4, Task 5, Task 6, Task 7 |
| `storableEdgeDelinquency` | Storable | [Delinquency stages (Storable Edge help)](https://help.storedge.com/storable-edge/account-management/delinquency-settings/delinquency-stages~7616206212725672475) | Task 4 | Task 4 |
| `storableEdgeGateReport` | Storable | [Gate access report (Storable Edge help)](https://help.storedge.com/storable-edge/edge-product-guides/facility-level-reports/gate-access-report~7618986903542044427) | Task 4 | Task 4 |
| `sitelinkGateNotUpdating` | Storable | [Troubleshooting a gate that is not updating (Sitelink help)](https://support.sitelink.com/sitelink/sitelink-product-guides/access-and-gates/third-party-gates/troubleshooting-gate-is-not-updating~7605336808232776280) | Task 4 | Task 4 |
| `sitelinkLockoutPrereq` | Storable | [Prerequisite events for gate lockout (Sitelink help)](https://support.sitelink.com/sitelink/sitelink-product-guides/access-and-gates/third-party-gates/how-do-i-set-prerequisite-events-for-gate-lockout~7605339858688561093) | Task 4 | Task 4 |
| `sitelinkGateReport` | Storable | [The gate access report (Sitelink help)](https://support.sitelink.com/sitelink/sitelink-product-guides/reporting/the-gate-access-report~7607938886650522488) | Task 4 | Task 4 |
| `sitelinkWithholdCodes` | Storable | [Withholding gate codes for online move-ins (Sitelink help)](https://support.sitelink.com/sitelink/sitelink-product-guides/online-move-ins/how-do-i-withhold-gate-codes-for-online-move-ins~7605341655154753291) | Task 4 | Task 4 |
| `sitelinkGatesMarketplace` | Storable | [Gates and access partners (Sitelink marketplace)](https://www.sitelink.com/marketplace/gate-access) | Task 6 | Task 6 |
| `sitelinkCiaNews` | Storable | [Sitelink integrates with OpenTech's cloud access control (2018 news)](https://www.sitelink.com/about/news/sitelink-integrates-with-opentechs-insomniac-cia-cloud-access-control) | Task 7 | Task 7 |
| `sitelinkRecommendedHardware` | Storable | [Recommended hardware (Sitelink help)](https://support.sitelink.com/sitelink/getting-started/recommended-hardware~7605736252733002576) | Task 7 | Task 7 |
| `storableSpiderDoor` | Storable | [SpiderDoor integration](https://www.storable.com/resources/integration/spiderdoor/) | Task 6 | Task 6 |
| `opentechCia` | OpenTech Alliance | [CIA access control](https://opentechalliance.com/solutions/insomniac-cia-access-control/) | Task 3 | Task 3, Task 5, Task 7 |
| `opentechK500Manual` | OpenTech Alliance | [CIA K-500 keypad installation manual (PDF)](https://opentechalliance.com/wp-content/uploads/2016/10/INSOMNIAC-CIA-K-500-Keypad-Intallation-Manual.pdf) | Task 7 | Task 7 |
| `opentechG600Guide` | OpenTech Alliance | [CIA G-600 gateway installation guide (PDF)](https://opentechalliance.com/wp-content/uploads/2026/07/INSOMNIAC-CIA-G-600-Gateway-Installation-Guide.pdf) | Task 4 | Task 4 |
| `opentechPtiKeypads` | OpenTech Alliance | [OpenTech releases PTI keypad integration (2020)](https://opentechalliance.com/blog/opentech-releases-pti-keypad-integration/) | Task 3 | Task 3, Task 5 |
| `opentechSitelink2018` | OpenTech Alliance | [Sitelink first to integrate with the CIA API (2018)](https://opentechalliance.com/blog/sitelink-first-to-integrate-with-insomniac-cias-api/) | Task 6 | Task 6 |
| `opentechPartners` | OpenTech Alliance | [Alliance partners](https://opentechalliance.com/integration-partners/) | Task 6 | Task 6 |
| `doorkingSelfStorage` | DoorKing | [Self storage](https://www.doorking.com/consumers/self-storage/) | Task 3 | Task 3, Task 4, Task 6, Task 7 |
| `doorkingCloudAccountManager` | DoorKing | [Cloud Account Manager, 1830 series](https://www.doorking.com/easyconnect/programming-options/cloud-account-manager-1830-series/) | Task 7 | Task 7 |
| `doorkingWindowsAccountManager` | DoorKing | [Windows Account Manager, 1830 series](https://www.doorking.com/easyconnect/programming-options/1830-series-windows-account-manager/) | Task 7 | Task 7 |
| `doorkingRamManual` | DoorKing | [Remote Account Manager for Windows user's manual (PDF)](https://www.doorking.com/wp-content/uploads/2013/09/1835-066-K-4-10_V6-2c.pdf) | Task 4 | Task 4 |
| `janusNoke1` | Janus International | [Nokē Smart Entry System](https://www.janusintl.com/noke1) | Task 7 | Task 7 |
| `janusNoke` | Janus International | [Nokē Smart Entry product page](https://www.janusintl.com/products/noke) | Task 3 | Task 3 |
| `janusFaq` | Janus International | [Access control FAQs](https://www.janusintl.com/access-control/faqs) | Task 3 | Task 3 |
| `janusNokePartners` | Janus International | [Nokē Smart Entry software integration partners](https://www.janusintl.com/noke-smart-entry-integration-partners) | Task 6 | Task 6 |
| `janusAppTroubleshooting` | Janus International | [Troubleshooting tips for the mobile app](https://www.janusintl.com/knowledge/basic-app-device-troubleshooting) | Task 4 | Task 4 |
| `janusNokeTraining` | Janus International | [Nokē Smart Entry training manual](https://www.janusintl.com/knowledge/nok%C4%93-smart-entry-training-manual) | Task 4 | Task 4 |
| `microsoftWindowsEos` | Microsoft | [End of support for Windows 10, Windows 8.1 and Windows 7](https://www.microsoft.com/en-us/windows/end-of-support) | Task 7 | Task 7 |
| `storguardProducts` | StorGuard | [Products](https://stor-guard.com/products/) | Task 3 | Task 3 |
| `storguardPartners` | StorGuard | [Partners](https://stor-guard.com/partners/) | Task 6 | Task 6 |
| `sentinelHardware` | Sentinel Systems | [Access control hardware](https://www.sentinelsystems.com/hardware) | Task 3 | Task 3, Task 6 |
| `spiderdoorHome` | SpiderDoor | [Self-storage gate security](https://www.spiderdoor.com/) | Task 3 | Task 3 |
| `spiderdoorSwitch` | SpiderDoor | [Switching access control systems without downtime](https://www.spiderdoor.com/switch-self-storage-access-control-system/) | Task 3 | Task 3 |
| `spiderdoorAccessControl` | SpiderDoor | [Self-storage access control systems](https://www.spiderdoor.com/self-storage-access-control-systems/) | Task 6 | Task 6 |
| `quikstorHome` | QuikStor | [Self-storage management software](https://quikstor.com/) | Task 3 | Task 3 |
