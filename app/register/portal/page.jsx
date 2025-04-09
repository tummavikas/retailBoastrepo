"use client";
import { useState } from "react";
import UserRegistrationForm from "@/components/UserRegistrationForm";
import AdminRegistrationForm from "@/components/AdminRegistrationForm";
import { FaUser, FaStore } from "react-icons/fa";

export default function RegistrationPortal() {
  const [userType, setUserType] = useState(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl p-8">
        {!userType ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-8">Create Your Account</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div 
                className="border rounded-lg p-6 cursor-pointer hover:bg-gray-100 transition"
                onClick={() => setUserType('user')}
              >
                <div className="flex justify-center mb-4">
                  <FaUser className="text-5xl text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">I'm a User</h2>
                <p className="text-gray-600">
                  Sign up to browse and shop from local retailers
                </p>
                <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded">
                  Register as User
                </button>
              </div>
              <div 
                className="border rounded-lg p-6 cursor-pointer hover:bg-gray-100 transition"
                onClick={() => setUserType('admin')}
              >
                <div className="flex justify-center mb-4">
                  <FaStore className="text-5xl text-green-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">I'm a Retailer</h2>
                <p className="text-gray-600">
                  Sign up your business to start selling on our platform
                </p>
                <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded">
                  Register as Retailer
                </button>
              </div>
            </div>
          </div>
        ) : userType === 'user' ? (
          <UserRegistrationForm />
        ) : (
          <AdminRegistrationForm />
        )}
      </div>
    </div>
  );
}
