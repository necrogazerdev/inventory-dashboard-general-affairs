import PropTypes from "prop-types";

import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function PageShell({ title, description, actions, children }) {
  return (
    <DashboardLayout>
      <DashboardNavbar light={false} />
      <ArgonBox py={{ xs: 2, sm: 2.5, md: 3 }} position="relative">
        <ArgonBox
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          gap={{ xs: 1.5, md: 2 }}
          mb={{ xs: 2, md: 3 }}
        >
          <ArgonBox minWidth={0}>
            <ArgonTypography
              variant="h4"
              color="dark"
              fontWeight="bold"
              sx={{ fontSize: { xs: "1.35rem", sm: "1.5rem", md: "1.625rem" }, lineHeight: 1.25 }}
            >
              {title}
            </ArgonTypography>
            {description ? (
              <ArgonTypography
                variant="button"
                color="secondary"
                opacity={0.8}
                display="block"
                mt={0.5}
                sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem" }, lineHeight: 1.5 }}
              >
                {description}
              </ArgonTypography>
            ) : null}
          </ArgonBox>
          {actions ? (
            <ArgonBox
              width={{ xs: "100%", md: "auto" }}
              sx={{
                "& > .MuiButton-root": {
                  width: { xs: "100%", sm: "auto" },
                },
              }}
            >
              {actions}
            </ArgonBox>
          ) : null}
        </ArgonBox>
        {children}
      </ArgonBox>
    </DashboardLayout>
  );
}

PageShell.defaultProps = {
  description: "",
  actions: null,
};

PageShell.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actions: PropTypes.node,
  children: PropTypes.node.isRequired,
};

export default PageShell;
