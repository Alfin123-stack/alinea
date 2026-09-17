"use client";

import { SearchX } from "lucide-react";
import { useT } from "@/lib/i18n/context";

export function EmptyState({ query }: { query?: string }) {
  const t = useT();

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink/15 px-6 py-20 text-center">
      <SearchX size={28} className="text-pebble" />
      <p className="type-subheading text-ink">
        {query ? `${t("empty.withQuery")} "${query}"` : t("empty.noQuery")}
      </p>
      <p className="type-caption max-w-sm text-stone">{t("empty.hint")}</p>
    </div>
  );
}
