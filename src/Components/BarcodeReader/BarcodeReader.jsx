import { useEffect, useRef, useState } from "react";
import img from "./qr.png";

const BarcodeReader = () => {
  const barcodeParser = async () => {
    const barcodeDetector = new BarcodeDetector({
      formats: ["qr_code"],
    });

    const result = await barcodeDetector.detect(document.querySelector("#img"));
    result.length > 0 ? alert(result[0].rawValue) : alert("no data");
  };

  return (
    <div className="barcode-reader">
      <button onClick={barcodeParser}>Capture</button>

      {<img src={img} alt="Captured photo" id="img" />}
    </div>
  );
};
export default BarcodeReader;
