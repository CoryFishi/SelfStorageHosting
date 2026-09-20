import { isLive } from "@/lib/site";

// Which internal paths a link may name: built routes only.
//
// Both link guards use this: tests/source-links.test.ts for every href
// literal in the source, and tests/rendered.test.ts for every link in the
// built HTML. A page that is not built yet is added to ROUTES with
// `built: false`, and no link may name it until the commit that builds it
// flips the flag.
//
// INTERIM, Plan 3 Tasks 3-7 only. The five articles link one another and
// each lands in its own task, so an article may name one that a later task
// builds. Plan 3 Task 9 deletes this list once all five are built.
const PLANNED_ARTICLES = new Set([
  "/resources/falconxt-end-of-life",
  "/resources/gate-not-syncing",
  "/resources/digigate-replacement",
  "/resources/self-storage-gate-compatibility",
  "/resources/self-storage-gate-server",
]);

export function allowedLink(p: string): boolean {
  return isLive(p) || PLANNED_ARTICLES.has(p.split("#")[0]);
}
