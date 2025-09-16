import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type OrdersCartProps = {
  count: number;
};

export function OrdersCart({ count }: OrdersCartProps) {
  const router = useRouter();
  return (
    <Button
      className="relative flex items-center gap-2 bg-primary text-primary-foreground"
      onClick={() => router.push("/dashboard/marketplace/orders")}
    >
      <ShoppingCart className="w-5 h-5" />
      <span className="hidden sm:inline">Orders</span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
          {count}
        </span>
      )}
    </Button>
  );
}
