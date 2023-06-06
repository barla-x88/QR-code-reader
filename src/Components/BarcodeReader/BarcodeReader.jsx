import { useRef } from "react";

const BarcodeReader = () => {
  const videoRef = useRef(null);

  const barcodeParser = async () => {
    try {
      //media source
      const src = await navigator.mediaDevices.getUserMedia({ video: true });

      if (src) videoRef.current.srcObject = src;

      if (!window.BarcodeDetector) {
        throw new Error("Device dosen't have Barcode reading capabilities");
      }

      const barcodeDetector = new BarcodeDetector({
        formats: ["qr_code"],
      });

      const showResult = setInterval(async () => {
        const result = await barcodeDetector.detect(videoRef.current);
        if (result.length > 0) alert(result[0].rawValue);
      }, 1000);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="barcode-reader">
      <video ref={videoRef} autoPlay={true}></video>
      <div>
        <button onClick={barcodeParser}> Start Capturing Data</button>
        <button
          onClick={() => {
            videoRef.current.srcObject.getTracks().forEach((track) => {
              track.stop();
            });
          }}
        >
          Stop Capturing
        </button>
      </div>
    </div>
  );
};
export default BarcodeReader;
