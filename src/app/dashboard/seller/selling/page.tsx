"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react"; 

interface Media {
  id: string;
  file: string;
  media_type: "image" | "video" | "file";
}

interface Item {
  id: string;
  title: string;
  description: string;
  item_type: "service" | "app" | "website";
  price: number;
  currency: string;
  active: boolean;
  created_at: string;
  max_quantity: number | null;
  availability_quantity: number | null;
  views_count: number;
  purchases_count: number;
  media: Media[];
}

export default function SellerItemsPage() {
  const { access } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!access) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/my-items/`, {
      headers: { Authorization: `Bearer ${access}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // Handle paginated response
        setItems(data.results || []); 
      })
      .finally(() => setLoading(false));
  }, [access]);

  if (loading) return <p className="p-6">Loading items...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
       <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <h1 className="text-2xl font-bold">My Marketplace Items</h1>
        </div>
        <Button asChild>
          <a href="/dashboard/market/create">+ New Item</a>
        </Button>
      </div>

      {items.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            You haven’t uploaded any items yet.
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id}>
            {item.media.length > 0 && item.media[0].media_type === "image" && (
              <img
                src={item.media[0].file}
                alt={item.title}
                className="w-full h-40 object-cover rounded-t-lg"
              />
            )}

            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{item.title}</span>
                <Badge variant={item.active ? "success" : "warning"}>
                  {item.active ? "Active" : "Inactive"}
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground line-clamp-2">
                {item.description}
              </p>

              <div className="flex justify-between">
                <span className="font-semibold">
                  {item.currency} {item.price}
                </span>
                <Badge variant="outline">{item.item_type}</Badge>
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Views: {item.views_count}</span>
                <span>Purchases: {item.purchases_count}</span>
              </div>

              <div className="text-xs">
                {item.item_type === "service" ? (
                  <Badge variant="success">Unlimited</Badge>
                ) : (
                  <Badge
                    variant={
                      item.availability_quantity === 0 ? "destructive" : "default"
                    }
                  >
                    Available: {item.availability_quantity}
                  </Badge>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <Button size="sm" variant="outline">
                  Edit
                </Button>
                <Button size="sm" variant="destructive">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
