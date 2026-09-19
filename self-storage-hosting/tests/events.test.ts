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
