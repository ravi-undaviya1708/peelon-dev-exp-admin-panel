import * as yup from "yup";
export const quotationValidation = yup.object().shape({
  creator: yup.string().required("Creator is required"),
  validity: yup
    .string()
    .required("Validity is required")
    .test(
      "is-today-or-future",
      "Validity date cannot be in the past",
      (value) => {
        if (!value) return false;

        const selectedDate = new Date(value);
        const today = new Date();

        // Remove time portion for accurate date comparison
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        return selectedDate >= today;
      },
    ),
  volume: yup
    .number()
    .required("Volume is required")
    .positive("Volume must be positive")
    .typeError("Volume is required"),

  pricing: yup
    .number()
    .required("Pricing is requried")
    .positive("Pricing should be positive number")
    .typeError("Pricing is required"),
  product_ids: yup
    .array()
    .min(1, "Please select at least one interested product")
    .required("Product is required"),
  shipping_address: yup.string().required("Shipping Address is required"),
  billing_address: yup.string().required("Billing Address is required"),
  fob_pricing_terms: yup.string().required("FOB Pricing Terms is required"),
  description: yup.string().required("Description is required"),
  products: yup.array().of(
    yup.object().shape({
      quantity: yup
        .number()
        .typeError("Quantity is required")
        .required("Quantity is required")
        .positive("Quantity must be positive"),
      size: yup.string().required("Size  is required"),
      price: yup
        .number()
        .typeError("Price is required")
        .required("Price is required")
        .positive("Price must be positive"),
    }),
  ),
  currency: yup.string().required("Currency is required"),
});

export const purchaseOrderValidation = yup.object().shape({
  company: yup.string().required("Company is required"),
  date_of_release: yup
    .string()
    .required("Date of release is required")
    .test(
      "not-in-past",
      "Date of release cannot be earlier than today",
      function (value) {
        if (!value) return true;
        const releaseDate = new Date(value);
        const today = new Date();
        releaseDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        return releaseDate >= today;
      }
    ),
  po_excel: yup
    .mixed()
    .required("Quotation is required")
    .test("fileType", "Please select a valid file", (value) => {
      return value instanceof File || typeof value === "string";
    })
    .test("fileSize", "Quotation must be less than 2MB", (value) => {
      return value instanceof File ? value.size <= 2 * 1024 * 1024 : true;
    }),
});
