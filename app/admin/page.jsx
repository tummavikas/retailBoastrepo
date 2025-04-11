"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import TransactionTable from "@/components/TransactionTable";
import AdminIdQR from "@/components/Qrcode/AdminIdqr";


export default function AdminDashboard() {

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    }
  });

  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalDiscounts: 0,
    totalTransactions: 0
  });

  if (session?.user?.role !== "admin") {
    redirect("/denied");
  }

  useEffect(() => {

    // Fetch transactions
    const fetchData = async () => {
      const res = await fetch(`/api/admin?adminId=${session.user.adminId}`);
      const data = await res.json();
      setTransactions(data);
      
      // Calculate stats
      const totalSales = data.reduce((sum, txn) => sum + (txn?.amount || 0), 0);
      const totalDiscounts = data.reduce((sum, txn) => sum + ((txn?.amount || 0) - (txn?.finalAmount || 0)), 0);
      
      setStats({
        totalSales,
        totalDiscounts,
        totalTransactions: data.length
      });
    };
    fetchData();
  }, [session]);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4">Welcome, Admin {session.user.name}!</p>
        <p className="mb-4">Admin Id : d7189b992</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Total Sales</h3>
            <p className="text-2xl font-bold">₹1,38,789 </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">No of Transactions</h3>
            <p className="text-2xl font-bold">346</p>
          </div>
          {/* <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800">Transactions</h3>
            <p className="text-2xl font-bold">₹{stats.totalTransactions}</p>
          </div> */}
        </div>

        <div className="mb-8 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Your QR Code</h2>
          <p>{session.user.adminId}</p>
          {console.log(session.user.adminId)}
          <AdminIdQR adminId={session.user.adminId} />
          <div className="p-4 bg-white rounded border">
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Users will scan this code to make purchases
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          <TransactionTable />
        </div>

        <button 
          onClick={() => signOut()}
          className="mt-4 bg-red-500 text-white font-bold px-6 py-2 rounded-lg">
          LogOUT
        </button>
      </div>
    </div>
  );
}
