"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  dictionaries,
  locales,
  type Locale,
  type TranslationKey,
} from "@/lib/i18n/dictionaries";

const STORAGE_KEY = "alinea-locale";
const DEFAULT_LOCALE: Locale = "id";

type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string;

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translate;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Always start on the default so the server render and the first client
  // render agree; the stored choice is applied right after mount.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard, must run post-mount only
    if (isLocale(stored) && stored !== DEFAULT_LOCALE) setLocaleState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    // Dip opacity, swap the strings, then let the CSS transition bring it
    // back — a soft crossfade instead of text changing mid-frame.
    setFading(true);
    window.setTimeout(() => {
      setLocaleState(next);
      window.localStorage.setItem(STORAGE_KEY, next);
      document.cookie = `${STORAGE_KEY}=${next};path=/;max-age=31536000;samesite=lax`;
      requestAnimationFrame(() => setFading(false));
    }, 160);
  }, []);

  const t = useCallback<Translate>(
    (key, vars) => {
      const table = dictionaries[locale] as Record<string, string>;
      const fallback = dictionaries[DEFAULT_LOCALE] as Record<string, string>;
      let text = table[key] ?? fallback[key] ?? key;

      if (vars) {
        for (const [name, value] of Object.entries(vars)) {
          text = text.replace(`{${name}}`, String(value));
        }
      }
      return text;
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return (
    <LocaleContext.Provider value={value}>
      <div
        className="flex min-h-full flex-1 flex-col transition-opacity duration-150 ease-out"
        style={{ opacity: fading ? 0.35 : 1 }}
      >
        {children}
      </div>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}

/** Shorthand for components that only need the translate function. */
export function useT() {
  return useLocale().t;
}
