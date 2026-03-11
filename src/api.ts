const API_BASE = import.meta.env.VITE_API_URL || "";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "요청 실패" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export interface FundingSummary {
  totalAmount: number;
  donorCount: number;
}

export interface GuestbookEntry {
  id: string;
  nickname: string;
  message: string;
  showAmount: boolean;
  amount?: number;
  createdAt: string | null;
}

export const api = {
  getFundingSummary: () => apiFetch<FundingSummary>("/api/funding/summary"),

  getGuestbook: () =>
    apiFetch<{ entries: GuestbookEntry[] }>("/api/guestbook"),

  createGuestbookEntry: (data: {
    name: string;
    nickname: string;
    message: string;
    showAmount: boolean;
  }) =>
    apiFetch<GuestbookEntry>("/api/guestbook", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateGuestbookEntry: (
    id: string,
    data: { name: string; nickname: string; message: string },
  ) =>
    apiFetch<{ success: boolean }>(`/api/guestbook/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteGuestbookEntry: (id: string, name: string) =>
    apiFetch<{ success: boolean }>(`/api/guestbook/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ name }),
    }),

  addFunding: (data: {
    password: string;
    name: string;
    amount: number;
    depositedAt?: string;
  }) =>
    apiFetch<{ id: string; action: string; name: string; amount: number }>(
      "/api/funding",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    ),

  deleteFunding: (data: { password: string; name: string }) =>
    apiFetch<{ deletedCount: number; name: string }>("/api/funding", {
      method: "DELETE",
      body: JSON.stringify(data),
    }),
};
