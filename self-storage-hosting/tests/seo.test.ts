import { describe, it, expect } from "vitest";
import { pageMeta, canonicalFor, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { SITE } from "@/lib/site";
import manifest from "@/app/manifest";
import { PKG_ROOT } from "./helpers/walk";

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
      pageMeta({ title: "a", description: "d", path: "/a", ogType: "article", publishedTime: "2026-09-19" })
        .openGraph
    ).toMatchObject({ type: "article" });
  });

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

  it("rejects a canonical path carrying a query or fragment", () => {
    expect(() => canonicalFor("/contact?ref=x")).toThrow();
    expect(() => canonicalFor("/contact#top")).toThrow();
  });

  // twitter:card is summary_large_image on every page, which renders as a
  // bare link when no image is named. The live audit found none on any page.
  it("gives every page the default share image, for Open Graph and Twitter alike", () => {
    const m = pageMeta({ title: "a", description: "d", path: "/a" });
    const want = { url: "/og.png", width: 1200, height: 630, alt: SITE.name };
    expect(m.openGraph).toMatchObject({ images: [want] });
    expect(m.twitter).toMatchObject({ card: "summary_large_image", images: [want] });
    expect(DEFAULT_OG_IMAGE).toEqual(want);
  });

  it("lets a page name its own share image instead", () => {
    const m = pageMeta({ title: "a", description: "d", path: "/a", image: "/other.png" });
    expect(m.openGraph).toMatchObject({ images: [{ url: "/other.png" }] });
    expect(m.twitter).toMatchObject({ images: [{ url: "/other.png" }] });
  });
});

/** Width and height from a PNG's IHDR chunk, which always comes first. */
function pngSize(file: string): { width: number; height: number } {
  const buf = readFileSync(file);
  expect(buf.subarray(0, 8).toString("hex"), `${file} is not a PNG`).toBe("89504e470d0a1a0a");
  expect(buf.subarray(12, 16).toString("latin1")).toBe("IHDR");
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

describe("default share image", () => {
  const OG = path.join(PKG_ROOT, "public", ...SITE.ogImage.split("/").filter(Boolean));

  it("is the size the metadata says it is", () => {
    expect(SITE.ogImage).toBe("/og.png");
    expect(pngSize(OG)).toEqual({ width: DEFAULT_OG_IMAGE.width, height: DEFAULT_OG_IMAGE.height });
  });

  it("stays a light fetch for the networks that unfurl it", () => {
    // 300 KB leaves room for a redraw of the logo-and-name card without
    // inviting a full-bleed photo. It is 70 KB today.
    expect(statSync(OG).size).toBeLessThanOrEqual(300 * 1024);
  });
});

describe("app icons", () => {
  const APP = path.join(PKG_ROOT, "app");

  // Google shows a site's favicon in results only when the home page links
  // one, and wants it square and a multiple of 48 px. Next links app/icon.png
  // from every page.
  it("ships app/icon.png, square and a multiple of 48 px", () => {
    const { width, height } = pngSize(path.join(APP, "icon.png"));
    expect(width).toBe(height);
    expect(width % 48).toBe(0);
  });

  it("ships a 180 px app/apple-icon.png with no transparency", () => {
    const file = path.join(APP, "apple-icon.png");
    expect(pngSize(file)).toEqual({ width: 180, height: 180 });
    // IHDR colour type 2 is truecolour without alpha. iOS paints transparent
    // pixels black on a home screen.
    expect(readFileSync(file).readUInt8(25)).toBe(2);
  });

  // Browsers request /favicon.ico whatever the markup says. With no file that
  // request fell through to the 404 page, which is not cached.
  it("ships app/favicon.ico as a real ICO with 16, 32 and 48 px frames", () => {
    const buf = readFileSync(path.join(APP, "favicon.ico"));
    expect(buf.readUInt16LE(0), "ICONDIR reserved").toBe(0);
    expect(buf.readUInt16LE(2), "ICONDIR type (1 = icon)").toBe(1);
    const count = buf.readUInt16LE(4);
    const sizes: number[] = [];
    for (let i = 0; i < count; i++) {
      const entry = 6 + i * 16;
      const size = buf.readUInt8(entry) || 256;
      expect(buf.readUInt8(entry + 1) || 256, `frame ${i} is not square`).toBe(size);
      const length = buf.readUInt32LE(entry + 8);
      const offset = buf.readUInt32LE(entry + 12);
      expect(offset + length, `frame ${i} runs past the end of the file`).toBeLessThanOrEqual(buf.length);
      // Each frame is stored as PNG, and its own header must agree with the
      // directory entry.
      const frame = buf.subarray(offset, offset + length);
      expect(frame.subarray(0, 8).toString("hex"), `frame ${i} is not PNG data`).toBe("89504e470d0a1a0a");
      expect([frame.readUInt32BE(16), frame.readUInt32BE(20)], `frame ${i}`).toEqual([size, size]);
      sizes.push(size);
    }
    expect(sizes).toEqual(expect.arrayContaining([16, 32, 48]));
  });

  it("names only icons that exist, in the web app manifest", () => {
    const m = manifest();
    expect(m.name).toBe(SITE.name);
    expect(m.icons?.length).toBeGreaterThan(0);
    for (const icon of m.icons ?? []) {
      const file = path.join(APP, icon.src.replace(/^\//, ""));
      expect(pngSize(file), icon.src).toEqual({
        width: Number(icon.sizes?.split("x")[0]),
        height: Number(icon.sizes?.split("x")[1]),
      });
    }
  });
});

describe("home page LCP image", () => {
  // The hero is the largest element above the fold on a phone, so its bytes
  // are the LCP. The optimizer served a 77 KB WebP upscaled to 828px from
  // this 768px file; the page now serves the file itself, so the file is the
  // whole budget. 30 KB keeps mobile LCP on Slow 4G clear of 2.5 s with room
  // for a redraw; a full-colour re-export (the old file was 342 KB) fails it.
  const HERO = path.join(PKG_ROOT, "public", "HeroImage.png");
  const HOME = path.join(PKG_ROOT, "app", "(marketing)", "page.tsx");

  it("stays under its byte budget", () => {
    expect(statSync(HERO).size).toBeLessThanOrEqual(30 * 1024);
  });

  it("is served as the file, not through the image optimizer", () => {
    const img = readFileSync(HOME, "utf8").match(/<Image\b[\s\S]*?\/>/)?.[0] ?? "";
    expect(img, "the home page renders no <Image>").toContain('src="/HeroImage.png"');
    expect(img).toMatch(/\bunoptimized\b/);
    expect(img).toMatch(/fetchPriority="high"/);
  });
});

describe("footer credit", () => {
  // The visible links go to Kingpost's page about this site, the way the
  // Storatix and ManaArchive footers link theirs. The JSON-LD keeps Kingpost's
  // home page as the Organization's url.
  it("links to Kingpost's page for this site from the shared footer", () => {
    const src = readFileSync(path.join(PKG_ROOT, "components", "Footer.tsx"), "utf8");
    expect(src).toContain("href={SITE.builtBy.productUrl}");
    expect(src).toContain("Built by {SITE.builtBy.label}");
    expect(SITE.builtBy.productUrl).toBe("https://www.kingpostsoftware.com/products/selfstoragehosting");
    expect(SITE.builtBy.label).toBe("Kingpost Software");
  });

  it("keeps Kingpost's home page as the url its Organization node carries", () => {
    expect(SITE.builtBy.url).toBe("https://www.kingpostsoftware.com/");
  });
});
