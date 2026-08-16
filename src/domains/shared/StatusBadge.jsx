import PropTypes from "prop-types";
import ArgonBadge from "components/ArgonBadge";

function StatusBadge({ label, color }) {
  return <ArgonBadge variant="contained" color={color} size="sm" badgeContent={label} container />;
}

StatusBadge.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]).isRequired,
};

export default StatusBadge;
