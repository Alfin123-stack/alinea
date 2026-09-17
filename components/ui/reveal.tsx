"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll-reveal wrapper. Motion tokens live here rather than on each call site
 * so timing and easing stay consistent across the app; `prefers-reduced-motion`
 * is handled globally in globals.css.
 */
const EASE = [0.22, 0.61, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Staggers children by index — used for grids and card rows. */
export function RevealItem({
  children,
  index,
  className,
}: {
  children: ReactNode;
  index: number;
  className?: string;
}) {
  // Capped so a 30-item masonry grid doesn't end up with a 3-second tail.
  const delay = Math.min(index * 0.07, 0.42);
  return (
    <Reveal delay={delay} className={className}>
      {children}
    </Reveal>
  );
}
