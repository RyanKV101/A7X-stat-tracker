import type { Metadata } from "next";
import Link from "next/link";

import { CompassIcon } from "@/components/icons";
import { Container } from "@/components/layout/container";
import { buttonClasses, EmptyState } from "@/components/ui";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col justify-center py-16">
      <p className="text-eyebrow text-gold-400 mb-4 text-center font-semibold uppercase">
        Error 404
      </p>
      <EmptyState
        as="h1"
        icon={<CompassIcon />}
        title="This page has gone to the afterlife"
        description="The page you're looking for doesn't exist or has moved."
        action={
          <>
            <Link href="/" className={buttonClasses()}>
              Back to home
            </Link>
            <Link href="/songs" className={buttonClasses({ variant: "outline" })}>
              Browse songs
            </Link>
          </>
        }
      />
    </Container>
  );
}
