// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/context/AuthContext";
// import RejectOrder from "./RejectOrder"; // ✅ import the reject form

// type Delivery = {
//   id: string;
//   message?: string;
//   repo_url?: string;
//   login_details?: string;
//   file?: string;
//   submitted_at: string;
// };

// export default function DeliveryViewer({ orderId }: { orderId: string }) {
//   const { access } = useAuth();
//   const [delivery, setDelivery] = useState<Delivery | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [feedback, setFeedback] = useState<string | null>(null);
//   const [showRejectForm, setShowRejectForm] = useState(false); // ✅ toggle reject form

//   useEffect(() => {
//     if (!access) return;

//     const fetchDelivery = async () => {
//       try {
//         setError(null);
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/delivery/`,
//           {
//             headers: {
//               Authorization: `Bearer ${access}`,
//             },
//           }
//         );
//         setDelivery(res.data);
//       } catch (err: any) {
//         setError(err.response?.data?.detail || "No delivery found");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDelivery();
//   }, [orderId, access]);

//   const handleAction = async (url: string, body: any = {}) => {
//     try {
//       setSubmitting(true);
//       setFeedback(null);
//       await axios.post(url, body, {
//         headers: { Authorization: `Bearer ${access}` },
//       });
//       setFeedback("Action completed successfully ✅");
//     } catch (err: any) {
//       setFeedback(err.response?.data?.detail || "Something went wrong ❌");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (!delivery) return <p>No delivery submitted yet.</p>;

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Delivery</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-3">
//         {delivery.message && <p>{delivery.message}</p>}

//         {delivery.repo_url && (
//           <p>
//             Repo:{" "}
//             <a
//               href={delivery.repo_url}
//               target="_blank"
//               className="text-blue-600 underline"
//             >
//               {delivery.repo_url}
//             </a>
//           </p>
//         )}

//         {delivery.login_details && (
//           <p>
//             <span className="font-semibold">Login:</span>{" "}
//             {delivery.login_details}
//           </p>
//         )}

//         {delivery.file && (
//           <a
//             href={delivery.file}
//             target="_blank"
//             className="text-blue-600 underline"
//           >
//             Download File
//           </a>
//         )}

//         <p className="text-xs text-muted-foreground">
//           Submitted at: {new Date(delivery.submitted_at).toLocaleString()}
//         </p>

//         {feedback && <p className="text-sm text-green-600">{feedback}</p>}
//       </CardContent>

//       {/* ✅ Buttons only show if delivery exists */}
//       {delivery && (
//         <CardFooter className="flex gap-3 flex-wrap">
//           <Button
//             variant="default"
//             onClick={() =>
//               handleAction(
//                 `${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/approve/`
//               )
//             }
//             disabled={submitting}
//           >
//             Approve
//           </Button>
//           {/* when the state is changed by either this approve or reject button we should make them disappear and rating should only show after approving hence we need a component for rating */}

//           {/* ✅ Reject opens the RejectOrder form */}
//           <Button
//             variant="destructive"
//             onClick={() => setShowRejectForm(true)}
//             disabled={submitting}
//           >
//             Reject
//           </Button>

//           <div className="flex gap-2">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <Button
//                 key={star}
//                 variant="outline"
//                 size="sm"
//                 onClick={() =>
//                   handleAction(
//                     `${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/rate/`,
//                     { rating: star }
//                   )
//                 }
//                 disabled={submitting}
//               >
//                 {star}⭐
//               </Button>
//             ))}
//           </div>
//         </CardFooter>
//       )}

//       {/* ✅ RejectOrder modal */}
//       {showRejectForm && (
//         <RejectOrder
//           orderId={orderId}
//           onClose={() => setShowRejectForm(false)}
//         />
//       )}
//     </Card>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import RejectOrder from "./RejectOrder";

import {
  getBuyerDeliveries,
  OrderItemDelivery,
} from "@/lib/market/api";

interface DeliveryViewerProps {
  orderItemId: number;
}

export default function DeliveryViewer({ orderItemId }: DeliveryViewerProps) {
  const { access } = useAuth();

  const [deliveries, setDeliveries] = useState<OrderItemDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showRejectForm, setShowRejectForm] = useState(false);

useEffect(() => {
  if (!access || orderItemId == null) return;

  setLoading(true);

  async function fetchDeliveries() {
    try {
      setError(null);

      const data = await getBuyerDeliveries(
        access as string, // ✅ narrow type
        Number(orderItemId)
      );

      setDeliveries(data);
    } catch (e: any) {
      setError(e.message || "Failed to load deliveries");
    } finally {
      setLoading(false);
    }
  }

  fetchDeliveries();
}, [access, orderItemId]);


  if (loading) return <p>Loading deliveries...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!deliveries.length) return <p>No deliveries submitted yet.</p>;

  return (
    <div className="space-y-4">
      {deliveries.map((delivery) => (
        <Card key={delivery.id}>
          <CardHeader>
            <CardTitle>
              Delivery #{delivery.id} · Qty {delivery.delivered_quantity}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {delivery.message && <p>{delivery.message}</p>}

            {delivery.repo_url && (
              <p>
                Repo:{" "}
                <a
                  href={delivery.repo_url}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  {delivery.repo_url}
                </a>
              </p>
            )}

            {delivery.login_details && (
              <p>
                <span className="font-semibold">Login:</span>{" "}
                {delivery.login_details}
              </p>
            )}

            {delivery.file && (
              <a
                href={delivery.file}
                target="_blank"
                className="text-blue-600 underline"
              >
                Download File
              </a>
            )}

            <p className="text-xs text-muted-foreground">
              Submitted at:{" "}
              {new Date(delivery.submitted_at).toLocaleString()}
            </p>

            {feedback && (
              <p className="text-sm text-green-600">{feedback}</p>
            )}
          </CardContent>

          <CardFooter className="flex gap-3 flex-wrap">
            <Button disabled={submitting}>
              Approve
            </Button>

    <Button
  variant="destructive"
  disabled={submitting}
  onClick={() => setShowRejectForm(true)}
>
  Reject
</Button>

{showRejectForm && (
  <RejectOrder
    deliveryId={delivery.id} // ✅ pass delivery ID
    onClose={() => setShowRejectForm(false)}
  />
)}

          </CardFooter>
        </Card>
      ))}

      
    </div>
  );
}
