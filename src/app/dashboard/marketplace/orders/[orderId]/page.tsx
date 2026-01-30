




// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { useAuth } from "@/context/AuthContext";
// import DeliveryViewer from "@/components/marketplace/DeliveryViewer";

// import { getOrderById, OrderType, Media} from "@/lib//market/api"; // ✅ import API function and type

// export default function OrderPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { access, user } = useAuth();
//   const orderId = params.orderId;

//   const [order, setOrder] = useState<OrderType | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);

// useEffect(() => {
//   if (!access || !orderId) {
//     setLoading(false);
//     return;
//   }

//   // ✅ Normalize Next.js param
//   const normalizedOrderId =
//     Array.isArray(orderId) ? orderId[0] : orderId;

//   async function fetchOrder(
//     accessToken: string,
//     id: string
//   ) {
//     try {
//       const data = await getOrderById(accessToken, id);
//       setOrder(data);
//     } catch (e: any) {
//       setErr(e.message || "Failed to fetch order");
//     } finally {
//       setLoading(false);
//     }
//   }

//   fetchOrder(access, normalizedOrderId);
// }, [access, orderId]);


//   if (loading) return <p className="p-6">Loading order...</p>;
//   if (err) return <p className="p-6 text-red-600">{err}</p>;
//   if (!order) return <p className="p-6">Order not found</p>;

//   const { items, status, created_at } = order;
//   const firstItem = items[0]?.marketplace_item;
//   const isOwner = firstItem?.seller === user?.id;

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-2xl font-bold">Order #{order.id}</h2>
//       <p className="text-sm text-muted-foreground">Status: {status}</p>
//       <p className="text-sm text-muted-foreground">
//         Created at: {new Date(created_at).toLocaleString()}
//       </p>

//       {firstItem && (
//         <Card>
//           <CardHeader>
//             <CardTitle>{firstItem.title}</CardTitle>
//             <p className="text-xs text-muted-foreground">{firstItem.seller_name}</p>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             {firstItem.media && firstItem.media.length > 0 ? (
//                <div className="flex gap-2 overflow-x-auto">
//         {firstItem.media.map((m: Media) => (
//           <img
//             key={m.id}
//             src={m.file ?? "/paceholder.png"}
//             alt={firstItem.title}
//             className="w-32 h-32 object-cover rounded"
//             onError={(e) => (e.currentTarget.src = "/placeholder.png")}
//           />
//         ))}
//       </div>
//             ) : (
//               <div className="h-40 bg-muted rounded flex items-center justify-center text-sm">
//                 No preview
//               </div>
//             )}

//             <p className="text-sm">{firstItem.description}</p>
//             <p className="mt-2 font-semibold">
//               {new Intl.NumberFormat("en-US", {
//                 style: "currency",
//                 currency: firstItem.currency,
//               }).format(Number(firstItem.price))}
//             </p>
//             {/* <p className="text-xs text-muted-foreground">
//               Delivery: {firstItem.delivery_type ?? "manual"}
//             </p> */}
//           </CardContent>
//           <CardFooter className="flex gap-2">
//             {isOwner ? (
//               <p className="text-sm text-muted-foreground italic">
//                 This is your item
//               </p>
//             ) : (
//               <Button
//                 variant="outline"
//                 onClick={() => router.push("/dashboard/marketplace")}
//               >
//                 Back to Marketplace
//               </Button>
//             )}
//             <Button onClick={() => router.push("/dashboard/marketplace/orders")}>
//               Orders
//             </Button>
//           </CardFooter>
//         </Card>
//       )}

//       {/* Show delivery if exists */}
//       <DeliveryViewer orderId={order.id} />
//     </div>
//   );
// }





"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import DeliveryViewer from "@/components/marketplace/DeliveryViewer";

import { getOrderById, OrderType, Media } from "@/lib/market/api";

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const { access, user } = useAuth();
  const orderId = params.orderId;

  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!access || !orderId) {
      setLoading(false);
      return;
    }

    const normalizedOrderId = Array.isArray(orderId)
      ? orderId[0]
      : orderId;

    async function fetchOrder(token: string, id: string) {
      try {
        const data = await getOrderById(token, id);
        setOrder(data);
      } catch (e: any) {
        setErr(e.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder(access, normalizedOrderId);
  }, [access, orderId]);

  if (loading) return <p className="p-6">Loading order...</p>;
  if (err) return <p className="p-6 text-red-600">{err}</p>;
  if (!order) return <p className="p-6">Order not found</p>;

  const { items, status, created_at } = order;

  const orderItem = items?.[0]; // ✅ OrderItem
  const marketplaceItem = orderItem?.marketplace_item;

  const isOwner = marketplaceItem?.seller === user?.id;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Order #{order.id}</h2>

      <p className="text-sm text-muted-foreground">Status: {status}</p>
      <p className="text-sm text-muted-foreground">
        Created at: {new Date(created_at).toLocaleString()}
      </p>

      {marketplaceItem && (
        <Card>
          <CardHeader>
            <CardTitle>{marketplaceItem.title}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {marketplaceItem.seller_name}
            </p>
          </CardHeader>

          <CardContent className="space-y-2">
            {marketplaceItem.media?.length ? (
              <div className="flex gap-2 overflow-x-auto">
                {marketplaceItem.media.map((m: Media) => (
                  <img
                    key={m.id}
                    src={m.file ?? "/placeholder.png"}
                    alt={marketplaceItem.title}
                    className="w-32 h-32 object-cover rounded"
                    onError={(e) =>
                      (e.currentTarget.src = "/placeholder.png")
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="h-40 bg-muted rounded flex items-center justify-center text-sm">
                No preview
              </div>
            )}

            <p className="text-sm">{marketplaceItem.description}</p>

            <p className="mt-2 font-semibold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: marketplaceItem.currency,
              }).format(Number(marketplaceItem.price))}
            </p>
          </CardContent>

          <CardFooter className="flex gap-2">
            {isOwner ? (
              <p className="text-sm text-muted-foreground italic">
                This is your item
              </p>
            ) : (
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/marketplace")}
              >
                Back to Marketplace
              </Button>
            )}

            <Button
              onClick={() =>
                router.push("/dashboard/marketplace/orders")
              }
            >
              Orders
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* ✅ CORRECT: pass orderItem.id, NOT order.id */}
      {orderItem && (
        <DeliveryViewer orderItemId={orderItem.order_item_id} />
      )}
    </div>
  );
}
