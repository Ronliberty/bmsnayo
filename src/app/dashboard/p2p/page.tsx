// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/context/AuthContext";

// export default function BuyerOrdersPage() {
//   const { access, user } = useAuth();
//   const [orders, setOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchOrders() {
//       if (!access || !user) return;
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/orders/`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${access}`,
//           },
//         });
//         const data = await res.json();

//         // only orders where logged-in user is the buyer
//         setOrders(data);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchOrders();
//   }, [access, user]);

//   async function handleCancel(orderId: number) {
//     if (!access) return;
//     try {
//       await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/cancel/`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${access}`,
//         },
//       });
//       // update UI
//       setOrders((prev) =>
//         prev.map((o) =>
//           o.id === orderId ? { ...o, status: "cancelled" } : o
//         )
//       );
//     } catch (error) {
//       console.error("Failed to cancel order:", error);
//     }
//   }

//   return (
//     <div className="p-6 space-y-4">
//       <h2 className="text-2xl font-bold">My Orders</h2>
//       {loading && <p>Loading...</p>}
//       {!loading && orders.length === 0 && <p>You have not ordered anything yet.</p>}

//       {orders.map((order) => (
//         <Card key={order.id}>
//           <CardHeader>
//             <CardTitle>{order.item.title}</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <p><strong>Status:</strong> {order.status}</p>
//             <p><strong>Seller:</strong> {order.seller_name || `ID: ${order.seller}`}</p>
//             <p><strong>Quantity:</strong> {order.quantity}</p>
//             <p>
//               <strong>Total:</strong> $
//               {Number(order.item.price) * Number(order.quantity)}
//             </p>

//             {order.status === "pending" && (
//               <Button
//                 variant="destructive"
//                 onClick={() => handleCancel(order.id)}
//               >
//                 Cancel Order
//               </Button>
//             )}
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }
"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Order = any; // adapt to your API
type Message = { id:number, sender:number, text:string, created_at:string };

function StatusBadge({ status }: { status: string }) {
  const map:any = {
    pending: "bg-yellow-100 text-yellow-800",
    in_escrow: "bg-indigo-100 text-indigo-800",
    delivered: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-700",
    disputed: "bg-red-100 text-red-800",
  };
  return <span className={`px-2 py-1 rounded text-xs ${map[status] ?? "bg-muted text-muted-foreground"}`}>{status}</span>;
}

function ChatBox({ orderId, access }: { orderId:number, access:string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const pollRef = useRef<number | null>(null);

  async function fetchMessages() {
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/messages/`, {
        headers: { Authorization: `Bearer ${access}` }
      });
      if (r.ok) setMessages(await r.json());
    } catch (e) { console.error(e); }
  }

  useEffect(()=> {
    fetchMessages();
    pollRef.current = window.setInterval(fetchMessages, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [orderId]);

  async function send() {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/messages/`, {
        method: "POST",
        headers: { "Content-Type":"application/json", Authorization:`Bearer ${access}` },
        body: JSON.stringify({ message: text })
      });
      if (r.ok) {
        setText("");
        fetchMessages();
      } else {
        console.error("send failed");
      }
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  }

  return (
    <div className="border rounded p-3 space-y-2">
      <div className="h-48 overflow-auto space-y-2 bg-white p-2">
        {messages.map(m => (
          <div key={m.id} className="text-sm">
            <div className="text-xs text-muted-foreground">{m.created_at}</div>
            <div>{m.text}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input value={text} onChange={(e)=>setText(e.target.value)} className="flex-1 rounded border px-3 py-2" placeholder="Message seller..." />
        <Button onClick={send} disabled={loading}>{loading ? "Sending..." : "Send"}</Button>
      </div>
    </div>
  );
}

function FileDelivery({ orderId, access, onDelivered }: { orderId:number, access:string, onDelivered:()=>void }) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function upload() {
    if (!files || files.length === 0) {
      alert("Attach at least one file or add delivery note");
      return;
    }
    setLoading(true);
    const fd = new FormData();
    for (let i=0;i<files.length;i++) fd.append("files", files[i]);
    if (note) fd.append("note", note);
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/deliver/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${access}` },
        body: fd
      });
      if (!r.ok) throw new Error("Delivery failed");
      onDelivered();
    } catch(e:any) {
      alert(e.message || "Upload failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Attach files (zip, txt, etc)</label>
      <input type="file" multiple onChange={(e)=>setFiles(e.target.files)} />
      <textarea placeholder="Optional delivery note" value={note} onChange={(e)=>setNote(e.target.value)} className="w-full rounded border px-2 py-1" />
      <div className="flex gap-2">
        <Button onClick={upload} disabled={loading}>{loading ? "Uploading..." : "Deliver"}</Button>
      </div>
    </div>
  );
}

export default function OrderDetailPage({ params }: { params: { id: string }}) {
  const orderId = Number(params.id);
  const { access, user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState<number | null>(null);

  async function fetchOrder() {
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/`, {
        headers: { Authorization: `Bearer ${access}` }
      });
      if (r.ok) setOrder(await r.json());
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  }

  useEffect(()=> {
    if (!access) return;
    fetchOrder();
    const id = window.setInterval(fetchOrder, 5000);
    setPolling(id);
    return ()=> { clearInterval(id); };
  }, [access, orderId]);

  if (!order) return <div className="p-6">Loading order...</div>;

  const isBuyer = user?.id === order.buyer;
  const isSeller = user?.id === order.seller;
  const canConfirm = isBuyer && order.status === "delivered";
  const canDeliver = isSeller && order.status === "in_escrow";

  async function confirmDelivery() {
    if (!access) return;
    const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/confirm/`, {
      method: "POST", headers: { Authorization:`Bearer ${access}` }
    });
    if (r.ok) fetchOrder();
  }

  async function cancelOrder() {
    if (!access) return;
    const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/cancel/`, {
      method: "POST", headers: { Authorization:`Bearer ${access}` }
    });
    if (r.ok) fetchOrder();
  }

  async function dispute() {
    if (!access) return;
    const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/orders/${orderId}/dispute/`, {
      method: "POST", headers: { Authorization:`Bearer ${access}` }
    });
    if (r.ok) fetchOrder();
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{order.item.title}</h2>
          <div className="text-sm text-muted-foreground">Order #{order.id} • <StatusBadge status={order.status} /></div>
        </div>
        <div className="text-right">
          <div className="font-semibold">{order.item.currency} {order.item.price}</div>
          <div className="text-xs text-muted-foreground">Seller: {order.seller_name}</div>
        </div>
      </div>

      <Card>
        <CardContent>
          <h3 className="font-semibold">Order Timeline</h3>
          <ul className="list-disc list-inside">
            <li>Pending / awaiting seller delivery</li>
            <li>Delivered — buyer reviews the item</li>
            <li>Completed — buyer confirms & funds released</li>
            <li>Dispute — admin review</li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Card>
            <CardHeader><CardTitle>Chat</CardTitle></CardHeader>
            {access &&(
            <CardContent><ChatBox orderId={orderId} access={access} /></CardContent>
            )}
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader><CardTitle>Delivery</CardTitle></CardHeader>
            <CardContent>
              {canDeliver && access ? (
                <FileDelivery orderId={orderId} access={access} onDelivered={() => fetchOrder()} />
              ) : (
                <div>
                  <p className="text-sm">Delivery status: {order.escrow?.status ?? "n/a"}</p>
                  {order.deliverables?.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {order.deliverables.map((d:any)=> (
                        <li key={d.id}><a href={d.url} target="_blank" rel="noreferrer">{d.filename || d.url}</a></li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No deliverables yet</p>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              {canConfirm && <Button onClick={confirmDelivery}>Confirm Receipt</Button>}
              {isBuyer && order.status === "pending" && <Button variant="destructive" onClick={cancelOrder}>Cancel Order</Button>}
              {isBuyer && order.status === "delivered" && <Button variant="destructive" onClick={dispute}>Open Dispute</Button>}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
