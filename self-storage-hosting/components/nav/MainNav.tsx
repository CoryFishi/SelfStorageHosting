"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IoMdArrowDropdown } from "react-icons/io";
import { HiMenu, HiX } from "react-icons/hi";
import { liveNav } from "@/lib/site";
import { CHROME, FOCUS_RING } from "./chrome";

// "/solutions" -> "menu-solutions". Concatenating without the extra hyphen
// matters only for legibility; the leading "/" already becomes one.
const menuId = (href: string) => `menu${href.replace(/\//g, "-")}`;

export default function MainNav() {
  const { main } = liveNav();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const mobileToggle = useRef<HTMLButtonElement>(null);

  // Escape closes the mobile panel from anywhere on the page, and the listener
  // is on `document` rather than on <header> for a reason found by testing: the
  // skip link is rendered by the marketing layout OUTSIDE <header>, so a
  // keyboard user who tabs to it while the panel is open is past the header's
  // subtree and a header-scoped handler never sees the key. A menu you cannot
  // dismiss from wherever focus happens to be is a trap. Focus returns to the
  // trigger because the panel is about to be `hidden`, and focus left inside a
  // hidden element falls to <body>.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMobileOpen(false);
      mobileToggle.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header className={CHROME}>
      <nav
        aria-label="Main"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6"
      >
        <Link href="/" className={`flex items-center gap-2 ${FOCUS_RING}`}>
          <Image src="/Logo.png" alt="" width={48} height={48} className="h-12 w-auto" />
          <span className="text-lg font-medium">Self Storage Hosting</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center md:flex">
          {main.map((item) =>
            item.children ? (
              <div
                key={item.href}
                className="relative"
                onMouseLeave={() => setOpenMenu(null)}
                onKeyDown={(e) => {
                  if (e.key !== "Escape" || openMenu !== item.href) return;
                  setOpenMenu(null);
                  // The panel is about to be `hidden`. Without moving focus back
                  // to the trigger, focus falls to <body> and a keyboard user
                  // loses their place in the nav entirely.
                  e.currentTarget.querySelector("button")?.focus();
                }}
              >
                <button
                  type="button"
                  aria-expanded={openMenu === item.href}
                  aria-controls={menuId(item.href)}
                  onClick={() => setOpenMenu(openMenu === item.href ? null : item.href)}
                  onMouseEnter={() => setOpenMenu(item.href)}
                  className={`flex h-20 items-center gap-1 px-3 hover:underline ${FOCUS_RING}`}
                >
                  {item.label}
                  <IoMdArrowDropdown aria-hidden="true" className="text-accent-200" />
                </button>
                <div
                  id={menuId(item.href)}
                  hidden={openMenu !== item.href}
                  className="absolute left-0 top-20 z-20 min-w-56 rounded-b-lg bg-primary-700 py-2 shadow-lg"
                >
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={`block px-4 py-2 font-medium hover:bg-primary-800 ${FOCUS_RING}`}
                    onClick={() => setOpenMenu(null)}
                  >
                    All {item.label}
                  </Link>
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      aria-current={pathname === c.href ? "page" : undefined}
                      className={`block px-4 py-2 hover:bg-primary-800 ${FOCUS_RING}`}
                      onClick={() => setOpenMenu(null)}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`flex h-20 items-center px-3 hover:underline ${FOCUS_RING}`}
              >
                {item.label}
              </Link>
            )
          )}
          <Link
            href="/contact"
            className={`ml-4 rounded-full bg-accent-50 px-4 py-2 font-medium text-text-950 hover:bg-accent-200 ${FOCUS_RING}`}
          >
            Talk to Sales
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          ref={mobileToggle}
          type="button"
          className={`p-2 md:hidden ${FOCUS_RING}`}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <HiX aria-hidden="true" className="text-2xl" />
          ) : (
            <HiMenu aria-hidden="true" className="text-2xl" />
          )}
        </button>
      </nav>

      {/* Mobile panel. A <nav> rather than a <div>: it is the only navigation
          surface at this breakpoint, and as a bare <div> inside <header> a
          screen-reader user browsing by landmark could not find it at all. */}
      <nav
        id="mobile-menu"
        aria-label="Mobile"
        hidden={!mobileOpen}
        className="border-t border-primary-500 md:hidden"
      >
        <ul className="px-4 py-2">
          {main.map((item) => (
            <li key={item.href} className="py-1">
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`block py-2 font-medium ${FOCUS_RING}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
              {item.children && (
                <ul className="ml-4 border-l border-primary-500 pl-4">
                  {item.children.map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        aria-current={pathname === c.href ? "page" : undefined}
                        className={`block py-2 text-sm ${FOCUS_RING}`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li className="py-3">
            <Link
              href="/contact"
              className={`inline-block rounded-full bg-accent-50 px-4 py-2 font-medium text-text-950 ${FOCUS_RING}`}
              onClick={() => setMobileOpen(false)}
            >
              Talk to Sales
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
