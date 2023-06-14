import { useRef, useState } from "react";
import { ImSearch, ImStop } from "react-icons/im";
import { FaCopy } from "react-icons/fa";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

import { FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";

const BarcodeReader = () => {
  const videoRef = useRef(null);
  const resultRef = useRef(null);
  const [isStart, setIsStart] = useState(false);
  const [inputValue, setInputValue] = useState("https://readqr.netlify.app");
  const [error, setError] = useState(true);

  const readQR = async () => {
    try {
      //media source
      const src = await navigator.mediaDevices.getUserMedia({ video: true });

      if (src) {
        // indicates QR reading process is in progress
        setIsStart(true);

        //set device camera as video source
        videoRef.current.srcObject = src;
      }

      if (!window.BarcodeDetector) {
        throw new ReferenceError();
      }

      //create a barcode detector
      const barcodeDetector = new BarcodeDetector({
        formats: ["qr_code"],
      });

      //Finds data embedded in QR Code
      const showResult = setInterval(async () => {
        const result = await barcodeDetector.detect(videoRef.current);
        if (result.length > 0) {
          setInputValue(result[0].rawValue);
          stopReadQR(showResult);
        }
      }, 1000);
    } catch (error) {
      let msg = "";
      if (error instanceof DOMException) {
        msg = "No access to device camera";
      }
      if (error instanceof ReferenceError) {
        msg = "Device dosen't have Barcode reading capabilities";
      }
      alert(msg);
    }
  };

  const stopReadQR = (intervalName) => {
    if (!isStart) return;
    videoRef.current.srcObject.getTracks().forEach((track) => {
      track.stop();

      //indicate QR reading has stoped
      setIsStart(false);

      //clear Interval
      clearInterval(intervalName);
    });
  };

  //copies result to clipboard
  const copyToClipboard = () => {
    resultRef.current.select();
    navigator.clipboard.writeText(inputValue).catch((error) => {
      document.execCommand("copy", true, null);
    });
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
          {!isStart ? <ImSearch style={{ color: "#E8AA42" }} /> : <ImStop />}
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
        <FaCopy /> Copy
      </button>
      <div className="social-share">
        <p>Share This With Your Friends</p>

        <div className="social-share-btns">
          <FacebookShareButton
            quote="Read QR code with your phone - No installation required"
            url="https://readqr.netlify.app"
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <WhatsappShareButton
            title="Read QR code with your phone - No installation required"
            url="https://readqr.netlify.app"
          >
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <TwitterShareButton
            title="Read QR code with your phone - No installation required"
            url="https://readqr.netlify.app"
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </div>
      </div>
    </div>
  );
};
export default BarcodeReader;
