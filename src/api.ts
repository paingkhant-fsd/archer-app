export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";

export type Currency = "USD" | "MMK";

export type AuthResponse = {
  user: { id: string; email: string; name: string; role: string };
  accessToken: string;
  refreshToken: string;
};

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  budget: string;
  currency: Currency;
  createdAt: string;
  /** @deprecated Use createdAt with formatPostedDate so dates follow the active locale. */
  posted: string;
  proposals: number;
  tags: string[];
  featured?: boolean;
};

type ApiProject = {
  id: string;
  title: string;
  description: string;
  minBudget: string | null;
  maxBudget: string | null;
  currency: Currency;
  createdAt: string;
  category: { id: string; name: string };
  skills: { id: string; name: string }[];
  proposalsCount: number;
};

function toProject(project: ApiProject): Project {
  const budget = [project.minBudget, project.maxBudget]
    .filter(Boolean)
    .join(" - ");
  return {
    id: project.id,
    title: project.title,
    category: project.category.name,
    description: project.description,
    budget,
    currency: project.currency,
    createdAt: project.createdAt,
    posted: formatPostedDate(project.createdAt, "en-US"),
    proposals: project.proposalsCount,
    tags: project.skills.map((skill) => skill.name),
  };
}

export function formatPostedDate(value: string, locale: string): string {
  const ageInHours = Math.max(
    0,
    (Date.now() - new Date(value).getTime()) / 3_600_000,
  );
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "always" });
  if (ageInHours < 1) return formatter.format(-Math.max(1, Math.round(ageInHours * 60)), "minute");
  if (ageInHours < 24) return formatter.format(-Math.round(ageInHours), "hour");
  return formatter.format(-Math.round(ageInHours / 24), "day");
}

export async function getProjects(filters: {
  search?: string;
  categoryId?: string;
  currency?: string;
}): Promise<Project[]> {
  const params = new URLSearchParams({ page: "1", pageSize: "50" });
  if (filters.search) params.set("search", filters.search);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.currency && filters.currency !== "All currencies")
    params.set("currency", filters.currency);
  const response = await fetch(`${API_URL}/projects?${params}`);
  if (!response.ok) throw new Error("Unable to load projects.");
  const data = (await response.json()) as { items: ApiProject[] };
  return data.items.map(toProject);
}

export async function getProject(id: string): Promise<Project> {
  const response = await fetch(`${API_URL}/projects/${id}`);
  if (!response.ok) throw new Error("Project not found.");
  const data = (await response.json()) as { project: ApiProject };
  return toProject(data.project);
}

export async function getCategories(): Promise<{ id: string; name: string }[]> {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) throw new Error("Unable to load categories.");
  const data = (await response.json()) as {
    categories: { id: string; name: string }[];
  };
  return data.categories;
}

export async function registerAccount(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await response.json().catch(() => null) as (AuthResponse & {
    error?: { code?: string };
  }) | null;
  if (!response.ok) throw new Error(data?.error?.code ?? "REGISTER_FAILED");
  if (!data) throw new Error("REGISTER_FAILED");
  return data;
}
