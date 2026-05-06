






import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { COINS } from "../constants/coins";

const COLORS = {
    bitcoin: "#f7931a",
    ethereum: "#627eea",
    solana: "#9945ff",
};

export default function History() {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchHistory() {
            try {
                const results = await Promise.all(
                    COINS.map((c) =>
                        fetch(
                            `https://api.coingecko.com/api/v3/coins/${c.id}/market_chart?vs_currency=brl&days=90`
                        ).then((r) => r.json())
                    )
                );

                // agrupa por data
                const map = {};
                COINS.forEach((coin, i) => {
                    results[i].prices.forEach(([timestamp, price]) => {
                        const date = new Date(timestamp).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                        });
                        if (!map[date]) map[date] = { date };
                        map[date][coin.id] = Math.round(price);
                    });
                });

                setChartData(Object.values(map));
            } catch (err) {
                console.error("Erro ao buscar histórico:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, []);

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <button onClick={() => navigate("/")} style={styles.backBtn}>← Voltar</button>
                <h1 style={styles.title}>Histórico de Preços — 90 dias</h1>
            </div>

            {loading ? (
                <p style={styles.loading}>Carregando dados...</p>
            ) : (
                <div style={styles.chartBox}>
                    <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={chartData}>
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={4} />
                            <YAxis
                                tick={{ fontSize: 10 }}
                                tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                                width={55}
                            />
                            <Tooltip
                                formatter={(v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            />
                            <Legend />
                            {COINS.map((coin) => (
                                <Line
                                    key={coin.id}
                                    type="monotone"
                                    dataKey={coin.id}
                                    name={coin.name}
                                    stroke={COLORS[coin.id]}
                                    dot={false}
                                    strokeWidth={2}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

const styles = {
    page: {
        fontFamily: "system-ui, sans-serif",
        maxWidth: 520,
        margin: "0 auto",
        padding: "24px 16px",
        color: "#111",
    },
    header: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 24,
    },
    backBtn: {
        fontSize: 13,
        padding: "6px 12px",
        border: "1px solid #ccc",
        borderRadius: 8,
        background: "#fff",
        cursor: "pointer",
    },
    title: { fontSize: 17, fontWeight: 600 },
    loading: { color: "#888", fontSize: 14 },
    chartBox: {
        background: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: 10,
        padding: "16px",
        marginBottom: 16,
    },
    coinTitle: { fontSize: 14, fontWeight: 600, marginBottom: 12 },
};