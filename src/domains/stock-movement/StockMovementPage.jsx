import { useMemo, useState } from "react";

import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import ArgonBox from "components/ArgonBox";
import ArgonButton from "components/ArgonButton";
import ArgonInput from "components/ArgonInput";
import ArgonTypography from "components/ArgonTypography";

import { useGAInventory } from "context/ga-inventory";
import PageShell from "domains/shared/PageShell";
import {
  gaCompactCellSx,
  gaNameCellSx,
  gaNotesCellSx,
  gaTableContainerSx,
  gaTableHeadSx,
  gaWideTableSx,
} from "domains/shared/tableStyles";
import StatusBadge from "domains/shared/StatusBadge";
import {
  formatDate,
  formatMovementQuantity,
  getMovementDescription,
  movementColors,
  movementLabels,
} from "domains/shared/inventoryHelpers";

const today = new Date().toISOString().slice(0, 10);

const makeEmptyForm = () => ({
  itemId: "",
  quantity: "",
  date: today,
  vendorId: "",
  purpose: "",
  notes: "",
});

const emptyTouched = {
  itemId: false,
  quantity: false,
  date: false,
  purpose: false,
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

function MovementDialog({ open, type, onClose, onSuccess }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { inventory, vendors, createMovement } = useGAInventory();
  const [form, setForm] = useState(makeEmptyForm);
  const [touched, setTouched] = useState(emptyTouched);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const selectedItem = inventory.find((item) => item.id === form.itemId);
  const quantityNumber = Number(form.quantity);
  const hasQuantity = form.quantity !== "" && Number.isFinite(quantityNumber);
  const isAdjustment = type === "adjustment";

  const nextStock = useMemo(() => {
    if (!selectedItem || !hasQuantity) return null;
    if (type === "stock_in") return selectedItem.stock + quantityNumber;
    if (type === "stock_out") return selectedItem.stock - quantityNumber;
    return quantityNumber;
  }, [hasQuantity, quantityNumber, selectedItem, type]);

  const adjustmentDelta =
    isAdjustment && selectedItem && nextStock !== null ? nextStock - selectedItem.stock : null;

  const validation = useMemo(() => {
    let quantityMessage = "";

    if (!hasQuantity) {
      quantityMessage = isAdjustment ? "Actual stock wajib diisi." : "Quantity wajib diisi.";
    } else if (isAdjustment && quantityNumber < 0) {
      quantityMessage = "Actual stock tidak boleh negatif.";
    } else if (!isAdjustment && quantityNumber <= 0) {
      quantityMessage = "Quantity harus lebih dari 0.";
    } else if (type === "stock_out" && selectedItem && quantityNumber > selectedItem.stock) {
      quantityMessage = `Stock tidak mencukupi. Maksimum Stock Out ${selectedItem.stock} ${selectedItem.unit}.`;
    } else if (isAdjustment && selectedItem && quantityNumber === selectedItem.stock) {
      quantityMessage =
        "Actual stock sama dengan current stock. Tidak ada perubahan untuk disimpan.";
    }

    return {
      itemId: form.itemId ? "" : "Item wajib dipilih.",
      quantity: quantityMessage,
      date: form.date ? "" : "Tanggal movement wajib diisi.",
      purpose:
        type === "stock_out" && !form.purpose.trim()
          ? "Purpose / Used For wajib diisi."
          : isAdjustment && !form.purpose.trim()
          ? "Adjustment reason wajib diisi."
          : "",
    };
  }, [form, hasQuantity, isAdjustment, quantityNumber, selectedItem, type]);

  const isFormValid = Object.values(validation).every((message) => !message);
  const showError = (field) => Boolean(validation[field] && (touched[field] || submitAttempted));

  const update = (field) => (event) => {
    const value = event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setSubmitError("");
  };

  const markTouched = (field) => () => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const closeDialog = () => {
    setForm(makeEmptyForm());
    setTouched(emptyTouched);
    setSubmitAttempted(false);
    setSubmitError("");
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setSubmitError("");

    if (!isFormValid) return;

    try {
      createMovement({ ...form, type });
      const title = movementLabels[type] || "Stock Movement";
      closeDialog();
      onSuccess(`${title} berhasil disimpan.`);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  const title = movementLabels[type] || "Stock Movement";
  const quantityLabel = isAdjustment ? "Actual Stock *" : "Quantity *";
  const purposeLabel = isAdjustment ? "Adjustment Reason *" : "Purpose / Used For *";
  const purposePlaceholder = isAdjustment
    ? "Contoh: Hasil stock opname fisik berbeda dengan sistem"
    : "Contoh: Warehouse Team / Pantry / Office";

  return (
    <Dialog open={open} onClose={closeDialog} fullWidth fullScreen={isMobile} maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <ArgonBox component="form" pt={1} onSubmit={handleSubmit}>
          {submitError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          ) : null}

          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <FieldLabel>Item *</FieldLabel>
              <FormControl fullWidth size="small" error={showError("itemId")}>
                <Select
                  value={form.itemId}
                  onChange={update("itemId")}
                  onBlur={markTouched("itemId")}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select item
                  </MenuItem>
                  {inventory.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name} — {item.stock} {item.unit}
                    </MenuItem>
                  ))}
                </Select>
                {showError("itemId") ? <FormHelperText>{validation.itemId}</FormHelperText> : null}
              </FormControl>
            </Grid>

            {selectedItem ? (
              <Grid item xs={12}>
                <ArgonBox p={2} bgColor="grey-100" borderRadius="lg">
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <ArgonTypography variant="caption" color="text" display="block">
                        Current Stock
                      </ArgonTypography>
                      <ArgonTypography variant="h6">
                        {selectedItem.stock} {selectedItem.unit}
                      </ArgonTypography>
                    </Grid>
                    <Grid item xs={6}>
                      <ArgonTypography variant="caption" color="text" display="block">
                        {isAdjustment ? "Actual Stock" : "After Movement"}
                      </ArgonTypography>
                      <ArgonTypography
                        variant="h6"
                        color={nextStock !== null && nextStock < 0 ? "error" : "dark"}
                      >
                        {nextStock === null ? "-" : `${nextStock} ${selectedItem.unit}`}
                      </ArgonTypography>
                    </Grid>
                    {isAdjustment && adjustmentDelta !== null ? (
                      <Grid item xs={12}>
                        <ArgonTypography variant="caption" color="text">
                          Adjustment difference: {adjustmentDelta > 0 ? "+" : ""}
                          {adjustmentDelta} {selectedItem.unit}
                        </ArgonTypography>
                      </Grid>
                    ) : null}
                  </Grid>
                </ArgonBox>
              </Grid>
            ) : null}

            <Grid item xs={12} sm={6}>
              <FieldLabel>{quantityLabel}</FieldLabel>
              <ArgonInput
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
                value={form.quantity}
                onChange={update("quantity")}
                onBlur={markTouched("quantity")}
                error={showError("quantity")}
              />
              {showError("quantity") ? (
                <FieldHint error>{validation.quantity}</FieldHint>
              ) : isAdjustment ? (
                <FieldHint>Masukkan jumlah fisik aktual setelah stock opname.</FieldHint>
              ) : selectedItem ? (
                <FieldHint>Gunakan satuan {selectedItem.unit}.</FieldHint>
              ) : null}
            </Grid>

            <Grid item xs={12} sm={6}>
              <FieldLabel>Date *</FieldLabel>
              <ArgonInput
                fullWidth
                type="date"
                value={form.date}
                onChange={update("date")}
                onBlur={markTouched("date")}
                error={showError("date")}
              />
              {showError("date") ? <FieldHint error>{validation.date}</FieldHint> : null}
            </Grid>

            {type === "stock_in" ? (
              <Grid item xs={12}>
                <FieldLabel>Vendor</FieldLabel>
                <FormControl fullWidth size="small">
                  <Select value={form.vendorId} onChange={update("vendorId")}>
                    <MenuItem value="">No Vendor</MenuItem>
                    {vendors.map((vendor) => (
                      <MenuItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ) : null}

            {type !== "stock_in" ? (
              <Grid item xs={12}>
                <FieldLabel>{purposeLabel}</FieldLabel>
                <ArgonInput
                  fullWidth
                  value={form.purpose}
                  onChange={update("purpose")}
                  onBlur={markTouched("purpose")}
                  placeholder={purposePlaceholder}
                  error={showError("purpose")}
                />
                {showError("purpose") ? <FieldHint error>{validation.purpose}</FieldHint> : null}
              </Grid>
            ) : null}

            <Grid item xs={12}>
              <FieldLabel>Notes</FieldLabel>
              <ArgonInput
                fullWidth
                multiline
                rows={3}
                value={form.notes}
                onChange={update("notes")}
                placeholder="Catatan tambahan movement..."
              />
            </Grid>
          </Grid>

          <ArgonBox
            display="flex"
            flexDirection={{ xs: "column-reverse", sm: "row" }}
            justifyContent="flex-end"
            gap={1}
            mt={3}
          >
            <ArgonButton
              sx={{ width: { xs: "100%", sm: "auto" } }}
              type="button"
              variant="outlined"
              color="secondary"
              onClick={closeDialog}
            >
              Cancel
            </ArgonButton>
            <ArgonButton
              sx={{ width: { xs: "100%", sm: "auto" } }}
              type="submit"
              color={movementColors[type] || "primary"}
              disabled={!isFormValid}
            >
              Save {title}
            </ArgonButton>
          </ArgonBox>
        </ArgonBox>
      </DialogContent>
    </Dialog>
  );
}

function StockMovementPage() {
  const { inventory, movements } = useGAInventory();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dialogType, setDialogType] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const filteredMovements = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return movements.filter((movement) => {
      const item = inventory.find((entry) => entry.id === movement.itemId);
      const searchableMovement = `${movement.purpose || ""} ${movement.notes || ""}`.toLowerCase();
      const matchesSearch =
        !keyword ||
        item?.name.toLowerCase().includes(keyword) ||
        searchableMovement.includes(keyword);
      const matchesType = typeFilter === "all" || movement.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [movements, inventory, search, typeFilter]);

  return (
    <PageShell
      title="Stock Movement"
      description="Catat stock masuk, keluar, dan koreksi tanpa mengedit stock langsung."
      actions={
        <ArgonBox
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={1}
          flexWrap="wrap"
          width={{ xs: "100%", sm: "auto" }}
        >
          <ArgonButton
            sx={{ width: { xs: "100%", sm: "auto" } }}
            color="success"
            onClick={() => setDialogType("stock_in")}
          >
            + Stock In
          </ArgonButton>
          <ArgonButton
            sx={{ width: { xs: "100%", sm: "auto" } }}
            color="error"
            onClick={() => setDialogType("stock_out")}
          >
            - Stock Out
          </ArgonButton>
          <ArgonButton
            sx={{ width: { xs: "100%", sm: "auto" } }}
            variant="outlined"
            color="secondary"
            onClick={() => setDialogType("adjustment")}
          >
            Adjust
          </ArgonButton>
        </ArgonBox>
      }
    >
      <Card>
        <ArgonBox p={{ xs: 2, sm: 2.5, md: 3 }}>
          <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            <Grid item xs={12} md={8}>
              <ArgonInput
                fullWidth
                placeholder="Cari item, purpose, atau catatan..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <Select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
                  <MenuItem value="all">All Movements</MenuItem>
                  <MenuItem value="stock_in">Stock In</MenuItem>
                  <MenuItem value="stock_out">Stock Out</MenuItem>
                  <MenuItem value="adjustment">Adjustment</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </ArgonBox>

        <TableContainer sx={gaTableContainerSx}>
          <Table size="small" sx={gaWideTableSx}>
            <TableHead sx={gaTableHeadSx}>
              <TableRow>
                <TableCell sx={gaCompactCellSx}>Date</TableCell>
                <TableCell sx={gaNameCellSx}>Item</TableCell>
                <TableCell sx={gaCompactCellSx}>Movement</TableCell>
                <TableCell sx={gaCompactCellSx}>Quantity</TableCell>
                <TableCell sx={gaCompactCellSx}>Previous</TableCell>
                <TableCell sx={gaCompactCellSx}>Current</TableCell>
                <TableCell sx={gaNotesCellSx}>Purpose / Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMovements.map((movement) => {
                const item = inventory.find((entry) => entry.id === movement.itemId);
                return (
                  <TableRow key={movement.id} hover>
                    <TableCell sx={gaCompactCellSx}>{formatDate(movement.date)}</TableCell>
                    <TableCell sx={gaNameCellSx}>
                      <ArgonTypography variant="button" fontWeight="medium">
                        {item?.name || "-"}
                      </ArgonTypography>
                    </TableCell>
                    <TableCell sx={gaCompactCellSx}>
                      <StatusBadge
                        label={movementLabels[movement.type]}
                        color={movementColors[movement.type]}
                      />
                    </TableCell>
                    <TableCell sx={gaCompactCellSx}>
                      {formatMovementQuantity(movement, item?.unit || "")}
                    </TableCell>
                    <TableCell sx={gaCompactCellSx}>{movement.previousStock}</TableCell>
                    <TableCell sx={gaCompactCellSx}>{movement.currentStock}</TableCell>
                    <TableCell sx={gaNotesCellSx}>{getMovementDescription(movement)}</TableCell>
                  </TableRow>
                );
              })}
              {filteredMovements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <ArgonBox py={4}>Tidak ada movement yang sesuai filter.</ArgonBox>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <MovementDialog
        open={Boolean(dialogType)}
        type={dialogType || "stock_in"}
        onClose={() => setDialogType(null)}
        onSuccess={setSuccessMessage}
      />

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3500}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccessMessage("")}
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </PageShell>
  );
}

import PropTypes from "prop-types";

FieldLabel.propTypes = { children: PropTypes.node.isRequired };
FieldHint.propTypes = { children: PropTypes.node.isRequired, error: PropTypes.bool };
FieldHint.defaultProps = { error: false };
MovementDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(["stock_in", "stock_out", "adjustment"]).isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default StockMovementPage;
