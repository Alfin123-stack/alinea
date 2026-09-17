"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import type { Book } from "@/lib/types";
import { useT } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/dictionaries";
import { Reveal, RevealItem } from "@/components/ui/reveal";

/**
 * Same trick as the reference ColorChangeCards: each letter is rendered
 * twice, stacked in a fixed-height window with overflow hidden. At rest the
 * first copy shows; on hover the stack slides up by half its height, so the
 * second — identical — copy takes its place. `staggerChildren` on the
 * parent (below) fans this out across letters automatically, no manual
 * per-letter delay math needed.
 */
const letterVariants: Variants = {
  rest: { y: "0%" },
  hover: { y: "-50%" },
};

function AnimatedLetter({ letter }: { letter: string }) {
  return (
    <span className="inline-block h-[1.29em] overflow-hidden">
      <motion.span className="flex flex-col" variants={letterVariants} transition={{ duration: 0.5 }}>
        <span>{letter}</span>
        <span aria-hidden="true">{letter}</span>
      </motion.span>
    </span>
  );
}

function AnimatedLabel({ text }: { text: string }) {
  // Split by word first, letter within each word — an unbroken word never
  // gets torn apart at a line-wrap the way splitting the whole string by
  // character would (the reference gets away with single short words like
  // "Plan"; ours run longer, e.g. "Highest reader ratings").
  const words = text.split(" ");
  return (
    <h4 className="type-subheading relative z-10 flex flex-wrap gap-x-[0.3em] gap-y-0 text-paper">
      {words.map((word, wi) => (
        <span key={wi} className="inline-flex">
          {word.split("").map((letter, li) => (
            <AnimatedLetter letter={letter} key={li} />
          ))}
        </span>
      ))}
    </h4>
  );
}

function FeatureCard({
  titleKey,
  href,
  covers,
}: {
  titleKey: TranslationKey;
  href: string;
  covers: Book[];
}) {
  const t = useT();

  return (
    <motion.div initial="rest" whileHover="hover" animate="rest" transition={{ staggerChildren: 0.035 }}>
      <Link href={href} className="group relative block aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl bg-linen">
        {/* Background collage — one layer, one transition, exactly like the
            reference's single bg-image div: saturate and scale move
            together instead of being split across two elements, which is
            what was making the old hover feel stepped/robotic.
            `transform-gpu` + `will-change-transform` promote this to its own
            compositor layer — without them, scaling a grid of 4 separate
            <Image> children (vs. the reference's single flat background-image
            layer) forces the browser to repaint on the main thread every
            frame instead of just moving a texture, which is what reads as
            "jumping" instead of gliding. Desaturated by default, full color
            + 10% scaled on hover — desktop only, since touch devices have no
            hover and should just show the covers in color at rest. */}
        <div className="absolute inset-0 grid transform-gpu grid-cols-2 gap-1 p-1 saturate-100 transition-all duration-500 ease-in-out will-change-transform group-hover:scale-110 md:saturate-0 md:group-hover:saturate-100">
          {covers.length ? (
            covers.slice(0, 4).map((book, i) => (
              <div
                key={book.id}
                className={`relative overflow-hidden rounded-xl bg-paper ${
                  covers.length === 3 && i === 0 ? "col-span-2" : ""
                }`}
              >
                {book.thumbnail && (
                  <Image
                    src={book.thumbnail}
                    alt=""
                    fill
                    quality={90}
                    // A cover here is ~half a grid column, not a flat 300px —
                    // on a 3-col desktop row that's ~150-190px CSS, but on a
                    // retina screen (2-3x DPR) that needs a 380-570px source
                    // to stay sharp. The old flat "300px" hint under-requested
                    // that, so Next served a softer variant — which also made
                    // the hover-scale look like it "popped" mid-transition as
                    // the browser swapped up to a sharper one right when the
                    // box grew. book-card.tsx already does this correctly;
                    // this mirrors it for the same reason.
                    sizes="(min-width: 1024px) 190px, (min-width: 640px) 25vw, 45vw"
                    className="object-cover"
                  />
                )}
              </div>
            ))
          ) : (
            <div className="col-span-2 flex items-center justify-center rounded-xl bg-paper">
              <BookOpen size={28} className="text-pebble" />
            </div>
          )}
        </div>

        {/* Scrim — the reference relies on a flat bg-slate-300 behind
            translucent text; our background is photographic book covers, so
            it needs a gradient for the text to stay legible over any cover
            color. Ink token keeps it on-theme instead of a generic black. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />

        {/* Content — same layout as the reference: arrow top-right, label
            bottom-left, both riding above the scrim. */}
        <div className="relative z-20 flex h-full flex-col justify-between p-4">
          <ArrowUpRight
            size={22}
            className="ml-auto text-paper/70 transition-transform duration-500 group-hover:-rotate-45 group-hover:text-paper"
          />
          <AnimatedLabel text={t(titleKey)} />
        </div>
      </Link>
    </motion.div>
  );
}

export function FeatureGrid({
  byGenre,
  byMood,
  byRating,
}: {
  byGenre: Book[];
  byMood: Book[];
  byRating: Book[];
}) {
  const t = useT();

  const cards = [
    { titleKey: "feature.byGenre" as TranslationKey, href: "/explore?q=subject:fantasy", covers: byGenre },
    { titleKey: "feature.byMood" as TranslationKey, href: "/explore?q=subject:self-help", covers: byMood },
    { titleKey: "feature.byRating" as TranslationKey, href: "/explore?q=subject:fiction&sort=rating", covers: byRating },
  ];

  return (
    <section id="cara-kerja" className="px-6 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="type-display text-ink">{t("feature.title")}</h2>
          <p className="type-subheading mt-4 text-ink">{t("feature.sub")}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 md:mt-16">
          {cards.map((card, i) => (
            <RevealItem key={card.titleKey} index={i}>
              <FeatureCard {...card} />
            </RevealItem>
          ))}
        </div>
      </div>
    </section>
  );
}
