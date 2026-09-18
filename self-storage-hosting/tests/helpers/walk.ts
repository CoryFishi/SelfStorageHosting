import { readdirSync, statSync } from "node:fs";
import path from "node:path";

export const PKG_ROOT = path.resolve(__dirname, "..", "..");

/** Every file under `dir` (absolute), recursively, matching `pattern`. */
export function walk(dir: string, pattern = /\.(tsx?|mdx?)$/): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full, pattern));
    else if (pattern.test(entry)) out.push(full);
  }
  return out;
}

/**
 * Absolute paths under a package-relative directory, matching `pattern`.
 *
 * Deliberately does not catch a missing/misspelled `rel`: every caller uses
 * this to build the file list a guard measures against, and a walker that
 * quietly returns [] on a bad path turns "the walk is broken" into "every
 * assertion about that list passed vacuously." Let readdirSync's ENOENT
 * surface instead.
 */
export function walkFrom(rel: string, pattern?: RegExp): string[] {
  return walk(path.join(PKG_ROOT, rel), pattern);
}
