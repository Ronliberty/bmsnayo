



// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// type MarketplaceItem = {
//   id: string;
//   title: string;
//   seller_name: string;
// };

// type Order = {
//   id: string;
//   status: string;
//   item: MarketplaceItem;
//   created_at: string;
// };

// type OrdersResponse = {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: Order[];
// };





// export default function OrdersListPage() {
//   const { access } = useAuth();
//   const router = useRouter();

//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);

//   const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
//   const [cancelLoading, setCancelLoading] = useState(false);

//   useEffect(() => {
//     if (!access) return;

//     async function fetchOrders() {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/market/orders/list/`,
//           {
//             headers: {
//               Authorization: `Bearer ${access}`,
//             },
//           }
//         );

//         if (!res.ok) {
//           throw new Error("Failed to fetch orders");
//         }

//         const data: OrdersResponse = await res.json();
//         setOrders(Array.isArray(data.results) ? data.results : []);
//       } catch (e: any) {
//         setErr(e.message || "Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchOrders();
//   }, [access]);

//   async function handleCancelOrder() {
//     if (!cancelOrderId || !access) return;

//     try {
//       setCancelLoading(true);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/market/orders/${cancelOrderId}/cancel/`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${access}`,
//           },
//         }
//       );

//       if (!res.ok) {
//         throw new Error("Failed to cancel order");
//       }

//       setOrders((prev) =>
//         prev.map((o) =>
//           o.id === cancelOrderId ? { ...o, status: "cancelled" } : o
//         )
//       );

//       setSuccessMessage("Order cancelled successfully.");
//     } catch (e: any) {
//       alert(e.message || "Could not cancel order");
//     } finally {
//       setCancelLoading(false);
//       setCancelOrderId(null);
//     }
//   }

//   if (loading) {
//     return <p className="p-6 text-muted-foreground">Loading orders...</p>;
//   }

//   if (err) {
//     return <p className="p-6 text-red-600">{err}</p>;
//   }

//   if (orders.length === 0) {
//     return (
//       <div className="p-6 space-y-4">
//         <p>No orders found.</p>
//         <Button onClick={() => router.push("/dashboard/marketplace")}>
//           Browse Marketplace
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6 space-y-4">
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
//         <h2 className="text-2xl font-bold">Your Orders</h2>
//         <Button onClick={() => router.push("/dashboard/marketplace")}>
//           Continue Shopping
//         </Button>
//       </div>

//       <div className="space-y-2">
//         {orders.map((order) => {
//           const cancellable =
//             order.status === "pending" || order.status === "in_escrow";

//           return (
//             <Card key={order.id} className="transition-colors">
//               <CardContent className="px-4 py-3">
//                 <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
//                   <div
//                     className="cursor-pointer"
//                     onClick={() =>
//                       router.push(
//                         `/dashboard/marketplace/orders/${order.id}`
//                       )
//                     }
//                   >
//                     <p className="font-semibold truncate">#{order.id}</p>
//                     <p className="truncate">{order.item.title}</p>
//                     <p className="text-sm text-muted-foreground truncate">
//                       {order.item.seller_name}
//                     </p>
//                   </div>

//                   <div className="flex flex-col sm:items-end gap-2">
//                     <p
//                       className={`capitalize font-medium ${
//                         order.status === "completed"
//                           ? "text-green-600"
//                           : order.status === "pending"
//                           ? "text-yellow-600"
//                           : order.status === "cancelled"
//                           ? "text-red-600"
//                           : "text-blue-600"
//                       }`}
//                     >
//                       {order.status}
//                     </p>

//                     {cancellable && (
//                       <Button
//                         variant="destructive"
//                         size="sm"
//                         onClick={() => setCancelOrderId(order.id)}
//                       >
//                         Cancel Order
//                       </Button>
//                     )}

//                     <p className="text-xs text-muted-foreground">
//                       {new Date(order.created_at).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {/* Are you sure modal */}
//       {cancelOrderId && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
//           <div className="bg-background p-6 rounded-xl w-96 space-y-4">
//             <h3 className="text-lg font-semibold">
//               Are you sure?
//             </h3>
//             <p className="text-sm text-muted-foreground">
//               This will cancel your order and release escrow funds.
//             </p>

//             <div className="flex justify-end gap-2">
//               <Button
//                 variant="outline"
//                 onClick={() => setCancelOrderId(null)}
//                 disabled={cancelLoading}
//               >
//                 No
//               </Button>
//               <Button
//                 variant="destructive"
//                 onClick={handleCancelOrder}
//                 disabled={cancelLoading}
//               >
//                 {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Success modal */}
//       {successMessage && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
//           <div className="bg-background p-6 rounded-xl w-96 text-center space-y-4">
//             <h3 className="text-lg font-semibold">
//               Success
//             </h3>
//             <p className="text-sm text-muted-foreground">
//               {successMessage}
//             </p>

//             <Button onClick={() => setSuccessMessage(null)}>
//               Close
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getOrderById, OrderType } from "@/lib/market/api"; // import your API function & type

export default function OrdersListPage() {
  const { access } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (!access) return;

    async function fetchOrders() {
      try {
        // Example: fetch first 10 orders by ID
        const orderIds = [1, 2, 3, 4, 5]; // replace with real order IDs or pagination
        const ordersFetched: OrderType[] = [];

        for (const id of orderIds) {
          const order = await getOrderById(access!, id);
          ordersFetched.push(order);
        }

        setOrders(ordersFetched);
      } catch (e: any) {
        setErr(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [access]);

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

          return (
            <Card key={order.id} className="transition-colors">
              <CardContent className="px-4 py-3">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/dashboard/marketplace/orders/${order.id}`)
                    }
                  >
                    <p className="font-semibold truncate">#{order.id}</p>
                    <p className="truncate">{order.items[0]?.item.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {order.items[0]?.item.seller_name}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <p
                      className={`capitalize font-medium ${
                        order.status === "completed"
                          ? "text-green-600"
                          : order.status === "pending"
                          ? "text-yellow-600"
                          : order.status === "cancelled"
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    >
                      {order.status}
                    </p>

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

      {/* Cancel modal */}
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

      {/* Success modal */}
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
