// lib/fetchClient.ts
import { useAuth } from "../context/AuthContext";

export function useApi() {
  const { access, refresh, logout } = useAuth();

  // perform fetch with Authorization header; on 401 try refresh once
  async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
    const headers = new Headers(init.headers || {});
    if (access) headers.set("Authorization", `Bearer ${access}`);
    headers.set("Content-Type", "application/json");

    let res = await fetch(input, { ...init, headers });

    if (res.status === 401) {
      const refreshed = await refresh();
      if (refreshed) {
        // retry with new access token
        const newAccess = (await fetch("/api/auth/refresh", { method: "POST" }).then(r => r.json())).access;
        if (newAccess) headers.set("Authorization", `Bearer ${newAccess}`);
        res = await fetch(input, { ...init, headers });
      } else {
        // logout if can't refresh
        await logout();
        throw new Error("Session expired");
      }
    }
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data ?? { detail: "API error" };
    return data;
  }

  return { apiFetch };
}
