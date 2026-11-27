"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CloseIcon, MenuIcon } from "@/components/icons";
import { Avatar, buttonClasses } from "@/components/ui";
import type { CurrentUser } from "@/lib/auth/current-user";
import { cn } from "@/lib/cn";

import { NavLinks } from "./nav-links";

const MENU_ID = "mobile-menu";

/** Hamburger button + full-screen menu panel, only below the md breakpoint. */
export function MobileMenu({ user }: { user: CurrentUser | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close when the route changes (back/forward, or a link outside the menu).
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    // Close when the window grows past the mobile breakpoint.
    const desktop = window.matchMedia("(min-width: 48rem)");
    function onBreakpoint(event: MediaQueryListEvent) {
      if (event.matches) setOpen(false);
    }

    // Stop the page behind the menu from scrolling.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={MENU_ID}
        className="text-muted hover:bg-surface-raised hover:text-foreground flex size-10 cursor-pointer items-center justify-center rounded-sm transition-colors"
      >
        {open ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>

      <nav
        id={MENU_ID}
        aria-label="Main"
        hidden={!open}
        className={cn(
          "border-border bg-background fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t",
          "motion-safe:animate-[menu-in_200ms_var(--ease-out-soft)]",
        )}
      >
        <div className="flex min-h-full flex-col gap-6 px-4 py-6">
          <NavLinks variant="mobile" onNavigate={close} />

          <div className="divider-ornament" />

          {user ? (
            <Link
              href="/profile"
              onClick={close}
              className="hover:bg-surface flex items-center gap-3 rounded-md px-4 py-3"
            >
              <Avatar name={user.name} src={user.avatarUrl} size="md" ring />
              <span className="flex flex-col">
                <span className="text-foreground font-semibold">{user.name}</span>
                {user.username && <span className="text-subtle text-sm">@{user.username}</span>}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={close}
              className={buttonClasses({ variant: "primary", size: "lg", className: "w-full" })}
            >
              Log in
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
