"use client";

import { Star } from "lucide-react";
import { useT } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  count,
  size = "md",
  /** Flips the palette for use over a dark image/gradient (e.g. a hover
   *  overlay) — same shapes, just paper-on-ink instead of ink-on-paper. */
  inverted = false,
  className,
}: {
  rating?: number;
  count?: number;
  size?: "sm" | "md";
  inverted?: boolean;
  className?: string;
}) {
  const t = useT();

  if (!rating) {
    return (
      <span className={cn("type-caption", inverted ? "text-paper/60" : "text-pebble", className)}>
        {t("rating.none")}
      </span>
    );
  }

  const iconSize = size === "sm" ? 14 : 16;

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="inline-flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={iconSize}
            className={
              i < Math.round(rating)
                ? inverted
                  ? "fill-paper text-paper"
                  : "fill-ink text-ink"
                : inverted
                  ? "fill-transparent text-paper/30"
                  : "fill-transparent text-ink/20"
            }
          />
        ))}
      </span>
      <span className={cn("type-caption", inverted ? "text-paper/80" : "text-stone")}>
        {rating.toFixed(1)}
        {count ? ` · ${count.toLocaleString()} ${t("rating.count")}` : ""}
      </span>
    </span>
  );
}
