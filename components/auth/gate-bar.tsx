"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Lock } from "lucide-react";

/**
 * Single, page-wide login/register prompt for a gated page — pairs with
 * `<LockedTeaser>` on each locked section instead of every section carrying
 * its own full login card (repetitive, and each one competes for the same
 * decision). Mount this once, at the point the page's content actually
 * starts being locked (currently: inside `BookHeader`, right before its
 * locked block) — being `position: fixed`, where it's mounted in the DOM
 * doesn't affect where it renders, only where its trigger sentinel sits.
 *
 * A tiny sentinel element marks that boundary. Once it scrolls above the
 * viewport (the visitor has scrolled past the free preview, into locked
 * territory) the bar slides in and stays — everything below that point on
 * this page is locked too, so there's no reason to hide it again until they
 * scroll back up above the boundary.
 */
export function GateBar({ next }: { next: string }) {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.boundingClientRect.top < 0);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:bottom-4 sm:px-6"
          >
            <div className="mx-auto flex w-full max-w-xl flex-col items-stretch gap-3 rounded-2xl border border-ink/10 bg-paper/95 p-4 text-center shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <p className="type-caption flex items-center justify-center gap-2 text-ink sm:justify-start">
                <Lock size={14} className="shrink-0 text-stone" />
                Masuk untuk buka rating, sinopsis, & rekomendasi lengkap
              </p>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/login?next=${encodeURIComponent(next)}`}
                  className="flex-1 rounded-2xl bg-ink px-4 py-2.5 type-caption font-medium text-paper transition-colors hover:bg-ink/85 sm:flex-none"
                >
                  Masuk
                </Link>
                <Link
                  href={`/register?next=${encodeURIComponent(next)}`}
                  className="flex-1 rounded-2xl border border-ink/15 bg-paper px-4 py-2.5 type-caption font-medium text-ink transition-colors hover:border-ink/30 sm:flex-none"
                >
                  Daftar
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
