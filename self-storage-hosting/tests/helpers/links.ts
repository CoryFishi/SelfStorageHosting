import { isLive } from "@/lib/site";

// Which internal paths a link may name: built routes only.
//
// Both link guards use this: tests/source-links.test.ts for every href
// literal in the source, and tests/rendered.test.ts for every link in the
// built HTML. A page that is not built yet is added to ROUTES with
// `built: false`, and no link may name it until the commit that builds it
// flips the flag.
export function allowedLink(p: string): boolean {
  return isLive(p);
}
