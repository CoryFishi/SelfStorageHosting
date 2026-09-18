import Link from "next/link";
import { NAV } from "@/lib/site";

export default function TopBar() {
  return (
    <div className="w-full border-b border-background-500 bg-primary-700 text-text-50">
      <nav
        aria-label="Utility"
        className="mx-auto flex h-7 max-w-7xl items-center justify-end px-4 text-xs sm:px-6"
      >
        {NAV.utility.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex h-full items-center px-3 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-200"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
