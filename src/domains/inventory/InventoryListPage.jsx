import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
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

import categories from "data/categories";
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
import StatusBadge from "domains/shared/StatusBadge";
import { getStockStatus } from "domains/shared/inventoryHelpers";

function InventoryListPage() {
  const navigate = useNavigate();
  const { inventory, vendors } = useGAInventory();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");

  const filteredInventory = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return inventory.filter((item) => {
      const matchesSearch = !keyword || item.name.toLowerCase().includes(keyword);
      const matchesCategory = category === "all" || item.category === category;
      const matchesType = type === "all" || item.type === type;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [inventory, search, category, type]);

  const vendorName = (vendorId) => vendors.find((vendor) => vendor.id === vendorId)?.name || "-";

  return (
    <PageShell
      title="Inventory"
      description="Kelola seluruh barang inventaris kantor dalam satu tempat."
      actions={<ArgonButton color="primary" onClick={() => navigate("/inventory/new")}>+ Add Item</ArgonButton>}
    >
      <Card>
        <ArgonBox p={{ xs: 2, sm: 2.5, md: 3 }}>
          <Grid container spacing={{ xs: 1.5, sm: 2 }} alignItems="center">
            <Grid item xs={12} md={6} lg={5}>
              <ArgonInput
                fullWidth
                placeholder="Cari nama item..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={4}>
              <FormControl fullWidth size="small">
                <Select value={category} onChange={(event) => setCategory(event.target.value)}>
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map((entry) => <MenuItem key={entry} value={entry}>{entry}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <FormControl fullWidth size="small">
                <Select value={type} onChange={(event) => setType(event.target.value)}>
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="Consumable">Consumable</MenuItem>
                  <MenuItem value="Asset">Asset</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </ArgonBox>

        <TableContainer sx={gaTableContainerSx}>
          <Table size="small" sx={gaTableSx}>
            <TableHead sx={gaTableHeadSx}>
              <TableRow>
                <TableCell sx={gaNameCellSx}>Item</TableCell>
                <TableCell>Category</TableCell>
                <TableCell sx={gaCompactCellSx}>Type</TableCell>
                <TableCell sx={gaCompactCellSx}>Stock</TableCell>
                <TableCell sx={gaCompactCellSx}>Status</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell align="right" sx={gaActionCellSx}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventory.map((item) => {
                const status = getStockStatus(item);
                return (
                  <TableRow key={item.id} hover>
                    <TableCell sx={gaNameCellSx}>
                      <ArgonTypography variant="button" fontWeight="medium">{item.name}</ArgonTypography>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell sx={gaCompactCellSx}>{item.type}</TableCell>
                    <TableCell sx={gaCompactCellSx}>{item.stock} {item.unit}</TableCell>
                    <TableCell sx={gaCompactCellSx}><StatusBadge label={status.label} color={status.color} /></TableCell>
                    <TableCell>{vendorName(item.vendorId)}</TableCell>
                    <TableCell align="right" sx={gaActionCellSx}>
                      <ArgonBox display="flex" justifyContent="flex-end" alignItems="center" gap={0.5}>
                        <ArgonButton
                          size="small"
                          variant="text"
                          color="info"
                          sx={{ minWidth: 0, px: 1 }}
                          onClick={() => navigate(`/inventory/${item.id}`)}
                        >
                          Detail
                        </ArgonButton>
                        <ArgonButton
                          size="small"
                          variant="text"
                          color="dark"
                          sx={{ minWidth: 0, px: 1 }}
                          onClick={() => navigate(`/inventory/${item.id}/edit`)}
                        >
                          Edit
                        </ArgonButton>
                      </ArgonBox>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <ArgonBox py={4}>
                      <ArgonTypography variant="button" color="text">Tidak ada item yang sesuai filter.</ArgonTypography>
                    </ArgonBox>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </PageShell>
  );
}

export default InventoryListPage;
