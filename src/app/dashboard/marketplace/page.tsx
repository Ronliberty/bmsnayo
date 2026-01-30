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
// import { ShoppingCart, Heart } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useAccountBalance } from "@/app/hooks/useAccountBalance";
// import { OrdersCart } from "@/components/marketplace/OrdersCart";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useSearch } from "@/context/SearchContext"; // ← Added import

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

// /* =======================
//    TYPES
//    ======================= */
// type Media = {
//   id: string;
//   media_type: "image" | "video" | "file";
//   file?: string;
//   link?: string;
// };

// type MarketplaceItem = {
//   id: string;
//   title: string;
//   description: string;
//   price: string;
//   currency: string;
//   seller: number;
//   seller_name: string;
//   media?: Media[];
//   availability_quantity: number;
//   item_type: "service" | "app" | "website";
// };

// function mediaUrl(path?: string) {
//   if (!path) return "";
//   return path.startsWith("http") ? path : `${API_BASE}${path}`;
// }

// /* =======================
//    Skeleton Card
//    ======================= */
// function ItemSkeleton() {
//   return (
//     <Card>
//       <Skeleton className="h-40 w-full rounded-t-lg" />
//       <CardHeader>
//         <Skeleton className="h-5 w-3/4" />
//         <Skeleton className="h-3 w-1/2" />
//       </CardHeader>
//       <CardContent className="space-y-2">
//         <Skeleton className="h-3 w-full" />
//         <Skeleton className="h-3 w-5/6" />
//         <Skeleton className="h-4 w-1/3" />
//       </CardContent>
//       <CardFooter className="flex gap-2">
//         <Skeleton className="h-9 w-full" />
//         <Skeleton className="h-9 w-full" />
//       </CardFooter>
//     </Card>
//   );
// }

// export default function MarketplacePage() {
//   const { access, user } = useAuth();
//   const router = useRouter();
//   const { account, refresh: refreshAccount } = useAccountBalance();
//   const { searchQuery } = useSearch(); // ← Using global search

//   const [items, setItems] = useState<MarketplaceItem[]>([]);
//   const [wishlist, setWishlist] = useState<number[]>([]);
//   const [orders, setOrders] = useState<number[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

//   const [showDepositModal, setShowDepositModal] = useState(false);
//   const [pendingItem, setPendingItem] = useState<MarketplaceItem | null>(null);

//   /* =======================
//      Fetch Items
//      ======================= */
//   useEffect(() => {
//     if (!access) return;

//     fetch(`${API_BASE}/market/items/`, {
//       headers: { Authorization: `Bearer ${access}` },
//     })
//       .then((r) => r.json())
//       .then((d) => setItems(d.results || []))
//       .finally(() => setLoading(false));
//   }, [access]);

//   /* =======================
//      Fetch Wishlist
//      ======================= */
//   useEffect(() => {
//     if (!access) return;

//     fetch(`${API_BASE}/market/wishlist/`, {
//       headers: { Authorization: `Bearer ${access}` },
//     })
//       .then((r) => r.json())
//       .then((d) =>
//         setWishlist((d.results || []).map((w: any) => w.item.id))
//       );
//   }, [access]);

//   /* =======================
//      Client-side Search Filtering
//      ======================= */
//   const filteredItems = items.filter((item) => {
//     if (!searchQuery?.trim()) return true;

//     const query = searchQuery.toLowerCase().trim();

//     return (
//       item.title.toLowerCase().includes(query) ||
//       item.description.toLowerCase().includes(query) ||
//       item.seller_name.toLowerCase().includes(query) ||
//       item.item_type.toLowerCase().includes(query)
//     );
//   });

//   /* =======================
//      Wishlist Toggle
//      ======================= */
//   async function toggleWishlist(itemId: string, sellerId: number) {
//     if (!access || sellerId === user?.id) return;

//     const numericId = Number(itemId);
//     const isSaved = wishlist.includes(numericId);

//     setWishlist((prev) =>
//       isSaved ? prev.filter((id) => id !== numericId) : [...prev, numericId]
//     );

//     setActionLoading((s) => ({ ...s, [itemId]: true }));

//     try {
//       await fetch(`${API_BASE}/market/wishlist/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${access}`,
//         },
//         body: JSON.stringify({ item_id: itemId }),
//       });
//     } catch {
//       setWishlist((prev) =>
//         isSaved ? [...prev, numericId] : prev.filter((id) => id !== numericId)
//       );
//     } finally {
//       setActionLoading((s) => ({ ...s, [itemId]: false }));
//     }
//   }

//   /* =======================
//      Buy with Balance Check
//      ======================= */
//   async function handleBuy(item: MarketplaceItem) {
//     const price = Number(item.price);
//     const balance = account ? Number(account.balance) : 0;

//     if (balance < price) {
//       setPendingItem(item);
//       setShowDepositModal(true);
//       return;
//     }

//     setActionLoading((s) => ({ ...s, [item.id]: true }));

//     const res = await fetch(`${API_BASE}/market/orders/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${access}`,
//       },
//       body: JSON.stringify({ item_id: item.id }),
//     });

//     const data = await res.json();
//     router.push(`/dashboard/marketplace/orders/${data.id}`);
//     refreshAccount();
//   }

//   /* =======================
//      UI
//      ======================= */
//   return (
//     <div className="px-3 sm:px-6 py-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl sm:text-2xl font-bold">Marketplace</h2>

//         <div className="flex gap-4 items-center">
//           <button
//             onClick={() => router.push("/dashboard/marketplace/wishlist")}
//             className="relative"
//           >
//             <Heart className="w-5 h-5" />
//             {wishlist.length > 0 && (
//               <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
//                 {wishlist.length}
//               </span>
//             )}
//           </button>

//           <OrdersCart count={orders.length} />
//         </div>
//       </div>

//       {/* Search feedback */}
//       {searchQuery.trim() && (
//         <p className="text-sm text-muted-foreground">
//           Results for: <strong>"{searchQuery.trim()}"</strong>
//         </p>
//       )}

//       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {loading ? (
//           Array.from({ length: 6 }).map((_, i) => <ItemSkeleton key={i} />)
//         ) : filteredItems.length === 0 ? (
//           <div className="col-span-full py-12 text-center space-y-2">
//             <p className="text-lg font-medium">
//               {searchQuery.trim()
//                 ? "No matching products found"
//                 : "No products available right now"}
//             </p>
//             {searchQuery.trim() && (
//               <p className="text-sm text-muted-foreground">
//                 Try different keywords or check back later
//               </p>
//             )}
//           </div>
//         ) : (
//           filteredItems.map((item) => {
//             const soldOut =
//               item.item_type !== "service" &&
//               item.availability_quantity <= 0;

//             return (
//               <Card key={item.id}>
//                 <div className="h-40 bg-muted">
//                   {item.media?.length ? (
//                     <img
//                       src={mediaUrl(item.media[0].file)}
//                       className="h-full w-full object-cover"
//                       alt={item.title}
//                     />
//                   ) : (
//                     <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
//                       No preview
//                     </div>
//                   )}
//                 </div>

//                 <CardHeader>
//                   <CardTitle>{item.title}</CardTitle>
//                   <p className="text-xs text-muted-foreground">
//                     {item.seller_name}
//                   </p>
//                 </CardHeader>

//                 <CardContent>
//                   <p className="text-sm line-clamp-3">{item.description}</p>
//                   <p className="font-semibold mt-2">
//                     {item.currency} {item.price}
//                   </p>
//                 </CardContent>

//                 <CardFooter className="flex gap-2">
//                   <Button
//                     variant={
//                       wishlist.includes(Number(item.id)) ? "default" : "outline"
//                     }
//                     onClick={() => toggleWishlist(item.id, item.seller)}
//                     disabled={actionLoading[item.id]}
//                   >
//                     <Heart className="w-4 h-4 mr-1" />
//                     {wishlist.includes(Number(item.id)) ? "Saved" : "Wishlist"}
//                   </Button>
//                   {/* add coount of numbeer of itemns andavailability  */}

//                   <Button
//                     disabled={soldOut || actionLoading[item.id]}
//                     onClick={() => handleBuy(item)}
//                   >
//                     <ShoppingCart className="w-4 h-4 mr-1" />
//                     Buy
//                   </Button>
//                 </CardFooter>
//               </Card>
//             );
//           })
//         )}
//       </div>

//       {/* Deposit Modal */}
//       {showDepositModal && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
//           <div className="bg-background p-6 rounded-xl w-96 space-y-4">
//             <h3 className="text-lg font-semibold">Insufficient Balance</h3>
//             <p className="text-sm text-muted-foreground">
//               You don’t have enough balance to buy{" "}
//               <span className="font-medium">{pendingItem?.title}</span>.
//               Would you like to deposit funds now?
//             </p>
//             <div className="flex justify-end gap-2">
//               <Button
//                 variant="outline"
//                 onClick={() => setShowDepositModal(false)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={() => {
//                   setShowDepositModal(false);
//                   router.push("/dashboard/finance?tab=deposit");
//                 }}
//               >
//                 Deposit
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

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
// import { ShoppingCart, Heart } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useAccountBalance } from "@/app/hooks/useAccountBalance";
// import { OrdersCart } from "@/components/marketplace/OrdersCart";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useSearch } from "@/context/SearchContext";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

// /* =======================
//    TYPES
// ======================= */
// type Media = {
//   id: string;
//   media_type: "image" | "video" | "file";
//   file?: string;
// };

// type MarketplaceItem = {
//   id: string;
//   title: string;
//   description: string;
//   price: string;
//   currency: string;
//   seller: number;
//   seller_name: string;
//   media?: Media[];
//   availability_quantity: number;
//   item_type: "service" | "app" | "website";
// };

// function mediaUrl(path?: string) {
//   if (!path) return "";
//   return path.startsWith("http") ? path : `${API_BASE}${path}`;
// }

// function ItemSkeleton() {
//   return (
//     <Card>
//       <Skeleton className="h-40 w-full" />
//       <CardHeader>
//         <Skeleton className="h-5 w-3/4" />
//         <Skeleton className="h-3 w-1/2" />
//       </CardHeader>
//       <CardContent className="space-y-2">
//         <Skeleton className="h-3 w-full" />
//         <Skeleton className="h-3 w-5/6" />
//       </CardContent>
//       <CardFooter>
//         <Skeleton className="h-9 w-full" />
//       </CardFooter>
//     </Card>
//   );
// }

// export default function MarketplacePage() {
//   const { access, user } = useAuth();
//   const router = useRouter();
//   const { account, refresh: refreshAccount } = useAccountBalance();
//   const { searchQuery } = useSearch();

//   const [items, setItems] = useState<MarketplaceItem[]>([]);
//   const [wishlist, setWishlist] = useState<number[]>([]);
//   const [orders, setOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
//   const [quantities, setQuantities] = useState<Record<string, number>>({});
//   const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
//   const [showDepositModal, setShowDepositModal] = useState(false);
//   const [pendingItem, setPendingItem] = useState<MarketplaceItem | null>(null);

//   function getQuantity(item: MarketplaceItem) {
//     return quantities[item.id] || 1;
//   }

//   /* =======================
//      FETCH DATA
//   ======================= */
//   async function loadData() {
//     if (!access) return;
//     setLoading(true);
//     try {
//       const [itemsRes, wishlistRes, ordersRes] = await Promise.all([
//         fetch(`${API_BASE}/market/items/`, {
//           headers: { Authorization: `Bearer ${access}` },
//         }).then((r) => r.json()),
//         fetch(`${API_BASE}/market/wishlist/`, {
//           headers: { Authorization: `Bearer ${access}` },
//         }).then((r) => r.json()),
//         fetch(`${API_BASE}/market/orders/?role=buyer`, {
//           headers: { Authorization: `Bearer ${access}` },
//         }).then((r) => r.json()),
//       ]);
//       setItems(itemsRes.results || []);
//       setWishlist((wishlistRes.results || []).map((w: any) => w.item.id));
//       setOrders(ordersRes.results || []);
//     } catch (error) {
//       console.error("Error loading data:", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadData();
//   }, [access]);

//   /* =======================
//      WISHLIST
//   ======================= */
//   async function toggleWishlist(itemId: string, sellerId: number) {
//     if (!access || sellerId === user?.id) return;

//     const id = Number(itemId);
//     const saved = wishlist.includes(id);

//     setWishlist((p) => (saved ? p.filter((x) => x !== id) : [...p, id]));
//     setActionLoading((s) => ({ ...s, [itemId]: true }));

//     await fetch(`${API_BASE}/market/wishlist/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${access}`,
//       },
//       body: JSON.stringify({ item_id: itemId }),
//     });

//     setActionLoading((s) => ({ ...s, [itemId]: false }));
//   }

//   /* =======================
//      BUY
//   ======================= */
//   async function handleBuy(item: MarketplaceItem) {
//     const quantity =
//       item.item_type === "service" ? 1 : getQuantity(item);
//     const price = Number(item.price) * quantity;

//     setActionLoading((s) => ({ ...s, [item.id]: true }));

//     try {
//       const res = await fetch(`${API_BASE}/market/orders/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${access}`,
//         },
//         body: JSON.stringify({ item_id: item.id, quantity }),
//       });

//       if (!res.ok) {
//         throw new Error("Order failed");
//       }

//       const data = await res.json();
//       setSuccessOrderId(data.id);
//       await refreshAccount();
//       await loadData();  // Refetch to update availability and orders
//     } catch (error) {
//       console.error("Buy error:", error);
//       // Optionally show error toast/message
//     } finally {
//       setActionLoading((s) => ({ ...s, [item.id]: false }));
//     }
//   }

//   const filteredItems = items.filter((item) => {
//     if (!searchQuery.trim()) return true;
//     const q = searchQuery.toLowerCase();
//     return (
//       item.title.toLowerCase().includes(q) ||
//       item.description.toLowerCase().includes(q) ||
//       item.seller_name.toLowerCase().includes(q)
//     );
//   });

//   /* =======================
//      UI
//   ======================= */
//   return (
//     <div className="px-3 sm:px-6 py-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-bold">Marketplace</h2>
//         <OrdersCart count={orders.length} />
//       </div>

//       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {loading ? (
//           Array.from({ length: 6 }).map((_, i) => <ItemSkeleton key={i} />)
//         ) : (
//           filteredItems.map((item) => {
//             const soldOut =
//               item.item_type !== "service" &&
//               item.availability_quantity <= 0;

//             return (
//               <Card key={item.id}>
//                 <div className="h-40 bg-muted">
//                   {item.media?.length ? (
//                     <img
//                       src={mediaUrl(item.media[0].file)}
//                       className="h-full w-full object-cover"
//                     />
//                   ) : (
//                     <div className="h-full flex items-center justify-center text-sm">
//                       No preview
//                     </div>
//                   )}
//                 </div>

//                 <CardHeader>
//                   <CardTitle>{item.title}</CardTitle>
//                   <p className="text-xs">{item.seller_name}</p>
//                 </CardHeader>

//                 <CardContent>
//                   <p className="text-sm">{item.description}</p>
//                   <p className="font-semibold mt-2">
//                     {item.currency} {item.price}
//                   </p>

//                   {item.item_type !== "service" ? (
//     <p className="text-xs text-muted-foreground mt-1">
//       {item.availability_quantity > 0
//         ? `${item.availability_quantity} available`
//         : "Out of stock"}
//     </p>
//   ) : (
//     <p className="text-xs text-muted-foreground mt-1">
//       Unlimited availability
//     </p>
//   )}
//                 </CardContent>

//                 <CardFooter className="flex flex-col gap-3">
//                   {/* WISHLIST ROW */}
//                   <Button
//                     variant={
//                       wishlist.includes(Number(item.id))
//                         ? "default"
//                         : "outline"
//                     }
//                     disabled={actionLoading[item.id]}
//                     onClick={() =>
//                       toggleWishlist(item.id, item.seller)
//                     }
//                   >
//                     <Heart className="w-4 h-4 mr-1" />
//                     {wishlist.includes(Number(item.id))
//                       ? "Saved"
//                       : "Wishlist"}
//                   </Button>

//                   {/* QUANTITY + BUY ROW */}
//                   <div className="flex gap-2 items-center w-full">
//                     {item.item_type !== "service" && (
//                       <div className="flex items-center gap-2">
//                         <Button
//                           size="icon"
//                           variant="outline"
//                           disabled={getQuantity(item) <= 1}
//                           onClick={() =>
//                             setQuantities((q) => ({
//                               ...q,
//                               [item.id]: getQuantity(item) - 1,
//                             }))
//                           }
//                         >
//                           −
//                         </Button>
//                         <span className="w-6 text-center">
//                           {getQuantity(item)}
//                         </span>
//                         <Button
//                           size="icon"
//                           variant="outline"
//                           disabled={
//                             getQuantity(item) >=
//                             item.availability_quantity
//                           }
//                           onClick={() =>
//                             setQuantities((q) => ({
//                               ...q,
//                               [item.id]: getQuantity(item) + 1,
//                             }))
//                           }
//                         >
//                           +
//                         </Button>
//                       </div>
//                     )}

//                     <Button
//                       className="flex-1"
//                       disabled={soldOut || actionLoading[item.id]}
//                       onClick={() => handleBuy(item)}
//                     >
//                       <ShoppingCart className="w-4 h-4 mr-1" />
//                       Buy
//                     </Button>
//                   </div>
//                 </CardFooter>
//               </Card>
//             );
//           })
//         )}
//       </div>

      

//       {/* SUCCESS MODAL */}

//       {successOrderId && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-background p-6 rounded-xl w-96 text-center space-y-4">
//             <h3 className="text-lg font-semibold">
//               Order placed successfully 🎉
//             </h3>
//             <p className="text-sm">
//               Your payment is secured in escrow.
//             </p>
//             <div className="flex justify-center gap-4">
//               <Button
//                 variant="outline"
//                 onClick={() => setSuccessOrderId(null)}
//               >
//                 Close
//               </Button>
//               <Button
//                 onClick={() =>
//                   router.push(
//                     `/dashboard/marketplace/orders/${successOrderId}`
//                   )
//                 }
//               >
//                 View order
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//       {showDepositModal && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
//           <div className="bg-background p-6 rounded-xl w-96 space-y-4">
//             <h3 className="text-lg font-semibold">Insufficient Balance</h3>
//             <p className="text-sm text-muted-foreground">
//               You don’t have enough balance to buy{" "}
//               <span className="font-medium">{pendingItem?.title}</span>.
//               Would you like to deposit funds now?
//             </p>
//             <div className="flex justify-end gap-2">
//               <Button
//                 variant="outline"
//                 onClick={() => setShowDepositModal(false)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={() => {
//                   setShowDepositModal(false);
//                   router.push("/dashboard/finance?tab=deposit");
//                 }}
//               >
//                 Deposit
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
      
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
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearch } from "@/context/SearchContext";
import { toast } from "sonner";
import { BuyButton } from "@/components/marketplace/BuyButton";
import { getMarketplaceItems, getBuyerOrders, getWishlist, MarketplaceItem, toggleWishlistItem } from "@/lib/market/api";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";


function mediaUrl(path?: string) {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
}

export default function MarketplacePage() {
  const { access, user } = useAuth();
  const router = useRouter();
  const { searchQuery } = useSearch();

  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [ordersCount, setOrdersCount] = useState(0);

  /* =======================
     Fetch items + wishlist
     ======================= */
// useEffect(() => {
//   if (!access) return;

//   const token = access; // now token is type string, not string | null

//   async function loadMarket() {
//     setLoading(true);
//     try {
//       const [itemsRes, wishlistRes] = await Promise.all([
//         getMarketplaceItems(token),
//         getWishlist(token),
//       ]);

//       setItems(itemsRes.results || []);
//       setWishlist((wishlistRes.results || []).map((w: any) => w.item.id));
//     } catch (err) {
//       console.error("Failed to load market or wishlist:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   loadMarket();
// }, [access]);

useEffect(() => {
  if (!access) return; // make sure we have the token

  const token = access; // string type, TS safe
  let intervalId: number;

  async function loadMarket() {
    setLoading(true);
    try {
      // Fetch marketplace items, wishlist, and orders in parallel
      const [itemsRes, wishlistRes, ordersRes] = await Promise.all([
        getMarketplaceItems(token),
        getWishlist(token),
        getBuyerOrders(token), // returns OrderType[]
      ]);

      // Set marketplace items
      setItems(itemsRes.results || []);

      // Set wishlist (extract item IDs)
      setWishlist((wishlistRes.results || []).map((w: any) => w.item.id));

      // Set orders count safely
      setOrdersCount(ordersRes.length);
    } catch (err) {
      console.error("Failed to load market, wishlist, or orders:", err);
    } finally {
      setLoading(false);
    }
  }

  // Initial load
  loadMarket();

  // Refresh orders count every 30 seconds
  intervalId = window.setInterval(async () => {
    try {
      const ordersRes = await getBuyerOrders(token);
      setOrdersCount(ordersRes.length);
    } catch (err) {
      console.error("Failed to refresh orders count:", err);
    }
  }, 30_000);

  // Cleanup interval when component unmounts
  return () => clearInterval(intervalId);
}, [access]);





/* =======================
   REST-safe Wishlist
   ======================= */
async function toggleWishlist(item: MarketplaceItem) {
  if (!access || item.seller === user?.id) return;

  const id = Number(item.id);
  const saved = wishlist.includes(id);

  setActionLoading((s) => ({ ...s, [id]: true }));

  try {
    await toggleWishlistItem(access, item, saved); // use centralized API

    // Update local state
    setWishlist((prev) =>
      saved ? prev.filter((x) => x !== id) : [...prev, id]
    );

    toast.success(saved ? "Removed from wishlist" : "Added to wishlist");
  } catch {
    toast.error("Wishlist action failed");
  } finally {
    setActionLoading((s) => ({ ...s, [id]: false }));
  }
}


  const filteredItems = items.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.seller_name.toLowerCase().includes(q)
    );
  });

  /* =======================
     UI
     ======================= */
  return (
    <div className="px-3 sm:px-6 py-6 space-y-6">
      <h2 className="text-2xl font-bold">Marketplace</h2>
      <div className="flex items-center gap-4">
    {/* Wishlist */}
    <button
      onClick={() => router.push("/dashboard/marketplace/wishlist")}
      className="relative"
    >
      <Heart className="w-5 h-5" />
      {wishlist.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
          {wishlist.length}
        </span>
      )}
    </button>

    {/* Cart */}
    <button
      onClick={() => router.push("/dashboard/marketplace/orders")}
      className="relative"
    >
      🛒
      {ordersCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full px-1">
          {ordersCount}
        </span>
      )}
    </button>
  </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-40 w-full" />
            </Card>
          ))
        ) : (
          filteredItems.map((item) => (
            <Card key={item.id}>
              <div className="h-40 bg-muted">
                {item.media?.length ? (
                  <img
                    src={mediaUrl(item.media[0].file ?? "placeholder.png")}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-sm">
                    No preview
                  </div>
                )}
              </div>

              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {item.seller_name}
                </p>
              </CardHeader>

              <CardContent>
                <p className="text-sm line-clamp-3">{item.description}</p>
                <p className="font-semibold mt-2">
                  {item.currency} {item.price}
                </p>
              </CardContent>

              <CardFooter className="flex flex-col gap-3">
                <Button
                  variant={
                    wishlist.includes(Number(item.id)) ? "default" : "outline"
                  }
                  disabled={
                    actionLoading[item.id] || item.seller === user?.id
                  }
                  onClick={() => toggleWishlist(item)}
                >
                  <Heart className="w-4 h-4 mr-1" />
                  {item.seller === user?.id
                    ? "Your item"
                    : wishlist.includes(Number(item.id))
                    ? "Saved"
                    : "Wishlist"}
                </Button>

                <BuyButton
                  item={item}
                  access={access}
                  onSuccess={(orderId) =>
                    router.push(
                      `/dashboard/marketplace/orders/${orderId}`
                    )
                  }
                />
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
