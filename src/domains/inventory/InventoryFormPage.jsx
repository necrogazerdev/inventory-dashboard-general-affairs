import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import ArgonBox from "components/ArgonBox";
import ArgonButton from "components/ArgonButton";
import ArgonInput from "components/ArgonInput";
import ArgonTypography from "components/ArgonTypography";

import categories from "data/categories";
import { useGAInventory } from "context/ga-inventory";
import PageShell from "domains/shared/PageShell";

const emptyForm = {
  name: "",
  category: "Office Supplies",
  type: "Consumable",
  stock: "0",
  unit: "Pcs",
  minimumStock: "0",
  vendorId: "",
  notes: "",
};

function FieldLabel({ children }) {
  return <ArgonTypography variant="caption" fontWeight="bold" color="text" display="block" mb={0.75}>{children}</ArgonTypography>;
}

function InventoryFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { inventory, vendors, addInventoryItem, updateInventoryItem } = useGAInventory();
  const isEdit = Boolean(id);
  const existingItem = inventory.find((item) => item.id === id);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit && existingItem) {
      setForm({
        name: existingItem.name,
        category: existingItem.category,
        type: existingItem.type,
        stock: String(existingItem.stock),
        unit: existingItem.unit,
        minimumStock: String(existingItem.minimumStock),
        vendorId: existingItem.vendorId || "",
        notes: existingItem.notes || "",
      });
    }
  }, [isEdit, existingItem]);

  const updateField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Item name wajib diisi.");
    if (!form.unit.trim()) return setError("Unit wajib diisi.");
    if (Number(form.minimumStock) < 0) return setError("Minimum stock tidak boleh negatif.");
    if (!isEdit && Number(form.stock) < 0) return setError("Initial stock tidak boleh negatif.");

    const payload = {
      name: form.name.trim(),
      category: form.category,
      type: form.type,
      unit: form.unit.trim(),
      minimumStock: Number(form.minimumStock),
      vendorId: form.vendorId,
      notes: form.notes.trim(),
    };

    if (isEdit && existingItem) {
      updateInventoryItem(existingItem.id, payload);
      navigate(`/inventory/${existingItem.id}`);
    } else {
      const created = addInventoryItem({ ...payload, stock: Number(form.stock) });
      navigate(`/inventory/${created.id}`);
    }
  };

  if (isEdit && !existingItem) {
    return <PageShell title="Edit Inventory" description="Item tidak ditemukan."><Card><ArgonBox p={3}><ArgonButton onClick={() => navigate("/inventory")}>Back</ArgonButton></ArgonBox></Card></PageShell>;
  }

  return (
    <PageShell
      title={isEdit ? "Edit Inventory" : "Add Inventory"}
      description={isEdit ? "Perbarui informasi master item tanpa mengubah stock langsung." : "Tambahkan barang baru ke master inventory."}
    >
      <Card>
        <ArgonBox component="form" p={{ xs: 2, sm: 2.5, md: 3 }} onSubmit={handleSubmit}>
          {error ? (
            <ArgonBox mb={3} p={2} bgColor="error" borderRadius="lg">
              <ArgonTypography variant="button" color="white">{error}</ArgonTypography>
            </ArgonBox>
          ) : null}

          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={6}>
              <FieldLabel>Item Name *</FieldLabel>
              <ArgonInput fullWidth value={form.name} onChange={updateField("name")} placeholder="Contoh: Kertas A4" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FieldLabel>Category *</FieldLabel>
              <FormControl fullWidth size="small"><Select value={form.category} onChange={updateField("category")}>{categories.map((category) => <MenuItem value={category} key={category}>{category}</MenuItem>)}</Select></FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FieldLabel>Type *</FieldLabel>
              <FormControl fullWidth size="small"><Select value={form.type} onChange={updateField("type")}><MenuItem value="Consumable">Consumable</MenuItem><MenuItem value="Asset">Asset</MenuItem></Select></FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FieldLabel>Unit *</FieldLabel>
              <ArgonInput fullWidth value={form.unit} onChange={updateField("unit")} placeholder="Pcs / Rim / Roll / Unit" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FieldLabel>{isEdit ? "Current Stock" : "Initial Stock"}</FieldLabel>
              <ArgonInput fullWidth type="number" disabled={isEdit} value={form.stock} onChange={updateField("stock")} />
              {isEdit ? <ArgonTypography variant="caption" color="text">Perubahan stock dilakukan melalui Stock Movement.</ArgonTypography> : null}
            </Grid>
            <Grid item xs={12} md={6}>
              <FieldLabel>Minimum Stock</FieldLabel>
              <ArgonInput fullWidth type="number" value={form.minimumStock} onChange={updateField("minimumStock")} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FieldLabel>Vendor</FieldLabel>
              <FormControl fullWidth size="small"><Select value={form.vendorId} onChange={updateField("vendorId")}><MenuItem value="">No Vendor</MenuItem>{vendors.map((vendor) => <MenuItem value={vendor.id} key={vendor.id}>{vendor.name}</MenuItem>)}</Select></FormControl>
            </Grid>
            <Grid item xs={12}>
              <FieldLabel>Notes</FieldLabel>
              <ArgonInput fullWidth multiline rows={4} value={form.notes} onChange={updateField("notes")} placeholder="Catatan tambahan..." />
            </Grid>
          </Grid>

          <ArgonBox
            display="flex"
            flexDirection={{ xs: "column-reverse", sm: "row" }}
            justifyContent="flex-end"
            gap={1.5}
            mt={{ xs: 3, md: 4 }}
          >
            <ArgonButton sx={{ width: { xs: "100%", sm: "auto" } }} variant="outlined" color="secondary" type="button" onClick={() => navigate(isEdit ? `/inventory/${id}` : "/inventory")}>Cancel</ArgonButton>
            <ArgonButton sx={{ width: { xs: "100%", sm: "auto" } }} color="primary" type="submit">{isEdit ? "Save Changes" : "Add Item"}</ArgonButton>
          </ArgonBox>
        </ArgonBox>
      </Card>
    </PageShell>
  );
}

import PropTypes from "prop-types";
FieldLabel.propTypes = { children: PropTypes.node.isRequired };

export default InventoryFormPage;
