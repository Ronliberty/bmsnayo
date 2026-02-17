"use client";
import { useState } from "react";
import ChatLauncher from "@/components/Chat/ChatLauncher";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import ChatModal from "@/components/Chat/ChatModal";



export default function OrderSellerPage() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
        <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            </CardHeader>
              <div className="p-4">
                <p className="text-gray-500">Order details will be displayed here.</p>
              </div>
        </Card>
        </div>
        <ChatLauncher onOpen={() => setIsOpen(true)} />
        <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

        