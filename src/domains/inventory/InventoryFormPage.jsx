import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import ArgonBox from "components/ArgonBox";
import ArgonButton from "components/ArgonButton";
import ArgonInput from "components/ArgonInput";
import ArgonTypography from "components/ArgonTypography";

import categories from "data/categories";
import units from "data/units";
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

const emptyTouched = {
  name: false,
  category: false,
  type: false,
  stock: false,
  unit: false,
  minimumStock: false,
};

function FieldLabel({ children }) {
  return (
    <ArgonTypography variant="caption" fontWeight="bold" color="text" display="block" mb={0.75}>
      {children}
    </ArgonTypography>
  );
}

function FieldHint({ children, error }) {
  return (
    <ArgonTypography
      variant="caption"
      color={error ? "error" : "text"}
      display="block"
      mt={0.75}
      sx={{ lineHeight: 1.45 }}
    >
      {children}
    </ArgonTypography>
  );
}

function InventoryFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { inventory, vendors, addInventoryItem, updateInventoryItem } = useGAInventory();
  const isEdit = Boolean(id);
  const existingItem = inventory.find((item) => item.id === id);
  const [form, setForm] = useState(emptyForm);
  const [touched, setTouched] = useState(emptyTouched);
  const [submitAttempted, setSubmitAttempted] = useState(false);

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

  const validation = useMemo(() => {
    const stockNumber = Number(form.stock);
    const minimumStockNumber = Number(form.minimumStock);

    return {
      name: form.name.trim() ? "" : "Item name wajib diisi.",
      category: form.category ? "" : "Category wajib dipilih.",
      type: form.type ? "" : "Type wajib dipilih.",
      unit: form.unit ? "" : "Unit wajib dipilih.",
      stock:
        isEdit || (Number.isFinite(stockNumber) && stockNumber >= 0)
          ? ""
          : "Initial stock tidak boleh negatif.",
      minimumStock:
        Number.isFinite(minimumStockNumber) && minimumStockNumber >= 0
          ? ""
          : "Minimum stock tidak boleh negatif.",
    };
  }, [form, isEdit]);

  const isFormValid = Object.values(validation).every((message) => !message);
  const showError = (field) => Boolean(validation[field] && (touched[field] || submitAttempted));

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const markTouched = (field) => () => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (!isFormValid) return;

    const payload = {
      name: form.name.trim(),
      category: form.category,
      type: form.type,
      unit: form.unit,
      minimumStock: Number(form.minimumStock),
      vendorId: form.vendorId,
      notes: form.notes.trim(),
    };

    if (isEdit && existingItem) {
      updateInventoryItem(existingItem.id, payload);
      navigate(`/inventory/${existingItem.id}`, {
        state: { successMessage: "Item berhasil diperbarui." },
      });
      return;
    }

    const created = addInventoryItem({ ...payload, stock: Number(form.stock) });
    navigate(`/inventory/${created.id}`, {
      state: { successMessage: "Item berhasil ditambahkan." },
    });
  };

  if (isEdit && !existingItem) {
    return (
      <PageShell title="Edit Item" description="Item tidak ditemukan.">
        <Card>
          <ArgonBox p={3}>
            <ArgonButton onClick={() => navigate("/inventory")}>Back</ArgonButton>
          </ArgonBox>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={isEdit ? "Edit Item" : "Add Item"}
      description={
        isEdit
          ? "Perbarui informasi master item tanpa mengubah stock langsung."
          : "Tambahkan barang baru ke master inventory."
      }
    >
      <Card>
        <ArgonBox component="form" p={{ xs: 2, sm: 2.5, md: 3 }} onSubmit={handleSubmit}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={6}>
              <FieldLabel>Item Name *</FieldLabel>
              <ArgonInput
                fullWidth
                value={form.name}
                onChange={updateField("name")}
                onBlur={markTouched("name")}
                placeholder="Contoh: Kertas A4"
                error={showError("name")}
              />
              {showError("name") ? <FieldHint error>{validation.name}</FieldHint> : null}
            </Grid>

            <Grid item xs={12} md={6}>
              <FieldLabel>Category *</FieldLabel>
              <FormControl fullWidth size="small" error={showError("category")}>
                <Select
                  value={form.category}
                  onChange={updateField("category")}
                  onBlur={markTouched("category")}
                >
                  {categories.map((category) => (
                    <MenuItem value={category} key={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                {showError("category") ? (
                  <FormHelperText>{validation.category}</FormHelperText>
                ) : null}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FieldLabel>Type *</FieldLabel>
              <FormControl fullWidth size="small" error={showError("type")}>
                <Select
                  value={form.type}
                  onChange={updateField("type")}
                  onBlur={markTouched("type")}
                >
                  <MenuItem value="Consumable">Consumable</MenuItem>
                  <MenuItem value="Asset">Asset</MenuItem>
                </Select>
                {showError("type") ? <FormHelperText>{validation.type}</FormHelperText> : null}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FieldLabel>Unit *</FieldLabel>
              <FormControl fullWidth size="small" error={showError("unit")}>
                <Select
                  value={form.unit}
                  onChange={updateField("unit")}
                  onBlur={markTouched("unit")}
                >
                  {units.map((unit) => (
                    <MenuItem value={unit} key={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
                {showError("unit") ? <FormHelperText>{validation.unit}</FormHelperText> : null}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FieldLabel>{isEdit ? "Current Stock" : "Initial Stock"}</FieldLabel>
              <ArgonInput
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
                disabled={isEdit}
                value={form.stock}
                onChange={updateField("stock")}
                onBlur={markTouched("stock")}
                error={showError("stock")}
              />
              {showError("stock") ? (
                <FieldHint error>{validation.stock}</FieldHint>
              ) : (
                <FieldHint>
                  {isEdit
                    ? "Stock hanya dapat diubah melalui menu Stock Movement."
                    : "Stok awal saat item pertama kali dibuat."}
                </FieldHint>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <FieldLabel>Minimum Stock</FieldLabel>
              <ArgonInput
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
                value={form.minimumStock}
                onChange={updateField("minimumStock")}
                onBlur={markTouched("minimumStock")}
                error={showError("minimumStock")}
              />
              {showError("minimumStock") ? (
                <FieldHint error>{validation.minimumStock}</FieldHint>
              ) : (
                <FieldHint>Batas stok yang digunakan untuk menentukan status Low Stock.</FieldHint>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <FieldLabel>Vendor</FieldLabel>
              <FormControl fullWidth size="small">
                <Select value={form.vendorId} onChange={updateField("vendorId")}>
                  <MenuItem value="">No Vendor</MenuItem>
                  {vendors.map((vendor) => (
                    <MenuItem value={vendor.id} key={vendor.id}>
                      {vendor.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FieldLabel>Notes</FieldLabel>
              <ArgonInput
                fullWidth
                multiline
                rows={4}
                value={form.notes}
                onChange={updateField("notes")}
                placeholder="Catatan tambahan..."
              />
            </Grid>
          </Grid>

          <ArgonBox
            display="flex"
            flexDirection={{ xs: "column-reverse", sm: "row" }}
            justifyContent="flex-end"
            gap={1.5}
            mt={{ xs: 3, md: 4 }}
          >
            <ArgonButton
              sx={{ width: { xs: "100%", sm: "auto" } }}
              variant="outlined"
              color="secondary"
              type="button"
              onClick={() => navigate(isEdit ? `/inventory/${id}` : "/inventory")}
            >
              Cancel
            </ArgonButton>
            <ArgonButton
              sx={{ width: { xs: "100%", sm: "auto" } }}
              color="primary"
              type="submit"
              disabled={!isFormValid}
            >
              {isEdit ? "Save Changes" : "Add Item"}
            </ArgonButton>
          </ArgonBox>
        </ArgonBox>
      </Card>
    </PageShell>
  );
}

import PropTypes from "prop-types";

FieldLabel.propTypes = { children: PropTypes.node.isRequired };
FieldHint.propTypes = { children: PropTypes.node.isRequired, error: PropTypes.bool };
FieldHint.defaultProps = { error: false };

export default InventoryFormPage;
