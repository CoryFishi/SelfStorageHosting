import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { PKG_ROOT, walkFrom } from "./helpers/walk";

// Every component that renders a <form>. Found from the source tree, so a new
// form is held to /legal/accessibility the day it is written.
const forms: [string, string][] = walkFrom("components", /\.tsx$/)
  .map((f): [string, string] => [path.relative(PKG_ROOT, f).split(path.sep).join("/"), readFileSync(f, "utf8")])
  .filter(([, src]) => /<form\b/.test(src));

// Each form control's opening tag, up to the next "<". The attribute values in
// these files are strings, identifiers and ternaries, none of which contain
// "<", so the slice holds the whole tag.
function controls(src: string) {
  return [...src.matchAll(/<(input|select|textarea)\b([^<]*)/g)].map((m) => ({
    attrs: m[2],
    id: m[2].match(/\bid="([^"]+)"/)?.[1] ?? `a <${m[1]}> with no id`,
  }));
}

describe("forms keep the promises made on /legal/accessibility", () => {
  it("finds the site's forms", () => {
    expect(forms.map(([file]) => file)).toEqual(
      expect.arrayContaining(["components/ContactForm.tsx", "components/AuthForm.tsx"])
    );
  });

  it.each(forms)("%s gives every field a visible label", (file, src) => {
    const unlabelled = controls(src)
      .map((c) => c.id)
      .filter((id) => !src.includes(`htmlFor="${id}"`));
    expect(unlabelled, `${file}: fields with no <label htmlFor>: ${unlabelled.join(", ")}`).toEqual([]);
  });

  it.each(forms)("%s marks invalid fields and links each to its message", (file, src) => {
    const checked = controls(src).filter((c) => /aria-invalid=/.test(c.attrs));
    expect(checked.length, `${file} marks no field invalid`).toBeGreaterThan(0);
    const unlinked = checked.filter((c) => !/aria-describedby=/.test(c.attrs)).map((c) => c.id);
    expect(unlinked, `${file}: invalid fields not linked to a message: ${unlinked.join(", ")}`).toEqual([]);
    const targets = new Set([...src.matchAll(/"([A-Za-z]+-(?:error|hint))"/g)].map((m) => m[1]));
    const missing = [...targets].filter((t) => !src.includes(`id="${t}"`));
    expect(missing, `${file}: aria-describedby names no element: ${missing.join(", ")}`).toEqual([]);
  });

  it.each(forms)("%s announces its result in a live region", (file, src) => {
    expect(src, `${file} has no role="status" aria-live="polite" region`).toMatch(
      /role="status"\s+aria-live="polite"|aria-live="polite"\s+role="status"/
    );
  });

  it.each(forms)("%s tells password managers what each password field holds", (file, src) => {
    const bare = controls(src)
      .filter((c) => /type="password"/.test(c.attrs) && !/autoComplete=/.test(c.attrs))
      .map((c) => c.id);
    expect(bare, `${file}: password fields with no autoComplete: ${bare.join(", ")}`).toEqual([]);
  });

  it("uses the password autocomplete values spec 6.10 names", () => {
    const auth = forms.find(([file]) => file === "components/AuthForm.tsx")?.[1] ?? "";
    expect(auth).toContain('"current-password"');
    expect(auth).toContain('"new-password"');
  });
});
