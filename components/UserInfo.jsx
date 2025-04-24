"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Scanner from "./Scanner";
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQrcode } from '@fortawesome/free-solid-svg-icons'
import Tutorial from "./tutorial/tutorial";
import BillingForm from "./BillingForm/Billing";


library.add(faQrcode)

export default function UserInfo() {


  const { data: session } = useSession();
  const [error, setError] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [showBillingForm, setShowBillingForm] = useState(false);


  return (
    <div className="min-h-screen w-full p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <span >Welcome To RetailBoost</span>
        <div><Tutorial /></div>
        <div>
          Name: <span className="font-bold">{session?.user?.name}</span>
        </div>
        <div>
          Email: <span className="font-bold">{session?.user?.email}</span>
        </div>

        {error && <div className="text-red-500">{error}</div>}
        <div className="mt-2 flex justify-center">
          <FontAwesomeIcon 
            icon={faQrcode} 
            className="text-3xl text-blue-500 cursor-pointer hover:text-blue-700" 
            onClick={() => setShowScanner(true)}
          />
        </div>
        {showScanner && (
          <Scanner 
            onClose={() => setShowScanner(false)}
            onScanSuccess={(data) => {
              setShowScanner(false);
              setScannedData(data);
              setShowBillingForm(true);
            }}
          />
        )}

        {showBillingForm ? (
          <BillingForm scannedData={scannedData} isEditable={false} />
        ) : scannedData && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Scanned QR Data:</h3>
            <div className="p-3 bg-white rounded border border-gray-300 mb-3">
              <code>{scannedData}</code>
            </div>
            <button
              onClick={() => setShowBillingForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
            >
              Use This Data for Billing
            </button>
          </div>
        )}
        
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white font-bold px-6 py-2 mt-3">
          Log Out
        </button>
      </div>
    </div>
  );
}
