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

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import AppBar from "@mui/material/AppBar";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";

import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import Breadcrumbs from "examples/Breadcrumbs";
import {
  navbar,
  navbarContainer,
  navbarDesktopMenu,
  navbarMobileMenu,
  navbarRow,
} from "examples/Navbars/DashboardNavbar/styles";
import { setMiniSidenav, setTransparentNavbar, useArgonController } from "context";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useArgonController();
  const { miniSidenav, transparentNavbar, fixedNavbar } = controller;
  const route = useLocation().pathname.split("/").slice(1).filter(Boolean);

  useEffect(() => {
    setNavbarType(fixedNavbar ? "sticky" : "static");

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);

  return (
    <AppBar position={absolute ? "absolute" : navbarType} color="inherit" sx={(currentTheme) => navbar(currentTheme, { transparentNavbar, absolute, light })}>
      <Toolbar sx={(currentTheme) => navbarContainer(currentTheme, { navbarType })}>
        <ArgonBox color={light && transparentNavbar ? "white" : "dark"} minWidth={0} sx={(currentTheme) => navbarRow(currentTheme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1] || "dashboard"} route={route} light={transparentNavbar ? light : false} />
          <Icon fontSize="medium" sx={navbarDesktopMenu} onClick={handleMiniSidenav}>{miniSidenav ? "menu_open" : "menu"}</Icon>
        </ArgonBox>
        {isMini ? null : (
          <ArgonBox sx={(currentTheme) => navbarRow(currentTheme, { isMini })} justifyContent="flex-end">
            <ArgonBox display="flex" alignItems="center" color={light ? "white" : "dark"} flexShrink={0}>
              <IconButton size="small" color="inherit" sx={navbarMobileMenu} onClick={handleMiniSidenav}>
                <Icon>{miniSidenav ? "menu_open" : "menu"}</Icon>
              </IconButton>
              <Icon fontSize="small" sx={{ mr: { xs: 0, sm: 1 } }}>account_circle</Icon>
              <ArgonTypography
                variant="button"
                fontWeight="medium"
                color={light && transparentNavbar ? "white" : "dark"}
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                GA Admin
              </ArgonTypography>
            </ArgonBox>
          </ArgonBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = { absolute: false, light: true, isMini: false };
DashboardNavbar.propTypes = { absolute: PropTypes.bool, light: PropTypes.bool, isMini: PropTypes.bool };

export default DashboardNavbar;
