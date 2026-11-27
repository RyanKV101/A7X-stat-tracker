"use client";

import { useEffect } from "react";

import "./globals.css";

/**
 * Last-resort error page, used when the root layout itself fails.
 * Replaces the whole document, so no header, footer or next/font here.
 */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col items-center justify-center gap-6 px-6 text-center">
        <title>Something went wrong · A7X Stat Tracker</title>
        <p className="text-eyebrow text-gold-400 font-semibold uppercase">A7X Stat Tracker</p>
        <h1 className="text-gold-gradient text-h2">Something went wrong</h1>
        <div className="divider-ornament w-32" />
        <p className="text-muted max-w-md">The site couldn&apos;t load. Try again in a moment.</p>
        <button
          type="button"
          onClick={() => retry()}
          className="bg-primary text-bone-50 border-crimson-600 hover:bg-primary-hover h-10 cursor-pointer rounded-sm border px-5 text-sm font-semibold tracking-wider uppercase"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
