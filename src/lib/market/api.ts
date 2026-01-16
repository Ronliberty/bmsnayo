import axios from "axios";
import { useAuth } from "@/context/AuthContext"; 


export const API_BASE = process.env.NEXT_PUBLIC_API_URL;





export interface Media {
  file?: string;
};

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  seller: number;
  seller_name: string;
  media?: Media[];
  availability_quantity: number;
  item_type: "service" | "app" | "website";
};



export async function fetchCurrentUser() {
  const res = await axios.get("/api/user/me/");
  return res.data; // { id, email, first_name, last_name, user_type }
}

async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = (globalThis as any)._access; // access token stored in memory by AuthContext
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers,
  });

  return res;
}

export async function getMarketplaceItems(accessToken: string): Promise<{ results: MarketplaceItem[] }> {
  const res = await fetch(`${API_BASE}/market/items/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Failed to fetch marketplace items: ${res.status}`);
  return res.json();
}