import { Moon, Sun } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { useTheme } from "./ThemeProvider";
import "./ThemeToggle.css";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";
  const label = t(dark ? "theme.switchLight" : "theme.switchDark");

  return <button type="button" className={`theme-toggle ${className}`.trim()} onClick={toggleTheme} aria-label={label} aria-pressed={dark} title={label}>
    {dark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
  </button>;
}
