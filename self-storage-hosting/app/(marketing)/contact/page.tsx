import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description:
    "Talk to us about cloud access control or a facility website. Tell us how many sites you run and what gate hardware you have.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Contact us</h1>
        <p className="mt-4 text-lg text-text-800">
          Tell us how many facilities you run, which facility management software you use, and what
          gate hardware is on site. We will tell you plainly whether we can bridge it.
        </p>
        <div className="mt-10">
          <ContactForm subject="general" />
        </div>
      </section>
    </>
  );
}
