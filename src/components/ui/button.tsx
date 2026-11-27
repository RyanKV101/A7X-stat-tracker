import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-bone-50 border border-crimson-600 hover:bg-primary-hover hover:shadow-glow-crimson",
  secondary:
    "bg-gold-400 text-ink-950 border border-gold-300 hover:bg-gold-300 hover:shadow-glow-gold",
  outline: "border border-gold-600 text-gold-300 hover:border-gold-400 hover:bg-gold-900",
  ghost: "border border-transparent text-muted hover:bg-surface-raised hover:text-foreground",
  danger: "border border-crimson-500 text-crimson-300 hover:bg-crimson-900 hover:text-crimson-300",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/** Returns the button classes, so links can look like buttons too. */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm font-display font-semibold tracking-wider uppercase",
    "transition-[background-color,border-color,box-shadow,color] duration-200 ease-out-soft",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />;
}
