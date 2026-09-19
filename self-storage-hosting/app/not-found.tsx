import Link from "next/link";
import SiteChrome from "@/components/SiteChrome";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

export default function NotFound() {
  return (
    <SiteChrome mainClassName="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-20 text-center">
        <p className="text-7xl font-bold sm:text-9xl" aria-hidden="true">
          Oops!
        </p>
        <h1 className="font-bold">404 — Page not found</h1>
        <p className="max-w-sm text-sm">
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>
        <Link
          href="/"
          className={`mt-8 rounded-full bg-accent-500 px-5 py-2.5 font-medium text-text-950 shadow-lg transition hover:bg-accent-400 ${FOCUS_RING_LIGHT}`}
        >
          Go to homepage
        </Link>
    </SiteChrome>
  );
}
