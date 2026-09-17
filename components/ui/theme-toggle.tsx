"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Monitor, Moon, Sun } from "lucide-react";
import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

type ThemeChoice = "light" | "dark" | "system";

const OPTIONS: { value: ThemeChoice; icon: typeof Sun; labelKey: "nav.themeLight" | "nav.themeDark" | "nav.themeSystem" }[] = [
  { value: "light", icon: Sun, labelKey: "nav.themeLight" },
  { value: "dark", icon: Moon, labelKey: "nav.themeDark" },
  { value: "system", icon: Monitor, labelKey: "nav.themeSystem" },
];

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = useT();

  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard, must run post-mount only
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const current: ThemeChoice = mounted ? ((theme as ThemeChoice) ?? "system") : "system";
  const CurrentIcon =
    OPTIONS.find((o) => o.value === current)?.icon ?? (mounted && resolvedTheme === "dark" ? Moon : Sun);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("nav.theme")}
        aria-expanded={open}
        title={t("nav.theme")}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-stone transition-colors hover:bg-ink/5 hover:text-ink md:h-9 md:w-9"
      >
        {mounted ? <CurrentIcon size={17} /> : <span className="h-[17px] w-[17px]" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute right-0 top-full z-50 mt-2 flex items-center gap-0.5 rounded-full border border-ink/10 bg-paper p-1 shadow-[0_12px_28px_-12px_rgba(0,0,0,0.25)]"
          >
            {OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = current === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setTheme(opt.value);
                    setOpen(false);
                  }}
                  aria-label={t(opt.labelKey)}
                  title={t(opt.labelKey)}
                  className="relative inline-flex h-8 w-8 items-center justify-center rounded-full text-stone transition-colors hover:text-ink"
                >
                  {active && (
                    <motion.span
                      layoutId="theme-active-pill"
                      className="absolute inset-0 rounded-full bg-ink/8"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon size={15} className={cn("relative", active && "text-ink")} />
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
