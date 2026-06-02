import { createContext, useContext, useState, useCallback } from "react";

type Locale = "en" | "vi";

// Simple client-side i18n without next-intl routing complexity
// Store locale in localStorage
export function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "vi";
  return (localStorage.getItem("locale") as Locale) ?? "vi";
}

export function setStoredLocale(locale: Locale) {
  if (typeof window !== "undefined") {
    localStorage.setItem("locale", locale);
    window.location.reload();
  }
}
