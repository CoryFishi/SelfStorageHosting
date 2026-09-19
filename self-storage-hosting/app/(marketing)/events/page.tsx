import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { eventSchema } from "@/lib/schema";
import { upcomingEvents, type IndustryEvent } from "@/lib/events";
import { formatDate, formatDateRange } from "@/lib/dates";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

// Regenerated at most once a day, so an event leaves the page within a day of
// ending, with no redeploy. Next reads this value statically: keep it a
// literal number, not an expression.
export const revalidate = 86400;

export const metadata: Metadata = pageMeta({
  title: "Industry Events",
  description:
    "Confirmed self-storage industry conferences and trade shows, each linked to the organizer's own listing.",
  path: "/events",
});

const host = (url: string) => new URL(url).host.replace(/^www\./, "");

function place(e: IndustryEvent): string {
  const { streetAddress, addressLocality, addressRegion, postalCode, addressCountry } = e.address;
  const country = addressCountry === "US" ? "" : addressCountry === "AU" ? ", Australia" : `, ${addressCountry}`;
  const regionZip = postalCode ? `${addressRegion} ${postalCode}` : addressRegion;
  const parts = [e.venue, streetAddress, addressLocality, regionZip].filter(Boolean);
  return `${parts.join(", ")}${country}`;
}

export default function EventsPage() {
  // Today's date in UTC. An event drops off at the first regeneration after
  // its last day has ended in UTC.
  const events = upcomingEvents(new Date().toISOString().slice(0, 10));

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Events", path: "/events" },
        ]}
      />

      <section className="mx-auto max-w-4xl px-4 pt-12 pb-10 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Self-storage industry events</h1>
        <p className="mt-4 text-lg text-text-800">
          Conferences, trade shows and state association meetings for self-storage operators. Each
          listing links to the organizer&apos;s own page and shows the date we last checked it there.
        </p>
        <p className="mt-4 text-text-800">
          Organizers sometimes change dates and venues. Confirm on the organizer&apos;s page before
          you book travel.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Upcoming events</h2>
        {events.length === 0 ? (
          <p className="mt-6 text-text-800">No confirmed events are listed right now.</p>
        ) : (
          <ol className="mt-8 space-y-4">
            {events.map((e) => (
              <li
                key={`${e.name}-${e.startDate}`}
                className="rounded-2xl border border-background-200 bg-background-50 p-5 shadow-sm"
              >
                <JsonLd
                  data={eventSchema({
                    name: e.name,
                    startDate: e.startDate,
                    endDate: e.endDate,
                    locationName: e.venue,
                    address: e.address,
                    organizer: e.organizer,
                    url: e.source,
                  })}
                />
                <h3 className="text-lg font-semibold">{e.name}</h3>
                <p className="mt-1 font-medium text-text-900">{formatDateRange(e.startDate, e.endDate)}</p>
                {e.detail && <p className="text-text-700">{e.detail}</p>}
                <p className="mt-2 text-text-800">{place(e)}</p>
                <p className="text-text-800">Organizer: {e.organizer}</p>
                <p className="mt-3 text-sm text-text-700">
                  Source:{" "}
                  <a href={e.source} className={`font-medium underline ${FOCUS_RING_LIGHT}`}>
                    {host(e.source)}
                  </a>
                  . Checked {formatDate(e.verifiedOn)}.
                </p>
              </li>
            ))}
          </ol>
        )}
        <p className="mt-8 text-sm text-text-700">
          Listing an event here does not mean we attend, sponsor or exhibit at it. Event names
          belong to their organizers.
        </p>
      </section>

      <CtaBand
        heading="Know of an event we should list?"
        text="Send us the organizer's page and we will check it before it goes up."
        primary={{ href: "/contact", label: "Tell us about it" }}
        secondary={{ href: "/solutions", label: "See our solutions" }}
      />
    </>
  );
}
