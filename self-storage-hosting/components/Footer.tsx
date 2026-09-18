import Link from "next/link";
import { FOOTER, SITE, NON_ROUTE_PATHS } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 bg-primary-700 text-text-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav aria-label="Footer" className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER.map((col) => (
            <div key={col.heading}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-200">
                {col.heading}
              </h2>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => {
                  const cls =
                    "text-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-200";
                  return (
                    <li key={l.href}>
                      {NON_ROUTE_PATHS.includes(l.href) ? (
                        <a href={l.href} className={cls}>
                          {l.label}
                        </a>
                      ) : (
                        <Link href={l.href} className={cls}>
                          {l.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="space-y-2 border-t border-white/10 py-6">
          <p className="text-xs text-accent-200">
            {year} © {SITE.name}. All rights reserved.
          </p>
          <p className="text-xs text-accent-200">
            All third-party product names and marks are the property of their
            owners. No affiliation or endorsement is implied.
          </p>
        </div>
      </div>
    </footer>
  );
}
