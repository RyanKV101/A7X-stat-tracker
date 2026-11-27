import type { Metadata } from "next";

import { SongsIcon } from "@/components/icons";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui";

export const metadata: Metadata = { title: "Songs" };

export default function SongsPage() {
  return (
    <Container className="flex flex-col gap-10 py-12">
      <PageHeader
        eyebrow="Discography"
        title="Songs"
        description="Every Avenged Sevenfold song, from Sounding the Seventh Trumpet to Life Is But a Dream..."
      />
      <EmptyState
        icon={<SongsIcon />}
        title="The setlist is still being written"
        description="All albums and songs are being added. Check back soon to browse the full discography."
      />
    </Container>
  );
}
