import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import { PrimaryButton } from "../../../components/StyledButtons";
import { colors } from "../../../constants/constants";
import { Font16, InputLabel16 } from "../../../components/StyledText";
import { FormInput } from "../../../components/input/FormInput";
import { StyledCircularProgress } from "../../../components/StyleCircularProgrerss";
import { calculatePricingURLS } from "../../../services/api/superadminApi";
import { linerPriceValidation, priceValidation } from "./schema";
import apiClient from "../../../services/interceptors/Interceptor";
import {
  accountsPathConstants,
  customerPathConstants,
  deliveryDispatchPathConstants,
  factoryPathConstants,
  salesRepresentativePathConstants,
  superAdminPathConstants,
  warehouseManagerPathConstants,
} from "../../../constants/pathConstants";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const initialPricePayloads = {
  length_of_box: "",
  width_of_box: "",
  height_of_box: "",
  width_of_liner: "",
  length_of_liner: "",
};

const CalculatePricing = () => {
  const [loader, setLoader] = useState(false);
  const [loader1, setLoader1] = useState(false);
  const [calculatePriceData, setCalculatePriceData] = useState({});
  const [calculatePriceWithLiner, setCalculatePriceWithLiner] = useState({});
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
  const { DEFAULT, DASHBOARD } = pathConstants;
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors, isDirty },
  } = useForm({
    defaultValues: initialPricePayloads,
    resolver: yupResolver(priceValidation),
    mode: "onSubmit",
  });

  const {
    control: linerControl,
    handleSubmit: handleLinerSubmit,
    formState: { isSubmitting: isLinerSubmitting, errors: linerErrors },
  } = useForm({
    defaultValues: initialPricePayloads,
    resolver: yupResolver(linerPriceValidation),
    mode: "onSubmit",
  });

  const { getCalculatePricingURL, getCalculatePriceLinearURL } =
    calculatePricingURLS;

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const calculatePrice = async (data) => {
    setLoader(true);
    try {
      await delay(500);
      const response = await apiClient.get(getCalculatePricingURL, {
        params: data,
      });
      setCalculatePriceData(response.data.data);
      if (response.data.settings.success) {
        setLoader(false);
      }
    } catch (error) {
      //console.log(error);
    }
  };

  const calculatePriceLiner = async (data) => {
    const payload = {};
    for (let field in data) {
      const value = data[field];
      if (value !== "") {
        payload[field] = value;
      }
    }
    setLoader1(true);
    try {
      await delay(500);
      const response = await apiClient.get(getCalculatePriceLinearURL, {
        params: payload,
      });
      setCalculatePriceWithLiner(response.data.data);
      if (response.data.settings.success) {
        setLoader1(false);
      }
    } catch (error) {
      //console.log(error);
    }
  };

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
              Calculate Pricing
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                style={{ color: colors.darkgreen, textDecoration: "none" }}
                to={`${DEFAULT}/${DASHBOARD}`}
              >
                <Typography sx={{ fontSize: "14px" }}>Dashbaord</Typography>
              </Link>

              <Typography sx={{ fontSize: "14px" }}>
                Calculate Pricing
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
              <Box>
                <Box mt={1}>
                  <Grid container spacing={7}>
                    <Grid
                      size={{ xs: 12, sm: 4 }}
                      component="form"
                      onSubmit={handleSubmit(calculatePrice)}
                    >
                      <Box>
                        <InputLabel16 sx={{ mb: 1 }}>
                          Length of Box (cms)
                        </InputLabel16>
                        <FormInput
                          control={control}
                          name="length_of_box"
                          type="number"
                          placeholder="Enter length"
                        />
                      </Box>
                      <Box mt={2}>
                        <InputLabel16 sx={{ mb: 1 }}>
                          Width of Box (cms)
                        </InputLabel16>
                        <FormInput
                          control={control}
                          name="width_of_box"
                          type="number"
                          placeholder="Enter width"
                        />
                      </Box>
                      <Box mt={2}>
                        <InputLabel16 sx={{ mb: 1 }}>
                          Height of Box (cms)
                        </InputLabel16>
                        <FormInput
                          control={control}
                          name="height_of_box"
                          type="number"
                          placeholder="Enter height"
                        />
                      </Box>
                      <Box display={"flex"} sx={{ mt: 3 }}>
                        <PrimaryButton
                          sx={{ px: 4 }}
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Calculate Price
                        </PrimaryButton>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Card
                        sx={{
                          mt: 3,
                          boxShadow: "none",
                          border: "2px solid #E6E6E6",
                          borderRadius: "8px",
                          position: "relative",
                          minHeight: 200,
                        }}
                      >
                        {loader && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              bgcolor: "rgba(255,255,255,0.6)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 10,
                            }}
                          >
                            <StyledCircularProgress sx={{ color: "gray" }} />
                          </Box>
                        )}
                        <CardContent>
                          <Typography>Calculated Price</Typography>
                          <Divider sx={{ mt: "2px", mb: "8px" }} />
                          <Grid container spacing={1}>
                            <Grid size={{ xs: 4, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>
                                Width of Liner (cms)
                              </Font16>
                            </Grid>
                            <Grid size={{ xs: 8, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16 sx={{ color: "#555555" }}>
                                : {calculatePriceData?.width_of_liner || 0}
                              </Font16>
                            </Grid>
                            <Grid size={{ xs: 4, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>
                                Length of Liner (cms)
                              </Font16>
                            </Grid>
                            <Grid size={{ xs: 8, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16 sx={{ color: "#555555" }}>
                                : {calculatePriceData?.length_of_liner || 0}
                              </Font16>
                            </Grid>
                            <Grid size={{ xs: 4, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>
                                Weight of Liner (gms)
                              </Font16>
                            </Grid>
                            <Grid size={{ xs: 8, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16
                                sx={{
                                  color: "#555555",
                                  overflowWrap: "break-word",
                                }}
                              >
                                : {calculatePriceData?.weight_of_liner || 0}
                              </Font16>
                            </Grid>
                            <Grid size={{ xs: 4, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>
                                Number of pieces per kg
                              </Font16>
                            </Grid>
                            <Grid size={{ xs: 8, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16
                                sx={{
                                  color: "#555555",
                                  overflowWrap: "break-word",
                                }}
                              >
                                : {calculatePriceData?.no_of_pieces_kg || 0}
                              </Font16>
                            </Grid>
                            <Grid size={{ xs: 4, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>USA($)</Font16>
                            </Grid>
                            <Grid size={{ xs: 8, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16
                                sx={{
                                  color: "#555555",
                                  overflowWrap: "break-word",
                                }}
                              >
                                : {calculatePriceData?.us_price || 0}
                              </Font16>
                            </Grid>
                            <Grid size={{ xs: 4, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>INR (₹)</Font16>
                            </Grid>
                            <Grid size={{ xs: 8, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16
                                sx={{
                                  color: "#555555",
                                  overflowWrap: "break-word",
                                }}
                              >
                                : {calculatePriceData?.india_price || 0}
                              </Font16>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card
            sx={{
              mt: 2,
              boxShadow: "none",
              border: "1px solid #E6E6E6",
              borderRadius: "12px",
            }}
          >
            <CardContent>
              <Box>
                <Box mt={1}>
                  <Grid container spacing={7}>
                    <Grid
                      size={{ xs: 12, sm: 4 }}
                      component="form"
                      onSubmit={handleLinerSubmit(calculatePriceLiner)}
                    >
                      <Box>
                        <InputLabel16 sx={{ mb: 1 }}>
                          Length of Liner (cms){" "}
                        </InputLabel16>
                        <FormInput
                          control={linerControl}
                          name="length_of_liner"
                          type="number"
                          placeholder="Enter length"
                        />
                      </Box>
                      <Box mt={2}>
                        <InputLabel16 sx={{ mb: 1 }}>
                          Width of Liner(cms)
                        </InputLabel16>
                        <FormInput
                          control={linerControl}
                          name="width_of_liner"
                          type="number"
                          placeholder="Enter width"
                        />
                      </Box>

                      <Box display={"flex"} sx={{ mt: 3 }}>
                        <PrimaryButton
                          sx={{ px: 4 }}
                          type="submit"
                          disabled={isLinerSubmitting}
                        >
                          Calculate Price
                        </PrimaryButton>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Card
                        sx={{
                          mt: 3,
                          boxShadow: "none",
                          border: "2px solid #E6E6E6",
                          borderRadius: "8px",
                          position: "relative",
                          minHeight: 200,
                        }}
                      >
                        {loader1 && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              bgcolor: "rgba(255,255,255,0.6)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 10,
                            }}
                          >
                            <StyledCircularProgress sx={{ color: "gray" }} />
                          </Box>
                        )}
                        <CardContent>
                          <Typography>Calculated Price</Typography>
                          <Divider sx={{ mt: "2px", mb: "8px" }} />
                          <Grid container spacing={1}>
                            <Grid size={{ xs: 4, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>
                                Width of Liner (cms)
                              </Font16>
                            </Grid>
                            <Grid size={{ xs: 8, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16 sx={{ color: "#555555" }}>
                                : {calculatePriceWithLiner?.width_of_liner || 0}
                              </Font16>
                            </Grid>
                            <Grid size={{ xs: 4, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>
                                Length of Liner (cms)
                              </Font16>
                            </Grid>
                            <Grid size={{ xs: 8, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16 sx={{ color: "#555555" }}>
                                :{" "}
                                {calculatePriceWithLiner?.length_of_liner || 0}
                              </Font16>
                            </Grid>
                            <Grid size={{ xs: 4, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>
                                Weight of Liner (gms)
                              </Font16>
                            </Grid>
                            <Grid size={{ xs: 8, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16
                                sx={{
                                  color: "#555555",
                                  overflowWrap: "break-word",
                                }}
                              >
                                :{" "}
                                {calculatePriceWithLiner?.weight_piece_kg || 0}
                              </Font16>
                            </Grid>
                            <Grid size={{ xs: 4, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>
                                Number of pieces per kg
                              </Font16>
                            </Grid>
                            <Grid size={{ xs: 8, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16
                                sx={{
                                  color: "#555555",
                                  overflowWrap: "break-word",
                                }}
                              >
                                :{" "}
                                {calculatePriceWithLiner?.no_of_pieces_kg || 0}
                              </Font16>
                            </Grid>
                            <Grid size={{ xs: 4, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>USA($)</Font16>
                            </Grid>
                            <Grid size={{ xs: 8, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16
                                sx={{
                                  color: "#555555",
                                  overflowWrap: "break-word",
                                }}
                              >
                                : {calculatePriceWithLiner?.us_price || 0}
                              </Font16>
                            </Grid>
                            <Grid size={{ xs: 4, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>INR (₹)</Font16>
                            </Grid>
                            <Grid size={{ xs: 8, sm: 6, md: 6, lg: 6, xl: 6 }}>
                              <Font16
                                sx={{
                                  color: "#555555",
                                  overflowWrap: "break-word",
                                }}
                              >
                                : {calculatePriceWithLiner?.india_price || 0}
                              </Font16>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};
export default CalculatePricing;
