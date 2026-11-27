import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui";

/** Song grid skeleton: same layout as the cards that load in. */
export default function SongsLoading() {
  return (
    <Container className="flex flex-col gap-10 py-12" role="status">
      <span className="sr-only">Loading songs…</span>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="border-border bg-surface flex flex-col gap-3 rounded-lg border p-3"
          >
            <Skeleton className="aspect-square w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </Container>
  );
}
