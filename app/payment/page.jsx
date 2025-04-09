"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ScratchCard from "@/components/ScratchCard/ScratchCard";

export default function PaymentPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");
  
  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState(null);
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    if (!adminId) router.push("/");
    else {
      // Fetch admin details
      fetch(`/api/admin/${adminId}`)
        .then(res => res.json())
        .then(data => setAdmin(data))
        .catch(() => router.push("/"));
    }
  }, [adminId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return;
    setShowScratchCard(true);
  };

  const handleScratchComplete = (discountPercent) => {
    setDiscount(discountPercent);
    
    // Create transaction
    fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        adminId,
        userId: session?.user?.id,
        amount: parseFloat(amount)
      })
    });
  };

  if (!admin) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Make Payment</h1>
        <p className="mb-2">Merchant: {admin.name}</p>
        
        {!showScratchCard ? (
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
              <label className="block mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter amount"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Get Discount
            </button>
          </form>
        ) : (
          <div className="mt-6">
            <ScratchCard 
              prizeContent={
                <div className="text-center p-4">
                  <h3 className="text-xl font-bold">You got {discount}% off!</h3>
                  <p className="mt-2">
                    Final amount: ${(amount * (1 - discount/100)).toFixed(2)}
                  </p>
                </div>
              }
              onScratchComplete={() => handleScratchComplete(Math.floor(Math.random() * 21) + 10)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
