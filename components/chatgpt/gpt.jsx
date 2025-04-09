// 🧩 File: /models/Merchant.js


// 🧩 File: /models/Transaction.js



// 🧩 File: /lib/dbConnect.js



// 🧩 File: /pages/api/payments/create-link.js



// 🧩 File: /pages/api/payments/verify.js



// 🧩 File: Frontend Example Component (PayNowButton.jsx)
import { useState } from 'react';

export default function PayNowButton({ merchantAdminId }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    const res = await fetch('/api/payments/create-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ merchantAdminId })
    });

    const data = await res.json();
    if (data.upiLink) {
      window.location.href = data.upiLink;
    }
    setLoading(false);
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Redirecting...' : 'Pay Now'}
    </button>
  );
}

//qr generator
// 🧩 File: components/AdminIdQR.jsx
import { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';

export default function AdminIdQR() {
  const [adminId, setAdminId] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);
  const [error, setError] = useState(null);
  const canvasRef = useRef();

  useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const res = await fetch('/api/admin');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch admin ID');
        setAdminId(data.adminId);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchAdminId();
  }, []);

  useEffect(() => {
    if (!adminId) return;

    QRCode.toCanvas(canvasRef.current, adminId, {
      errorCorrectionLevel: 'H',
      scale: 6,
    }, err => {
      if (err) {
        console.error(err);
        setError('Failed to generate QR code');
      } else {
        const canvas = canvasRef.current;
        setQrUrl(canvas.toDataURL('image/png'));
      }
    });
  }, [adminId]);

  const handleDownload = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `admin-${adminId}-qr.png`;
    link.click();
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!adminId) return <p>Loading admin ID...</p>;

  return (
    <div className="text-center mt-4">
      <canvas ref={canvasRef} className="mx-auto" />
      <p className="mt-2 text-sm text-gray-600">Admin ID: {adminId}</p>
      <button
        onClick={handleDownload}
        className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Download QR Code
      </button>
    </div>
  );
}
