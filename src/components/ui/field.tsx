import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Shared classes for text inputs and selects. */
export const controlClasses = cn(
  "h-10 w-full rounded-sm border border-border-strong bg-ink-950 px-3 text-sm text-foreground",
  "placeholder:text-subtle",
  "transition-[border-color,box-shadow] duration-200 ease-out-soft",
  "hover:border-bone-400 focus-visible:border-gold-400 focus-visible:shadow-glow-gold focus-visible:outline-none",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-crimson-400 aria-invalid:focus-visible:shadow-glow-crimson",
);

type FieldProps = {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

/** Label + control + hint/error, with the ids wired up for screen readers. */
export function Field({ id, label, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-muted text-sm font-medium">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-danger text-xs">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-subtle text-xs">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function describedBy(id: string, hint?: string, error?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}
