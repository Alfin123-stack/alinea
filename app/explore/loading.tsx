import { NavPill } from "@/components/layout/nav-pill";
import { MasonrySkeleton, CollectionRowSkeleton } from "@/components/ui/book-skeleton";

export default function ExploreLoading() {
  return (
    <>
      <NavPill />
      <main className="flex-1 px-4 pb-24 pt-8 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="h-9 w-56 animate-pulse rounded-full bg-ink/[0.07]" />
          <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded-full bg-ink/[0.07]" />
          <div className="mt-6 h-14 w-full max-w-lg animate-pulse rounded-2xl bg-ink/[0.07]" />

          <div className="mt-14">
            <CollectionRowSkeleton />
          </div>

          <div className="mt-16">
            <MasonrySkeleton />
          </div>
        </div>
      </main>
    </>
  );
}
