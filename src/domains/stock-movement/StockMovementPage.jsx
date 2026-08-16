import { useMemo, useState } from "react";

import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

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
  gaTableSx,
  gaWideTableSx,
} from "domains/shared/tableStyles";
import StatusBadge from "domains/shared/StatusBadge";
import { formatDate, movementColors, movementLabels } from "domains/shared/inventoryHelpers";

const today = new Date().toISOString().slice(0, 10);

function MovementDialog({ open, type, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { inventory, vendors, createMovement } = useGAInventory();
  const [form, setForm] = useState({ itemId: "", quantity: "", date: today, vendorId: "", purpose: "", notes: "" });
  const [error, setError] = useState("");
  const selectedItem = inventory.find((item) => item.id === form.itemId);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const closeDialog = () => {
    setForm({ itemId: "", quantity: "", date: today, vendorId: "", purpose: "", notes: "" });
    setError("");
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    try {
      createMovement({ ...form, type });
      closeDialog();
    } catch (err) {
      setError(err.message);
    }
  };

  const title = movementLabels[type] || "Stock Movement";
  const quantityLabel = type === "adjustment" ? "New Stock *" : "Quantity *";

  return (
    <Dialog open={open} onClose={closeDialog} fullWidth fullScreen={isMobile} maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <ArgonBox component="form" pt={1} onSubmit={handleSubmit}>
          {error ? <ArgonBox mb={2} p={1.5} bgColor="error" borderRadius="lg"><ArgonTypography variant="button" color="white">{error}</ArgonTypography></ArgonBox> : null}
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <ArgonTypography variant="caption" fontWeight="bold" color="text" display="block" mb={0.75}>Item *</ArgonTypography>
              <FormControl fullWidth size="small">
                <Select value={form.itemId} onChange={update("itemId")} displayEmpty>
                  <MenuItem value="" disabled>Select item</MenuItem>
                  {inventory.map((item) => <MenuItem key={item.id} value={item.id}>{item.name} — {item.stock} {item.unit}</MenuItem>)}
                </Select>
              </FormControl>
              {selectedItem ? <ArgonTypography variant="caption" color="text">Current stock: {selectedItem.stock} {selectedItem.unit}</ArgonTypography> : null}
            </Grid>
            <Grid item xs={12} sm={6}>
              <ArgonTypography variant="caption" fontWeight="bold" color="text" display="block" mb={0.75}>{quantityLabel}</ArgonTypography>
              <ArgonInput fullWidth type="number" min="0" value={form.quantity} onChange={update("quantity")} />
              {type === "adjustment" ? <ArgonTypography variant="caption" color="text">Masukkan jumlah stock yang seharusnya setelah stock opname.</ArgonTypography> : null}
            </Grid>
            <Grid item xs={12} sm={6}>
              <ArgonTypography variant="caption" fontWeight="bold" color="text" display="block" mb={0.75}>Date</ArgonTypography>
              <ArgonInput fullWidth type="date" value={form.date} onChange={update("date")} />
            </Grid>
            {type === "stock_in" ? (
              <Grid item xs={12}>
                <ArgonTypography variant="caption" fontWeight="bold" color="text" display="block" mb={0.75}>Vendor</ArgonTypography>
                <FormControl fullWidth size="small"><Select value={form.vendorId} onChange={update("vendorId")}><MenuItem value="">No Vendor</MenuItem>{vendors.map((vendor) => <MenuItem key={vendor.id} value={vendor.id}>{vendor.name}</MenuItem>)}</Select></FormControl>
              </Grid>
            ) : null}
            {type !== "stock_in" ? (
              <Grid item xs={12}>
                <ArgonTypography variant="caption" fontWeight="bold" color="text" display="block" mb={0.75}>Purpose / Used For</ArgonTypography>
                <ArgonInput fullWidth value={form.purpose} onChange={update("purpose")} placeholder="Contoh: Warehouse Team / Pantry / Stock Opname" />
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <ArgonTypography variant="caption" fontWeight="bold" color="text" display="block" mb={0.75}>Notes</ArgonTypography>
              <ArgonInput fullWidth multiline rows={3} value={form.notes} onChange={update("notes")} placeholder="Catatan movement..." />
            </Grid>
          </Grid>
          <ArgonBox
            display="flex"
            flexDirection={{ xs: "column-reverse", sm: "row" }}
            justifyContent="flex-end"
            gap={1}
            mt={3}
          >
            <ArgonButton sx={{ width: { xs: "100%", sm: "auto" } }} type="button" variant="outlined" color="secondary" onClick={closeDialog}>Cancel</ArgonButton>
            <ArgonButton sx={{ width: { xs: "100%", sm: "auto" } }} type="submit" color={movementColors[type] || "primary"}>Save {title}</ArgonButton>
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

  const filteredMovements = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return movements.filter((movement) => {
      const item = inventory.find((entry) => entry.id === movement.itemId);
      const matchesSearch = !keyword || item?.name.toLowerCase().includes(keyword) || movement.notes.toLowerCase().includes(keyword);
      const matchesType = typeFilter === "all" || movement.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [movements, inventory, search, typeFilter]);

  return (
    <PageShell
      title="Stock Movement"
      description="Catat stock masuk, keluar, dan koreksi tanpa mengedit stock langsung."
      actions={
        <ArgonBox display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={1} flexWrap="wrap" width={{ xs: "100%", sm: "auto" }}>
          <ArgonButton sx={{ width: { xs: "100%", sm: "auto" } }} color="success" onClick={() => setDialogType("stock_in")}>+ Stock In</ArgonButton>
          <ArgonButton sx={{ width: { xs: "100%", sm: "auto" } }} color="error" onClick={() => setDialogType("stock_out")}>- Stock Out</ArgonButton>
          <ArgonButton sx={{ width: { xs: "100%", sm: "auto" } }} variant="outlined" color="white" onClick={() => setDialogType("adjustment")}>Adjust</ArgonButton>
        </ArgonBox>
      }
    >
      <Card>
        <ArgonBox p={{ xs: 2, sm: 2.5, md: 3 }}>
          <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            <Grid item xs={12} md={8}>
              <ArgonInput fullWidth placeholder="Cari item atau catatan..." value={search} onChange={(event) => setSearch(event.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small"><Select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><MenuItem value="all">All Movements</MenuItem><MenuItem value="stock_in">Stock In</MenuItem><MenuItem value="stock_out">Stock Out</MenuItem><MenuItem value="adjustment">Adjustment</MenuItem></Select></FormControl>
            </Grid>
          </Grid>
        </ArgonBox>

        <TableContainer sx={gaTableContainerSx}>
          <Table size="small" sx={gaWideTableSx}>
            <TableHead sx={gaTableHeadSx}>
              <TableRow><TableCell sx={gaCompactCellSx}>Date</TableCell><TableCell sx={gaNameCellSx}>Item</TableCell><TableCell sx={gaCompactCellSx}>Movement</TableCell><TableCell sx={gaCompactCellSx}>Quantity</TableCell><TableCell sx={gaCompactCellSx}>Previous</TableCell><TableCell sx={gaCompactCellSx}>Current</TableCell><TableCell sx={gaNotesCellSx}>Purpose / Notes</TableCell></TableRow>
            </TableHead>
            <TableBody>
              {filteredMovements.map((movement) => {
                const item = inventory.find((entry) => entry.id === movement.itemId);
                const qtyPrefix = movement.type === "stock_in" ? "+" : movement.type === "stock_out" ? "-" : "±";
                return (
                  <TableRow key={movement.id} hover>
                    <TableCell sx={gaCompactCellSx}>{formatDate(movement.date)}</TableCell>
                    <TableCell sx={gaNameCellSx}><ArgonTypography variant="button" fontWeight="medium">{item?.name || "-"}</ArgonTypography></TableCell>
                    <TableCell sx={gaCompactCellSx}><StatusBadge label={movementLabels[movement.type]} color={movementColors[movement.type]} /></TableCell>
                    <TableCell sx={gaCompactCellSx}>{qtyPrefix}{movement.quantity} {item?.unit || ""}</TableCell>
                    <TableCell sx={gaCompactCellSx}>{movement.previousStock}</TableCell>
                    <TableCell sx={gaCompactCellSx}>{movement.currentStock}</TableCell>
                    <TableCell sx={gaNotesCellSx}>{movement.purpose || movement.notes || "-"}</TableCell>
                  </TableRow>
                );
              })}
              {filteredMovements.length === 0 ? <TableRow><TableCell colSpan={7} align="center"><ArgonBox py={4}>Tidak ada movement yang sesuai filter.</ArgonBox></TableCell></TableRow> : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <MovementDialog open={Boolean(dialogType)} type={dialogType || "stock_in"} onClose={() => setDialogType(null)} />
    </PageShell>
  );
}

import PropTypes from "prop-types";
MovementDialog.propTypes = { open: PropTypes.bool.isRequired, type: PropTypes.oneOf(["stock_in", "stock_out", "adjustment"]).isRequired, onClose: PropTypes.func.isRequired };

export default StockMovementPage;
