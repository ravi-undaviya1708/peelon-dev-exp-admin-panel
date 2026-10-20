export const deliveriesColumns = [
  {
    key: "order_id",
    name: "Order ID",
  },
  {
    key: "product_name",
    name: "Product Name",
    renderFunction: (row) =>
      row?.product_name?.map((item) => item.product_name),
  },
  {
    key: "volume",
    name: "Quanity/Volume",
  },

  // {
  //   key: "date_of_order",
  //   name: "Order of Date",
  // },
  {
    key: "dispatched_date",
    name: "Dispatch Date",
  },
  {
    key: "delivered_date",
    name: "Delivery Date",
  },
  {
    key: "order_progress_status",
    name: "Delivery Status",
  },

  {
    key: "delivery_confirmed_by",
    name: "Delivery Confirmed By",
    renderFunction: (row) => row?.delivery_confirmed_by?.name,
  },
];

export const dispatchColumns = [
  {
    key: "order_id",
    name: "Order ID",
  },
  {
    key: "product_name",
    name: "Product Name",
    renderFunction: (row) =>
      row?.product_name?.map((item) => item.product_name),
  },
  {
    key: "volume",
    name: "Quanity/Volume",
  },

  // {
  //   key: "date_of_order",
  //   name: "Order of Date",
  // },
  {
    key: "dispatched_date",
    name: "Dispatch Date ",
  },
  {
    key: "expected_delivery_time",
    name: "Expected Delivery Date ",
  },
  {
    key: "tracking_id",
    name: " Tracking ID",
  },

  {
    key: "order_progress_status",
    name: "Dispatch Status",
  },

  {
    key: "dispatched_confirmed_by",
    name: "Dispatch Confirmed By",
    renderFunction: (row) => row?.dispatch_confirmed_by?.name,
  },
];
