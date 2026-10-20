import { Link } from "react-router-dom";

export const salesRepresentative = [
  {
    key: "full_name",
    name: "Sale Representative Name",
  },

  {
    key: "total_orders",
    name: "Total Orders",
  },

  {
    key: "sale_value",
    name: "Sale Value",
  },
  {
    name: "View",
    renderFunction: (row) => (
      <Link
        to="../accounts/edit-staff"
        state={{ staffId: row?.id }}
        style={{
          color: "#23A75B",
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        View
      </Link>
    ),
  },
];

export const factoryMember = [
  {
    key: "full_name",
    name: "Factory Member Name",
  },

  {
    key: "total_orders",
    name: "Total Orders",
  },

  {
    key: "sale_value",
    name: "Sale Value",
  },
  {
    name: "View",
    renderFunction: (row) => (
      <Link
        to="../accounts/edit-staff"
        state={{ staffId: row?.id }}
        style={{
          color: "#23A75B",
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        View
      </Link>
    ),
  },
];
