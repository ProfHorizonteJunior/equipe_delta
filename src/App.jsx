import { BrowserRouter, Routes, Route } from "react-router-dom";
import CryptoMonitor from "./pages/CryptoMonitor";
import { Secrets } from "./pages/Secrets";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CryptoMonitor />} />
          <Route path="/secrets" element={<Secrets />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}