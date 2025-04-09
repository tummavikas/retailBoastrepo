"use client";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";


export default function Denied() {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700">
          You don't have permission to access this page.
        </p>
      </div>
      <button
          onClick={() => handleSignOut()}
          className="mt-4 bg-red-500 text-white font-bold px-6 py-2 rounded-lg"
      >Return to home page</button>
    </div>
  );
}
