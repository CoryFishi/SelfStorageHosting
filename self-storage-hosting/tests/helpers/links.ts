import { ROUTES, isLive } from "@/lib/site";

// Which internal paths a link may name.
//
// INTERIM RULE. Task 15 of the remaining-pages plan replaces the body of
// allowedLink with `return isLive(p);`. Pages land one at a time, and the home
// and about-us pages already link /solutions, /demo and both solution pages,
// which later tasks build. Until then a link may name a route that is in
// ROUTES but not yet built. It may never name /resources (Plan 3) or anything
// outside ROUTES.
const isPlan3 = (p: string) => p === "/resources" || p.startsWith("/resources/");

export function allowedLink(p: string): boolean {
  return isLive(p) || (p in ROUTES && !isPlan3(p));
}
