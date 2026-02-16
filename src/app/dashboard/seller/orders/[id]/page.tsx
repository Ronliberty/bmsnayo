"use client";

import ChatLauncher from "@/components/Chat/ChatLauncher";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";


export default function OrderSellerPage() {
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
        <ChatLauncher />
    </>
  );
}

        