import axios from "axios";
import { useAuth } from "@/context/AuthContext"; 


export const API_BASE = process.env.NEXT_PUBLIC_API_URL;





export interface Media {
  id: number;
  file?: string | null;
  link?: string | null;
}


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


// export interface OrderItemType {
//   id: string;
//   item: MarketplaceItem;
//   quantity: number;
//   delivered_quantity: number;
//   price: number;
//   status: string;
// }

export interface OrderItemType {
  order_item_id: number;
  marketplace_item: MarketplaceItem;
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



// export interface OrderItemDelivery {
//   id: number;
//   order_item: number;
//   seller: string; // seller username or id
//   delivered_quantity: number;
//   file?: string;
//   repo_url?: string;
//   message: string;
//   login_details?: string; // ✅ ADD THIS
//   submitted_at: string;
//   status: "pending" | "partial" | "delivered";
// }

export interface OrderItemDelivery {
  id: number;
  order_item: number;
  seller: string; // seller username or id
  delivered_quantity: number;
  file?: string;
  repo_url?: string;
  message: string;
  login_details?: string; // ✅ ADD THIS
  submitted_at: string;
  status: "pending" | "partial" | "delivered" | "disputed"; // ✅ fixed
  dispute?: {
    id: number;
  }; // optional, for dispute chat
}

export interface SubmitDeliveryPayload {
  delivered_quantity: number;
  file?: File;
  repo_url?: string;
  message?: string;
  login_details?: string; // ✅ add this
}

export interface RejectDeliveryPayload {
  category: "not_received" | "not_as_described" | "poor_quality" | "late_delivery" | "other";
  reason?: string;
  evidence_file?: File | null;
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


// export async function getOrders(
//   accessToken: string
// ): Promise<OrderType[]> {
//   const res = await fetch(`${API_BASE}/market/orders/list/`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${accessToken}`,
//     },
//     credentials: "include",
//   });

//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err?.detail || "Failed to fetch orders");
//   }

//   return res.json();
// }

// export async function getOrders(
//   accessToken: string
// ): Promise<OrderType[]> {
//   const res = await fetch(`${API_BASE}/market/orders/list/`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${accessToken}`,
//     },
//     credentials: "include",
//   });

//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err?.detail || "Failed to fetch orders");
//   }

//   const data = await res.json();

//   // ✅ Handle DRF pagination safely
//   if (Array.isArray(data)) {
//     return data;
//   }

//   if (Array.isArray(data.results)) {
//     return data.results;
//   }

//   throw new Error("Invalid orders response format");
// }


export async function getBuyerOrders(
  accessToken: string
): Promise<OrderType[]> {
  const res = await fetch(
    `${API_BASE}/market/orders/list/?role=buyer`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || "Failed to fetch buyer orders");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : data.results;
}


export async function getSellerOrders(
  accessToken: string
): Promise<OrderType[]> {
  const res = await fetch(
    `${API_BASE}/market/orders/list/?role=seller`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || "Failed to fetch seller orders");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : data.results;
}



export async function getOrderById(
  accessToken: string,
  orderId: string | number
): Promise<OrderType> {
  const res = await fetch(`${API_BASE}/market/order/${orderId}/`, {
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




export async function cancelOrder(
  accessToken: string,
  orderId: string
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/market/order/${orderId}/cancel/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || "Failed to cancel order");
  }

  return res.json();
}


// export async function getOrderItemDeliveries(
//   accessToken: string,
//   orderItemId: number
// ): Promise<OrderItemDelivery[]> {
//   try {
//     const res = await axios.get<OrderItemDelivery[]>(
//       `${API_BASE}/market/order-items/${orderItemId}/deliveries/`,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         withCredentials: true, // equivalent to fetch's credentials: "include"
//       }
//     );
//     return res.data;
//   } catch (err: any) {
//     throw new Error(
//       err.response?.data?.detail || err.message || "Failed to fetch deliveries"
//     );
//   }
// }

// export async function getOrderItemDeliveries(
//   accessToken: string,
//   orderItemId: number
// ): Promise<OrderItemDelivery[]> {
//   const res = await fetch(`${API_BASE}/market/order-items/${orderItemId}/deliveries/`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//     credentials: "include",
//   });

//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err?.detail || "Failed to fetch deliveries");
//   }

//   return res.json();
// }



export async function submitOrderItemDelivery(
  accessToken: string,
  orderItemId: number,
  data: SubmitDeliveryPayload
): Promise<OrderItemDelivery> {
  const formData = new FormData();
  formData.append("delivered_quantity", data.delivered_quantity.toString());
  if (data.file) formData.append("file", data.file);
  if (data.repo_url) formData.append("repo_url", data.repo_url);
  if (data.message) formData.append("message", data.message);
  if (data.login_details) formData.append("login_details", data.login_details); // ✅ add login_details

  const res = await fetch(
    `${API_BASE}/market/order-items/${orderItemId}/deliveries/submit/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
      // remove credentials for token auth
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || "Failed to submit delivery");
  }

  return res.json();
}



export async function getBuyerDeliveries(
  accessToken: string,
  orderItemId: number
): Promise<OrderItemDelivery[]> {
  const res = await fetch(
    `${API_BASE}/market/order-items/${orderItemId}/deliveries/?role=buyer`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || "Failed to fetch buyer deliveries");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : data.results;
}

export async function getSellerDeliveries(
  accessToken: string,
  orderItemId: number
): Promise<OrderItemDelivery[]> {
  const res = await fetch(
    `${API_BASE}/market/order-items/${orderItemId}/deliveries/?role=seller`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || "Failed to fetch seller deliveries");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : data.results;
}



// export async function rejectDelivery(
//   accessToken: string,
//   deliveryId: number,
//   payload: RejectDeliveryPayload
// ): Promise<{ detail: string }> {
//   try {
//     const formData = new FormData();

//     formData.append("category", payload.category);
//     if (payload.reason) formData.append("reason", payload.reason);
//     if (payload.evidence_file) formData.append("evidence_file", payload.evidence_file);

//     const res = await axios.post(`${API_BASE}/market/deliveries/${deliveryId}/reject/`, formData, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "multipart/form-data",
//       },
//       withCredentials: true,
//     });

//     return res.data;
//   } catch (err: any) {
//     throw new Error(err.response?.data?.detail || err.message || "Failed to reject delivery");
//   }
// }




// lib/market/api.ts


export type DisputeCategory =
  | "not_received"
  | "not_as_described"
  | "poor_quality"
  | "late_delivery"
  | "other";

export interface DisputeCreatePayload {
  category: DisputeCategory;
  reason?: string;
  evidence_file?: File | null;

  order_id?: number;
  order_item_id?: number;
  delivery_id?: number;
}


export async function createDispute(
  accessToken: string,
  payload: DisputeCreatePayload
): Promise<{ detail: string; dispute_id: number }> {
  const targets = [
    payload.order_id,
    payload.order_item_id,
    payload.delivery_id,
  ].filter(Boolean);

  if (targets.length !== 1) {
    throw new Error("Exactly one dispute target must be provided.");
  }

  const formData = new FormData();

  formData.append("category", payload.category);

  if (payload.reason) formData.append("reason", payload.reason);
  if (payload.evidence_file) formData.append("evidence_file", payload.evidence_file);
  if (payload.order_id) formData.append("order_id", String(payload.order_id));
  if (payload.order_item_id) formData.append("order_item_id", String(payload.order_item_id));
  if (payload.delivery_id) formData.append("delivery_id", String(payload.delivery_id));

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/market/disputes/create/`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    }
  );

  return res.data;
}




export type DisputeMessage = {
  id: number;
  sender_role: "buyer" | "seller";
  sender_name: string;
  message: string;
  attachment?: string | null;
  created_at: string;
};

export type CreateDisputeMessagePayload = {
  message?: string;
  attachment?: File | null;
};



export async function fetchDisputeMessages(
  accessToken: string,
  disputeId: number
): Promise<DisputeMessage[]> {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/market/disputes/${disputeId}/messages/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    }
  );
  return res.data;
}

export async function postDisputeMessage(
  accessToken: string,
  disputeId: number,
  payload: CreateDisputeMessagePayload
): Promise<DisputeMessage> {
  const formData = new FormData();
  if (payload.message) formData.append("message", payload.message);
  if (payload.attachment) formData.append("attachment", payload.attachment);

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/market/disputes/${disputeId}/messages/`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );

  return res.data;
}




/* ---------------------------------------------
 * DISPUTE CORE TYPES
 * ------------------------------------------- */

export type DisputeStatus = "open" | "resolved" | "closed";



export type DisputeUserRole = "buyer" | "seller" | "agent" | "unknown";

/* ---------------------------------------------
 * DISPUTE OBJECT (FROM BACKEND)
 * ------------------------------------------- */
export interface Dispute {
  id: number;

  order?: number | null;
  order_item?: number | null;
  delivery?: number | null;

  category: DisputeCategory;
  reason?: string | null;
  evidence_file?: string | null;

  status: DisputeStatus;
  resolution?: string | null;

  opened_by: string;
  assigned_agent?: string | null;

  created_at: string;

  /** 🔑 backend-computed role */
  user_role: DisputeUserRole;
}

/* ---------------------------------------------
 * API RESPONSE SHAPE
 * ------------------------------------------- */
export interface DisputeByDeliveryResponse {
  exists: boolean;
  dispute?: Dispute;
}



export async function getBuyerDisputeByDelivery(
  accessToken: string,
  deliveryId: number
): Promise<DisputeByDeliveryResponse> {
  const res = await fetch(
    `${API_BASE}/market/disputes/by-delivery/?delivery=${deliveryId}&role=buyer`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || "Failed to fetch buyer dispute");
  }

  const data = await res.json();
    console.log("Buyer dispute by delivery response:", data);
  return data;
}


export async function getSellerDisputeByDelivery(
  accessToken: string,
  deliveryId: number
): Promise<DisputeByDeliveryResponse> {
  const res = await fetch(
    `${API_BASE}/market/disputes/by-delivery/?delivery=${deliveryId}&role=seller`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || "Failed to fetch seller dispute");
  }

  const data = await res.json();
  return data;
}