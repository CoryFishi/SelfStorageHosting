import type { PostalAddressInput } from "./schema";

// Self-storage industry events, each confirmed on its organizer's own page on
// verifiedOn (Appendix A.1). Only confirmed events belong here. Dates are
// calendar dates at the venue.
//
// Review every quarter (spec 14 E1): re-check each source, update verifiedOn,
// and add newly announced events. /events hides an event once its last day
// has passed, so an outdated row disappears on its own, but new events only
// appear when someone adds them.
export type IndustryEvent = {
  name: string;
  startDate: string;
  endDate?: string;
  /** Times or sub-schedules exactly as the organizer states them. */
  detail?: string;
  venue: string;
  address: PostalAddressInput;
  organizer: string;
  /** The organizer's own page for the event. */
  source: string;
  verifiedOn: string;
};

export const EVENTS: IndustryEvent[] = [
  {
    name: "OHSSA Networking Event",
    startDate: "2026-09-23",
    detail: "Evening, 6–8 pm",
    venue: "Pin Mechanical Company",
    address: {
      streetAddress: "4117 Worth Avenue",
      addressLocality: "Columbus",
      addressRegion: "OH",
      addressCountry: "US",
    },
    organizer: "OHSSA",
    source: "https://www.ohiossa.org/Events/Upcoming-Events",
    verifiedOn: "2026-09-18",
  },
  {
    name: "NVSSA Education Day",
    startDate: "2026-10-06",
    detail: "8:30 am – 3:00 pm",
    venue: "Peppermill",
    address: { addressLocality: "Reno", addressRegion: "NV", addressCountry: "US" },
    organizer: "NVSSA",
    source: "https://www.nvssa.org/Events/Upcoming-Events",
    verifiedOn: "2026-09-18",
  },
  {
    name: "VASSA Seminar",
    startDate: "2026-10-07",
    venue: "The Westin Richmond",
    address: {
      streetAddress: "6631 West Broad Street",
      addressLocality: "Richmond",
      addressRegion: "VA",
      postalCode: "23230",
      addressCountry: "US",
    },
    organizer: "VASSA",
    source: "https://www.virginiassa.org/Events/Upcoming-Events",
    verifiedOn: "2026-09-18",
  },
  {
    name: "IL-SSA Fall Summit",
    startDate: "2026-10-07",
    venue: "I-Hotel & Illinois Conference Center",
    address: {
      streetAddress: "1900 S First St",
      addressLocality: "Champaign",
      addressRegion: "IL",
      postalCode: "61820",
      addressCountry: "US",
    },
    organizer: "IL-SSA",
    source: "https://www.ilselfstorage.org/Events/Upcoming-Events",
    verifiedOn: "2026-09-18",
  },
  {
    name: "Southeastern Self Storage Conference & Trade Show",
    startDate: "2026-10-25",
    endDate: "2026-10-27",
    venue: "Hyatt Regency Greenville",
    address: {
      streetAddress: "220 N Main Street",
      addressLocality: "Greenville",
      addressRegion: "SC",
      postalCode: "29601",
      addressCountry: "US",
    },
    organizer: "GASSA and SCSSA",
    source: "https://gascstorageconference.com/",
    verifiedOn: "2026-09-18",
  },
  {
    name: "NCSSA Convention & Trade Show",
    startDate: "2026-11-09",
    endDate: "2026-11-10",
    venue: "Grandover Resort and Spa",
    address: {
      streetAddress: "1000 Club Road",
      addressLocality: "Greensboro",
      addressRegion: "NC",
      postalCode: "27407",
      addressCountry: "US",
    },
    organizer: "NCSSA",
    source: "https://www.ncssaonline.org/aws/NCSSA/pt/sp/conference",
    verifiedOn: "2026-09-18",
  },
  {
    name: "Self Storage Week 2026",
    startDate: "2026-11-10",
    endDate: "2026-11-12",
    detail: "Trade show November 11–12",
    venue: "The Star Gold Coast",
    address: { addressLocality: "Gold Coast", addressRegion: "QLD", addressCountry: "AU" },
    organizer: "SSAA",
    source: "https://selfstorage.org.au/convention26/",
    verifiedOn: "2026-09-18",
  },
  {
    name: "SSAM Conference & Trade Show",
    startDate: "2026-11-16",
    endDate: "2026-11-17",
    venue: "MGM Grand Detroit",
    address: { addressLocality: "Detroit", addressRegion: "MI", addressCountry: "US" },
    organizer: "SSAM",
    source: "https://www.selfstoragemichigan.org/Events/SSAM-Annual-Conference-Trade-Show",
    verifiedOn: "2026-09-18",
  },
  {
    name: "2027 Executive Ski Workshop",
    startDate: "2027-01-11",
    endDate: "2027-01-14",
    venue: "Telluride Conference Center",
    address: { addressLocality: "Telluride", addressRegion: "CO", addressCountry: "US" },
    organizer: "Self Storage Association (SSA)",
    source: "https://www.selfstorage.org/Events-Education/Events/Executive-Ski-Workshop",
    verifiedOn: "2026-09-18",
  },
  {
    name: "Inside Self-Storage World Expo",
    startDate: "2027-03-30",
    endDate: "2027-04-02",
    detail: "Education March 30 – April 2; exhibits March 31 – April 1",
    venue: "Caesars Forum Conference Center",
    address: {
      streetAddress: "3911 Koval Lane",
      addressLocality: "Las Vegas",
      addressRegion: "NV",
      postalCode: "89109",
      addressCountry: "US",
    },
    organizer: "Inside Self-Storage (Informa Markets)",
    source: "https://www.issworldexpo.com/",
    verifiedOn: "2026-09-18",
  },
  {
    name: "ISC West",
    startDate: "2027-04-05",
    endDate: "2027-04-09",
    detail: "SIA Education@ISC April 5–8; exhibit hall April 7–9",
    venue: "The Venetian Expo",
    address: {
      streetAddress: "201 Sands Ave",
      addressLocality: "Las Vegas",
      addressRegion: "NV",
      postalCode: "89169",
      addressCountry: "US",
    },
    organizer: "RX",
    source: "https://www.discoverisc.com/west/en-us/explore/hours-and-location.html",
    verifiedOn: "2026-09-18",
  },
  {
    name: "2027 SSA Spring Conference & Trade Show",
    startDate: "2027-04-28",
    endDate: "2027-04-30",
    venue: "Savannah Convention Center",
    address: { addressLocality: "Savannah", addressRegion: "GA", addressCountry: "US" },
    organizer: "Self Storage Association (SSA)",
    // SSA's calendar is the only place SSA states this event.
    source: "https://www.selfstorage.org/Events-Education/All-Events",
    verifiedOn: "2026-09-18",
  },
  {
    name: "2027 SSA Fall Conference & Trade Show",
    startDate: "2027-09-07",
    endDate: "2027-09-10",
    venue: "Aria Resort & Casino",
    address: { addressLocality: "Las Vegas", addressRegion: "NV", addressCountry: "US" },
    organizer: "Self Storage Association (SSA)",
    source: "https://www.selfstorage.org/Events-Education/Events/National-Fall-Conference",
    verifiedOn: "2026-09-18",
  },
];

/**
 * Events whose last day is `today` (YYYY-MM-DD) or later, earliest first.
 * Returns a new array and leaves `events` as it was.
 */
export function upcomingEvents(today: string, events: readonly IndustryEvent[] = EVENTS): IndustryEvent[] {
  return events
    .filter((e) => (e.endDate ?? e.startDate) >= today)
    .sort((a, b) => (a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0));
}
