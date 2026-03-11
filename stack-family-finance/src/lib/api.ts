import { getRefreshToken, getToken, clearAuth, setToken } from "./auth";

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
  options: RequestInit = {},
  allowRetry = true
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  
  // Only add Content-Type for JSON requests, not FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if ((res.status === 401 || res.status === 403) && allowRetry) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          const refreshText = await refreshRes.text();
          const refreshJson = refreshText ? JSON.parse(refreshText) : {};
          const refreshedToken = refreshJson?.data?.accessToken ?? refreshJson?.accessToken;
          if (refreshedToken) {
            setToken(refreshedToken);
            return apiFetch<T>(path, options, false);
          }
        }
      } catch {
        // Fall through to clear auth below.
      }
    }
  }

  if (res.status === 401 || res.status === 403) {
    clearAuth();
    window.location.hash = "#/login";
    throw new ApiError("Unauthorized", res.status);
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
    apiFetch("/api/goals", {
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

// Admin
export const adminApi = {
  // User Management
  getAllUsers: () => apiFetch<any[]>("/api/admin/users"),
  updateUser: (id: number, data: { username?: string; role?: string; enabled?: boolean }) =>
    apiFetch(`/api/admin/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  enableUser: (id: number) =>
    apiFetch(`/api/admin/users/${id}/enable`, { method: "PUT" }),
  disableUser: (id: number) =>
    apiFetch(`/api/admin/users/${id}/disable`, { method: "PUT" }),
  deleteUser: (id: number) =>
    apiFetch(`/api/admin/users/${id}`, { method: "DELETE" }),
  
  // Game Management
  getAllGames: () => apiFetch<any[]>("/api/admin/games"),
  createGame: (data: { code: string; title: string; description?: string; rewardCoins: number }) =>
    apiFetch("/api/admin/games", { method: "POST", body: JSON.stringify(data) }),
  updateGame: (id: number, data: { title?: string; description?: string; rewardCoins?: number }) =>
    apiFetch(`/api/admin/games/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteGame: (id: number) =>
    apiFetch(`/api/admin/games/${id}`, { method: "DELETE" }),
  
  // Transaction Management
  getAllTransactions: () => apiFetch<any[]>("/api/admin/transactions"),
  
  // Family Management
  getAllFamilies: () => apiFetch<any[]>("/api/admin/families"),
  
  // Statistics
  getStats: () => apiFetch<any>("/api/admin/stats"),
};

// Tasks
export const tasksApi = {
  // Parent endpoints
  createTask: (data: { childId: number; title: string; description?: string; amount: number }) =>
    apiFetch("/api/tasks", { method: "POST", body: JSON.stringify(data) }),
  getParentTasks: () => apiFetch<any[]>("/api/tasks/parent"),
  approveTask: (id: number, notes?: string) =>
    apiFetch(`/api/tasks/${id}/approve`, { method: "PUT", body: JSON.stringify({ notes }) }),
  rejectTask: (id: number, notes: string) =>
    apiFetch(`/api/tasks/${id}/reject`, { method: "PUT", body: JSON.stringify({ notes }) }),
  deleteTask: (id: number) =>
    apiFetch(`/api/tasks/${id}`, { method: "DELETE" }),
  
  // Child endpoints
  getChildTasks: () => apiFetch<any[]>("/api/tasks/child"),
  completeTask: (id: number, photoUrl: string, notes?: string) =>
    apiFetch(`/api/tasks/${id}/complete`, { method: "PUT", body: JSON.stringify({ photoUrl, notes }) }),
  
  // Shared endpoints
  getTask: (id: number) => apiFetch<any>(`/api/tasks/${id}`),
};

// File Upload
export const uploadApi = {
  uploadPhoto: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiFetch<{ url: string; filename: string; size: number }>("/api/upload/photo", {
      method: "POST",
      body: formData,
      headers: {} // Remove Content-Type to let browser set it with boundary
    });
  },
  uploadProfilePhoto: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiFetch<{ url: string; filename: string; size: number }>("/api/upload/profile-photo", {
      method: "POST",
      body: formData,
      headers: {} // Remove Content-Type to let browser set it with boundary
    });
  },
};

// Profile Management
export const profileApi = {
  getProfile: () => apiFetch<any>("/api/users/profile"),
  updateProfile: (data: { username: string; photoUrl?: string }) =>
    apiFetch("/api/users/profile", { method: "PUT", body: JSON.stringify(data) }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiFetch("/api/users/profile/password", { method: "PUT", body: JSON.stringify(data) }),
  updateProfilePhoto: (photoUrl: string) =>
    apiFetch("/api/users/profile/photo", { method: "POST", body: JSON.stringify({ photoUrl }) }),
  getCurrentUser: () => apiFetch<any>("/api/users/me"),
};

// Auth with refresh tokens
export const authApiExtended = {
  register: (data: { username: string; password: string; role: string; rememberMe?: boolean }) =>
    apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: { username: string; password: string; rememberMe?: boolean }) =>
    apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
  refresh: (refreshToken: string) =>
    apiFetch<{ accessToken: string }>("/api/auth/refresh", { method: "POST", body: JSON.stringify({ refreshToken }) }),
  logout: (refreshToken?: string) =>
    apiFetch("/api/auth/logout", { method: "POST", body: JSON.stringify({ refreshToken }) }),
};
