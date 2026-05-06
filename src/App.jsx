import { BrowserRouter, Routes, Route } from "react-router-dom";
import CryptoMonitor from "./pages/CryptoMonitor";
import { Secrets } from "./pages/Secrets";
import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CryptoMonitor />} />
        <Route path="/secrets" element={<Secrets />} />
        <Route path="/historico" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}