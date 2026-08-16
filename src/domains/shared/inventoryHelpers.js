export const isLowStock = (item) => Number(item.stock) <= Number(item.minimumStock);

export const getStockStatus = (item) => {
  if (Number(item.stock) === 0) return { label: "Out of Stock", color: "error" };
  if (isLowStock(item)) return { label: "Low Stock", color: "warning" };
  return { label: "In Stock", color: "success" };
};

export const movementLabels = {
  stock_in: "Stock In",
  stock_out: "Stock Out",
  adjustment: "Adjustment",
};

export const movementColors = {
  stock_in: "success",
  stock_out: "error",
  adjustment: "warning",
};

export const getMovementDelta = (movement) => {
  if (movement.type === "stock_in") return Number(movement.quantity);
  if (movement.type === "stock_out") return -Number(movement.quantity);
  return Number(movement.currentStock) - Number(movement.previousStock);
};

export const formatMovementQuantity = (movement, unit = "") => {
  const delta = getMovementDelta(movement);
  const prefix = delta > 0 ? "+" : "";
  return `${prefix}${delta} ${unit}`.trim();
};

export const getMovementDescription = (movement) =>
  [movement.purpose, movement.notes].filter(Boolean).join(" — ") || "-";

export const formatDate = (date) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
};
