import { describe, it, expect } from "vitest";
import { SOURCES } from "@/lib/sources";

// Fetches every cited source over the network and checks it still answers.
// Vendors move their documents without warning: in September 2026 PTI moved
// most of /documents/ under current-products/ and archived-products/, without
// redirects, and thirteen cited PDFs went 404. A plain `npm test` skips this,
// so a vendor outage can never block a deploy.
// Run it monthly and before each deploy with:
//   LINKCHECK=1 npx vitest run tests/source-status.test.ts
const RUN = process.env.LINKCHECK === "1";

// Some vendor sites answer a bare fetch with 403, so ask as a browser does.
const CHROME_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

const entries = Object.entries(SOURCES);

describe.skipIf(!RUN)("cited sources, fetched live", () => {
  it.concurrent.each(entries)(
    "%s answers 200",
    async (key, s) => {
      const res = await fetch(s.url, {
        method: "GET",
        redirect: "follow",
        headers: { "User-Agent": CHROME_UA },
        signal: AbortSignal.timeout(45_000),
      });
      // Headers are all this needs; don't download a 6 MB manual to read them.
      await res.body?.cancel();
      expect(res.status, `${key}: ${s.url} answered ${res.status}`).toBe(200);

      // Redirects are followed so a moved page is reported by where it went,
      // but a vendor that sends a removed document to its home page or a
      // listing page answers 200 there too. So any redirect fails: re-read the
      // document at its new address, then update url and verifiedOn.
      expect(res.redirected, `${key}: ${s.url} now redirects to ${res.url}`).toBe(false);

      // A title ending "(PDF)" promises a PDF. A vendor that removes one often
      // serves an HTML "not found" page, sometimes with a 200, so the type is
      // checked as well as the status.
      if (s.title.endsWith("(PDF)")) {
        const type = res.headers.get("content-type") ?? "";
        expect(type, `${key}: ${s.url} is titled as a PDF but served ${type}`).not.toMatch(/^text\/html/i);
      }
    },
    60_000
  );
});
