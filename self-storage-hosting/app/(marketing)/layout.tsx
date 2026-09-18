import TopBar from "@/components/nav/TopBar";
import MainNav from "@/components/nav/MainNav";
import Footer from "@/components/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
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
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
