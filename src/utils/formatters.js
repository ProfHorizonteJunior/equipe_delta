export function formatBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function simulatePrice(prev) {
  return prev * (1 + (Math.random() - 0.5) * 0.015);
}