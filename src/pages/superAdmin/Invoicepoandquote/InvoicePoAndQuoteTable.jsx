import { lazy, Suspense } from "react";
const InterstedProductModal = lazy(
  () => import("./modal/InterestedProductsModal"),
);
const AddressModal = lazy(() => import("./modal/AdrdessModal"));
const FilePreviewModal = lazy(() => import("./modal/FilePreviewModal"));
import { invoiceURLS } from "../../../services/api/superadminApi";
import { fileDownload } from "../../../hooks/fileDownload";
import { PrimaryButton } from "../../../components/StyledButtons";
import { Link } from "@mui/material";
const { downloadQuotationURL } = invoiceURLS;

export const quotationColumns = [
  {
    name: "Quote No ",
    key: "quote_no",
  },

  {
    name: "Creator",
    key: "creator",
  },

  {
    name: "Validity",
    key: "validity",
  },
  {
    name: "Volume",
    key: "volume",
  },
  {
    name: "Pricing($)",
    key: "pricing",
  },
  {
    name: "Pricing(₹)",
    key: "pricing_inr",
  },

  {
    key: "products",
    name: "Products",
    renderFunction: (row) => (
      <Suspense fallback={null}>
        <InterstedProductModal row={row} />
      </Suspense>
    ),
  },

  {
    name: "Billing & Shipping",
    key: "shipping_address",
    renderFunction: (row) => (
      <Suspense fallback={null}>
        <AddressModal
          row={row?.shipping_address}
          heading={"Billing & Shipping Address"}
        />
      </Suspense>
    ),
  },

  {
    name: "FOB Pricing &Terms",
    key: "fob_pricing_terms",
    renderFunction: (row) => (
      <Suspense fallback={null}>
        <AddressModal
          row={row?.fob_pricing_terms}
          heading={"FOB Pricing &Terms"}
        />
      </Suspense>
    ),
  },

  {
    name: "Description",
    key: "description",
    renderFunction: (row) => (
      <Suspense fallback={null}>
        <AddressModal row={row?.description} heading={"Description"} />
      </Suspense>
    ),
  },

  {
    name: "Quotation",
    key: "quotation",
    renderFunction: (row) => {
      return (
        <Link
          href={row?.pdf_preview_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#23A75B", cursor: "pointer" }}
        >
          View
        </Link>
      );
    },
  },
];

// export const purchaseOrderColumns = [
//   {
//     name: "Quote No ",
//     key: "quote_no",
//   },

//   {
//     name: "Creator",
//     key: "creator"
//   },

//   {
//     name: "Validity",
//     key: "validity",
//   },
//   {
//     name: "Volume",
//     key: "volume",
//   },
//   {
//     name: "Pricing($)",
//     key: "pricing",
//   },
//   {
//     name: "Pricing(₹)",
//     key: "pricing_inr",
//   },
//   {
//     key: "products",
//     name: "Products",
//     renderFunction: (row) => <Suspense fallback={null}>
//       <InterstedProductModal row={row} />
//     </Suspense>
//   },

//   {
//     name: "Billing & Shipping",
//     key: "shipping_address",
//     renderFunction: (row) => <Suspense fallback={null}>
//       <AddressModal row={row?.shipping_address} heading={"Billing & Shipping Address"} />
//     </Suspense>
//   },

//   {
//     name: "FOB Pricing &Terms",
//     key: "fob_pricing_terms",
//     renderFunction: (row) => <Suspense fallback={null}>
//       <AddressModal row={row?.fob_pricing_terms} heading={"FOB Pricing &Terms"} />
//     </Suspense>
//   },

//   {
//     name: "Description",
//     key: "description",
//     renderFunction: (row) => <Suspense fallback={null}>
//       <AddressModal row={row?.description} heading={"Description"} />
//     </Suspense>
//   },

// ]

export const purchaseOrderColumns = [
  {
    key: "po_excel",
    name: "Quotation",
    renderFunction: (row) => (
      <Suspense fallback={null}>
        <FilePreviewModal row={row?.po_excel} heading={"Quotation"} />
      </Suspense>
    ),
  },

  {
    key: "date_of_release",
    name: "Date of Release",
  },

  {
    key: "company",
    name: "Company Name",
  },
];

// export const InvoiceColumns = [
//   {
//     name: "Quote No ",
//     key: "quote_no",
//   },

//   {
//     name: "Creator",
//     key: "creator"
//   },

//   {
//     name: "Validity",
//     key: "validity",
//   },
//   {
//     name: "Volume",
//     key: "volume",
//   },
//   {
//     name: "Pricing($)",
//     key: "pricing",
//   },
//   {
//     name: "Pricing(₹)",
//     key: "pricing_inr",
//   },
//   {
//     key: "products",
//     name: "Products",
//     renderFunction: (row) => <Suspense fallback={null}>
//       <InterstedProductModal row={row} />
//     </Suspense>
//   },

//   {
//     name: "Billing & Shipping",
//     key: "shipping_address",
//     renderFunction: (row) => <Suspense fallback={null}>
//       <AddressModal row={row?.shipping_address} heading={"Billing & Shipping Address"} />
//     </Suspense>
//   },

//   {
//     name: "FOB Pricing &Terms",
//     key: "fob_pricing_terms",
//     renderFunction: (row) => <Suspense fallback={null}>
//       <AddressModal row={row?.fob_pricing_terms} heading={"FOB Pricing &Terms"} />
//     </Suspense>
//   },

//   {
//     name: "Description",
//     key: "description",
//     renderFunction: (row) => <Suspense fallback={null}>
//       <AddressModal row={row?.description} heading={"Description"} />
//     </Suspense>
//   },

//   {
//     name: "Invoice",
//     key: "invoice",
//     renderFunction: (row) => {
//       const quotationDownload = async (invoiceId) => {
//         await fileDownload(`${downloadInvoiceURL}/${invoiceId}`);
//       };

//       return (
//         <PrimaryButton
//           onClick={() => invoiceDownload(row.id)}
//         >
//           Download
//         </PrimaryButton>
//       );
//     }
//   }

// ];

export const InvoiceColumns = [
  {
    key: "po_excel",
    name: "Invoice",
    renderFunction: (row) => (
      <Suspense fallback={null}>
        <FilePreviewModal row={row?.po_excel} heading={"Quotation"} />
      </Suspense>
    ),
  },

  {
    key: "date_of_release",
    name: "Date of Release",
  },

  {
    key: "company",
    name: "Company Name",
  },
];
