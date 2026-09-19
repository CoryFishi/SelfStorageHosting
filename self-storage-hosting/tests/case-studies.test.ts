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
    // Heading tag names (h1, h2, h3) carry digits too, and are removed for the
    // same reason as class names. Everything else on this page is words: any
    // number would have to be a customer result, and there are none yet. That
    // includes comments, so the page's own comments must not cite spec
    // sections by number either.
    const text = source()
      .replace(/className=(?:"[^"]*"|\{`[^`]*`\})/g, "")
      .replace(/<\/?h[1-6]\b/g, "<h");
    const lines = text.split("\n").filter((l) => /\d/.test(l));
    expect(lines, `lines with a number: ${lines.join(" | ")}`).toEqual([]);
  });

  it("publishes no quotes, logos or images (spec D2)", () => {
    const found = source().match(/<(?:blockquote|img|Image|figure|svg)\b/g) ?? [];
    expect(found, `testimonial or logo markup: ${found.join(", ")}`).toEqual([]);
  });
});
