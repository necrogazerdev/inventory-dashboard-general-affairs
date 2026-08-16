import { useNavigate, useParams } from "react-router-dom";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
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
  gaNameCellSx,
  gaTableContainerSx,
  gaTableHeadSx,
  gaTableSx,
} from "domains/shared/tableStyles";
import StatusBadge from "domains/shared/StatusBadge";
import { getStockStatus } from "domains/shared/inventoryHelpers";

function VendorDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { vendors, inventory } = useGAInventory();
  const vendor = vendors.find((entry) => entry.id === id);

  if (!vendor) {
    return <PageShell title="Vendor Detail" description="Vendor tidak ditemukan."><Card><ArgonBox p={{ xs: 2, sm: 2.5, md: 3 }}><ArgonButton onClick={() => navigate("/vendors")}>Back to Vendors</ArgonButton></ArgonBox></Card></PageShell>;
  }

  const suppliedItems = inventory.filter((item) => item.vendorId === vendor.id);

  return (
    <PageShell
      title={vendor.name}
      description="Detail vendor dan barang yang dipasok."
      actions={<ArgonBox display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={1} width={{ xs: "100%", sm: "auto" }}><ArgonButton sx={{ width: { xs: "100%", sm: "auto" } }} variant="outlined" color="white" onClick={() => navigate("/vendors")}>Back</ArgonButton><ArgonButton sx={{ width: { xs: "100%", sm: "auto" } }} color="primary" onClick={() => navigate(`/vendors/${vendor.id}/edit`)}>Edit Vendor</ArgonButton></ArgonBox>}
    >
      <Grid container spacing={{ xs: 2, md: 3 }} mb={{ xs: 2, md: 3 }}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: "100%" }}>
            <ArgonBox p={{ xs: 2, sm: 2.5, md: 3 }}>
              <ArgonTypography variant="h6" mb={3}>Vendor Information</ArgonTypography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}><ArgonTypography variant="caption" color="text">CONTACT PERSON</ArgonTypography><ArgonTypography variant="button" fontWeight="medium" display="block">{vendor.contactPerson || "-"}</ArgonTypography></Grid>
                <Grid item xs={12} sm={6}><ArgonTypography variant="caption" color="text">PHONE / WHATSAPP</ArgonTypography><ArgonTypography variant="button" fontWeight="medium" display="block">{vendor.phone || "-"}</ArgonTypography></Grid>
                <Grid item xs={12}><ArgonTypography variant="caption" color="text">ADDRESS</ArgonTypography><ArgonTypography variant="button" fontWeight="medium" display="block">{vendor.address || "-"}</ArgonTypography></Grid>
                <Grid item xs={12}><ArgonTypography variant="caption" color="text">NOTES</ArgonTypography><ArgonTypography variant="button" fontWeight="medium" display="block">{vendor.notes || "-"}</ArgonTypography></Grid>
              </Grid>
            </ArgonBox>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: "100%" }}><ArgonBox p={{ xs: 2, sm: 2.5, md: 3 }}><ArgonTypography variant="caption" color="text">ITEMS SUPPLIED</ArgonTypography><ArgonTypography variant="h2" color="info" fontWeight="bold" mt={1}>{suppliedItems.length}</ArgonTypography><ArgonTypography variant="button" color="text">item inventory terhubung</ArgonTypography></ArgonBox></Card>
        </Grid>
      </Grid>

      <Card>
        <ArgonBox p={{ xs: 2, sm: 2.5, md: 3 }} pb={1}><ArgonTypography variant="h6">Supplied Items</ArgonTypography></ArgonBox>
        <TableContainer sx={gaTableContainerSx}><Table size="small" sx={gaTableSx}><TableHead sx={gaTableHeadSx}><TableRow><TableCell sx={gaNameCellSx}>Item</TableCell><TableCell>Category</TableCell><TableCell sx={gaCompactCellSx}>Type</TableCell><TableCell sx={gaCompactCellSx}>Stock</TableCell><TableCell sx={gaCompactCellSx}>Status</TableCell></TableRow></TableHead><TableBody>{suppliedItems.map((item) => { const status = getStockStatus(item); return <TableRow key={item.id} hover onClick={() => navigate(`/inventory/${item.id}`)} sx={{ cursor: "pointer" }}><TableCell sx={gaNameCellSx}>{item.name}</TableCell><TableCell>{item.category}</TableCell><TableCell sx={gaCompactCellSx}>{item.type}</TableCell><TableCell sx={gaCompactCellSx}>{item.stock} {item.unit}</TableCell><TableCell sx={gaCompactCellSx}><StatusBadge label={status.label} color={status.color} /></TableCell></TableRow>; })}{suppliedItems.length === 0 ? <TableRow><TableCell colSpan={5} align="center"><ArgonBox py={4}>Belum ada item yang terhubung ke vendor ini.</ArgonBox></TableCell></TableRow> : null}</TableBody></Table></TableContainer>
      </Card>
    </PageShell>
  );
}

export default VendorDetailPage;
