"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useT } from "@/lib/i18n/context";
import { collections, exploreGenres } from "@/lib/collections";
import { useSession } from "@/lib/auth/use-session";
import { logoutAction } from "@/lib/actions/auth";

/**
 * Below `lg` the navbar's mega-menu (NavDropdown) is hidden entirely with no
 * replacement, so genre/collection navigation was only reachable by first
 * landing on /explore. This gives phones/tablets an equivalent entry point.
 */
export function MobileNav() {
  const t = useT();
  const { user, loading } = useSession();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  // Rendered via portal straight into <body>: this overlay is `fixed`, but
  // NavPill's header is a `motion.header` — Framer Motion leaves a `transform`
  // on animated elements, and any ancestor transform turns `position: fixed`
  // into "fixed relative to that ancestor" instead of the viewport. Left as a
  // normal child, the overlay would be clipped to the header's own (short)
  // box. Portaling out of the header sidesteps that entirely.
  const overlay = (
    <AnimatePresence>
      {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[110] bg-ink/40 backdrop-blur-sm"
            onClick={close}
            role="presentation"
          >
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
              className="max-h-[85vh] overflow-y-auto rounded-b-3xl bg-paper px-5 pb-8 pt-[max(1.25rem,env(safe-area-inset-top))] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)]"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={t("nav.menu")}
            >
              <div className="flex items-center justify-between">
                <span className="type-subheading font-medium text-ink">alinea</span>
                <button
                  type="button"
                  onClick={close}
                  aria-label={t("nav.closeMenu")}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-stone transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="mt-6 flex flex-col gap-6">
                <div>
                  <Link
                    href="/explore"
                    onClick={close}
                    className="type-heading-sm text-ink"
                  >
                    {t("nav.explore")}
                  </Link>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {exploreGenres.map((genre) => (
                      <Link
                        key={genre}
                        href={`/explore?q=${encodeURIComponent(`subject:${genre}`)}`}
                        onClick={close}
                        className="type-caption min-h-11 rounded-full border border-ink/10 px-4 py-2.5 leading-6 text-stone transition-colors hover:border-ink/30 hover:text-ink"
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <Link
                    href="/explore#koleksi"
                    onClick={close}
                    className="type-heading-sm text-ink"
                  >
                    {t("nav.collections")}
                  </Link>
                  <div className="mt-3 flex flex-col">
                    {collections.map((col) => (
                      <Link
                        key={col.slug}
                        href={`/explore?q=${encodeURIComponent(col.query)}`}
                        onClick={close}
                        className="type-body flex min-h-11 items-center rounded-xl px-2 text-stone transition-colors hover:bg-ink/5 hover:text-ink"
                      >
                        {t(col.titleKey)}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col border-t border-ink/10 pt-4">
                  <Link
                    href="/#cara-kerja"
                    onClick={close}
                    className="type-body flex min-h-11 items-center text-stone transition-colors hover:text-ink"
                  >
                    {t("nav.how")}
                  </Link>
                  {!loading && user ? (
                    <>
                      <Link
                        href="/account"
                        onClick={close}
                        className="type-body flex min-h-11 items-center text-stone transition-colors hover:text-ink"
                      >
                        {user.name.split(" ")[0]}
                      </Link>
                      <form action={logoutAction}>
                        <button
                          type="submit"
                          onClick={close}
                          className="type-body flex min-h-11 w-full items-center text-left text-stone transition-colors hover:text-ink"
                        >
                          Keluar
                        </button>
                      </form>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={close}
                      className="type-body flex min-h-11 items-center text-stone transition-colors hover:text-ink"
                    >
                      {t("nav.signin")}
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
    </AnimatePresence>
  );

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("nav.menu")}
        aria-expanded={open}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-stone transition-colors hover:bg-ink/5 hover:text-ink"
      >
        <Menu size={20} />
      </button>

      {typeof document !== "undefined" && createPortal(overlay, document.body)}
    </div>
  );
}
