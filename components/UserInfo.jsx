"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import SpinWheel from "./spinwheel/spinWheel";
import ScratchCard from "./ScratchCard/ScratchCard";

export default function UserInfo() {
  const { data: session } = useSession();

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-8 bg-zince-300/10 flex flex-col gap-2 my-6">
        <div>
          Name: <span className="font-bold">{session?.user?.name}</span>
        </div>
        <div>
          Email: <span className="font-bold">{session?.user?.email}</span>
        </div>

        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white font-bold px-6 py-2 mt-3"
        >
          Log Out
        </button>
      </div>

    <div className="grid grid-rows-2 gap-10">
      <div className="flex items-center justify-center border border-gray-300 bg-gray-100 text-xl font-bold">
      <div className="flex flex-col items-center justify-center bg-gray-200">
      <h1 className="text-2xl font-bold mb-4">Scratch to Win!</h1>
      <ScratchCard
    prizeContent={
      <div className="text-center">
        <h2 className="text-2xl font-bold m-5">You Won!</h2>
        <p className="text-lg">$100 Gift Card</p>
      </div>
    }
    overlayImage="/vercel.svg"
    scratchRadius={15}
    />
    
    </div>
      
    <div className="App">
      <SpinWheel />
    </div>

      </div>
    </div>
    </div>
  );
}
