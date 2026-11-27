import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "A7X Stat Tracker",
    template: "%s · A7X Stat Tracker",
  },
  description: "Songs, quizzes and listening stats for Avenged Sevenfold fans.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="bg-gold-400 font-display text-ink-950 sr-only z-[60] rounded-sm px-4 py-2 text-sm font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
