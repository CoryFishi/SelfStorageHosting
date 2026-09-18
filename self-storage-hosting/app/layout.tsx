import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Self Storage Hosting",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background-50 text-text-900">{children}</body>
    </html>
  );
}
