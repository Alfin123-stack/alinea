import Link from "next/link";
import { Lock } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Wraps already-rendered content in a blurred, height-capped teaser with a
 * login/register card on top. The wrapped content stays in the HTML (so
 * anonymous crawlers see the same thing anonymous visitors do — this is a
 * soft content gate, not cloaking), it's just visually + interactively
 * disabled until the visitor signs in.
 */
export function GateOverlay({
  next,
  title,
  description,
  maxHeight = 420,
  children,
}: {
  /** Path to return to after login/register (e.g. `/book/${id}`). */
  next: string;
  title: string;
  description?: string;
  maxHeight?: number;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      {/* Blurred teaser — overflow-hidden + maxHeight only clip *this* layer.
          The card below sits in a sibling layer with no height cap and no
          overflow-hidden ancestor, so it always renders in full no matter
          how long the title/description text runs (previously both layers
          shared one clipped box, so a long title could push the card's own
          bottom edge past the cap and get sliced off). */}
      <div className="overflow-hidden rounded-2xl" style={{ maxHeight }}>
        <div aria-hidden className="pointer-events-none select-none blur-[5px]">
          {children}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-linen via-linen/85 to-transparent" />
      </div>

      <div className="absolute inset-0 flex items-end justify-center px-4 pb-6 sm:items-center">
        <div className="w-full max-w-sm rounded-2xl border border-ink/10 bg-paper p-6 text-center shadow-[0_24px_60px_-20px_rgba(0,0,0,0.25)]">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 text-ink">
            <Lock size={16} />
          </div>
          <p className="type-subheading mt-3 text-ink">{title}</p>
          {description && <p className="type-caption mt-1 text-stone">{description}</p>}
          <div className="mt-5 flex gap-2">
            <Link
              href={`/login?next=${encodeURIComponent(next)}`}
              className="flex-1 rounded-2xl bg-ink px-4 py-3 type-caption font-medium text-paper transition-colors hover:bg-ink/85"
            >
              Masuk
            </Link>
            <Link
              href={`/register?next=${encodeURIComponent(next)}`}
              className="flex-1 rounded-2xl border border-ink/15 bg-paper px-4 py-3 type-caption font-medium text-ink transition-colors hover:border-ink/30"
            >
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
