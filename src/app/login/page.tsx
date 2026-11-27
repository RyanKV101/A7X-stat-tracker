import type { Metadata } from "next";
import Link from "next/link";

import { LockIcon } from "@/components/icons";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { buttonClasses, EmptyState } from "@/components/ui";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <Container className="flex max-w-xl flex-col gap-10 py-12">
      <PageHeader eyebrow="Welcome back" title="Log in" />
      <EmptyState
        icon={<LockIcon />}
        title="Accounts are coming soon"
        description="Signing up and logging in isn't open yet. You can already look around without an account."
        action={
          <Link href="/" className={buttonClasses({ variant: "outline" })}>
            Back to home
          </Link>
        }
      />
    </Container>
  );
}
