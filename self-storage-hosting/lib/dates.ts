// Formats ISO calendar dates (YYYY-MM-DD) for display, US style. This is pure
// string work, with no Intl and no time zone. An event on 2026-10-07 is on
// October 7 wherever the server runs, and Intl output can also vary with the
// Node ICU build, which would make the prerendered HTML differ by machine.
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parts(iso: string): { y: number; m: number; d: number } {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (match) {
    const [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
    // Date.UTC rolls an impossible date over (2026-02-30 becomes March 2), so
    // a mismatch means the calendar has no such day.
    const probe = new Date(Date.UTC(y, m - 1, d));
    if (probe.getUTCFullYear() === y && probe.getUTCMonth() === m - 1 && probe.getUTCDate() === d) {
      return { y, m, d };
    }
  }
  throw new Error(`Not an ISO calendar date: "${iso}"`);
}

/** "2026-10-07" → "October 7, 2026" */
export function formatDate(iso: string): string {
  const { y, m, d } = parts(iso);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/**
 * "2026-11-10", "2026-11-12" → "November 10–12, 2026"
 * "2027-03-30", "2027-04-02" → "March 30 – April 2, 2027"
 * A missing or equal end date gives a single date.
 */
export function formatDateRange(start: string, end?: string): string {
  const a = parts(start);
  if (end === undefined || end === start) return formatDate(start);
  const b = parts(end);
  if (end < start) throw new Error(`Range ends before it starts: ${start} to ${end}`);
  if (a.y !== b.y) return `${formatDate(start)} – ${formatDate(end)}`;
  if (a.m !== b.m) return `${MONTHS[a.m - 1]} ${a.d} – ${MONTHS[b.m - 1]} ${b.d}, ${b.y}`;
  return `${MONTHS[a.m - 1]} ${a.d}–${b.d}, ${a.y}`;
}
