import { Link, useLocation } from "react-router-dom";
import { Box, Breadcrumbs, Divider, Grid, Typography } from "@mui/material";
import { ArrowUp, Pencil, Trash2, UserCheck } from "lucide-react";
import { colors } from "../../../constants/constants";
import { LeadsURLS } from "../../../services/api/superadminApi";
import useFetchList from "../../../hooks/useFetchList";
import {
  accountsPathConstants,
  customerPathConstants,
  deliveryDispatchPathConstants,
  factoryPathConstants,
  salesRepresentativePathConstants,
  superAdminPathConstants,
  warehouseManagerPathConstants,
} from "../../../constants/pathConstants";
import { useSelector } from "react-redux";
import Loader from "../../../components/loader/Loader";
import { Font16 } from "../../../components/StyledText";
import { lazy, Suspense } from "react";
import { Center } from "@mantine/core";
const SummaryModal = lazy(() => import("./modals/SummaryModal"));
const LeadDetails = () => {
  const isLoading = useSelector((state) => state.loader.isLoading);
  const location = useLocation();
  const { leadId } = location?.state || {};
  const { leadDetailsURL } = LeadsURLS;
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
  const { DEFAULT, DASHBOARD, LEADS } = pathConstants;
  const { data: leadDetailData } = useFetchList(`${leadDetailsURL}/${leadId}`);

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
              Lead Details
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
                to={`${DEFAULT}/${LEADS}`}
              >
                <Typography sx={{ fontSize: "14px" }}>Leads</Typography>
              </Link>
              <Typography sx={{ fontSize: "14px" }}>Lead Details</Typography>
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
                    {leadDetailData?.name_of_poc?.[0]}
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
                        : {leadDetailData?.company_name?.name}
                      </Font16>
                    </Grid>

                    <Grid size={{ xs: 5, md: 4 }}>
                      <Font16 sx={{ color: "#666666" }}>Type</Font16>
                    </Grid>
                    <Grid size={{ xs: 7, md: 8 }}>
                      <Font16 sx={{ color: "#555555", ml: { lg: "-30px" } }}>
                        : {leadDetailData?.type}
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
                        : {leadDetailData?.email}
                      </Font16>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 5, sm: 3 }}>
                      <Font16 sx={{ color: "#666666" }}>POC Name</Font16>
                    </Grid>
                    <Grid size={{ xs: 7, sm: 9 }}>
                      <Font16 sx={{ color: "#555555", ml: { lg: "-30px" } }}>
                        : {leadDetailData?.name_of_poc}
                      </Font16>
                    </Grid>

                    <Grid size={{ xs: 5, sm: 3 }}>
                      <Font16 sx={{ color: "#666666" }}>Phone no</Font16>
                    </Grid>
                    <Grid size={{ xs: 7, sm: 9 }}>
                      <Font16 sx={{ color: "#555555", ml: { lg: "-30px" } }}>
                        : {leadDetailData?.mobile}
                      </Font16>
                    </Grid>

                    <Grid size={{ xs: 5, sm: 3 }}>
                      <Font16 sx={{ color: "#666666" }}>Location</Font16>
                    </Grid>
                    <Grid size={{ xs: 7, sm: 9 }}>
                      <Font16 sx={{ color: "#555555", ml: { lg: "-30px" } }}>
                        : {leadDetailData?.location?.value}
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
                    <UserCheck size={"18px"} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "18px", color: "#333333" }}>
                      Lead Details
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mt: "2px", mb: "5px" }} />
                <Box mt={2}>
                  <Grid container>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                      <Font16 sx={{ color: "#666666" }}>Created Date</Font16>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                      <Font16 sx={{ color: "#666666" }}>
                        : {leadDetailData?.lead_details?.created_at}
                      </Font16>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                      <Font16 sx={{ color: "#666666" }}>Follow up</Font16>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                      <Font16 sx={{ color: "#666666" }}>
                        : {leadDetailData?.last_follow_up}
                      </Font16>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                      <Font16 sx={{ color: "#666666" }}>
                        Interested Products
                      </Font16>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                      <Font16 sx={{ color: "#666666" }}>
                        :{" "}
                        {leadDetailData?.lead_details?.interested_product
                          ?.map((item) => item?.name)
                          .join(", ")}
                      </Font16>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                      <Font16 sx={{ color: "#666666" }}>Lead Stage</Font16>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                      <Font16 sx={{ color: "#666666" }}>
                        : {leadDetailData?.lead_details?.lead_stage?.value}
                      </Font16>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                      <Font16 sx={{ color: "#666666" }}>Lead Source</Font16>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                      <Font16 sx={{ color: "#666666" }}>
                        : {leadDetailData?.lead_source?.value}
                      </Font16>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                      <Font16 sx={{ color: "#666666" }}>Summary</Font16>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                      <Suspense fallback={null}>
                        <SummaryModal row={leadDetailData?.summary} />
                      </Suspense>
                    </Grid>
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
export default LeadDetails;
