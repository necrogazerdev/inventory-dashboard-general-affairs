import { useLocation, useNavigate, useParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import ArgonBox from "components/ArgonBox";
import ArgonButton from "components/ArgonButton";
import ArgonTypography from "components/ArgonTypography";

import { useGAInventory } from "context/ga-inventory";
import PageShell from "domains/shared/PageShell";
import {
  gaCompactCellSx,
  gaNotesCellSx,
  gaTableContainerSx,
  gaTableHeadSx,
  gaTableSx,
} from "domains/shared/tableStyles";
import StatusBadge from "domains/shared/StatusBadge";
import {
  formatDate,
  formatMovementQuantity,
  getMovementDescription,
  getStockStatus,
  movementColors,
  movementLabels,
} from "domains/shared/inventoryHelpers";

function InfoBlock({ label, value }) {
  return (
    <ArgonBox mb={2}>
      <ArgonTypography variant="caption" color="text" textTransform="uppercase" fontWeight="bold">
        {label}
      </ArgonTypography>
      <ArgonTypography variant="button" fontWeight="medium" display="block" mt={0.5}>
        {value || "-"}
      </ArgonTypography>
    </ArgonBox>
  );
}

function InventoryDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { inventory, vendors, movements } = useGAInventory();
  const item = inventory.find((entry) => entry.id === id);
  const successMessage = location.state?.successMessage || "";

  const closeSuccessMessage = () => {
    navigate(location.pathname, { replace: true, state: null });
  };

  if (!item) {
    return (
      <PageShell title="Inventory Detail" description="Item tidak ditemukan.">
        <Card>
          <ArgonBox p={{ xs: 2, sm: 2.5, md: 3 }}>
            <ArgonButton onClick={() => navigate("/inventory")}>Back to Inventory</ArgonButton>
          </ArgonBox>
        </Card>
      </PageShell>
    );
  }

  const vendor = vendors.find((entry) => entry.id === item.vendorId);
  const status = getStockStatus(item);
  const itemMovements = movements.filter((movement) => movement.itemId === item.id).slice(0, 8);

  return (
    <PageShell
      title={item.name}
      description="Detail item dan histori pergerakan stok."
      actions={
        <ArgonBox
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={1}
          width={{ xs: "100%", sm: "auto" }}
        >
          <ArgonButton
            variant="outlined"
            color="white"
            sx={{ width: { xs: "100%", sm: "auto" } }}
            onClick={() => navigate("/inventory")}
          >
            Back
          </ArgonButton>
          <ArgonButton
            color="primary"
            sx={{ width: { xs: "100%", sm: "auto" } }}
            onClick={() => navigate(`/inventory/${item.id}/edit`)}
          >
            Edit Item
          </ArgonButton>
        </ArgonBox>
      }
    >
      <Grid container spacing={{ xs: 2, md: 3 }} mb={{ xs: 2, md: 3 }}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: "100%" }}>
            <ArgonBox p={{ xs: 2, sm: 2.5, md: 3 }}>
              <ArgonBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <ArgonTypography variant="h6">Item Information</ArgonTypography>
                <StatusBadge label={status.label} color={status.color} />
              </ArgonBox>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <InfoBlock label="Category" value={item.category} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoBlock label="Type" value={item.type} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoBlock label="Current Stock" value={`${item.stock} ${item.unit}`} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoBlock label="Minimum Stock" value={`${item.minimumStock} ${item.unit}`} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoBlock label="Vendor" value={vendor?.name || "-"} />
                </Grid>
                <Grid item xs={12}>
                  <InfoBlock label="Notes" value={item.notes} />
                </Grid>
              </Grid>
            </ArgonBox>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: "100%" }}>
            <ArgonBox p={{ xs: 2, sm: 2.5, md: 3 }}>
              <ArgonTypography variant="h6" mb={2}>
                Stock Summary
              </ArgonTypography>
              <ArgonTypography variant="h2" color={status.color} fontWeight="bold">
                {item.stock}
              </ArgonTypography>
              <ArgonTypography variant="button" color="text">
                {item.unit} tersedia
              </ArgonTypography>
              <ArgonBox mt={3} p={2} bgColor="grey-100" borderRadius="lg">
                <ArgonTypography variant="caption" color="text">
                  Minimum stock
                </ArgonTypography>
                <ArgonTypography variant="h6">
                  {item.minimumStock} {item.unit}
                </ArgonTypography>
              </ArgonBox>
            </ArgonBox>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <ArgonBox p={{ xs: 2, sm: 2.5, md: 3 }} pb={1}>
          <ArgonTypography variant="h6">Recent Stock Movement</ArgonTypography>
        </ArgonBox>
        <TableContainer sx={gaTableContainerSx}>
          <Table size="small" sx={gaTableSx}>
            <TableHead sx={gaTableHeadSx}>
              <TableRow>
                <TableCell sx={gaCompactCellSx}>Date</TableCell>
                <TableCell sx={gaCompactCellSx}>Type</TableCell>
                <TableCell sx={gaCompactCellSx}>Quantity</TableCell>
                <TableCell sx={gaCompactCellSx}>Stock</TableCell>
                <TableCell sx={gaNotesCellSx}>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itemMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell sx={gaCompactCellSx}>{formatDate(movement.date)}</TableCell>
                  <TableCell sx={gaCompactCellSx}>
                    <StatusBadge
                      label={movementLabels[movement.type]}
                      color={movementColors[movement.type]}
                    />
                  </TableCell>
                  <TableCell sx={gaCompactCellSx}>
                    {formatMovementQuantity(movement, item.unit)}
                  </TableCell>
                  <TableCell sx={gaCompactCellSx}>
                    {movement.previousStock} → {movement.currentStock}
                  </TableCell>
                  <TableCell sx={gaNotesCellSx}>{getMovementDescription(movement)}</TableCell>
                </TableRow>
              ))}
              {itemMovements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Belum ada movement.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3500}
        onClose={closeSuccessMessage}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={closeSuccessMessage}
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </PageShell>
  );
}

import PropTypes from "prop-types";
InfoBlock.propTypes = { label: PropTypes.string.isRequired, value: PropTypes.string };
InfoBlock.defaultProps = { value: "" };

export default InventoryDetailPage;
