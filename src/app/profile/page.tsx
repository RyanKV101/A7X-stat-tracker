import type { Metadata } from "next";
import Link from "next/link";

import { LockIcon, ProfileIcon } from "@/components/icons";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { buttonClasses, EmptyState } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth/current-user";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <Container className="flex flex-col gap-10 py-12">
      <PageHeader eyebrow="Your corner" title="Profile" />
      {user ? (
        <EmptyState
          icon={<ProfileIcon />}
          title={`Welcome, ${user.name}`}
          description="Your profile page with your picture, banner, bio and stats is coming soon."
        />
      ) : (
        <EmptyState
          icon={<LockIcon />}
          title="Log in to see your profile"
          description="With an account you get a profile, your quiz scores are saved and you can unlock your listening stats."
          action={
            <Link href="/login" className={buttonClasses()}>
              Log in
            </Link>
          }
        />
      )}
    </Container>
  );
}
