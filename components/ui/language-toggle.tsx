"use client";

import { useLocale } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

/**
 * Two-state switcher. With only ID and EN a dropdown would be overkill, so
 * this toggles straight to the other language and labels itself with it.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();
  const next = locale === "id" ? "en" : "id";

  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      aria-label={t("nav.language")}
      title={t("nav.language")}
      className={cn(
        "inline-flex h-11 shrink-0 items-center justify-center rounded-full px-2.5 type-caption uppercase tracking-wide text-stone transition-colors hover:bg-ink/5 hover:text-ink md:h-9",
        className
      )}
    >
      {locale}
    </button>
  );
}
