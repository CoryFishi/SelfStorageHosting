import path from "node:path";
import { PKG_ROOT, walkFrom } from "./walk";

const APP_DIR = path.join(PKG_ROOT, "app");

// Maps each routable URL to the page.tsx that serves it. Route groups like
// (marketing) and (auth) do not appear in the URL.
export function pageFiles(): Map<string, string> {
  const pages = new Map<string, string>();
  for (const file of walkFrom("app", /^page\.tsx$/)) {
    const rel = path.relative(APP_DIR, path.dirname(file));
    const segments = rel === "" ? [] : rel.split(path.sep).filter((s) => !s.startsWith("("));
    pages.set(segments.length === 0 ? "/" : "/" + segments.join("/"), file);
  }
  return pages;
}

// The source text of the `pageMeta({ ... })` argument, braces balanced, or null
// if the file does not call it. Scoping an assertion to this slice is the
// whole point. `path:` also appears in every breadcrumb entry, so searching
// the whole file would let a page whose breadcrumb names the right route pass
// with the WRONG canonical in pageMeta. Brace counting is enough because
// pageMeta's arguments are plain strings with no braces in them. A template
// literal containing "{" would need a real parser.
export function pageMetaArg(src: string): string | null {
  const call = src.search(/pageMeta\s*\(\s*\{/);
  if (call === -1) return null;
  const open = src.indexOf("{", call);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}" && --depth === 0) return src.slice(open, i + 1);
  }
  return null;
}
