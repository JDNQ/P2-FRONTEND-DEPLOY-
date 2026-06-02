"use client";

import { useState } from "react";

type Locale = "vi" | "en";

const STORAGE_KEY = "locale";

export function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "vi";
  return (localStorage.getItem(STORAGE_KEY) as Locale) || "vi";
}

export function setStoredLocale(locale: Locale) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, locale);
  }
}

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setStoredLocale(newLocale);
    window.location.reload();
  };

  return { locale, setLocale };
}

// Synchronous-style translation with ESLint disable for require
export function useTranslations(namespace: string) {
  const { locale } = useLocale();

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const getT = (loc: string) => {
    try {
      const messages =
        loc === "en"
          ? require("../../messages/en.json")
          : require("../../messages/vi.json");

      const ns = messages[namespace] ?? {};

      return (
        key: string,
        params?: Record<string, string | number>,
      ): string => {
        let text = ns[key] ?? key;

        if (params) {
          Object.entries(params).forEach(([k, v]) => {
            text = text.replace(`{${k}}`, String(v));
          });
        }

        return text;
      };
    } catch {
      return (key: string) => key;
    }
  };

  return getT(locale);
}
