"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, CircleUserRound, LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

/**
 * Account dropdown for the desktop navbar — replaces the previous bare
 * "first name" link + "Keluar" text sitting loose next to the language and
 * theme toggles, which crowded the pill and gave logout no visual weight of
 * its own.
 *
 * Click-toggled rather than hover (like NavDropdown): this panel holds a
 * real destructive-ish action (logout), so dismissing it on an accidental
 * mouse-out would be worse than requiring an explicit click/tap. Also makes
 * it usable on touch screens where hover doesn't exist.
 */
export function UserMenu({ name, email }: { name: string; email: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const firstName = name.trim().split(" ")[0] || name;

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2.5 text-stone transition-colors hover:bg-ink/5 hover:text-ink",
          open && "bg-ink/5 text-ink"
        )}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink/8 text-ink">
          <CircleUserRound size={16} />
        </span>
        <span className="type-caption max-w-[10ch] truncate">{firstName}</span>
        <ChevronDown
          size={12}
          className={cn("shrink-0 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 0.61, 0.36, 1] }}
            role="menu"
            aria-label="Menu akun"
            className="absolute right-0 top-full z-50 mt-3 w-60 rounded-2xl border border-ink/10 bg-paper p-2 shadow-[0_20px_44px_-16px_rgba(0,0,0,0.3)]"
          >
            <div className="px-3 pb-2 pt-1.5">
              <p className="type-caption truncate font-medium text-ink">{name}</p>
              <p className="type-caption truncate text-pebble">{email}</p>
            </div>

            <div className="my-1 h-px bg-ink/10" />

            <Link
              href="/account"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="type-caption block rounded-xl px-3 py-2 text-stone transition-colors hover:bg-ink/5 hover:text-ink"
            >
              Akun saya
            </Link>

            <form action={logoutAction}>
              <button
                type="submit"
                role="menuitem"
                className="type-caption flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-stone transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <LogOut size={14} />
                Keluar
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
