import Link from "next/link";
import { assertLive } from "@/lib/site";
import { FOCUS_RING } from "@/components/ui/focus";

export type CtaLink = { href: string; label: string };

/**
 * The dark call-to-action strip at the foot of a page. Both targets are
 * checked at render, so a CTA can never point at a page that is not built.
 * The colours are the dark-chrome pairs (text-50 and accent-200 on
 * primary-700, text-950 on accent-50), and the contrast test measures each.
 */
export default function CtaBand({
  heading,
  text,
  primary,
  secondary,
}: {
  heading: string;
  text: string;
  primary: CtaLink;
  secondary?: CtaLink;
}) {
  assertLive(primary.href, `CTA "${primary.label}"`);
  if (secondary) assertLive(secondary.href, `CTA "${secondary.label}"`);
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-primary-700 p-8 text-text-50 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold">{heading}</h2>
          <p className="mt-1 text-accent-200">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={primary.href}
            className={`rounded-full bg-accent-50 px-6 py-3 font-semibold text-text-950 hover:bg-accent-200 ${FOCUS_RING}`}
          >
            {primary.label}
          </Link>
          {secondary && (
            <Link
              href={secondary.href}
              className={`rounded-full border border-text-50 px-6 py-3 text-text-50 hover:bg-primary-800 ${FOCUS_RING}`}
            >
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
