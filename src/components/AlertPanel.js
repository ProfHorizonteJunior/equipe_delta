import { useState } from "react";
import { COINS } from "../constants/coins";
import { formatBRL } from "../utils/formatters";

export default function AlertPanel({ onSave }) {
  const [selectedCoin, setSelectedCoin] = useState(COINS[0].id);
  const [targetPrice, setTargetPrice] = useState("");

  function handleSave() {
    const price = parseFloat(targetPrice);
    if (!price || price <= 0) return;

    const alerts = JSON.parse(localStorage.getItem("cryptoAlerts") || "{}");
    alerts[selectedCoin] = price;
    localStorage.setItem("cryptoAlerts", JSON.stringify(alerts));

    const coin = COINS.find((c) => c.id === selectedCoin);
    onSave(`Alerta salvo: ${coin.name} ao atingir ${formatBRL(price)}`);
    setTargetPrice("");
  }

  return (
    <div style={styles.alertBox}>
      <p style={styles.alertLabel}>Alerta de preço alvo</p>
      <div style={styles.alertRow}>
        <select
          value={selectedCoin}
          onChange={(e) => setSelectedCoin(e.target.value)}
          style={styles.select}
        >
          {COINS.map((c) => (
            <option key={c.id} value={c.id}>{c.symbol}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Ex: 300000"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSave} style={styles.button}>
          Salvar alerta
        </button>
      </div>
    </div>
  );
}

const styles = {
  alertBox: {
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  alertLabel: { fontSize: 13, color: "#555", fontWeight: 600, marginBottom: 10 },
  alertRow:   { display: "flex", gap: 8, alignItems: "center" },
  select: {
    fontSize: 14, padding: "8px 10px",
    border: "1px solid #ccc", borderRadius: 8, width: 100,
  },
  input: {
    flex: 1, fontSize: 14, padding: "8px 10px",
    border: "1px solid #ccc", borderRadius: 8,
  },
  button: {
    fontSize: 13, padding: "8px 14px",
    border: "1px solid #333", borderRadius: 8,
    background: "#111", color: "#fff", cursor: "pointer",
  },
};