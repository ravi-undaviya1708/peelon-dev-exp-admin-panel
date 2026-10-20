import * as yup from "yup";

export const productInventoryValidation = yup.object().shape({
  product: yup.string().required("Product Name is required"),
  volume: yup
    .number()
    .typeError("Invalid Number")
    .required("Volume is required"),
  batch_number: yup.string().required("Batch number is required"),
  date_of_manufacture: yup.string().required("Manufacture Date is required"),
  size_of_product: yup.string().required("Size of Product is required"),
  warehouse: yup.string().required("Warehouse Type is required"),
  requirement_type: yup.string().required("Requirement Type is required"),
});

export const productValidation = yup.object().shape({
  image_1: yup
    .mixed()
    .required("At least one image is required")
    .test("fileType", "Please select a valid image file", (value) => {
      return value instanceof File || typeof value === "string";
    })
    .test("fileSize", "Image 1must be less than 2MB", (value) => {
      return value instanceof File ? value.size <= 2 * 1024 * 1024 : true;
    }),
  image_2: yup
    .mixed()
    .nullable()
    .test("fileType", "Please select a valid image file", (value) => {
      return !value || value instanceof File || typeof value === "string";
    })
    .test("fileSize", "Image 2 must be less than 2MB", (value) => {
      return (
        !value || (value instanceof File ? value.size <= 2 * 1024 * 1024 : true)
      );
    }),
  image_3: yup
    .mixed()
    .nullable()
    .test("fileType", "Please select a valid image file", (value) => {
      return !value || value instanceof File || typeof value === "string";
    })
    .test("fileSize", "Image 3 must be less than 2MB", (value) => {
      return (
        !value || (value instanceof File ? value.size <= 2 * 1024 * 1024 : true)
      );
    }),
  image_4: yup
    .mixed()
    .nullable()
    .test("fileType", "Please select a valid image file", (value) => {
      return !value || value instanceof File || typeof value === "string";
    })
    .test("fileSize", "Image 4 must be less than 2MB", (value) => {
      return (
        !value || (value instanceof File ? value.size <= 2 * 1024 * 1024 : true)
      );
    }),

  product_type: yup.string().required("Product Type is required"),
  product_name: yup.string().required("Product Name is required"),
  product_description: yup.string().required("Product Description is required"),
});

export const rawMaterialValidation = yup.object().shape({
  warehouse: yup.string().required("Warehouse is required"),
  material_name: yup.string().required("Material Name is required"),
  code: yup.string().required("Code is required"),
  initial_volume: yup
    .string()
    .required("Initial Volume is required")
    .test(
      "is-valid-integer",
      "Initial Volume must be a valid integer",
      (val) => {
        if (!val) return false;
        const trimmed = String(val).trim();
        return /^\d+$/.test(trimmed) && Number(trimmed) > 0;
      }
    ),
  volume_left: yup
    .string()
    .required("Volume left is required")
    .test(
      "is-valid-integer",
      "Volume left must be a valid integer",
      (val) => {
        if (!val) return false;
        const trimmed = String(val).trim();
        return /^\d+$/.test(trimmed) && Number(trimmed) >= 0;
      }
    ),
  low_stock: yup
    .number()
    .required("Low stock is required")
    .positive("Stock should be postive")
    .typeError("Stock is required"),
});

export const productSizeValidation = yup.object().shape({
  size: yup.string().required("Size  Of Product is required"),
  india_price: yup
    .number()
    .required("Indian Price is required")
    .positive("Price should be positive")
    .typeError("Indian Price is required"),
  us_price: yup
    .number()
    .required("US Price is required")
    .positive("Price should be positive")
    .typeError("US Price is required"),
});
