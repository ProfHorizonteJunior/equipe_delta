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
    const interval = setInterval(fetchPrices, 30000); // a cada 30s (respeita limite da API)
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
    <div style={styles.app}>
      <h1 style={styles.title}>Monitor de Criptoativos</h1>

      <div style={styles.list}>
        {COINS.map((c) => (
          <CoinCard key={c.id} coin={c} price={prices[c.id]} />
        ))}
      </div>

      <Notification message={notification} />
      <AlertPanel onSave={showNotification} />

      {lastUpdated && (
        <p style={styles.status}>
          Atualizado em: {lastUpdated.toLocaleTimeString("pt-BR")}
        </p>
      )}



      <span
        onClick={() => navigate("/secrets")}
        style={{ cursor: "default", userSelect: "none", fontSize: 10, color: "#a81010ff", marginTop: 300, display: "block" }}
        title=""
      >
        Não Clique
      </span>
    </div>

    
  );
}

const styles = {
  app: {
    fontFamily: "system-ui, sans-serif",
    maxWidth: 480,
    margin: "0 auto",
    padding: "32px 16px",
    color: "#111",
  },
  title: { fontSize: 20, fontWeight: 600, marginBottom: 20 },
  list: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 },
  status: { fontSize: 12, color: "#888", marginTop: 8 },
};