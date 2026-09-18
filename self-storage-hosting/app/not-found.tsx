import Link from "next/link";
import TopBar from "@/components/nav/TopBar";
import MainNav from "@/components/nav/MainNav";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent-50 focus:px-4 focus:py-2 focus:text-text-950"
      >
        Skip to content
      </a>
      <TopBar />
      <MainNav />
      <main id="main" className="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-20 text-center">
        <p className="text-7xl font-bold sm:text-9xl" aria-hidden="true">
          Oops!
        </p>
        <h1 className="font-bold">404 — Page not found</h1>
        <p className="max-w-sm text-sm">
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-accent-500 px-5 py-2.5 font-medium text-text-950 shadow-lg transition hover:bg-accent-400"
        >
          Go to homepage
        </Link>
      </main>
      <Footer />
    </div>
  );
}
