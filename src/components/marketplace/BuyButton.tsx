







// "use client";

// import { ShoppingCart } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { toast } from "sonner";
// import { useAccountBalance } from "@/app/hooks/useAccountBalance";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

// type Props = {
//   item: {
//     id: string;
//     price: string;
//     currency: string;
//     item_type: "service" | "app" | "website";
//     availability_quantity: number;
//   };
//   access: string | null;
//   onSuccess: (orderId: string) => void;
// };

// export function BuyButton({ item, access, onSuccess }: Props) {
//   const { account, refresh } = useAccountBalance();
//   const [quantity, setQuantity] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const price = Number(item.price);
//   const total = price * quantity;
//   const balance = Number(account?.balance || 0);

//   const soldOut =
//     item.item_type !== "service" && item.availability_quantity <= 0;

//   async function handleBuy() {
//     if (!access) {
//       toast.error("Please sign in to continue");
//       return;
//     }

//     if (balance < total) {
//       toast.error("Insufficient balance", {
//         description: "Please deposit funds to continue",
//       });
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch(`${API_BASE}/market/orders/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${access}`,
//         },
//         body: JSON.stringify({
//           items: [
//             {
//               item_id: item.id,
//               quantity: item.item_type === "service" ? 1 : quantity,
//             },
//           ],
//         }),
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err?.detail || "Order failed");
//       }

//       const data = await res.json();

//       toast.success("Order placed successfully 🎉");
//       refresh();
//       onSuccess(data.id);
//     } catch (e: any) {
//       toast.error("Purchase failed", {
//         description: e.message || "Please try again",
//       });
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="flex flex-col gap-2 w-full">
//       {item.item_type !== "service" && (
//         <div className="flex items-center gap-2">
//           <Button
//             size="icon"
//             variant="outline"
//             disabled={quantity <= 1}
//             onClick={() => setQuantity((q) => q - 1)}
//           >
//             −
//           </Button>

//           <span className="w-6 text-center">{quantity}</span>

//           <Button
//             size="icon"
//             variant="outline"
//             disabled={quantity >= item.availability_quantity}
//             onClick={() => setQuantity((q) => q + 1)}
//           >
//             +
//           </Button>

//           <span className="text-xs text-muted-foreground">
//             {item.availability_quantity} available
//           </span>
//         </div>
//       )}

//       <Button disabled={soldOut || loading} onClick={handleBuy}>
//         <ShoppingCart className="w-4 h-4 mr-1" />
//         Buy ({item.currency} {total})
//       </Button>
//     </div>
//   );
// }






"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useAccountBalance } from "@/app/hooks/useAccountBalance";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

type Props = {
  item: {
    id: string;
    price: string;
    currency: string;
    item_type: "service" | "app" | "website";
    availability_quantity: number;
    title?: string;
  };
  access: string | null;
  onSuccess: (orderId: string) => void;
};

export function BuyButton({ item, access, onSuccess }: Props) {
  const { account, refresh } = useAccountBalance();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  const price = Number(item.price);
  const total = price * quantity;
  const balance = Number(account?.balance || 0);

  const soldOut =
    item.item_type !== "service" && item.availability_quantity <= 0;

  async function handleBuy() {
    if (!access) {
      toast.error("Please sign in to continue");
      return;
    }

    if (balance < total) {
      setShowDepositModal(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/market/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          items: [
            {
              item_id: item.id,
              quantity: item.item_type === "service" ? 1 : quantity,
            },
          ],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.detail || "Order failed");
      }

      const data = await res.json();

      toast.success("Order placed successfully 🎉");
      refresh();
      onSuccess(data.id);
    } catch (e: any) {
      toast.error("Purchase failed", {
        description: e.message || "Please try again",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* BUY UI */}
      <div className="flex flex-col gap-2 w-full">
        {item.item_type !== "service" && (
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => q - 1)}
            >
              −
            </Button>

            <span className="w-6 text-center">{quantity}</span>

            <Button
              size="icon"
              variant="outline"
              disabled={quantity >= item.availability_quantity}
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </Button>

            <span className="text-xs text-muted-foreground">
              {item.availability_quantity} available
            </span>
          </div>
        )}

        <Button disabled={soldOut || loading} onClick={handleBuy}>
          <ShoppingCart className="w-4 h-4 mr-1" />
          Buy ({item.currency} {total})
        </Button>
      </div>

      {/* INSUFFICIENT BALANCE MODAL */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-xl w-96 space-y-4">
            <h3 className="text-lg font-semibold">Insufficient Balance</h3>
            <p className="text-sm text-muted-foreground">
              You don’t have enough balance to buy{" "}
              <span className="font-medium">
                {item.title || "this item"}
              </span>
              . Would you like to deposit funds now?
            </p>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDepositModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowDepositModal(false);
                  router.push("/dashboard/finance?tab=deposit");
                }}
              >
                Deposit
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
