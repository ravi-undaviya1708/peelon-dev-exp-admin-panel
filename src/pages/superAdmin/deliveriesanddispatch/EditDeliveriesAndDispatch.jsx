import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Breadcrumbs,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import { FormInput } from "../../../components/input/FormInput";
import { Font20, InputLabel16 } from "../../../components/StyledText";
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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { deliveriesAndDispatchURLS } from "../../../services/api/superadminApi";
import useFetchList from "../../../hooks/useFetchList";
import { mapApiDataToForm } from "../../../hooks/mapApiDataToForm";
import useApiRequest from "../../../hooks/useApiRequest";
import { toast } from "react-toastify";
import SingleSelect from "../../../components/select/SingleSelect";
import useFetchDropdown from "../../../hooks/useFetchDropdown";
import { useSelector } from "react-redux";
import Loader from "../../../components/loader/Loader";
import { deliveriesSchema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";

const deliveryAndDispatchInitialPayloads = {
  // volume: "",
  dispatched_date: "",
  delivered_date: "",
  expected_delivery_time: "",
  tracking_id: "",
  dispatch_confirmed_by: "",
  delivery_confirmed_by: "",
};

function EditDeliveriesAndDispatch() {
  const isLoading = useSelector((state) => state.loader.isLoading);
  const location = useLocation();
  const navigate = useNavigate();
  const { put } = useApiRequest();
  const { id, from } = location?.state || {};
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
  const { DEFAULT, DASHBOARD, DELIVERIESANDDISPATCH } = pathConstants;
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: deliveryAndDispatchInitialPayloads,
    resolver: yupResolver(deliveriesSchema(from)),
  });
  console.log("errors", errors);
  console.log("from", from);

  const {
    editDeliveriesAndDispatchURL,
    detailDeliveriesAndDispatchURL,
    getUsersDropdownURL,
  } = deliveriesAndDispatchURLS;

  const { data: detailDeliveriesAndDipatchData } = useFetchList(
    `${detailDeliveriesAndDispatchURL}/${id}`,
  );
  const { data: usersDropdownData } = useFetchDropdown(
    getUsersDropdownURL,
    "full_name",
    "id",
  );
  //console.log(watch());

  useEffect(() => {
    const formValues = mapApiDataToForm(
      deliveryAndDispatchInitialPayloads,
      detailDeliveriesAndDipatchData,
    );
    reset({
      ...formValues,
      dispatch_confirmed_by:
        detailDeliveriesAndDipatchData?.dispatch_confirmed_by?.id,
      delivery_confirmed_by:
        detailDeliveriesAndDipatchData?.delivery_confirmed_by?.id,
    });
  }, [reset, detailDeliveriesAndDipatchData]);

  const onSumbit = async (data) => {
    const cleanedData = {};
    for (const key in data) {
      const value = data[key];
      if (
        value !== null &&
        value !== "" &&
        value !== undefined &&
        !(
          from === "deliveries" &&
          ["tracking_id", "dispatched_date"].includes(key)
        )
      ) {
        cleanedData[key] = value;
      }
    }
    let response;
    response = await put(`${editDeliveriesAndDispatchURL}/${id}`, {
      ...cleanedData,
      ...(from === "deliveries" && { order_progress_status: "delivered" }),
    });

    if (response.settings.success) {
      reset();
      toast.success(response.settings.message);
      navigate("../delivers-dispatch");
    } else {
      toast.error(response.settings.message);
    }
  };

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
              {from === "deliveries"
                ? "Edit Deliveries Details"
                : " Edit Dispatch Details"}{" "}
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
                to={`${DEFAULT}/${DELIVERIESANDDISPATCH}`}
              >
                <Typography sx={{ fontSize: "14px" }}>
                  {from === "deliveries" ? "Deliveries" : "Dispatch"}
                </Typography>
              </Link>

              <Typography sx={{ fontSize: "14px" }}>Edit Dispatch</Typography>
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
                <Box mt={1}>
                  <Grid container spacing={3}>
                    {/* <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                      <Box>
                        <InputLabel16 sx={{ py: 1 }}>Volume</InputLabel16>
                        <FormInput
                          name="volume"
                          type="number"
                          control={control}
                          placeholder="Enter Volume"
                        />
                      </Box>
                    </Grid> */}
                    {from !== "dispatched" && (
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                        <Box>
                          <InputLabel16 sx={{ py: 1 }}>
                            Dispatch Date
                          </InputLabel16>
                          <FormInput
                            name={"dispatched_date"}
                            control={control}
                            type={"datetime-local"}
                          />
                        </Box>
                      </Grid>
                    )}

                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                      <Box>
                        <InputLabel16 sx={{ py: 1 }}>
                          {from === "dispatched"
                            ? " Dispatch Date"
                            : "Delivery Date"}
                        </InputLabel16>
                        <FormInput
                          name={
                            from === "dispatched"
                              ? "dispatched_date"
                              : "delivered_date"
                          }
                          control={control}
                          type={"datetime-local"}
                        />
                      </Box>
                    </Grid>
                    {from === "dispatched" && (
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                        <Box>
                          <InputLabel16 sx={{ py: 1 }}>
                            Expected Delivery Date
                          </InputLabel16>
                          <FormInput
                            name="expected_delivery_time"
                            type="datetime-local"
                            control={control}
                            placeholder="Manufacture Date"
                          />
                        </Box>
                      </Grid>
                    )}

                    {from === "dispatched" && (
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                        <Box>
                          <InputLabel16 sx={{ py: 1 }}>
                            Tracking Id
                          </InputLabel16>
                          <FormInput
                            name="tracking_id"
                            control={control}
                            type={"text"}
                            placeholder={"Enter Track Id"}
                          />
                        </Box>
                      </Grid>
                    )}

                    {/* {from === "dispatched" && (
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                        <Box>
                          <InputLabel16 sx={{ py: 1 }}>
                            Order Progress Status
                          </InputLabel16>
                          <FormInput
                            name="tracking_id"
                            control={control}
                            type={"text"}
                            placeholder={"Enter Track Id"}
                          />
                        </Box>
                      </Grid>
                    )} */}

                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                      <Box>
                        <InputLabel16 sx={{ py: 1 }}>
                          {from === "deliveries"
                            ? "Delivery Confirmed By"
                            : " Dispatch Confirmed By"}
                        </InputLabel16>
                        <SingleSelect
                          menuPortalTarget={document.body}
                          name={
                            from === "deliveries"
                              ? "delivery_confirmed_by"
                              : "dispatch_confirmed_by"
                          }
                          control={control}
                          options={usersDropdownData}
                          placeholder={"Select Sales Reprensentative"}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                <Box display={"flex"} mt={2}>
                  <PrimaryButton
                    type="submit"
                    sx={{ px: 4 }}
                    disabled={!isDirty || isSubmitting}
                  >
                    Update
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

export default EditDeliveriesAndDispatch;
