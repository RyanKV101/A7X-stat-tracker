import Link from "next/link";

import { mainNav } from "@/lib/nav";

import { Container } from "./container";
import { Wordmark } from "./wordmark";

const externalLink =
  "text-muted hover:text-gold-300 underline decoration-ink-500 underline-offset-4 transition-colors hover:decoration-gold-400";

export function SiteFooter() {
  return (
    <footer className="border-border bg-surface/40 mt-16 border-t">
      <Container className="flex flex-col gap-8 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-sm flex-col gap-3">
            <Wordmark />
            <p className="text-subtle text-sm">
              A fan-made project. Not affiliated with or endorsed by Avenged Sevenfold, their label
              or management.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {mainNav.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-display text-muted hover:text-foreground text-sm font-semibold tracking-wider uppercase transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="divider-ornament" />

        <div className="text-subtle flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            Listening data from{" "}
            <a href="https://www.last.fm" target="_blank" rel="noreferrer" className={externalLink}>
              Last.fm
            </a>{" "}
            and your own{" "}
            <a
              href="https://www.spotify.com"
              target="_blank"
              rel="noreferrer"
              className={externalLink}
            >
              Spotify
            </a>{" "}
            streaming history. Last.fm and Spotify are trademarks of their respective owners.
          </p>
          <p className="shrink-0">Made by fans, for fans.</p>
        </div>
      </Container>
    </footer>
  );
}
