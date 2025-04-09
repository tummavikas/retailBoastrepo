import { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';

export default function AdminIdQR({ adminId }) {
  const [error, setError] = useState(null);
  const canvasRef = useRef();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch(`/api/admin/${adminId}`);
        const contentType = res.headers.get('content-type');

        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Unexpected response format');
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch admin');

        const adminIdFromDb = data.admin.adminId;
        QRCode.toCanvas(canvasRef.current, adminIdFromDb, {
          errorCorrectionLevel: 'H',
          scale: 6,
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchAdmin();
  }, [adminId]);

  const handleDownloadPDF = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();

    const imgProps = pdf.getImageProperties(imgData);
    const ratio = Math.min(150 / imgProps.width, 150 / imgProps.height);
    const imgWidth = imgProps.width * ratio;
    const imgHeight = imgProps.height * ratio;

    const x = (pageWidth - imgWidth) / 2;
    const y = 40;

    pdf.setFontSize(16);
    pdf.text('Admin QR Code', pageWidth / 2, 20, { align: 'center' });
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    pdf.save(`admin-${adminId}-qr.pdf`);
  };

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="text-center mt-4">
      <canvas ref={canvasRef} className="mx-auto" />
      <p className="mt-2 text-sm text-gray-600">Admin ID: {adminId}</p>
      <button
        onClick={handleDownloadPDF}
        className="mt-3 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Download QR as PDF
      </button>
    </div>
  );
}
