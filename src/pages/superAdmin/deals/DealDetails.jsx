import { Box, Breadcrumbs, Divider, Grid, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { ArrowUp, Handshake } from "lucide-react";
import { useSelector } from "react-redux";
import { colors } from "../../../constants/constants";
import { Font16 } from "../../../components/StyledText";
import useFetchList from "../../../hooks/useFetchList";
import { DealsURLS } from "../../../services/api/superadminApi";
import {
  accountsPathConstants,
  customerPathConstants,
  deliveryDispatchPathConstants,
  factoryPathConstants,
  salesRepresentativePathConstants,
  superAdminPathConstants,
  warehouseManagerPathConstants,
} from "../../../constants/pathConstants";
import { lazy, Suspense } from "react";
const SummaryModal = lazy(() => import("./modals/SummaryModal"));
import Loader from "../../../components/loader/Loader";
import OtherDetailModal from "./modals/OtherDetailsModal";

const DealDetails = () => {
  const userType = useSelector((state) => state.auth.userType);
  const isLoading = useSelector((state) => state.loader.isLoading);
  const location = useLocation();
  const { dealId } = location?.state || {};
  //console.log("dealID", dealId)
  const { getDealDetailsURL } = DealsURLS;
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
  const { DEFAULT, DASHBOARD, DEALS } = pathConstants;
  const { data: dealDetailData } = useFetchList(
    `${getDealDetailsURL}/${dealId}`,
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Box>
        <Box display={"flex"} justifyContent={"space-between"}>
          <Box>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 700,
                color: colors.headingclr,
              }}
            >
              Deal Details
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
                to={`${DEFAULT}/${DEALS}`}
              >
                <Typography sx={{ fontSize: "14px" }}>Deals</Typography>
              </Link>
              <Typography sx={{ fontSize: "14px" }}>Deal Details</Typography>
            </Breadcrumbs>
          </Box>
        </Box>
      </Box>
      <Box mt={3}>
        <Box
          sx={{
            backgroundColor: "white",
            p: 2,
            borderRadius: "5px",
            border: "1.5px solid #E6E6E6",
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 2, xl: 1 }}>
              <Grid container>
                <Grid size={{ xs: 12, sm: 2 }}>
                  <Box
                    sx={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "8px",
                      backgroundColor: "#E8F6ED",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: 500,
                      fontSize: "35px",
                    }}
                  >
                    {dealDetailData?.name_of_poc?.[0]}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              size={{ xs: 12, sm: 12, md: 10, xl: 8 }}
              alignContent={"center"}
            >
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 5, md: 4 }}>
                      <Font16 sx={{ color: "#666666" }}>Company Name</Font16>
                    </Grid>
                    <Grid size={{ xs: 7, md: 8 }}>
                      <Font16 sx={{ color: "#555555", ml: { lg: "-30px" } }}>
                        : {dealDetailData?.company_name?.name}
                      </Font16>
                    </Grid>

                    <Grid size={{ xs: 5, md: 4 }}>
                      <Font16 sx={{ color: "#666666" }}>Type</Font16>
                    </Grid>
                    <Grid size={{ xs: 7, md: 8 }}>
                      <Font16 sx={{ color: "#555555", ml: { lg: "-30px" } }}>
                        : {dealDetailData?.type}
                      </Font16>
                    </Grid>

                    <Grid size={{ xs: 5, md: 4 }}>
                      <Font16 sx={{ color: "#666666" }}>Mail ID</Font16>
                    </Grid>
                    <Grid size={{ xs: 7, md: 8 }}>
                      <Font16
                        sx={{
                          color: "#555555",
                          overflowWrap: "break-word",
                          ml: { lg: "-30px" },
                        }}
                      >
                        : {dealDetailData?.email}
                      </Font16>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 5, sm: 3 }}>
                      <Font16 sx={{ color: "#666666" }}>Name</Font16>
                    </Grid>
                    <Grid size={{ xs: 7, sm: 9 }}>
                      <Font16 sx={{ color: "#555555", ml: { lg: "-30px" } }}>
                        : {dealDetailData?.name_of_poc}
                      </Font16>
                    </Grid>

                    <Grid size={{ xs: 5, sm: 3 }}>
                      <Font16 sx={{ color: "#666666" }}>Phone no</Font16>
                    </Grid>
                    <Grid size={{ xs: 7, sm: 9 }}>
                      <Font16 sx={{ color: "#555555", ml: { lg: "-30px" } }}>
                        : {dealDetailData?.mobile}
                      </Font16>
                    </Grid>

                    <Grid size={{ xs: 5, sm: 3 }}>
                      <Font16 sx={{ color: "#666666" }}>Location</Font16>
                    </Grid>
                    <Grid size={{ xs: 7, sm: 9 }}>
                      <Font16 sx={{ color: "#555555", ml: { lg: "-30px" } }}>
                        : {dealDetailData?.location?.value}
                      </Font16>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box mt={3}>
        <Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
              <Box
                sx={{
                  backgroundColor: "white",
                  p: 2,
                  borderRadius: "5px",
                  border: "1.5px solid #E6E6E6",
                }}
              >
                <Box display={"flex"} gap={1}>
                  <Box mt={"4px"}>
                    <Handshake size={"18px"} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "18px", color: "#333333" }}>
                      Deal Details
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mt: "2px", mb: "5px" }} />
                <Box mt={2}>
                  <Grid container>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mt={1}>
                      <Font16 sx={{ color: "#666666" }}>
                        Interested Product
                      </Font16>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mt={1}>
                      <Font16 sx={{ color: "#666666" }}>
                        :{" "}
                        {Array.isArray(dealDetailData?.interested_product)
                          ? dealDetailData.interested_product
                              .map((item) => item.name)
                              .join(", ")
                          : "null"}
                      </Font16>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mt={1}>
                      <Font16 sx={{ color: "#666666" }}>Deal Value</Font16>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mt={1}>
                      <Font16 sx={{ color: "#666666" }}>
                        : $ {dealDetailData?.value}
                      </Font16>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mt={1}>
                      <Font16 sx={{ color: "#666666" }}>Deal Stage</Font16>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mt={1}>
                      <Font16 sx={{ color: "#666666" }}>
                        : {dealDetailData?.deal_stages?.deal_value}
                      </Font16>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mt={1}>
                      <Font16 sx={{ color: "#666666" }}>
                        Expected Order Date
                      </Font16>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mt={1}>
                      <Font16 sx={{ color: "#666666" }}>
                        : {dealDetailData?.exp_order_date}
                      </Font16>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mt={1}>
                      <Font16 sx={{ color: "#666666" }}>Summary</Font16>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mt={1}>
                      <Suspense fallback={null}>
                        <SummaryModal row={dealDetailData?.summary} />
                      </Suspense>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                      <Font16 sx={{ color: "#666666" }}>Other Details</Font16>
                    </Grid>
                    {dealDetailData?.other_details ? (
                      <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                        <Suspense fallback={null}>
                          <OtherDetailModal
                            row={dealDetailData?.other_details}
                          />
                        </Suspense>
                      </Grid>
                    ) : (
                      <Font16 sx={{ color: "#666666" }}>-</Font16>
                    )}
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default DealDetails;
