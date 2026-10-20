import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Breadcrumbs,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { FormInput } from "../../../components/input/FormInput";
import { InputLabel16, Label16 } from "../../../components/StyledText";
import { PrimaryButton } from "../../../components/StyledButtons";
import {
  accountsPathConstants,
  customerPathConstants,
  deliveryDispatchPathConstants,
  factoryPathConstants,
  salesRepresentativePathConstants,
  superAdminPathConstants,
  warehouseManagerPathConstants,
} from "../../../constants/pathConstants";
import { StyledCircularProgress } from "../../../components/StyleCircularProgrerss";
import { colors } from "../../../constants/constants";
import { TextareaInput } from "../../../components/input/TextareaInput";
import useFetchDropdown from "../../../hooks/useFetchDropdown";
import SingleSelect from "../../../components/select/SingleSelect";
import MulitiSelect from "../../../components/select/MulitSelect";
import { invoiceURLS } from "../../../services/api/superadminApi";
import { initialPayloads } from "./initiaPayloads";
import useApiRequest from "../../../hooks/useApiRequest";
import useFetchList from "../../../hooks/useFetchList";
import { mapApiDataToForm } from "../../../hooks/mapApiDataToForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { quotationValidation, purchaseOrderValidation } from "./schema";
import { useSelector } from "react-redux";
import Loader from "../../../components/loader/Loader";
import { MultiImageUploadController } from "../../../components/image/MulitImageUpload";
import { useMulitImageArray } from "../../../hooks/useMultiImageArray";
import * as yup from "yup";
import React from "react";
import { PlusCircleIcon } from "lucide-react";
import { Delete } from "@mui/icons-material";

function Quotation() {
  const isLoading = useSelector((state) => state.loader.isLoading);
  const location = useLocation();
  const navigate = useNavigate();
  const { post, put, filePost, filePut } = useApiRequest();
  const { status, id, from } = location?.state || {};
  // console.log("selectedTab", status, id);
  const userType = useSelector((state) => state.auth.userType);
  const pathConstantsByRole = {
    "Super Admin": superAdminPathConstants,
    "Factory Operation": factoryPathConstants,
    "Sales Representative": salesRepresentativePathConstants,
    "Delivery & Dispatch": deliveryDispatchPathConstants,
    "Warehouse Manager": warehouseManagerPathConstants,
    Accounts: accountsPathConstants,
    Customer: customerPathConstants,
  };

  const getSchema = (status) => {
    switch (status) {
      case "quotation":
        return quotationValidation;
      case "purchase order":
        return purchaseOrderValidation;
      case "invoice":
        return purchaseOrderValidation;
      default:
        return yup.object();
    }
  };

  const currencyOptions = [
    { label: "USD", value: "USD" },
    { label: "INR", value: "INR" },
  ];
  const pathConstants = pathConstantsByRole[userType];
  const { DEFAULT, DASHBOARD, INVOICEPOANDQUOTE } = pathConstants;
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: { isSubmitting, isDirty, errors, isSubmitted },
  } = useForm({
    defaultValues: initialPayloads,
    mode: "onSubmit",
    resolver: yupResolver(getSchema(status?.toLowerCase())),
  });
  const files = ["po_excel"];
  // console.log("errors",errors);
  // console.log("formFields", watch());

  const getStatusFieldName = (tab) => {
    switch (tab) {
      case "quotation":
        return "quotation";
      case "purchase order":
        return "purchase_order";
      case "invoice":
        return "invoice";
      default:
        return "";
    }
  };

  const getFrom = (from) => {
    switch (from) {
      case "editQuatation":
        return "Edit Quatation";
      case "editPurchaseOrder":
        return "Edit Purchase Order";
      case "editInvoice":
        return "Edit Invoice";
      default:
        return "";
    }
  };

  const fieldName = getStatusFieldName(status?.toLowerCase());
  const edit = getFrom(from);
  const {
    usersDropdownURL,
    productsDropdownURL,
    postQuotationURL,
    putQuotationURL,
    qutoationDetailURL,
    companiesDropdownURL,
  } = invoiceURLS;
  const { data: usersDropdownData } = useFetchDropdown(
    usersDropdownURL,
    "full_name",
    "id",
  );
  const { data: ProductDropdownData } = useFetchDropdown(
    productsDropdownURL,
    "product_name",
    "id",
  );
  const { data: prefetchData } = useFetchList(
    `${qutoationDetailURL}/${id}`,
    {},
    !!id,
  );
  const { data: companiesDropdownData } = useFetchDropdown(
    companiesDropdownURL,
    "company_name",
    "id",
  );

  useEffect(() => {
    if (id) {
      const formValues = mapApiDataToForm(initialPayloads, prefetchData);
      reset({
        ...formValues,
        creator: prefetchData?.creator?.id,
        company: prefetchData?.company?.id,
        product_ids:
          prefetchData?.products?.length > 0
            ? prefetchData?.products?.map((product) => product?.product_id)
            : [],
        products:
          prefetchData?.products?.map((p) => ({
            product: p.product_id,
            size: p.size,
            price: p.price,
            quantity: p.quantity,
          })) || [],
      });
    }
  }, [prefetchData]);

  const { handleAddImage, handleDeleteImage } = useMulitImageArray(
    files,
    getValues,
    setValue,
  );

  const onSubmit = async (data) => {
    if (fieldName !== "purchase_order" && fieldName !== "invoice") {
      let payload = {};
      for (const field in data) {
        let value = data[field];
        if (value !== "" && value !== null && value !== undefined) {
          payload[field] = value;
        }
      }
      let response;
      if (id) {
        response = await put(`${putQuotationURL}/${prefetchData?.id}`, {
          ...payload,
          status: fieldName,
          // due_date:data?.due_date===null?"":data?.due_date
        });
      } else {
        response = await post(postQuotationURL, {
          ...payload,
          status: fieldName,
        });
      }
      if (response.settings.success) {
        toast.success(response.settings.message);
        navigate("../invoice-po-and-quote");
      } else {
        toast.error(response.settings.message);
      }
    } else {
      // console.log("purchase");
      let response;
      if (id) {
        const { terms_and_conditions, ...rest } = data;
        response = await filePut(
          `${putQuotationURL}/${prefetchData?.id}`,
          { ...rest, status: fieldName },
          files,
        );
      } else {
        const { terms_and_conditions, ...rest } = data;

        response = await filePost(
          postQuotationURL,
          { ...rest, status: fieldName },
          files,
        );
      }
      if (response.settings.success) {
        toast.success(response.settings.message);
        navigate("../invoice-po-and-quote");
      } else {
        toast.error(response.settings.message);
      }
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });
  console.log("products", watch("products"));
  const products = watch("products");
  const totalPrice =
    products?.length > 0
      ? products.reduce(
          (sum, product) =>
            sum + Number(product.price || 0) * Number(product.quantity || 0),
          0,
        )
      : 0;
  const totalQuanity =
    products?.length > 0
      ? products?.reduce((sum, product) => sum + Number(product.quantity), 0)
      : 0;

  useEffect(() => {
    if (products?.length > 0 && totalPrice > 0) {
      setValue("pricing", totalPrice);
    }
  }, [totalPrice]);
  useEffect(() => {
    if (products?.length > 0 && totalQuanity > 0) {
      setValue("volume", totalQuanity);
    }
  }, [totalQuanity]);

  const {
    fields: termsFields,
    append: termsAppend,
    remove: termsRemove,
  } = useFieldArray({
    control,
    name: "terms_and_conditions",
  });

  useEffect(() => {
    if (termsFields?.length === 0) {
      termsAppend();
    }
  }, []);

  const selectedProducts = watch("product_ids");
  useEffect(() => {
    selectedProducts?.forEach((p) => {
      if (!fields.find((f) => f.product === p)) {
        append({ product: p, size: "", price: "", quantity: "" });
      }
    });
    for (let i = fields.length - 1; i >= 0; i--) {
      if (!selectedProducts.includes(fields[i].product)) {
        remove(i);
      }
    }
  }, [selectedProducts]);

  // console.log("watch", watch());

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Box>
        <Box>
          <Box>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 700,
                color: colors.headingclr,
              }}
            >
              {from ? edit : status}{" "}
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                style={{ color: colors.darkgreen, textDecoration: "none" }}
                to={`${DEFAULT}/${DASHBOARD}`}
              >
                <Typography sx={{ fontSize: "14px" }}>Dashbaord</Typography>
              </Link>
              <Link
                style={{ color: colors.darkgreen, textDecoration: "none" }}
                to={`${DEFAULT}/${INVOICEPOANDQUOTE}`}
              >
                <Typography sx={{ fontSize: "14px" }}>
                  Transaction Hub
                </Typography>
              </Link>

              <Typography sx={{ fontSize: "14px" }}>{status}</Typography>
            </Breadcrumbs>
          </Box>
          <Card
            sx={{
              mt: 2,
              boxShadow: "none",
              border: "1px solid #E6E6E6",
              borderRadius: "12px",
            }}
          >
            <CardContent>
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                {fieldName !== "purchase_order" && fieldName !== "invoice" && (
                  <Box mt={1}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                        <Box>
                          <InputLabel16 sx={{ py: 1 }}>Creator By</InputLabel16>
                          <SingleSelect
                            name="creator"
                            placeholder="Select Creator"
                            control={control}
                            options={usersDropdownData}
                          />
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                        <Box>
                          <InputLabel16 sx={{ py: 1 }}>Validity</InputLabel16>

                          <FormInput
                            name="validity"
                            type="date"
                            control={control}
                            placeholder="Enter Date"
                          />
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                        <Box>
                          <InputLabel16 sx={{ py: 1 }}>Volume(in number of pieces)</InputLabel16>
                          <FormInput
                            name="volume"
                            control={control}
                            placeholder="Enter Volume"
                            type={"number"}
                          />
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Box>
                          <InputLabel16 sx={{ py: 1 }}>Pricing</InputLabel16>
                          <FormInput
                            name="pricing"
                            control={control}
                            placeholder="Enter Pricing"
                            type={"number"}
                          />
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Box>
                          <InputLabel16 sx={{ py: 1 }}>Currency</InputLabel16>
                          <SingleSelect
                            name="currency"
                            control={control}
                            placeholder="Select Currency"
                            options={currencyOptions}
                          />
                        </Box>
                      </Grid>
                      {/* <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Box>
                          <InputLabel16 sx={{ py: 1 }}>Due Date</InputLabel16>
                          <FormInput
                            name="due_date"
                            type={"date"}
                            control={control}
                            placeholder=""
                          />
                        </Box>
                      </Grid> */}

                      <Grid size={{ xs: 12 }}>
                        <Box>
                          <InputLabel16 sx={{ py: 1 }}>
                            Interested Products
                          </InputLabel16>
                          <MulitiSelect
                            name="product_ids"
                            control={control}
                            placeholder="Select Products"
                            options={ProductDropdownData}
                          />
                        </Box>
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
                              <Grid size={{ xs: 12, md: 4 }}>
                                <FormInput
                                  control={control}
                                  type={"text"}
                                  name={`products.${index}.size`}
                                  placeholder="Enter Size(in cms)"
                                />
                              </Grid>
                              <Grid size={{ xs: 12, md: 4 }}>
                                <FormInput
                                  control={control}
                                  type={"number"}
                                  name={`products.${index}.price`}
                                  placeholder="Enter Price"
                                />
                              </Grid>
                              <Grid size={{ xs: 12, md: 4 }}>
                                <FormInput
                                  control={control}
                                  type={"number"}
                                  name={`products.${index}.quantity`}
                                  placeholder="Enter Quantity"
                                />
                              </Grid>
                            </React.Fragment>
                          ))}
                        </Grid>
                      </Box>

                      <Grid size={{ xs: 12 }}>
                        <Box>
                          <InputLabel16 sx={{ py: 1 }}>
                            Shipping Address
                          </InputLabel16>
                          <TextareaInput
                            name="shipping_address"
                            type="text"
                            control={control}
                            placeholder="Enter Shipping Address"
                          />
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Box>
                          <InputLabel16 sx={{ py: 1 }}>
                            Billing Address
                          </InputLabel16>
                          <TextareaInput
                            name="billing_address"
                            control={control}
                            placeholder={"Enter Billing Address"}
                          />
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Box>
                          <InputLabel16 sx={{ py: 1 }}>
                            FOB Pricing Terms
                          </InputLabel16>
                          <TextareaInput
                            name="fob_pricing_terms"
                            control={control}
                            placeholder={"Enter FOB Pricing Terms"}
                          />
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Box>
                          <InputLabel16 sx={{ py: 1 }}>
                            Description
                          </InputLabel16>
                          <TextareaInput
                            name="description"
                            control={control}
                            placeholder={"Enter Description"}
                          />
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Box>
                          <InputLabel16 sx={{ py: 1 }}>
                            Terms & Conditions
                          </InputLabel16>
                          {termsFields.map((field, index) => (
                            <Grid
                              key={field.id}
                              size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}
                            >
                              <Box display="flex" alignItems="center" gap={1}>
                                <Box flexGrow={1} marginTop={2}>
                                  <FormInput
                                    control={control}
                                    name={`terms_and_conditions.${index}`}
                                    type="text"
                                    placeholder="Enter Terms and Conditions"
                                  />
                                </Box>
                                {/* {termsFields.length > 1 && ( */}
                                <IconButton
                                  onClick={() => termsRemove(index)}
                                  color="error"
                                  size="small"
                                  // style={{ marginTop: "30px" }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                                {/* )} */}
                              </Box>
                            </Grid>
                          ))}
                          <Grid size={{ xs: 12 }}>
                            <IconButton
                              onClick={() => termsAppend("")}
                              color="primary"
                              size="small"
                            >
                              <PlusCircleIcon fontSize="small" />
                            </IconButton>
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {(fieldName === "purchase_order" ||
                  fieldName === "invoice") && (
                  <Box sx={{ mt: 1 }}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <Box>
                          <InputLabel16 sx={{ py: 1 }}>
                            Upload Quotation
                          </InputLabel16>
                          <MultiImageUploadController
                            width={400}
                            height={200}
                            control={control}
                            errors={errors?.po_excel}
                            imageKeys={files}
                            getValues={getValues}
                            setValue={setValue}
                            handleAddImage={handleAddImage}
                            handleDeleteImage={handleDeleteImage}
                            isSubmitted={isSubmitted}
                            accept=".pdf,.doc,.docx,image/*"
                          />
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                        <Box>
                          <InputLabel16 sx={{ py: 1 }}>
                            Date Of Release
                          </InputLabel16>
                          <FormInput
                            name="date_of_release"
                            control={control}
                            placeholder=""
                            type={"date"}
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Box>
                          <InputLabel16 sx={{ py: 1 }}>
                            Company Name
                          </InputLabel16>
                          <SingleSelect
                            menuPortalTarget={document.body}
                            name="company"
                            options={companiesDropdownData}
                            control={control}
                            placeholder="Select Company"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                <Box display={"flex"} mt={2}>
                  <PrimaryButton
                    type="submit"
                    sx={{ px: 4 }}
                    disabled={isSubmitting || (from && !isDirty)}
                  >
                    {from ? edit : "Add " + status}
                    {isSubmitting && <StyledCircularProgress />}
                  </PrimaryButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
}

export default Quotation;
