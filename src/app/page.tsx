import Link from "next/link";

import { navIcons } from "@/components/icons";
import { Container } from "@/components/layout/container";
import { buttonClasses, Card } from "@/components/ui";

const sections = [
  {
    href: "/songs",
    icon: navIcons.songs,
    title: "Songs",
    text: "The full discography, every song as a card.",
  },
  {
    href: "/quiz",
    icon: navIcons.quiz,
    title: "Quiz",
    text: "Find out how well you really know the band.",
  },
  {
    href: "/stats",
    icon: navIcons.stats,
    title: "Stats",
    text: "Your own listening stats from Spotify or Last.fm.",
  },
];

export default function Home() {
  return (
    <Container className="flex flex-col items-center gap-16 py-20 sm:py-28">
      <div className="flex flex-col items-center gap-8 text-center">
        <p className="text-eyebrow text-gold-400 font-semibold uppercase">For the fans</p>
        <h1 className="text-gold-gradient text-h1 sm:text-display">A7X Stat Tracker</h1>
        <div className="divider-ornament w-48" />
        <p className="text-muted max-w-md">
          Every song, a quiz that tests how well you really know the band, and your own listening
          stats.
        </p>
        <Link href="/songs" className={buttonClasses({ size: "lg" })}>
          Browse the songs
        </Link>
      </div>

      <ul className="grid w-full gap-4 sm:grid-cols-3">
        {sections.map(({ href, icon: Icon, title, text }) => (
          <li key={href}>
            <Link href={href} className="block h-full rounded-lg">
              <Card interactive className="flex h-full flex-col gap-3 p-6">
                <Icon className="text-gold-400 size-6" />
                <h2 className="text-h3 text-foreground">{title}</h2>
                <p className="text-muted text-sm">{text}</p>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
