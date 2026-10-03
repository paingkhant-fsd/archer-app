/* oxlint-disable react/only-export-components -- provider and its hook intentionally share one context module */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en, type TranslationKey } from "./en";
import { my } from "./my";

export type Language = "en" | "my";
type Variables = Record<string, string | number>;

type I18nValue = {
  language: Language;
  locale: string;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, variables?: Variables) => string;
};

const STORAGE_KEY = "archer_language";
const dictionaries = { en, my };
const I18nContext = createContext<I18nValue | null>(null);

function initialLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "my") return saved;
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }
  return navigator.language.toLowerCase().startsWith("my") ? "my" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = "ltr";
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // The live language switch still works when persistence is unavailable.
    }
  }, [language]);

  const value = useMemo<I18nValue>(() => ({
    language,
    locale: language === "my" ? "my-MM" : "en-US",
    setLanguage,
    t: (key, variables = {}) => Object.entries(variables).reduce(
      (text, [name, replacement]) => text.replaceAll(`{{${name}}}`, String(replacement)),
      dictionaries[language][key],
    ),
  }), [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
