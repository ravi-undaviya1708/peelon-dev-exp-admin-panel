import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  Breadcrumbs,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { PrimaryButton } from "../../../components/StyledButtons";
import { colors } from "../../../constants/constants";
import { Font20, InputLabel16 } from "../../../components/StyledText";
import { FormInput } from "../../../components/input/FormInput";
import Loader from "../../../components/loader/Loader";
import SingleSelect from "../../../components/select/SingleSelect";
import { StyledCircularProgress } from "../../../components/StyleCircularProgrerss";
import useApiRequest from "../../../hooks/useApiRequest";
import useFetchDropdown from "../../../hooks/useFetchDropdown";
import { initialPayloadAddInventory } from "./initialPayload";
import { productInventoryValidation } from "./schema";
import useFetchList from "../../../hooks/useFetchList";
import { productInventoryURLS } from "../../../services/api/superadminApi";
import {
  accountsPathConstants,
  customerPathConstants,
  deliveryDispatchPathConstants,
  factoryPathConstants,
  salesRepresentativePathConstants,
  superAdminPathConstants,
  warehouseManagerPathConstants,
} from "../../../constants/pathConstants";
import { DevTool } from "@hookform/devtools";

const Inventory = () => {
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { from, inventoryId } = location?.state || {};

  const { post, put } = useApiRequest();
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
  const pathConstants = pathConstantsByRole[userType];
  const { DEFAULT, DASHBOARD, PRODUCTANDINVENTORY } = pathConstants;

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: initialPayloadAddInventory,
    mode: "onSubmit",
    resolver: yupResolver(productInventoryValidation),
  });

  const {
    postProductInventoryURL,
    getRequirementTypesDropdownURL,
    getWarehousesOptionsURL,
    getProductsURL,
    getProductSizeURL,
    editProductInventoryDetailURL,
    productInventoryDetailURL,
  } = productInventoryURLS;

  const requirementTypeOptions = useFetchDropdown(
    getRequirementTypesDropdownURL,
    "value",
    "key",
  );
  const warehousesTypeOptions = useFetchDropdown(
    getWarehousesOptionsURL,
    "location",
    "id",
  );
  const productNameTypeOptions = useFetchDropdown(
    getProductsURL,
    "product_name",
    "id",
  );
  const productSizeTypeOptions = useFetchDropdown(
    getProductSizeURL,
    "size",
    "id",
  );
  const { data: prefetchProductInventoryData } = useFetchList(
    `${productInventoryDetailURL}/${inventoryId}`,
    {},
    from === "editInventory",
  );

  useEffect(() => {
    if (from === "editInventory" && prefetchProductInventoryData) {
      reset({
        product: prefetchProductInventoryData.product_id || "",
        volume: prefetchProductInventoryData.volume || "",
        batch_number: prefetchProductInventoryData.batch_number || "",
        date_of_manufacture:
          prefetchProductInventoryData.date_of_manufacture || "",
        size_of_product: prefetchProductInventoryData.size_of_product_id || "",
        warehouse: prefetchProductInventoryData.warehouse_id || "",
        requirement_type: prefetchProductInventoryData.requirement_type || "",
      });
    }
  }, [from, prefetchProductInventoryData, reset]);

  const onSumbit = async (data) => {
    setLoader(false);
    let response;
    if (from === "editInventory") {
      response = await put(
        `${editProductInventoryDetailURL}/${prefetchProductInventoryData?.id}`,
        data,
      );
    } else {
      response = await post(postProductInventoryURL, data);
    }
    if (response.settings.success) {
      toast.success(response.settings.message);
      navigate("../product-inventory");
      reset();
    } else {
      toast.error(response.settings.message);
    }
  };

  if (isLoading && loader) {
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
              {from === "editInventory" ? "Edit Inventory" : "Add Inventory"}
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
                <Typography sx={{ fontSize: "14px" }}>Inventory</Typography>
              </Link>

              <Typography sx={{ fontSize: "14px" }}>
                {from === "editInventory" ? "Edit Inventory" : "Add Inventory"}
              </Typography>
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
              <Box component="form" onSubmit={handleSubmit(onSumbit)}>
                <Box>
                  <Font20>Product Details</Font20>
                </Box>
                <Box mt={1}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                      <Box>
                        <InputLabel16 sx={{ py: 1 }}>Product Name</InputLabel16>
                        <SingleSelect
                          name="product"
                          placeholder="Select Product Name"
                          control={control}
                          options={productNameTypeOptions?.data}
                        />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                      <Box>
                        <InputLabel16 sx={{ py: 1 }}>Volume</InputLabel16>

                        <FormInput
                          name="volume"
                          type="number"
                          control={control}
                          placeholder="Volume"
                        />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                      <Box>
                        <InputLabel16 sx={{ py: 1 }}>Batch Number</InputLabel16>
                        <FormInput
                          name="batch_number"
                          control={control}
                          placeholder="Batch No"
                        />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                      <Box>
                        <InputLabel16 sx={{ py: 1 }}>
                          Date of Manufactured
                        </InputLabel16>
                        <FormInput
                          name="date_of_manufacture"
                          type="date"
                          control={control}
                          placeholder="Manufacture Date"
                        />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 5, lg: 5, xl: 5 }}>
                      <Box>
                        {/* <InputLabel16 sx={{ py: 1 }}>Sizes</InputLabel16> */}
                        <Grid container spacing={2}>
                          {/* <Grid size={{ sm: 2, xs: 2, md: 2, xl: 2, lg: 2 }}>
                        <SubButton
                          sx={{
                            textAlign: "center",
                            width: "100%",
                            alignContent: "center",
                            mt: 1,
                          }}
                        >
                          85X85
                        </SubButton>
                      </Grid> */}
                          <Grid size={{ sm: 7, xs: 7, md: 7, xl: 7, lg: 7 }}>
                            <InputLabel16 sx={{ py: 1 }}>
                              Size of Product
                            </InputLabel16>

                            <SingleSelect
                              name="size_of_product"
                              control={control}
                              options={productSizeTypeOptions?.data}
                            />
                          </Grid>
                          {/* <Grid size={{ sm: 3, xs: 3, md: 3, xl: 3, lg: 3 }}>
                        <OutlinedAddButton sx={{ mt: 1 }}>
                          Add
                        </OutlinedAddButton>
                      </Grid> */}
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}></Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                      <Box sx={{ mt: 2 }}>
                        <InputLabel16 sx={{ py: 1 }}>
                          Warehouse Type
                        </InputLabel16>
                        <SingleSelect
                          name="warehouse"
                          menuPortalTarget={document.body}
                          control={control}
                          options={warehousesTypeOptions?.data}
                        />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                      <Box sx={{ mt: 2 }}>
                        <InputLabel16 sx={{ py: 1 }}>
                          Requirement Type
                        </InputLabel16>
                        <SingleSelect
                          menuPortalTarget={document.body}
                          name="requirement_type"
                          control={control}
                          options={requirementTypeOptions?.data}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                <Box display={"flex"} justifyContent={"flex-end"} mt={4}>
                  <PrimaryButton
                    type="submit"
                    sx={{ px: 4 }}
                    disabled={
                      (from === "editInventory" && !isDirty) || isSubmitting
                    }
                  >
                    {from === "editInventory" ? "Update" : "Add"}
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
};
export default Inventory;
