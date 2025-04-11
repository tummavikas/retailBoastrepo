"use client";
import BillingForm from "./BillingForm/Billing";
import { useState } from "react";
import {
  Scanner,
  useDevices,
  outline,
  boundingBox,
  centerText,
} from "@yudiel/react-qr-scanner";

const styles = {
  container: {
    width: 400,
    margin: "auto",
  },
  controls: {
    marginBottom: 8,
  },
};

export default function ScannerPage({ onScanSuccess }) {
  const [deviceId, setDeviceId] = useState(undefined);
  const [tracker, setTracker] = useState("centerText");
  const [pause, setPause] = useState(false);

  const devices = useDevices();

  function getTracker() {
    switch (tracker) {
      case "outline":
        return outline;
      case "boundingBox":
        return boundingBox;
      case "centerText":
        return centerText;
      default:
        return undefined;
    }
  }

  const [scannedData, setScannedData] = useState(null);

  const handleScan = async (data) => {
    setPause(true);
    try {
      setScannedData(data);
      // Pass data back to parent component
      if (onScanSuccess) {
        console.log(`onScan: ${data}`);
        onScanSuccess(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPause(false);
    }
  };

  return (
    <div className="flex justify-center text-center">
      <Scanner
        formats={[
          "qr_code",
          "micro_qr_code",
          "rm_qr_code",
          "maxi_code",
          "pdf417",
          "aztec",
          "data_matrix",
          "matrix_codes",
          "dx_film_edge",
          "databar",
          "databar_expanded",
          "codabar",
          "code_39",
          "code_93",
          "code_128",
          "ean_8",
          "ean_13",
          "itf",
          "linear_codes",
          "upc_a",
          "upc_e",
        ]}
        constraints={{
          deviceId: deviceId,
        }}
        onScan={(detectedCodes) => {
          handleScan(detectedCodes[0].rawValue);
        }}
        onError={(error) => {
          console.log(`onError: ${error}'`);
        }}
        styles={{ container: { height: "400px", width: "350px" } }}
        components={{
          audio: true,
          onOff: true,
          torch: true,
          zoom: true,
          finder: true,
          tracker: getTracker(),
        }}
        allowMultiple={true}
        scanDelay={2000}
        paused={pause}
      />
    </div>
  );
}
