import TopBar from "@/components/nav/TopBar";
import MainNav from "@/components/nav/MainNav";
import Footer from "@/components/Footer";

/**
 * The frame every page shares: the skip link, both nav bars, <main> and the
 * footer. The skip link has to be the first thing a keyboard reaches and has
 * to point at <main id="main">, so the frame is written once, here.
 * tests/rendered.test.ts checks both on every built page.
 */
export default function SiteChrome({
  children,
  mainClassName = "flex-1",
}: {
  children: React.ReactNode;
  mainClassName?: string;
}) {
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
      <main id="main" className={mainClassName}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
