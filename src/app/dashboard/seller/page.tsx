"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Link } from "lucide-react";
import { useSellerStatus } from "@/app/hooks/useSellerStatus";
import ChatLauncher from "@/components/Chat/ChatLauncher";



export default function SellerUploadPage() {
  const { access } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [itemType, setItemType] =
    useState<"service" | "app" | "website">("service");
  const [maxQuantity, setMaxQuantity] = useState("");
  const [tags, setTags] = useState("seller");
  const [active, setActive] = useState(true);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { status, isApproved } = useSellerStatus();

  if (status === "loading") {
    return <div className="p-12 text-center">Checking access...</div>;
  }

  if (!isApproved) {
    return null; // will be redirected by the hook anyway
  }
  async function submitItem() {
    if (!access) return;

    if (itemType !== "service" && !maxQuantity) {
      alert("Max quantity is required for apps and websites");
      return;
    }

    setLoading(true);

    /* -------------------------------
       1. CREATE ITEM (JSON)
    -------------------------------- */
    const createRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/market/items/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          title,
          description,
          item_type: itemType,
          price: Number(price),
          currency,
          max_quantity: itemType === "service" ? null : Number(maxQuantity),
          tags: tags.split(",").map((t) => t.trim()),
          active,
        }),
      }
    );

    if (!createRes.ok) {
      setLoading(false);
      alert("Failed to create item");
      return;
    }

    const item = await createRes.json();

    /* -------------------------------
       2. UPLOAD MEDIA (MULTIPART)
    -------------------------------- */
    for (const file of mediaFiles) {
      const formData = new FormData();
      formData.append("item", item.id);
      formData.append("file", file);

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/market/item-media/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access}`,
          },
          body: formData,
        }
      );
    }

    setLoading(false);

    // ✅ Redirect to list page
    router.push("/dashboard/seller/selling");
  }

  return (
    <>
    <div className="max-w-3xl mx-auto p-6 space-y-6">
       <div className="flex gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/seller/selling")}
        >
          My Items
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/seller/orders")}
        >
          My Orders
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/seller/history")}
        >
          Items History
        </Button>
      </div>
     
      <Card>
        <CardHeader>
          <CardTitle>Create Marketplace Item</CardTitle>
    
        </CardHeader>

        <CardContent className="space-y-5">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <Label>Currency</Label>
              <Input
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Item Type</Label>
            <select
              value={itemType}
              onChange={(e) =>
                setItemType(e.target.value as "service" | "app" | "website")
              }
              className="border rounded p-2 w-full"
            >
              <option value="service">Service (Unlimited)</option>
              <option value="app">App</option>
              <option value="website">Website</option>
            </select>
          </div>

          {itemType !== "service" && (
            <div>
              <Label>Max Quantity</Label>
              <Input
                type="number"
                value={maxQuantity}
                onChange={(e) => setMaxQuantity(e.target.value)}
              />
            </div>
          )}

          <div>
            <Label>Tags (comma separated)</Label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div>
            <Label>Media (images / videos)</Label>
            <Input
              type="file"
              multiple
              onChange={(e) =>
                setMediaFiles(Array.from(e.target.files || []))
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="active"
              type="checkbox"
              checked={active}
              onChange={() => setActive(!active)}
            />
            <Label htmlFor="active">Active</Label>
          </div>

          <Button onClick={submitItem} disabled={loading}>
            {loading ? "Creating..." : "Create Item"}
          </Button>
        </CardContent>
      </Card>
    </div>
    <ChatLauncher />
    </>
  );
}
