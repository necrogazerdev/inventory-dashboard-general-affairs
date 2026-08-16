const gaTableContainerSx = ({ palette }) => ({
  width: "100%",
  maxWidth: "100%",
  overflowX: "auto",
  WebkitOverflowScrolling: "touch",
  overscrollBehaviorX: "contain",
  borderTop: `1px solid ${palette.grey[200]}`,
  scrollbarWidth: "thin",
});

const gaTableSx = ({ palette, breakpoints }) => ({
  minWidth: 680,
  [breakpoints.up("md")]: {
    minWidth: 760,
  },
  "& .MuiTableCell-root": {
    padding: "11px 12px",
    verticalAlign: "middle",
    borderBottom: `1px solid ${palette.grey[200]}`,
    fontSize: "0.8125rem",
    lineHeight: 1.45,
    [breakpoints.up("sm")]: {
      padding: "12px 14px",
      fontSize: "0.84375rem",
    },
    [breakpoints.up("md")]: {
      padding: "14px 18px",
      fontSize: "0.875rem",
    },
  },
  "& .MuiTableBody-root .MuiTableRow-root": {
    transition: "background-color 160ms ease",
  },
  "& .MuiTableBody-root .MuiTableRow-root:hover": {
    backgroundColor: palette.grey[100],
  },
  "& .MuiTableBody-root .MuiTableRow-root:last-of-type .MuiTableCell-root": {
    borderBottom: 0,
  },
});

const gaWideTableSx = (theme) => ({
  ...gaTableSx(theme),
  minWidth: 880,
  [theme.breakpoints.up("md")]: {
    minWidth: 980,
  },
});

const gaTableHeadSx = ({ palette }) => ({
  display: "table-header-group !important",
  "& .MuiTableCell-root": {
    backgroundColor: palette.grey[100],
    color: palette.dark.main,
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.02em",
    lineHeight: 1.4,
    whiteSpace: "nowrap",
    borderBottom: `1px solid ${palette.grey[200]}`,
  },
});

const gaNameCellSx = {
  minWidth: { xs: 150, sm: 170, md: 180 },
};

const gaCompactCellSx = {
  whiteSpace: "nowrap",
};

const gaNotesCellSx = {
  minWidth: { xs: 190, sm: 210, md: 220 },
  maxWidth: 360,
  whiteSpace: "normal",
};

const gaActionCellSx = {
  width: { xs: 120, sm: 140, md: 150 },
  minWidth: { xs: 120, sm: 140, md: 150 },
  whiteSpace: "nowrap",
};

export {
  gaActionCellSx,
  gaCompactCellSx,
  gaNameCellSx,
  gaNotesCellSx,
  gaTableContainerSx,
  gaTableHeadSx,
  gaTableSx,
  gaWideTableSx,
};
