import Link from "next/link";
import { cn } from "@/lib/cn";

/** Text-only site name. No band logo or Deathbat (see README -> Theme). */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("font-display group flex items-baseline gap-2 rounded-xs font-bold", className)}
    >
      <span className="text-gold-gradient text-xl tracking-wider">A7X</span>
      <span className="text-foreground group-hover:text-gold-200 text-sm tracking-[0.2em] uppercase transition-colors">
        Stat Tracker
      </span>
    </Link>
  );
}
