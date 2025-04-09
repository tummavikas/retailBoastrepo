"use client";
import { useEffect, useState } from 'react';

export default function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions');
        const data = await response.json();
        if (response.ok) {
          setTransactions(data);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <div className="text-center py-4">Loading transactions...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">User</th>
            <th className="py-2 px-4 border">Amount</th>
            <th className="py-2 px-4 border">Discount</th>
            <th className="py-2 px-4 border">Final Amount</th>
            <th className="py-2 px-4 border">Date</th>
            <th className="py-2 px-4 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td className="py-2 px-4 border">{transaction.userName}</td>
                <td className="py-2 px-4 border">${transaction.amount?.toFixed(2)}</td>
                <td className="py-2 px-4 border">${transaction.discount?.toFixed(2)}</td>
                <td className="py-2 px-4 border">${transaction.finalAmount?.toFixed(2)}</td>
                <td className="py-2 px-4 border">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border">{transaction.status || 'completed'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-4 text-center text-gray-500">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
