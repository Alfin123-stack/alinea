"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Book } from "@/lib/types";
import { StarRating } from "@/components/ui/star-rating";
import { useT } from "@/lib/i18n/context";
import { getMoodTags } from "@/lib/mood-tags";

// Tuned so the tilt reads as a subtle 3D lift rather than a gimmick — real
// hardcovers don't swing more than a few degrees when you pick them up.
const MAX_TILT = 10;

export function BookCard({ book }: { book: Book }) {
  const t = useT();
  const moods = getMoodTags(book);
  const ref = useRef<HTMLDivElement>(null);

  // Raw pointer position (-0.5..0.5 on each axis), smoothed with a spring so
  // the tilt settles instead of snapping to the cursor every frame.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 300, damping: 22, mass: 0.6 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateX = useTransform(sy, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]);
  const shineX = useTransform(sx, [-0.5, 0.5], ["10%", "90%"]);
  const shineY = useTransform(sy, [-0.5, 0.5], ["10%", "90%"]);
  const shineBackground = useTransform([shineX, shineY], (values: string[]) => {
    const [x, y] = values;
    return `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.55), rgba(255,255,255,0) 45%)`;
  });

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onPointerLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <Link
      href={`/book/${book.id}`}
      className="group mb-4 block break-inside-avoid overflow-hidden"
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.035, y: -6 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-ink/8 bg-linen shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-shadow duration-300 group-hover:shadow-[0_22px_40px_-16px_rgba(0,0,0,0.35)]"
      >
        {book.thumbnail ? (
          <Image
            src={book.thumbnail}
            alt={book.title}
            fill
            quality={90}
            sizes="(min-width: 1024px) 260px, (min-width: 640px) 33vw, 45vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center type-caption text-pebble">
            {book.title}
          </div>
        )}

        {/* Shine sweep — a soft light patch that tracks the cursor, like light
            catching a glossy dust jacket. Overlay blend keeps it subtle on
            both light and dark covers. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: shineBackground }}
        />

        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/85 via-ink/0 to-ink/0 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="type-caption line-clamp-2 text-paper">{book.title}</span>
          {book.authors[0] && (
            <span className="type-caption text-paper/70">{book.authors[0]}</span>
          )}
        </div>

        {/* Ring only on hover — reinforces the lift without a permanent border doubling the one above. */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-ink/0 transition-all duration-300 group-hover:ring-ink/10" />
      </motion.div>

      <div className="flex flex-col gap-1.5 px-1 pt-2.5">
        <span className="type-caption clamp-2 font-medium text-ink">{book.title}</span>
        <StarRating rating={book.averageRating} size="sm" />
        {moods.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {moods.map((mood) => (
              <span
                key={mood}
                className="type-caption rounded-full bg-ink/5 px-2 py-0.5 text-[11px] leading-none text-stone"
              >
                {t(mood)}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
