import type { Metadata } from "next";

import { StatsIcon } from "@/components/icons";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui";

export const metadata: Metadata = { title: "Stats" };

export default function StatsPage() {
  return (
    <Container className="flex flex-col gap-10 py-12">
      <PageHeader
        eyebrow="Your listening"
        title="Stats"
        description="Minutes listened, top songs and fun facts, from your Spotify history or Last.fm."
      />
      <EmptyState
        icon={<StatsIcon />}
        title="No listening data yet"
        description="Soon you can upload your Spotify streaming history or connect Last.fm to unlock your stats."
      />
    </Container>
  );
}
