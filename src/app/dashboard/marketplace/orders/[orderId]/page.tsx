// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/context/AuthContext";
// import DeliveryViewer from "@/components/marketplace/DeliveryViewer";

// type Media = { id: string; media_type: string; file?: string; link?: string };

// type MarketplaceItem = {
//   id: string;
//   title: string;
//   description: string;
//   price: string;
//   currency: string;
//   seller: number;
//   seller_name: string;
//   delivery_type?: "instant" | "manual";
//   media?: Media[];
// };

// type Delivery = {
//   id: string;
//   message?: string;
//   repo_url?: string;
//   login_details?: string;
//   file?: string;
//   submitted_at: string;
// };

// type Order = {
//   id: string;
//   status: string;
//   item: MarketplaceItem;
//   created_at: string;
//   delivery?: Delivery; // ✅ add delivery here
// };

// export default function OrderPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { access, user } = useAuth();
//   const orderId = params.orderId;

//   const [order, setOrder] = useState<Order | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);

//   useEffect(() => {
//     if (!access) return;

//     async function fetchOrder() {
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/`, {
//           headers: { Authorization: `Bearer ${access}` },
//         });
//         if (!res.ok) throw new Error("Failed to fetch order");
//         const data = await res.json();
//         setOrder(data);
//       } catch (e: any) {
//         setErr(e.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchOrder();
//   }, [access, orderId]);

//   if (loading) return <p className="p-6">Loading order...</p>;
//   if (err) return <p className="p-6 text-red-600">{err}</p>;
//   if (!order) return <p className="p-6">Order not found</p>;

//   const { item, status, created_at, delivery } = order;
//   const isOwner = user?.id === item.seller;

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-2xl font-bold">Order #{order.id}</h2>
//       <p className="text-sm text-muted-foreground">Status: {status}</p>
//       <p className="text-sm text-muted-foreground">
//         Created at: {new Date(created_at).toLocaleString()}
//       </p>

//       <Card>
//         <CardHeader>
//           <CardTitle>{item.title}</CardTitle>
//           <p className="text-xs text-muted-foreground">{item.seller_name}</p>
//         </CardHeader>
//         <CardContent className="space-y-2">
//           {item.media && item.media.length > 0 ? (
//             <img
//               src={item.media[0].file || item.media[0].link}
//               alt={item.title}
//               className="w-full h-40 object-cover rounded"
//               onError={(e) => (e.currentTarget.src = "/placeholder.png")}
//             />
//           ) : (
//             <div className="h-40 bg-muted rounded flex items-center justify-center text-sm">
//               No preview
//             </div>
//           )}

//           <p className="text-sm">{item.description}</p>
//           <p className="mt-2 font-semibold">
//             {new Intl.NumberFormat("en-US", {
//               style: "currency",
//               currency: item.currency,
//             }).format(Number(item.price))}
//           </p>
//           <p className="text-xs text-muted-foreground">
//             Delivery: {item.delivery_type ?? "manual"}
//           </p>
//         </CardContent>
//         <CardFooter className="flex gap-2">
//           {isOwner ? (
//             <p className="text-sm text-muted-foreground italic">
//               This is your item
//             </p>
//           ) : (
//             <Button
//               variant="outline"
//               onClick={() => router.push("/dashboard/marketplace")}
//             >
//               Back to Marketplace
//             </Button>
//           )}
//           <Button onClick={() => router.push("/dashboard/marketplace/orders")}>
//             Orders
//           </Button>
//         </CardFooter>
//       </Card>

//       {/* ✅ Show delivery if exists */}
   
//      <DeliveryViewer orderId={order.id} />

//     </div>
//   );
// }





"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import DeliveryViewer from "@/components/marketplace/DeliveryViewer";

import { getOrderById, OrderType } from "@/lib//market/api"; // ✅ import API function and type

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const { access, user } = useAuth();
  const orderId = params.orderId;

  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!access || !orderId) return;

    async function fetchOrder() {
      try {
        const data = await getOrderById(access, orderId); // ✅ use typed API function
        setOrder(data);
      } catch (e: any) {
        setErr(e.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [access, orderId]);

  if (loading) return <p className="p-6">Loading order...</p>;
  if (err) return <p className="p-6 text-red-600">{err}</p>;
  if (!order) return <p className="p-6">Order not found</p>;

  const { items, status, created_at } = order;
  const firstItem = items[0]?.item;
  const isOwner = firstItem?.seller === user?.id;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Order #{order.id}</h2>
      <p className="text-sm text-muted-foreground">Status: {status}</p>
      <p className="text-sm text-muted-foreground">
        Created at: {new Date(created_at).toLocaleString()}
      </p>

      {firstItem && (
        <Card>
          <CardHeader>
            <CardTitle>{firstItem.title}</CardTitle>
            <p className="text-xs text-muted-foreground">{firstItem.seller_name}</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {firstItem.media && firstItem.media.length > 0 ? (
              <img
                src={firstItem.media[0].file || firstItem.media[0].link}
                alt={firstItem.title}
                className="w-full h-40 object-cover rounded"
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
              />
            ) : (
              <div className="h-40 bg-muted rounded flex items-center justify-center text-sm">
                No preview
              </div>
            )}

            <p className="text-sm">{firstItem.description}</p>
            <p className="mt-2 font-semibold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: firstItem.currency,
              }).format(Number(firstItem.price))}
            </p>
            <p className="text-xs text-muted-foreground">
              Delivery: {firstItem.delivery_type ?? "manual"}
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
            <Button onClick={() => router.push("/dashboard/marketplace/orders")}>
              Orders
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Show delivery if exists */}
      <DeliveryViewer orderId={order.id} />
    </div>
  );
}
