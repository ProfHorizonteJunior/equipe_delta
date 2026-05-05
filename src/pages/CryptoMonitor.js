import { useState, useEffect, useRef } from "react";
import { COINS } from "../constants/coins";
import { simulatePrice, formatBRL } from "../utils/formatters";
import CoinCard from "../components/CoinCard";
import AlertPanel from "../components/AlertPanel";
import Notification from "../components/Notification";

export default function CryptoMonitor() {
  const [prices, setPrices] = useState(() =>
    Object.fromEntries(COINS.map((c) => [c.id, c.basePrice]))
  );
  const [lastUpdated, setLastUpdated] = useState(null);
  const [notification, setNotification] = useState(null);
  const notifTimer = useRef(null);

  // Estudante A: atualiza preços a cada 5 segundos
  useEffect(() => {
    function update() {
      setPrices((prev) => {
        const next = {};
        COINS.forEach((c) => {
          next[c.id] = simulatePrice(prev[c.id]);
        });
        return next;
      });
      setLastUpdated(new Date());
    }

    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, []);

  // Estudante B: verifica alertas do localStorage a cada atualização
  useEffect(() => {
    const alerts = JSON.parse(localStorage.getItem("cryptoAlerts") || "{}");
    COINS.forEach((c) => {
      const target = alerts[c.id];
      if (target && prices[c.id] >= target) {
        showNotification(
          `🔔 ${c.name} atingiu ${formatBRL(prices[c.id])} (meta: ${formatBRL(target)})`
        );
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
  title:  { fontSize: 20, fontWeight: 600, marginBottom: 20 },
  list:   { display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 },
  status: { fontSize: 12, color: "#888", marginTop: 8 },
};