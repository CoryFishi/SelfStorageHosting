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
    // A source nobody cites is a URL nobody re-checks. Keys are matched as a
    // whole word after `SOURCES.` in page source, which is the only way a
    // page reaches them. A plain substring match would also count a key as
    // cited when it is only a prefix of another key's citation.
    const pages = walkFrom("app", /^page\.tsx$/).map((f) => readFileSync(f, "utf8")).join("\n");
    const uncited = entries
      .map(([k]) => k)
      .filter((k) => !new RegExp(`\\bSOURCES\\.${k}\\b`).test(pages));
    expect(uncited, `sources no page cites: ${uncited.join(", ")}`).toEqual([]);
  });
});
