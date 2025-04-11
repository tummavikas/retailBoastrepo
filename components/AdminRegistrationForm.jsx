"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";

export default function AdminRegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    email: "",
    password: "",
    role: "admin",
    shopName: "",
    shopType: "kirana",
    establishmentDate: "",
    dailyCustomers: 0,
    avgSpending: 0,
    expectedPeople: 0,
    minCartValue: 100,
    discounts: {
      tenPercent: 0,
      twentyPercent: { count: 0, minPurchase: 0 },
      thirtyPercent: { count: 0, minPurchase: 0 },
      fiftyPercent: { count: 0, minPurchase: 0 }
    }
  });

  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || 
        !formData.phone || !formData.shopName) {
      setError("Please fill all required fields");
      return;
    }

    try {
      const resUserExists = await fetch("/api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: formData.email })
      });

      const { user } = await resUserExists.json();

      if (user) {
        setError("User already exists");
        return;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          role: "admin" // Explicit role assignment
        })
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        try {
          const errorData = await res.json();
          setError(errorData.message || "Registration failed");
        } catch (jsonError) {
          const text = await res.text();
          setError(text || "Registration failed (invalid response)");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An error occurred during registration");
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400 w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-center">Welcome to RetailBoast</h1>
        <h2 className="text-xl font-bold my-4 text-center">Admin Registration</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <p>User Info</p>
          {/* Basic Info */}
          <div className="space-y-2 col-span-2">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              placeholder="Full Name"
              className="w-full p-2 border rounded"
              required
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              required
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="tel"
              placeholder="Phone Number"
              className="w-full p-2 border rounded"
              required
            />
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <p>Bussiness Details</p>
          {/* Business Info */}
          <div className="space-y-2">
            <input
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              type="text"
              placeholder="Shop Name"
              className="w-full p-2 border rounded"
              required
            />
            <select
              name="shopType"
              value={formData.shopType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Store">Kirana Store</option>
              <option value="gym">Gym</option>
              <option value="shopping">Shopping</option>
              <option value="other">Other</option>
            </select>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              type="text"
              placeholder="Business Location"
              className="w-full p-2 border rounded"
              required
            />
            <p>Established on</p>
            <input
              name="establishmentDate"
              value={formData.establishmentDate}
              onChange={handleChange}
              type="date"
              className="w-full p-2 border rounded"
              required
              
            />
          </div>
          <p>sales details</p>
          {/* Business Metrics */}
          <div className="space-y-2">
            <div className="space-y-1">
              <label>Daily Customers</label>
              <input
                name="dailyCustomers"
                value={formData.dailyCustomers}
                onChange={handleChange}
                type="number"
                placeholder="Daily Customers"
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="space-y-1">
              <label>Avg Customer Spending</label>
              <input
                name="avgSpending"
                value={formData.avgSpending}
                onChange={handleChange}
                type="number"
                placeholder="Avg Customer Spending"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="space-y-1">
              <label>Expected Customers</label>
              <input
                name="expectedPeople"
                value={formData.expectedPeople}
                onChange={handleChange}
                type="number"
                placeholder="Expected Customers"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="space-y-1">
              <label>Min Cart Value</label>
              <input
                name="minCartValue"
                value={formData.minCartValue}
                onChange={handleChange}
                type="number"
                placeholder="Min Cart Value"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <p>Discount adjustment</p>
          <code>This is the amount of discount you can give to each customer</code>
          {/* Discount Settings */}
          <div className="col-span-2 space-y-4">
            <h3 className="font-bold">Discount Settings</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <label>Discount Range</label>
                <div className="flex gap-2">
                  <span
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      discounts: {
                        ...prev.discounts,
                        tenPercent: 5,
                        twentyPercent: { ...prev.discounts.twentyPercent, count: 0 }
                      }
                    }))}
                    className={`px-4 py-2 rounded cursor-pointer ${
                      formData.discounts.tenPercent === 5 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    5% Discount
                  </span>
                  <span
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      discounts: {
                        ...prev.discounts,
                        tenPercent: 0,
                        twentyPercent: { ...prev.discounts.twentyPercent, count: 10 }
                      }
                    }))}
                    className={`px-4 py-2 rounded cursor-pointer ${
                      formData.discounts.twentyPercent.count === 10 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    10% Discount
                  </span>
                  <span
                    className={`px-4 py-2 rounded cursor-pointer bg-gray-200 hover:bg-gray-300`}
                  >
                    20% Discount
                  </span>
                  <span
                    className={`px-4 py-2 rounded cursor-pointer bg-gray-200 hover:bg-gray-300`}
                  >
                    50% Discount
                  </span>
                </div>
              </div>

            </div>
            <div>                
              <code>minimum purchase a customer does</code>
                <input
                  name="minPurchase"
                  value={formData.minPurchase}
                  onChange={handleChange}
                  type="number"
                  className="w-full p-2 border rounded"
                /></div>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2 rounded col-span-2"
          >
            Complete Registration
          </button>

          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2 col-span-2">
              {error}
            </div>
          )}

          <Link className="text-sm mt-3 text-right col-span-2" href="/">
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
