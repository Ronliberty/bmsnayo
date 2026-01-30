
// "use client";

// import { useEffect, useState } from "react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/context/AuthContext";
// import RejectOrder from "./RejectOrder";

// import {
//   getBuyerDeliveries,
//   OrderItemDelivery,
// } from "@/lib/market/api";

// interface DeliveryViewerProps {
//   orderItemId: number;
// }

// export default function DeliveryViewer({ orderItemId }: DeliveryViewerProps) {
//   const { access } = useAuth();

//   const [deliveries, setDeliveries] = useState<OrderItemDelivery[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [feedback, setFeedback] = useState<string | null>(null);
//   const [showRejectForm, setShowRejectForm] = useState(false);

// useEffect(() => {
//   if (!access || orderItemId == null) return;

//   setLoading(true);

//   async function fetchDeliveries() {
//     try {
//       setError(null);

//       const data = await getBuyerDeliveries(
//         access as string, // ✅ narrow type
//         Number(orderItemId)
//       );

//       setDeliveries(data);
//     } catch (e: any) {
//       setError(e.message || "Failed to load deliveries");
//     } finally {
//       setLoading(false);
//     }
//   }

//   fetchDeliveries();
// }, [access, orderItemId]);


//   if (loading) return <p>Loading deliveries...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;
//   if (!deliveries.length) return <p>No deliveries submitted yet.</p>;

//   return (
//     <div className="space-y-4">
//       {deliveries.map((delivery) => (
//         <Card key={delivery.id}>
//           <CardHeader>
//             <CardTitle>
//               Delivery #{delivery.id} · Qty {delivery.delivered_quantity}
//             </CardTitle>
//           </CardHeader>

//           <CardContent className="space-y-3">
//             {delivery.message && <p>{delivery.message}</p>}

//             {delivery.repo_url && (
//               <p>
//                 Repo:{" "}
//                 <a
//                   href={delivery.repo_url}
//                   target="_blank"
//                   className="text-blue-600 underline"
//                 >
//                   {delivery.repo_url}
//                 </a>
//               </p>
//             )}

//             {delivery.login_details && (
//               <p>
//                 <span className="font-semibold">Login:</span>{" "}
//                 {delivery.login_details}
//               </p>
//             )}

//             {delivery.file && (
//               <a
//                 href={delivery.file}
//                 target="_blank"
//                 className="text-blue-600 underline"
//               >
//                 Download File
//               </a>
//             )}

//             <p className="text-xs text-muted-foreground">
//               Submitted at:{" "}
//               {new Date(delivery.submitted_at).toLocaleString()}
//             </p>

//             {feedback && (
//               <p className="text-sm text-green-600">{feedback}</p>
//             )}
//           </CardContent>

//           <CardFooter className="flex gap-3 flex-wrap">
//             <Button disabled={submitting}>
//               Approve
//             </Button>

//     <Button
//   variant="destructive"
//   disabled={submitting}
//   onClick={() => setShowRejectForm(true)}
// >
//   Reject
// </Button>

// {showRejectForm && (
//   <RejectOrder
//     deliveryId={delivery.id} // ✅ pass delivery ID
//     onClose={() => setShowRejectForm(false)}
//   />
// )}

//           </CardFooter>
//         </Card>
//       ))}

      
//     </div>
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
import DisputeChat from "./DisputeChart";  // ✅ your chat component

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
  const [showRejectForm, setShowRejectForm] = useState<number | null>(null); // track which delivery is being rejected

  useEffect(() => {
    if (!access || orderItemId == null) return;

    setLoading(true);

    async function fetchDeliveries() {
      try {
        setError(null);

        const data = await getBuyerDeliveries(
          access as string,
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
      {deliveries.map((delivery) => {
        const isDisputed = delivery.status === "disputed"; // ✅ check dispute

        return (
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

              {feedback && <p className="text-sm text-green-600">{feedback}</p>}
            </CardContent>
{/* check the issue */}
            <CardFooter className="flex gap-3 flex-wrap">
              {isDisputed ? (
                // Show dispute chat instead of buttons
                <div className="w-full">
                  <DisputeChat disputeId={delivery.dispute?.id!} />
                </div>
              ) : (
                <>
                  <Button disabled={submitting}>Approve</Button>

                  <Button
                    variant="destructive"
                    disabled={submitting}
                    onClick={() => setShowRejectForm(delivery.id)}
                  >
                    Reject
                  </Button>

                  {showRejectForm === delivery.id && (
                    <RejectOrder
                      deliveryId={delivery.id}
                      onClose={() => setShowRejectForm(null)}
                    />
                  )}
                </>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
