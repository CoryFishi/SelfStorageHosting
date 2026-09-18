# Foundation Migration Implementation Plan (Plan 1 of 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the Vite SPA at `self-storage-hosting/` into a Next.js App Router site with working SEO infrastructure, a repaired auth contract, a working contact form, and the two existing pages ported and corrected. This covers spec §16 build-order steps 1–4, the block the spec names as the point to stop at if work stops.

**Architecture:** Next.js 16 App Router, built in place in `self-storage-hosting/` so git history stays coherent. Navigation and route data live in `lib/site.ts` as plain data; components render from it. This makes link integrity a pure-function test rather than a DOM test, and it is what would have caught the live `/contact` 404. SEO concerns are three small modules — `lib/site.ts` (config + route manifest), `lib/seo.ts` (metadata helper), `lib/schema.ts` (JSON-LD builders) — each independently testable.

**Tech Stack:** Next.js 16.3.5, React 19.3.0, Tailwind CSS 4.3.3, TypeScript 5.8, react-icons 5.7.0, Vitest 3, Supertest (backend only). Deploy target Vercel.

**Spec:** `docs/superpowers/specs/2026-09-18-website-completion-seo-design.md`

## Global Constraints

- **Domain:** `https://selfstoragehosting.com`. All canonicals absolute, **no trailing slash**.
- **Pinned versions:** `next@16.3.5`, `react@19.3.0`, `react-dom@19.3.0`, `tailwindcss@4.3.3`, `react-icons@5.7.0`. Pin exactly — Next 16 changed the `next/image` API.
- **Vitest stays on v3 (`^3.2.7`) in both `backend/` and `self-storage-hosting/`.** A bare `npm install -D vitest` resolves to 5.x, which pulls rolldown and fails to install its native binding on Windows, and whose config loader prints an ESM-in-CommonJS deprecation warning on every run. Verified: 3.2.7 installs in 7s, runs the same tests, and its output is pristine. Always install it as `vitest@^3.2.7`.
- **Never emit these JSON-LD types:** `FAQPage`, `SoftwareApplication`, `Product`, `aggregateRating`, `review`, `SearchAction`, `LocalBusiness`. (Spec §7.2 — FAQ rich results retired 2026-05-07; sitelinks searchbox deprecated 2024-11-21.)
- **Never publish** invented customers, testimonials, logos, case studies or metrics (Spec D2), and **never publish an unverified performance number** — no uptime percentage, latency figure, round-trip time, or site count (Spec D3).
- **Copy rules** (Spec §13), apply to all new and ported copy:
  - "Digi Gate" → **DigiGate** · "StorEdge" → **Storable Edge** · "Easy Storage Solutions" → **Storable Easy** · "SiteLink" → **Sitelink by Storable** · "PMS" → **FMS** · "Stor-Guard" → **StorGuard**
  - OpenTech Alliance is the *company*; the product is **INSOMNIAC® CIA** (® once per page, at first use).
  - Never imply partnership or endorsement with PTI, OpenTech, Storable or Janus.
- **noindex:** `/case-studies`, `/user/login`, `/user/register`.
- **Dark chrome is `--color-primary-700` (`#2c686d`), never `primary-600`.** The controller computed the ratios
  before Task 1: `text-50` on `primary-600` is 3.62:1 and `accent-200` on `primary-600` is 2.84:1 — both fail
  WCAG AA. On `primary-700` the same pairs are 5.79:1 and 4.54:1. `primary-700` is also the `themeColor`.
  Nav, the utility bar and the footer all use it, and Plan 2's pages must use the same pair.
- **Do not** restore a `/* → 200` catch-all in any form.
- **The contact honeypot field is `website`, never a field the form really collects.** Spec §6.5 requires `company` as a real, visible input; naming the trap after it drops a required field and silently 200s any lead a browser autofills. Plan 2's `/demo` reuses the same `ContactForm`.
- **Never publish a security claim beyond TLS** until spec §14 B is answered, and **never publish a per-vendor integration status** until §14 F is answered. `tests/content-policy.test.ts` enforces the first.
- **No `opacity-*` utility on text over the dark chrome.** The contrast test reads raw `--color-*` tokens and cannot see a composited colour.
- The pre-Next Vite sources live at `self-storage-hosting/legacy-vite/`, **not** `src/`. Next 16 treats `src/pages/` as a Pages Router and refuses to build alongside a root `app/`.
- **Dark mode is out of scope** (Spec D13).
- Run `npm run lint` and `npm run build` before every commit that touches `self-storage-hosting/`.

---

### Task 1: Repair the backend auth contract

Independent of the migration. Do it first so the frontend has a working API to target.

**Files:**
- Modify: `backend/index.ts` (whole file — the two `app.listen(PORT, ...)` calls are at lines 22 and 27)
- Modify: `backend/package.json` (add `cors`, `cookie-parser`, test deps + script)
- Modify: `backend/src/models/User.ts` (give `role` a default — see Step 6)
- Modify: `backend/src/middleware/token.ts` (refuse the dev secret in production — see Step 6)
- Modify: `backend/tsconfig.json` (widen `include` so the new test and config are type-checked)
- Create: `backend/src/app.ts`
- Create: `backend/.env.example`
- Test: `backend/tests/app.test.ts`
- Create: `backend/vitest.config.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `createApp(): express.Express` exported from `backend/src/app.ts`. Auth endpoints settle at `POST /api/users/register`, `POST /api/users/login`, `GET /api/users/profile`, `POST /api/users/logout`. All set/read an httpOnly cookie named `token`. Task 14 consumes these paths.

- [ ] **Step 1: Install dependencies**

```bash
cd backend && npm install cors cookie-parser && npm install -D @types/cors @types/cookie-parser vitest supertest @types/supertest
```

- [ ] **Step 2: Add the test script and Vitest config**

In `backend/package.json`, add to `"scripts"`: `"test": "vitest run"`.

In `backend/tsconfig.json`, widen line 11 so the new files are inside the TypeScript program — today it reads `"include": ["index.ts"]`, which leaves `tests/` and `vitest.config.ts` untyped (Vitest strips types with esbuild and never checks them):

```json
  "include": ["index.ts", "src", "tests", "vitest.config.ts"],
```

Create `backend/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
```

- [ ] **Step 3: Write the failing test**

These assertions need no MongoDB connection: `/api/health` short-circuits, `requireAuth` rejects before any DB call, and Mongoose's `validateSync()` runs the schema offline.

Create `backend/tests/app.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";
import { User } from "../src/models/User";

describe("app wiring", () => {
  const app = createApp();

  it("serves the health check under /api", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it("mounts auth routes at /api/users, not /app/auth", async () => {
    const res = await request(app).get("/api/users/profile");
    expect(res.status).toBe(401);
    expect(res.body.code).toBe("NO_TOKEN");
  });

  it("parses cookies so requireAuth can read the token", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Cookie", "token=not-a-real-jwt");
    // Reaching BAD_TOKEN proves req.cookies was populated.
    // Without cookie-parser this would still be NO_TOKEN.
    expect(res.body.code).toBe("BAD_TOKEN");
  });

  it("sends CORS headers that permit credentialed cross-origin requests", async () => {
    const res = await request(app)
      .options("/api/users/login")
      .set("Origin", "http://localhost:3000")
      .set("Access-Control-Request-Method", "POST");
    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
    expect(res.headers["access-control-allow-credentials"]).toBe("true");
  });
});

describe("User model", () => {
  it("defaults role so registration passes schema validation", () => {
    const u = new User({ email: "a@example.com", passwordHash: "x", name: "A" });
    expect(u.role).toBe("user");
    expect(u.validateSync()).toBeUndefined();
  });
});
```

If `requireAuth` in `backend/src/middleware/auth.ts` does not already return the code `BAD_TOKEN` for a malformed token, add that branch — the third test is the only direct evidence that cookie-parser is mounted. (It does already: `backend/src/middleware/auth.ts` returns `NO_TOKEN` when the cookie is absent and `BAD_TOKEN` from the catch.)

The fifth test is the one that matters most. `backend/src/models/User.ts:14` declares `role: { type: String, required: true }` with **no default**, and `backend/src/routes/user.routes.ts:32` calls `User.create({ email, passwordHash, name })` — `role` is never supplied anywhere in the codebase. Every registration therefore fails Mongoose validation and Express 5 forwards the rejection to the error handler, so `POST /api/users/register` answers 500 `{error: "User validation failed: role: Path `role` is required."}`. Registration is 100% broken today and Task 14's mocked tests would never notice.

- [ ] **Step 4: Run the test to verify it fails**

Run: `cd backend && npm test`
Expected: FAIL — `../src/app` does not exist.

- [ ] **Step 5: Create the app factory**

Create `backend/src/app.ts`:

```ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import apiRouter from "./routes";

const ORIGINS = (process.env.CORS_ORIGINS ?? "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

export function createApp() {
  const app = express();

  app.use(cors({ origin: ORIGINS, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.use("/api", apiRouter);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = Number(err?.status) || 500;
    // Client errors carry messages meant for the caller; 5xx messages can leak
    // collection names, index names and field paths, so they are not forwarded.
    console.error(err);
    res.status(status).json({
      error: status < 500 ? err?.message || "Request error" : "Server error",
    });
  });

  return app;
}
```

- [ ] **Step 6: Give `role` a default**

In `backend/src/models/User.ts`, change line 14 to:

```ts
    role: { type: String, required: true, default: "user" },
```

Do not touch anything else in the schema. `required: true` with a `default` is the correct pairing: the field stays non-nullable, and the default satisfies it.

Then fix the second half of the same problem. `backend/src/middleware/token.ts:5` reads:

```ts
const JWT_SECRET: Secret = process.env.JWT_SECRET ?? "dev-secret";
```

Both `signToken` and `verifyToken` use it, so any deploy that forgets `JWT_SECRET` signs and accepts tokens anyone can forge with a string that is now in this repo's history. Keep the convenience in development, refuse it in production:

```ts
const JWT_SECRET: Secret = (() => {
  const fromEnv = process.env.JWT_SECRET;
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be set in production.");
  }
  return "dev-secret";
})();
```

Add a test for it in `backend/tests/app.test.ts` — the module reads the value at load, so reset the registry between cases:

```ts
describe("JWT secret", () => {
  it("refuses to load in production without JWT_SECRET", async () => {
    vi.resetModules();
    const prev = { env: process.env.NODE_ENV, secret: process.env.JWT_SECRET };
    process.env.NODE_ENV = "production";
    delete process.env.JWT_SECRET;
    await expect(import("../src/middleware/token")).rejects.toThrow(/JWT_SECRET/);
    process.env.NODE_ENV = prev.env;
    if (prev.secret) process.env.JWT_SECRET = prev.secret;
  });
});
```

Import `vi` alongside the other Vitest helpers at the top of the file.

- [ ] **Step 7: Rewrite the entrypoint with a single listen**

Replace the entire contents of `backend/index.ts`:

```ts
import "dotenv/config";
import { createApp } from "./src/app";
import { connectDB } from "./src/database/db";

const PORT = Number(process.env.PORT) || 4000;

async function main() {
  await connectDB();
  createApp().listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start API:", err);
  process.exit(1);
});
```

Check the exact export name in `backend/src/database/db.ts` and match it; if it default-exports, adjust the import.

- [ ] **Step 8: Document the backend environment**

The backend has no `.env.example` and `.gitignore` hides `.env`, so nobody can tell what the API needs. Task 1 also just added `CORS_ORIGINS`, and the new entrypoint exits 1 when Mongo is unreachable rather than limping along on the stray `listen` it removes.

Create `backend/.env.example` (values are placeholders — **never commit a real secret**):

```
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=selfstoragehosting
JWT_SECRET=change-me-in-production
CORS_ORIGINS=http://localhost:3000
```

Confirm `.env` is still ignored: `grep -n '^\.env' backend/.gitignore`.

- [ ] **Step 9: Run the tests and the type-checker**

Run: `cd backend && npm test`
Expected: PASS, 7 tests. (Six from this task, plus the 5xx-redaction test the fix round added.)

Run: `cd backend && npx tsc --noEmit`
Expected: no output. The widened `include` from Step 2 means this now covers `src/`, `tests/` and `vitest.config.ts`.

- [ ] **Step 10: Commit**

```bash
git add backend/ && git commit -m "fix(backend): repair auth contract - cors, cookie-parser, single listen"
```

Full message body:

```
- Extract createApp() so the app is testable without a DB connection
- Add cors with credentials:true; the browser calls cross-origin with
  credentials:'include' and was being blocked
- Add cookie-parser; requireAuth reads req.cookies?.token, which was
  always undefined, so /profile returned 401 NO_TOKEN unconditionally
- Remove the duplicate app.listen() that threw EADDRINUSE at boot
- Default User.role to "user"; it was required with no default and never
  supplied by register(), so every registration failed schema validation
- Add backend/.env.example; the env surface was undocumented
- Refuse to boot in production when JWT_SECRET is unset, instead of falling
  back to the literal "dev-secret" that both signs and verifies tokens

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

---

### Task 2: Scaffold Next.js over the Vite app

**Files:**
- Modify: `self-storage-hosting/package.json` (replace deps and scripts)
- Create: `self-storage-hosting/next.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `.env.example`
- Modify: `self-storage-hosting/tsconfig.json`, `self-storage-hosting/eslint.config.js`
- Create: `self-storage-hosting/app/layout.tsx`, `app/page.tsx` (temporary placeholder), `app/globals.css`
- Delete: `self-storage-hosting/vite.config.ts`, `index.html`, `tsconfig.app.json`, `tsconfig.node.json`, `src/vite-env.d.ts`, `src/assets/react.svg`, `public/_redirects`

**Interfaces:**
- Consumes: nothing.
- Produces: a building Next app. `app/globals.css` exports the full Tailwind theme (all `--color-*` tokens). Every later task imports from `@/lib/*` via the `@/*` path alias rooted at `self-storage-hosting/`.

- [ ] **Step 1: Replace package.json**

```json
{
  "name": "self-storage-hosting",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "16.3.5",
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-icons": "5.7.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.33.0",
    "@tailwindcss/postcss": "4.3.3",
    "@types/node": "^24.3.1",
    "@types/react": "^19.1.10",
    "@types/react-dom": "^19.1.7",
    "eslint": "^9.33.0",
    "eslint-config-next": "16.3.5",
    "globals": "^16.3.0",
    "tailwindcss": "4.3.3",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.39.1",
    "vitest": "^3.2.7"
  }
}
```

Then:

```bash
cd self-storage-hosting && rm -rf node_modules package-lock.json && npm install
```

- [ ] **Step 2: Create configs**

`next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
```

`postcss.config.mjs`:

```js
export default {
  plugins: { "@tailwindcss/postcss": {} },
};
```

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

`.env.example`:

```
NEXT_PUBLIC_SITE_URL=https://selfstoragehosting.com
NEXT_PUBLIC_API_BASE=http://localhost:4000
CONTACT_TO_EMAIL=
RESEND_API_KEY=
```

Replace `tsconfig.json` entirely:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`next-env.d.ts` is generated by the first `next dev`/`next build` — do not hand-write it.

- [ ] **Step 3: Port the Tailwind theme**

Copy `src/App.css` **lines 1–125 in full** to `app/globals.css`. Do not truncate: `@theme {` opens at line 3 and its closing `}` is line 125; the commented `.dark` block at lines 63–124 sits *inside* it. The comment is inert and compiles. Do not attempt to activate dark mode (Global Constraints).

Append to `app/globals.css`, after the `@theme` block:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 4: Create a minimal root layout and placeholder page**

`app/layout.tsx` (expanded in Task 7 — this is the minimum that builds):

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Self Storage Hosting",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background-50 text-text-900">{children}</body>
    </html>
  );
}
```

`app/page.tsx`:

```tsx
export default function Page() {
  return <h1 className="text-accent-700">Migration in progress</h1>;
}
```

- [ ] **Step 5: Delete Vite artifacts and move the rest out of the way**

```bash
cd self-storage-hosting && rm -f vite.config.ts index.html tsconfig.app.json tsconfig.node.json src/vite-env.d.ts src/assets/react.svg public/_redirects
```

Then move the remaining Vite tree out of the Next project's reach:

```bash
cd self-storage-hosting && git mv src legacy-vite
```

**This move is mandatory, not tidiness.** Next 16 scans for a Pages Router at both `pages/` and `src/pages/`. With `self-storage-hosting/src/pages/` present and `app/` at the project root, `next build` and `next dev` both abort before compiling anything:

```
Error: > `pages` and `app` directories should be under the same folder
```

Verified by A/B against this repo: moving `src/pages` away clears the error, restoring it brings it back. A tsconfig `exclude` does **not** help — the detection is filesystem-based and runs before TypeScript.

Moving it is still not sufficient on its own. `tsconfig.json`'s `"include": ["**/*.ts", "**/*.tsx", ...]` pulls the legacy tree into the program, and Task 2 has just dropped `react-router-dom` and deleted `src/vite-env.d.ts`, so `next build` then fails its type check with eight errors (`TS2307 Cannot find module 'react-router-dom'` × 4, `TS2339 Property 'VITE_API_BASE' does not exist on type 'ImportMetaEnv'` × 4). Add the directory to `exclude` as well — see Step 5b.

Tasks 8, 12, 13 and 14 read from `legacy-vite/` when they port; Task 17 deletes it.

- [ ] **Step 5b: Exclude the legacy tree from the TypeScript program**

In `self-storage-hosting/tsconfig.json`, change the `exclude` line to:

```json
  "exclude": ["node_modules", "legacy-vite"]
```

- [ ] **Step 6: Update the eslint config**

Replace `eslint.config.js`:

```js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import next from "eslint-config-next";
import { globalIgnores } from "eslint/config";

export default tseslint.config([
  globalIgnores([".next", "node_modules", "legacy-vite"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, tseslint.configs.recommended, next],
    languageOptions: { ecmaVersion: 2022, globals: globals.browser },
  },
]);
```

`legacy-vite` is ignored because it holds the not-yet-ported Vite sources; Task 17 removes both the directory and this ignore entry. The `import next from "eslint-config-next"` shape is verified correct for 16.3.5 — do not substitute another form.

- [ ] **Step 7: Verify the build**

Run: `cd self-storage-hosting && npm run build`
Expected: build succeeds. If it instead says ``> `pages` and `app` directories should be under the same folder``, Step 5's `git mv` did not happen. If it says `Failed to type check` with `react-router-dom` errors, Step 5b did not happen.

Then run `npx tsc --noEmit` — expected: no output. `next build` type-checks, but running tsc directly gives a readable error list when it does not.

Then run `npm run lint` — expected: no errors, and **no `MODULE_TYPELESS_PACKAGE_JSON` warning**; that warning means `"type": "module"` is missing from `package.json`. Then run `npm run dev` and confirm the placeholder `<h1>` renders in **accent teal, not black**. Black means `globals.css` was not imported or was truncated — fix before continuing.

- [ ] **Step 8: Commit**

```bash
git add -A self-storage-hosting/ && git commit -m "build: scaffold Next.js 16 App Router over the Vite app"
```

Full message body:

```
Removes public/_redirects, whose '/* /index.html 200' catch-all returned
HTTP 200 for every unknown URL and shadowed /robots.txt and /sitemap.xml.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

---

### Task 3: Site config and route manifest

The route manifest is the single source of truth for navigation, the sitemap, and link integrity.

**Files:**
- Create: `self-storage-hosting/lib/site.ts`
- Test: `self-storage-hosting/tests/links.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `SITE: { url, name, description, locale, social: string[], contactEmail: string }`
  - `ROUTES: Record<string, { title: string; indexable: boolean; built: boolean }>`
  - `NON_ROUTE_PATHS: string[]`
  - `NAV: { utility: NavLink[]; main: NavItem[] }` where `NavLink = { href: string; label: string }` and `NavItem = NavLink & { children?: NavLink[] }`
  - `FOOTER: { heading: string; links: NavLink[] }[]`
  - `indexableRoutes(): string[]`

`SITE` → Tasks 4, 5, 6, 7 and 9. `ROUTES` → this task's test and Task 6's test. `indexableRoutes` → Task 6. `NAV` → Task 8. `FOOTER` and `NON_ROUTE_PATHS` → Task 9.

- [ ] **Step 1: Write the failing test**

Create `tests/links.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { ROUTES, NAV, FOOTER, indexableRoutes, SITE, NON_ROUTE_PATHS } from "@/lib/site";

function internalHrefs(): string[] {
  const out: string[] = [];
  for (const l of NAV.utility) out.push(l.href);
  for (const item of NAV.main) {
    out.push(item.href);
    for (const c of item.children ?? []) out.push(c.href);
  }
  for (const col of FOOTER) for (const l of col.links) out.push(l.href);
  return out;
}

describe("link integrity", () => {
  it("every internal nav and footer link resolves to a real route", () => {
    const bad = internalHrefs()
      .filter((h) => h.startsWith("/"))
      .map((h) => h.split("#")[0])
      .filter((h) => !NON_ROUTE_PATHS.includes(h))
      .filter((h) => !(h in ROUTES));
    expect(bad).toEqual([]);
  });

  it("has no placeholder '#' links", () => {
    expect(internalHrefs().filter((h) => h === "#" || h.startsWith("#"))).toEqual([]);
  });

  // Every other case here is filter-then-expect-[], which also passes when
  // NAV and FOOTER are empty. This is the case that fails on a truncated
  // lib/site.ts.
  it("actually has links to check", () => {
    expect(internalHrefs().length).toBeGreaterThanOrEqual(18);
    expect(FOOTER.map((c) => c.heading)).toEqual([
      "Solutions",
      "Resources",
      "Company",
      "Legal",
    ]);
  });

  it("exposes /contact, which four live links point at", () => {
    expect(ROUTES).toHaveProperty("/contact");
  });

  it("excludes noindex routes from indexableRoutes", () => {
    for (const r of ["/case-studies", "/user/login", "/user/register"]) {
      expect(indexableRoutes()).not.toContain(r);
    }
  });

  it("uses an absolute site url with no trailing slash", () => {
    expect(SITE.url).toMatch(/^https:\/\//);
    expect(SITE.url.endsWith("/")).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd self-storage-hosting && npm test`
Expected: FAIL — cannot resolve `@/lib/site`.

- [ ] **Step 3: Implement lib/site.ts**

Routes not yet built are still listed here — Plan 2 creates their pages. Listing them is what lets nav render the site's full shape, and the link-integrity test only checks that nav targets exist in `ROUTES`, not that they exist on disk. The sitemap does **not** emit them, because `indexableRoutes()` also requires `built`. So a preview deploy is safe to crawl, but **nav links to Plan 2's pages 404 until Plan 2 lands — do not merge to `main` before then.**

```ts
export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://selfstoragehosting.com",
  name: "Self Storage Hosting",
  description:
    "Cloud-hosted access control and facility websites for independent self-storage operators.",
  locale: "en_US",

  // Spec §14 B and C: real social profile URLs and business contact details
  // are owner inputs that do not exist yet. Keep these empty until supplied —
  // organizationSchema() omits sameAs and contactPoint when they are, which is
  // correct. A placeholder email or an invented profile URL would be worse
  // than the omission, and inviting Google to crawl a dead profile is worst.
  social: [] as string[],
  contactEmail: "",
};

export type NavLink = { href: string; label: string };
export type NavItem = NavLink & { children?: NavLink[] };

// `indexable` is an SEO decision: may this URL be crawled and listed.
// `built`    is a fact: does a page.tsx for it exist yet.
// They are independent, and the sitemap needs BOTH. Nav renders from this
// table in full so the site's shape is visible, but Plan 1 only builds three
// pages -- advertising the other fourteen in sitemap.xml would hand Google a
// list of URLs that 404. Plan 2 flips each `built` to true as it lands.
export const ROUTES: Record<string, { title: string; indexable: boolean; built: boolean }> = {
  "/": { title: "Home", indexable: true, built: true },
  "/about-us": { title: "About Us", indexable: true, built: true },
  "/contact": { title: "Contact", indexable: true, built: true },

  // Plan 2 builds everything below. Flip `built` in the same commit that
  // creates the page, never before.
  "/solutions": { title: "Solutions", indexable: true, built: false },
  "/solutions/access-control-hosting": { title: "Cloud Self-Storage Access Control", indexable: true, built: false },
  "/solutions/web-hosting": { title: "Self-Storage Facility Websites", indexable: true, built: false },
  "/resources": { title: "Resources", indexable: true, built: false },
  "/events": { title: "Industry Events", indexable: true, built: false },
  "/support": { title: "Support & Diagnostics", indexable: true, built: false },
  "/demo": { title: "Request a Demo", indexable: true, built: false },
  "/legal/privacy": { title: "Privacy Policy", indexable: true, built: false },
  "/legal/terms": { title: "Terms of Service", indexable: true, built: false },
  "/legal/trademarks": { title: "Trademarks", indexable: true, built: false },
  "/legal/accessibility": { title: "Accessibility Statement", indexable: true, built: false },
  "/case-studies": { title: "Case Studies", indexable: false, built: false },
  "/user/login": { title: "Log In", indexable: false, built: false },
  "/user/register": { title: "Create an Account", indexable: false, built: false },
};

// Paths that appear in FOOTER but are not app pages. Task 9 renders these as
// a plain <a>, and the link-integrity test skips them when checking ROUTES.
export const NON_ROUTE_PATHS = ["/sitemap.xml"];

export const NAV: { utility: NavLink[]; main: NavItem[] } = {
  utility: [
    { href: "/demo", label: "Request a Demo" },
    { href: "/support", label: "Support" },
    { href: "/user/login", label: "Login" },
  ],
  main: [
    {
      href: "/solutions",
      label: "Solutions",
      children: [
        { href: "/solutions/access-control-hosting", label: "Access Control Hosting" },
        { href: "/solutions/web-hosting", label: "Facility Websites" },
      ],
    },
    { href: "/resources", label: "Resources" },
    { href: "/about-us", label: "About Us" },
  ],
};

export const FOOTER: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Solutions",
    links: [
      { href: "/solutions/access-control-hosting", label: "Access Control Hosting" },
      { href: "/solutions/web-hosting", label: "Facility Websites" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/resources", label: "Guides" },
      { href: "/events", label: "Events" },
      { href: "/support", label: "Support" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about-us#story", label: "Our Story" },
      { href: "/about-us#careers", label: "Careers" },
      { href: "/about-us#news", label: "News" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/legal/privacy", label: "Privacy Policy" },
      { href: "/legal/terms", label: "Terms" },
      { href: "/legal/trademarks", label: "Trademarks" },
      { href: "/legal/accessibility", label: "Accessibility" },
      { href: "/sitemap.xml", label: "Sitemap" },
    ],
  },
];

export function indexableRoutes(): string[] {
  return Object.entries(ROUTES)
    .filter(([, meta]) => meta.indexable && meta.built)
    .map(([path]) => path);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add self-storage-hosting/lib/site.ts self-storage-hosting/tests/links.test.ts && git commit -m "feat(seo): add route manifest with link-integrity tests"
```

Full message body:

```
Nav and footer render from this data, so a dead internal link is now a
failing test rather than a live 404. Adds the /contact route that four
links in the current build point at.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

---

### Task 4: Metadata helper

**Files:**
- Create: `self-storage-hosting/lib/seo.ts`
- Test: `self-storage-hosting/tests/seo.test.ts`

**Interfaces:**
- Consumes: `SITE` and `ROUTES` from `@/lib/site`.
- Produces: `canonicalFor(path: string): string` and `pageMeta(opts: PageMetaOpts): Metadata` where

```ts
type PageMetaOpts = {
  title: string;        // WITHOUT the brand suffix — the layout template appends it
  description: string;
  path: string;         // e.g. "/contact"; must start with "/"
  ogType?: "website" | "article";
  noindex?: boolean;    // omit to inherit ROUTES[path].indexable
  image?: string;
};
```

Every page in Plans 1–3 calls this. Task 5 and Task 6 import `canonicalFor`.

- [ ] **Step 1: Write the failing test**

The first test is the regression guard for the double-suffix bug: the root layout sets `title.template = "%s | Self Storage Hosting"`, so a page title that already contains the brand renders it twice.

Create `tests/seo.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/site";

describe("pageMeta", () => {
  it("never includes the brand in the title, since the template appends it", () => {
    const m = pageMeta({ title: "Contact", description: "d", path: "/contact" });
    expect(m.title).toBe("Contact");
    expect(String(m.title)).not.toContain(SITE.name);
  });

  it("builds an absolute canonical with no trailing slash", () => {
    const m = pageMeta({ title: "Contact", description: "d", path: "/contact" });
    expect(m.alternates?.canonical).toBe(`${SITE.url}/contact`);
  });

  it("maps the site root to the bare origin", () => {
    const m = pageMeta({ title: "Home", description: "d", path: "/" });
    expect(m.alternates?.canonical).toBe(SITE.url);
  });

  // `Metadata["openGraph"]` is a 13-member union and its OpenGraphMetadata
  // member has no `type` property, so `.openGraph?.type` is TS2339 under
  // next@16.3.5. Vitest would pass it anyway (it strips types); `next build`
  // type-checks tests/ and would fail. toMatchObject compiles and asserts the
  // same thing.
  it("defaults og:type to website but allows article", () => {
    expect(
      pageMeta({ title: "a", description: "d", path: "/a" }).openGraph
    ).toMatchObject({ type: "website" });
    expect(
      pageMeta({ title: "a", description: "d", path: "/a", ogType: "article" }).openGraph
    ).toMatchObject({ type: "article" });
  });

  it("emits noindex, nofollow when asked", () => {
    const m = pageMeta({ title: "Log In", description: "d", path: "/user/login", noindex: true });
    expect(m.robots).toMatchObject({ index: false, follow: false });
  });

  // Spec §7.1 names three noindex routes. ROUTES already flags them; without
  // this default, Plan 2 can ship /user/login indexable and every Plan 1 test
  // still passes. Plan 1 owns both modules, so Plan 1 owns the enforcement.
  it("defaults noindex from the route manifest", () => {
    for (const path of ["/case-studies", "/user/login", "/user/register"]) {
      const m = pageMeta({ title: "t", description: "d", path });
      expect(m.robots).toMatchObject({ index: false, follow: false });
    }
    expect(
      pageMeta({ title: "t", description: "d", path: "/about-us" }).robots
    ).toMatchObject({ index: true, follow: true });
  });

  it("is indexable by default", () => {
    const m = pageMeta({ title: "Contact", description: "d", path: "/contact" });
    expect(m.robots).toMatchObject({ index: true, follow: true });
  });

  it("rejects a path that does not start with a slash", () => {
    expect(() => pageMeta({ title: "a", description: "d", path: "contact" })).toThrow();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `@/lib/seo`.

- [ ] **Step 3: Implement lib/seo.ts**

```ts
import type { Metadata } from "next";
import { SITE, ROUTES } from "./site";

export type PageMetaOpts = {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  noindex?: boolean;
  image?: string;
};

export function canonicalFor(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`canonicalFor: path must start with "/", received "${path}"`);
  }
  // A canonical URL identifies the page, so a fragment never belongs in one and
  // a query string almost never does. Throwing surfaces the author error at
  // build time instead of shipping a canonical that splits the page's signals.
  if (/[?#]/.test(path)) {
    throw new Error(
      `canonicalFor: path must not carry a query or fragment, received "${path}"`
    );
  }
  if (path === "/") return SITE.url;
  return `${SITE.url}${path.replace(/\/$/, "")}`;
}

export function pageMeta(opts: PageMetaOpts): Metadata {
  const { title, description, path, ogType = "website", image } = opts;
  // Default from the route manifest so a page cannot ship indexable when
  // ROUTES says otherwise; an explicit `noindex` still wins.
  const noindex = opts.noindex ?? ROUTES[path]?.indexable === false;
  const url = canonicalFor(path);
  const images = image ? [{ url: image }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: !noindex, follow: !noindex },
    openGraph: {
      type: ogType,
      url,
      siteName: SITE.name,
      title,
      description,
      locale: SITE.locale,
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, 14 tests across both files — 8 new in `seo.test.ts`, plus the 6 from Task 3.

- [ ] **Step 5: Commit**

```bash
git add self-storage-hosting/lib/seo.ts self-storage-hosting/tests/seo.test.ts && git commit -m "feat(seo): add pageMeta helper with canonical and og:type support"
```

Full message body:

```
Guards against double-appending the brand suffix and against a hardcoded
og:type that would ship articles as og:type=website.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

---

### Task 5: JSON-LD builders with a forbidden-type guard

**Files:**
- Create: `self-storage-hosting/lib/schema.ts`, `self-storage-hosting/components/JsonLd.tsx`
- Test: `self-storage-hosting/tests/schema.test.ts`

**Interfaces:**
- Consumes: `SITE` from `@/lib/site`, `canonicalFor` from `@/lib/seo`.
- Produces:
  - `organizationSchema(): object`
  - `webSiteSchema(): object`
  - `breadcrumbSchema(crumbs: { name: string; path: string }[]): object`
  - `articleSchema(a: { headline: string; description: string; path: string; datePublished: string; dateModified?: string }): object`
  - `eventSchema(e: { name: string; startDate: string; endDate?: string; locationName: string; locationAddress: string; url: string }): object`
  - `FORBIDDEN_SCHEMA_TYPES: readonly string[]`
  - `assertNoForbiddenTypes(node: unknown): void`
  - `<JsonLd data={...} />` React component (default export)

Plan 2 (`/events`) and Plan 3 (articles) consume these.

- [ ] **Step 1: Write the failing test**

Create `tests/schema.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  organizationSchema,
  webSiteSchema,
  breadcrumbSchema,
  articleSchema,
  eventSchema,
  assertNoForbiddenTypes,
  FORBIDDEN_SCHEMA_TYPES,
} from "@/lib/schema";
import { SITE } from "@/lib/site";

describe("schema builders", () => {
  it("emits Organization with absolute url and logo", () => {
    const s = organizationSchema() as any;
    expect(s["@type"]).toBe("Organization");
    expect(s.url).toBe(SITE.url);
    expect(String(s.logo)).toMatch(/^https:\/\//);
  });

  it("omits sameAs and contactPoint while the owner facts are outstanding", () => {
    const s = organizationSchema() as any;
    // These appear only once SITE.social / SITE.contactEmail are populated.
    // An empty sameAs array or a contactPoint with no address is invalid.
    expect("sameAs" in s).toBe(false);
    expect("contactPoint" in s).toBe(false);
  });

  it("emits WebSite with name and url only, never a SearchAction", () => {
    const s = webSiteSchema() as any;
    expect(s["@type"]).toBe("WebSite");
    expect(s.potentialAction).toBeUndefined();
  });

  it("numbers breadcrumb positions from 1 and uses absolute item urls", () => {
    const s = breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Solutions", path: "/solutions" },
    ]) as any;
    expect(s.itemListElement[0].position).toBe(1);
    expect(s.itemListElement[1].item).toBe(`${SITE.url}/solutions`);
  });

  it("defaults dateModified to datePublished", () => {
    const s = articleSchema({
      headline: "h",
      description: "d",
      path: "/resources/x",
      datePublished: "2026-09-18",
    }) as any;
    expect(s.dateModified).toBe("2026-09-18");
  });

  it("emits Event with a place location", () => {
    const s = eventSchema({
      name: "SSAA Convention",
      startDate: "2026-11-10",
      endDate: "2026-11-12",
      locationName: "The Star Grand Gold Coast",
      locationAddress: "Broadbeach, QLD, Australia",
      url: "https://www.selfstorage.org.au/",
    }) as any;
    expect(s["@type"]).toBe("Event");
    expect(s.location["@type"]).toBe("Place");
  });
});

describe("forbidden schema guard", () => {
  it("lists every retired or unearned type", () => {
    expect(FORBIDDEN_SCHEMA_TYPES).toEqual(
      expect.arrayContaining([
        "FAQPage",
        "SoftwareApplication",
        "Product",
        "AggregateRating",
        "Review",
        "SearchAction",
        "LocalBusiness",
      ])
    );
  });

  it("throws on a forbidden type nested anywhere", () => {
    expect(() => assertNoForbiddenTypes({ a: { b: [{ "@type": "FAQPage" }] } })).toThrow(/FAQPage/);
  });

  it("throws on an aggregateRating property even without an @type", () => {
    expect(() =>
      assertNoForbiddenTypes({ "@type": "Organization", aggregateRating: { ratingValue: 5 } })
    ).toThrow(/aggregateRating/);
  });

  it("passes every schema this site actually emits", () => {
    expect(() => assertNoForbiddenTypes(organizationSchema())).not.toThrow();
    expect(() => assertNoForbiddenTypes(webSiteSchema())).not.toThrow();
    expect(() => assertNoForbiddenTypes(breadcrumbSchema([{ name: "Home", path: "/" }]))).not.toThrow();
    expect(() =>
      assertNoForbiddenTypes(
        articleSchema({ headline: "h", description: "d", path: "/resources/x", datePublished: "2026-09-18" })
      )
    ).not.toThrow();
    expect(() =>
      assertNoForbiddenTypes(
        eventSchema({
          name: "n",
          startDate: "2026-11-10",
          locationName: "l",
          locationAddress: "a",
          url: "https://example.org/",
        })
      )
    ).not.toThrow();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `@/lib/schema`.

- [ ] **Step 3: Implement lib/schema.ts**

Note `FORBIDDEN_PROPS` deliberately omits `potentialAction` as a blanket ban — it bans only `SearchAction` by type — and omits `offers`, because a future page might legitimately need neither. Keep the list to what the spec forbids.

```ts
import { SITE } from "./site";
import { canonicalFor } from "./seo";

export const FORBIDDEN_SCHEMA_TYPES = [
  "FAQPage",
  "SoftwareApplication",
  "Product",
  "AggregateRating",
  "Review",
  "SearchAction",
  "LocalBusiness",
] as const;

const FORBIDDEN_PROPS = ["aggregateRating", "review", "reviews"];
const FORBIDDEN_LOWER = new Set(
  FORBIDDEN_SCHEMA_TYPES.map((t) => t.toLowerCase())
);

export function assertNoForbiddenTypes(node: unknown): void {
  const walk = (n: unknown, path: string): void => {
    if (Array.isArray(n)) {
      n.forEach((v, i) => walk(v, `${path}[${i}]`));
      return;
    }
    if (n === null || typeof n !== "object") return;

    for (const [key, value] of Object.entries(n as Record<string, unknown>)) {
      if (key === "@type") {
        const types = Array.isArray(value) ? value : [value];
        for (const t of types) {
          // Case-insensitive on purpose. Every @type this file emits today is
          // a hardcoded literal, but Plan 3 folds article and event data in
          // from outside, and "faqpage" must not slip past the one guard.
          if (FORBIDDEN_LOWER.has(String(t).toLowerCase())) {
            throw new Error(
              `Forbidden JSON-LD type "${t}" at ${path}. See spec section 7.2 — this type no longer earns a rich result, or requires data we do not have.`
            );
          }
        }
      }
      if (FORBIDDEN_PROPS.includes(key)) {
        throw new Error(`Forbidden JSON-LD property "${key}" at ${path}. See spec section 7.2.`);
      }
      walk(value, `${path}.${key}`);
    }
  };
  walk(node, "$");
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/Logo.png`,
    description: SITE.description,
    // Spec 7.2 calls for sameAs and contactPoint. Both are omitted rather than
    // stubbed while the owner facts are outstanding: an empty sameAs array and
    // a contactPoint with no reachable address are invalid structured data.
    ...(SITE.social.length > 0 ? { sameAs: SITE.social } : {}),
    ...(SITE.contactEmail
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            email: SITE.contactEmail,
            availableLanguage: "English",
          },
        }
      : {}),
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
  };
}

export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: canonicalFor(c.path),
    })),
  };
}

export function articleSchema(a: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.headline,
    description: a.description,
    mainEntityOfPage: canonicalFor(a.path),
    datePublished: a.datePublished,
    dateModified: a.dateModified ?? a.datePublished,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}/Logo.png` },
    },
  };
}

export function eventSchema(e: {
  name: string;
  startDate: string;
  endDate?: string;
  locationName: string;
  locationAddress: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.name,
    startDate: e.startDate,
    endDate: e.endDate ?? e.startDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: e.locationName,
      address: e.locationAddress,
    },
    url: e.url,
  };
}
```

- [ ] **Step 4: Implement the JsonLd component**

`components/JsonLd.tsx` — a server component. It validates before rendering, so a forbidden type fails the build rather than shipping.

```tsx
import { assertNoForbiddenTypes } from "@/lib/schema";

export default function JsonLd({ data }: { data: object }) {
  assertNoForbiddenTypes(data);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
```

The `<` escape prevents a `</script>` sequence in any string value from breaking out of the tag.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add self-storage-hosting/lib/schema.ts self-storage-hosting/components/JsonLd.tsx self-storage-hosting/tests/schema.test.ts && git commit -m "feat(seo): add JSON-LD builders with a forbidden-type guard"
```

Full message body:

```
Emits Organization, WebSite, BreadcrumbList, Article and Event. Build
fails on FAQPage (rich results retired 2026-05-07), SearchAction
(deprecated 2024-11-21), and on Product/SoftwareApplication/
aggregateRating, which require review data we do not have.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

---

### Task 6: robots.ts and sitemap.ts

**Files:**
- Create: `self-storage-hosting/app/robots.ts`, `self-storage-hosting/app/sitemap.ts`
- Test: `self-storage-hosting/tests/routing.test.ts`

**Interfaces:**
- Consumes: `SITE` from `@/lib/site` (robots); `indexableRoutes` from `@/lib/site` and `canonicalFor` from `@/lib/seo` (sitemap). The test additionally imports `ROUTES` to assert the counts match.
- Produces: default-exported `robots()` and `sitemap()` functions matching Next's `MetadataRoute.Robots` and `MetadataRoute.Sitemap`.

- [ ] **Step 1: Write the failing test**

Create `tests/routing.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { SITE, ROUTES } from "@/lib/site";

describe("robots", () => {
  const r = robots();

  it("points at the absolute sitemap url", () => {
    expect(r.sitemap).toBe(`${SITE.url}/sitemap.xml`);
  });

  it("disallows private and noindex areas", () => {
    const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules;
    const disallow = (rule.disallow ?? []) as string[];
    for (const p of ["/user/", "/api/", "/case-studies"]) {
      expect(disallow).toContain(p);
    }
  });
});

describe("sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);

  it("contains every indexable route as an absolute url", () => {
    expect(urls).toContain(SITE.url);
    expect(urls).toContain(`${SITE.url}/contact`);
  });

  it("excludes every noindex route", () => {
    for (const p of ["/case-studies", "/user/login", "/user/register"]) {
      expect(urls).not.toContain(`${SITE.url}${p}`);
    }
  });

  it("has no trailing slashes and no duplicates", () => {
    for (const u of urls) expect(u.endsWith("/")).toBe(false);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("omits changeFrequency and priority, which Google ignores", () => {
    for (const e of entries) {
      expect(e).not.toHaveProperty("changeFrequency");
      expect(e).not.toHaveProperty("priority");
    }
  });

  it("covers exactly the indexable routes in the manifest", () => {
    const expected = Object.entries(ROUTES).filter(([, m]) => m.indexable && m.built).length;
    expect(urls.length).toBe(expected);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `@/app/robots`.

- [ ] **Step 3: Implement app/robots.ts**

```ts
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/user/", "/api/", "/case-studies"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
```

- [ ] **Step 4: Implement app/sitemap.ts**

`lastModified` uses build time. That is honest for a statically built marketing site: the page really was regenerated then. Plan 3 overrides it per-article with real publication dates.

```ts
import type { MetadataRoute } from "next";
import { indexableRoutes } from "@/lib/site";
import { canonicalFor } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return indexableRoutes().map((path) => ({
    url: canonicalFor(path),
    lastModified,
  }));
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Verify the real output**

Run `npm run build && npm start`, then:

```bash
curl -sI http://localhost:3000/robots.txt | head -3
```

```bash
curl -sI http://localhost:3000/sitemap.xml | head -3
```

```bash
curl -sI http://localhost:3000/definitely-not-a-real-page | head -1
```

Expected: `text/plain` for robots, `application/xml` for sitemap, and **`HTTP/1.1 404`** for the unknown path. The 404 is the specific defect this migration exists to fix — do not proceed if it returns 200.

- [ ] **Step 7: Commit**

```bash
git add self-storage-hosting/app/robots.ts self-storage-hosting/app/sitemap.ts self-storage-hosting/tests/routing.test.ts && git commit -m "feat(seo): add robots.ts and sitemap.ts"
```

Full message body:

```
Both were previously unreachable: the SPA catch-all served the app shell
as text/html at 200 for /robots.txt and /sitemap.xml alike.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

---

### Task 7: Root layout with fonts, metadata and site-wide JSON-LD

**Files:**
- Modify: `self-storage-hosting/app/layout.tsx`, `self-storage-hosting/app/globals.css`

**Interfaces:**
- Consumes: `SITE` from `@/lib/site`, `organizationSchema`/`webSiteSchema` from `@/lib/schema`, `JsonLd` from `@/components/JsonLd`.
- Produces: `metadata` with `metadataBase` and `title.template`; `generateViewport`. Every page's `pageMeta` title composes against this template.

- [ ] **Step 1: Replace app/layout.tsx**

```tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SITE } from "@/lib/site";
import { organizationSchema, webSiteSchema } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Cloud Access Control`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  alternates: { canonical: SITE.url },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE.url,
  },
  twitter: { card: "summary_large_image" },
};

export function generateViewport(): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    themeColor: "#2c686d",
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background-50 text-text-900 font-sans antialiased">
        {children}
        <JsonLd data={organizationSchema()} />
        <JsonLd data={webSiteSchema()} />
      </body>
    </html>
  );
}
```

`generateViewport` replaces the `<meta name="viewport">` that lived in the deleted `index.html`. Deleting that file without this export is how a migration ships a desktop-only site to phones.

`#2c686d` is `--color-primary-700`, the same shade the nav and footer use (see Global Constraints). Confirm it in `app/globals.css` before trusting it.

- [ ] **Step 2: Wire the font into the Tailwind theme**

In `app/globals.css`, inside the `@theme` block (before its closing `}`), add:

```css
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
```

The variable names must differ (`--font-inter` from `next/font`, `--font-sans` for the Tailwind utility) or the definition is self-referential and resolves to nothing.

- [ ] **Step 3: Verify**

Run: `npm run build`, then `npm start` and:

```bash
curl -s http://localhost:3000/ | grep -c 'application/ld+json'
```

Expected: build succeeds; the count is `2`.

- [ ] **Step 4: Commit**

```bash
git add self-storage-hosting/app/layout.tsx self-storage-hosting/app/globals.css && git commit -m "feat(seo): root layout with metadataBase, title template and JSON-LD"
```

Full message body:

```
Adds generateViewport to replace the viewport meta tag lost with
index.html, and site-wide Organization and WebSite schema.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

---

### Task 8: Navigation with a working mobile menu

The current site has no mobile navigation at all and uses `<a href>`, which hard-reloads the SPA on every click.

**Files:**
- Create: `self-storage-hosting/components/nav/TopBar.tsx` (server), `self-storage-hosting/components/nav/MainNav.tsx` (client)
- Modify: `self-storage-hosting/public/Logo.png`
- Reference (do not edit): `self-storage-hosting/legacy-vite/components/SmallNavbar.tsx`, `legacy-vite/components/LargeNavbar.tsx`

**Interfaces:**
- Consumes: `NAV` from `@/lib/site`.
- Produces: `<TopBar />` and `<MainNav />`, both default exports. Task 10 mounts them.

- [ ] **Step 1: Shrink the logo**

`Logo.png` is 1.12 MB and renders at 48px. Convert it once:

```bash
cd self-storage-hosting/public && npx --yes sharp-cli -i Logo.png -o Logo.png resize 192 --withoutEnlargement && ls -la Logo.png
```

Expected: well under 50 KB. If `sharp-cli` is unavailable, any tool producing a 192px-wide PNG is fine.

- [ ] **Step 2: Create TopBar**

```tsx
import Link from "next/link";
import { NAV } from "@/lib/site";

export default function TopBar() {
  return (
    <div className="w-full border-b border-background-500 bg-primary-700 text-text-50">
      <nav
        aria-label="Utility"
        className="mx-auto flex h-7 max-w-7xl items-center justify-end px-4 text-xs sm:px-6"
      >
        {NAV.utility.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex h-full items-center px-3 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-200"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
```

- [ ] **Step 3: Create MainNav**

Three fixes over the current navbar: a real mobile menu, responsive padding replacing the fixed `px-30` (120px) gutter, and a caret only where a dropdown actually exists — the current navbar shows carets on three links, none of which has one.

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IoMdArrowDropdown } from "react-icons/io";
import { HiMenu, HiX } from "react-icons/hi";
import { NAV } from "@/lib/site";

export default function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-background-500 bg-primary-700 text-text-50">
      <nav
        aria-label="Main"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6"
      >
        <Link href="/" className="flex items-center gap-2">
          <Image src="/Logo.png" alt="" width={48} height={48} className="h-12 w-auto" />
          <span className="text-lg font-medium">Self Storage Hosting</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center md:flex">
          {NAV.main.map((item) =>
            item.children ? (
              <div key={item.href} className="relative" onMouseLeave={() => setOpenMenu(null)}>
                <button
                  type="button"
                  aria-expanded={openMenu === item.href}
                  aria-controls={`menu-${item.href.replace(/\//g, "-")}`}
                  onClick={() => setOpenMenu(openMenu === item.href ? null : item.href)}
                  onMouseEnter={() => setOpenMenu(item.href)}
                  className="flex h-20 items-center gap-1 px-3 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-200"
                >
                  {item.label}
                  <IoMdArrowDropdown aria-hidden="true" className="text-accent-200" />
                </button>
                <div
                  id={`menu-${item.href.replace(/\//g, "-")}`}
                  hidden={openMenu !== item.href}
                  className="absolute left-0 top-20 z-20 min-w-56 rounded-b-lg bg-primary-700 py-2 shadow-lg"
                >
                  <Link
                    href={item.href}
                    className="block px-4 py-2 font-medium hover:bg-primary-800"
                    onClick={() => setOpenMenu(null)}
                  >
                    All {item.label}
                  </Link>
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="block px-4 py-2 hover:bg-primary-800"
                      onClick={() => setOpenMenu(null)}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className="flex h-20 items-center px-3 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-200"
              >
                {item.label}
              </Link>
            )
          )}
          <Link
            href="/contact"
            className="ml-4 rounded-full bg-accent-50 px-4 py-2 font-medium text-text-950 hover:bg-accent-200"
          >
            Talk to Sales
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="p-2 md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <HiX aria-hidden="true" className="text-2xl" />
          ) : (
            <HiMenu aria-hidden="true" className="text-2xl" />
          )}
        </button>
      </nav>

      {/* Mobile panel */}
      <div id="mobile-menu" hidden={!mobileOpen} className="border-t border-primary-500 md:hidden">
        <ul className="px-4 py-2">
          {NAV.main.map((item) => (
            <li key={item.href} className="py-1">
              <Link href={item.href} className="block py-2 font-medium" onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
              {item.children && (
                <ul className="ml-4 border-l border-primary-500 pl-4">
                  {item.children.map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li className="py-3">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-accent-50 px-4 py-2 font-medium text-text-950"
              onClick={() => setMobileOpen(false)}
            >
              Talk to Sales
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
```

The dropdown includes an "All Solutions" entry so `/solutions` stays reachable on desktop, where the parent is a button rather than a link.

- [ ] **Step 4: Verify manually**

Run `npm run dev`. At 375px width: the hamburger appears, opens, links work, and the panel closes on navigation. Tab through the desktop nav and confirm every control shows a visible focus ring.

- [ ] **Step 5: Commit**

```bash
git add self-storage-hosting/components/nav/ self-storage-hosting/public/Logo.png && git commit -m "feat(nav): add responsive navigation with a mobile menu"
```

Full message body:

```
The previous navbar had no mobile menu, a fixed 120px gutter, plain
<a href> that hard-reloaded the SPA, and dropdown carets on three links
of which none had a dropdown. Shrinks Logo.png from 1.12MB to a 192px
asset; it renders at 48px.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

---

### Task 9: Footer with no dead links

**Files:**
- Create: `self-storage-hosting/components/Footer.tsx`
- Reference (do not edit): `self-storage-hosting/legacy-vite/components/Footer.tsx`

**Interfaces:**
- Consumes: `FOOTER`, `SITE`, `NON_ROUTE_PATHS` from `@/lib/site`.
- Produces: `<Footer />` default export, consumed by Task 10.

- [ ] **Step 1: Create the component**

Every link comes from `FOOTER`, which Task 3's test already proves resolves to a real route. The current footer's four `to="#"` links cannot recur, because the test rejects any href starting with `#`.

Social links are omitted entirely rather than pointing at the current `href="#twitter"` placeholders — add them in Plan 2 once real profile URLs exist (spec §14 C).

Two details that are easy to get wrong:

- `/sitemap.xml` is in `FOOTER` but it is not an app page — it is generated by `app/sitemap.ts`. `next/link` viewport-prefetches its target as an RSC payload and then has to fall back to a full document load, so render anything in `NON_ROUTE_PATHS` as a plain `<a>`.
- **No `opacity-*` utility on chrome text.** The contrast test reads raw `--color-*` tokens out of `globals.css` and cannot see a composited colour, so `text-xs opacity-70` on `primary-700` ships at 3.74:1 with a green suite. Use a full-opacity token.

```tsx
import Link from "next/link";
import { FOOTER, SITE, NON_ROUTE_PATHS } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 bg-primary-700 text-text-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav aria-label="Footer" className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER.map((col) => (
            <div key={col.heading}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-200">
                {col.heading}
              </h2>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => {
                  const cls =
                    "text-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-200";
                  return (
                    <li key={l.href}>
                      {NON_ROUTE_PATHS.includes(l.href) ? (
                        <a href={l.href} className={cls}>
                          {l.label}
                        </a>
                      ) : (
                        <Link href={l.href} className={cls}>
                          {l.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="space-y-2 border-t border-white/10 py-6">
          <p className="text-xs text-accent-200">
            {year} © {SITE.name}. All rights reserved.
          </p>
          <p className="text-xs text-accent-200">
            All third-party product names and marks are the property of their
            owners. No affiliation or endorsement is implied.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm test && npm run build`
Expected: PASS and a successful build.

- [ ] **Step 3: Commit**

```bash
git add self-storage-hosting/components/Footer.tsx && git commit -m "feat(footer): rebuild footer from route data"
```

Full message body:

```
Resolves the four dead to='#' links (Security, Privacy Policy, Sitemap,
Accessibility Statement). Social icons omitted until real profile URLs
exist rather than shipping href='#twitter' placeholders.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

---

### Task 10: Marketing layout, skip link, and 404

**Files:**
- Create: `self-storage-hosting/app/(marketing)/layout.tsx`, `self-storage-hosting/app/not-found.tsx`
- Move: `app/page.tsx` → `app/(marketing)/page.tsx`
- Reference (do not edit): `self-storage-hosting/legacy-vite/pages/NotFoundPage.tsx`

**Interfaces:**
- Consumes: `TopBar`, `MainNav`, `Footer`.
- Produces: the `(marketing)` route group. Every page in Plans 2 and 3 lives under it.

- [ ] **Step 1: Create the marketing layout**

```tsx
import TopBar from "@/components/nav/TopBar";
import MainNav from "@/components/nav/MainNav";
import Footer from "@/components/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
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
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Move the placeholder page into the group**

```bash
cd self-storage-hosting && mkdir -p "app/(marketing)" && git mv app/page.tsx "app/(marketing)/page.tsx"
```

- [ ] **Step 3: Create not-found.tsx**

Port the existing copy verbatim — it already exists and reads well.

`not-found.tsx` sits at `app/`, outside the `(marketing)` group, so it does **not** get the layout's skip link or `<main id="main">`. Reproduce both here, or a keyboard user hitting a 404 has to tab the whole utility bar and nav before reaching the content, with no skip target to jump to.

```tsx
import Link from "next/link";
import TopBar from "@/components/nav/TopBar";
import MainNav from "@/components/nav/MainNav";
import Footer from "@/components/Footer";

export default function NotFound() {
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
      <main id="main" className="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-20 text-center">
        <p className="text-7xl font-bold sm:text-9xl" aria-hidden="true">
          Oops!
        </p>
        <h1 className="font-bold">404 — Page not found</h1>
        <p className="max-w-sm text-sm">
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-accent-500 px-5 py-2.5 font-medium text-text-950 shadow-lg transition hover:bg-accent-400"
        >
          Go to homepage
        </Link>
      </main>
      <Footer />
    </div>
  );
}
```

`not-found.tsx` sits at `app/`, outside the `(marketing)` group, so it composes the chrome itself.

- [ ] **Step 4: Verify the 404 status code**

Run `npm run build && npm start`, then:

```bash
curl -sI http://localhost:3000/nope-not-here | head -1
```

Expected: `HTTP/1.1 404 Not Found`.

- [ ] **Step 5: Commit**

```bash
git add -A self-storage-hosting/app/ && git commit -m "feat(layout): add marketing layout, skip link and real 404"
```

Full message body:

```
Unknown URLs now return HTTP 404 instead of the 200 the SPA catch-all
served for every path.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

---

### Task 11: Accessible FAQ accordion component

Extracted from `HomePage` so it and the Plan 2 solution pages share one accessible implementation. The current markup nests `<div><p>` inside `<button>`, which is invalid HTML.

**Files:**
- Create: `self-storage-hosting/components/Faq.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `<Faq items={FaqItem[]} />` (default export) and `export type FaqItem = { q: string; a: string }`. Task 12, Task 13 and Plan 2's solution pages consume it.

- [ ] **Step 1: Create the component**

No `FAQPage` JSON-LD accompanies this (Global Constraints) — the accordion is for users.

```tsx
"use client";

import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";

export type FaqItem = { q: string; a: string };

export default function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-background-200 rounded-2xl border border-background-200 bg-white/70">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `faq-panel-${i}`;
        const buttonId = `faq-button-${i}`;
        return (
          <div key={item.q}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent-600"
              >
                <span>{item.q}</span>
                <BiChevronDown
                  aria-hidden="true"
                  className={`shrink-0 text-2xl transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
              <p className="px-6 pb-5 pr-8">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

`hidden` rather than a `grid-rows-[0fr]` collapse: the old approach left collapsed answers in the accessibility tree and reachable by keyboard.

Pages using `<Faq>` must not also render an `<h2>` at the same level without a section heading above it — the `<h3>` wrappers assume an `<h2>` ("FAQs") precedes them.

- [ ] **Step 2: Commit**

```bash
git add self-storage-hosting/components/Faq.tsx && git commit -m "feat(a11y): extract accessible FAQ accordion"
```

Full message body:

```
Fixes invalid <div><p> nested inside <button>, adds aria-controls and a
labelled region, hides collapsed panels from the a11y tree, and marks
the chevron aria-hidden so it stops polluting the accessible name.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

---

### Task 12: Port the home page

**Files:**
- Modify: `self-storage-hosting/app/(marketing)/page.tsx`
- Modify: `self-storage-hosting/public/HeroImage.png`
- Reference (do not edit): `self-storage-hosting/legacy-vite/pages/HomePage.tsx`

**Interfaces:**
- Consumes: `pageMeta` from `@/lib/seo`, `Faq`/`FaqItem` from `@/components/Faq`.
- Produces: the site root page and its `metadata` export.

- [ ] **Step 1: Shrink the hero image**

1.38 MB is the site's dominant LCP cost. It renders at 384px.

```bash
cd self-storage-hosting/public && npx --yes sharp-cli -i HeroImage.png -o HeroImage.png resize 768 --withoutEnlargement && ls -la HeroImage.png
```

Expected: comfortably under 150 KB. With the Task 8 logo, first-paint image weight should be under 100 KB once Next serves AVIF/WebP.

- [ ] **Step 2: Write the page**

Three copy changes from the original, all required by Global Constraints:

- The FAQ item "How fast are open/lock commands from the cloud?" answered "Near real-time; typical round-trip is about 1–3 seconds." **Delete it.** That is an unverified latency claim (spec D3). It is replaced below by an offline-behaviour question, whose answer is deliberately non-committal about resync because spec §14 D3 is unresolved — do not add "changes resync automatically" until the owner confirms it.
- "pre-built connectors for common self-storage software" → "…common self-storage facility management software (FMS)".
- `bg-[var(--color-bg-website)]` and `text-[var(--color-text-website)]` are **both undefined** — the page currently renders unstyled. Replace with `bg-background-50 text-text-900` on `<body>` (already set in Task 7), so the wrapper needs no color classes at all.

Also drop `min-h-[600px]`, `min-h-[500px]`, `min-h-[900px]` and `min-h-[300px]` — fixed heights break phone layout — and give the hero image real alt text in place of `alt=""`.

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BiRightArrowAlt } from "react-icons/bi";
import { pageMeta } from "@/lib/seo";
import Faq, { type FaqItem } from "@/components/Faq";

export const metadata: Metadata = pageMeta({
  title: "Cloud Access Control for Self-Storage",
  description:
    "Cloud-hosted access control and facility websites for independent self-storage operators. No on-site server to maintain.",
  path: "/",
});

const faqs: FaqItem[] = [
  {
    q: "Do we need an on-site server for access control?",
    a: "No—it's cloud-hosted. A small on-site bridge talks to your gate and locks and syncs with the cloud.",
  },
  {
    q: "Which access control hardware do you support?",
    a: "Most modern gate operators, keypads, and smart locks via APIs or adapters; connectors exist for common vendors.",
  },
  {
    q: "What happens if the site loses internet?",
    a: "The on-site controller keeps enforcing the access rules it already has, so tenants can still get in and out while the connection is down.",
  },
  {
    q: "Is multi-site management supported?",
    a: "Yes—single dashboard with roles and permissions, per-facility controls, and full audit logs.",
  },
  {
    q: "Do you host small marketing websites too?",
    a: "Yes—fast sites on your domain with SSL, CDN, forms and lead capture, and optional online move-ins.",
  },
  {
    q: "How do integrations work?",
    a: "REST/JSON API and webhooks, or pre-built connectors for common self-storage facility management software (FMS).",
  },
  // Spec §14 B lists encryption at rest, RBAC, SSO and audit exports as facts
  // the owner has not yet substantiated, and says anything unsubstantiated
  // comes out. TLS is observable from the browser, so it stays; the rest is
  // replaced with an invitation rather than a claim. Restore the specifics
  // only when the owner confirms them.
  {
    q: "How is data secured?",
    a: "Every connection is served over TLS. For our current security posture in detail — storage, staff access, isolation and audit — ask us and we will walk you through it.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:py-24">
        <div className="lg:flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em]">
            Self Storage Hosting
            <span className="mt-2 block h-[3px] w-12 rounded bg-accent-500" />
          </p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
            Improve operational efficiency and stay serverless
          </h1>
          <p className="mt-4 text-lg text-text-800">
            Our self-storage facility solutions are designed to be easy to find and easy to
            use—helping you maintain a cleaner solution for your customers.
          </p>
          <Link
            href="/demo"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-3 font-semibold text-text-950 transition hover:bg-accent-400"
          >
            Get started
            <BiRightArrowAlt aria-hidden="true" />
          </Link>
        </div>
        <Image
          src="/HeroImage.png"
          alt="Cloud-connected self-storage facility gate and access control keypad"
          width={384}
          height={384}
          fetchPriority="high"
          loading="eager"
          className="h-auto w-full max-w-sm"
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em]">
          Maximizing your facility efficiency
          <span className="mt-2 block h-[3px] w-12 rounded bg-accent-500" />
        </p>
        <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
          Powerful solutions to grow your impact
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Link
            href="/solutions/web-hosting"
            className="rounded-xl border border-background-200 bg-white/70 p-6 transition-colors hover:border-accent-700"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold">Personalized web hosting services</h3>
              <BiRightArrowAlt aria-hidden="true" className="shrink-0 text-2xl text-accent-700" />
            </div>
            <p className="mt-2">Increase your rentals by allowing tenants to rent and pay online.</p>
          </Link>
          <Link
            href="/solutions/access-control-hosting"
            className="rounded-xl border border-background-200 bg-white/70 p-6 transition-colors hover:border-accent-700"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold">Cloud managed access control integrations</h3>
              <BiRightArrowAlt aria-hidden="true" className="shrink-0 text-2xl text-accent-700" />
            </div>
            <p className="mt-2">
              Let your gate and access control systems run from the cloud for easier operation and
              less downtime.
            </p>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <h2 className="text-center text-2xl font-extrabold sm:text-3xl">FAQs</h2>
        <div className="mt-10">
          <Faq items={faqs} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-primary-700 p-8 text-text-50 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold">Ready to make the move to the cloud?</h2>
            <p className="mt-1 opacity-90">
              Talk to our team to see a tailored demo for your portfolio.
            </p>
          </div>
          <Link
            href="/demo"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent-50 px-5 py-3 font-semibold text-text-950 transition hover:bg-accent-200"
          >
            Request a demo
            <BiRightArrowAlt aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Verify**

Run `npm run build && npm start`, then:

```bash
curl -s http://localhost:3000/ | grep -o '<title>[^<]*</title>'
```

```bash
curl -s http://localhost:3000/ | grep -c '<h1'
```

Expected: the title reads `Cloud Access Control for Self-Storage | Self Storage Hosting` — **exactly one** brand occurrence — and exactly one `<h1>`.

- [ ] **Step 4: Commit**

```bash
git add self-storage-hosting/app self-storage-hosting/public/HeroImage.png && git commit -m "feat(home): port home page to App Router"
```

Full message body:

```
Fixes two undefined CSS variables that left the page unstyled, gives the
hero real alt text, removes four fixed min-heights that broke phone
layout, drops the unverified 1-3 second round-trip claim, and shrinks
HeroImage.png from 1.38MB.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

---

### Task 13: Port the about page with copy corrections

**Files:**
- Create: `self-storage-hosting/app/(marketing)/about-us/page.tsx`
- Reference (do not edit): `self-storage-hosting/legacy-vite/pages/AboutUsPage.tsx`

**Interfaces:**
- Consumes: `pageMeta` from `@/lib/seo`, `breadcrumbSchema` from `@/lib/schema`, `JsonLd` from `@/components/JsonLd`, `Faq` from `@/components/Faq`.
- Produces: `/about-us` with `#story`, `#careers` and `#news` anchors, which the footer links to.

- [ ] **Step 1: Port the page with every required correction**

Carry over the structure from `legacy-vite/pages/AboutUsPage.tsx`, applying all of:

1. **Delete the stats band entirely** — the `stats` array and the grid rendering it. "100+ Managed Sites", "99.95%", "< 200 ms" and "US & AU" are placeholders (spec D3).
2. **Apply the §13 copy table** to the `pmsBridges` array and all prose:
   - `"StorEdge"` → `"Storable Edge"`, `"Easy Storage Solutions"` → `"Storable Easy"`, `"Digi Gate"` → `"DigiGate"`
   - `"OpenTech Alliance"` used as a *product* → `"INSOMNIAC CIA"`; keep "OpenTech Alliance" where it means the company. **Do not put the ® in the bridge rows.** Two surviving rows carry the identical string (`AboutUsPage.tsx:84` and `:88`), so a blanket substitution prints ® twice and spec §13 allows it once per page. Put the single `INSOMNIAC® CIA` in the prose above the grid, at its first mention; the rows read `INSOMNIAC CIA`.
   - Every `"PMS"` → `"FMS"`, including the section heading and the `pmsBridges` variable name → `fmsBridges`
3. **Delete the fifth bridge row** `{ from: "Your PMS", to: "OpenTech Alliance", status: "Planned" }` and replace that card with a "Tell us which FMS you run" link to `/contact`.
4. **Remove "in real time"** from "Our FMS connectors feed your … access control in real time." Replace with: "Our FMS connectors keep tenants, units, access levels and lockouts in sync with your access control."
5. Change every `<a href="/contact">` to `<Link href="/contact">`, and `"View pricing"` → `"Explore solutions"` pointing at `/solutions` (spec D6 — no pricing is published).
6. Add `id="story"`, `id="careers"` and `id="news"` to the corresponding sections. If there is no careers or news content, write a short honest section for each — a one-line "we're not hiring right now, but say hello" is acceptable; a footer link to a section that does not exist is not.
7. Replace the inline FAQ block, if present, with `<Faq items={faqs} />` under an `<h2>`.
8. Add breadcrumbs.
9. **Cut the unsubstantiated security list** (spec §14 B). The source says "Encryption in transit/at rest, scoped tokens, RBAC, per-facility isolation, and comprehensive audit exports" at `AboutUsPage.tsx:114`, and repeats it near `:218`. Spec §14 B names every one of those except TLS as an owner fact that does not exist yet. Replace both with: "Served over TLS. Ask us for our current security posture." Do not soften it into "enterprise-grade security" — that is the same unverified claim with the specifics hidden.
10. **Drop the per-vendor "Available" badges** (spec §14 F, §15.4). The surviving bridge rows publish a `status` of "Available" against named third-party products. Spec §14 F records as an *open* question whether Storable's and OpenTech's terms permit a third party to build and commercially operate these bridges, and §15.4 forbids implying partnership. Until the owner answers, remove the `status` field and render each row as a capability offer — "We can bridge <FMS> to <system>. Tell us your setup." — with the trademark disclaimer already in the footer covering the marks.

```tsx
export const metadata: Metadata = pageMeta({
  title: "About Us",
  description:
    "Why we built cloud access control for independent self-storage operators, and how our FMS-to-gate bridges work.",
  path: "/about-us",
});
```

```tsx
<JsonLd
  data={breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about-us" },
  ])}
/>
```

- [ ] **Step 2: Verify no forbidden copy survives**

```bash
cd self-storage-hosting && grep -rniE "storedge|digi gate|easy storage solutions|sitelink|\bPMS\b|in real time|99\.95|100\+|1.3 seconds|200 ?ms|encryption at rest|\bRBAC\b|audit exports" app/ components/ lib/
```

Expected: **no matches.** Any hit is a Global Constraints violation that must be fixed before committing.

- [ ] **Step 3: Verify the footer anchors resolve**

```bash
npm run build && npm start && curl -s http://localhost:3000/about-us | grep -oE 'id="(story|careers|news)"'
```

Expected: all three present.

- [ ] **Step 4: Commit**

```bash
git add self-storage-hosting/app && git commit -m "feat(about): port about page with vendor-name and claim corrections"
```

Full message body:

```
- Remove the placeholder stats band (100+ sites, 99.95%, <200ms, US & AU)
- StorEdge -> Storable Edge, Easy Storage Solutions -> Storable Easy,
  Digi Gate -> DigiGate, PMS -> FMS throughout
- OpenTech Alliance is the company; the product is INSOMNIAC(R) CIA
- Drop the unqualified 'in real time' claim
- Replace the open-ended 'Your PMS' bridge promise with a qualification CTA
- Cut the security capability list to TLS; the rest is unsubstantiated (spec 14B)
- Drop the per-vendor 'Available' badges pending the entitlement answer (14F)
- Add #story, #careers and #news anchors the footer links to

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

---

### Task 14: Repair AuthContext for the cookie model

**Files:**
- Create: `self-storage-hosting/lib/auth-context.tsx`
- Test: `self-storage-hosting/tests/auth-config.test.ts`
- Reference (do not edit): `self-storage-hosting/legacy-vite/auth/AuthContext.tsx`

**Interfaces:**
- Consumes: Task 1's endpoints at `/api/users/*`.
- Produces: `<AuthProvider>` and `useAuth()` returning `{ user, ready, error, login, register, logout, refreshProfile }`. Plan 2's login and register pages consume this.

Note the deliberate change: `token` and `isLoading` are gone. The backend uses an httpOnly cookie, which JavaScript cannot read, so a client-side token was always fiction. `ready` replaces `isLoading` and means "the initial profile check has settled".

- [ ] **Step 1: Write the failing test**

Create `tests/auth-config.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const src = readFileSync(path.resolve(__dirname, "../lib/auth-context.tsx"), "utf8");

// These are source-text checks, which is the right shape here - the module is
// a client component and the point is the wire contract, not the render. But a
// suite made only of "does not contain X" and ">= 0" passes on an empty file.
// The first case below and the tightened counts are what make it non-vacuous:
// a 9-line stub with just the four path strings passes everything else.
describe("auth client configuration", () => {
  it("actually exports a provider and a hook", async () => {
    const mod = await import("@/lib/auth-context");
    expect(typeof mod.AuthProvider).toBe("function");
    expect(typeof mod.useAuth).toBe("function");
  });

  it("targets the real backend paths, not /app/auth", () => {
    expect(src).not.toContain("/app/auth");
    for (const p of ["/api/users/login", "/api/users/register", "/api/users/profile", "/api/users/logout"]) {
      expect(src).toContain(p);
    }
  });

  it("sends credentials on every request, including register", () => {
    const fetches = src.match(/fetch\(/g) ?? [];
    const creds = src.match(/credentials: "include"/g) ?? [];
    // Without the floor, 0 >= 0 passes on a file with no fetch at all.
    expect(fetches.length).toBeGreaterThanOrEqual(2);
    expect(creds.length).toBe(fetches.length);
  });

  it("does not depend on a token in the response body", () => {
    expect(src).not.toMatch(/data\??\.\s*token/);
  });

  it("does not put auth state in localStorage", () => {
    expect(src).not.toContain("localStorage");
  });

  it("reads the API base from exactly one constant", () => {
    const inline = src.match(/process\.env\.NEXT_PUBLIC_API_BASE/g) ?? [];
    expect(inline.length).toBe(1);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `lib/auth-context.tsx` does not exist.

- [ ] **Step 3: Implement lib/auth-context.tsx**

```tsx
"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type User = { id: string; email: string; name?: string; createdAt?: string };

const API = process.env.NEXT_PUBLIC_API_BASE;

type AuthCtx = {
  user: User | null;
  ready: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

async function post(path: string, body: unknown) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/users/profile`, { credentials: "include" });
      if (res.status === 401) {
        setUser(null);
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Profile failed (${res.status})`);
      setUser(data.user as User);
    } finally {
      setReady(true);
    }
  }, []);

  // Runs only after mount, so nothing here affects prerendered HTML.
  useEffect(() => {
    if (!API) {
      console.error("NEXT_PUBLIC_API_BASE is not set; auth requests will fail.");
      setReady(true);
      return;
    }
    refreshProfile().catch(() => setReady(true));
  }, [refreshProfile]);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const data = await post("/api/users/login", { email, password });
      setUser(data.user as User);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
      throw e;
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    setError(null);
    try {
      const data = await post("/api/users/register", { email, password, name });
      setUser(data.user as User);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    await post("/api/users/logout", {});
    setUser(null);
    setError(null);
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({ user, ready, error, login, register, logout, refreshProfile }),
    [user, ready, error, login, register, logout, refreshProfile]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS.

Do **not** mount `AuthProvider` in the root layout — that would make every marketing page part of a client tree and cost prerendering. Plan 2 mounts it in `app/(auth)/layout.tsx` only.

- [ ] **Step 5: Commit**

```bash
git add self-storage-hosting/lib/auth-context.tsx self-storage-hosting/tests/auth-config.test.ts && git commit -m "fix(auth): rewrite auth client for the cookie model"
```

Full message body:

```
The old client called /app/auth/* while the backend serves /api/users/*,
required a token in the response body the backend never sent, and kept
auth state in localStorage although the cookie is httpOnly. It also
inlined the env var in three of four calls with no fallback, so those
hit 'undefined/...' while register silently hit localhost.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

---

### Task 15: Contact form Route Handler

**Files:**
- Create: `self-storage-hosting/lib/contact.ts`, `self-storage-hosting/app/api/contact/route.ts`
- Test: `self-storage-hosting/tests/contact.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `validateContact(input: unknown): { ok: true; value: ContactPayload } | { ok: false; errors: Record<string, string> }`, and `POST /api/contact`. Plan 2's `/contact` and `/demo` pages post here.

- [ ] **Step 1: Write the failing test**

`website` is the honeypot — hidden from users, so any value means a bot. It is named plausibly so naive bots take the bait.

**Do not use `company` for this.** Spec §6.5 requires `company` as a real, visible field on `/contact` (name, company, email, phone, facility count, FMS, gate system, message). Burning the name on a trap both drops a required field and puts a silent 200 in front of any browser that autofills it — a lead that vanishes while the visitor is told "Thanks", on the one page whose whole job is converting.

Create `tests/contact.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { validateContact } from "@/lib/contact";

const valid = {
  name: "Dana Reyes",
  email: "dana@example.com",
  message: "We run four facilities on Storable Easy and want to move off the office PC.",
  company: "Reyes Storage Group",
  website: "",
};

describe("validateContact", () => {
  it("accepts a complete submission", () => {
    expect(validateContact(valid).ok).toBe(true);
  });

  it("requires name, email and message", () => {
    const r = validateContact({});
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["email", "message", "name"]);
  });

  it("rejects a malformed email", () => {
    const r = validateContact({ ...valid, email: "not-an-email" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.email).toBeTruthy();
  });

  it("rejects a filled honeypot as spam", () => {
    const r = validateContact({ ...valid, website: "buy-cheap-pills" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.website).toBeTruthy();
  });

  it("keeps company, which the spec requires as a real field", () => {
    const r = validateContact(valid);
    expect(r).toMatchObject({ ok: true, value: { company: "Reyes Storage Group" } });
  });

  it("carries the subject through so /demo is distinguishable from /contact", () => {
    expect(validateContact({ ...valid, subject: "demo" })).toMatchObject({
      ok: true,
      value: { subject: "demo" },
    });
  });

  it("rejects an over-long message", () => {
    expect(validateContact({ ...valid, message: "x".repeat(5001) }).ok).toBe(false);
  });

  // The assertion must be unconditional. With only `if (r.ok) expect(...)`,
  // a validator that REJECTS padded input - the likeliest trim regression -
  // runs zero assertions and Vitest reports the case as passed.
  it("trims whitespace from accepted values", () => {
    expect(validateContact({ ...valid, name: "  Dana Reyes  " })).toMatchObject({
      ok: true,
      value: { name: "Dana Reyes" },
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `@/lib/contact`.

- [ ] **Step 3: Implement lib/contact.ts**

```ts
export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  company?: string;
  phone?: string;
  facilityCount?: string;
  fms?: string;
  gateSystem?: string;
  // Which form this came from, so /contact and Plan 2's /demo are
  // distinguishable in the inbox. Not user input - the component sets it.
  subject?: string;
};

export type ValidationResult =
  | { ok: true; value: ContactPayload }
  | { ok: false; errors: Record<string, string> };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export function validateContact(input: unknown): ValidationResult {
  const raw = (input ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  // Honeypot. `website` is never shown to a person, so any value is a bot.
  if (str(raw.website)) {
    errors.website = "Rejected.";
    return { ok: false, errors };
  }

  const name = str(raw.name);
  const email = str(raw.email);
  const message = str(raw.message);

  if (!name) errors.name = "Please enter your name.";
  else if (name.length > 200) errors.name = "That name is too long.";

  if (!email) errors.email = "Please enter your email address.";
  else if (!EMAIL.test(email)) errors.email = "Please enter a valid email address.";

  if (!message) errors.message = "Please tell us what you need.";
  else if (message.length > 5000) errors.message = "Please keep your message under 5000 characters.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      name,
      email,
      message,
      company: str(raw.company) || undefined,
      phone: str(raw.phone) || undefined,
      facilityCount: str(raw.facilityCount) || undefined,
      fms: str(raw.fms) || undefined,
      gateSystem: str(raw.gateSystem) || undefined,
      subject: str(raw.subject) || undefined,
    },
  };
}
```

- [ ] **Step 4: Implement the route handler**

```ts
import { NextResponse } from "next/server";
import { validateContact } from "@/lib/contact";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const result = validateContact(body);

  if (!result.ok) {
    // A tripped honeypot gets a 200 so bots cannot tell it failed.
    if (result.errors.website) return NextResponse.json({ ok: true });
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  const to = process.env.CONTACT_TO_EMAIL;
  const key = process.env.RESEND_API_KEY;

  if (!to || !key) {
    console.error("Contact form not configured: set CONTACT_TO_EMAIL and RESEND_API_KEY.");
    return NextResponse.json(
      // Do NOT say "email us directly": SITE.contactEmail is "" until the
      // owner supplies one (spec §14 A), so the page publishes no address
      // and that instruction is impossible to follow.
      { error: "We could not send that right now. Please try again shortly." },
      { status: 503 }
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Self Storage Hosting <noreply@selfstoragehosting.com>",
      to: [to],
      reply_to: result.value.email,
      subject: `Website ${result.value.subject ?? "enquiry"} from ${result.value.name}`,
      text: Object.entries(result.value)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n"),
    }),
  });

  if (!res.ok) {
    console.error("Resend rejected the message:", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: "We couldn't send that. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
```

The in-memory rate limit resets per serverless instance. That is adequate for a low-traffic marketing site and honest about its limits; upgrade to a shared store only if abuse actually appears.

The `RESEND_API_KEY` is read from the environment only — never commit a key, and set it in the Vercel project settings. Spec §14 lists the provider choice and destination address as owner inputs; until they exist, the endpoint returns 503 with a clear message rather than failing silently.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test && npm run build`
Expected: PASS and a successful build.

- [ ] **Step 6: Commit**

```bash
git add self-storage-hosting/lib/contact.ts self-storage-hosting/app/api self-storage-hosting/tests/contact.test.ts && git commit -m "feat(forms): add contact route handler with validation and honeypot"
```

Full message body:

```
The Express backend has auth routes only; there was nowhere for a contact
form to post. Adds server-side validation, a honeypot that returns 200 so
bots cannot detect rejection, and a per-instance rate limit.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

---

### Task 16: The `/contact` page

Spec §16 groups this with the forms endpoint as build-order step 4, and calls steps 1–4 the point to stop at if work stops. It is in Plan 1 for two reasons: it **fixes the four live broken links** to `/contact` (spec §1.2), and it gives Task 15's endpoint a consumer, so the form is verified end to end rather than shipped untested.

**Files:**
- Create: `self-storage-hosting/app/(marketing)/contact/page.tsx`, `self-storage-hosting/components/ContactForm.tsx`

**Interfaces:**
- Consumes: `pageMeta` from `@/lib/seo`, `breadcrumbSchema` from `@/lib/schema`, `JsonLd` from `@/components/JsonLd`, and `POST /api/contact` from Task 15.
- Produces: `<ContactForm subject?: string />` default export. Plan 2's `/demo` page reuses it with a different heading and `subject`.

- [ ] **Step 1: Create the form component**

The honeypot is hidden with `sr-only` **plus** `tabIndex={-1}` and `aria-hidden`: `display: none` alone is what naive bots check for, and `sr-only` without `tabIndex={-1}` leaves the field in the keyboard order for real users.

```tsx
"use client";

import { useState } from "react";

type Errors = Record<string, string>;
type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm({ subject = "general" }: { subject?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setErrors({});
    setMessage("");

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, subject }),
      });
      const body = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("sent");
        setMessage("Thanks — we have your message and will reply within one business day.");
        form.reset();
        return;
      }
      if (body.errors) {
        setErrors(body.errors as Errors);
        setStatus("error");
        setMessage("Please check the highlighted fields.");
        return;
      }
      setStatus("error");
      setMessage(body.error ?? "Something went wrong. Please try again.");
    } catch {
      setStatus("error");
      setMessage("We could not reach the server. Please check your connection and try again.");
    }
  }

  const field =
    "mt-1 w-full rounded-lg border border-background-300 bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-600";

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-xl">
      {/* Honeypot: hidden from users, irresistible to bots. Never name this
          after a field the form really collects - see lib/contact.ts. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="font-medium">
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
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

        <div className="sm:col-span-2">
          <label htmlFor="company" className="font-medium">
            Company <span className="font-normal opacity-70">(optional)</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className={field}
          />
        </div>

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

        <div>
          <label htmlFor="phone" className="font-medium">
            Phone <span className="font-normal opacity-70">(optional)</span>
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={field} />
        </div>

        <div>
          <label htmlFor="facilityCount" className="font-medium">
            How many facilities? <span className="font-normal opacity-70">(optional)</span>
          </label>
          <input id="facilityCount" name="facilityCount" type="text" className={field} />
        </div>

        <div>
          <label htmlFor="fms" className="font-medium">
            Facility management software <span className="font-normal opacity-70">(optional)</span>
          </label>
          <input
            id="fms"
            name="fms"
            type="text"
            placeholder="e.g. Sitelink by Storable, Storable Easy"
            className={field}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="gateSystem" className="font-medium">
            Gate or access control system{" "}
            <span className="font-normal opacity-70">(optional)</span>
          </label>
          <input
            id="gateSystem"
            name="gateSystem"
            type="text"
            placeholder="e.g. DigiGate, PTI, Janus"
            className={field}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="font-medium">
            What do you need? <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            maxLength={5000}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={field}
          />
          {errors.message && (
            <p id="message-error" className="mt-1 text-sm text-red-700">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 rounded-full bg-accent-500 px-6 py-3 font-semibold text-text-950 transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>

      {/* Announced to screen readers without stealing focus. */}
      <p
        role="status"
        aria-live="polite"
        className={`mt-4 text-sm ${status === "error" ? "text-red-700" : "text-accent-800"}`}
      >
        {message}
      </p>
    </form>
  );
}
```

Two details that matter:

- `const form = e.currentTarget` is captured **before** the `await`. React nulls `currentTarget` once the synthetic event is handled, so calling `e.currentTarget.reset()` after an await throws.
- `noValidate` makes the server's messages the single source of truth. Without it the browser's own bubbles fire first and the tested error text never appears.

- [ ] **Step 2: Create the page**

Spec §14 A lists the business email, phone and mailing address as owner inputs that do not exist yet. **The page therefore ships with the form as the only contact channel** — do not invent an address or a phone number to fill the space. Add them in Plan 2 once supplied.

```tsx
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description:
    "Talk to us about cloud access control or a facility website. Tell us how many sites you run and what gate hardware you have.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Contact us</h1>
        <p className="mt-4 text-lg text-text-800">
          Tell us how many facilities you run, which facility management software you use, and what
          gate hardware is on site. We will tell you plainly whether we can bridge it.
        </p>
        <div className="mt-10">
          <ContactForm subject="general" />
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Verify the validation and honeypot paths**

Neither needs email configuration. Run `npm run dev`, then:

```bash
curl -s -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" --data-raw "{}" | head -c 300
```

Expected: a 400 body naming all three required fields.

```bash
curl -s -o /dev/null -w "honeypot -> %{http_code}\n" -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" --data-raw "{\"name\":\"A\",\"email\":\"a@b.co\",\"message\":\"hi\",\"website\":\"bot\"}"
```

Expected: `200`. The honeypot returns success so bots cannot detect the rejection.

- [ ] **Step 4: Verify the form in the browser**

With `CONTACT_TO_EMAIL` and `RESEND_API_KEY` unset, a valid submission must surface the "not configured yet" message from the 503 branch — a silent failure here is the bug this step exists to catch.

Then: submit with the message field empty and confirm the server's error text appears beneath the field and is linked by `aria-describedby`. Tab through the whole form and confirm the honeypot is **never** focused, and that the visible **Company** field *is* in the tab order.

- [ ] **Step 5: Verify the broken links now resolve**

```bash
cd self-storage-hosting && npm run build && npm start & sleep 4; curl -s -o /dev/null -w "/contact -> %{http_code}\n" localhost:3000/contact; kill %1
```

Expected: `200`. This is what the four links in the About page and the footer have been pointing at.

- [ ] **Step 6: Commit**

```bash
git add self-storage-hosting/app self-storage-hosting/components/ContactForm.tsx && git commit -m "feat(contact): add the contact page and accessible form"
```

Full message body:

```
Fixes the four live links to /contact, which had no route and so returned
the SPA shell at HTTP 200. The form posts to the Task 15 handler, shows
server-side field errors linked by aria-describedby, and announces status
through a polite live region. The honeypot is sr-only and removed from the
tab order rather than display:none, which bots check for.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

---

### Task 17: Remove Vite sources and run the verification sweep

**Files:**
- Delete: `self-storage-hosting/legacy-vite/`
- Modify: `self-storage-hosting/eslint.config.js` (drop the `src` ignore), `self-storage-hosting/README.md`
- Create: `self-storage-hosting/tests/content-policy.test.ts`, `self-storage-hosting/tests/contrast.test.ts`

- [ ] **Step 1: Write the content-policy test**

This is the standing guard against the copy rules regressing as Plans 2 and 3 add pages.

```ts
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..");
const DIRS = ["app", "components", "lib"];

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(tsx?|mdx?)$/.test(entry)) out.push(full);
  }
  return out;
}

const files = DIRS.flatMap((d) => {
  try {
    return walk(path.join(ROOT, d));
  } catch {
    return [];
  }
})
  .map((f) => ({ file: path.relative(ROOT, f), text: readFileSync(f, "utf8") }))
  // lib/schema.ts lists these strings in its own blocklist. It enforces the
  // rule rather than breaking it, so exclude it or the guard flags itself.
  .filter((f) => f.file !== path.join("lib", "schema.ts"));

const FORBIDDEN: [RegExp, string][] = [
  [/\bStorEdge\b/, 'Use "Storable Edge" (renamed 2025-03-06)'],
  [/\bDigi Gate\b/, 'Use "DigiGate" (one word)'],
  [/\bEasy Storage Solutions\b/, 'Use "Storable Easy" (renamed 2025-03-06)'],
  [/\bStor-Guard\b/, 'Use "StorGuard" (one word)'],
  [/\bSiteLink\b/, 'Use "Sitelink by Storable"'],
  [
    /encryption at rest|\bRBAC\b|audit exports|scoped tokens/i,
    "Unsubstantiated security claim (spec 14B) - only TLS is verified",
  ],
  [/\bPMS\b/, 'Use "FMS" — the industry term is facility management software'],
  [/99\.95\s*%/, "Unsubstantiated uptime claim — spec D3"],
  [/100\+\s*(managed\s*)?sites?/i, "Unsubstantiated scale claim — spec D3"],
  [/\d\s*[–-]\s*\d\s*seconds/, "Unsubstantiated latency claim — spec D3"],
  [/<\s*\d+\s*ms/i, "Unsubstantiated latency claim — spec D3"],
  [/"FAQPage"|'FAQPage'/, "FAQ rich results were retired 2026-05-07 — spec 7.2"],
  [/aggregateRating/, "Requires review data we do not have — spec 7.2"],
];

describe("content policy", () => {
  it.each(FORBIDDEN)("never contains %s", (pattern, why) => {
    const offenders = files.filter((f) => pattern.test(f.text)).map((f) => f.file);
    expect(offenders, `${why}. Found in: ${offenders.join(", ")}`).toEqual([]);
  });
});
```

The trailing `.filter` above is load-bearing: `lib/schema.ts` contains the literal strings `FAQPage` and `aggregateRating` in its own blocklist, so without it the guard flags its own enforcement code.

- [ ] **Step 2: Run it and fix anything it catches**

Run: `npm test`
Expected: PASS. A failure means the flagged file violates a Global Constraint — fix the copy, not the test.

- [ ] **Step 3: Delete the Vite sources**

Everything has been ported: `HomePage` → Task 12, `AboutUsPage` → Task 13, `NotFoundPage` → Task 10, the navbars → Task 8, `Footer` → Task 9, `AuthContext` → Task 14. `Spinner` is intentionally dropped — the App Router code-splits per route, and with static marketing pages there is nothing to suspend on. (Its animated ring referenced `--color-accent-website`, an undefined variable, so it was invisible anyway.)

The remaining eight page stubs are byte-identical "Under Development" placeholders. Plan 2 writes real pages; nothing is lost.

```bash
cd self-storage-hosting && git rm -r legacy-vite/
```

Then remove `"legacy-vite"` from the `globalIgnores` array in `eslint.config.js`, and drop it from `tsconfig.json`'s `exclude` so only `node_modules` remains.

- [ ] **Step 4: Replace the README**

The current README is the stock Vite template text and is now wrong in every particular.

```markdown
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
```

- [ ] **Step 5: Check colour contrast (spec §7.5)**

The palette is a single low-saturation teal ramp, so contrast is a real risk rather than a formality. Check these seven pairs, which cover every text style on the four surfaces Plan 1 ships (`/`, `/about-us`, `/contact` and the 404):

| Context | Foreground | Background |
|---|---|---|
| Nav and footer links | `--color-text-50` | `--color-primary-700` |
| Footer column headings | `--color-accent-200` | `--color-primary-700` |
| Nav dropdown hover | `--color-text-50` | `--color-primary-800` |
| Hero CTA and the 404 CTA | `--color-text-950` | `--color-accent-500` |
| Hero subhead | `--color-text-800` | `--color-background-50` |
| Primary CTA ("Talk to Sales") | `--color-text-950` | `--color-accent-50` |
| Body copy | `--color-text-900` | `--color-background-50` |

Read those hex values out of `app/globals.css` and compute the WCAG 2.1 contrast ratio for each pair. All seven must clear **4.5:1** — do not fall back to the 3:1 large-text allowance for the hero `<h1>`, because all six already pass at 4.5:1 with the shades above.

Add `tests/contrast.test.ts` so this cannot regress:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const css = readFileSync(path.resolve(__dirname, "../app/globals.css"), "utf8");

function token(name: string): string {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{3,8})`));
  if (!m) throw new Error(`Token --color-${name} not found in globals.css`);
  return m[1];
}

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const PAIRS: [string, string, string, number][] = [
  ["nav and footer links", "text-50", "primary-700", 4.5],
  ["footer column headings", "accent-200", "primary-700", 4.5],
  ["nav dropdown hover", "text-50", "primary-800", 4.5],
  ["primary CTA on light", "text-950", "accent-50", 4.5],
  ["hero CTA and 404 CTA", "text-950", "accent-500", 4.5],
  ["body copy", "text-900", "background-50", 4.5],
  ["hero subhead", "text-800", "background-50", 4.5],
];

describe("WCAG AA contrast", () => {
  it.each(PAIRS)("%s meets the minimum ratio", (_label, fg, bg, min) => {
    expect(ratio(token(fg), token(bg))).toBeGreaterThanOrEqual(min);
  });
});
```

These seven pairs are the ones this controller already computed against the real palette, and all
seven pass (5.79, 4.54, 9.46, 17.57, 8.19, 15.13, 9.91). They are in the test to stop a later task
drifting off them, not because they are in doubt.

**The test cannot see `opacity-*`.** It reads raw `--color-*` tokens, so a composited colour is
invisible to it: `text-50` at `opacity-70` on `primary-700` measures 3.74:1 and the suite still goes
green. Do not use opacity utilities on text sitting on chrome.

**Do not change a component's shade to make this test pass, and never lower a threshold.** The shades
in Tasks 8, 9 and 12 were already corrected to match: `primary-700` is the dark chrome throughout.
For the record, the pairs that FAIL and must not be reintroduced:

| Rejected pair | Ratio |
|---|---|
| `text-50` on `primary-600` | 3.62:1 — fails 4.5:1 |
| `accent-200` on `primary-600` | 2.84:1 — fails even the 3:1 large-text floor |
| pure white on `primary-600` | 3.97:1 — still fails |
| `text-50` on `accent-400` | 1.79:1 — the original 404 CTA |
| `text-50` on `accent-500` | 2.13:1 — its hover state |
| `text-50` on `primary-500` | 2.39:1 — the original dropdown hover |

Plan 2's pages must use the same `primary-700` chrome.

- [ ] **Step 6: Confirm the canonical host matches the live redirect (spec §7.3, §14 D1)**

`SITE.url` is the apex, `https://selfstoragehosting.com`. The current production site 301s the **apex to `www`** — the opposite direction. Left as is, every canonical points at a URL that immediately redirects, which wastes crawl budget and splits signals.

Check the live behaviour:

```bash
curl -sI https://selfstoragehosting.com | grep -iE "^(HTTP|location)"
```

```bash
curl -sI https://www.selfstoragehosting.com | grep -iE "^(HTTP|location)"
```

Expected after the fix: the apex returns 200, and `www` 301s to it. If the apex still redirects to `www`, flip the redirect in the Vercel project's domain settings so the apex is primary — this is a dashboard change requiring the owner's account access, not a code change. **Flag it to the owner if you cannot make it; do not silently change `SITE.url` to `www` instead, because §14 D1 records the apex as the chosen canonical host.**

- [ ] **Step 6b: Assert every sitemap URL has a page on disk (spec §7.6 #2)**

This is the check that `built` exists to serve, and it can only run here: it needs
`/`, `/about-us` and `/contact` to all be on disk, which is first true after Task 16.

Create `self-storage-hosting/tests/sitemap-coverage.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readdirSync } from "node:fs";
import path from "node:path";
import { ROUTES, indexableRoutes } from "@/lib/site";

function pagesOnDisk(): Set<string> {
  const pages = new Set<string>();
  const walk = (dir: string, url: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) {
        // Route groups like (marketing) do not appear in the URL.
        walk(path.join(dir, e.name), e.name.startsWith("(") ? url : url + "/" + e.name);
      } else if (e.name === "page.tsx") {
        pages.add(url === "" ? "/" : url);
      }
    }
  };
  walk(path.resolve(__dirname, "../app"), "");
  return pages;
}

describe("sitemap coverage", () => {
  it("every route the sitemap emits has a page on disk", () => {
    const pages = pagesOnDisk();
    expect(indexableRoutes().filter((r) => !pages.has(r))).toEqual([]);
  });

  // The inverse: a page that exists but is flagged `built: false` is silently
  // missing from the sitemap, which is the quieter and more likely mistake.
  it("every page on disk that is in ROUTES is flagged built", () => {
    const pages = pagesOnDisk();
    const unflagged = [...pages].filter((u) => ROUTES[u] && !ROUTES[u].built);
    expect(unflagged).toEqual([]);
  });

  it("is actually checking something", () => {
    expect(indexableRoutes()).toEqual(["/", "/about-us", "/contact"]);
  });
});
```

Run: `npm test` — expected PASS. If the first case fails, a route is flagged
`built: true` with no page; if the second fails, Task 13 or 16 created a page
and forgot to flip its flag.

- [ ] **Step 7: Full verification sweep**

```bash
cd self-storage-hosting && npm run lint && npm test && npm run build
```

Then start the production server:

```bash
cd self-storage-hosting && npm start
```

In a second shell, assert the live output. Each of these is a separate check so a failure names itself:

```bash
curl -sI localhost:3000/robots.txt | head -2
```

```bash
curl -sI localhost:3000/sitemap.xml | head -2
```

```bash
curl -sI localhost:3000/nope | head -1
```

```bash
curl -s -o /dev/null -w "contact %{http_code}\n" localhost:3000/contact
```

```bash
curl -s localhost:3000/ | grep -o "<title>[^<]*</title>"
```

```bash
curl -s localhost:3000/ | grep -c "application/ld+json"
```

Spec §7.6 #2 — every URL the sitemap advertises must return 200. Task 3's test proves each has a page file; this proves each actually serves:

```bash
curl -s localhost:3000/sitemap.xml | grep -oE "<loc>[^<]+</loc>" | sed -E "s#</?loc>##g; s#https?://[^/]+##" | while read -r u; do printf "%s %s
" "$(curl -s -o /dev/null -w "%{http_code}" "localhost:3000$u")" "$u"; done
```

Spec §7.6 #9 — first-paint image weight on `/` under 100 KB. Sum the bytes actually served for every `<img src>` the home page emits:

```bash
curl -s localhost:3000/ | grep -oE 'src="/[^"]+\.(png|jpg|jpeg|webp|avif|svg)[^"]*"' | sed -E 's/src="//; s/"$//' | sort -u | while read -r i; do curl -s -o /dev/null -w "%{size_download} $i
" "localhost:3000$i"; done | awk '{t+=$1; print} END {print t" TOTAL bytes"}'
```

Spec §7.6 #4 — exactly one `<h1>` per page, and a distinct title and description on each:

```bash
for u in / /about-us /contact; do printf "%s h1=%s
" "$u" "$(curl -s "localhost:3000$u" | grep -c "<h1")"; done
```

```bash
for u in / /about-us /contact; do curl -s "localhost:3000$u" | grep -oE "<title>[^<]*</title>|<meta name=\"description\" content=\"[^\"]*\""; done | sort | uniq -d
```

Expected, in order: lint clean · all tests pass · build succeeds · `text/plain` · `application/xml` · **404** · `contact 200` · exactly one brand occurrence in the title · `2` JSON-LD blocks · TOTAL under 102400 bytes · every sitemap URL `200` · `h1=1` on all three pages · **no output** from the duplicate check (an empty result means every title and description is unique).

- [ ] **Step 7b: Hand the owner the deploy-time checks**

Four of spec §7.6's ten assertions cannot run from this worktree — they need the live domain and the owner's accounts. Do not mark them done and do not quietly drop them. Write them into `docs/deploy-checklist.md` and name the owner as the blocker:

```markdown
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
```

Commit it with the rest of Step 8.

- [ ] **Step 8: Commit**

```bash
git add -A self-storage-hosting/ && git commit -m "chore: remove Vite sources and add content-policy test"
```

Full message body:

```
All components ported to App Router. Adds a standing test that fails the
build on outdated vendor names, unsubstantiated claims, and retired
schema types, so the copy rules cannot regress as pages are added.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

---

## Plan 1 exit criteria

Before Plan 2 begins, all of these must hold:

- [ ] `npm run lint`, `npm test`, `npm run build` all pass in `self-storage-hosting/`
- [ ] `npm test` passes in `backend/`
- [ ] An unknown URL returns **HTTP 404**, not 200
- [ ] `/contact` returns 200, and the four links that pointed at it resolve
- [ ] Posting an empty body to `/api/contact` returns 400 with all three field errors; a filled `website` honeypot returns 200, and a submission with a real `company` value is accepted
- [ ] `/robots.txt` is `text/plain`; `/sitemap.xml` is `application/xml`
- [ ] Home and About render correctly at 375px width with a working mobile menu
- [ ] No page title contains the brand name twice
- [ ] Combined first-paint image weight on `/` is under 100 KB
- [ ] The content-policy test passes — no outdated vendor names, no removed stats, no latency claims, no unsubstantiated security claims
- [ ] The contrast test passes at WCAG AA for all seven pairs
- [ ] Every URL in `/sitemap.xml` returns 200
- [ ] `/`, `/about-us` and `/contact` each have exactly one `<h1>` and a title and description unique among the three
- [ ] `docs/deploy-checklist.md` exists and carries the four owner-blocked §7.6 checks
- [ ] The apex host returns 200 and `www` 301s to it, matching `SITE.url` — or the discrepancy is flagged to the owner

**Blocked on the owner, not on this plan.** These are recorded, not resolved:

- `CONTACT_TO_EMAIL` and `RESEND_API_KEY` (spec §14 A). Until both are set, `/api/contact` answers 503 on every submission and the site has **no working contact channel**. This is the single highest-value thing the owner can unblock.
- The business email, phone and mailing address `/contact` is meant to publish, and the `sameAs`/`contactPoint` data `organizationSchema()` currently omits (§14 A, C).
- Whether the security specifics cut in Tasks 12 and 13 are substantiable (§14 B), and whether Storable's and OpenTech's terms permit the bridges (§14 F).
- The apex/`www` redirect direction, which is a Vercel dashboard change (§14 D1).

**Nav links to Plan 2's pages 404 until Plan 2 lands, by design.** The sitemap does not advertise them — `indexableRoutes()` filters on `built` — so a preview deploy is safe to crawl. **Do not merge this branch to `main` until Plan 2's pages exist.**

## What Plan 2 covers

`/solutions` index, both solution pages, `/demo`, `/support`, `/events`, `/case-studies`, `/user/login`, `/user/register`, and the four legal pages. It reuses `ContactForm` on `/demo`, adds the real business contact details to `/contact` once spec §14 A is answered, and mounts `AuthProvider` in `app/(auth)/layout.tsx` only.

## What Plan 3 covers

`/resources` hub, `/resources/[slug]`, and the five articles.
