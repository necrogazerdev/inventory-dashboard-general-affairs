const stockMovements = [
  { id: "mov-008", itemId: "inv-001", type: "stock_in", quantity: 10, previousStock: 8, currentStock: 18, date: "2026-08-08", notes: "Restock kebutuhan kantor", vendorId: "vendor-atk", purpose: "" },
  { id: "mov-007", itemId: "inv-017", type: "stock_out", quantity: 4, previousStock: 10, currentStock: 6, date: "2026-08-08", notes: "Kebutuhan packing harian", vendorId: "", purpose: "Warehouse Team" },
  { id: "mov-006", itemId: "inv-005", type: "stock_out", quantity: 2, previousStock: 8, currentStock: 6, date: "2026-08-07", notes: "Refill pantry", vendorId: "", purpose: "Pantry" },
  { id: "mov-005", itemId: "inv-015", type: "stock_out", quantity: 5, previousStock: 13, currentStock: 8, date: "2026-08-07", notes: "Packing outbound", vendorId: "", purpose: "Warehouse Team" },
  { id: "mov-004", itemId: "inv-019", type: "stock_in", quantity: 50, previousStock: 25, currentStock: 75, date: "2026-08-06", notes: "Restock price tag", vendorId: "vendor-price-tag", purpose: "" },
  { id: "mov-003", itemId: "inv-009", type: "adjustment", quantity: 1, previousStock: 3, currentStock: 2, date: "2026-08-06", notes: "Koreksi setelah stock opname", vendorId: "", purpose: "Stock Opname" },
  { id: "mov-002", itemId: "inv-018", type: "stock_out", quantity: 30, previousStock: 150, currentStock: 120, date: "2026-08-05", notes: "Pemakaian paper bag", vendorId: "", purpose: "Warehouse Team" },
  { id: "mov-001", itemId: "inv-003", type: "stock_out", quantity: 2, previousStock: 5, currentStock: 3, date: "2026-08-05", notes: "Refill printer office", vendorId: "", purpose: "Office" },
];

export default stockMovements;
