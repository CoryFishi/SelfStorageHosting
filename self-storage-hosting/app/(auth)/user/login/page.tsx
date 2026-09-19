import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = pageMeta({
  title: "Log In",
  description: "Log in to your Self Storage Hosting account.",
  path: "/user/login",
});

export default function LoginPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Log In", path: "/user/login" },
        ]}
      />

      <div className="mx-auto max-w-md px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Log in</h1>
        <AuthForm mode="login" />
      </div>
    </>
  );
}
