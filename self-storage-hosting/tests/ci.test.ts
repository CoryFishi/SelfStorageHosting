import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { PKG_ROOT } from "./helpers/walk";

// .github/workflows/ci.yml is the only thing that runs these tests before a
// deploy; Netlify runs `npm run build` alone. The rendered checks are the
// ones a plain `npm test` skips, so losing that step would leave the
// canonical, share-image and Kingpost-credit guards protecting nothing.
describe("CI workflow", () => {
  const ci = readFileSync(path.join(PKG_ROOT, "..", ".github", "workflows", "ci.yml"), "utf8");
  // Every one-line `run:` command, in order. (`defaults: run:` has none.)
  const runs = [...ci.matchAll(/^[ \t]*(?:-[ \t]+)?run:[ \t]*(\S.*)$/gm)].map((m) => m[1].trim());

  it("runs on pull requests and on main, from the site's directory", () => {
    expect(ci).toMatch(/^\s*pull_request:/m);
    expect(ci).toMatch(/^\s*branches:\s*\[main\]/m);
    expect(ci).toMatch(/working-directory:\s*self-storage-hosting\s*$/m);
  });

  it("installs, lints, tests and builds, then checks the built HTML", () => {
    const order = ["npm ci", "npm run lint", "npm test", "npm run build", "npx vitest run tests/rendered.test.ts"];
    expect(runs).toEqual(order);
    // The rendered step skips itself unless RENDERED=1.
    const rendered = ci.slice(ci.indexOf("npx vitest run tests/rendered.test.ts"));
    expect(rendered).toMatch(/RENDERED:\s*"1"/);
  });
});
