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

export interface MarketplaceOrderItem {
  item_id: string;     // <-- MUST be `item`
  quantity: number;
}

export interface CreateOrderResponse {
  id: string;
  status: string;
  total_amount: number;
  currency: string;
}


export interface OrderItemType {
  id: string;
  item: MarketplaceItem;
  quantity: number;
  delivered_quantity: number;
  price: number;
  status: string;
}

export interface OrderType {
  id: string;
  buyer: string;   // StringRelatedField from serializer
  seller: string;  // StringRelatedField
  status: string;
  created_at: string;
  updated_at: string;
  items: OrderItemType[];
}

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







export async function getWishlist(accessToken: string) {
  const res = await fetch(`${API_BASE}/market/wishlist/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Failed to fetch wishlist: ${res.status}`);
  return res.json();
}

// Toggle wishlist for an item
export async function toggleWishlistItem(accessToken: string, item: MarketplaceItem, isSaved: boolean) {
  const res = await fetch(`${API_BASE}/market/wishlist/`, {
    method: isSaved ? "DELETE" : "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ item_id: item.id }),
  });

  if (!res.ok) throw new Error(`Failed to ${isSaved ? "remove" : "add"} wishlist item: ${res.status}`);
  return res.json();
}






export async function createOrder(
  accessToken: string,
  items: MarketplaceOrderItem[]
): Promise<CreateOrderResponse> {
  const res = await fetch(`${API_BASE}/market/orders/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ items }),
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.detail || "Order failed");
  }

  return res.json();
}





export async function getOrderById(
  accessToken: string,
  orderId: string | number
): Promise<OrderType> {
  const res = await fetch(`${API_BASE}/market/orders/${orderId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || "Failed to fetch order");
  }

  return res.json();
}
