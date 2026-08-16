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

// react-router-dom components
import { useLocation } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";

// Argon Dashboard 2 MUI context
import { useArgonController, setLayout } from "context";

function DashboardLayout({ children }) {
  const [controller, dispatch] = useArgonController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname]);


  return (
    <ArgonBox
      sx={({ breakpoints, transitions, palette, functions: { pxToRem } }) => ({
        px: { xs: 1.5, sm: 2, md: 3 },
        py: { xs: 1.5, sm: 2, md: 3 },
        minWidth: 0,
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
        backgroundColor: palette.background.default,

        [breakpoints.up("xl")]: {
          marginLeft: miniSidenav ? pxToRem(120) : pxToRem(274),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
    >
      <ArgonBox position="relative" zIndex={1}>
        {children}
      </ArgonBox>
    </ArgonBox>
  );
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
