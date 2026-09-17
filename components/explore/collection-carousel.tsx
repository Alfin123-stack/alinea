"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CollectionCard } from "@/components/explore/collection-card";
import type { Book, Collection } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";

export function CollectionCarousel({
  collections,
  data,
}: {
  collections: Collection[];
  data: { books: Book[]; totalItems: number }[];
}) {
  const t = useT();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    // The track is inset with horizontal padding and uses scroll snapping, so
    // at rest the browser parks scrollLeft at the padding offset rather than 0.
    // Measure it instead of assuming, or the back chevron shows on first paint.
    const originOffset = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    const tolerance = originOffset + 8;

    setCanScrollLeft(el.scrollLeft > tolerance);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const scrollBy = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    // The negative margin lives here (not on the scroll track) so this
    // wrapper spans edge-to-edge with the viewport, same as the track does.
    // That lets the fade masks below use left-0/right-0 and land exactly on
    // the viewport edge instead of the page's inner content edge.
    <div className="relative -mx-4 md:-mx-6">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {collections.map((collection, i) => (
          <CollectionCard
            key={collection.slug}
            collection={collection}
            books={data[i]?.books ?? []}
            totalItems={data[i]?.totalItems ?? 0}
          />
        ))}
      </div>

      {/* Edge fade masks — a peeking card at rest gets cut off wherever the
          viewport happens to end. Fading it into the page background instead
          of a hard clip reads as an intentional "there's more, scroll" hint
          rather than a broken layout. Tied to the same scroll state the
          chevron buttons use, so they only show where there's actually more
          to reveal. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-linen to-transparent transition-opacity duration-300 md:w-16",
          canScrollLeft ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-linen to-transparent transition-opacity duration-300 md:w-16",
          canScrollRight ? "opacity-100" : "opacity-0"
        )}
      />

      <CarouselButton
        side="left"
        label={t("explore.prev")}
        visible={canScrollLeft}
        onClick={() => scrollBy(-1)}
      />
      <CarouselButton
        side="right"
        label={t("explore.next")}
        visible={canScrollRight}
        onClick={() => scrollBy(1)}
      />
    </div>
  );
}

function CarouselButton({
  side,
  label,
  visible,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  visible: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        // Wrapper is now edge-to-edge with the viewport (see CollectionCarousel),
        // so these sit 16px in from that edge — visually the same spot they
        // occupied before, back when the wrapper stopped at the page's
        // padded content edge.
        "absolute top-[28%] z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-paper text-ink transition-opacity md:flex",
        side === "left" ? "left-4" : "right-4",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <Icon size={18} />
    </button>
  );
}
