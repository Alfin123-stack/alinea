import { NavPill } from "@/components/layout/nav-pill";
import { BookHeaderSkeleton, MasonrySkeleton } from "@/components/ui/book-skeleton";

export default function BookLoading() {
  return (
    <>
      <NavPill />
      <main className="flex-1 px-4 pt-8 md:px-6 md:pt-12">
        <BookHeaderSkeleton />
        <div className="mx-auto mt-14 max-w-2xl">
          <div className="h-7 w-40 animate-pulse rounded-full bg-ink/[0.07]" />
          <div className="mt-5 flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-full animate-pulse rounded-full bg-ink/[0.07]" />
            ))}
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-6xl pb-24">
          <MasonrySkeleton count={5} />
        </div>
      </main>
    </>
  );
}
