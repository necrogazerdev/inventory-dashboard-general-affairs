import { createContext, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

import initialInventory from "data/inventory";
import initialVendors from "data/vendors";
import initialMovements from "data/stockMovements";

const GAInventoryContext = createContext(null);

const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export function GAInventoryProvider({ children }) {
  const [inventory, setInventory] = useState(initialInventory);
  const [vendors, setVendors] = useState(initialVendors);
  const [movements, setMovements] = useState(initialMovements);

  const addInventoryItem = (payload) => {
    const item = { ...payload, id: makeId("inv") };
    setInventory((current) => [item, ...current]);
    return item;
  };

  const updateInventoryItem = (id, payload) => {
    setInventory((current) =>
      current.map((item) => (item.id === id ? { ...item, ...payload, id: item.id } : item))
    );
  };

  const addVendor = (payload) => {
    const vendor = { ...payload, id: makeId("vendor") };
    setVendors((current) => [vendor, ...current]);
    return vendor;
  };

  const updateVendor = (id, payload) => {
    setVendors((current) =>
      current.map((vendor) => (vendor.id === id ? { ...vendor, ...payload, id: vendor.id } : vendor))
    );
  };

  const createMovement = ({ itemId, type, quantity, notes, vendorId, purpose, date }) => {
    const item = inventory.find((entry) => entry.id === itemId);
    if (!item) throw new Error("Item inventory tidak ditemukan.");

    const parsedQuantity = Number(quantity);
    const isAdjustment = type === "adjustment";

    if (!Number.isFinite(parsedQuantity) || (!isAdjustment && parsedQuantity <= 0)) {
      throw new Error("Quantity harus lebih dari 0.");
    }
    if (isAdjustment && parsedQuantity < 0) {
      throw new Error("Stock hasil adjustment tidak boleh negatif.");
    }

    let nextStock = item.stock;
    if (type === "stock_in") nextStock += parsedQuantity;
    if (type === "stock_out") nextStock -= parsedQuantity;
    if (isAdjustment) nextStock = parsedQuantity;

    if (nextStock < 0) throw new Error(`Stock ${item.name} tidak mencukupi.`);
    if (isAdjustment && nextStock === item.stock) {
      throw new Error("Tidak ada perubahan stock untuk disimpan.");
    }

    const movement = {
      id: makeId("mov"),
      itemId,
      type,
      quantity: type === "adjustment" ? Math.abs(nextStock - item.stock) : parsedQuantity,
      previousStock: item.stock,
      currentStock: nextStock,
      date: date || new Date().toISOString().slice(0, 10),
      notes: notes || "",
      vendorId: vendorId || "",
      purpose: purpose || "",
    };

    setInventory((current) =>
      current.map((entry) => (entry.id === itemId ? { ...entry, stock: nextStock } : entry))
    );
    setMovements((current) => [movement, ...current]);

    return movement;
  };

  const value = useMemo(
    () => ({
      inventory,
      vendors,
      movements,
      addInventoryItem,
      updateInventoryItem,
      addVendor,
      updateVendor,
      createMovement,
    }),
    [inventory, vendors, movements]
  );

  return <GAInventoryContext.Provider value={value}>{children}</GAInventoryContext.Provider>;
}

GAInventoryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useGAInventory() {
  const context = useContext(GAInventoryContext);
  if (!context) throw new Error("useGAInventory harus digunakan di dalam GAInventoryProvider.");
  return context;
}
