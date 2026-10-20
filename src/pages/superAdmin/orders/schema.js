import * as yup from "yup";

export const ordersValidation = yup.object().shape({
  date_of_order: yup.string().required("Order Date is required"),
  warehouse: yup.string().required("WareHouse is required"),
  volume: yup
    .number()
    .required("Volume is required")
    .typeError("Volume is required")
    .positive("Volume should be positive number"),
  description: yup.string().required("Description is required"),
  company: yup.string().required("Company Name is required"),
  total_amount: yup
    .string()
    .required("Total Amount is required")
    .test("is-valid-number", "Total Amount must be a valid number", (value) => {
      if (!value) return false;
      const numeric = value.replace(/[^\d.]/g, ""); 
      return !isNaN(numeric) && Number(numeric) > 0;
    })
    .test("is-positive", "Total Amount must be greater than 0", (value) => {
      if (!value) return false;
      const numeric = value.replace(/[^\d.]/g, "");
      return Number(numeric) > 0;
    }),
  order_type: yup.string().required("Order Type is required"),
  sales_representative: yup
    .string()
    .required("Sales Representative is required"),
  // address: yup.string().required(" Address is required"),
  product_name: yup.array().min(1, "Please select at least one product"),
  tracking_id: yup.string().required("Enter order tracking id"),
  products: yup.array().of(
    yup.object().shape({
      volume: yup
        .number()
        .typeError("Volume is required")
        .required("Volume is required")
        .positive("Volume must be positive"),
      size: yup.string().required("Size  is required"),
    }),
  ),
  invoice: yup.string().nullable().notRequired(),
  currency: yup.string().required("Currency is required"),
  shipping_charge: yup
    .number()
    .transform((value, originalValue) => (String(originalValue).trim() === "" ? 0 : value))
    .nullable()
    .notRequired()
    .typeError("Shipping Amount must be a number")
    .min(0, "Shipping Amount cannot be negative"),
});

export const orderStatusValidation = yup.object().shape({
  order_progress_status: yup.string().required("Status is required"),

  ...{
    dispatch_confirmed_by: yup.string().when("order_progress_status", {
      is: "dispatched",
      then: (schema) => schema.required("Confirmed By is required"),
    }),
    order_tracking: yup.string().when("order_progress_status", {
      is: "dispatched",
      then: (schema) => schema.required("Order Tracking is required"),
    }),
  },

  ...{
    delivery_confirmed_by: yup.string().when("order_progress_status", {
      is: "delivered",
      then: (schema) => schema.required("Confirmed By is required"),
    }),
  },
});

export const trackingIdValidation = yup.object().shape({
  tracking_id: yup.string().required("Enter order tracking id"),
});
