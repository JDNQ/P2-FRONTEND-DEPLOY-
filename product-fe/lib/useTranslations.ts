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

export function useTranslations(namespace: string) {
  const { locale } = useLocale();
  const [messages, setMessages] = useState<Record<string, string | object>>({});

  // Load messages khi locale thay đổi
  useState(() => {
    import(`@/messages/${locale}.json`)
      .then((mod) => {
        setMessages(mod.default?.[namespace] || mod.default || {});
      })
      .catch(() => setMessages({}));
  });

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = (messages[key] as string) ?? key;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }

    return text;
  };

  return t;
}
