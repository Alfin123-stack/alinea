"use client";

import { createElement, type ElementType } from "react";
import { useT } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

/**
 * Renders a single translated string. Lets server components (pages) stay
 * server components while still emitting locale-aware copy.
 */
export function T({
  k,
  as = "span",
  className,
  vars,
}: {
  k: TranslationKey;
  as?: ElementType;
  className?: string;
  vars?: Record<string, string | number>;
}) {
  const t = useT();
  return createElement(as, { className }, t(k, vars));
}
