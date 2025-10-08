// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/context/AuthContext";
// import { ShoppingCart } from "lucide-react";
// import Link from "next/link";

// type Media = {
//   id: string;
//   media_type: string;
//   file?: string;
//   link?: string;
// };

// type MarketplaceItem = {
//   id: string;
//   title: string;
//   description: string;
//   price: string;
//   currency: string;
//   seller_name: string;
//   media: Media[];
// };

// export default function WishlistPage() {
//   const { access } = useAuth();
//   const [wishlist, setWishlist] = useState<MarketplaceItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchWishlist() {
//       if (!access) return;

//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/wishlist/`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${access}`,
//           },
//         });

//         const text = await res.text();
//         if (!res.ok) throw new Error(`Failed with status ${res.status}`);
//         const data = JSON.parse(text);
//         // WishlistSerializer returns item under "item"
//         setWishlist(data.map((w: any) => w.item));
//       } catch (error: any) {
//         console.error("Error fetching wishlist:", error);
//         setErr(error.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchWishlist();
//   }, [access]);

//   const removeFromWishlist = async (itemId: string) => {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/wishlist/${itemId}/`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${access}` },
//       });

//       if (!res.ok) throw new Error("Failed to remove item");

//       setWishlist((prev) => prev.filter((i) => i.id !== itemId));
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-2xl font-bold">Your Wishlist</h2>

//       {loading && <p className="text-sm text-muted-foreground">Loading wishlist...</p>}
//       {err && <p className="text-sm text-red-600">{err}</p>}

//       {wishlist.length === 0 && !loading ? (
//         <p className="text-muted-foreground">Your wishlist is empty.</p>
//       ) : (
//         <div className="grid md:grid-cols-2 gap-4">
//           {wishlist.map((item) => (
//             <Card key={item.id}>
//               <CardHeader>
//                 <CardTitle>{item.title}</CardTitle>
//                 <p className="text-xs text-muted-foreground">{item.seller_name}</p>
//               </CardHeader>

//               <CardContent className="space-y-2">
//                 {item.media.length > 0 && (
//                   <div className="grid grid-cols-2 gap-2">
//                     {item.media.map((m) => (
//                       <img
//                         key={m.id}
//                         src={m.file || m.link || ""}
//                         alt={item.title}
//                         className="w-full h-32 object-cover rounded"
//                       />
//                     ))}
//                   </div>
//                 )}
//                 <p className="text-sm text-muted-foreground">{item.description}</p>
//                 <p className="mt-2 font-semibold">
//                   {item.currency} {item.price}
//                 </p>
//               </CardContent>

//               <CardFooter className="flex gap-2">
//                 <Button variant="outline" onClick={() => removeFromWishlist(item.id)}>
//                   Remove
//                 </Button>
//                 <Link href={`/dashboard/marketplace/${item.id}`}>
//                   <Button>
//                     <ShoppingCart className="w-4 h-4 mr-1" />
//                     Buy Now
//                   </Button>
//                 </Link>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/context/AuthContext";
// import { ShoppingCart } from "lucide-react";

// type Media = {
//   id: string;
//   media_type: string;
//   file?: string;
//   link?: string;
// };

// type MarketplaceItem = {
//   id: string;
//   title: string;
//   description: string;
//   price: string;
//   currency: string;
//   seller_name: string;
//   media: Media[];
// };

// export default function WishlistPage() {
//   const router = useRouter();
//   const { access } = useAuth();
//   const [wishlist, setWishlist] = useState<MarketplaceItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);
//   const [processing, setProcessing] = useState<string | null>(null);

//   // Fetch wishlist
//   useEffect(() => {
//     async function fetchWishlist() {
//       if (!access) return;

//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/wishlist/`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${access}`,
//           },
//         });

//         const text = await res.text();
//         if (!res.ok) throw new Error(`Failed with status ${res.status}`);
//         const data = JSON.parse(text);
//         setWishlist(data.map((w: any) => w.item));
//       } catch (error: any) {
//         console.error("Error fetching wishlist:", error);
//         setErr(error.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchWishlist();
//   }, [access]);

//   // Remove from wishlist
//   const removeFromWishlist = async (itemId: string) => {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/wishlist/${itemId}/`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${access}` },
//       });

//       if (!res.ok) throw new Error("Failed to remove item");
//       setWishlist((prev) => prev.filter((i) => i.id !== itemId));
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // ✅ Create order and redirect
//   const handleBuyNow = async (itemId: string) => {
//     try {
//       setProcessing(itemId);
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/orders/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${access}`,
//         },
//         body: JSON.stringify({ item: itemId }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.detail || "Failed to create order");

//       // Redirect to the new order page
//       router.push(`/dashboard/marketplace/orders/${data.id}`);
//     } catch (error: any) {
//       console.error("Error creating order:", error);
//       alert(error.message);
//     } finally {
//       setProcessing(null);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-2xl font-bold">Your Wishlist</h2>

//       {loading && <p className="text-sm text-muted-foreground">Loading wishlist...</p>}
//       {err && <p className="text-sm text-red-600">{err}</p>}

//       {wishlist.length === 0 && !loading ? (
//         <p className="text-muted-foreground">Your wishlist is empty.</p>
//       ) : (
//         <div className="grid md:grid-cols-2 gap-4">
//           {wishlist.map((item) => (
//             <Card key={item.id}>
//               <CardHeader>
//                 <CardTitle>{item.title}</CardTitle>
//                 <p className="text-xs text-muted-foreground">{item.seller_name}</p>
//               </CardHeader>

//               <CardContent className="space-y-2">
//                 {item.media.length > 0 && (
//                   <div className="grid grid-cols-2 gap-2">
//                     {item.media.map((m) => (
//                       <img
//                         key={m.id}
//                         src={m.file || m.link || ""}
//                         alt={item.title}
//                         className="w-full h-32 object-cover rounded"
//                       />
//                     ))}
//                   </div>
//                 )}
//                 <p className="text-sm text-muted-foreground">{item.description}</p>
//                 <p className="mt-2 font-semibold">
//                   {item.currency} {item.price}
//                 </p>
//               </CardContent>

//               <CardFooter className="flex gap-2">
//                 <Button variant="outline" onClick={() => removeFromWishlist(item.id)}>
//                   Remove
//                 </Button>
//                 <Button
//                   onClick={() => handleBuyNow(item.id)}
//                   disabled={processing === item.id}
//                 >
//                   <ShoppingCart className="w-4 h-4 mr-1" />
//                   {processing === item.id ? "Processing..." : "Buy Now"}
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useAccountBalance } from "@/app/hooks/useAccountBalance";
import { ShoppingCart } from "lucide-react";

type Media = {
  id: string;
  media_type: string;
  file?: string;
  link?: string;
};

type MarketplaceItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  seller_name: string;
  media: Media[];
};

export default function WishlistPage() {
  const router = useRouter();
  const { access } = useAuth();
  const { account, refresh: refreshAccount } = useAccountBalance();

  const [wishlist, setWishlist] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [showDepositModal, setShowDepositModal] = useState<{ visible: boolean; item?: MarketplaceItem }>({
    visible: false,
  });

  // Fetch wishlist
  useEffect(() => {
    async function fetchWishlist() {
      if (!access) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/wishlist/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });

        const text = await res.text();
        if (!res.ok) throw new Error(`Failed with status ${res.status}`);
        const data = JSON.parse(text);
        setWishlist(data.map((w: any) => w.item));
      } catch (error: any) {
        console.error("Error fetching wishlist:", error);
        setErr(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWishlist();
  }, [access]);

  // Remove from wishlist
  const removeFromWishlist = async (itemId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/wishlist/${itemId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${access}` },
      });

      if (!res.ok) throw new Error("Failed to remove item");
      setWishlist((prev) => prev.filter((i) => i.id !== itemId));
    } catch (error) {
      console.error(error);
    }
  };

  // Handle Buy Now (same logic as marketplace)
  const handleBuyNow = async (item: MarketplaceItem) => {
    try {
      setProcessing(item.id);

      const price = Number(item.price);
      const balance = account ? Number(account.balance) : 0;

      if (balance < price) {
        setShowDepositModal({ visible: true, item });
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ item_id: item.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to create order");

      router.push(`/dashboard/marketplace/orders/${data.id}`);
    } catch (error: any) {
      console.error("Error creating order:", error);
      alert(error.message);
    } finally {
      setProcessing(null);
      refreshAccount();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Your Wishlist</h2>

      {loading && <p className="text-sm text-muted-foreground">Loading wishlist...</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}

      {wishlist.length === 0 && !loading ? (
        <p className="text-muted-foreground">Your wishlist is empty.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {wishlist.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <p className="text-xs text-muted-foreground">{item.seller_name}</p>
              </CardHeader>

              <CardContent className="space-y-2">
                {item.media.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {item.media.map((m) => (
                      <img
                        key={m.id}
                        src={m.file || m.link || ""}
                        alt={item.title}
                        className="w-full h-32 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <p className="mt-2 font-semibold">
                  {item.currency} {item.price}
                </p>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button variant="outline" onClick={() => removeFromWishlist(item.id)}>
                  Remove
                </Button>
                <Button
                  onClick={() => handleBuyNow(item)}
                  disabled={processing === item.id}
                  className="bg-primary text-primary-foreground"
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  {processing === item.id ? "Processing..." : "Buy Now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-background dark:bg-card p-6 rounded-xl shadow-lg w-96 space-y-4 border border-border">
            <h3 className="text-lg font-semibold text-foreground dark:text-card-foreground">
              Insufficient Balance
            </h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground">
              Your account balance is not enough to buy this item. Would you like to deposit funds now?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="bg-background dark:bg-card dark:text-card-foreground"
                onClick={() => setShowDepositModal({ visible: false })}
              >
                No
              </Button>
              <Button
                className="bg-primary text-primary-foreground"
                onClick={() => {
                  setShowDepositModal({ visible: false });
                  router.push("/dashboard/finance?tab=deposit");
                }}
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
