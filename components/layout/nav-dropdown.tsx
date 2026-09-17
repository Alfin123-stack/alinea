"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavDropdown({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  function show() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(true);
  }

  // Small delay before closing so moving the cursor diagonally into the
  // panel doesn't accidentally dismiss it.
  function hide() {
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  }

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <Link
        href={href}
        className="type-caption inline-flex items-center gap-1 text-stone transition-colors hover:text-ink"
      >
        {label}
        <ChevronDown
          size={12}
          className={cn("transition-transform duration-200", open && "rotate-180")}
        />
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute left-1/2 top-full z-50 mt-3 w-64 -translate-x-1/2 rounded-2xl border border-ink/10 bg-paper p-2 shadow-[0_20px_44px_-16px_rgba(0,0,0,0.3)]"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function NavDropdownLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="type-caption block rounded-xl px-3 py-2 text-stone transition-colors hover:bg-ink/5 hover:text-ink"
    >
      {children}
    </Link>
  );
}
