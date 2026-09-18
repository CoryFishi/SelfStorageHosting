import {
  BiCloudUpload,
  BiNetworkChart,
  BiShieldAlt2,
  BiServer,
  BiGitBranch,
  BiSupport,
  BiPulse,
  BiRightArrowAlt,
  BiCheckCircle,
  BiTime,
} from "react-icons/bi";

export default function AboutUsPage() {
  const values = [
    {
      icon: BiCloudUpload,
      title: "Cloud-Hosted, Purpose-Built",
      desc: "We host and manage your access control stack in the cloud, purpose-built for self-storage. No on-site servers to babysit.",
    },
    {
      icon: BiNetworkChart,
      title: "Unified Integrations",
      desc: "Bridge gates, smart locks, keypads, and door alarms into a single API and dashboard. Multi-site by default.",
    },
    {
      icon: BiShieldAlt2,
      title: "Security First",
      desc: "RBAC, audit trails, SSO-ready, TLS everywhere, and least-privilege device keys.",
    },
    {
      icon: BiServer,
      title: "Operator-Grade Reliability",
      desc: "Redundant regions, rolling updates, and health checks so your doors work when customers do.",
    },
  ];

  const pillars = [
    {
      icon: BiGitBranch,
      title: "Open APIs",
      desc: "Clean REST + Webhooks for PMS and installer tools. Bring your own workflows.",
    },
    {
      icon: BiPulse,
      title: "Real-Time Telemetry",
      desc: "Live status for locks, gates, sensors, and battery health—actionable alerts, not noise.",
    },
    {
      icon: BiSupport,
      title: "Installer Friendly",
      desc: "Zero-touch provisioning, site templates, and remote diagnostics to cut truck rolls.",
    },
  ];

  const stats = [
    { label: "Managed Sites", value: "100+" },
    { label: "Avg. Uptime", value: "99.95%" },
    { label: "API Latency", value: "< 200 ms" },
    { label: "Regions", value: "US & AU" },
  ];

  const integrations = [
    {
      title: "Gate Controllers",
      desc: "Sync tenant access, schedules, and zones. Remotely open, lockout, or suspend.",
    },
    {
      title: "Smart Locks",
      desc: "Unit-level control and telemetry with audit logging for every action.",
    },
    {
      title: "Keypads & Readers",
      desc: "PIN, card, or mobile credentials with time profiles and holiday rules.",
    },
    {
      title: "Door Alarms & Sensors",
      desc: "Alarms, PIR, and battery monitoring with muted/maintenance modes.",
    },
  ];

  // NEW: PMS → Access Control bridges (your requested examples included)
  const pmsBridges = [
    { from: "StorEdge", to: "OpenTech Alliance", status: "Available" },
    { from: "StorEdge", to: "Digi Gate", status: "Available" },
    {
      from: "Easy Storage Solutions",
      to: "OpenTech Alliance",
      status: "Available",
    },
    {
      from: "Easy Storage Solutions",
      to: "Digi Gate",
      status: "Available",
    },
    { from: "Your PMS", to: "OpenTech Alliance", status: "Planned" },
  ];

  const faqs = [
    {
      q: "How does onboarding work?",
      a: "We provision your cloud tenant, connect your hardware via secure connectors, sync your property data, and go live with staged rollouts by facility.",
    },
    {
      q: "What if site internet goes down?",
      a: "Local controllers keep enforcing last-known rules. When the connection returns, changes resync and audit logs backfill.",
    },
    {
      q: "Do you integrate with my PMS?",
      a: "Yes. We plan to integrate the world of access control to every well known property management solution. Let us know what we can do next!",
    },
    {
      q: "How do you handle security?",
      a: "Encryption in transit/at rest, scoped tokens, RBAC, per-facility isolation, and comprehensive audit exports.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-background-50 text-text-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-background-50" />
        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
              Run your access control from the cloud—fast, secure, and made for
              self-storage
            </h1>
            <p className="mt-4 text-lg text-text-600">
              We unify gates, smart locks, keypads, and sensors from one
              platform to the next via the cloud, to reduce your operational
              costs and risks.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <a
                href="/contact"
                className="rounded-full bg-primary-600 px-6 py-3 text-text-50 shadow-lg transition hover:scale-[1.02] hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                Talk to us
              </a>
              <a
                href="/solutions/access-control-hosting"
                className="rounded-full border border-text-300 bg-background-50 px-6 py-3 text-text-900 transition hover:bg-background-100 focus:outline-none focus:ring-2 focus:ring-secondary-300"
              >
                View pricing
              </a>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-background-200 bg-background-50 px-4 py-5 text-center shadow-sm"
                >
                  <div className="text-2xl font-semibold">{s.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-text-600">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why we exist */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold">Why we exist</h2>
          <p className="mt-3 text-text-600">
            Access control shouldn’t require on-site servers, duct-taped
            scripts, or late-night truck rolls. We bring a clean cloud layer to
            self-storage so you can deploy faster, operate reliably, and
            integrate with the tools you already use.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-background-200 bg-background-50 p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50">
                <Icon className="h-5 w-5 text-primary-700" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-text-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Pillars */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="rounded-3xl bg-background-50 p-8 shadow-sm ring-1 ring-background-200">
          <div className="grid gap-8 md:grid-cols-3">
            {pillars.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="mt-1 rounded-lg bg-secondary-50 p-2">
                  <Icon className="h-6 w-6 text-secondary-700" />
                </div>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-text-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Security + Reliability */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-background-200 p-6">
              <div className="flex items-center gap-2">
                <BiShieldAlt2 className="h-5 w-5 text-primary-700" />
                <h4 className="font-semibold">Security & Compliance</h4>
              </div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-text-600">
                <li>Encryption in transit & at rest</li>
                <li>RBAC with per-facility scoping</li>
                <li>Signed device tokens & key rotation</li>
                <li>Full audit logging & exports</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-background-200 p-6">
              <div className="flex items-center gap-2">
                <BiServer className="h-5 w-5 text-accent-700" />
                <h4 className="font-semibold">Reliability & Operations</h4>
              </div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-text-600">
                <li>Multi-AZ hosting with rolling updates</li>
                <li>Health checks and graceful fallbacks on site outages</li>
                <li>Queue-backed command delivery and retries</li>
                <li>Proactive monitoring and alerts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Integrations */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold">What we integrate</h2>
          <p className="mt-3 text-text-600">
            Bring your existing hardware. We provide the glue—connectors, APIs,
            and a control plane—to orchestrate everything together.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {integrations.map((i) => (
            <div
              key={i.title}
              className="rounded-2xl border border-background-200 bg-background-50 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold">{i.title}</h3>
              <p className="mt-2 text-sm text-text-600">{i.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEW: PMS → Access Control Bridges */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold">
            We integrate from Property Management Solutions to your access
            control
          </h2>
          <p className="mt-3 text-text-600">
            Keep tenants, units, access levels, and lock-outs in sync. Our PMS
            connectors feed your OpenTech Alliance access control in real time.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pmsBridges.map(({ from, to, status }) => {
            const isAvailable = status === "Available";
            const badgeCls = isAvailable
              ? "bg-primary-100 text-primary-700"
              : "bg-accent-100 text-accent-700";
            const Icon = isAvailable ? BiCheckCircle : BiTime;

            return (
              <div
                key={from}
                className="flex items-center justify-between rounded-2xl border border-background-200 bg-background-50 p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-secondary-50 p-2">
                    <BiRightArrowAlt className="h-6 w-6 text-secondary-700" />
                  </div>
                  <div>
                    <div className="text-sm text-text-600">From</div>
                    <div className="text-lg font-semibold">{from}</div>
                    <div className="mt-1 text-sm text-text-600">to</div>
                    <div className="text-lg font-semibold">{to}</div>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${badgeCls}`}
                >
                  <Icon className="h-4 w-4" />
                  {status}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-center">
          <a
            href="/contact"
            className="rounded-full bg-accent-600 px-6 py-3 text-text-50 shadow transition hover:scale-[1.02] hover:bg-accent-500"
          >
            Request your PMS
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold">FAQs</h2>
          <p className="mt-3 text-text-600">
            Quick answers to common questions from operators and installers.
          </p>
        </div>
        <div className="mt-8 divide-y divide-background-200 rounded-2xl border border-background-200 bg-background-50">
          {faqs.map((f, idx) => (
            <div key={idx} className="p-6">
              <h4 className="font-medium">{f.q}</h4>
              <p className="mt-2 text-sm text-text-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-primary-600 to-accent-600 p-8 text-text-50 md:flex-row">
          <div>
            <h3 className="text-2xl font-semibold">
              Ready to modernize your sites?
            </h3>
            <p className="mt-1 text-primary-100">
              Get a tailored plan for your facilities and integrations.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/contact"
              className="rounded-full bg-background-50 px-6 py-3 text-primary-700 shadow transition hover:scale-[1.02] hover:bg-background-100"
            >
              Book a demo
            </a>
            <a
              href="/"
              className="rounded-full border border-text-50/40 px-6 py-3 text-text-50 transition hover:bg-text-50/10"
            >
              Go to homepage
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
