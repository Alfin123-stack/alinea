/**
 * Loading placeholders. Shaped like the real cards (2:3 cover + two text
 * lines) so the layout doesn't jump when data arrives.
 */

export function BookCardSkeleton() {
  return (
    <div className="mb-4 break-inside-avoid">
      <div className="aspect-[2/3] w-full animate-pulse rounded-2xl bg-ink/[0.07]" />
      <div className="flex flex-col gap-2 px-1 pt-2">
        <div className="h-3 w-4/5 animate-pulse rounded-full bg-ink/[0.07]" />
        <div className="h-3 w-2/5 animate-pulse rounded-full bg-ink/[0.07]" />
      </div>
    </div>
  );
}

export function MasonrySkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CollectionRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-6 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-[280px] shrink-0 sm:w-[320px]">
          <div className="aspect-[3/2] animate-pulse rounded-2xl bg-ink/[0.07]" />
          <div className="mt-3 flex flex-col gap-2">
            <div className="h-4 w-3/5 animate-pulse rounded-full bg-ink/[0.07]" />
            <div className="h-3 w-2/5 animate-pulse rounded-full bg-ink/[0.07]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BookHeaderSkeleton() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 md:flex-row">
      <div className="mx-auto w-48 shrink-0 md:mx-0 md:w-64">
        <div className="aspect-[2/3] animate-pulse rounded-2xl bg-ink/[0.07]" />
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <div className="h-3 w-24 animate-pulse rounded-full bg-ink/[0.07]" />
        <div className="h-8 w-3/4 animate-pulse rounded-full bg-ink/[0.07]" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-ink/[0.07]" />
        <div className="h-4 w-1/3 animate-pulse rounded-full bg-ink/[0.07]" />
      </div>
    </div>
  );
}
