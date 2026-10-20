import {
  Box,
  Breadcrumbs,
  Divider,
  Grid,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  Handshake,
  Magnet,
  Notebook,
} from "lucide-react";
import { colors } from "../../../constants/constants";
import { Font16, Font24 } from "../../../components/StyledText";
import { accountsPathConstants, customerPathConstants, deliveryDispatchPathConstants, factoryPathConstants, salesRepresentativePathConstants, superAdminPathConstants, warehouseManagerPathConstants } from "../../../constants/pathConstants";
import useFetchList from "../../../hooks/useFetchList";
import { contactusURLS } from "../../../services/api/superadminApi";
import { orderHistroy } from "./ContactsTable";
import { AdvancedTable } from "../../../components/AdvanceTable";
import { StyledNoData } from "../../../components/StyledNoData";
import { useSelector } from "react-redux";
import Loader from "../../../components/loader/Loader";

const ContactDetails = () => {
  const isLoading = useSelector((state) => state.loader.isLoading);
  const location = useLocation();
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
  const { DEFAULT, DASHBOARD, CONTACTS } = pathConstants; const { getContactDetailsURL, orderHistroyURL } = contactusURLS;
  const { contactManualId } = location?.state || {};

  const { data: contactDetailData } = useFetchList(
    `${getContactDetailsURL}/${contactManualId}`
  );

  const { data: orderHistoryData } = useFetchList(
    `${orderHistroyURL}/${contactManualId}`
  );

  if (isLoading) {
    return <Loader />
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
              Contact Details
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
                to={`${DEFAULT}/${CONTACTS}`}
              >
                <Typography sx={{ fontSize: "14px" }}>Contacts</Typography>
              </Link>
              <Typography sx={{ fontSize: "14px" }}>Contact Details</Typography>
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
            <Grid size={{ xs: 12, sm: 6, md: 2, xl: 1, }}>
              <Grid container>
                <Grid size={{ xs: 12, sm: 2, }}>
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
                    {contactDetailData?.name_of_poc?.[0]}
                  </Box>
                </Grid>
              </Grid>

            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 10, xl: 8, }} alignContent={"center"} >
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 12, md: 6, }}>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 5, md: 4 }}>
                      <Font16 sx={{ color: "#666666" }}>Company Name</Font16>
                    </Grid>
                    <Grid size={{ xs: 7, md: 8 }}>
                      <Font16 sx={{ color: "#555555" }}>
                        : {contactDetailData?.company_name}
                      </Font16>
                    </Grid>

                    <Grid size={{ xs: 5, md: 4 }}>
                      <Font16 sx={{ color: "#666666" }}>Copmpany Type</Font16>
                    </Grid>
                    <Grid size={{ xs: 7, md: 8 }}>
                      <Font16 sx={{ color: "#555555" }}>
                        : {contactDetailData?.company_type}
                      </Font16>
                    </Grid>

                    <Grid size={{ xs: 5, md: 4 }}>
                      <Font16 sx={{ color: "#666666" }}>Mail ID</Font16>
                    </Grid>
                    <Grid size={{ xs: 7, md: 8 }}>
                      <Font16 sx={{ color: "#555555", overflowWrap: "break-word" }}>
                        : {contactDetailData?.email}
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
                      <Font16 sx={{ color: "#555555" }}>
                        : {contactDetailData?.name_of_poc}
                      </Font16>
                    </Grid>

                    <Grid size={{ xs: 5, sm: 3 }}>
                      <Font16 sx={{ color: "#666666" }}>Phone no</Font16>
                    </Grid>
                    <Grid size={{ xs: 7, sm: 9 }}>
                      <Font16 sx={{ color: "#555555" }}>
                        : {contactDetailData?.mobile}
                      </Font16>
                    </Grid>

                    <Grid size={{ xs: 5, sm: 3 }}>
                      <Font16 sx={{ color: "#666666" }}>Location</Font16>
                    </Grid>
                    <Grid size={{ xs: 7, sm: 9 }}>
                      <Font16 sx={{ color: "#555555" }}>
                        : {contactDetailData?.location?.value}
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
        <Box >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
              {contactDetailData?.leads?.length > 0 ? (
                <Box
                  sx={{
                    maxHeight: "500px",
                    overflowY: "auto",
                    pr: 1,
                    scrollbarWidth: "none"
                  }}
                >
                  <Grid container spacing={2}>
                    {contactDetailData.leads.map((lead, index) => (
                      <Grid item xs={12} key={lead?.id}>
                        <Box
                          sx={{
                            backgroundColor: "white",
                            p: 2,
                            borderRadius: "5px",
                            border: "1.5px solid #E6E6E6",
                          }}
                        >
                          <Box display="flex" alignItems={"center"} justifyContent={"space-between"}>
                            <Box mt={"4px"} display="flex" alignItems={"center"} gap={1}>
                              <Magnet size={"18px"} />
                              <Typography sx={{ fontSize: "18px", color: "#333333" }}>
                                Lead Details
                              </Typography>
                            </Box>
                            <Box>
                              <Typography sx={{ fontSize: "18px", color: "#333333" }}>
                                {index + 1}
                              </Typography>
                            </Box>

                          </Box>

                          <Divider sx={{ mt: "2px", mb: "5px" }} />

                          {/* Content */}
                          <Grid container spacing={1}>
                            <Grid size={{ xs: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>Interested Products</Font16>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              {lead?.lead_details?.interested_product?.length > 0 ? (
                                <Font16 sx={{ color: "#666666" }}>
                                  : {lead.lead_details.interested_product.map((item) => item.name).join(", ")}
                                </Font16>
                              ) : (


                                <Typography>No interested product found</Typography>
                              )}
                            </Grid>

                            <Grid size={{ xs: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>Lead Stage</Font16>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>
                                : {lead?.lead_details?.lead_stage?.value}
                              </Font16>
                            </Grid>

                            <Grid size={{ xs: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>Lead Source</Font16>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>
                                : {lead?.lead_source?.value}
                              </Font16>
                            </Grid>

                            <Grid size={{ xs: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>Created Date</Font16>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>
                                : {lead?.lead_details?.created_at}
                              </Font16>
                            </Grid>

                            <Grid size={{ xs: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>Last Follow Up</Font16>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>
                                : {lead?.last_follow_up}
                              </Font16>
                            </Grid>
                             <Grid size={{ xs: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>Next Follow Up</Font16>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>
                                : {lead?.next_follow_up}
                              </Font16>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ) : (
                <Box sx={{
                  backgroundColor: "white",
                  p: 2,
                  borderRadius: "5px",
                  border: "1.5px solid #E6E6E6",
                  minHeight: "225px"
                }}>
                  <Box display="flex" alignItems={"center"} justifyContent={"space-between"}>
                    <Box mt={"4px"} display="flex" alignItems={"center"} gap={1}>
                      <Magnet size={"18px"} />
                      <Typography sx={{ fontSize: "18px", color: "#333333" }}>
                        Lead Details
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: "18px", color: "#333333" }}>
                        {0}
                      </Typography>
                    </Box>

                  </Box>
                  <Divider sx={{ mt: "2px", mb: "5px" }} />
                  <StyledNoData minHeight={"200px"} width="50px" />
                </Box>
              )}
            </Grid>


            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
              {contactDetailData?.deals?.length > 0 ? (
                <Box
                  sx={{
                    maxHeight: "500px",
                    overflowY: "auto",
                    pr: 1,
                    scrollbarWidth: "none"
                  }}
                >
                  <Grid container spacing={2}>
                    {contactDetailData.deals.map((deal, index) => (
                      <Grid item xs={12} key={deal?.id}>
                        <Box
                          sx={{
                            backgroundColor: "white",
                            p: 2,
                            borderRadius: "5px",
                            border: "1.5px solid #E6E6E6",
                          }}
                        >
                          <Box display="flex" alignItems={"center"} justifyContent={"space-between"}>
                            <Box mt={"4px"} display="flex" alignItems={"center"} gap={1}>
                              <Handshake size={"18px"} />
                              <Typography sx={{ fontSize: "18px", color: "#333333" }}>
                                Deal Details
                              </Typography>
                            </Box>
                            <Box>
                              <Typography sx={{ fontSize: "18px", color: "#333333" }}>
                                {index + 1}
                              </Typography>
                            </Box>

                          </Box>

                          <Divider sx={{ mt: "2px", mb: "5px" }} />

                          {/* Content */}
                          <Grid container spacing={1}>
                            <Grid size={{ xs: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>Interested Products</Font16>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              {deal?.interested_product?.length > 0 ? (
                                <Font16 sx={{ color: "#666666" }}>
                                  : {deal.interested_product.map((item) => item.name).join(", ")}
                                </Font16>
                              ) : (
                                <Typography>No interested product found</Typography>
                              )}
                            </Grid>

                            <Grid size={{ xs: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>Deal Stage</Font16>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>
                                : {deal?.deal_stages?.deal_value}
                              </Font16>
                            </Grid>

                            <Grid size={{ xs: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>Deal Amount</Font16>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>
                                : {deal?.deal_source?.value}
                              </Font16>
                            </Grid>

                            <Grid size={{ xs: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>Expected Order Date</Font16>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>
                                : {deal?.exp_order_date}
                              </Font16>
                            </Grid>

                            <Grid size={{ xs: 6 }}>
                              <Font16 sx={{ color: "#666666" }}> Last Follow Up</Font16>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Font16 sx={{ color: "#666666" }}>
                                : {deal?.last_follow_up}
                              </Font16>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ) : (
                <Box sx={{
                  backgroundColor: "white",
                  p: 2,
                  borderRadius: "5px",
                  minHeight: "225px",
                  border: "1.5px solid #E6E6E6",
                }}>
                  <Box display="flex" alignItems={"center"} justifyContent={"space-between"}>
                    <Box mt={"4px"} display="flex" alignItems={"center"} gap={1}>
                      <Magnet size={"18px"} />
                      <Typography sx={{ fontSize: "18px", color: "#333333" }}>
                        Deal Details
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: "18px", color: "#333333" }}>
                        {0}
                      </Typography>
                    </Box>

                  </Box>
                  <Divider sx={{ mt: "2px", mb: "5px" }} />
                  <StyledNoData minHeight={"200px"} width="50px" />
                </Box>
              )}

            </Grid>

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
                    <Notebook size={"18px"} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "18px", color: "#333333" }}>
                      Notes
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mt: "2px", mb: "5px" }} />
                <Box mt={1}>
                  <List sx={{ minHeight: "150px", overflowY: "auto", scrollbarWidth: "none" }} >
                    <ListItem
                      sx={{
                        textWrap: "wrap",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        padding: 0,
                      }}
                    >
                      {contactDetailData?.notes}
                    </ListItem>
                  </List>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Font24 sx={{ mb: 1 }}>Order History</Font24>
        <AdvancedTable
          columns={orderHistroy}
          data={orderHistoryData}
        />
      </Box>
    </>
  );
};
export default ContactDetails;
