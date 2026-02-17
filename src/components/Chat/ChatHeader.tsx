"use client";

export default function ChatHeader() {
  const orderId = "12345"; // This should be passed as a prop or derived from context
  const participantName = "John Doe"; // This should also be dynamic
  const Partneship = "Manager";
  const isSeller = true; // This should be determined based on user role and order details
  const role = isSeller ? "Seller" : "Buyer";
  const agenType = "Order Support"; // This should be dynamic based on the context of the chat
  return (
    <div className="p-4 bg-gray-100 border-b">
      <h1 className="text-xl font-semibold">Chat</h1>

      <p className="text-sm text-gray-600">Order ID: {orderId}</p>
      <p className="text-sm text-gray-600">Participant: {participantName}</p>
      <p className="text-sm text-gray-600">Role: {Partneship}</p>
      <p className="text-sm text-gray-600">Agent Type: {agenType}</p>
      

    </div>
  );
}   