"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IoMdArrowDropdown } from "react-icons/io";
import { HiMenu, HiX } from "react-icons/hi";
import { NAV } from "@/lib/site";

export default function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-background-500 bg-primary-700 text-text-50">
      <nav
        aria-label="Main"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6"
      >
        <Link href="/" className="flex items-center gap-2">
          <Image src="/Logo.png" alt="" width={48} height={48} className="h-12 w-auto" />
          <span className="text-lg font-medium">Self Storage Hosting</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center md:flex">
          {NAV.main.map((item) =>
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
                  aria-controls={`menu-${item.href.replace(/\//g, "-")}`}
                  onClick={() => setOpenMenu(openMenu === item.href ? null : item.href)}
                  onMouseEnter={() => setOpenMenu(item.href)}
                  className="flex h-20 items-center gap-1 px-3 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-200"
                >
                  {item.label}
                  <IoMdArrowDropdown aria-hidden="true" className="text-accent-200" />
                </button>
                <div
                  id={`menu-${item.href.replace(/\//g, "-")}`}
                  hidden={openMenu !== item.href}
                  className="absolute left-0 top-20 z-20 min-w-56 rounded-b-lg bg-primary-700 py-2 shadow-lg"
                >
                  <Link
                    href={item.href}
                    className="block px-4 py-2 font-medium hover:bg-primary-800"
                    onClick={() => setOpenMenu(null)}
                  >
                    All {item.label}
                  </Link>
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="block px-4 py-2 hover:bg-primary-800"
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
                className="flex h-20 items-center px-3 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-200"
              >
                {item.label}
              </Link>
            )
          )}
          <Link
            href="/contact"
            className="ml-4 rounded-full bg-accent-50 px-4 py-2 font-medium text-text-950 hover:bg-accent-200"
          >
            Talk to Sales
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="p-2 md:hidden"
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

      {/* Mobile panel */}
      <div id="mobile-menu" hidden={!mobileOpen} className="border-t border-primary-500 md:hidden">
        <ul className="px-4 py-2">
          {NAV.main.map((item) => (
            <li key={item.href} className="py-1">
              <Link href={item.href} className="block py-2 font-medium" onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
              {item.children && (
                <ul className="ml-4 border-l border-primary-500 pl-4">
                  {item.children.map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>
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
              className="inline-block rounded-full bg-accent-50 px-4 py-2 font-medium text-text-950"
              onClick={() => setMobileOpen(false)}
            >
              Talk to Sales
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
