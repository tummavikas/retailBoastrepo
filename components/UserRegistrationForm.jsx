"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserRegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user" // Default role for users
  });

  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An error occurred during registration");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">User Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          type="text"
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          type="tel"
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
        />
        <input
          name="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="hidden"
          name="role"
          value="user"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-bold cursor-pointer px-6 py-2 rounded w-full"
        >
          Register as User
        </button>
        {error && (
          <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
