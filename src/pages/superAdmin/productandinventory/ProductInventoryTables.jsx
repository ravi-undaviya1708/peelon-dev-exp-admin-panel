export const RawMaterialcolumns = [
  {key:"material_id",name:"Material ID"},
  {
    key: "warehouse",
    name: "WareHouse",
    renderFunction: (row) => {
      if (!row?.warehouse && !row?.warehouse_id) return "-";
      if (typeof row.warehouse === "object") {
        return row.warehouse?.location || row.warehouse?.name || "-";
      }
      return row.warehouse || "-";
    },
  },
  {
    key: "material_name",
    name: "Material Name",
  },
  {
    key: "code",
    name: "Code",
  },
  {
    key: "initial_volume",
    name: "Initial Volume",
  },
  {
    key: "volume_left",
    name: "Left Volume",
  },
  {
    key: "low_stock",
    name: "Low Stock",
  },

];

export const ProductSizeColumns = [
  {
    name: "Product Size",
    key: "size",
  },

  {
    name: "US Price (Per Box($))",
    key: "us_price",
  },

  {
    name: "Indian Price (Per Box(₹))",
    key: "india_price",
  }

]

export const inventoryColumns = [
  {
    key: "product",
    name: "Product Name",
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
  {
    key: "warehouse",
    name: "Ware House",
  },
  {
    key: "requirement_type",
    name: "Requirement Type",
  },
];

import { lazy,Suspense } from "react";
const DescriptionModal=lazy(()=>import("./modals/DescriptionModal"))
const ExpandableImageStack=lazy(()=>import("../../../components/ExpandableImageStack"))

export const productColumns = [
  {
    key: "images",
    name: "Images",
    renderFunction: (row) => {
      const imageKeys = ["image_1", "image_2", "image_3", "image_4"];
      const validImages = imageKeys.map((key) => row[key]).filter(Boolean);
      const imagesToShow = validImages.length > 0 ? validImages : null;
      return <Suspense fallback={null}>
        <ExpandableImageStack images={imagesToShow} />
      </Suspense>;
    },
  },

  {
    key: "product_name",
    name: "Name",
  },
  {
      key: "description",
      name: "Description",
      renderFunction: (row) =>
        <Suspense fallback={null}>
          <DescriptionModal row={row} />
        </Suspense>
    },
  // {
  //   key: "Ordered Date",
  //   name: "Sizes",
  // },
  // {
  //   key: "Volume",
  //   name: "Cost for 1 box",
  // },
  // {
  //   key: "Order Progress",
  //   name: "Default Boxes",
  // },
  // {
  //   key: "Order Order Tracking",
  //   name: "Sample",
  // },
  // {
  //   key: "Order Order Tracking",
  //   name: "Bulk Order",
  // },
  // {
  //   key: "Order Order Tracking",
  //   name: "Status",
  // },
];

