// src/App.tsx
import { Suspense, lazy } from "react";
import { Routes, Route, Outlet, NavLink, Navigate } from "react-router-dom";
import SmallNavbar from "./components/SmallNavbar";
import LargeNavbar from "./components/LargeNavbar";
import Footer from "./components/Footer";
import Spinner from "./components/Spinner";

// Lazy pages
const HomePage = lazy(() => import("./pages/HomePage"));
const WebHostingPage = lazy(() => import("./pages/solutions/WebHostingPage"));
const AccessControlHostingPage = lazy(
  () => import("./pages/solutions/AccessControlHostingPage")
);
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));
const DemoPage = lazy(() => import("./pages/DemoPage"));
const LoginPage = lazy(() => import("./pages/user/LoginPage"));
const RegisterPage = lazy(() => import("./pages/user/RegisterPage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const CaseStudiesPage = lazy(() => import("./pages/CaseStudiesPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));

export default function App() {
  return (
    <Routes>
      {/* Layout route wraps EVERYTHING with the navbar */}
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="solutions/web-hosting" element={<WebHostingPage />} />
        <Route
          path="solutions/access-control-hosting"
          element={<AccessControlHostingPage />}
        />
        <Route path="about-us" element={<AboutUsPage />} />
        <Route path="case-studies" element={<CaseStudiesPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="demo" element={<DemoPage />} />
        <Route path="user">
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route path="support" element={<SupportPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

function RootLayout() {
  return (
    <div className="min-h-screen bg-background-50 flex flex-col">
      {/* Top skinny bar */}
      <SmallNavbar />
      {/* Main navbar */}
      <LargeNavbar />
      {/* Page outlet; header stays during lazy loads */}
      <main className="flex-1">
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
