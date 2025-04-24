import { useSession } from "next-auth/react";
import { useState } from "react";
import ScratchCard from "../ScratchCard/ScratchCard";

export default function BillingForm({ scannedData, isEditable = true }) {
  // Use the scanned data in your form logic
  console.log('Scanned QR data:', scannedData);
  
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    adminId: scannedData, // Pre-fill with scanned data if available
    billingAmount: ''
  });
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const billingAmount = parseFloat(formData.billingAmount);
    if (isNaN(billingAmount) || billingAmount <= 0) {
      setError("Please enter a valid billing amount.");
      setIsLoading(false);
      return;
    }

    try {
      const res =
      await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: formData.billingAmount,
          userName: session?.user?.name,
          adminId: formData.adminId,
          userId: session?.user?.id
        })
      });
      

      if (!res.ok) {
        const errorText = await res.text();
        try {
          const errorData = JSON.parse(errorText);
          setError(errorData.message || 'Transaction failed.');
        } catch {
          setError(errorText || 'Transaction failed.');
        }
        return;
      }

      try {
        const result = await res.json();
        setShowScratchCard(true);
      } catch (err) {
        console.error('Failed to parse success response:', err);
        setError('Transaction completed but response was invalid');
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      setError("Transaction failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDiscount = () => {
    const amount = parseFloat(formData.billingAmount) || 0;
    return (amount * 0.1).toFixed(2);
  };
  return (<>
      {!showScratchCard ? (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block mb-2">Admin ID</label>
                <input
                  type="text"
                  name="adminId"
                  value={formData.adminId}
                  onChange={isEditable ? handleChange : undefined}
                  className={`w-full p-2 border rounded ${!isEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="Enter Admin ID"
                  required
                  readOnly={!isEditable}
                />
                <input
                  type="number"
                  name="billingAmount"
                  value={formData.billingAmount}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-4"
                  placeholder="Enter Billing Amount"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              {/* <button
                type="submit"
                className="bg-blue-500 text-white font-bold px-6 py-2 w-full rounded"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button> */}
            </form>
          ) : 
          (
            <div className="mt-8">
              <ScratchCard
                prizeContent={
                  <div className="text-center">
                    <h2 className="text-2xl font-bold m-5">You Won!</h2>
                    <p className="text-lg">${calculateDiscount()} Discount</p>
                  </div>
                }
                overlayImage="/vercel.svg"
                scratchRadius={15}
              />
  
            </div>
  
          )}
  </>
        )
}