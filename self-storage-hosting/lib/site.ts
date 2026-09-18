export const SITE = {
  // `??` only catches null/undefined, so a variable that is SET but empty
  // (`NEXT_PUBLIC_SITE_URL=""`) would defeat the fallback and build every
  // canonical, the sitemap and metadataBase from "". `||` treats "" the same
  // as absent, which is the property actually wanted here.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://selfstoragehosting.com").replace(/\/$/, ""),
  name: "Self Storage Hosting",
  description:
    "Cloud-hosted access control and facility websites for independent self-storage operators.",
  locale: "en_US",

  // Spec §14 B and C: real social profile URLs and business contact details
  // are owner inputs that do not exist yet. Keep these empty until supplied —
  // organizationSchema() omits sameAs and contactPoint when they are, which is
  // correct. A placeholder email or an invented profile URL would be worse
  // than the omission, and inviting Google to crawl a dead profile is worst.
  social: [] as string[],
  contactEmail: "",
};

export type NavLink = { href: string; label: string };
export type NavItem = NavLink & { children?: NavLink[] };

// `indexable` is an SEO decision: may this URL be crawled and listed.
// `built`    is a fact: does a page.tsx for it exist yet.
// They are independent, and the sitemap needs BOTH. Nav renders from this
// table in full so the site's shape is visible, but Plan 1 only builds three
// pages -- advertising the other fourteen in sitemap.xml would hand Google a
// list of URLs that 404. Plan 2 flips each `built` to true as it lands.
export const ROUTES: Record<string, { title: string; indexable: boolean; built: boolean }> = {
  // These three are Plan 1's own pages and are `built: true` ahead of their
  // page.tsx on purpose -- Task 12 creates /, Task 13 /about-us and Task 16
  // /contact, and Task 17's sitemap-coverage test asserts exactly this trio.
  // Do not "correct" them to false to match the rule below: that empties the
  // sitemap and fails that test. The rule below governs Plan 2's routes.
  "/": { title: "Home", indexable: true, built: true },
  "/about-us": { title: "About Us", indexable: true, built: true },
  "/contact": { title: "Contact", indexable: true, built: true },

  // Plan 2 builds everything below. Flip `built` in the same commit that
  // creates the page, never before.
  "/solutions": { title: "Solutions", indexable: true, built: false },
  "/solutions/access-control-hosting": { title: "Cloud Self-Storage Access Control", indexable: true, built: false },
  "/solutions/web-hosting": { title: "Self-Storage Facility Websites", indexable: true, built: false },
  "/resources": { title: "Resources", indexable: true, built: false },
  "/events": { title: "Industry Events", indexable: true, built: false },
  "/support": { title: "Support & Diagnostics", indexable: true, built: false },
  "/demo": { title: "Request a Demo", indexable: true, built: false },
  "/legal/privacy": { title: "Privacy Policy", indexable: true, built: false },
  "/legal/terms": { title: "Terms of Service", indexable: true, built: false },
  "/legal/trademarks": { title: "Trademarks", indexable: true, built: false },
  "/legal/accessibility": { title: "Accessibility Statement", indexable: true, built: false },
  "/case-studies": { title: "Case Studies", indexable: false, built: false },
  "/user/login": { title: "Log In", indexable: false, built: false },
  "/user/register": { title: "Create an Account", indexable: false, built: false },
};

// Paths that appear in FOOTER but are not app pages. Task 9 renders these as
// a plain <a>, and the link-integrity test skips them when checking ROUTES.
export const NON_ROUTE_PATHS = ["/sitemap.xml"];

export const NAV: { utility: NavLink[]; main: NavItem[] } = {
  utility: [
    { href: "/demo", label: "Request a Demo" },
    { href: "/support", label: "Support" },
    { href: "/user/login", label: "Login" },
  ],
  main: [
    {
      href: "/solutions",
      label: "Solutions",
      children: [
        { href: "/solutions/access-control-hosting", label: "Access Control Hosting" },
        { href: "/solutions/web-hosting", label: "Facility Websites" },
      ],
    },
    { href: "/resources", label: "Resources" },
    { href: "/about-us", label: "About Us" },
  ],
};

export const FOOTER: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Solutions",
    links: [
      { href: "/solutions/access-control-hosting", label: "Access Control Hosting" },
      { href: "/solutions/web-hosting", label: "Facility Websites" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/resources", label: "Guides" },
      { href: "/events", label: "Events" },
      { href: "/support", label: "Support" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about-us#story", label: "Our Story" },
      { href: "/about-us#careers", label: "Careers" },
      { href: "/about-us#news", label: "News" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/legal/privacy", label: "Privacy Policy" },
      { href: "/legal/terms", label: "Terms" },
      { href: "/legal/trademarks", label: "Trademarks" },
      { href: "/legal/accessibility", label: "Accessibility" },
      { href: "/sitemap.xml", label: "Sitemap" },
    ],
  },
];

export function indexableRoutes(): string[] {
  return Object.entries(ROUTES)
    .filter(([, meta]) => meta.indexable && meta.built)
    .map(([path]) => path);
}
