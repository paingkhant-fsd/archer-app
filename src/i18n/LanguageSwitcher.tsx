import { Languages } from "lucide-react";
import { useI18n, type Language } from "./I18nProvider";
import "./LanguageSwitcher.css";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { language, setLanguage, t } = useI18n();
  const options: { code: Language; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "my", label: "မြန်မာ" },
  ];

  return <div className={`language-switcher ${className}`.trim()} aria-label={t("language.switchLabel")} role="group">
    <Languages size={15} aria-hidden="true" />
    {options.map((option) => <button key={option.code} type="button" className={language === option.code ? "is-active" : ""} onClick={() => setLanguage(option.code)} aria-pressed={language === option.code}>{option.label}</button>)}
  </div>;
}
