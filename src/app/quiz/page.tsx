import type { Metadata } from "next";

import { QuizIcon } from "@/components/icons";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui";

export const metadata: Metadata = { title: "Quiz" };

export default function QuizPage() {
  return (
    <Container className="flex flex-col gap-10 py-12">
      <PageHeader
        eyebrow="Test yourself"
        title="Quiz"
        description="Random questions about the band, from easy to hard."
      />
      <EmptyState
        icon={<QuizIcon />}
        title="The questions are on their way"
        description="We're writing and checking the first set of questions. The quiz opens soon."
      />
    </Container>
  );
}
