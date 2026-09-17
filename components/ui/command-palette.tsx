"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, CornerDownLeft, X, Loader2 } from "lucide-react";
import { useT } from "@/lib/i18n/context";
import type { Book } from "@/lib/types";

const DEBOUNCE_MS = 280;

export function CommandPalette() {
  const router = useRouter();
  const t = useT();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K anywhere, Escape to dismiss.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Lets other components (e.g. the navbar's search box) open the palette
  // without needing direct state access.
  useEffect(() => {
    function onOpenRequest() {
      setOpen(true);
    }
    window.addEventListener("alinea:open-command-palette", onOpenRequest);
    return () => window.removeEventListener("alinea:open-command-palette", onOpenRequest);
  }, []);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 30);
      document.body.style.overflow = "hidden";
      return () => {
        window.clearTimeout(id);
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
  }, [open]);

  // Debounced search against the same route the explore page uses.
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resets local UI state, not synced external data
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const id = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("search failed");
        const data = (await res.json()) as { books: Book[] };
        setResults(data.books.slice(0, 6));
        setActive(0);
      } catch {
        if (!controller.signal.aborted) setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      window.clearTimeout(id);
    };
  }, [query]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const picked = results[active];
      if (picked) go(`/book/${picked.id}`);
      else if (query.trim()) go(`/explore?q=${encodeURIComponent(query.trim())}`);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-ink/40 px-4 pt-[8vh] backdrop-blur-sm sm:pt-[12vh]"
      onClick={() => setOpen(false)}
      role="presentation"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-ink/10 bg-paper"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t("cmd.open")}
      >
        <div className="flex items-center gap-3 border-b border-ink/10 px-4 transition-colors focus-within:border-ink/30">
          <Search size={18} className="shrink-0 text-stone" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder={t("cmd.placeholder")}
            className="type-body w-full bg-transparent py-4 text-ink outline-none focus-visible:outline-none placeholder:text-stone/70"
            aria-label={t("cmd.placeholder")}
          />
          {loading && <Loader2 size={16} className="shrink-0 animate-spin text-stone" />}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("cmd.close")}
            className="-mr-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-stone transition-colors hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[64vh] overflow-y-auto sm:max-h-[52vh]">
          {!query.trim() && (
            <p className="type-caption px-4 py-8 text-center text-stone">
              {t("cmd.empty")}
            </p>
          )}

          {query.trim() && !loading && !results.length && (
            <p className="type-caption px-4 py-8 text-center text-stone">
              {t("cmd.noresults")}
            </p>
          )}

          {results.map((book, i) => (
            <button
              key={book.id}
              type="button"
              onMouseEnter={() => setActive(i)}
              onClick={() => go(`/book/${book.id}`)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                i === active ? "bg-ink/5" : ""
              }`}
            >
              <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-linen">
                {book.thumbnail && (
                  <Image src={book.thumbnail} alt="" fill sizes="40px" className="object-cover" />
                )}
              </div>
              <span className="min-w-0 flex-1">
                <span className="type-caption block truncate font-medium text-ink">
                  {book.title}
                </span>
                <span className="type-caption block truncate text-stone">
                  {book.authors[0] ?? ""}
                </span>
              </span>
              {i === active && <CornerDownLeft size={14} className="shrink-0 text-stone" />}
            </button>
          ))}

          {query.trim() && results.length > 0 && (
            <button
              type="button"
              onClick={() => go(`/explore?q=${encodeURIComponent(query.trim())}`)}
              className="type-caption w-full border-t border-ink/10 px-4 py-3 text-left text-stone transition-colors hover:text-ink"
            >
              {t("cmd.seeAll")} &ldquo;{query.trim()}&rdquo;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
