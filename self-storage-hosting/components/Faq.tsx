"use client";

import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";

export type FaqItem = { q: string; a: string };

export default function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-background-200 rounded-2xl border border-background-200 bg-white/70">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `faq-panel-${i}`;
        const buttonId = `faq-button-${i}`;
        return (
          <div key={item.q}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent-600"
              >
                <span>{item.q}</span>
                <BiChevronDown
                  aria-hidden="true"
                  className={`shrink-0 text-2xl transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
              <p className="px-6 pb-5 pr-8">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
