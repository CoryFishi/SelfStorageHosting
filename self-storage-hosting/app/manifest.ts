import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Served at /manifest.webmanifest and linked from every page. It names the
// icons a browser uses when someone saves the site to a home screen. The
// site is not an app, so it stays in the browser (`display: "browser"`).
// No short_name: the only name the site publishes is its full one.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "browser",
    // primary-700 and background-50 from app/globals.css; theme_color matches
    // the viewport themeColor in app/layout.tsx.
    theme_color: "#2c686d",
    background_color: "#eef6f6",
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
