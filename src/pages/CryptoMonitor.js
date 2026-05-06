import { useState, useEffect, useRef } from "react";
import { COINS } from "../constants/coins";
import { formatBRL } from "../utils/formatters";
import CoinCard from "../components/CoinCard";
import AlertPanel from "../components/AlertPanel";
import Notification from "../components/Notification";
import { useNavigate } from "react-router-dom";

export default function CryptoMonitor() {
  const [prices, setPrices] = useState(() =>
    Object.fromEntries(COINS.map((c) => [c.id, c.basePrice]))
  );
  const [lastUpdated, setLastUpdated] = useState(null);
  const [notification, setNotification] = useState(null);
  const notifTimer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPrices() {
      try {
        const ids = COINS.map((c) => c.id).join(",");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=brl`
        );
        const data = await res.json();

        const next = {};
        COINS.forEach((c) => {
          if (data[c.id]?.brl) next[c.id] = data[c.id].brl;
        });
        setPrices(next);
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Erro ao buscar preços:", err);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const alerts = JSON.parse(localStorage.getItem("cryptoAlerts") || "{}");
    COINS.forEach((c) => {
      const target = alerts[c.id];
      if (target && prices[c.id] >= target) {
        showNotification(
          `🔔 ${c.name} atingiu ${formatBRL(prices[c.id])} (meta: ${formatBRL(target)})`
        );
        delete alerts[c.id];
        localStorage.setItem("cryptoAlerts", JSON.stringify(alerts));
      }
    });
  }, [prices]);

  function showNotification(msg) {
    clearTimeout(notifTimer.current);
    setNotification(msg);
    notifTimer.current = setTimeout(() => setNotification(null), 4000);
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-sans selection:bg-yellow-500 selection:text-black">
      <div className="max-w-2xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-10 border-l-4 border-yellow-500 pl-6 py-2">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
              EQUIPE<span className="text-yellow-500">_DELTA</span>
            </h1>
            <p className="text-zinc-500 text-sm font-bold tracking-[0.3em]">CRYPTO MONITORING</p>
          </div>
          
          {lastUpdated && (
            <div className="text-right">
              <p className="text-zinc-600 text-[10px] font-bold uppercase italic">Sync Status: Online</p>
              <p className="text-yellow-500 font-mono text-xl font-black">
                {lastUpdated.toLocaleTimeString("pt-BR")}
              </p>
            </div>
          )}
        </header>

        {/* LISTA DE CARDS */}
        <main className="space-y-4 mb-8">
          {COINS.map((c) => (
            <div 
              key={c.id} 
              className="bg-white rounded-xl border-2 border-zinc-800 p-1 hover:border-yellow-500 transition-all shadow-xl text-black"
            >
              <CoinCard coin={c} price={prices[c.id]} />
            </div>
          ))}
        </main>

        {/* BOTÃO HISTÓRICO (ESTILIZADO) */}
        <button 
          onClick={() => navigate("/historico")} 
          className="mb-8 w-full md:w-auto bg-white text-black font-bold py-2 px-6 rounded-lg border-2 border-zinc-800 hover:bg-yellow-500 transition-colors"
        >
          Ver histórico
        </button>

        {/* PAINEL DE ALERTAS */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-yellow-500 font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-yellow-500"></span>
            Configurar Alertas
          </h2>
          
          <div className="bg-white p-4 rounded-xl text-black font-bold">
             <AlertPanel onSave={showNotification} />
          </div>
        </section>

        <Notification message={notification} />

        {/* FOOTER / SECRETS */}
        <footer className="mt-20 text-center pb-10">
          <button
            onClick={() => navigate("/secrets")}
            className="text-[10px] text-zinc-800 hover:text-red-700 font-mono uppercase transition-colors"
          >
            Terminal Root / No Access
          </button>
        </footer>
      </div>
    </div>
  );
}