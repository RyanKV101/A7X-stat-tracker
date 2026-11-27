"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navIcons } from "@/components/icons";
import { cn } from "@/lib/cn";
import { isActivePath, mainNav } from "@/lib/nav";

type NavLinksProps = {
  variant: "desktop" | "mobile";
  /** Called when a link is clicked, e.g. to close the mobile menu. */
  onNavigate?: () => void;
};

/** The main section links. Marks the current section with aria-current. */
export function NavLinks({ variant, onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <ul className={cn(variant === "desktop" ? "flex items-center gap-1" : "flex flex-col gap-1")}>
      {mainNav.map(({ href, label, icon }) => {
        const active = isActivePath(pathname, href);
        const Icon = navIcons[icon];

        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "font-display font-semibold tracking-wider uppercase transition-colors",
                variant === "desktop" &&
                  "relative block rounded-xs px-3 py-2 text-sm after:absolute after:inset-x-3 after:-bottom-px after:h-px after:transition-colors",
                variant === "desktop" &&
                  (active
                    ? "text-gold-300 after:bg-gold-400"
                    : "text-muted hover:text-foreground after:bg-transparent"),
                variant === "mobile" &&
                  "flex items-center gap-4 rounded-md border-l-2 px-4 py-3.5 text-base",
                variant === "mobile" &&
                  (active
                    ? "border-gold-400 bg-surface-raised text-gold-300"
                    : "text-muted hover:bg-surface hover:text-foreground border-transparent"),
              )}
            >
              {variant === "mobile" && <Icon className="size-5 shrink-0" />}
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
