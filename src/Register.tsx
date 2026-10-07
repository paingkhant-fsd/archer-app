import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, LockKeyhole, UserRoundPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { registerAccount } from "./api";
import { LanguageSwitcher } from "./i18n/LanguageSwitcher";
import { useI18n } from "./i18n/I18nProvider";
import type { TranslationKey } from "./i18n/en";
import { ThemeToggle } from "./theme/ThemeToggle";

export function Register() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorKey, setErrorKey] = useState<TranslationKey | "">("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorKey("");

    if (name.trim().length < 2) {
      setErrorKey("register.nameInvalid");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorKey("register.emailInvalid");
      return;
    }
    if (password.length < 8) {
      setErrorKey("register.passwordInvalid");
      return;
    }
    if (password !== confirmation) {
      setErrorKey("register.passwordMismatch");
      return;
    }

    setBusy(true);
    try {
      const data = await registerAccount({ name: name.trim(), email, password });
      localStorage.setItem("archer_access_token", data.accessToken);
      localStorage.setItem("archer_refresh_token", data.refreshToken);
      navigate("/");
    } catch (error) {
      setErrorKey(error instanceof Error && error.message === "EMAIL_IN_USE"
        ? "register.emailInUse"
        : "register.unavailable");
    } finally {
      setBusy(false);
    }
  }

  return <main className="register-page">
    <section className="register-story">
      <div className="register-preferences"><ThemeToggle /><LanguageSwitcher /></div>
      <Link className="wordmark register-wordmark" to="/" aria-label={t("brand.home")}><span className="wordmark-mark"><ArrowRight size={17} strokeWidth={2.5} /></span><span>Archer</span></Link>
      <div className="register-story__content">
        <p className="register-kicker">{t("register.kicker")}</p>
        <h1>{t("register.title")}</h1>
        <p>{t("register.pitch")}</p>
        <ul className="register-benefits">
          <li><Check /> {t("register.benefitProjects")}</li>
          <li><Check /> {t("register.benefitProfile")}</li>
          <li><Check /> {t("register.benefitCurrency")}</li>
        </ul>
      </div>
      <p className="register-story__note"><LockKeyhole size={15} /> {t("register.private")}</p>
    </section>

    <section className="register-entry">
      <div className="register-entry__top"><Link to="/"><ArrowLeft size={16} /> {t("register.back")}</Link></div>
      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <span className="register-form__icon"><UserRoundPlus size={22} /></span>
        <p className="register-form__eyebrow">{t("register.eyebrow")}</p>
        <h2>{t("register.formTitle")}</h2>
        <p className="register-form__help">{t("register.formHelp")}</p>

        <label className="register-field">{t("register.name")}
          <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" minLength={2} maxLength={100} required placeholder={t("register.namePlaceholder")} />
        </label>
        <label className="register-field">{t("register.email")}
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required placeholder={t("register.emailPlaceholder")} />
        </label>
        <label className="register-field">{t("register.password")}
          <span className="register-password"><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} maxLength={100} required aria-describedby="password-help" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span>
          <small id="password-help">{t("register.passwordHelp")}</small>
        </label>
        <label className="register-field">{t("register.confirmPassword")}
          <input type={showPassword ? "text" : "password"} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="new-password" minLength={8} maxLength={100} required />
        </label>

        {errorKey && <p className="form-error register-error" role="alert">{t(errorKey)}</p>}
        <button className="register-submit" disabled={busy}>{busy ? t("register.creating") : t("register.create")} {!busy && <ArrowRight size={16} />}</button>
        <p className="register-signin">{t("register.haveAccount")} <Link to="/login">{t("register.signIn")}</Link></p>
      </form>
    </section>
  </main>;
}
