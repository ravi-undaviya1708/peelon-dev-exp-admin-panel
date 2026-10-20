import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Breadcrumbs, Typography, Grid, CardContent, Card } from "@mui/material";
import { colors } from "../../../constants/constants";
import { Font20, Label16, } from "../../../components/StyledText";
import { PrimaryButton, } from "../../../components/StyledButtons";
import { StyledCircularProgress } from "../../../components/StyleCircularProgrerss";
import { FormInput } from "../../../components/input/FormInput";
import Loader from "../../../components/loader/Loader";
import SingleSelect from "../../../components/select/SingleSelect";
import { TextareaInput } from "../../../components/input/TextareaInput";
import { MultiImageUploadController } from "../../../components/image/MulitImageUpload";
import { useMulitImageArray } from "../../../hooks/useMultiImageArray";
import useApiRequest from "../../../hooks/useApiRequest";
import useFetchDropdown from "../../../hooks/useFetchDropdown";
import { initialPayloadProducts } from "./initialPayload";
import { productValidation } from "./schema";
import useFetchList from "../../../hooks/useFetchList";
import { mapApiDataToForm } from "../../../hooks/mapApiDataToForm";
import { blobConversion } from "../../../hooks/blobConversion";
import { productInventoryURLS } from "../../../services/api/superadminApi";
import { accountsPathConstants, customerPathConstants, deliveryDispatchPathConstants, factoryPathConstants, salesRepresentativePathConstants, superAdminPathConstants, warehouseManagerPathConstants } from "../../../constants/pathConstants";

const AddProduct = () => {
  const isLoading = useSelector((state) => state.loader.isLoading);

  const [loader, setLoader] = useState(true)
  const navigate = useNavigate();
  const location = useLocation();
  const { from, productId } = location?.state || {};

  const { post, put } = useApiRequest();
  const userType = useSelector((state) => state.auth.userType);
  const pathConstantsByRole = {
    "Super Admin": superAdminPathConstants,
    "Factory Operation": factoryPathConstants,
    "Sales Representative": salesRepresentativePathConstants,
    "Delivery & Dispatch": deliveryDispatchPathConstants,
    "Warehouse Manager": warehouseManagerPathConstants,
    "Accounts": accountsPathConstants,
    "Customer": customerPathConstants,
  };
  const pathConstants = pathConstantsByRole[userType];
  const { DEFAULT, DASHBOARD, PRODUCTANDINVENTORY } = pathConstants;
  const images = ["image_1", "image_2", "image_3", "image_4"];
  const { control, setValue, getValues, handleSubmit, watch, reset, formState: { errors, isSubmitting, isDirty, isSubmitted } } = useForm({
    defaultValues: initialPayloadProducts,
    resolver: yupResolver(productValidation)

  })

  const { handleAddImage, handleDeleteImage } = useMulitImageArray(images, getValues, setValue);

  const { postProductsURL, getProductTypeChoicesURL, editProductDetailURL, productDetailURL } = productInventoryURLS;

  const productTypeChoiceOptions = useFetchDropdown(getProductTypeChoicesURL, "value", "key");
  const { data: prefetchProductsData } = useFetchList(`${productDetailURL}/${productId}`, {}, from === "editProduct");

  useEffect(() => {
    if (from === "editProduct" && prefetchProductsData) {
      const formValues = mapApiDataToForm(initialPayloadProducts, prefetchProductsData);
      reset({
        ...formValues,
        product_type: prefetchProductsData.product_type?.product_type
      });
    }
  }, [from, prefetchProductsData, reset]);

  const onSumbit = async (data) => {
    setLoader(false);
    const formData = new FormData()
    let response;
    if (from === "editProduct") {
      for (let field in data) {
        let value = data[field]
        if (!images.includes(field)) {
          formData.append(field, value)
        }
      }
      const imageData = {};
      for (let field of images) {
        imageData[field] = data[field];
      }

      const imageConversionData = await blobConversion(imageData);
      for (const field in imageConversionData) {
        const fileData = imageConversionData[field];
        if (fileData) {
          const { blob, fileName } = fileData;
          formData.append(field, blob, fileName)
        }
        else {
          formData.append(field, "")

        }

      }
      response = await put(`${editProductDetailURL}/${prefetchProductsData?.id}`, formData)

    }
    else {
      for (let field in data) {
        let value = data[field];
        if (value !== null) {
          formData.append(field, value)
        }
      }

      response = await post(postProductsURL, formData)
    }
    if (response.settings.success) {
      toast.success(response.settings.message);
      navigate("../product-inventory");
      reset();
    }
    else {
      toast.error(response.settings.message)
    }
  }

  if (isLoading && loader) {
    return <Loader />
  }

  return (
    <>
      <Box>
        <Box>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 700,
              color: colors.headingclr,
            }}
          >
            {from === "editProduct" ? "Edit Product" : "Add Product"}
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
              to={`${DEFAULT}/${PRODUCTANDINVENTORY}`}
            >
              <Typography sx={{ fontSize: "14px" }}>
                Products
              </Typography>
            </Link>
            <Typography sx={{ fontSize: "14px" }}>{from === "editProduct" ? "EditProduct" : "Add Product"}</Typography>
          </Breadcrumbs>
        </Box>
      </Box>
      <Card sx={{ mt: 2, boxShadow: "none", border: "1px solid #E6E6E6", borderRadius: "12px" }}>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Font20>Product Images</Font20>
          </Box>
          <form onSubmit={handleSubmit(onSumbit)}>
            <Grid container spacing={2}>
              <MultiImageUploadController
                control={control}
                errors={errors?.image_1 || errors?.image_2 || errors?.image_3 || errors?.image_4}
                imageKeys={images}
                getValues={getValues}
                setValue={setValue}
                handleAddImage={handleAddImage}
                handleDeleteImage={handleDeleteImage}
                isSubmitted={isSubmitted}
              />
            </Grid>
            <Box sx={{ py: 2, my: 2 }}>
              <Font20 sx={{ fontSize: "20px" }}>Product Details</Font20>
              <Box sx={{ py: 2 }}>
                <Grid container spacing={3}>
                  <Grid
                    size={{ xs: 12, sm: 4, md: 3, }}
                  >
                    <Box>
                      <Label16 sx={{ py: 1 }}>Product Type</Label16>
                      <SingleSelect
                        name="product_type"
                        control={control}
                        options={productTypeChoiceOptions?.data}
                      />
                    </Box>
                  </Grid>
                  <Grid
                    size={{ xs: 12, sm: 4, md: 3, lg: 3, xl: 3, }}
                  >
                    <Box>
                      <Label16 sx={{ py: 1 }}>Product Name</Label16>
                      <FormInput control={control} name="product_name" type="text" placeholder="Product Name" />
                    </Box>
                  </Grid>

                  <Grid size={{ sm: 12, xs: 12, md: 12, xl: 12, lg: 12 }}>
                    <Box>
                      <Label16 sx={{ mt: 2 }}>Description</Label16>
                      <TextareaInput
                        name="product_description"
                        control={control}
                        placeholder="Describe the product"
                      />

                    </Box>
                  </Grid>
                </Grid>

                <PrimaryButton sx={{ px: 5, my: 2 }} disabled={(from === "editProduct" && !isDirty) || isSubmitting} type="submit">
                  {from === "editProduct" ? "Update" : "Add"}
                  {isSubmitting && (
                    <StyledCircularProgress />
                  )}
                </PrimaryButton>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
};
export default AddProduct;

