import Link from "next/link";
import { Suspense } from "react";

import { Avatar, buttonClasses, Skeleton } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth/current-user";

import { Container } from "./container";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";
import { Wordmark } from "./wordmark";

export function SiteHeader() {
  return (
    // The blur sits on a pseudo-element: backdrop-filter on the header itself would make it
    // the containing block for the fixed mobile menu panel.
    <header className="border-border before:bg-background/85 sticky top-0 z-50 border-b before:absolute before:inset-0 before:-z-10 before:backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Wordmark />

        <div className="flex items-center gap-2 md:gap-6">
          <nav aria-label="Main" className="hidden md:block">
            <NavLinks variant="desktop" />
          </nav>

          {/* The nav renders right away; only the part that depends on the session streams in. */}
          <Suspense fallback={<AccountSlotSkeleton />}>
            <AccountSlot />
          </Suspense>
        </div>
      </Container>
    </header>
  );
}

/** Log in button or avatar, plus the mobile menu (which also shows the account). */
async function AccountSlot() {
  const user = await getCurrentUser();

  return (
    <>
      {user ? (
        <Link href="/profile" className="rounded-full" aria-label={`Your profile (${user.name})`}>
          <Avatar name={user.name} src={user.avatarUrl} size="sm" ring />
        </Link>
      ) : (
        // Wrapped, because cn() doesn't drop the button's own inline-flex in favour of hidden.
        <div className="hidden md:block">
          <Link href="/login" className={buttonClasses({ variant: "outline", size: "sm" })}>
            Log in
          </Link>
        </div>
      )}
      <MobileMenu user={user} />
    </>
  );
}

function AccountSlotSkeleton() {
  return (
    <>
      <Skeleton className="hidden h-8 w-20 md:block" />
      <Skeleton className="size-10 md:hidden" />
    </>
  );
}
