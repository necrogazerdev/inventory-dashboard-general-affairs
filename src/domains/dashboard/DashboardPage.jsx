import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import DetailedStatisticsCard from "examples/Cards/StatisticsCards/DetailedStatisticsCard";

import categories from "data/categories";
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
import {
  formatDate,
  getStockStatus,
  isLowStock,
  movementColors,
  movementLabels,
} from "domains/shared/inventoryHelpers";

function DashboardPage() {
  const { inventory, vendors, movements } = useGAInventory();
  const lowStockItems = inventory.filter(isLowStock);
  const assetCount = inventory.filter((item) => item.type === "Asset").reduce((total, item) => total + Number(item.stock || 0), 0);

  const categorySummary = categories.map((category) => {
    const items = inventory.filter((item) => item.category === category);
    return {
      category,
      count: items.length,
      stock: items.reduce((total, item) => total + Number(item.stock || 0), 0),
    };
  });
  const maxCategoryCount = Math.max(...categorySummary.map((item) => item.count), 1);

  const getItem = (itemId) => inventory.find((item) => item.id === itemId);

  return (
    <PageShell
      title="GA Inventory Dashboard"
      description="Ringkasan kondisi stok dan aktivitas inventaris kantor."
    >
      <Grid container spacing={{ xs: 2, md: 3 }} mb={{ xs: 2, md: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <DetailedStatisticsCard
            title="total items"
            count={inventory.length}
            icon={{ color: "info", component: <i className="ni ni-box-2" /> }}
            percentage={{ color: "info", count: "Master", text: "inventory aktif" }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DetailedStatisticsCard
            title="low stock"
            count={lowStockItems.length}
            icon={{ color: "warning", component: <i className="ni ni-bell-55" /> }}
            percentage={{
              color: lowStockItems.length > 0 ? "warning" : "success",
              count: lowStockItems.length > 0 ? "Perlu" : "Aman",
              text: lowStockItems.length > 0 ? "segera dicek" : "stok terkendali",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DetailedStatisticsCard
            title="total assets"
            count={assetCount}
            icon={{ color: "success", component: <i className="ni ni-laptop" /> }}
            percentage={{ color: "success", count: "Unit", text: "asset tercatat" }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <DetailedStatisticsCard
            title="vendors"
            count={vendors.length}
            icon={{ color: "primary", component: <i className="ni ni-building" /> }}
            percentage={{ color: "info", count: "Aktif", text: "vendor terdaftar" }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2, md: 3 }} mb={{ xs: 2, md: 3 }}>
        <Grid item xs={12} lg={7}>
          <Card sx={{ height: "100%" }}>
            <ArgonBox p={{ xs: 2, sm: 2.5, md: 3 }}>
              <ArgonTypography variant="h6" fontWeight="medium">
                Inventory Overview
              </ArgonTypography>
              <ArgonTypography variant="button" color="text">
                Sebaran item berdasarkan kategori.
              </ArgonTypography>

              <ArgonBox mt={3}>
                {categorySummary.map((entry) => (
                  <ArgonBox key={entry.category} mb={2.5}>
                    <ArgonBox display="flex" justifyContent="space-between" mb={0.75}>
                      <ArgonTypography variant="button" fontWeight="medium">
                        {entry.category}
                      </ArgonTypography>
                      <ArgonTypography variant="caption" color="text">
                        {entry.count} item
                      </ArgonTypography>
                    </ArgonBox>
                    <LinearProgress
                      variant="determinate"
                      value={(entry.count / maxCategoryCount) * 100}
                      sx={{ height: 7, borderRadius: 4 }}
                    />
                  </ArgonBox>
                ))}
              </ArgonBox>
            </ArgonBox>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card sx={{ height: "100%" }}>
            <ArgonBox p={{ xs: 2, sm: 2.5, md: 3 }}>
              <ArgonTypography variant="h6" fontWeight="medium">
                Low Stock Items
              </ArgonTypography>
              <ArgonTypography variant="button" color="text">
                Item yang sudah menyentuh minimum stock.
              </ArgonTypography>

              <ArgonBox mt={2}>
                {lowStockItems.length === 0 ? (
                  <ArgonTypography variant="button" color="text">
                    Semua stok masih aman.
                  </ArgonTypography>
                ) : (
                  lowStockItems.slice(0, 6).map((item) => {
                    const status = getStockStatus(item);
                    return (
                      <ArgonBox
                        key={item.id}
                        py={1.5}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={1.5}
                        sx={({ palette: { light } }) => ({ borderBottom: `1px solid ${light.main}` })}
                      >
                        <ArgonBox>
                          <ArgonTypography variant="button" fontWeight="medium" display="block">
                            {item.name}
                          </ArgonTypography>
                          <ArgonTypography variant="caption" color="text">
                            {item.stock} {item.unit} / min. {item.minimumStock}
                          </ArgonTypography>
                        </ArgonBox>
                        <StatusBadge label={status.label} color={status.color} />
                      </ArgonBox>
                    );
                  })
                )}
              </ArgonBox>
            </ArgonBox>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <ArgonBox p={{ xs: 2, sm: 2.5, md: 3 }} pb={1}>
          <ArgonTypography variant="h6" fontWeight="medium">
            Recent Stock Movement
          </ArgonTypography>
          <ArgonTypography variant="button" color="text">
            Aktivitas stok terbaru.
          </ArgonTypography>
        </ArgonBox>
        <TableContainer sx={gaTableContainerSx}>
          <Table size="small" sx={gaTableSx}>
            <TableHead sx={gaTableHeadSx}>
              <TableRow>
                <TableCell sx={gaCompactCellSx}>Tanggal</TableCell>
                <TableCell sx={gaNameCellSx}>Item</TableCell>
                <TableCell sx={gaCompactCellSx}>Movement</TableCell>
                <TableCell sx={gaCompactCellSx}>Qty</TableCell>
                <TableCell sx={gaCompactCellSx}>Stock</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movements.slice(0, 6).map((movement) => {
                const item = getItem(movement.itemId);
                return (
                  <TableRow key={movement.id} hover>
                    <TableCell sx={gaCompactCellSx}>{formatDate(movement.date)}</TableCell>
                    <TableCell sx={gaNameCellSx}>{item?.name || "Item tidak ditemukan"}</TableCell>
                    <TableCell sx={gaCompactCellSx}>
                      <StatusBadge
                        label={movementLabels[movement.type] || movement.type}
                        color={movementColors[movement.type] || "info"}
                      />
                    </TableCell>
                    <TableCell sx={gaCompactCellSx}>
                      {movement.type === "stock_in" ? "+" : movement.type === "stock_out" ? "-" : "±"}
                      {movement.quantity} {item?.unit || ""}
                    </TableCell>
                    <TableCell sx={gaCompactCellSx}>
                      {movement.previousStock} → {movement.currentStock}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </PageShell>
  );
}

export default DashboardPage;
