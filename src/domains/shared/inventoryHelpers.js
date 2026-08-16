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

export const formatDate = (date) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
};
