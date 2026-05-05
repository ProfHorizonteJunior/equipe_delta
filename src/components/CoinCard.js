import { formatBRL } from "../utils/formatters";

export default function CoinCard({ coin, price }) {
  const change = (((price - coin.basePrice) / coin.basePrice) * 100).toFixed(2);
  const isUp = change >= 0;

  return (
    <div style={styles.card}>
      <div>
        <p style={styles.coinName}>{coin.name}</p>
        <p style={styles.coinSymbol}>{coin.symbol}</p>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={styles.coinPrice}>{formatBRL(price)}</p>
        <p style={{ ...styles.coinChange, color: isUp ? "#1a7f4b" : "#c0392b" }}>
          {isUp ? "+" : ""}{change}%
        </p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: 10,
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  coinName:   { fontSize: 15, fontWeight: 600 },
  coinSymbol: { fontSize: 12, color: "#888", marginTop: 2 },
  coinPrice:  { fontSize: 15, fontWeight: 600, fontFamily: "monospace" },
  coinChange: { fontSize: 12, marginTop: 2 },
};