"use client";

import Link from "next/link";
import { exploreGenres } from "@/lib/collections";
import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

/**
 * Horizontal, scrollable genre tab row shown under the search field.
 * `activeQuery` is the raw `?q=` value so the matching tab can be marked active.
 */
export function GenreTabs({ activeQuery }: { activeQuery?: string }) {
  const t = useT();

  const tabs = [
    { label: t("explore.all"), href: "/explore", query: null as string | null },
    ...exploreGenres.map((genre) => ({
      label: genre,
      href: `/explore?q=${encodeURIComponent(`subject:${genre}`)}`,
      query: `subject:${genre}`,
    })),
  ];

  return (
    <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] md:-mx-6 md:px-6 [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max items-center gap-1 pb-1">
        {tabs.map((tab) => {
          const isActive = tab.query ? activeQuery === tab.query : !activeQuery;

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 type-caption transition-colors",
                isActive ? "bg-ink text-paper" : "text-stone hover:bg-ink/5 hover:text-ink"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
