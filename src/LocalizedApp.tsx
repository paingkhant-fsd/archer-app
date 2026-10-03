import { useState } from "react";
import type { FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, BadgeCheck, BriefcaseBusiness, Building2, Check, ChevronDown, CircleDollarSign, Clock3, Eye, EyeOff, FileCheck2, Globe2, LockKeyhole, Menu, Search, ShieldCheck, Sparkles, UsersRound, X } from "lucide-react";
import { Link, Outlet, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { API_URL, formatPostedDate, getCategories, getProject, getProjects, type Project } from "./api";
import { LanguageSwitcher } from "./i18n/LanguageSwitcher";
import { useI18n } from "./i18n/I18nProvider";
import type { TranslationKey } from "./i18n/en";
import "./App.css";
import "./Login.css";
import "./i18n/BurmeseTypography.css";

function LocalizedApp() { return <Routes><Route path="/login" element={<Login />} /><Route element={<Shell />}><Route path="/" element={<Home />} /><Route path="/projects/:projectId" element={<ProjectDetail />} /></Route></Routes>; }

function Brand() { const { t } = useI18n(); return <Link className="wordmark" to="/" aria-label={t("brand.home")}><span className="wordmark-mark"><ArrowRight size={17} strokeWidth={2.5} /></span><span>Archer</span></Link>; }

function Shell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useI18n();
  return <div className="app-shell"><header className="topbar"><Brand /><nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label={t("nav.primary")}><a href="/#projects" onClick={() => setMenuOpen(false)}>{t("nav.findWork")}</a><a href="/#clients" onClick={() => setMenuOpen(false)}>{t("nav.forClients")}</a><a href="/#process" onClick={() => setMenuOpen(false)}>{t("nav.howItWorks")}</a></nav><div className="top-actions"><LanguageSwitcher /><Link className="login-link" to="/login">{t("nav.signIn")}</Link><Link className="button button-primary button-small" to="/login">{t("nav.getStarted")} <ArrowRight size={15} /></Link><button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={t("nav.toggle")} aria-expanded={menuOpen}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button></div></header><main><Outlet /></main><footer className="footer"><div><Brand /><p>{t("footer.tagline")}</p></div><div className="footer-meta"><span>{t("footer.copyright")}</span><span>{t("common.currencySupport")}</span></div></footer></div>;
}

function Home() {
  const { t } = useI18n();
  const [query, setQuery] = useState(""); const [categoryId, setCategoryId] = useState(""); const [currency, setCurrency] = useState("");
  const { data: projects = [], isLoading, isError, refetch } = useQuery({ queryKey: ["projects", query, categoryId, currency], queryFn: () => getProjects({ search: query, categoryId, currency }) });
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const projectCount = t(projects.length === 1 ? "market.projectCountOne" : "market.projectCountMany", { count: projects.length });
  return <>
    <section className="hero-section"><div className="hero-copy"><div className="eyebrow"><BadgeCheck size={15} /> {t("hero.eyebrow")}</div><h1>{t("hero.titleStart")} <span>{t("hero.titleAccent")}</span></h1><p className="hero-description">{t("hero.description")}</p><div className="hero-actions"><a className="button button-primary" href="#projects">{t("hero.explore")} <ArrowRight size={17} /></a><Link className="button button-secondary" to="/login">{t("hero.hire")}</Link></div><div className="hero-proof"><div><ShieldCheck /><span><strong>{t("hero.verifiedTitle")}</strong>{t("hero.verifiedText")}</span></div><div><Globe2 /><span><strong>{t("hero.globalTitle")}</strong>{t("common.currencySupport")}</span></div></div></div>
      <div className="hero-visual" aria-hidden="true"><div className="visual-grid" /><div className="signal-card signal-main"><div className="signal-header"><span className="signal-icon"><BriefcaseBusiness size={18} /></span><span className="live-pill"><i /> {t("hero.openProject")}</span></div><div className="signal-kicker">{t("hero.sampleCategory")}</div><h3>{t("hero.sampleTitle")}</h3><div className="signal-tags"><span>{t("hero.sampleSkillDesign")}</span><span>{t("hero.sampleSkillResearch")}</span></div><div className="signal-footer"><strong>USD 4,000 – 6,000</strong><span>{t("hero.sampleProposals")}</span></div></div><div className="signal-card signal-talent"><span className="avatar">MK</span><div><strong>{t("hero.expertMatched")}</strong><small>{t("hero.profileFit")}</small></div><BadgeCheck size={18} /></div><div className="signal-card signal-secure"><ShieldCheck size={18} /><div><strong>{t("hero.protectedTitle")}</strong><small>{t("hero.protectedText")}</small></div></div></div></section>
    <section className="confidence-bar" aria-label={t("benefits.label")}><span><Building2 size={18} /> {t("benefits.businesses")}</span><span><UsersRound size={18} /> {t("benefits.professionals")}</span><span><FileCheck2 size={18} /> {t("benefits.workflows")}</span></section>
    <section className="marketplace" id="projects"><div className="section-heading"><div><div className="eyebrow">{t("market.eyebrow")}</div><h2>{t("market.title")}</h2></div><p>{t("market.description")}</p></div>
      <div className="search-panel"><label className="search-box"><Search size={20} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("market.searchPlaceholder")} aria-label={t("market.searchLabel")} />{query && <button onClick={() => setQuery("")} aria-label={t("market.clearSearch")}><X size={16} /></button>}</label><label className="select-wrap"><span>{t("market.category")}</span><select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}><option value="">{t("market.allCategories")}</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><ChevronDown size={16} /></label><label className="select-wrap"><span>{t("market.currency")}</span><select value={currency} onChange={(e) => setCurrency(e.target.value)}><option value="">{t("market.allCurrencies")}</option><option>USD</option><option>MMK</option></select><ChevronDown size={16} /></label></div>
      <div className="results-meta"><div><strong>{isLoading ? t("market.loading") : projectCount}</strong><span>{t("market.filterMatch")}</span></div><span className="sort-label">{t("market.sorted")}</span></div>
      {isLoading ? <ProjectSkeleton /> : isError ? <Empty title={t("market.loadErrorTitle")} text={t("market.loadErrorText")} action={t("market.tryAgain")} onClick={() => refetch()} /> : projects.length === 0 ? <Empty title={t("market.emptyTitle")} text={t("market.emptyText")} action={t("market.clearFilters")} onClick={() => { setQuery(""); setCategoryId(""); setCurrency(""); }} /> : <div className="project-grid">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>}
    </section>
    <section className="process-section" id="process"><div className="section-heading light"><div><div className="eyebrow">{t("process.eyebrow")}</div><h2>{t("process.title")}</h2></div><p>{t("process.description")}</p></div><div className="process-grid"><div><span>01</span><Search /><h3>{t("process.discoverTitle")}</h3><p>{t("process.discoverText")}</p></div><div><span>02</span><FileCheck2 /><h3>{t("process.alignTitle")}</h3><p>{t("process.alignText")}</p></div><div><span>03</span><BadgeCheck /><h3>{t("process.deliverTitle")}</h3><p>{t("process.deliverText")}</p></div></div></section>
    <section className="client-cta" id="clients"><div><div className="eyebrow">{t("client.eyebrow")}</div><h2>{t("client.title")}</h2><p>{t("client.description")}</p></div><Link className="button button-white" to="/login">{t("client.post")} <ArrowRight size={17} /></Link></section>
  </>;
}

function Empty({ title, text, action, onClick }: { title: string; text: string; action: string; onClick: () => void }) { return <div className="empty-state"><span className="empty-icon"><Search size={24} /></span><h3>{title}</h3><p>{text}</p><button className="button button-secondary" onClick={onClick}>{action}</button></div>; }
function ProjectSkeleton() { const { t } = useI18n(); return <div className="project-grid" aria-label={t("market.loading")}>{[1, 2, 3, 4].map((item) => <div className="project-card skeleton" key={item}><span /><span /><span /><span /></div>)}</div>; }
function ProjectCard({ project }: { project: Project }) { const { locale, t } = useI18n(); return <Link to={`/projects/${project.id}`} className="project-card"><div className="card-top"><span className="category-label">{project.category}</span><span className="status-label"><i /> {t("project.accepting")}</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="tag-row">{project.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div><div className="card-bottom"><div><span>{t("project.budget")}</span><strong>{project.budget ? `${project.currency} ${project.budget}` : t("project.notSpecified")}</strong></div><div><span>{t("project.posted")}</span><strong><Clock3 size={13} /> {formatPostedDate(project.createdAt, locale)}</strong></div><div><span>{t("project.proposals")}</span><strong>{project.proposals}</strong></div><ArrowRight className="card-arrow" size={19} /></div></Link>; }

function ProjectDetail() {
  const { locale, t } = useI18n();
  const { projectId } = useParams(); const { data: project, isLoading, isError } = useQuery({ queryKey: ["project", projectId], queryFn: () => getProject(projectId ?? ""), enabled: Boolean(projectId) });
  if (isLoading) return <section className="detail-page page-state"><div className="eyebrow">{t("project.loadingLabel")}</div><h1>{t("project.loadingTitle")}</h1></section>;
  if (isError || !project) return <section className="detail-page page-state"><Link className="back-link" to="/"><ArrowLeft size={16} /> {t("project.back")}</Link><h1>{t("project.notFound")}</h1><p>{t("project.notFoundText")}</p></section>;
  return <section className="detail-page"><Link className="back-link" to="/#projects"><ArrowLeft size={16} /> {t("project.all")}</Link><div className="detail-layout"><article><div className="detail-meta"><span className="category-label">{project.category}</span><span className="status-label"><i /> {t("project.accepting")}</span></div><h1>{project.title}</h1><p className="detail-lede">{project.description}</p><div className="detail-facts"><div><Clock3 /><span>{t("project.posted")}<strong>{formatPostedDate(project.createdAt, locale)}</strong></span></div><div><UsersRound /><span>{t("project.interest")}<strong>{t("project.proposalCount", { count: project.proposals })}</strong></span></div><div><CircleDollarSign /><span>{t("project.currency")}<strong>{project.currency}</strong></span></div></div><div className="detail-divider" /><h2>{t("project.overview")}</h2><p>{t("project.overviewText")}</p><h2>{t("project.skills")}</h2><div className="tag-row detail-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><h2>{t("project.strongProposal")}</h2><ul className="check-list"><li><Check /> {t("project.proposalTipOne")}</li><li><Check /> {t("project.proposalTipTwo")}</li><li><Check /> {t("project.proposalTipThree")}</li></ul></article><aside className="apply-panel"><span className="panel-label">{t("project.projectBudget")}</span><strong className="panel-price">{project.budget ? `${project.currency} ${project.budget}` : t("project.notSpecified")}</strong><p>{t("project.applyText")}</p><Link to="/login" className="button button-primary full-width">{t("project.submit")} <ArrowRight size={16} /></Link><div className="panel-note"><ShieldCheck size={17} /><span><strong>{t("project.confidence")}</strong>{t("project.noPayment")}</span></div><div className="panel-divider" /><small>{t("project.id")}<br /><b>{project.id}</b></small></aside></div></section>;
}

const DEMO_PASSWORD = "ArcherDemo123!";
const demoAccounts: { roleKey: TranslationKey; nameKey: TranslationKey; descriptionKey: TranslationKey; email: string }[] = [
  { roleKey: "account.client", nameKey: "account.clientOne", descriptionKey: "account.projects", email: "client1@archer.local" },
  { roleKey: "account.freelancer", nameKey: "account.freelancerOne", descriptionKey: "account.bids", email: "freelancer1@archer.local" },
  { roleKey: "account.client", nameKey: "account.clientTwo", descriptionKey: "account.another", email: "client2@archer.local" },
  { roleKey: "account.admin", nameKey: "account.adminOne", descriptionKey: "account.platform", email: "admin1@archer.local" },
];

function Login() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [selectedEmail, setSelectedEmail] = useState(demoAccounts[0].email);
  const [email, setEmail] = useState(demoAccounts[0].email);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [errorKey, setErrorKey] = useState<TranslationKey | "">("");
  const [busy, setBusy] = useState(false);

  function chooseAccount(account: (typeof demoAccounts)[number]) { setSelectedEmail(account.email); setEmail(account.email); setPassword(DEMO_PASSWORD); setErrorKey(""); }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setErrorKey("");
    try {
      const response = await fetch(`${API_URL}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      if (!response.ok) throw new Error("invalid");
      const data = await response.json();
      localStorage.setItem("archer_access_token", data.accessToken);
      localStorage.setItem("archer_refresh_token", data.refreshToken);
      navigate("/");
    } catch (error) { setErrorKey(error instanceof Error && error.message === "invalid" ? "login.invalid" : "login.unavailable"); }
    finally { setBusy(false); }
  }

  return <main className="demo-login">
    <section className="demo-login__story"><LanguageSwitcher className="language-switcher--login" /><Brand /><div className="demo-login__pitch"><p className="demo-login__kicker">{t("login.kicker")}</p><h1 style={{ fontSize: "clamp(3.05rem, 4.15vw, 4.2rem)" }}>{t("login.title")}</h1><p>{t("login.pitch")}</p><div className="demo-login__privacy"><span><LockKeyhole size={16} /></span> {t("login.privacy")}</div></div><p className="demo-login__copyright">{t("login.copyright")}</p></section>
    <section className="demo-login__entry"><form className="demo-login__form" onSubmit={handleSubmit}><p className="demo-login__label">{t("login.workspace")}</p><h2>{t("login.choose")}</h2><p className="demo-login__help">{t("login.help")}</p><div className="demo-accounts" role="radiogroup" aria-label={t("login.accounts")}>
      {demoAccounts.map((account) => { const selected = selectedEmail === account.email; return <button className={`demo-account${selected ? " is-selected" : ""}`} type="button" role="radio" aria-checked={selected} key={account.email} onClick={() => chooseAccount(account)}><span className="demo-account__role">{t(account.roleKey)}</span><strong>{t(account.nameKey)}</strong><small>{t(account.descriptionKey)}</small>{selected && <span className="demo-account__check"><Check size={13} strokeWidth={3} /></span>}</button>; })}
    </div><label className="demo-field">{t("login.email")}<input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setSelectedEmail(""); }} autoComplete="email" required /></label><label className="demo-field">{t("login.password")}<span className="demo-password"><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" minLength={8} required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>{errorKey && <p className="form-error" role="alert">{t(errorKey)}</p>}<button className="demo-login__submit" disabled={busy}>{busy ? t("login.entering") : t("login.enter")}{!busy && <ArrowRight size={16} />}</button><p className="demo-login__note"><Sparkles size={13} /> {t("login.note")}</p></form></section>
  </main>;
}

export default LocalizedApp;
