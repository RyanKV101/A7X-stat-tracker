"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type AvatarSize = "sm" | "md" | "lg" | "xl";

const sizes: Record<AvatarSize, string> = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-16 text-lg",
  xl: "size-24 text-2xl",
};

export type AvatarProps = {
  src?: string | null;
  /** Used for the alt text and the initials fallback. */
  name: string;
  size?: AvatarSize;
  /** Gold ring, e.g. for the logged-in user or a top listener. */
  ring?: boolean;
  className?: string;
};

function initials(name: string) {
  const parts = name
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[1][0] : (parts[0] ?? "?").slice(0, 2);
  return letters.toUpperCase();
}

export function Avatar({ src, name, size = "md", ring, className }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;

  return (
    <span
      className={cn(
        "border-border bg-crimson-900 font-display text-gold-300 relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border font-semibold",
        ring && "ring-gold-500 ring-offset-background ring-2 ring-offset-2",
        sizes[size],
        className,
      )}
    >
      {showImage ? (
        // Avatars come from Supabase Storage (#16); plain img keeps this free of next/image config.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt={name}
          className="size-full object-cover"
          onError={() => setFailedSrc(src ?? null)}
          // The image can fail before hydration, so onError never fires; check on mount too.
          ref={(img) => {
            if (img?.complete && img.naturalWidth === 0) setFailedSrc(src ?? null);
          }}
        />
      ) : (
        <span role="img" aria-label={name}>
          {initials(name)}
        </span>
      )}
    </span>
  );
}
