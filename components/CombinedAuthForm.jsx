"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { connectMongoDB } from "../../lib/mongodb";

export default function CombinedAuthForm() {
  const [formData, setFormData] = useState({
    adminID: "",
    billingAmount: "",
    email: "",
    name: "",
    password: ""
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Initialize DB connection
      await connectMongoDB();

      // Check if user exists
      const userCheck = await fetch("/api/userExists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const { exists } = await userCheck.json();

      // Register new user if needed
      if (!exists) {
        const registerRes = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: "user",
          }),
        });
        if (!registerRes.ok) throw new Error("Registration failed");
      }

      // Process billing
      const billingRes = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminID: formData.adminID,
          amount: formData.billingAmount,
          userEmail: formData.email
        }),
      });
      if (!billingRes.ok) throw new Error("Billing failed");

      // Login user
      const loginRes = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (loginRes?.error) throw new Error("Login failed");

      router.push("/dashboard");

    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg rounded-lg border-t-4 border-green-400 p-6 w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">Complete Registration</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="adminID"
            value={formData.adminID}
            onChange={handleChange}
            placeholder="Admin ID"
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="billingAmount"
            type="number"
            value={formData.billingAmount}
            onChange={handleChange}
            placeholder="Billing Amount"
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 border rounded"
            required
          />

          <button
            type="submit"
            className="bg-green-600 text-white font-bold px-6 py-2 w-full rounded"
          >
            Submit
          </button>
        </form>

        {error && (
          <div className="bg-red-500 text-white text-sm py-1 px-3 rounded-md mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
