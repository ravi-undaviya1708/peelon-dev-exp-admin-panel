export const inventoryColumns = [

    {
        key: "product",
        name: "Product Name",
    },
    {
        key:"warehouse",
        name:"Warehouse"
    },
    {
        key: "volume",
        name: "Volume",
    },
    {
        key: "batch_number",
        name: "Batch no",
    },
    {
        key: "date_of_manufacture",
        name: "Manufacture Date",
    },
    {
        key: "size_of_product",
        name: "Size of the product",
    },

];

export const orderColumns = [

    {
        name: "Order ID",
        key: "order_id",
    },
    {
        name: "Total Amount($)",
        key: "total_amount",
    },
    {
        name: "Volume",
        key: "volume",
    },
    {
        name: "Date Of Order",
        key: "date_of_order",
    },
    //  {
    //     name: "Warehouse Location",
    //     key: "warehouse",
    // },
    {
        name: "Order Type",
        key: "order_type",
    },
    {
        name: "Order Progress",
        key: "order_progress_status",
        renderFunction: (row) => row?.order_progress_status?.order_value
    },
    {
        name: "Status",
        key: "payment_status",
        renderFunction: (row) => {
            const status = row.payment_status?.toLowerCase();

            let color = "";
            switch (status) {
                case "success":
                    color = "green";
                    break;
                case "pending":
                    color = "orange";
                    break;
                case "cancel":
                case "cancelled":
                    color = "red";
                    break;
                default:
                    color = "#666";
            }

            return (
                <span style={{ color, fontWeight: 600, textTransform: "capitalize" }}>
                    {status || "N/A"}
                </span>
            );
        },
    }

];