"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Book } from "@/lib/types";
import { useT } from "@/lib/i18n/context";
import { StarRating } from "@/components/ui/star-rating";
import { Reveal, RevealItem } from "@/components/ui/reveal";

function TrendingCard({ book, rank }: { book: Book; rank: number }) {
  return (
    <RevealItem index={rank} className="w-[168px] shrink-0 md:w-[196px]">
      <Link href={`/book/${book.id}`} className="group flex flex-col gap-2.5">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-ink/10 bg-linen transition-colors duration-500 group-hover:border-ink/30">
          {book.thumbnail ? (
            <Image
              src={book.thumbnail}
              alt={book.title}
              fill
              quality={90}
              sizes="200px"
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.08]"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-3 text-center type-caption text-pebble">
              {book.title}
            </div>
          )}

          {/* Rank badge — this strip is a ranked "most discussed" list, not a
              random shelf, so the number earns its place. */}
          <span className="absolute left-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 font-serif text-[13px] text-paper backdrop-blur-sm">
            {rank + 1}
          </span>

          {/* Rating stays hidden until hover — the cover carries the card by
              default, the number only surfaces once you're actually looking. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-ink/85 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <StarRating rating={book.averageRating} count={book.ratingsCount} size="sm" inverted />
          </div>
        </div>
        <span className="type-caption clamp-2 font-medium text-ink">{book.title}</span>
      </Link>
    </RevealItem>
  );
}

export function TrendingStrip({ books }: { books: Book[] }) {
  const t = useT();
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Horizontal drift tied to vertical scroll position — the strip only ever
  // moves in response to the user scrolling (never on its own like the
  // marquee in TrustRow), so it reads as reactive rather than ambient.
  // Deliberately not draggable (see CollectionCarousel for that pattern) —
  // manual swipe would fight this automatic drift on the same axis.
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-15%"]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard: matchMedia is unavailable server-side
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!books.length) return null;

  return (
    <section id="ramai-dibahas" ref={sectionRef} className="overflow-hidden px-6 py-20 md:py-24">
      <Reveal className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="type-display text-ink">{t("trending.title")}</h2>
          <p className="type-subheading mt-4 text-ink">{t("trending.sub")}</p>
        </div>

        <div className="relative mt-12 -mx-6 overflow-hidden px-6 md:mt-16">
          <motion.div
            style={reducedMotion ? undefined : { x }}
            className="flex w-max gap-4 md:gap-5"
          >
            {books.map((book, i) => (
              <TrendingCard key={book.id} book={book} rank={i} />
            ))}
          </motion.div>
        </div>
      </Reveal>
    </section>
  );
}
