import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui";

/** Default page skeleton while a page loads. Sections can add their own loading.tsx. */
export default function Loading() {
  return (
    <Container className="flex flex-col gap-10 py-12" role="status">
      <span className="sr-only">Loading…</span>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-4 w-full max-w-lg" />
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
    </Container>
  );
}
