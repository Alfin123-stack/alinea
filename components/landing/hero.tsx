"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Book } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { useT } from "@/lib/i18n/context";

// Fixed positions for the floating cover collage — tuned by hand so covers
// frame the headline without covering it, mirroring the polaroid scatter
// in the Cosmos reference. `depth` controls how far each cover drifts under
// the cursor-parallax effect — closer/larger covers move more.
// Below `sm` there's no gutter beside the centered headline (text spans
// almost the full width), so every cover here is hidden on small screens —
// showing them there always means overlapping the text, never framing it.
const positions = [
  { cls: "hidden left-[3%] top-[8%] w-20 rotate-[-6deg] sm:block md:w-28", depth: 22 },
  { cls: "hidden left-[13%] top-[58%] w-16 rotate-[5deg] sm:block md:w-24", depth: 14 },
  { cls: "hidden right-[4%] top-[12%] w-20 rotate-[7deg] sm:block md:w-28", depth: 24 },
  { cls: "hidden right-[14%] top-[60%] w-16 rotate-[-4deg] sm:block md:w-24", depth: 16 },
  { cls: "left-[26%] top-[2%] w-14 rotate-[3deg] hidden md:block md:w-20", depth: 10 },
  { cls: "right-[27%] top-[4%] w-14 rotate-[-3deg] hidden md:block md:w-20", depth: 10 },
];

function ParallaxCover({
  book,
  cls,
  depth,
  mx,
  my,
  index,
}: {
  book: Book;
  cls: string;
  depth: number;
  mx: import("framer-motion").MotionValue<number>;
  my: import("framer-motion").MotionValue<number>;
  index: number;
}) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.35 + 0.08 * index, ease: [0.22, 0.61, 0.36, 1] }}
      style={{ x, y }}
      className={`absolute aspect-[2/3] overflow-hidden rounded-xl border border-ink/10 bg-paper shadow-[0_18px_36px_-18px_rgba(0,0,0,0.35)] ${cls}`}
    >
      {book.thumbnail && (
        <Image src={book.thumbnail} alt="" fill quality={90} sizes="140px" className="object-cover" />
      )}
    </motion.div>
  );
}

export function Hero({ covers }: { covers: Book[] }) {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);

  // Raw cursor offset from section center, in px, smoothed with a spring so
  // covers and the ambient glow drift rather than snap.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 16, mass: 0.6 });
  const my = useSpring(rawY, { stiffness: 60, damping: 16, mass: 0.6 });
  const glowX = useTransform(mx, (v) => `calc(50% + ${v * 2.2}px)`);
  const glowY = useTransform(my, (v) => `calc(50% + ${v * 2.2}px)`);

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  }

  function onPointerLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] as const },
    },
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative overflow-hidden px-6 pb-20 pt-16 md:pt-24"
    >
      {/* Soft cursor-follow glow — barely-there radial light that gives the
          whole hero a sense of depth without adding any actual color. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: useTransform([glowX, glowY], (values: string[]) => {
            const [x, y] = values;
            return `radial-gradient(480px circle at ${x} ${y}, var(--color-ink) 0%, transparent 70%)`;
          }),
          opacity: 0.05,
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-20 mx-auto h-[calc(100%-5rem)] max-w-5xl md:top-24 md:h-[calc(100%-6rem)]">
        {covers.slice(0, positions.length).map((book, i) => (
          <ParallaxCover
            key={book.id}
            book={book}
            cls={positions[i].cls}
            depth={positions[i].depth}
            mx={mx}
            my={my}
            index={i}
          />
        ))}
      </div>

      <motion.div
        className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.span variants={item} className="eyebrow text-ink">
          {t("hero.eyebrow")}
        </motion.span>
        <motion.h1 variants={item} className="type-display-xl text-balance text-ink">
          {t("hero.title1")}
          <br />
          {t("hero.title2")}
        </motion.h1>
        <motion.p variants={item} className="type-subheading max-w-md text-stone">
          {t("hero.sub")}
        </motion.p>
        <motion.div
          variants={item}
          className="mt-2 flex flex-wrap items-center justify-center gap-3"
        >
          <Magnetic strength={0.3}>
            <Button href="/explore">{t("hero.cta1")}</Button>
          </Magnetic>
          <Magnetic strength={0.3}>
            <Button href="/explore#koleksi" variant="secondary">
              {t("hero.cta2")}
            </Button>
          </Magnetic>
        </motion.div>
        <motion.div variants={item}>
          <Link
            href="#sorotan"
            className="type-subheading mt-6 inline-flex items-center gap-2 text-ink transition-opacity hover:opacity-70"
          >
            <Play size={14} className="fill-ink" />
            {t("hero.spotlightLink")}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
