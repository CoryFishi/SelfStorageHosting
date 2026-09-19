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
