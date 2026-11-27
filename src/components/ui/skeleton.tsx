import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

/** Placeholder block shown while content loads. Size it with classes (h-4 w-32, aspect-square...). */
export function Skeleton({ className, ...props }: ComponentPropsWithRef<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn("bg-surface-raised animate-pulse rounded-sm", className)}
      {...props}
    />
  );
}
