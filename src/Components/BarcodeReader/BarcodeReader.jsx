import { useRef, useState } from "react";
import { ImSearch, ImStop } from "react-icons/im";
import { FaCopy } from "react-icons/fa";

const BarcodeReader = () => {
  const videoRef = useRef(null);
  const resultRef = useRef(null);
  const [isStart, setIsStart] = useState(false);
  const [inputValue, setInputValue] = useState("https://readqr.netlify.app");

  const readQR = async () => {
    try {
      // indicate QR reading process is in progress
      setIsStart(true);

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
        if (result.length > 0) {
          setInputValue(result[0].rawValue);
          stopReadQR();
        }
      }, 1000);
    } catch (error) {
      console.log(error.message);
    }
  };

  const stopReadQR = () => {
    videoRef.current.srcObject.getTracks().forEach((track) => {
      track.stop();

      //indicate QR reading has stoped
      setIsStart(false);
    });
  };

  const copyToClipboard = () => {
    resultRef.current.select();
    navigator.clipboard
      .writeText(inputValue)
      .catch((error) => console.log(error));
  };

  return (
    <div className="barcode-reader">
      <div className="video-container">
        <video ref={videoRef} autoPlay={true}></video>
        <button
          type="button"
          className="start-btn"
          onClick={!isStart ? readQR : stopReadQR}
        >
          {!isStart ? <ImSearch style={{ color: "green" }} /> : <ImStop />}
        </button>
      </div>

      <input
        className="result-text"
        type="text"
        value={inputValue}
        readOnly={true}
        placeholder="Result will appear here.."
        style={{ textAlign: "center" }}
        ref={resultRef}
      />

      <button type="button" className="copy-btn" onClick={copyToClipboard}>
        <FaCopy />
      </button>
    </div>
  );
};
export default BarcodeReader;
