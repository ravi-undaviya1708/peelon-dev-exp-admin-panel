import { lazy, Suspense } from "react";
const InterstedProductModal = lazy(
  () => import("./modals/InterstedProductModal"),
);
const SummaryModal = lazy(() => import("./modals/SummaryModal"));
const TrailDataModal = lazy(() => import("./modals/TrailDataModal"));

export const LeadColumns = [
  { key: "lead_id", name: "Lead ID" },
  {
    key: "lead_name",
    name: "Lead Name",
  },

  {
    key: "last_follow_up",
    name: "Previous Follow Up",
  },

  {
    key: "next_follow_up",
    name: "Next Follow Up",
  },

  {
    key: "lead_source",
    name: "Source",
  },

  {
    key: "location",
    name: "Location",
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
    key: "trail_data",
    name: "Trial Data",
    renderFunction: (row) => (
      <Suspense fallback={null}>
        <TrailDataModal row={row} />
      </Suspense>
    ),
  },

  {
    key: "lead_stage",
    name: "Stage",
  },

  {
    key: "products",
    name: "Interested Product",
    renderFunction: (row) => (
      <Suspense fallback={null}>
        <InterstedProductModal row={row} />
      </Suspense>
    ),
  },

  {
    key: "assigned_sales_representative",
    name: "Assigned To",
  },
];
