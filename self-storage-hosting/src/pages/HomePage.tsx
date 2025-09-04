import { Link } from "react-router-dom";
import { useState } from "react";
import { BiCloudUpload, BiRightArrow, BiRightArrowAlt } from "react-icons/bi";

export default function HomePage() {
  return (
    <div className="bg-[var(--color-bg-website)] text-[var(--color-text-website)]">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[600px] flex flex-col justify-center">
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:grid lg:grid-cols-12 lg:gap-8 lg:py-28">
          <div className="lg:col-span-6">
            <Eyebrow>Self Storage Hosting</Eyebrow>
            <h1 className="mt-3 text-4xl/tight font-extrabold sm:text-4xl">
              Improve Operational Efficiency and Stay Serverless
            </h1>
            <p className="mt-4 text-lg text-[color:rgb(21_30_30/0.78)]">
              Our self-storage facility solutions are designed to be easy to
              find and easy to use—helping you maintain a cleaner solution for
              your customers.
            </p>

            <div className="mt-8">
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-3 font-semibold hover:opacity-90"
              >
                Get Started
                <BiRightArrowAlt />
              </Link>
            </div>
          </div>
          {/* Icon */}
          <div className="mt-12 lg:mt-0 lg:col-span-6 flex items-center justify-center">
            <BiCloudUpload className="text-9xl" />
          </div>
        </div>
      </section>

      {/* ADD-ONS / FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-20 min-h-[500px] justify-center flex flex-col">
        <Eyebrow>Maximizing Your Facility Efficiency</Eyebrow>
        <h2 className="mt-3 text-3xl/tight sm:text-4xl font-extrabold">
          Powerful Solutions to Grow Your Impact
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <FeatureCard
            title="Personalized Web Hosting Services"
            to="/solutions/web-hosting"
            desc="Increase your rentals by allowing tenants to rent and pay online. "
          />
          <FeatureCard
            title="Cloud Managed Access Control Integrations"
            to="/solutions/access-control-hosting"
            desc="Let your gate/access control systems be hosted in the cloud for easier operation and less down time."
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-6 pb-20 min-h-[600px] flex flex-col justify-center">
        <h2 className="text-center text-3xl/tight sm:text-4xl font-extrabold">
          FAQs
        </h2>
        <div className="mt-10">
          <FAQ
            items={[
              {
                q: "Do these websites automatically sync with our inventory?",
                a: "Yes. We integrate with your PMS and/or inventory sources so availability, pricing, and promotions stay in sync.",
              },
              {
                q: "Can tenants make payments and move-in online?",
                a: "Absolutely. Online move-ins and payments are supported, including reservations, ID capture, e-signature, and receipts.",
              },
              {
                q: "Can we make changes to the website ourselves?",
                a: "You’ll get an easy-to-use editor for content and assets. Our team can also handle updates and campaigns for you.",
              },
              {
                q: "Can we keep our domain name?",
                a: "Yes—use your existing domain or provision a new one. We manage SSL and renewals.",
              },
            ]}
          />
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="min-h-[200px]">
        <div className="mx-auto max-w-7xl px-6 py-12 flex gap-2 items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold">
              Ready to make the move to the cloud?
            </h3>
            <p className="opacity-90">
              Talk to our team to see a tailored demo for your portfolio.
            </p>
          </div>
          <Link
            to="/demo"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-bg-website-dark)] px-5 py-3 font-semibold text-[var(--color-text-website-dark)] hover:bg-[color:rgba(255,255,255,0.12)] focus:outline-none focus:ring-4 focus:ring-white/20"
          >
            Request a Demo
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M13 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ---------- pieces ---------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-semibold tracking-[0.18em] uppercase text-[color:var(--color-secondary-website)]">
      {children}
      <span className="block h-[3px] w-12 rounded bg-[var(--color-accent-website)] mt-2" />
    </div>
  );
}

function FeatureCard({
  title,
  desc,
  to,
}: {
  title: string;
  desc: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-xl border border-[color:rgb(8_14_14/0.12)] bg-white/70 backdrop-blur p-6 hover:border-[var(--color-accent-website)] transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-bold text-[var(--color-text-website)]">
          {title}
        </h3>
        <span className="text-[var(--color-accent-website)] transition-transform group-hover:translate-x-1">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h14M13 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      <p className="mt-2 text-[color:rgb(8_14_14/0.7)]">{desc}</p>
    </Link>
  );
}

function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y rounded-2xl border border-[color:rgb(8_14_14/0.1)] bg-white/70">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <button
            key={i}
            onClick={() => setOpen(isOpen ? null : i)}
            className="w-full text-left"
            aria-expanded={isOpen}
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="text-lg font-semibold">{item.q}</span>
              <svg
                className={`h-5 w-5 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M6 8l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div
              className={`px-6 pb-5 text-[color:rgb(8_14_14/0.75)] transition-[grid-template-rows] ${
                isOpen ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="pr-2">{item.a}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
