import type { ReactNode } from "react";

/**
 * Blurred, height-capped preview of gated content — the visual teaser half
 * of `GateOverlay`, without a login card of its own. Used on the book detail
 * page, where a single `<GateBar>` supplies the one login/register prompt
 * for the whole page instead of repeating the same card in every locked
 * section (header, synopsis, related books).
 */
export function LockedTeaser({
  maxHeight = 320,
  children,
}: {
  maxHeight?: number;
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl" style={{ maxHeight }}>
      <div aria-hidden className="pointer-events-none select-none blur-[5px]">
        {children}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-linen via-linen/85 to-transparent" />
    </div>
  );
}
