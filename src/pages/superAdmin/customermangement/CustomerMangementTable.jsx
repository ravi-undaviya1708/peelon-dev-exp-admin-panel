import { lazy, Suspense } from "react";
const DescriptionModal = lazy(() => import("./DescriptionModal"));

export const customerColumns = [
  { key: "customer_id", name: "Customer ID" },
  {
    key: "image",
    name: "Image",
    renderFunction: (row) => {
      return (
        <img
          src={row.image}
          alt="Image"
          width={100}
          height="50px"
          style={{
            mixBlendMode: "multiply",
            borderRadius: "8px",
            objectFit: "cover",
          }}
        />
      );
    },
  },
  {
    key: "full_name",
    name: "Name",
  },
  {
    key: "email",
    name: "Email ID",
  },

  {
    key: "mobile",
    name: "Phone Number",
  },
];

export const bulkOrdersRequestsColumns = [
  {key:"bulk_order_id",name:"Bulk Order ID"},
  {
    key: "image",
    name: "Image",
    renderFunction: (row) => {
      return (
        <img
          src={row?.customer_details?.image}
          alt="Image"
          width={100}
          height="50px"
          style={{
            mixBlendMode: "multiply",
            borderRadius: "8px",
            objectFit: "cover",
          }}
        />
      );
    },
  },

  {
    key: "full_name",
    name: "Name",
    renderFunction: (row) => row?.customer_details?.full_name,
  },
  {
    key: "email",
    name: "Email ID",
    renderFunction: (row) => row?.customer_details?.email,
  },

  {
    key: "mobile",
    name: "Phone Number",
    renderFunction: (row) => row?.customer_details?.mobile,
  },

  {
    key: "product_name",
    name: "Product Name",
  },

  {
    key: "description",
    name: "Description",
    renderFunction: (row) => (
      <Suspense fallback={null}>
        <DescriptionModal row={row} />
      </Suspense>
    ),
  },

  {
    key: "assigned_to",
    name: "Assigned To",
    renderFunction: (row) => row?.sales_representative?.name,
  },
];
