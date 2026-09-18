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
