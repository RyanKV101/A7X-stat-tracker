import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

type CardProps = ComponentPropsWithRef<"div"> & {
  /** Adds a gold glow on hover, for clickable cards. */
  interactive?: boolean;
};

export function Card({ className, interactive, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "border-border bg-surface shadow-card relative rounded-lg border",
        "before:via-gold-600/60 before:pointer-events-none before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:to-transparent",
        interactive &&
          "ease-out-soft hover:border-gold-700 hover:shadow-glow-gold transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={cn("flex flex-col gap-1.5 p-6 pb-0", className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentPropsWithRef<"h3">) {
  return <h3 className={cn("text-h3 text-foreground", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentPropsWithRef<"p">) {
  return <p className={cn("text-muted text-sm", className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentPropsWithRef<"div">) {
  return (
    <div
      className={cn("border-border flex items-center gap-3 border-t px-6 py-4", className)}
      {...props}
    />
  );
}
