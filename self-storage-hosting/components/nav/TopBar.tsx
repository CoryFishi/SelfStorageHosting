import Link from "next/link";
import { NAV } from "@/lib/site";
import { CHROME, FOCUS_RING } from "./chrome";

export default function TopBar() {
  return (
    <div className={CHROME}>
      <nav
        aria-label="Utility"
        className="mx-auto flex h-7 max-w-7xl items-center justify-end px-4 text-xs sm:px-6"
      >
        {NAV.utility.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex h-full items-center px-3 hover:underline ${FOCUS_RING}`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
