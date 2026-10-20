import { Box, Typography } from "@mui/material";
import { lazy, Suspense } from "react";
const NotesModal = lazy(() => import("./modals/NotesModal.jsx"));
const LocationModal = lazy(() => import("./modals/LocationModal.jsx"));
const DescriptionModal = lazy(() => import("./modals/DescriptionModal.jsx"));
const AnnualContractDetailsModal=lazy(()=>import("./modals/AnnualContractDetailsModal.jsx"))

export const manualColumns = [

  {
    key: "company_id",
    name: "Company ID"

  },

  {
    key: "name_of_poc",
    name: "Name of PoC",
  },

  {
    key: "mobile",
    name: "Phone no",
  },

  {
    key: "location",
    name: "Location",
  },


  {
    key: "company_name",
    name: "Company",
  },


  {
    key: "company_types",
    name: "City&Location",
    renderFunction: (row) => <Suspense fallback={null}>
      <Box>
        <Typography>{row?.city}</Typography>
        <LocationModal row={row} />
      </Box>
    </Suspense>
  },

  {
    key: "annual_contract_details",
    name: "Annual Contract Details",
    renderFunction: (row) => <Suspense fallback={null}>
      <Box>
        <AnnualContractDetailsModal row={row} />
      </Box>
    </Suspense>
  },

  {
    key: "company_type",
    name: "Type",
  },

  {
    key: "notes",
    name: "Notes ",
    renderFunction: (row) => <Suspense fallback={null}>
      <NotesModal row={row} />
    </Suspense>

  },
  {
    key: "email",
    name: "Mail ID",
  },


];


export const websiteColumns = [

  {
    key: "company_id",
    name: "Company ID"

  },

  {
    key: "name_of_poc",
    name: "Name",
  },
  {
    key: "mobile",
    name: "Phone no",
  },
  {
    key: "location",
    name: "Location",
  },
  {
    key: "email",
    name: "Email",
  },
  {
    key: "description",
    name: "Message",
    renderFunction: (row) => <Suspense fallback={null}>
      <DescriptionModal row={row} />
    </Suspense>

  }

];

export const orderHistroy = [
  {
    key: "order_id",
    name: "Order ID",
  },

  {
    key: "total_amount",
    name: "Total Amount",
  },
  {
    key: "volume",
    name: "Volume",
  },
  {
    key: "warehouse",
    name: "Warehouse",
  },
  // {
  //   key:"delivery_address",
  //   name:"Delivery Address",
  // },
  {
    key: "order_type",
    name: "Order Type",
  },
  {
    key: "date_of_order",
    name: "Date of Order",
  },
  {
    key: "order_progress_status",
    name: "Status",
    renderFunction: (row) => row?.order_progress_status?.order_value
  }
]


