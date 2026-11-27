"use client";

import Link from "next/link";
import { useEffect } from "react";

import { AlertIcon } from "@/components/icons";
import { Container } from "@/components/layout/container";
import { Button, buttonClasses, EmptyState } from "@/components/ui";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest =
    error instanceof Error && "digest" in error && typeof error.digest === "string"
      ? error.digest
      : null;

  return (
    <Container className="flex flex-1 flex-col justify-center py-16">
      <EmptyState
        as="h1"
        icon={<AlertIcon />}
        title="Something went wrong"
        description={
          <>
            <p>This page hit a wrong note. Try again, or head back home.</p>
            {digest && <p className="text-subtle mt-2 font-mono text-xs">Error ID: {digest}</p>}
          </>
        }
        action={
          <>
            <Button onClick={() => retry()}>Try again</Button>
            <Link href="/" className={buttonClasses({ variant: "outline" })}>
              Back to home
            </Link>
          </>
        }
      />
    </Container>
  );
}
