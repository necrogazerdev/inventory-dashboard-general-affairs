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

import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import List from "@mui/material/List";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import SidenavItem from "examples/Sidenav/SidenavItem";
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";
import { setMiniSidenav, useArgonController } from "context";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useArgonController();
  const { miniSidenav, darkSidenav, layout } = controller;
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("xl"));
  const location = useLocation();
  const itemName = location.pathname.split("/").slice(1)[0];

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
    }

    window.addEventListener("resize", handleMiniSidenav);
    handleMiniSidenav();
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  const renderRoutes = routes.map(({ type, name, icon, title, key, route }) => {
    if (type === "route") {
      return (
        <NavLink to={route} key={key}>
          <SidenavItem name={name} icon={icon} active={key === itemName} />
        </NavLink>
      );
    }

    if (type === "title") {
      return (
        <ArgonTypography
          key={key}
          color={darkSidenav ? "white" : "dark"}
          display="block"
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          opacity={0.6}
          pl={3}
          mt={2}
          mb={1}
          ml={1}
        >
          {title}
        </ArgonTypography>
      );
    }

    if (type === "divider") return <Divider key={key} light={darkSidenav} />;
    return null;
  });

  return (
    <SidenavRoot
      {...rest}
      variant={isDesktop ? "permanent" : "temporary"}
      open={isDesktop || !miniSidenav}
      onClose={closeSidenav}
      ModalProps={{ keepMounted: true }}
      ownerState={{ darkSidenav, miniSidenav, layout }}
    >
      <ArgonBox pt={3} pb={1} px={4} textAlign="center">
        <ArgonBox display={{ xs: "block", xl: "none" }} position="absolute" top={0} right={0} p={1.625} onClick={closeSidenav} sx={{ cursor: "pointer" }}>
          <ArgonTypography variant="h6" color="secondary"><Icon sx={{ fontWeight: "bold" }}>close</Icon></ArgonTypography>
        </ArgonBox>
        <ArgonBox component={NavLink} to="/dashboard" display="flex" alignItems="center">
          <ArgonBox
            component="img"
            src={brand}
            alt="GA Inventory"
            width="2.25rem"
            height="2.25rem"
            mr={1}
            sx={{ objectFit: "contain" }}
          />
          <ArgonBox width={!brandName ? "100%" : undefined} sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}>
            <ArgonTypography component="h6" variant="button" fontWeight="medium" color={darkSidenav ? "white" : "dark"}>{brandName}</ArgonTypography>
          </ArgonBox>
        </ArgonBox>
      </ArgonBox>
      <Divider light={darkSidenav} />
      <List>{renderRoutes}</List>
    </SidenavRoot>
  );
}

Sidenav.defaultProps = { color: "info" };
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string.isRequired,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
