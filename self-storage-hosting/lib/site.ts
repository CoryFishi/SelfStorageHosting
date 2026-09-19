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
// They are independent, and the sitemap needs BOTH. Nav and footer render
// through liveNav()/liveFooter(), which drop anything not yet built, and
// Plan 1 only builds three pages -- advertising the other fourteen in
// sitemap.xml would hand Google a list of URLs that 404. Plan 2 flips each
// `built` to true as it lands.
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
  "/solutions": { title: "Solutions", indexable: true, built: true },
  "/solutions/access-control-hosting": { title: "Cloud Self-Storage Access Control", indexable: true, built: true },
  "/solutions/web-hosting": { title: "Self-Storage Facility Websites", indexable: true, built: true },
  "/resources": { title: "Resources", indexable: true, built: false },
  "/events": { title: "Industry Events", indexable: true, built: true },
  "/support": { title: "Support & Diagnostics", indexable: true, built: true },
  "/demo": { title: "Request a Demo", indexable: true, built: true },
  "/legal/privacy": { title: "Privacy Policy", indexable: true, built: false },
  "/legal/terms": { title: "Terms of Service", indexable: true, built: false },
  "/legal/trademarks": { title: "Trademarks", indexable: true, built: false },
  "/legal/accessibility": { title: "Accessibility Statement", indexable: true, built: false },
  "/case-studies": { title: "Case Studies", indexable: false, built: true },
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

/**
 * True when `href` leads somewhere real: a built page, or a file such as the
 * sitemap. A `#fragment` is ignored here. Whether the anchor exists on the
 * page is checked by tests/source-links.test.ts.
 */
export function isLive(href: string): boolean {
  const path = href.split("#")[0];
  if (NON_ROUTE_PATHS.includes(path)) return true;
  return ROUTES[path]?.built === true;
}

/**
 * Throws when `href` is not live. Components that take a link as a prop
 * (Breadcrumbs, CtaBand) call this while rendering. Every marketing page is
 * prerendered, so a dead link fails `next build` instead of shipping.
 */
export function assertLive(href: string, context: string): void {
  if (!isLive(href)) {
    throw new Error(`${context} links to ${href}, which is not a built route`);
  }
}

/**
 * NAV with every dead link removed. A main item survives only if its own page
 * is built. Its children are filtered. When none remain, the `children` key
 * is dropped entirely, because MainNav renders a dropdown for any `children`
 * value and an empty dropdown is a dead control.
 */
export function liveNav(): { utility: NavLink[]; main: NavItem[] } {
  return {
    utility: NAV.utility.filter((l) => isLive(l.href)),
    main: NAV.main
      .filter((item) => isLive(item.href))
      .map(({ children, ...item }) => {
        const live = (children ?? []).filter((c) => isLive(c.href));
        return live.length > 0 ? { ...item, children: live } : item;
      }),
  };
}

/** FOOTER with every dead link removed, and any column left empty dropped. */
export function liveFooter(): { heading: string; links: NavLink[] }[] {
  return FOOTER.map((col) => ({ ...col, links: col.links.filter((l) => isLive(l.href)) })).filter(
    (col) => col.links.length > 0
  );
}
