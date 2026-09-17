"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Book } from "@/lib/types";
import { useT } from "@/lib/i18n/context";
import { Reveal } from "@/components/ui/reveal";

// Self-hosted so the section never depends on a third-party CDN being up.
// See /public/videos/README.md for where to source a replacement clip.
const VIDEO_SRC = "/videos/book-reveal.mp4";

// Motion-safe fallback for the scroll-scale reveal below: the values the
// frame would otherwise animate *to*, applied as static style when the OS
// asks for reduced motion — so the whole frame renders at rest, not just
// the video-vs-cover swap that was already handled.
const STATIC_REVEAL = { scale: 1, opacity: 1, filter: "none" };

const MotionLink = motion(Link);

export function Spotlight({ book }: { book: Book | null }) {
  const t = useT();
  const [videoFailed, setVideoFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  // Narrower window than the parallax above: this one drives the frame's
  // "small → full size" reveal, and needs to *finish* once the section has
  // settled near its resting position — not keep responding for as long as
  // the section is anywhere on screen (that would feel like it's fidgeting
  // instead of arriving). Runs from "just appearing at the bottom" to
  // "mostly settled near the top".
  const { scrollYProgress: revealProgress } = useScroll({
    target: sectionRef,
    offset: ["start 90%", "start 35%"],
  });
  const scale = useTransform(revealProgress, [0, 1], [0.5, 1]);
  const revealOpacity = useTransform(revealProgress, [0, 1], [0.6, 1]);
  const blurPx = useTransform(revealProgress, [0, 1], [12, 0]);
  const filter = useTransform(blurPx, (v) => `blur(${v}px)`);

  // Respect the OS-level motion preference: skip the looping clip entirely
  // and fall through to the static cover instead of forcing autoplay on it.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard: matchMedia is unavailable server-side, so the true value can only be read after mount
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // `autoPlay` alone is unreliable once other attributes (preload, lazy
  // mount, browser autoplay heuristics) are in play — Safari/iOS in
  // particular will silently leave the video paused on its first frame.
  // Calling .play() explicitly once the element has enough data, and
  // swallowing the rejection, makes the loop actually start instead of
  // relying on the attribute alone.
  useEffect(() => {
    if (reducedMotion || videoFailed) return;
    const el = videoRef.current;
    if (!el) return;
    const tryPlay = () => {
      el.play().catch(() => {
        // Autoplay blocked (rare with muted+playsInline) — the poster/first
        // frame stays visible, which is an acceptable fallback.
      });
    };
    if (el.readyState >= 2) tryPlay();
    else el.addEventListener("loadeddata", tryPlay, { once: true });
    return () => el.removeEventListener("loadeddata", tryPlay);
  }, [reducedMotion, videoFailed]);

  if (!book) return null;

  const showVideo = !videoFailed && !reducedMotion;

  return (
    <section id="sorotan" className="px-4 md:px-6">
      <Reveal className="mx-auto max-w-6xl">
        <MotionLink
          ref={sectionRef}
          href={`/book/${book.id}`}
          className="group relative block aspect-[16/9] overflow-hidden rounded-2xl bg-ink md:aspect-[21/9]"
          style={reducedMotion ? STATIC_REVEAL : { scale, opacity: revealOpacity, filter }}
        >
          <motion.div style={{ y: parallaxY }} className="absolute inset-0 -top-[6%] -bottom-[6%]">
            {showVideo && (
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={book.thumbnail ?? undefined}
                onError={() => setVideoFailed(true)}
                className="h-full w-full scale-105 object-cover grayscale transition-transform duration-700 group-hover:scale-110"
              >
                <source src={VIDEO_SRC} type="video/mp4" />
              </video>
            )}
            {!showVideo && book.thumbnail && (
              <Image
                src={book.thumbnail}
                alt=""
                fill
                quality={90}
                sizes="1200px"
                className="scale-105 object-cover grayscale transition-transform duration-700 group-hover:scale-110"
              />
            )}
          </motion.div>
          {/* Duotone-ish wash instead of a blur — keeps the footage/cover sharp
              while still guaranteeing paper-colored text stays legible. */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/10" />

          <div className="relative flex h-full flex-col justify-between p-6 md:p-10">
            <div className="flex items-center justify-between text-paper">
              <span className="type-heading-lg flex items-center gap-3">
                <motion.span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-paper/15 backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Play size={16} className="fill-paper" />
                </motion.span>
                {t("spotlight.title")}
              </span>
              <span className="type-heading-lg hidden md:block">
                {t("spotlight.subtitle")}
              </span>
            </div>

            <div className="flex flex-col gap-1 text-paper">
              <span className="type-caption text-paper/70">
                {t("spotlight.featuring")} {book.authors[0] ?? t("spotlight.author")}
              </span>
              <span className="type-heading-sm">{book.title}</span>
            </div>
          </div>
        </MotionLink>
      </Reveal>
    </section>
  );
}
