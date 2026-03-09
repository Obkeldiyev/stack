import { getToken, clearAuth } from "./auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://stack.polito.uz";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearAuth();
    window.location.hash = "#/login";
    throw new ApiError("Unauthorized", 401);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "Request failed");
    throw new ApiError(text, res.status);
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  if (!text) return undefined as T;
  
  const json = JSON.parse(text);
  
  // Handle ApiResponse wrapper from backend (has 'data' field)
  if (json && typeof json === 'object' && 'data' in json) {
    return json.data as T;
  }
  
  return json as T;
}

// Auth
export const authApi = {
  register: (data: { username: string; password: string; role: string }) =>
    apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: { username: string; password: string }) =>
    apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
};

// Family
export const familyApi = {
  create: (title: string) =>
    apiFetch("/api/family/create", { method: "POST", body: JSON.stringify({ title }) }),
  update: (familyId: number, title: string) =>
    apiFetch(`/api/family/${familyId}`, { method: "PUT", body: JSON.stringify({ title }) }),
  delete: (familyId: number) =>
    apiFetch(`/api/family/${familyId}`, { method: "DELETE" }),
  invite: (familyId: number) =>
    apiFetch<{ code: string }>(`/api/family/${familyId}/invite`, { method: "POST" }),
  getInviteCode: (familyId: number) =>
    apiFetch<{ code: string; inviteCode: string }>(`/api/family/${familyId}/invite`, { method: "POST" }),
  join: (code: string) =>
    apiFetch("/api/family/join", { method: "POST", body: JSON.stringify({ code }) }),
  getMembers: (familyId: number) =>
    apiFetch<any[]>(`/api/family/${familyId}/members`),
  getMyFamilies: () =>
    apiFetch<any[]>("/api/family/me"),
  removeMember: (familyId: number, userId: number) =>
    apiFetch(`/api/family/${familyId}/members/${userId}`, { method: "DELETE" }),
};

// Accounts
export const accountsApi = {
  getMyAccounts: () =>
    apiFetch<any[]>("/api/accounts/me"),
  getFamilyAccounts: (familyId: number) =>
    apiFetch<any[]>(`/api/accounts/family/${familyId}`),
  transfer: (childId: number, amount: number, note?: string) =>
    apiFetch("/api/accounts/transfer", {
      method: "POST",
      body: JSON.stringify({ childId, amount, note }),
    }),
};

// Transactions
export const transactionsApi = {
  getHistory: (accountId: number) =>
    apiFetch<any[]>(`/api/transactions/accounts/${accountId}`),
  deposit: (accountId: number, amount: number, note?: string) =>
    apiFetch("/api/transactions/accounts/${accountId}/deposit", {
      method: "POST",
      body: JSON.stringify({ amount, note }),
    }),
  withdraw: (accountId: number, amount: number, note?: string) =>
    apiFetch(`/api/transactions/accounts/${accountId}/withdraw`, {
      method: "POST",
      body: JSON.stringify({ amount, note }),
    }),
};

// Dashboard
export const dashboardApi = {
  getChildDashboard: () =>
    apiFetch<any>("/api/dashboard/child"),
  getParentDashboard: () =>
    apiFetch<any>("/api/dashboard/parent"),
};

// Goals
export const goalsApi = {
  getMyGoals: () =>
    apiFetch<any[]>("/api/goals/me"),
  create: (title: string, targetAmount: number) =>
    apiFetch("/api/goals/me", {
      method: "POST",
      body: JSON.stringify({ title, targetAmount }),
    }),
  saveToGoal: (goalId: number, fromAccountId: number, amount: number) =>
    apiFetch(`/api/goals/${goalId}/save`, {
      method: "POST",
      body: JSON.stringify({ fromAccountId, amount }),
    }),
};

// Games
export const gamesApi = {
  list: () => apiFetch<any[]>("/api/games/public/list"),
  start: (gameId: number) =>
    apiFetch<any>(`/api/games/start/${gameId}`, { method: "POST" }),
  finish: (sessionId: number, scorePoints: number) =>
    apiFetch<any>(`/api/games/finish/${sessionId}`, {
      method: "POST",
      body: JSON.stringify({ scorePoints }),
    }),
};
