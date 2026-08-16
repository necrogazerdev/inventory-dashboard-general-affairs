import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
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
  gaActionCellSx,
  gaCompactCellSx,
  gaNameCellSx,
  gaTableContainerSx,
  gaTableHeadSx,
  gaTableSx,
} from "domains/shared/tableStyles";

function VendorListPage() {
  const navigate = useNavigate();
  const { vendors, inventory } = useGAInventory();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return vendors.filter((vendor) => !keyword || vendor.name.toLowerCase().includes(keyword) || vendor.contactPerson.toLowerCase().includes(keyword));
  }, [vendors, search]);

  return (
    <PageShell
      title="Vendors"
      description="Daftar vendor yang memasok kebutuhan inventaris kantor."
      actions={<ArgonButton color="primary" onClick={() => navigate("/vendors/new")}>+ Add Vendor</ArgonButton>}
    >
      <Card>
        <ArgonBox p={3} maxWidth="600px"><ArgonInput fullWidth placeholder="Cari vendor atau contact person..." value={search} onChange={(event) => setSearch(event.target.value)} /></ArgonBox>
        <TableContainer sx={gaTableContainerSx}>
          <Table size="small" sx={gaTableSx}>
            <TableHead sx={gaTableHeadSx}><TableRow><TableCell sx={gaNameCellSx}>Vendor</TableCell><TableCell>Contact Person</TableCell><TableCell sx={gaCompactCellSx}>Phone / WhatsApp</TableCell><TableCell sx={gaCompactCellSx}>Items Supplied</TableCell><TableCell align="right" sx={gaActionCellSx}>Action</TableCell></TableRow></TableHead>
            <TableBody>
              {filtered.map((vendor) => {
                const itemCount = inventory.filter((item) => item.vendorId === vendor.id).length;
                return (
                  <TableRow key={vendor.id} hover>
                    <TableCell sx={gaNameCellSx}><ArgonTypography variant="button" fontWeight="medium">{vendor.name}</ArgonTypography></TableCell>
                    <TableCell>{vendor.contactPerson || "-"}</TableCell>
                    <TableCell sx={gaCompactCellSx}>{vendor.phone || "-"}</TableCell>
                    <TableCell sx={gaCompactCellSx}>{itemCount} item</TableCell>
                    <TableCell align="right" sx={gaActionCellSx}>
                      <ArgonBox display="flex" justifyContent="flex-end" alignItems="center" gap={0.5}>
                        <ArgonButton variant="text" color="info" size="small" sx={{ minWidth: 0, px: 1 }} onClick={() => navigate(`/vendors/${vendor.id}`)}>Detail</ArgonButton>
                        <ArgonButton variant="text" color="dark" size="small" sx={{ minWidth: 0, px: 1 }} onClick={() => navigate(`/vendors/${vendor.id}/edit`)}>Edit</ArgonButton>
                      </ArgonBox>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 ? <TableRow><TableCell colSpan={5} align="center"><ArgonBox py={4}>Vendor tidak ditemukan.</ArgonBox></TableCell></TableRow> : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </PageShell>
  );
}

export default VendorListPage;
