export const factctoryDashboardColumns = [
    {
        key: "order_id",
        name: "Order ID",
    },
    {
        key: "date_of_order",
        name: "Order Date",
        renderFunction: (row) => new Date(row.date_of_order).toLocaleString(),
    },
    {
        key: "order_type",
        name: "Order Type",
    },
    {
        key: "payment_status",
        name: "Payment Status",
        renderFunction: (row) => row.payment_status?.toUpperCase(),
    },
    {
        key: "order_tracking",
        name: "Tracking",
        renderFunction: (row) => row.order_tracking ?? "-",
    },
    {
        key: "order_progress_status",
        name: "Progress Status",
    },
    {
        key: "address",
        name: "Address",
        renderFunction: (row) => row.address?.address

    },
    {
        key: "total_amount",
        name: "Total Amount",
        renderFunction: (row) => `₹${row.total_amount}`,
    },
    {
        key: "user",
        name: "User",
    },
];
