import { Link } from "react-router-dom";
import { useState } from "react";
import {
  BiCloudUpload,
  BiDownArrow,
  BiRightArrowAlt,
  BiUpArrow,
} from "react-icons/bi";

export default function HomePage() {
  const [open, setOpen] = useState<number | null>(null);

  const items = [
    {
      q: "Do we need an on-site server for access control?",
      a: "No—it's cloud-hosted. A small on-site bridge talks to your gate/locks and syncs with the cloud.",
    },
    {
      q: "Which access control hardware do you support?",
      a: "Most modern gate operators, keypads, and smart locks via APIs or adapters; connectors exist for common vendors.",
    },
    {
      q: "How fast are open/lock commands from the cloud?",
      a: "Near real-time; typical round-trip is about 1–3 seconds depending on your facility network.",
    },
    {
      q: "Is multi-site management supported?",
      a: "Yes—single dashboard with roles/permissions, per-facility controls, and full audit logs.",
    },
    {
      q: "Do you host small marketing websites too?",
      a: "Yes—fast sites on your domain with SSL, CDN, forms/lead capture, and optional online move-ins.",
    },
    {
      q: "How do integrations work?",
      a: "REST/JSON API and webhooks; or pre-built connectors for common self-storage software.",
    },
    {
      q: "How is data secured?",
      a: "TLS in transit, encryption at rest, MFA/SSO for staff, per-tenant isolation, and detailed audit trails.",
    },
  ];

  return (
    <div className="bg-[var(--color-bg-website)] text-[var(--color-text-website)]">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[600px] flex flex-col justify-center">
        <div className="relative mx-auto max-w-7xl px-6 py-20 flex lg:gap-8 lg:py-28">
          <div className="lg:col-span-6">
            <div className="text-xs font-semibold tracking-[0.18em] uppercase">
              Self Storage Hosting
              <span className="block h-[3px] w-12 rounded bg-accent-500 mt-2" />
            </div>
            <h1 className="mt-3 text-4xl/tight font-extrabold sm:text-4xl">
              Improve Operational Efficiency and Stay Serverless
            </h1>
            <p className="mt-4 text-lg text-text-800">
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
          <img src="/HeroImage.png" alt="" className="h-96 w-96" />
        </div>
      </section>

      {/* ADD-ONS / FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-20 min-h-[500px] justify-center flex flex-col">
        <div className="text-xs font-semibold tracking-[0.18em] uppercase">
          Maximizing Your Facility Efficiency
          <span className="block h-[3px] w-12 rounded bg-accent-500 mt-2" />
        </div>
        <h2 className="mt-3 text-3xl/tight sm:text-4xl font-extrabold">
          Powerful Solutions to Grow Your Impact
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Link
            to={"/solutions/web-hosting"}
            className="group rounded-xl border border-background-200 bg-white/70 backdrop-blur p-6 hover:border-accent-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold">
                Personalized Web Hosting Services
              </h3>
              <span className="transition-transform group-hover:translate-x-1">
                <BiRightArrowAlt className="text-accent-700 text-2xl" />
              </span>
            </div>
            <p className="mt-2">
              Increase your rentals by allowing tenants to rent and pay online.
            </p>
          </Link>
          <Link
            to={"/solutions/access-control-hosting"}
            className="group rounded-xl border border-background-200 bg-white/70 backdrop-blur p-6 hover:border-accent-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold">
                Cloud Managed Access Control Integrations
              </h3>
              <span className="transition-transform group-hover:translate-x-1">
                <BiRightArrowAlt className="text-accent-700 text-2xl" />
              </span>
            </div>
            <p className="mt-2">
              Let your gate/access control systems be hosted in the cloud for
              easier operation and less down time.
            </p>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-6 pb-20 min-h-[900px] flex flex-col justify-center">
        <h2 className="text-center text-3xl/tight sm:text-4xl font-extrabold">
          FAQs
        </h2>
        <div className="mt-10">
          <div className="divide-y divide-background-100 rounded-2xl border border-background-100 bg-white/70">
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <button
                  key={i}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center justify-between px-6 py-5">
                    <span className="text-lg font-semibold">{item.q}</span>
                    {isOpen ? <BiUpArrow /> : <BiDownArrow />}
                  </div>
                  <div
                    className={`px-6 transition-[grid-template-rows] ${
                      isOpen
                        ? "grid grid-rows-[1fr] pb-5"
                        : "grid grid-rows-[0fr]"
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
        </div>
      </section>

      {/* CTA STRIP */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-12 flex gap-2 justify-between items-center min-h-[300px]">
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
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold hover:bg-accent-300 bg-accent-400 focus:outline-none focus:ring-4 focus:ring-white/20"
          >
            Request a Demo
            <span className="transition-transform group-hover:translate-x-1">
              <BiRightArrowAlt className="text-accent-700 text-2xl" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
