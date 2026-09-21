import { SITE } from "@/lib/site";
import { FOCUS_RING_LIGHT } from "./ui/focus";

// The published business address, rendered as a mailto link.
//
// Every legal page offers the reader a way to act on it: a privacy request,
// an accessibility barrier, a trademark complaint. Each of those routed to
// the contact form and nothing else, so a reader whom the form fails -- it
// answered 503 to everyone until 2026-09-20, and a barrier in the form
// itself locks out exactly the person the accessibility statement is for --
// had no way to reach us at all.
//
// Renders nothing when SITE.contactEmail is empty, so the pages degrade to
// their previous form-only wording rather than printing "mailto:" with no
// address. Callers must handle null, which is why this returns it rather
// than an empty fragment.
export default function MailLink({ className }: { className?: string }) {
  if (!SITE.contactEmail) return null;
  return (
    <a
      href={`mailto:${SITE.contactEmail}`}
      className={className ?? `font-semibold underline ${FOCUS_RING_LIGHT}`}
    >
      {SITE.contactEmail}
    </a>
  );
}
