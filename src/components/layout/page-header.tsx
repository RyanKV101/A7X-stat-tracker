import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: ReactNode;
  className?: string;
};

/** Title block at the top of a page. Renders the page's h1. */
export function PageHeader({ title, eyebrow, description, className }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-3", className)}>
      {eyebrow && <p className="text-eyebrow text-gold-400 font-semibold uppercase">{eyebrow}</p>}
      <h1 className="text-gold-gradient text-h2 sm:text-h1">{title}</h1>
      {description && <p className="text-muted max-w-2xl">{description}</p>}
    </header>
  );
}
