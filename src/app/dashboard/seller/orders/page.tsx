// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { useAuth } from "@/context/AuthContext";
// import { ArrowLeft, Clock, CheckCircle, XCircle, Truck, AlertCircle } from "lucide-react";

// interface Item {
//   id: string;
//   title: string;
//   item_type: "service" | "app" | "website";
//   price: number;
//   currency: string;
// }

// interface Order {
//   id: number;
//   buyer: number;
//   seller: number;
//   item: Item;
//   quantity: number;
//   status: string;
//   created_at: string;
// }

// export default function SellerOrdersPage() {
//   const { access } = useAuth();
//   const router = useRouter();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showDeliveryModal, setShowDeliveryModal] = useState<number | null>(null);
//   const [deliveryMessage, setDeliveryMessage] = useState("");
//   const [deliveryRepoUrl, setDeliveryRepoUrl] = useState("");
//   const [deliveryLoginDetails, setDeliveryLoginDetails] = useState("");
//   const [deliveryFile, setDeliveryFile] = useState<File | null>(null);
//   const [showViewDeliveryModal, setShowViewDeliveryModal] = useState<number | null>(null);
//   const [viewDeliveryData, setViewDeliveryData] = useState<any>(null);

//   async function fetchOrders() {
//     if (!access) return;
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/market/orders/?role=seller`,
//         {
//           headers: {
//             Authorization: `Bearer ${access}`,
//           },
//         }
//       );
//       if (!res.ok) throw new Error("Failed to fetch orders");
//       const data = await res.json();
//       setOrders(Array.isArray(data) ? data : data.results ?? []);
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function orderAction(orderId: number, action: "approve" | "reject" | "deliver", body?: any) {
//     if (!access) return;
//     try {
//       const headers: HeadersInit = { Authorization: `Bearer ${access}` };
//       let config: RequestInit = {
//         method: "POST",
//         headers,
//       };

//       if (body instanceof FormData) {
//         config.body = body;
//       } else if (body) {
//         headers["Content-Type"] = "application/json";
//         config.body = JSON.stringify(body);
//       }

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/${action}/`,
//         config
//       );
//       if (!res.ok) {
//         const errorData = await res.json();
//         alert(errorData.detail || "Action failed");
//         return;
//       }
//       fetchOrders(); // Refresh list
//     } catch (err) {
//       console.error("Action error:", err);
//       alert("Something went wrong. Please try again.");
//     }
//   }

//   async function fetchDelivery(orderId: number) {
//     if (!access) return;
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/deliver/`,
//         {
//           headers: {
//             Authorization: `Bearer ${access}`,
//           },
//         }
//       );
//       if (!res.ok) {
//         const errorData = await res.json();
//         alert(errorData.detail || "Failed to fetch delivery");
//         return;
//       }
//       const data = await res.json();
//       setViewDeliveryData(data);
//       setShowViewDeliveryModal(orderId);
//     } catch (err) {
//       console.error("Fetch delivery error:", err);
//       alert("Something went wrong. Please try again.");
//     }
//   }

//   useEffect(() => {
//     fetchOrders();
//   }, [access]);

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "pending":
//         return { variant: "warning" as const, label: "Pending", icon: <Clock className="h-3.5 w-3.5" /> };
//       case "in_escrow":
//         return { variant: "success" as const, label: "In Escrow", icon: <CheckCircle className="h-3.5 w-3.5" /> };
//       case "delivered":
//         return { variant: "outline" as const, label: "Delivered", icon: <Truck className="h-3.5 w-3.5" /> };
//       case "completed":
//         return { variant: "default" as const, label: "Completed", icon: <CheckCircle className="h-3.5 w-3.5" /> };
//       case "rejected":
//       case "cancelled":
//         return { variant: "destructive" as const, label: status === "rejected" ? "Rejected" : "Cancelled", icon: <XCircle className="h-3.5 w-3.5" /> };
//       case "disputed":
//         return { variant: "destructive" as const, label: "Disputed", icon: <AlertCircle className="h-3.5 w-3.5" /> };
//       default:
//         return { variant: "secondary" as const, label: status.toUpperCase(), icon: null };
//     }
//   };

//   if (loading) {
//     return <p className="p-6 text-center">Loading your orders...</p>;
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div className="flex items-center gap-3">
//           <Button size="sm" variant="outline" onClick={() => router.back()}>
//             <ArrowLeft size={16} />
//           </Button>
//           <h1 className="text-2xl font-bold">My Seller Orders</h1>
//         </div>
//       </div>

//       {orders.length === 0 && (
//         <Card>
//           <CardContent className="p-8 text-center text-muted-foreground">
//             You don't have any orders yet.
//           </CardContent>
//         </Card>
//       )}

//       <div className="grid gap-5">
//         {orders.map((order) => {
//           const { variant, label, icon } = getStatusBadge(order.status);

//           return (
//             <Card key={order.id} className="overflow-hidden">
//               <CardHeader className="pb-3">
//                 <CardTitle className="flex justify-between items-center flex-wrap gap-3">
//                   <span className="text-lg">{order.item.title}</span>
//                   <Badge variant={variant} className="flex items-center gap-1 px-3 py-1">
//                     {icon}
//                     {label}
//                   </Badge>
//                 </CardTitle>
//               </CardHeader>

//               <CardContent className="space-y-4 text-sm">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <span className="text-muted-foreground">Type</span>
//                     <p className="font-medium capitalize">{order.item.item_type}</p>
//                   </div>
//                   <div>
//                     <span className="text-muted-foreground">Price</span>
//                     <p className="font-medium">
//                       {order.item.currency} {order.item.price.toLocaleString()}
//                       {order.quantity > 1 && ` × ${order.quantity}`}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="text-xs text-muted-foreground">
//                   Order ID: #{order.id} • Created: {new Date(order.created_at).toLocaleDateString()}
//                 </div>

//                 {/* Actions - only shown for actionable states */}
//                 {order.status === "pending" && (
//                   <div className="flex flex-wrap gap-3 pt-4 border-t">
//                     <Button
//                       size="sm"
//                       variant="default"
//                       onClick={() => orderAction(order.id, "approve")}
//                     >
//                       Approve Order
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       className="border-destructive text-destructive hover:bg-destructive/10"
//                       onClick={() => {
//                         if (window.confirm("Are you sure you want to reject/cancel this order?")) {
//                           orderAction(order.id, "reject");
//                         }
//                       }}
//                     >
//                       Reject / Cancel
//                     </Button>
//                   </div>
//                 )}

//                 {order.status === "in_escrow" && (
//                   <div className="pt-4 border-t">
//                     <Button
//                       size="sm"
//                       variant="secondary"
//                       onClick={() => {
//                         setDeliveryMessage("");
//                         setDeliveryRepoUrl("");
//                         setDeliveryLoginDetails("");
//                         setDeliveryFile(null);
//                         setShowDeliveryModal(order.id);
//                       }}
//                       className="w-full sm:w-auto"
//                     >
//                       Submit Delivery
//                     </Button>
//                   </div>
//                 )}

//                 {(order.status === "delivered" || order.status === "disputed") && (
//                   <div className="flex flex-col gap-3 pt-3 border-t">
//                     <div className="text-sm text-muted-foreground italic">
//                       {order.status === "delivered"
//                         ? "Waiting for buyer review..."
//                         : "In dispute – awaiting resolution"}
//                     </div>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => fetchDelivery(order.id)}
//                       className="w-full sm:w-auto"
//                     >
//                       View Delivery
//                     </Button>
//                   </div>
//                 )}

//                 {["completed", "rejected", "cancelled"].includes(order.status) && (
//                   <div className="pt-3 text-sm text-muted-foreground italic border-t">
//                     This order is now closed.
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {/* Delivery Submission Modal */}
//       <Dialog open={showDeliveryModal !== null} onOpenChange={() => setShowDeliveryModal(null)}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Submit Delivery for Order #{showDeliveryModal}</DialogTitle>
//           </DialogHeader>
//           <div className="py-4 space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="message">Message</Label>
//               <Textarea
//                 id="message"
//                 placeholder="Enter delivery message or instructions..."
//                 value={deliveryMessage}
//                 onChange={(e) => setDeliveryMessage(e.target.value)}
//                 rows={4}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="repo_url">Repository URL</Label>
//               <Input
//                 id="repo_url"
//                 placeholder="https://github.com/..."
//                 value={deliveryRepoUrl}
//                 onChange={(e) => setDeliveryRepoUrl(e.target.value)}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="login_details">Login Details</Label>
//               <Textarea
//                 id="login_details"
//                 placeholder="Enter login credentials or details..."
//                 value={deliveryLoginDetails}
//                 onChange={(e) => setDeliveryLoginDetails(e.target.value)}
//                 rows={3}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="file">Upload File</Label>
//               <Input
//                 id="file"
//                 type="file"
//                 onChange={(e) => setDeliveryFile(e.target.files?.[0] || null)}
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowDeliveryModal(null)}>
//               Cancel
//             </Button>
//             <Button
//               onClick={async () => {
//                 if (!deliveryMessage.trim() && !deliveryRepoUrl.trim() && !deliveryLoginDetails.trim() && !deliveryFile) {
//                   alert("Please provide at least one delivery detail");
//                   return;
//                 }
//                 const formData = new FormData();
//                 if (deliveryMessage) formData.append("message", deliveryMessage);
//                 if (deliveryRepoUrl) formData.append("repo_url", deliveryRepoUrl);
//                 if (deliveryLoginDetails) formData.append("login_details", deliveryLoginDetails);
//                 if (deliveryFile) formData.append("file", deliveryFile);

//                 await orderAction(showDeliveryModal!, "deliver", formData);
//                 setShowDeliveryModal(null);
//               }}
//             >
//               Submit Delivery
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* View Delivery Modal */}
//       <Dialog open={showViewDeliveryModal !== null} onOpenChange={() => setShowViewDeliveryModal(null)}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Delivery for Order #{showViewDeliveryModal}</DialogTitle>
//           </DialogHeader>
//           <div className="py-4 space-y-4">
//             {viewDeliveryData ? (
//               <div className="space-y-4">
//                 <div className="space-y-1">
//                   <p className="text-sm font-medium">Message:</p>
//                   <p className="text-sm whitespace-pre-wrap">{viewDeliveryData.message || "No message provided."}</p>
//                 </div>
//                 <div className="space-y-1">
//                   <p className="text-sm font-medium">Repository URL:</p>
//                   {viewDeliveryData.repo_url ? (
//                     <a href={viewDeliveryData.repo_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
//                       {viewDeliveryData.repo_url}
//                     </a>
//                   ) : (
//                     <p className="text-sm">No repository URL provided.</p>
//                   )}
//                 </div>
//                 <div className="space-y-1">
//                   <p className="text-sm font-medium">Login Details:</p>
//                   <p className="text-sm whitespace-pre-wrap">{viewDeliveryData.login_details || "No login details provided."}</p>
//                 </div>
//                 <div className="space-y-1">
//                   <p className="text-sm font-medium">File:</p>
//                   {viewDeliveryData.file ? (
//                     <a href={viewDeliveryData.file} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
//                       Download File
//                     </a>
//                   ) : (
//                     <p className="text-sm">No file uploaded.</p>
//                   )}
//                 </div>
//                 <div className="space-y-1">
//                   <p className="text-sm font-medium">Submitted At:</p>
//                   <p className="text-sm">{viewDeliveryData.submitted_at ? new Date(viewDeliveryData.submitted_at).toLocaleString() : "N/A"}</p>
//                 </div>
//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground">No delivery data available.</p>
//             )}
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowViewDeliveryModal(null)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
} from "lucide-react";

/* ------------------ Types ------------------ */

type OrderStatus =
  | "pending"
  | "in_escrow"
  | "completed"
  | "cancelled"
  | "delivered"
  | "rejected"
  | "disputed"
  | string;

type MarketplaceItem = {
  id: string;
  title: string;
  seller_name: string;
};

type Order = {
  id: string;
  status: OrderStatus;
  item: MarketplaceItem;
  created_at: string;
};

type OrdersResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
};

type BadgeVariant = React.ComponentProps<typeof Badge>["variant"];

/* ------------------ Status Badge Helper ------------------ */

function getStatusBadge(status: string): {
  variant: BadgeVariant;
  label: string;
  icon: React.ReactNode;
} {
  switch (status) {
    case "pending":
      return {
        variant: "warning",
        label: "Pending",
        icon: <Clock className="h-3.5 w-3.5" />,
      };

    case "in_escrow":
      return {
        variant: "success",
        label: "In Escrow",
        icon: <CheckCircle className="h-3.5 w-3.5" />,
      };

    case "delivered":
      return {
        variant: "outline",
        label: "Delivered",
        icon: <Truck className="h-3.5 w-3.5" />,
      };

    case "completed":
      return {
        variant: "default",
        label: "Completed",
        icon: <CheckCircle className="h-3.5 w-3.5" />,
      };

    case "cancelled":
    case "rejected":
      return {
        variant: "destructive",
        label: status === "cancelled" ? "Cancelled" : "Rejected",
        icon: <XCircle className="h-3.5 w-3.5" />,
      };

    case "disputed":
      return {
        variant: "destructive",
        label: "Disputed",
        icon: <AlertCircle className="h-3.5 w-3.5" />,
      };

    default:
      return {
        variant: "outline",
        label: status.replace("_", " ").toUpperCase(),
        icon: null,
      };
  }
}

/* ------------------ Component ------------------ */

export default function OrdersListPage() {
  const { access } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  /* ------------------ Fetch Orders ------------------ */

  useEffect(() => {
    if (!access) return;

    async function fetchOrders() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/market/orders/`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data: OrdersResponse = await res.json();
        setOrders(Array.isArray(data.results) ? data.results : []);
      } catch (e: any) {
        setErr(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [access]);

  /* ------------------ Cancel Order ------------------ */

  async function handleCancelOrder() {
    if (!cancelOrderId || !access) return;

    try {
      setCancelLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/market/orders/${cancelOrderId}/cancel/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to cancel order");
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.id === cancelOrderId ? { ...o, status: "cancelled" } : o
        )
      );

      setSuccessMessage("Order cancelled successfully.");
    } catch (e: any) {
      alert(e.message || "Could not cancel order");
    } finally {
      setCancelLoading(false);
      setCancelOrderId(null);
    }
  }

  /* ------------------ States ------------------ */

  if (loading) {
    return <p className="p-6 text-muted-foreground">Loading orders...</p>;
  }

  if (err) {
    return <p className="p-6 text-red-600">{err}</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 space-y-4">
        <p>No orders found.</p>
        <Button onClick={() => router.push("/dashboard/marketplace")}>
          Browse Marketplace
        </Button>
      </div>
    );
  }

  /* ------------------ Render ------------------ */

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-2xl font-bold">Your Orders</h2>
        <Button onClick={() => router.push("/dashboard/marketplace")}>
          Continue Shopping
        </Button>
      </div>

      <div className="space-y-2">
        {orders.map((order) => {
          const cancellable =
            order.status === "pending" || order.status === "in_escrow";

          const { variant, label, icon } = getStatusBadge(order.status);

          return (
            <Card key={order.id}>
              <CardContent className="px-4 py-3">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/dashboard/marketplace/orders/${order.id}`
                      )
                    }
                  >
                    <p className="font-semibold truncate">#{order.id}</p>
                    <p className="truncate">{order.item.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {order.item.seller_name}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <Badge
                      variant={variant}
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {icon}
                      {label}
                    </Badge>

                    {cancellable && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setCancelOrderId(order.id)}
                      >
                        Cancel Order
                      </Button>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Confirm Cancel Modal */}
      {cancelOrderId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-xl w-96 space-y-4">
            <h3 className="text-lg font-semibold">Are you sure?</h3>
            <p className="text-sm text-muted-foreground">
              This will cancel your order and release escrow funds.
            </p>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setCancelOrderId(null)}
                disabled={cancelLoading}
              >
                No
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelOrder}
                disabled={cancelLoading}
              >
                {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successMessage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-xl w-96 text-center space-y-4">
            <h3 className="text-lg font-semibold">Success</h3>
            <p className="text-sm text-muted-foreground">{successMessage}</p>
            <Button onClick={() => setSuccessMessage(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}
