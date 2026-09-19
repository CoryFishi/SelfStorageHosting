import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import AuthForm from "@/components/AuthForm";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

export const metadata: Metadata = pageMeta({
  title: "Create an Account",
  description: "Create a Self Storage Hosting account with your email address and a password.",
  path: "/user/register",
});

export default function RegisterPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Create an Account", path: "/user/register" },
        ]}
      />

      <div className="mx-auto max-w-md px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Create an account</h1>
        <AuthForm mode="register" />
        <p className="mt-8 text-sm text-text-700">
          Our{" "}
          <Link href="/legal/privacy" className={`underline ${FOCUS_RING_LIGHT}`}>
            privacy policy
          </Link>{" "}
          explains what we store when you create an account.
        </p>
      </div>
    </>
  );
}
