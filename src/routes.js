/**
=========================================================
* Argon Dashboard 2 MUI - v3.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-material-ui
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import ArgonBox from "components/ArgonBox";

import DashboardPage from "domains/dashboard/DashboardPage";
import InventoryListPage from "domains/inventory/InventoryListPage";
import InventoryDetailPage from "domains/inventory/InventoryDetailPage";
import InventoryFormPage from "domains/inventory/InventoryFormPage";
import StockMovementPage from "domains/stock-movement/StockMovementPage";
import VendorListPage from "domains/vendors/VendorListPage";
import VendorDetailPage from "domains/vendors/VendorDetailPage";
import VendorFormPage from "domains/vendors/VendorFormPage";

const routes = [
  {
    type: "route",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <ArgonBox component="i" color="primary" fontSize="14px" className="ni ni-tv-2" />,
    component: <DashboardPage />,
  },
  {
    type: "route",
    name: "Inventory",
    key: "inventory",
    route: "/inventory",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-box-2" />,
    component: <InventoryListPage />,
  },
  {
    type: "route",
    name: "Stock Movement",
    key: "stock-movements",
    route: "/stock-movements",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-curved-next" />,
    component: <StockMovementPage />,
  },
  {
    type: "route",
    name: "Vendors",
    key: "vendors",
    route: "/vendors",
    icon: <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-building" />,
    component: <VendorListPage />,
  },

  // Hidden routes: registered in React Router but intentionally not shown in the sidenav.
  { type: "hidden", key: "inventory-new", route: "/inventory/new", component: <InventoryFormPage /> },
  { type: "hidden", key: "inventory-detail", route: "/inventory/:id", component: <InventoryDetailPage /> },
  { type: "hidden", key: "inventory-edit", route: "/inventory/:id/edit", component: <InventoryFormPage /> },
  { type: "hidden", key: "vendor-new", route: "/vendors/new", component: <VendorFormPage /> },
  { type: "hidden", key: "vendor-detail", route: "/vendors/:id", component: <VendorDetailPage /> },
  { type: "hidden", key: "vendor-edit", route: "/vendors/:id/edit", component: <VendorFormPage /> },
];

export default routes;
