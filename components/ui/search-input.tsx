"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

const PLACEHOLDER_KEYS: TranslationKey[] = [
  "search.p1",
  "search.p2",
  "search.p3",
  "search.p4",
  "search.p5",
];

export function SearchInput({
  size = "md",
  autoFocus = false,
  className,
  shortcutHint = false,
}: {
  size?: "sm" | "md" | "lg";
  autoFocus?: boolean;
  className?: string;
  /** Shows a "Ctrl K" / "⌘K" badge and opens the global command palette
   * instead of typing in place — used for the navbar's compact search. */
  shortcutHint?: boolean;
}) {
  const t = useT();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams?.get("q") ?? "");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isMac, setIsMac] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Deferred to an effect (not a lazy useState initializer) on purpose:
    // this runs after hydration only, so the server-rendered "Ctrl K" badge
    // can't mismatch a client-rendered "⌘K" one.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMac(/Mac|iPhone|iPad/.test(window.navigator.platform ?? window.navigator.userAgent));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_KEYS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  function onFocus(e: React.FocusEvent<HTMLInputElement>) {
    if (!shortcutHint) return;
    // Hand off to the command palette instead of typing inline — keeps this
    // box purely as an entry point + visual "you can press Ctrl K" hint.
    e.target.blur();
    window.dispatchEvent(new CustomEvent("alinea:open-command-palette"));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/explore?q=${encodeURIComponent(q)}` : "/explore");
  }

  const sizeClasses = {
    sm: "type-caption py-2 pl-9 pr-3",
    md: "type-body py-2.5 pl-10 pr-4",
    lg: "type-subheading py-4 pl-12 pr-5",
  }[size];

  const iconPos = size === "lg" ? "left-4" : size === "sm" ? "left-3" : "left-3.5";
  const iconSize = size === "lg" ? 20 : 16;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <Search
        size={iconSize}
        className={cn("pointer-events-none absolute top-1/2 -translate-y-1/2 text-stone", iconPos)}
      />
      <input
        type="text"
        value={value}
        autoFocus={autoFocus}
        onFocus={onFocus}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t(PLACEHOLDER_KEYS[placeholderIndex])}
        className={cn(
          "focus-ring-inset w-full rounded-2xl border border-ink/10 bg-paper text-ink placeholder:text-stone/70 outline-none transition-colors focus:border-ink/30 focus-visible:outline-none",
          shortcutHint && "pr-16 cursor-pointer",
          sizeClasses
        )}
        aria-label={t("search.label")}
      />
      {shortcutHint && (
        <kbd
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-ink/10 bg-ink/5 px-1.5 py-0.5 type-caption text-[11px] leading-none text-stone sm:flex"
        >
          {isMac ? "⌘" : "Ctrl"} K
        </kbd>
      )}
    </form>
  );
}
