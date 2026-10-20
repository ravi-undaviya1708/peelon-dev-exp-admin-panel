import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { Suspense, useEffect } from "react";
import { DashboardCards } from "../../../components/StyledCards";
import {
  Activity,
  BoxIcon,
  CheckCircle,
  Contact,
  EditIcon,
  Flag,
  Handshake,
  LoaderCircle,
  Magnet,
  SplinePointer,
  Truck,
} from "lucide-react";
import profileimg from "../../../assets/profileimg.png";
import {
  DashboardFont12,
  Font12,
  Font14,
  Font16,
  Font20,
} from "../../../components/StyledText";
import { useState } from "react";
import { Tabs } from "@mantine/core";
import { ResponseButton, StyledTab } from "../../../components/StyledButtons";
import { dashboardURLS } from "../../../services/api/superadminApi";
import useFetchList from "../../../hooks/useFetchList";
import { useSelector } from "react-redux";
import Loader from "../../../components/loader/Loader";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { StyledNoData } from "../../../components/StyledNoData";
import FactctoryOperationDashboard from "./FactctoryOperationDashboard";
import LemonImage from "../../../assets/Lemon.svg";
import StyledModal from "../../../components/StyledModal";
import TicketList from "./TicketList";
import RaiseTicketModal from "../../../layout/Modal/RaiseTicketModal";
import { useDisclosure } from "@mantine/hooks";
import useApiRequest from "../../../hooks/useApiRequest";
import { Link, useNavigate } from "react-router-dom";
import {
  accountsPathConstants,
  customerPathConstants,
  deliveryDispatchPathConstants,
  factoryPathConstants,
  pathConstantsByRole,
  salesRepresentativePathConstants,
  superAdminPathConstants,
  warehouseManagerPathConstants,
} from "../../../constants/pathConstants";

const formatModuleName = (module) => {
  if (!module) return "-";
  return module
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getModuleInfo = (ticket) => {
  const module = ticket.module?.toLowerCase();
  if (module === "lead" && ticket.lead)
    return { displayId: ticket.lead.lead_id, entityId: ticket.lead.id, hasDetail: true, type: "lead" };
  if (module === "deal" && ticket.deal)
    return { displayId: ticket.deal.deal_id, entityId: ticket.deal.id, hasDetail: true, type: "deal" };
  if ((module === "order" || module === "dispatch" || module === "delivery") && ticket.order)
    return { displayId: ticket.order.order_id, entityId: ticket.order.id, hasDetail: true, type: "order" };
  if (module === "raw_material" && ticket.raw_material)
    return { displayId: ticket.raw_material.material_id, entityId: null, hasDetail: false };
  if (module === "bulk_order" && ticket.bulk_order)
    return { displayId: ticket.bulk_order.bulk_order, entityId: null, hasDetail: false };
  if (module === "quality_control" && ticket.quality_control)
    return { displayId: ticket.quality_control.quality_control, entityId: null, hasDetail: false };
  if (module === "company" && ticket.company)
    return { displayId: ticket.company.company, entityId: ticket.company.id, hasDetail: true, type: "company" };
  if (module === "product_inventory" && ticket.product_inventory)
    return { displayId: `${ticket.product_inventory.batch_number} (${ticket.product_inventory.product_name})`, entityId: null, hasDetail: false };
  if (module === "quotation" && ticket.quotation)
    return { displayId: ticket.quotation.quote_no, entityId: ticket.quotation.id, hasDetail: true, type: "quotation", extra: ticket.quotation.status };
  if (module === "product" && ticket.product)
    return { displayId: ticket.product.product_name, entityId: ticket.product.id, hasDetail: true, type: "product" };
  if (module === "activity" && ticket.activity)
    return { displayId: ticket.activity.activity_id || "Activity", entityId: null, hasDetail: false };
  return null;
};

const SuperAdminDashboard = () => {
  const { put } = useApiRequest();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.loader.isLoading);
  const userType = useSelector((state) => state.auth.userType);
  const [showResponseIndex, setShowResponseIndex] = useState(null);
  const savedTab = localStorage.getItem("selecteClosedTab") || "call";
  const saveOpenTab = localStorage.getItem("selecteOpenTab") || "call";
  const leadsRaiseTicketTab =
    localStorage.getItem("selectedLeadsRaiseTicketTab") || "leads";
  const [selectedTab, setSelectedTab] = useState(savedTab);
  const [openSelectedTab, setOpenSelectedTab] = useState(saveOpenTab);
  const [leadsTicketsTab, setLeadsTicketsTab] = useState(leadsRaiseTicketTab);
  const [opened, { open, close }] = useDisclosure(false);

  const pathConstants = pathConstantsByRole[userType];
  const { DEFAULT, ACTIVITIES, LEADS, DEALS, CONTACTS } = pathConstants;

  const access = [
    "Super Admin",
    "Sales Representative",
    "Delivery & Dispatch",
    "Accounts",
  ].includes(userType);

  const [from, setFrom] = useState({
    modal: "",
    ticketDetail: "",
  });

  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketsData, setTicketsData] = useState([]);
  useEffect(() => {
    localStorage.setItem("selecteClosedTab", selectedTab);
  }, [selectedTab]);

  useEffect(() => {
    localStorage.setItem("selecteOpenTab", openSelectedTab);
  }, [openSelectedTab]);

  useEffect(() => {
    localStorage.setItem("selectedLeadsRaiseTicketTab", leadsRaiseTicketTab);
  }, [leadsTicketsTab]);

  const handleToggle = (index) => {
    setShowResponseIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const apiCall = userType !== "Factory Operation";
  const {
    getRecentLeadsURL,
    getOrderOverview,
    getDashboardURL,
    getClosedDealsURL,
    getOpenActivitiesCount,
    getClosedActivitiesCount,
    closedActivitiesURL,
    openActivityURL,
    getFactoryMenberDashboardTicketsURL,
    getRaiseTicketURL,
    getDeliveryTicketsURL,
    getSalesTicketsURL,
    getAssignedBulkOrdersURL,
    putRaiseTicketURL,
  } = dashboardURLS;
  const { data: dashboardData } = useFetchList(getDashboardURL, {}, apiCall);
  const { data: recentLeadsData } = useFetchList(
    getRecentLeadsURL,
    {},
    apiCall,
  );
  console.log("recentleads", recentLeadsData);

  const { data: orderOverviewData } = useFetchList(
    getOrderOverview,
    {},
    apiCall,
  );
  const { data: closedDealsData } = useFetchList(
    getClosedDealsURL,
    {},
    apiCall,
  );
  const { data: closedActivitiesCountData } = useFetchList(
    getClosedActivitiesCount,
    {},
    apiCall,
  );
  const { data: openActivitiesCountData } = useFetchList(
    getOpenActivitiesCount,
    {},
    apiCall,
  );
  const { data: closedActivitiesData } = useFetchList(
    closedActivitiesURL,
    { activity_type: selectedTab },
    apiCall,
    { showLoader: false },
  );
  const { data: openActivitiesData } = useFetchList(
    openActivityURL,
    { activity_type: openSelectedTab },
    apiCall,
    { showLoader: false },
  );

  const roleBasedTicketURL = {
    "Super Admin": {
      url: getRaiseTicketURL,
      heading: "Tickets",
    },
    "Sales Representative": {
      url: getSalesTicketsURL,
      heading: "Delivered Orders",
    },
    "Delivery & Dispatch": {
      url: getDeliveryTicketsURL,
      heading: "Order Closure ",
    },
    Accounts: {
        url: getSalesTicketsURL,
        heading: "Delivered Orders",
      },
  };
  const finalURL = roleBasedTicketURL[userType]?.url;

  const { data: factoryMemberTicketData } = useFetchList(finalURL, {}, true, {
    showLoader: false,
  });

  const { data: raiseTicketData, refetch: refetchRaisedTicket } = useFetchList(
    getRaiseTicketURL,
    {},
    true,
    {
      showLoader: false,
    },
  );

  useEffect(() => {
    const handler = () => refetchRaisedTicket();
    window.addEventListener("refetch-raised-tickets", handler);
    return () => window.removeEventListener("refetch-raised-tickets", handler);
  }, [refetchRaisedTicket]);

  const { data: assignedOrder } = useFetchList(
    getAssignedBulkOrdersURL,
    {},
    userType === "Sales Representative",
    { showLoader: false },
  );

  const handleEditTicket = (ticket) => {
    (open(), setFrom({ modal: "editTicket", ticketDetail: ticket }));
  };

  const handleModuleNavigation = (moduleInfo) => {
    if (!moduleInfo?.hasDetail) return;
    const base = `..`;
    const { type, entityId, extra } = moduleInfo;
    if (type === "lead") navigate(`${base}/leads/lead-details`, { state: { leadId: entityId } });
    else if (type === "deal") navigate(`${base}/deals/deal-details`, { state: { dealId: entityId } });
    else if (type === "order") navigate(`${base}/orders/order-details`, { state: { orderId: entityId } });
    else if (type === "quotation") navigate(`${base}/invoice-po-and-quote/quotation`, { state: { id: entityId, status: extra } });
    else if (type === "company") navigate(`${base}/contacts/contact-details`, { state: { contactManualId: entityId } });
    else if (type === "product") navigate(`${base}/product-inventory/product-detail`, { state: { productDetailId: entityId } });
  };

  const handleTicketStatusChange = async (ticketId, value) => {
    const response = await put(`${putRaiseTicketURL}/${ticketId}`, {
      ticket_status: value,
    });
    if (response?.settings?.success) {
      refetchRaisedTicket();
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {userType !== "Factory Operation" && (
        <Box>
          {access && (
            <Box
              // display="grid"
              gap={2}
              justifySelf={"right"}
              mb={4}
              alignItems={"center"}
              sx={{
                cursor: "pointer",
              }}
              onClick={() => {
                setTicketsData(factoryMemberTicketData?.tickets || []);
                setTicketModalOpen(true);
              }}
            >
              <Card
                sx={{
                  // width: "100%",
                  bgcolor: "#F6DE04CC", // Yellow
                  borderRadius: 2,
                  position: "relative",
                  boxShadow: "none",
                  padding: 2,
                  // flexDirection: "column",
                }}
              >
                <Box display={"flex"} justifyContent={"space-between"} gap={1}>
                  <Box
                    sx={{
                      backgroundColor: "#FDF9CF",
                      width: 36,
                      height: 36,
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* <Ticket size={"20px"} style={{ color: "#928608" }} /> */}
                    {factoryMemberTicketData?.tickets_count || 0}
                  </Box>
                  <Typography sx={{ fontWeight: 600, fontSize: "18px", mt: 1 }}>
                    {roleBasedTicketURL[userType].heading}
                  </Typography>
                </Box>
                {/* Bottom Row - Text & Number */}
                <Box
                  component="img"
                  src={LemonImage}
                  alt="lemon corner"
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 30,
                    height: 30,
                  }}
                />
              </Card>
            </Box>
          )}
          <Box>
            <Grid container spacing={3}>
              <Grid size={{ sm: 6, xs: 12, md: 3, lg: 3, xl: 3 }}>
                <DashboardCards
                  title={"Total Activities"}
                  link={`${DEFAULT}/${ACTIVITIES}`}
                  number={dashboardData?.total_activites || 0}
                  icon={Activity}
                />
              </Grid>
              <Grid size={{ sm: 6, xs: 12, md: 3, lg: 3, xl: 3 }}>
                <DashboardCards
                  title={"Total Leads"}
                  link={`${DEFAULT}/${LEADS}`}
                  number={dashboardData?.total_leads || 0}
                  icon={Magnet}
                />
              </Grid>
              <Grid size={{ sm: 6, xs: 12, md: 3, lg: 3, xl: 3 }}>
                <DashboardCards
                  title={"Total Deals"}
                  link={`${DEFAULT}/${DEALS}`}
                  number={dashboardData?.total_deals || 0}
                  icon={Handshake}
                />
              </Grid>
              <Grid size={{ sm: 6, xs: 12, md: 3, lg: 3, xl: 3 }}>
                <DashboardCards
                  title={"Total Contacts"}
                  link={`${DEFAULT}/${CONTACTS}`}
                  number={dashboardData?.total_contact || 0}
                  icon={Contact}
                />
              </Grid>
            </Grid>
          </Box>
          {/* Leads&Tickets */}
          <Box mt={3}>
            <Grid container spacing={2}>
              {/* Tabs Section: Recent Add Leads & View Tickets */}
              <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 8 }}>
                <Box
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "2px solid #E6E6E6",
                    display: "flex",
                    flexDirection: "column",
                    height: "470px",
                  }}
                >
                  <Box p={2}>
                    <Typography
                      sx={{
                        fontSize: "18px",
                        color: "#333333",
                      }}
                    >
                      Leads & Raised Tickets{" "}
                      {userType === "Sales Representative" &&
                        " & Assigned Orders"}
                    </Typography>
                  </Box>
                  <Divider
                    sx={{ mt: "2px", mb: "5px", borderBottomWidth: "2px" }}
                  />
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Tabs
                      value={leadsTicketsTab}
                      onChange={setLeadsTicketsTab}
                      color="#FFD700"
                      radius="xl"
                      variant="pills"
                      styles={{
                        tab: {
                          padding: "4px 15px",
                          border: "1px solid #CCCCCC",
                        },
                      }}
                    >
                      <Tabs.List style={{ paddingTop: "10px" }}>
                        <Tabs.Tab value="leads">
                          <Box display={"flex"} gap={1}>
                            <Box>
                              <Font14 sx={{ color: "#444444" }}>
                                Recent Add Leads({recentLeadsData?.length || 0})
                              </Font14>
                            </Box>
                          </Box>
                        </Tabs.Tab>
                        <Tabs.Tab value="raise_tickets">
                          <Box display={"flex"} gap={1}>
                            <Box>
                              <Font14 sx={{ color: "#444444" }}>
                                View Raised Tickets(
                                {raiseTicketData?.tickets?.length || 0} )
                              </Font14>
                            </Box>
                          </Box>
                        </Tabs.Tab>
                        {userType === "Sales Representative" && (
                          <Tabs.Tab value="assigned_orders">
                            <Box display={"flex"} gap={1}>
                              <Box>
                                <Font14 sx={{ color: "#444444" }}>
                                  Assigned Orders(
                                  {assignedOrder?.tickets?.length || 0})
                                </Font14>
                              </Box>
                            </Box>
                          </Tabs.Tab>
                        )}
                      </Tabs.List>
                      <Box
                        sx={{
                          maxHeight: "350px",
                          overflowY: "scroll",
                          // scrollbarWidth: "none",
                        }}
                      >
                        {/* leads */}
                        <Tabs.Panel value="leads">
                          {recentLeadsData && recentLeadsData?.length > 0 ? (
                            recentLeadsData?.map((item, index) => (
                              <Box key={index}>
                                <Box marginTop={2}>
                                  <Grid container spacing={2}>
                                    <Grid
                                      size={{
                                        xs: 12,
                                        sm: 8,
                                        md: 8,
                                        lg: 8,
                                        xl: 8,
                                      }}
                                    >
                                      <Box display={"flex"} gap={3}>
                                        <Box>
                                          <img
                                            src={profileimg}
                                            height={"60px"}
                                            alt="profile"
                                          />
                                        </Box>
                                        <Box alignContent={"center"}>
                                          <Box
                                            display="flex"
                                            flexDirection="column"
                                            gap={0.5}
                                          >
                                            <Box display="flex">
                                              <DashboardFont12
                                                sx={{ minWidth: "90px" }}
                                              >
                                                Lead Name
                                              </DashboardFont12>
                                              <DashboardFont12
                                                sx={{ color: "#333333" }}
                                              >
                                                : {item.company_name || "-"}{" "}
                                                (Company Name)
                                              </DashboardFont12>
                                            </Box>
                                            <Box display="flex">
                                              <DashboardFont12
                                                sx={{ minWidth: "90px" }}
                                              >
                                                Phone No
                                              </DashboardFont12>
                                              <DashboardFont12
                                                sx={{ color: "#333333" }}
                                              >
                                                : {item.mobile || "-"}
                                              </DashboardFont12>
                                            </Box>
                                            {userType ===
                                              "Sales Representative" && (
                                              <Box display="flex">
                                                <DashboardFont12
                                                  sx={{ minWidth: "90px" }}
                                                >
                                                  Next Follow Up
                                                </DashboardFont12>
                                                <DashboardFont12
                                                  sx={{ color: "#333333" }}
                                                >
                                                  : {item.next_follow_up || "-"}
                                                </DashboardFont12>
                                              </Box>
                                            )}
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Grid>
                                    <Grid
                                      size={{
                                        xs: 12,
                                        sm: 4,
                                        md: 4,
                                        lg: 4,
                                        xl: 4,
                                      }}
                                    >
                                      <Box
                                        display="flex"
                                        justifyContent={{
                                          xs: "flex-start",
                                          sm: "flex-end",
                                        }}
                                        alignItems="center"
                                        height="100%"
                                      >
                                        <DashboardFont12
                                          sx={{ color: "#777777" }}
                                        >
                                          From {item.from_field}
                                        </DashboardFont12>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                              </Box>
                            ))
                          ) : (
                            <StyledNoData />
                          )}
                        </Tabs.Panel>
                        {/* raise-tickets */}
                        <Tabs.Panel value="raise_tickets">
                          {raiseTicketData?.tickets &&
                          raiseTicketData?.tickets?.length > 0 ? (
                            raiseTicketData?.tickets?.map((ticket, index) => (
                              <Box key={index}>
                                <Box marginTop={2}>
                                  <Box
                                    display={"flex"}
                                    justifyContent={"space-between"}
                                  >
                                    <Box display={"flex"} gap={3}>
                                      <Box>
                                        <img
                                          src={profileimg}
                                          height={"60px"}
                                          alt="profile"
                                        />
                                      </Box>
                                      <Box alignContent={"center"}>
                                        <Box
                                          display="flex"
                                          flexDirection="column"
                                          gap={0.5}
                                        >
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "90px" }}
                                            >
                                              Ticket No
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {ticket.ticket_no}
                                            </DashboardFont12>
                                          </Box>
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "90px" }}
                                            >
                                              Title
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {ticket.title}
                                            </DashboardFont12>
                                          </Box>
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "90px" }}
                                            >
                                              Module
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {formatModuleName(ticket.module)}
                                            </DashboardFont12>
                                          </Box>
                                          {(() => {
                                            const moduleInfo = getModuleInfo(ticket);
                                            if (!moduleInfo) return null;
                                            return (
                                              <Box display="flex" alignItems="center">
                                                <DashboardFont12 sx={{ minWidth: "90px" }}>
                                                  Module ID
                                                </DashboardFont12>
                                                {moduleInfo.hasDetail ? (
                                                  <DashboardFont12
                                                    onClick={() => handleModuleNavigation(moduleInfo)}
                                                    sx={{
                                                      color: "#16A14E",
                                                      cursor: "pointer",
                                                      textDecoration: "underline",
                                                      fontWeight: 600,
                                                    }}
                                                  >
                                                    : {moduleInfo.displayId}
                                                  </DashboardFont12>
                                                ) : (
                                                  <DashboardFont12 sx={{ color: "#333333" }}>
                                                    : {moduleInfo.displayId}
                                                  </DashboardFont12>
                                                )}
                                              </Box>
                                            );
                                          })()}
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "90px" }}
                                            >
                                              Raised By
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {ticket.raised_by?.name}
                                            </DashboardFont12>
                                          </Box>
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "90px" }}
                                            >
                                              Assigned To
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {ticket?.assigned_to?.name}
                                            </DashboardFont12>
                                          </Box>
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "90px" }}
                                            >
                                              Description
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {ticket?.description}
                                            </DashboardFont12>
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Box>
                                    <Box
                                      display={"flex"}
                                      flexDirection={"column"}
                                      alignItems={"flex-end"}
                                      gap={1}
                                    >
                                      {/* Super Admin: Status Badge + Edit Button */}
                                      {userType === "Super Admin" ? (
                                        <>
                                          <DashboardFont12
                                            sx={{
                                              color:
                                                ticket?.ticket_status ===
                                                "opened"
                                                  ? "#16A14E"
                                                  : ticket?.ticket_status ===
                                                      "in_progress"
                                                    ? "#FFD700"
                                                    : ticket?.ticket_status ===
                                                        "closed"
                                                      ? "#FF5722"
                                                      : "#333333",
                                              textTransform: "capitalize",
                                              fontWeight: 600,
                                              fontSize: "12px",
                                              backgroundColor:
                                                ticket?.ticket_status ===
                                                "opened"
                                                  ? "#E8F5E9"
                                                  : ticket?.ticket_status ===
                                                      "in_progress"
                                                    ? "#FFF9C4"
                                                    : ticket?.ticket_status ===
                                                        "closed"
                                                      ? "#FFEBEE"
                                                      : "#F5F5F5",
                                              padding: "2px 10px",
                                              borderRadius: "12px",
                                            }}
                                          >
                                            {ticket?.ticket_status === "opened"
                                              ? "Opened"
                                              : ticket?.ticket_status ===
                                                  "in_progress"
                                                ? "In Progress"
                                                : ticket?.ticket_status ===
                                                    "closed"
                                                  ? "Closed"
                                                  : ticket?.ticket_status}
                                          </DashboardFont12>
                                          <IconButton
                                            size="small"
                                            onClick={() =>
                                              handleEditTicket(ticket)
                                            }
                                            sx={{
                                              color: "#16A14E",
                                              padding: "4px",
                                              "&:hover": {
                                                backgroundColor: "#E8F5E9",
                                              },
                                            }}
                                          >
                                            <EditIcon
                                              sx={{ fontSize: "18px" }}
                                            />
                                          </IconButton>
                                        </>
                                      ) : (
                                        // Other users: Status Dropdown
                                        <Select
                                          value={ticket?.ticket_status}
                                          onChange={(e) =>
                                            handleTicketStatusChange(
                                              ticket?.id,
                                              e.target.value,
                                            )
                                          }
                                          sx={{
                                            fontSize: "12px",
                                            fontWeight: 600,
                                            minWidth: "110px",
                                            height: "28px",
                                            color:
                                              ticket?.ticket_status === "opened"
                                                ? "#16A14E"
                                                : ticket?.ticket_status ===
                                                    "in_progress"
                                                  ? "#B8860B"
                                                  : ticket?.ticket_status ===
                                                      "closed"
                                                    ? "#FF5722"
                                                    : "#333333",
                                            backgroundColor:
                                              ticket?.ticket_status === "opened"
                                                ? "#E8F5E9"
                                                : ticket?.ticket_status ===
                                                    "in_progress"
                                                  ? "#FFF9C4"
                                                  : ticket?.ticket_status ===
                                                      "closed"
                                                    ? "#FFEBEE"
                                                    : "#F5F5F5",
                                            borderRadius: "12px",
                                            border: "1px solid transparent",
                                            ".MuiSelect-select": {
                                              padding:
                                                "2px 28px 2px 10px !important",
                                            },
                                            ".MuiOutlinedInput-notchedOutline":
                                              {
                                                border: "none",
                                              },
                                            "&:hover .MuiOutlinedInput-notchedOutline":
                                              {
                                                border: "1px solid #CCCCCC",
                                              },
                                            "& .MuiSvgIcon-root": {
                                              color:
                                                ticket?.ticket_status ===
                                                "opened"
                                                  ? "#16A14E"
                                                  : ticket?.ticket_status ===
                                                      "in_progress"
                                                    ? "#B8860B"
                                                    : ticket?.ticket_status ===
                                                        "closed"
                                                      ? "#FF5722"
                                                      : "#333333",
                                            },
                                          }}
                                        >
                                          <MenuItem value="opened">
                                            <Box
                                              display="flex"
                                              alignItems="center"
                                              gap={0.5}
                                            >
                                              <Box
                                                sx={{
                                                  width: "8px",
                                                  height: "8px",
                                                  borderRadius: "50%",
                                                  backgroundColor: "#16A14E",
                                                }}
                                              />
                                              <Typography
                                                sx={{
                                                  fontSize: "12px",
                                                  color: "#16A14E",
                                                  fontWeight: 600,
                                                }}
                                              >
                                                Opened
                                              </Typography>
                                            </Box>
                                          </MenuItem>
                                          <MenuItem value="in_progress">
                                            <Box
                                              display="flex"
                                              alignItems="center"
                                              gap={0.5}
                                            >
                                              <Box
                                                sx={{
                                                  width: "8px",
                                                  height: "8px",
                                                  borderRadius: "50%",
                                                  backgroundColor: "#FFD700",
                                                }}
                                              />
                                              <Typography
                                                sx={{
                                                  fontSize: "12px",
                                                  color: "#B8860B",
                                                  fontWeight: 600,
                                                }}
                                              >
                                                In Progress
                                              </Typography>
                                            </Box>
                                          </MenuItem>
                                          <MenuItem value="closed">
                                            <Box
                                              display="flex"
                                              alignItems="center"
                                              gap={0.5}
                                            >
                                              <Box
                                                sx={{
                                                  width: "8px",
                                                  height: "8px",
                                                  borderRadius: "50%",
                                                  backgroundColor: "#FF5722",
                                                }}
                                              />
                                              <Typography
                                                sx={{
                                                  fontSize: "12px",
                                                  color: "#FF5722",
                                                  fontWeight: 600,
                                                }}
                                              >
                                                Closed
                                              </Typography>
                                            </Box>
                                          </MenuItem>
                                        </Select>
                                      )}
                                    </Box>
                                  </Box>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                              </Box>
                            ))
                          ) : (
                            <StyledNoData />
                          )}
                        </Tabs.Panel>
                        {/*assigned oders*/}
                        {userType === "Sales Representative" && (
                          <Tabs.Panel value="assigned_orders">
                            {assignedOrder?.tickets &&
                            assignedOrder?.tickets?.length > 0 ? (
                              assignedOrder?.tickets?.map((ticket, index) => (
                                <Box key={index}>
                                  <Box marginTop={2}>
                                    <Box
                                      display={"flex"}
                                      justifyContent={"space-between"}
                                    >
                                      <Box display={"flex"} gap={3}>
                                        <Box>
                                          <img
                                            src={profileimg}
                                            height={"60px"}
                                            alt="profile"
                                          />
                                        </Box>
                                        <Box alignContent={"center"}>
                                          <Box
                                            display="flex"
                                            flexDirection="column"
                                            gap={0.5}
                                          >
                                            <Box display="flex">
                                              <DashboardFont12
                                                sx={{ minWidth: "90px" }}
                                              >
                                                Product Name
                                              </DashboardFont12>
                                              <DashboardFont12
                                                sx={{ color: "#333333" }}
                                              >
                                                : {ticket?.product_name}
                                              </DashboardFont12>
                                            </Box>
                                            <Box display="flex">
                                              <DashboardFont12
                                                sx={{ minWidth: "90px" }}
                                              >
                                                Size
                                              </DashboardFont12>
                                              <DashboardFont12
                                                sx={{ color: "#333333" }}
                                              >
                                                : {ticket?.size}
                                              </DashboardFont12>
                                            </Box>
                                            <Box display="flex">
                                              <DashboardFont12
                                                sx={{ minWidth: "90px" }}
                                              >
                                                Volume
                                              </DashboardFont12>
                                              <DashboardFont12
                                                sx={{ color: "#333333" }}
                                              >
                                                : {ticket?.volume}
                                              </DashboardFont12>
                                            </Box>
                                            <Box display="flex">
                                              <DashboardFont12
                                                sx={{ minWidth: "90px" }}
                                              >
                                                Description
                                              </DashboardFont12>
                                              <DashboardFont12
                                                sx={{ color: "#333333" }}
                                              >
                                                : {ticket?.description}
                                              </DashboardFont12>
                                            </Box>
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                  <Divider sx={{ my: 1 }} />
                                </Box>
                              ))
                            ) : (
                              <StyledNoData />
                            )}
                          </Tabs.Panel>
                        )}
                      </Box>
                    </Tabs>
                  </Box>
                </Box>
              </Grid>

              {/* Order Overview */}
              <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
                <Box
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "2px solid #E6E6E6",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box p={2}>
                    <Typography sx={{ fontSize: "18px", color: "#333333" }}>
                      Orders Over View
                    </Typography>
                  </Box>
                  <Divider
                    sx={{ mt: "2px", mb: "2px", borderBottomWidth: "2px" }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "18px",
                      p: 3,
                    }}
                  >
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      sx={{
                        borderRadius: "8px",
                        backgroundColor: "#FBF5B4",
                        p: "12px",
                      }}
                    >
                      <Box display={"flex"} gap={1}>
                        <Box alignContent={"center"}>
                          <CheckCircle size={"18px"} color="#928608" />
                        </Box>
                        <Font16
                          sx={{ alignContent: "center", color: "#112E15" }}
                        >
                          Initiated Orders
                        </Font16>
                      </Box>
                      <Box>
                        <Font20 sx={{ fontWeight: 600, color: "#153A1A" }}>
                          {orderOverviewData?.initiated_orders || 0}
                        </Font20>
                      </Box>
                    </Box>
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      sx={{
                        borderRadius: "8px",
                        backgroundColor: "#FBF5B4",
                        p: "12px",
                      }}
                    >
                      <Box display={"flex"} gap={1}>
                        <Box alignContent={"center"}>
                          <LoaderCircle size={"18px"} color="#928608" />
                        </Box>
                        <Font16
                          sx={{ alignContent: "center", color: "#112E15" }}
                        >
                          In Progress
                        </Font16>
                      </Box>
                      <Box>
                        <Font20 sx={{ fontWeight: 600, color: "#153A1A" }}>
                          {orderOverviewData?.in_progress || 0}
                        </Font20>
                      </Box>
                    </Box>
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      sx={{
                        borderRadius: "8px",
                        backgroundColor: "#FBF5B4",
                        p: "12px",
                      }}
                    >
                      <Box display={"flex"} gap={1}>
                        <Box alignContent={"center"} mt={1}>
                          <Flag size={"18px"} color="#928608" />
                        </Box>
                        <Font16
                          sx={{ alignContent: "center", color: "#112E15" }}
                        >
                          Closed
                        </Font16>
                      </Box>
                      <Box>
                        <Font20 sx={{ fontWeight: 600, color: "#153A1A" }}>
                          {orderOverviewData?.closed || 0}
                        </Font20>
                      </Box>
                    </Box>
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      sx={{
                        borderRadius: "8px",
                        backgroundColor: "#FBF5B4",
                        p: "12px",
                      }}
                    >
                      <Box display={"flex"} gap={1}>
                        <Box alignContent={"center"} mt={1}>
                          <Truck size={"18px"} color="#928608" />
                        </Box>
                        <Font16
                          sx={{ alignContent: "center", color: "#112E15" }}
                        >
                          Dispatched
                        </Font16>
                      </Box>
                      <Box>
                        <Font20 sx={{ fontWeight: 600, color: "#153A1A" }}>
                          {orderOverviewData?.dispatched || 0}
                        </Font20>
                      </Box>
                    </Box>
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      sx={{
                        borderRadius: "8px",
                        backgroundColor: "#FBF5B4",
                        p: "12px",
                      }}
                    >
                      <Box display={"flex"} gap={1}>
                        <Box alignContent={"center"} mt={1}>
                          <BoxIcon size={"18px"} color="#928608" />
                        </Box>
                        <Font16
                          sx={{ alignContent: "center", color: "#112E15" }}
                        >
                          Delivered
                        </Font16>
                      </Box>
                      <Box>
                        <Font20 sx={{ fontWeight: 600, color: "#153A1A" }}>
                          {orderOverviewData?.delivered || 0}
                        </Font20>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box mt={3}>
            <Grid container spacing={2}>
              {/* open activities */}

              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                <Box
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "2px solid #E6E6E6",
                    display: "flex",
                    flexDirection: "column",
                    height: "400px",
                  }}
                >
                  <Box p={2}>
                    <Typography sx={{ fontSize: "18px", color: "#333333" }}>
                      Open Activities
                    </Typography>
                  </Box>
                  <Divider
                    sx={{ mt: "2px", mb: "5px", borderBottomWidth: "2px" }}
                  />
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Tabs
                      value={openSelectedTab}
                      onChange={setOpenSelectedTab}
                      color="#FFD700"
                      radius="xl"
                      variant="pills"
                      styles={{
                        tab: {
                          padding: "4px 15px",
                          border: "1px solid #CCCCCC",
                        },
                      }}
                    >
                      <Tabs.List style={{ paddingTop: "10px" }}>
                        <Tabs.Tab value="call">
                          <Box display={"flex"} gap={1}>
                            <Box>
                              <Font14 sx={{ color: "#444444" }}>
                                Call ({openActivitiesCountData?.open_calls || 0}
                                )
                              </Font14>
                            </Box>
                          </Box>
                        </Tabs.Tab>
                        <Tabs.Tab value="meeting">
                          <Box display={"flex"} gap={1}>
                            <Box>
                              <Font14 sx={{ color: "#444444" }}>
                                Meetings (
                                {openActivitiesCountData?.open_meetings || 0})
                              </Font14>
                            </Box>
                          </Box>
                        </Tabs.Tab>
                        <Tabs.Tab value="email">
                          <Box display={"flex"} gap={1}>
                            <Box>
                              <Font14 sx={{ color: "#444444" }}>
                                Email (
                                {openActivitiesCountData?.open_emails || 0})
                              </Font14>
                            </Box>
                          </Box>
                        </Tabs.Tab>
                        <Tabs.Tab value="reminder">
                          <Box display={"flex"} gap={1}>
                            <Box>
                              <Font14 sx={{ color: "#444444" }}>
                                Reminder (
                                {openActivitiesCountData?.open_reminders || 0})
                              </Font14>
                            </Box>
                          </Box>
                        </Tabs.Tab>
                      </Tabs.List>
                      <Box
                        sx={{
                          maxHeight: "250px",
                          overflowY: "scroll",
                          // scrollbarWidth: "none",
                        }}
                      >
                        <Tabs.Panel value="call">
                          {openActivitiesData &&
                          openActivitiesData.length > 0 ? (
                            openActivitiesData.map((item, index) => (
                              <Box key={index}>
                                <Box
                                  marginTop={2}
                                  display={"flex"}
                                  flexWrap={"wrap"}
                                  justifyContent={"space-between"}
                                >
                                  <Box>
                                    <Box display={"flex"} gap={3}>
                                      <Box>
                                        <img
                                          src={item?.image || profileimg}
                                          height={"60px"}
                                          alt="profile"
                                        />
                                      </Box>
                                      <Box alignContent={"center"}>
                                        <Box
                                          display="flex"
                                          flexDirection="column"
                                          gap={0.5}
                                        >
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "70px" }}
                                            >
                                              Call Id
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {item?.activity_id || ""}
                                            </DashboardFont12>
                                          </Box>
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "70px" }}
                                            >
                                              Name
                                            </DashboardFont12>
                                            {item?.assigned_to?.length > 0 ? (
                                              <DashboardFont12
                                                sx={{ color: "#333333" }}
                                              >
                                                : {item.assigned_to.join(", ")}
                                              </DashboardFont12>
                                            ) : (
                                              <DashboardFont12
                                                sx={{ color: "red" }}
                                              >
                                                : (No one assigned)
                                              </DashboardFont12>
                                            )}
                                          </Box>
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "70px" }}
                                            >
                                              Subject
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {item.subject}
                                            </DashboardFont12>
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                  <Box
                                    display={"flex"}
                                    flexDirection={"column"}
                                    justifyContent={"space-between"}
                                    alignItems={"flex-end"}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        color: "#16A14E",
                                      }}
                                    >
                                      {item?.created_by}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                              </Box>
                            ))
                          ) : (
                            <StyledNoData minHeight="250px" />
                          )}
                        </Tabs.Panel>
                        <Tabs.Panel value="meeting">
                          {openActivitiesData &&
                          openActivitiesData.length > 0 ? (
                            openActivitiesData.map((item, index) => (
                              <Box key={index}>
                                <Box
                                  marginTop={2}
                                  display={"flex"}
                                  flexWrap={"wrap"}
                                  justifyContent={"space-between"}
                                >
                                  <Box>
                                    <Box display={"flex"} gap={3}>
                                      <Box>
                                        <img
                                          src={item?.image || profileimg}
                                          height={"60px"}
                                          alt="profile"
                                        />
                                      </Box>
                                      <Box alignContent={"center"}>
                                        <Box
                                          display="flex"
                                          flexDirection="column"
                                          gap={0.5}
                                        >
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "80px" }}
                                            >
                                              Meeting Id
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {item?.activity_id || ""}
                                            </DashboardFont12>
                                          </Box>
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "80px" }}
                                            >
                                              Name
                                            </DashboardFont12>
                                            {item?.assigned_to?.length > 0 ? (
                                              <DashboardFont12
                                                sx={{ color: "#333333" }}
                                              >
                                                : {item.assigned_to.join(", ")}
                                              </DashboardFont12>
                                            ) : (
                                              <DashboardFont12
                                                sx={{ color: "red" }}
                                              >
                                                : (No one assigned)
                                              </DashboardFont12>
                                            )}
                                          </Box>
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "80px" }}
                                            >
                                              Subject
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {item?.subject}
                                            </DashboardFont12>
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                  <Box
                                    display={"flex"}
                                    flexDirection={"column"}
                                    justifyContent={"space-between"}
                                    alignItems={"flex-end"}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        color: "#16A14E",
                                      }}
                                    >
                                      {item?.created_by}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                              </Box>
                            ))
                          ) : (
                            <StyledNoData minHeight="250px" />
                          )}
                        </Tabs.Panel>
                        <Tabs.Panel value="email">
                          {openActivitiesData &&
                          openActivitiesData.length > 0 ? (
                            openActivitiesData.map((item, index) => (
                              <Box key={index}>
                                <Box
                                  marginTop={2}
                                  display={"flex"}
                                  flexWrap={"wrap"}
                                  justifyContent={"space-between"}
                                >
                                  <Box>
                                    <Box display={"flex"} gap={3}>
                                      <Box>
                                        <img
                                          src={item?.image || profileimg}
                                          height={"60px"}
                                          alt="profile"
                                        />
                                      </Box>
                                      <Box alignContent={"center"}>
                                        <Box
                                          display="flex"
                                          flexDirection="column"
                                          gap={0.5}
                                        >
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "70px" }}
                                            >
                                              Email Id
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {item?.activity_id || ""}
                                            </DashboardFont12>
                                          </Box>
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "70px" }}
                                            >
                                              Name
                                            </DashboardFont12>
                                            {item?.assigned_to?.length > 0 ? (
                                              <DashboardFont12
                                                sx={{ color: "#333333" }}
                                              >
                                                : {item.assigned_to.join(", ")}
                                              </DashboardFont12>
                                            ) : (
                                              <DashboardFont12
                                                sx={{ color: "red" }}
                                              >
                                                : (No one assigned)
                                              </DashboardFont12>
                                            )}
                                          </Box>
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "70px" }}
                                            >
                                              Subject
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {item.subject}
                                            </DashboardFont12>
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                  <Box
                                    display={"flex"}
                                    flexDirection={"column"}
                                    justifyContent={"space-between"}
                                    alignItems={"flex-end"}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        color: "#16A14E",
                                      }}
                                    >
                                      {item?.created_by}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                              </Box>
                            ))
                          ) : (
                            <StyledNoData minHeight="250px" />
                          )}
                        </Tabs.Panel>
                        <Tabs.Panel value="reminder">
                          {openActivitiesData &&
                          openActivitiesData.length > 0 ? (
                            openActivitiesData.map((item, index) => (
                              <Box key={index}>
                                <Box
                                  marginTop={2}
                                  display={"flex"}
                                  flexWrap={"wrap"}
                                  justifyContent={"space-between"}
                                >
                                  <Box>
                                    <Box display={"flex"} gap={3}>
                                      <Box>
                                        <img
                                          src={item?.image || profileimg}
                                          height={"60px"}
                                          alt="profile"
                                        />
                                      </Box>
                                      <Box alignContent={"center"}>
                                        <Box
                                          display="flex"
                                          flexDirection="column"
                                          gap={0.5}
                                        >
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "90px" }}
                                            >
                                              Reminder Id
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {item?.activity_id || ""}
                                            </DashboardFont12>
                                          </Box>
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "90px" }}
                                            >
                                              Name
                                            </DashboardFont12>
                                            {item?.assigned_to?.length > 0 ? (
                                              <DashboardFont12
                                                sx={{ color: "#333333" }}
                                              >
                                                : {item.assigned_to.join(", ")}
                                              </DashboardFont12>
                                            ) : (
                                              <DashboardFont12
                                                sx={{ color: "red" }}
                                              >
                                                : (No one assigned)
                                              </DashboardFont12>
                                            )}
                                          </Box>
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "90px" }}
                                            >
                                              Subject
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {item.subject}
                                            </DashboardFont12>
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                  <Box
                                    display={"flex"}
                                    flexDirection={"column"}
                                    justifyContent={"space-between"}
                                    alignItems={"flex-end"}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        color: "#16A14E",
                                      }}
                                    >
                                      {item?.created_by}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                              </Box>
                            ))
                          ) : (
                            <StyledNoData minHeight="250px" />
                          )}
                        </Tabs.Panel>
                      </Box>
                    </Tabs>
                  </Box>
                </Box>
              </Grid>
              {/* closed activities */}
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                <Box
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "2px solid #E6E6E6",
                    display: "flex",
                    flexDirection: "column",
                    height: "400px",
                  }}
                >
                  <Box p={2}>
                    <Typography sx={{ fontSize: "18px", color: "#333333" }}>
                      Closed Activities
                    </Typography>
                  </Box>
                  <Divider
                    sx={{ mt: "2px", mb: "5px", borderBottomWidth: "2px" }}
                  />
                  <Box sx={{ px: 2, py: 1 }}>
                    <Tabs
                      value={selectedTab}
                      onChange={setSelectedTab}
                      color="#FFD700"
                      radius="xl"
                      variant="pills"
                      styles={{
                        tab: {
                          padding: "4px 15px",
                          border: "1px solid #CCCCCC",
                        },
                      }}
                    >
                      <Tabs.List style={{ paddingTop: "10px" }}>
                        <Tabs.Tab value="call">
                          <Box display={"flex"} gap={1}>
                            <Box>
                              <Font14 sx={{ color: "#444444" }}>
                                Call (
                                {closedActivitiesCountData?.closed_calls || 0})
                              </Font14>
                            </Box>
                          </Box>
                        </Tabs.Tab>
                        <Tabs.Tab value="meeting">
                          <Box display={"flex"} gap={1}>
                            <Box>
                              <Font14 sx={{ color: "#444444" }}>
                                Meetings (
                                {closedActivitiesCountData?.closed_meetings ||
                                  0}
                                )
                              </Font14>
                            </Box>
                          </Box>
                        </Tabs.Tab>
                        <Tabs.Tab value="email">
                          <Box display={"flex"} gap={1}>
                            <Box>
                              <Font14 sx={{ color: "#444444" }}>
                                Email (
                                {closedActivitiesCountData?.closed_emails || 0})
                              </Font14>
                            </Box>
                          </Box>
                        </Tabs.Tab>
                        <Tabs.Tab value="reminder">
                          <Box display={"flex"} gap={1}>
                            <Box>
                              <Font14 sx={{ color: "#444444" }}>
                                Reminder (
                                {closedActivitiesCountData?.closed_reminders ||
                                  0}
                                )
                              </Font14>
                            </Box>
                          </Box>
                        </Tabs.Tab>
                      </Tabs.List>
                      <Box
                        sx={{
                          maxHeight: "250px",
                          overflowY: "auto",
                          // scrollbarWidth: "none",
                        }}
                      >
                        <Tabs.Panel value="call">
                          {closedActivitiesData &&
                          closedActivitiesData.length > 0 ? (
                            closedActivitiesData.map((item, index) => (
                              <Box key={index}>
                                <Box
                                  marginTop={2}
                                  display={"flex"}
                                  flexWrap={"wrap"}
                                  justifyContent={"space-between"}
                                >
                                  <Box>
                                    <Box display={"flex"} gap={3}>
                                      <Box>
                                        <img
                                          src={item?.image || profileimg}
                                          height={"60px"}
                                        />
                                      </Box>
                                      <Box alignContent={"center"}>
                                        <Box
                                          display="flex"
                                          flexDirection="column"
                                          gap={0.5}
                                        >
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "70px" }}
                                            >
                                              Call Id
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {item?.activity_id || ""}
                                            </DashboardFont12>
                                          </Box>
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "70px" }}
                                            >
                                              Name
                                            </DashboardFont12>
                                            {item?.assigned_to?.length > 0 ? (
                                              <DashboardFont12
                                                sx={{ color: "#333333" }}
                                              >
                                                : {item.assigned_to.join(", ")}
                                              </DashboardFont12>
                                            ) : (
                                              <DashboardFont12
                                                sx={{ color: "red" }}
                                              >
                                                : (No one assigned)
                                              </DashboardFont12>
                                            )}
                                          </Box>
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "70px" }}
                                            >
                                              Subject
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {item.subject}
                                            </DashboardFont12>
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                  <Box
                                    display={"flex"}
                                    flexDirection={"column"}
                                    justifyContent={"space-between"}
                                    alignItems={"flex-end"}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        color: "#16A14E",
                                      }}
                                    >
                                      {item?.created_by}
                                    </Typography>
                                    <ResponseButton
                                      size="small"
                                      onClick={() => handleToggle(index)}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: "14px",
                                          color: "#16A14E",
                                          padding: "0px 5px",
                                        }}
                                      >
                                        View Response
                                      </Typography>
                                      <KeyboardArrowDownIcon
                                        sx={{
                                          transform:
                                            showResponseIndex === index
                                              ? "rotate(180deg)"
                                              : "rotate(0deg)",
                                          transition: "transform 0.5s ease",
                                        }}
                                      />
                                    </ResponseButton>
                                  </Box>
                                </Box>
                                <Box mt={1}>
                                  {showResponseIndex === index && (
                                    <Box mt={2}>
                                      <Typography
                                        sx={{
                                          fontSize: "14px",
                                          color: "#666666",
                                        }}
                                      >
                                        {item?.response || "no response"}
                                      </Typography>
                                    </Box>
                                  )}
                                </Box>
                                <Divider />
                              </Box>
                            ))
                          ) : (
                            <StyledNoData minHeight="250px" />
                          )}
                        </Tabs.Panel>
                        <Tabs.Panel value="meeting">
                          {closedActivitiesData &&
                          closedActivitiesData.length > 0 ? (
                            closedActivitiesData.map((item, index) => (
                              <Box key={index}>
                                <Box
                                  marginTop={2}
                                  display={"flex"}
                                  flexWrap={"wrap"}
                                  justifyContent={"space-between"}
                                >
                                  <Box>
                                    <Box display={"flex"} gap={3}>
                                      <Box>
                                        <img
                                          src={item?.image || profileimg}
                                          height={"60px"}
                                        />
                                      </Box>
                                      <Box alignContent={"center"}>
                                        <Box
                                          display="flex"
                                          flexDirection="column"
                                          gap={0.5}
                                        >
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "80px" }}
                                            >
                                              Meeting Id
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {item?.activity_id || ""}
                                            </DashboardFont12>
                                          </Box>
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "80px" }}
                                            >
                                              Name
                                            </DashboardFont12>
                                            {item?.assigned_to?.length > 0 ? (
                                              <DashboardFont12
                                                sx={{ color: "#333333" }}
                                              >
                                                : {item.assigned_to.join(", ")}
                                              </DashboardFont12>
                                            ) : (
                                              <DashboardFont12
                                                sx={{ color: "red" }}
                                              >
                                                : (No one assigned)
                                              </DashboardFont12>
                                            )}
                                          </Box>
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "80px" }}
                                            >
                                              Subject
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {item?.subject}
                                            </DashboardFont12>
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                  <Box
                                    display={"flex"}
                                    flexDirection={"column"}
                                    justifyContent={"space-between"}
                                    alignItems={"flex-end"}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        color: "#16A14E",
                                      }}
                                    >
                                      {item?.created_by}
                                    </Typography>
                                    <ResponseButton
                                      size="small"
                                      onClick={() => handleToggle(index)}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: "14px",
                                          color: "#16A14E",
                                          padding: "0px 5px",
                                        }}
                                      >
                                        View Response
                                      </Typography>
                                      <KeyboardArrowDownIcon
                                        sx={{
                                          transform:
                                            showResponseIndex === index
                                              ? "rotate(180deg)"
                                              : "rotate(0deg)",
                                          transition: "transform 0.5s ease",
                                        }}
                                      />
                                    </ResponseButton>
                                  </Box>
                                </Box>
                                <Box mt={1}>
                                  {showResponseIndex === index && (
                                    <Box mt={2}>
                                      <Typography
                                        sx={{
                                          fontSize: "14px",
                                          color: "#666666",
                                        }}
                                      >
                                        {item?.response || "no response"}
                                      </Typography>
                                    </Box>
                                  )}
                                </Box>
                                <Divider />
                              </Box>
                            ))
                          ) : (
                            <StyledNoData minHeight="250px" />
                          )}
                        </Tabs.Panel>
                        <Tabs.Panel value="email">
                          {closedActivitiesData &&
                          closedActivitiesData.length > 0 ? (
                            closedActivitiesData.map((item, index) => (
                              <Box key={index}>
                                <Box
                                  marginTop={2}
                                  display={"flex"}
                                  flexWrap={"wrap"}
                                  justifyContent={"space-between"}
                                >
                                  <Box>
                                    <Box display={"flex"} gap={3}>
                                      <Box>
                                        <img
                                          src={item?.image || profileimg}
                                          height={"60px"}
                                        />
                                      </Box>
                                      <Box alignContent={"center"}>
                                        <Box
                                          display="flex"
                                          flexDirection="column"
                                          gap={0.5}
                                        >
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "70px" }}
                                            >
                                              Email Id
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {item?.activity_id || ""}
                                            </DashboardFont12>
                                          </Box>
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "70px" }}
                                            >
                                              Name
                                            </DashboardFont12>
                                            {item?.assigned_to?.length > 0 ? (
                                              <DashboardFont12
                                                sx={{ color: "#333333" }}
                                              >
                                                : {item.assigned_to.join(", ")}
                                              </DashboardFont12>
                                            ) : (
                                              <DashboardFont12
                                                sx={{ color: "red" }}
                                              >
                                                : (No one assigned)
                                              </DashboardFont12>
                                            )}
                                          </Box>
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "70px" }}
                                            >
                                              Subject
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {item.subject}
                                            </DashboardFont12>
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                  <Box
                                    display={"flex"}
                                    flexDirection={"column"}
                                    justifyContent={"space-between"}
                                    alignItems={"flex-end"}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        color: "#16A14E",
                                      }}
                                    >
                                      {item?.created_by}
                                    </Typography>
                                    <ResponseButton
                                      size="small"
                                      onClick={() => handleToggle(index)}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: "14px",
                                          color: "#16A14E",
                                          padding: "0px 5px",
                                        }}
                                      >
                                        View Response
                                      </Typography>
                                      <KeyboardArrowDownIcon
                                        sx={{
                                          transform:
                                            showResponseIndex === index
                                              ? "rotate(180deg)"
                                              : "rotate(0deg)",
                                          transition: "transform 0.5s ease",
                                        }}
                                      />
                                    </ResponseButton>
                                  </Box>
                                </Box>
                                <Box mt={1}>
                                  {showResponseIndex === index && (
                                    <Box mt={2}>
                                      <Typography
                                        sx={{
                                          fontSize: "14px",
                                          color: "#666666",
                                        }}
                                      >
                                        {item?.response || "no response"}
                                      </Typography>
                                    </Box>
                                  )}
                                </Box>
                                <Divider />
                              </Box>
                            ))
                          ) : (
                            <StyledNoData minHeight="250px" />
                          )}
                        </Tabs.Panel>
                        <Tabs.Panel value="reminder">
                          {closedActivitiesData &&
                          closedActivitiesData.length > 0 ? (
                            closedActivitiesData.map((item, index) => (
                              <Box key={index}>
                                <Box
                                  marginTop={2}
                                  display={"flex"}
                                  flexWrap={"wrap"}
                                  justifyContent={"space-between"}
                                >
                                  <Box>
                                    <Box display={"flex"} gap={3}>
                                      <Box>
                                        <img
                                          src={item?.image || profileimg}
                                          height={"60px"}
                                        />
                                      </Box>
                                      <Box alignContent={"center"}>
                                        <Box
                                          display="flex"
                                          flexDirection="column"
                                          gap={0.5}
                                        >
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "90px" }}
                                            >
                                              Reminder Id
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {item?.activity_id || ""}
                                            </DashboardFont12>
                                          </Box>
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "90px" }}
                                            >
                                              Name
                                            </DashboardFont12>
                                            {item?.assigned_to?.length > 0 ? (
                                              <DashboardFont12
                                                sx={{ color: "#333333" }}
                                              >
                                                : {item.assigned_to.join(", ")}
                                              </DashboardFont12>
                                            ) : (
                                              <DashboardFont12
                                                sx={{ color: "red" }}
                                              >
                                                : (No one assigned)
                                              </DashboardFont12>
                                            )}
                                          </Box>
                                          <Box display="flex">
                                            <DashboardFont12
                                              sx={{ minWidth: "90px" }}
                                            >
                                              Subject
                                            </DashboardFont12>
                                            <DashboardFont12
                                              sx={{ color: "#333333" }}
                                            >
                                              : {item.subject}
                                            </DashboardFont12>
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                  <Box
                                    display={"flex"}
                                    flexDirection={"column"}
                                    justifyContent={"space-between"}
                                    alignItems={"flex-end"}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        color: "#16A14E",
                                      }}
                                    >
                                      {item?.created_by}
                                    </Typography>
                                    <ResponseButton
                                      size="small"
                                      onClick={() => handleToggle(index)}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: "14px",
                                          color: "#16A14E",
                                          padding: "0px 5px",
                                        }}
                                      >
                                        View Response
                                      </Typography>
                                      <KeyboardArrowDownIcon
                                        sx={{
                                          transform:
                                            showResponseIndex === index
                                              ? "rotate(180deg)"
                                              : "rotate(0deg)",
                                          transition: "transform 0.5s ease",
                                        }}
                                      />
                                    </ResponseButton>
                                  </Box>
                                </Box>
                                <Box mt={1}>
                                  {showResponseIndex === index && (
                                    <Box mt={2}>
                                      <Typography
                                        sx={{
                                          fontSize: "14px",
                                          color: "#666666",
                                        }}
                                      >
                                        {item?.response || "no response"}
                                      </Typography>
                                    </Box>
                                  )}
                                </Box>
                                <Divider />
                              </Box>
                            ))
                          ) : (
                            <StyledNoData minHeight="250px" />
                          )}
                        </Tabs.Panel>
                      </Box>
                    </Tabs>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
          {/* Closed deals */}
          <Box mt={3}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                <Box
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "2px solid #E6E6E6",
                    display: "flex",
                    flexDirection: "column",
                    height: "400px",
                  }}
                >
                  <Box p={2}>
                    <Typography
                      sx={{
                        fontSize: "18px",
                        color: "#333333",
                      }}
                    >
                      Closed Deals
                    </Typography>
                  </Box>

                  <Divider
                    sx={{
                      mt: "2px",
                      mb: "5px",
                      borderBottomWidth: "2px",
                    }}
                  />
                  <Box
                    sx={{
                      flex: 1,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        maxHeight: "350px",
                        overflowY: "auto",
                        // scrollbarWidth: "none",
                      }}
                    >
                      {closedDealsData && closedDealsData.length > 0 ? (
                        closedDealsData.map((deal, index) => (
                          <Box key={index}>
                            <Box py={2}>
                              <Box display={"flex"} gap={3}>
                                <Box>
                                  <img
                                    src={profileimg}
                                    height={"60px"}
                                    alt="profile"
                                  />
                                </Box>
                                <Box alignContent={"center"}>
                                  <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap={0.5}
                                  >
                                    <Box display="flex">
                                      <DashboardFont12
                                        sx={{ minWidth: "100px" }}
                                      >
                                        Name
                                      </DashboardFont12>
                                      <DashboardFont12
                                        sx={{ color: "#333333" }}
                                      >
                                        : {deal.owner_name}
                                      </DashboardFont12>
                                    </Box>
                                    <Box display="flex">
                                      <DashboardFont12
                                        sx={{ minWidth: "100px" }}
                                      >
                                        Closed Deals
                                      </DashboardFont12>
                                      <DashboardFont12
                                        sx={{ color: "#333333" }}
                                      >
                                        : {deal.closed_deals}
                                      </DashboardFont12>
                                    </Box>
                                    <Box display="flex">
                                      <DashboardFont12
                                        sx={{ minWidth: "100px" }}
                                      >
                                        Sales
                                      </DashboardFont12>
                                      <DashboardFont12
                                        sx={{
                                          color: "#333333",
                                          fontWeight: 900,
                                        }}
                                      >
                                        : {deal.sales}
                                      </DashboardFont12>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                            <Divider />
                          </Box>
                        ))
                      ) : (
                        <StyledNoData />
                      )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
      {userType == "Factory Operation" && <FactctoryOperationDashboard />}
      <StyledModal
        opened={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        title="Tickets"
        size="xl"
        buttonText={null} // No submit button
        buttonCancel="Close"
      >
        <TicketList tickets={ticketsData} />
      </StyledModal>

      {opened && (
        <Suspense fallback={null}>
          <RaiseTicketModal
            opened={opened}
            onClose={close}
            from={from}
            setFrom={setFrom}
            refetchRaisedTicket={refetchRaisedTicket}
          />
        </Suspense>
      )}
    </>
  );
};

export default SuperAdminDashboard;
