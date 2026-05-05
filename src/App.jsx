import { BrowserRouter, Routes, Route } from "react-router-dom";
import CryptoMonitor from "./pages/CryptoMonitor";
import { Secrets } from "./pages/Secrets";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CryptoMonitor />} />
        <Route path="/secrets" element={<Secrets />} />
      </Routes>
    </BrowserRouter>
  );
}