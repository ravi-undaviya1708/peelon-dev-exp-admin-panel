import { lazy, Suspense } from "react";
const SummaryModal = lazy(() => import("./modals/SummaryModal"));
const InterstedProductModal = lazy(
  () => import("./modals/InterstedProductModal"),
);

export const dealColumns = [
  { key: "deal_id", name: "Deal ID" },
  {
    key: "converted_date",
    name: "Converted Date",
  },
  {
    key: "deal_owner_name",
    name: "Deal Owner",
  },

  {
    key: "deal_source",
    name: "Deal Source",
  },
  {
    key: "location",
    name: "Location",
  },
  {
    key: "value",
    name: "Value($)",
  },
  {
    key: "value_inr",
    name: "Value(₹)",
  },
  {
    key: "summary",
    name: "Summary",
    renderFunction: (row) => (
      <Suspense fallback={null}>
        <SummaryModal row={row} />
      </Suspense>
    ),
  },

  {
    key: "products",
    name: "Products of Interest",
    renderFunction: (row) => (
      <Suspense fallback={null}>
        <InterstedProductModal row={row} />
      </Suspense>
    ),
  },

  {
    key: "deal_stages",
    name: "Deal Stage",
  },

  {
    key: "exp_order_date",
    name: "Expected Order Date",
  },

  {
    key: "last_follow_up",
    name: "Last Follow Up Date",
  },
];
