import React, { useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import Webcam from "react-webcam";
import { useEffect } from "react";

//using react-webcam lib
const CollectPage = () => {
  const webcamRef = useRef<Webcam>(null);
  const [scannedResult, setScannedResult] = useState("");

  const handleScan = async () => {
    const webcam = webcamRef.current;
    const codeReader = new BrowserMultiFormatReader();

    try {
      const result = await codeReader.decodeFromInputVideoDevice(
        undefined,
        webcam?.video!
      );

      if (result) {
        setScannedResult(result.getText());
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className=" flex justify-center">
        <div className="text-2xl font-semibold">
          <h2 className="text-center">QR Code Scanner</h2>
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={false}
            onUserMedia={() => handleScan()}
          />
          {scannedResult && <p>Scanned Result: {scannedResult}</p>}
        </div>
      </div>
    </div>
  );
};

export default CollectPage;
