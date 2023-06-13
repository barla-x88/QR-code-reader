import "./App.css";
import BarcodeReader from "./Components/BarcodeReader/BarcodeReader";
import Footer from "./Components/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <BarcodeReader />
      <Footer />
    </>
  );
}

export default App;
