"use client";

import { ThemeProvider } from "next-themes";
import { LocaleProvider } from "@/lib/i18n/context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <LocaleProvider>{children}</LocaleProvider>
    </ThemeProvider>
  );
}
