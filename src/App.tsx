import { useState } from "react";
import type { FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, BadgeCheck, BriefcaseBusiness, Building2, Check, ChevronDown, CircleDollarSign, Clock3, Eye, EyeOff, FileCheck2, Globe2, LockKeyhole, Menu, Search, ShieldCheck, Sparkles, UsersRound, X } from "lucide-react";
import { Link, Outlet, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { API_URL, getCategories, getProject, getProjects, type Project } from "./api";
import "./App.css";
import "./Login.css";

function App() { return <Routes><Route path="/login" element={<Login />} /><Route element={<Shell />}><Route path="/" element={<Home />} /><Route path="/projects/:projectId" element={<ProjectDetail />} /></Route></Routes>; }

function Brand() { return <Link className="wordmark" to="/" aria-label="Archer home"><span className="wordmark-mark"><ArrowRight size={17} strokeWidth={2.5} /></span><span>Archer</span></Link>; }

function Shell() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className="app-shell"><header className="topbar"><Brand /><nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Primary navigation"><a href="/#projects" onClick={() => setMenuOpen(false)}>Find work</a><a href="/#clients" onClick={() => setMenuOpen(false)}>For clients</a><a href="/#process" onClick={() => setMenuOpen(false)}>How it works</a></nav><div className="top-actions"><Link className="login-link" to="/login">Sign in</Link><Link className="button button-primary button-small" to="/login">Get started <ArrowRight size={15} /></Link><button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button></div></header><main><Outlet /></main><footer className="footer"><div><Brand /><p>Professional talent for meaningful work.</p></div><div className="footer-meta"><span>© 2026 Archer</span><span>USD and MMK supported</span></div></footer></div>;
}

function Home() {
  const [query, setQuery] = useState(""); const [categoryId, setCategoryId] = useState(""); const [currency, setCurrency] = useState("All currencies");
  const { data: projects = [], isLoading, isError, refetch } = useQuery({ queryKey: ["projects", query, categoryId, currency], queryFn: () => getProjects({ search: query, categoryId, currency }) });
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  return <>
    <section className="hero-section"><div className="hero-copy"><div className="eyebrow"><BadgeCheck size={15} /> Trusted talent marketplace</div><h1>Move ambitious work <span>forward.</span></h1><p className="hero-description">Connect with experienced independent professionals and manage every engagement with clarity—from brief to final delivery.</p><div className="hero-actions"><a className="button button-primary" href="#projects">Explore opportunities <ArrowRight size={17} /></a><Link className="button button-secondary" to="/login">Hire top talent</Link></div><div className="hero-proof"><div><ShieldCheck /><span><strong>Verified workflows</strong>Clear project ownership</span></div><div><Globe2 /><span><strong>Built for global work</strong>USD and MMK supported</span></div></div></div>
      <div className="hero-visual" aria-hidden="true"><div className="visual-grid" /><div className="signal-card signal-main"><div className="signal-header"><span className="signal-icon"><BriefcaseBusiness size={18} /></span><span className="live-pill"><i /> Open project</span></div><div className="signal-kicker">Product & strategy</div><h3>Senior product design partner</h3><div className="signal-tags"><span>Product Design</span><span>Research</span></div><div className="signal-footer"><strong>USD 4,000 – 6,000</strong><span>12 proposals</span></div></div><div className="signal-card signal-talent"><span className="avatar">MK</span><div><strong>Expert matched</strong><small>98% profile fit</small></div><BadgeCheck size={18} /></div><div className="signal-card signal-secure"><ShieldCheck size={18} /><div><strong>Protected by design</strong><small>Clear scopes. Trusted profiles.</small></div></div></div></section>
    <section className="confidence-bar" aria-label="Platform benefits"><span><Building2 size={18} /> Designed for serious businesses</span><span><UsersRound size={18} /> Skilled independent professionals</span><span><FileCheck2 size={18} /> Transparent project workflows</span></section>
    <section className="marketplace" id="projects"><div className="section-heading"><div><div className="eyebrow">Current opportunities</div><h2>Work worth doing.</h2></div><p>Explore active briefs from clients looking for focused expertise and dependable delivery.</p></div>
      <div className="search-panel"><label className="search-box"><Search size={20} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by project, skill, or keyword" aria-label="Search projects" />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button>}</label><label className="select-wrap"><span>Category</span><select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}><option value="">All categories</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><ChevronDown size={16} /></label><label className="select-wrap"><span>Currency</span><select value={currency} onChange={(e) => setCurrency(e.target.value)}><option>All currencies</option><option>USD</option><option>MMK</option></select><ChevronDown size={16} /></label></div>
      <div className="results-meta"><div><strong>{isLoading ? "Loading opportunities" : `${projects.length} open ${projects.length === 1 ? "project" : "projects"}`}</strong><span>Matched to your current filters</span></div><span className="sort-label">Sorted by newest</span></div>
      {isLoading ? <ProjectSkeleton /> : isError ? <Empty title="We couldn’t load projects" text="Check the API connection and try again." action="Try again" onClick={() => refetch()} /> : projects.length === 0 ? <Empty title="No matching projects" text="Try a broader search or reset your filters." action="Clear filters" onClick={() => { setQuery(""); setCategoryId(""); setCurrency("All currencies"); }} /> : <div className="project-grid">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>}
    </section>
    <section className="process-section" id="process"><div className="section-heading light"><div><div className="eyebrow">A clearer way to work</div><h2>From brief to delivery.</h2></div><p>Everything both sides need to start aligned and stay accountable.</p></div><div className="process-grid"><div><span>01</span><Search /><h3>Discover the right fit</h3><p>Search focused opportunities or review relevant independent professionals.</p></div><div><span>02</span><FileCheck2 /><h3>Align on the work</h3><p>Compare proposals, expectations, pricing, and timelines in one place.</p></div><div><span>03</span><BadgeCheck /><h3>Deliver with confidence</h3><p>Track project status and build a trusted professional reputation.</p></div></div></section>
    <section className="client-cta" id="clients"><div><div className="eyebrow">For growing teams</div><h2>The expertise you need, when the work demands it.</h2><p>Publish a clear brief and connect with professionals ready to make an impact.</p></div><Link className="button button-white" to="/login">Post your first project <ArrowRight size={17} /></Link></section>
  </>;
}

function Empty({ title, text, action, onClick }: { title:string; text:string; action:string; onClick:()=>void }) { return <div className="empty-state"><span className="empty-icon"><Search size={24} /></span><h3>{title}</h3><p>{text}</p><button className="button button-secondary" onClick={onClick}>{action}</button></div>; }
function ProjectSkeleton() { return <div className="project-grid" aria-label="Loading projects">{[1,2,3,4].map((item) => <div className="project-card skeleton" key={item}><span /><span /><span /><span /></div>)}</div>; }
function ProjectCard({ project }: { project: Project }) { return <Link to={`/projects/${project.id}`} className="project-card"><div className="card-top"><span className="category-label">{project.category}</span><span className="status-label"><i /> Accepting proposals</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="tag-row">{project.tags.slice(0,4).map((tag) => <span key={tag}>{tag}</span>)}</div><div className="card-bottom"><div><span>Budget</span><strong>{project.currency} {project.budget}</strong></div><div><span>Posted</span><strong><Clock3 size={13} /> {project.posted}</strong></div><div><span>Proposals</span><strong>{project.proposals}</strong></div><ArrowRight className="card-arrow" size={19} /></div></Link>; }

function ProjectDetail() {
  const { projectId } = useParams(); const { data: project, isLoading, isError } = useQuery({ queryKey:["project",projectId], queryFn:()=>getProject(projectId ?? ""), enabled:Boolean(projectId) });
  if (isLoading) return <section className="detail-page page-state"><div className="eyebrow">Loading project</div><h1>Gathering the details…</h1></section>;
  if (isError || !project) return <section className="detail-page page-state"><Link className="back-link" to="/"><ArrowLeft size={16} /> Back to projects</Link><h1>Project not found.</h1><p>This opportunity may have closed or is no longer publicly available.</p></section>;
  return <section className="detail-page"><Link className="back-link" to="/#projects"><ArrowLeft size={16} /> All opportunities</Link><div className="detail-layout"><article><div className="detail-meta"><span className="category-label">{project.category}</span><span className="status-label"><i /> Accepting proposals</span></div><h1>{project.title}</h1><p className="detail-lede">{project.description}</p><div className="detail-facts"><div><Clock3 /><span>Posted<strong>{project.posted}</strong></span></div><div><UsersRound /><span>Interest<strong>{project.proposals} proposals</strong></span></div><div><CircleDollarSign /><span>Currency<strong>{project.currency}</strong></span></div></div><div className="detail-divider" /><h2>Project overview</h2><p>The client is looking for a dependable professional who can bring structured thinking, excellent craft, and clear communication to this engagement.</p><h2>Skills and expertise</h2><div className="tag-row detail-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><h2>What makes a strong proposal</h2><ul className="check-list"><li><Check /> Demonstrate a clear understanding of the business need.</li><li><Check /> Share relevant work that shows your approach and judgment.</li><li><Check /> Propose a realistic timeline and transparent price.</li></ul></article><aside className="apply-panel"><span className="panel-label">Project budget</span><strong className="panel-price">{project.currency} {project.budget}</strong><p>Submit a tailored proposal with your approach, timeline, and pricing.</p><Link to="/login" className="button button-primary full-width">Submit a proposal <ArrowRight size={16} /></Link><div className="panel-note"><ShieldCheck size={17} /><span><strong>Apply with confidence</strong>No payment is required to submit.</span></div><div className="panel-divider" /><small>Project ID<br/><b>{project.id}</b></small></aside></div></section>;
}

const DEMO_PASSWORD = "ArcherDemo123!";
const demoAccounts = [
  { role: "Client", name: "Demo Client 1", description: "Projects and proposals", email: "client1@archer.local" },
  { role: "Freelancer", name: "Demo Freelancer 1", description: "Bids and active work", email: "freelancer1@archer.local" },
  { role: "Client", name: "Demo Client 2", description: "Another client workspace", email: "client2@archer.local" },
  { role: "Admin", name: "Archer Admin 1", description: "Platform-wide view", email: "admin1@archer.local" },
] as const;

function Login() {
  const navigate = useNavigate();
  const [selectedEmail, setSelectedEmail] = useState<string>(demoAccounts[0].email);
  const [email, setEmail] = useState<string>(demoAccounts[0].email);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function chooseAccount(account: (typeof demoAccounts)[number]) {
    setSelectedEmail(account.email);
    setEmail(account.email);
    setPassword(DEMO_PASSWORD);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const response = await fetch(`${API_URL}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      if (!response.ok) throw new Error("Email or password is incorrect.");
      const data = await response.json();
      localStorage.setItem("archer_access_token", data.accessToken);
      localStorage.setItem("archer_refresh_token", data.refreshToken);
      navigate("/");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to sign in."); }
    finally { setBusy(false); }
  }

  return <main className="demo-login">
    <section className="demo-login__story">
      <Brand />
      <div className="demo-login__pitch">
        <p className="demo-login__kicker">A better way to work together</p>
        <h1 style={{ fontSize: "clamp(3.05rem, 4.15vw, 4.2rem)" }}>Good work gets<br />better when the fit is<br />right.</h1>
        <p>Find thoughtful briefs, make your best case, and build relationships that last beyond a single project.</p>
        <div className="demo-login__privacy"><span><LockKeyhole size={16} /></span> Private workspace · USD and MMK ready</div>
      </div>
      <p className="demo-login__copyright">© 2026 Archer. Built for people who care about the work.</p>
    </section>

    <section className="demo-login__entry">
      <form className="demo-login__form" onSubmit={handleSubmit}>
        <p className="demo-login__label">Demo workspace</p>
        <h2>Choose who you want to be</h2>
        <p className="demo-login__help">Select a ready-made account, then enter Archer. You can still edit the credentials below.</p>

        <div className="demo-accounts" role="radiogroup" aria-label="Demo accounts">
          {demoAccounts.map((account) => {
            const selected = selectedEmail === account.email;
            return <button className={`demo-account${selected ? " is-selected" : ""}`} type="button" role="radio" aria-checked={selected} key={account.email} onClick={() => chooseAccount(account)}>
              <span className="demo-account__role">{account.role}</span>
              <strong>{account.name}</strong>
              <small>{account.description}</small>
              {selected && <span className="demo-account__check"><Check size={13} strokeWidth={3} /></span>}
            </button>;
          })}
        </div>

        <label className="demo-field">Email address<input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setSelectedEmail(""); }} autoComplete="email" required /></label>
        <label className="demo-field">Password<span className="demo-password"><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" minLength={8} required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="demo-login__submit" disabled={busy}>{busy ? "Entering Archer…" : "Enter Archer"}{!busy && <ArrowRight size={16} />}</button>
        <p className="demo-login__note"><Sparkles size={13} /> Local demo accounts only · Every selection uses the shared seeded password</p>
      </form>
    </section>
  </main>;
}
export default App;
