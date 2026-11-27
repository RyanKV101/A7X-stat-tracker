import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type EmptyStateProps = {
  title: string;
  description?: ReactNode;
  /** Decorative icon, e.g. <SongsIcon />. */
  icon?: ReactNode;
  /** Buttons or links, e.g. a call to action. */
  action?: ReactNode;
  /** Heading level, so it fits the page outline. Defaults to h2. */
  as?: "h1" | "h2" | "h3";
  className?: string;
};

/** Centered message for "nothing here yet", "coming soon" and error screens. */
export function EmptyState({
  title,
  description,
  icon,
  action,
  as: Heading = "h2",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border bg-surface/60 flex flex-col items-center gap-4 rounded-lg border border-dashed px-6 py-14 text-center",
        className,
      )}
    >
      {icon && (
        <div className="border-gold-700 bg-gold-900 text-gold-300 flex size-14 items-center justify-center rounded-full border [&>svg]:size-6">
          {icon}
        </div>
      )}
      <Heading className="text-h3 text-foreground">{title}</Heading>
      <div className="divider-ornament w-24" />
      {description && <div className="text-muted max-w-md text-sm">{description}</div>}
      {action && <div className="mt-2 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}
