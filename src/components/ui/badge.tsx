import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "default" | "gold" | "crimson" | "success" | "outline";

const variants: Record<BadgeVariant, string> = {
  default: "border-border bg-surface-raised text-muted",
  gold: "border-gold-700 bg-gold-900 text-gold-300",
  crimson: "border-crimson-800 bg-crimson-900 text-crimson-300",
  success: "border-emerald-900 bg-emerald-900 text-emerald-400",
  outline: "border-border-strong bg-transparent text-muted",
};

export type BadgeProps = ComponentPropsWithRef<"span"> & { variant?: BadgeVariant };

export function Badge({ variant = "default", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-xs border px-2 py-0.5 text-[0.6875rem] font-semibold tracking-wider uppercase",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
