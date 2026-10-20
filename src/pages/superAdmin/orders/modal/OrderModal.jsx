import React, { useEffect } from "react";
import { FormInput } from "../../../../components/input/FormInput";
import { set, useFieldArray, useForm } from "react-hook-form";
import { Box, Grid, Typography } from "@mui/material";
import { Label16 } from "../../../../components/StyledText";
import StyledModal from "../../../../components/StyledModal";
import { TextareaInput } from "../../../../components/input/TextareaInput";
import SingleSelect from "../../../../components/select/SingleSelect";
import useApiRequest from "../../../../hooks/useApiRequest";
import { ordersURLS } from "../../../../services/api/superadminApi";
import { yupResolver } from "@hookform/resolvers/yup";
import { ordersValidation } from "../schema";
import { toast } from "react-toastify";
import MulitiSelect from "../../../../components/select/MulitSelect";
import useFetchList from "../../../../hooks/useFetchList";

const initialOrderPayloads = {
  date_of_order: "",
  warehouse: "",
  volume: "",
  description: "",
  product_name: [],
  company: "",
  total_amount: "",
  shipping_charge: 0,
  order_type: "",
  sales_representative: "",
  tracking_id: "",
  currency: "INR",
  invoice: "",
  street: "",
  line: "",
  state: "",
  pincode: "",
  country: "",
  products: [],
};
function OrderModal({
  opened,
  onClose,
  selectedOrder = null,
  productsDropdownData,
  usersDropdownData,
  companiesDropdownData,
  warehousesDropdownData,
  refetchOrdersData,
  orderTypeDropdownData,
  invoiceDropdownData,
}) {
  const { post, put } = useApiRequest();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: initialOrderPayloads,
    resolver: yupResolver(ordersValidation),
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  useEffect(() => {
    if (selectedOrder) {
      reset({
        date_of_order: selectedOrder?.date_of_order ? selectedOrder.date_of_order.split("T")[0] : "",
        warehouse: selectedOrder?.warehouse?.id || selectedOrder?.warehouse || "",
        volume: selectedOrder?.volume || "",
        description: selectedOrder?.description || "",
        company: selectedOrder?.company?.id || selectedOrder?.company || "",
        total_amount: selectedOrder?.total_amount ? `${selectedOrder.total_amount} ${selectedOrder.currency || "INR"}` : "",
        shipping_charge: selectedOrder?.shipping_charge || 0,
        order_type: selectedOrder?.order_type || "",
        sales_representative: selectedOrder?.sales_representative?.id || selectedOrder?.sales_representative || "",
        tracking_id: selectedOrder?.tracking_id || "",
        currency: selectedOrder?.currency || "INR",
        invoice: selectedOrder?.invoice?.id || selectedOrder?.invoice || "",
        street: selectedOrder?.street || "",
        line: selectedOrder?.line || "",
        state: selectedOrder?.state || "",
        pincode: selectedOrder?.pincode || "",
        country: selectedOrder?.country || "",
        product_name: selectedOrder?.order_product?.map((p) => p.product?.id || p.product) || [],
        products: selectedOrder?.order_product?.map((p) => ({
          product: p.product?.id || p.product,
          volume: p.volume || "",
          size: p.size_of_product?.size || p.size || "",
          description: p.description || "",
        })) || [],
      });
    } else {
      reset(initialOrderPayloads);
    }
  }, [selectedOrder, reset]);

  const selectedProducts = watch("product_name");
  useEffect(() => {
    selectedProducts.forEach((p) => {
      if (!fields.find((f) => f.product === p)) {
        append({ product: p, volume: "", size: "" });
      }
    });
    for (let i = fields.length - 1; i >= 0; i--) {
      if (!selectedProducts.includes(fields[i].product)) {
        remove(i);
      }
    }
  }, [selectedProducts]);

  console.log("watch", watch());

  const currencyOptions = [
    { label: "USD", value: "USD" },
    { label: "INR", value: "INR" },
  ];
  const currency = watch("currency");
  const total_amount = watch("total_amount");

  useEffect(() => {
    const numericValue = total_amount?.replace(/[^\d.]/g, "");
    if (!numericValue) return;

    // Don't reformat if already formatted correctly
    const expected = `${Number(numericValue).toFixed(2)} ${currency} `;
    if (total_amount === expected) return;

    const timeout = setTimeout(() => {
      setValue(
        "total_amount",
        `${Number(numericValue).toFixed(2)} ${currency}`,
      );
    }, 800);
    return () => clearTimeout(timeout);
  }, [currency, total_amount]);

  const { postOrdersURL, createBulkOrderURL, getCountriesCodeURL } = ordersURLS;
  const { response: countriesData } = useFetchList(
    getCountriesCodeURL,
    {},
    true,
    { showLoader: false },
  );

  const countryCodeOptions =
    countriesData?.flatMap((c) => {
      const root = c?.idd?.root;
      const suffixes = c?.idd?.suffixes;
      const flag = c?.flags?.png;
      if (!root || !suffixes?.length || !flag) return [];

      return suffixes.map((s) => ({
        label: `${c.name.common} (${c.cca2})`,
        // value: `${root}${s}`,
        value: c.name.common,
        code: c.cca2,
        image: flag,
      }));
    }) ?? [];
  // console.log("coutneries", countryCodeOptions);
  // console.log(watch());

  const onSubmit = async (data) => {
    let response;
    if (selectedOrder?.id) {
      response = await put(`${ordersURLS.orderUpdateURL}/${selectedOrder.id}`, data);
    } else {
      response = await post(createBulkOrderURL, data);
    }
    if (response?.settings?.success) {
      toast.success(response.settings.message || (selectedOrder ? "Order updated successfully" : "Order created successfully"));
      onClose();
      refetchOrdersData();
    } else {
      toast.error(response?.settings?.message || "Operation failed");
    }
  };
  return (
    <StyledModal
      opened={opened}
      onClose={onClose}
      isSubmitting={isSubmitting}
      title={selectedOrder ? "Edit Order" : "Add Order"}
      buttonText={selectedOrder ? "Update Order" : "Add order"}
      formProps={{ onSubmit: handleSubmit(onSubmit) }}
    >
      <Box
        sx={{ maxHeight: "500px", overflowY: "scroll", scrollbarWidth: "none" }}
      >
        <Grid container spacing={2} sx={{ borderRadius: "30px" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Label16>Order Date</Label16>
            <FormInput control={control} name="date_of_order" type={"date"} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Label16>Company Name</Label16>
            <SingleSelect
              options={companiesDropdownData}
              control={control}
              name="company"
              placeholder={"Enter Company Name"}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Label16>warehouse Type</Label16>
            <SingleSelect
              control={control}
              options={warehousesDropdownData}
              name="warehouse"
              placeholder={"Select WareHouse"}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Label16>Invoice</Label16>
            <SingleSelect
              control={control}
              options={invoiceDropdownData}
              name="invoice"
              placeholder={"Select Invoice"}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Label16>Volume(Kgs)</Label16>
            <FormInput
              control={control}
              name="volume"
              placeholder={"Enter Volume"}
              type={"number"}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Label16>Currency</Label16>
            <SingleSelect
              control={control}
              name="currency"
              options={currencyOptions}
              placeholder={"Select currency"}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Label16>Total Amount({currency})</Label16>
            <FormInput
              control={control}
              name="total_amount"
              type={"text"}
              placeholder={"Enter Total Amount"}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Label16>Shipping Amount({currency || "INR"})</Label16>
            <FormInput
              control={control}
              name="shipping_charge"
              type={"number"}
              placeholder={"Enter Shipping Amount"}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Label16>Order Type</Label16>
            <SingleSelect
              options={orderTypeDropdownData}
              control={control}
              name="order_type"
              placeholder={"Select Order Type"}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Label16>Sales representative</Label16>
            <SingleSelect
              options={usersDropdownData}
              control={control}
              name="sales_representative"
              placeholder={"Select Sales Representative"}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Label16>Tracking ID</Label16>
            <FormInput
              control={control}
              name="tracking_id"
              placeholder={"Enter Tracking ID"}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Label16>Product Name</Label16>
            <MulitiSelect
              options={productsDropdownData}
              control={control}
              name="product_name"
              placeholder={"Select Product Name"}
            />
          </Grid>

          <Box>
            <Grid container spacing={2}>
              {fields.map((field, index) => (
                <React.Fragment key={field.id}>
                  <Grid size={{ xs: 12 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mt: 1 }}
                    >
                      Product {index + 1}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormInput
                      control={control}
                      type={"number"}
                      name={`products.${index}.volume`}
                      placeholder="Enter Volume(in kgs)"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormInput
                      control={control}
                      type={"text"}
                      name={`products.${index}.size`}
                      placeholder="Enter Size(in cms)"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <TextareaInput
                      control={control}
                      type={"text"}
                      name={`products.${index}.description`}
                      placeholder="Enter description"
                    />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </Box>

          <Grid size={{ xs: 12 }}>
            <Label16>Description</Label16>
            <TextareaInput
              control={control}
              name="description"
              placeholder="Enter Description"
            />
          </Grid>
          <Label16 sx={{ mb: 1 }}>Address</Label16>

          <Grid container spacing={2}>
            {/* Street */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Label16>Street</Label16>
              <TextareaInput
                control={control}
                name="street"
                placeholder="Enter Street"
              />
            </Grid>

            {/* Address Line */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Label16>Address Line</Label16>
              <TextareaInput
                control={control}
                name="line"
                placeholder="Enter Address Line"
              />
            </Grid>

            {/* State */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Label16>State</Label16>
              <FormInput
                control={control}
                type="text"
                name="state"
                placeholder="Enter State"
              />
            </Grid>

            {/* Pincode */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Label16>Pincode</Label16>
              <FormInput
                control={control}
                type="number"
                name="pincode"
                placeholder="Enter Pincode"
              />
            </Grid>

            {/* Country */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Label16>Country</Label16>
              <SingleSelect
                control={control}
                options={countryCodeOptions}
                name="country"
                placeholder="Select Country"
              />
            </Grid>
          </Grid>

          {/* <Grid size={{ xs: 12 }}>
            <Label16>Address</Label16>
            <TextareaInput
              control={control}
              name="address"
              placeholder={"Enter Address"}
            />
          </Grid> */}
        </Grid>
      </Box>
    </StyledModal>
  );
}

export default OrderModal;
