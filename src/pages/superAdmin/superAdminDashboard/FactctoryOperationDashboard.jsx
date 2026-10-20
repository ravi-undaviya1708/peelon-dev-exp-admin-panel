import {
  Box,
  Card,
  Typography,
  Chip,
  Select,
  MenuItem,
  FormControl,
  CardContent,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DashboardCards } from "../../../components/StyledCards";
import {
  BoxIcon,
  CheckCircle,
  Flag,
  LoaderCircle,
  Ticket,
  Truck,
  User,
  UserCheck,
} from "lucide-react";
import Loader from "../../../components/loader/Loader";
import useFetchList from "../../../hooks/useFetchList";
import { dashboardURLS } from "../../../services/api/superadminApi";
import { useSelector } from "react-redux";
import { AdvancedTable } from "../../../components/AdvanceTable";
import { factctoryDashboardColumns } from "./FactctoryOperationTable";
import Pagination from "../../../components/pagination/Pagination";
import useApiRequest from "../../../hooks/useApiRequest";
import StyledModal from "../../../components/StyledModal";
import LemonImage from "../../../assets/Lemon.svg";
import TicketList from "./TicketList";
import { pathConstantsByRole } from "../../../constants/pathConstants";

const FactctoryOperationDashboard = () => {
  const userType = useSelector((state) => state.auth.userType);
  const isLoading = useSelector((state) => state.loader.isLoading);
  const { put } = useApiRequest();
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketsData, setTicketsData] = useState([]);
  const [page, setPage] = useState(1);

  const pathConstants = pathConstantsByRole[userType];
  const { DEFAULT, ORDERS, DELIVERIESANDDISPATCH } = pathConstants;

  const {
    getOrderOverview,
    getfactoryOperationDashboardURL,
    getRaiseTicketURL,
    putRaiseTicketURL,
    getFactoryMenberDashboardTicketsURL,
  } = dashboardURLS;

  const { data: factoryMemberTicketData } = useFetchList(
    getFactoryMenberDashboardTicketsURL,
    {},
    true,
    { showLoader: false },
  );

  const { data: orderOverviewData } = useFetchList(getOrderOverview, {}, true, {
    showLoader: false,
  });

  const {
    data: factoryOperationDashboardData,
    pagination: factoryOperationPaginationData,
  } = useFetchList(getfactoryOperationDashboardURL, { page }, true, {
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

  if (isLoading) {
    return <Loader />;
  }

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      opened: "#FF9800",
      in_progress: "#2196F3",
      resolved: "#4CAF50",
      closed: "#9E9E9E",
    };
    return statusColors[status] || "#9E9E9E";
  };

  const handleTicketStatusChange = async (ticketId, newStatus) => {
    try {
      const response = await put(`${putRaiseTicketURL}/${ticketId}`, {
        ticket_status: newStatus,
      });

      if (response?.settings?.success) {
        await refetchRaisedTicket();
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  const cards = [
    {
      title: "Initiated Orders",
      number: orderOverviewData?.initiated_orders || 0,
      icon: CheckCircle,
      link: `${DEFAULT}/${ORDERS}`,
      selectedTab: "initiated",
    },
    {
      title: "In Progress",
      number: orderOverviewData?.in_progress || 0,
      icon: LoaderCircle,
      link: `${DEFAULT}/${ORDERS}`,
      selectedTab: "in_progress",
    },
    {
      title: "Closed",
      number: orderOverviewData?.closed || 0,
      icon: Flag,
      link: `${DEFAULT}/${ORDERS}`,
      selectedTab: "closed",
    },
    {
      title: "Dispatched",
      number: orderOverviewData?.dispatched || 0,
      icon: Truck,
      link: `${DEFAULT}/${DELIVERIESANDDISPATCH}`,
      selectedTab: "Dispatch",
    },
    {
      title: "Delivered",
      number: orderOverviewData?.delivered || 0,
      icon: BoxIcon,
      link: `${DEFAULT}/${DELIVERIESANDDISPATCH}`,
      selectedTab: "Deliveries",
    },
  ];
  const handleSecltedTab = (selectedTab) => {
    selectedTab === "in_progress" ||
    selectedTab == "closed" ||
    selectedTab == "initiated"
      ? localStorage.setItem("orderStatus", selectedTab)
      : localStorage.setItem("selectedDelivery&DispatchTab", selectedTab);
  };

  return (
    <Box>
      {/* Order Status Cards */}
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
              {factoryMemberTicketData?.tickets_count}
            </Box>
            <Typography sx={{ fontWeight: 600, fontSize: "18px" }}>
              Tickets
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
      <Box
        display="grid"
        gap={2}
        gridTemplateColumns={{
          xs: "1fr",
          sm: "1fr 1fr",
          md: "1fr 1fr 1fr",
          lg: "1fr 1fr 1fr 1fr 1fr",
        }}
        mb={4}
      >
        {cards?.map((card, idx) => (
          <DashboardCards
            key={idx}
            {...card}
            link={card?.link}
            onClick={
              card?.selectedTab
                ? () => handleSecltedTab(card.selectedTab)
                : undefined
            }
          />
        ))}
      </Box>

      {/* Raised Tickets Section */}
      {/* Raised Tickets Section */}
      {raiseTicketData?.tickets && raiseTicketData.tickets.length > 0 && (
        <Box mb={4}>
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <Ticket size={24} color="#F6DE04" />
            <Typography variant="h5" fontWeight={600}>
              Raised Tickets
            </Typography>
            <Chip
              label={raiseTicketData.tickets.length}
              size="small"
              sx={{
                backgroundColor: "#F6DE04CC",
                color: "#000",
                fontWeight: 600,
              }}
            />
          </Box>

          <Box
            display="grid"
            gap={3}
            gridTemplateColumns={{
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            }}
            sx={{
              maxHeight: "500px",
              overflowY: "auto",
              overflowX: "hidden",
              paddingRight: 1,
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "#555",
                },
              },
            }}
          >
            {raiseTicketData.tickets.map((ticket) => (
              <Card
                key={ticket.id}
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent>
                  {/* Header - Ticket Number and Status */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Ticket size={18} color="#666" />
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="text.secondary"
                      >
                        {ticket.ticket_no}
                      </Typography>
                    </Box>
                    <FormControl size="small" sx={{ minWidth: 130 }}>
                      <Select
                        value={ticket?.ticket_status}
                        onChange={(e) =>
                          handleTicketStatusChange(ticket?.id, e.target.value)
                        }
                        sx={{
                          fontSize: "12px",
                          fontWeight: 600,
                          minWidth: "110px",
                          height: "28px",
                          color:
                            ticket?.ticket_status === "opened"
                              ? "#16A14E"
                              : ticket?.ticket_status === "in_progress"
                                ? "#B8860B"
                                : ticket?.ticket_status === "closed"
                                  ? "#FF5722"
                                  : "#333333",
                          backgroundColor:
                            ticket?.ticket_status === "opened"
                              ? "#E8F5E9"
                              : ticket?.ticket_status === "in_progress"
                                ? "#FFF9C4"
                                : ticket?.ticket_status === "closed"
                                  ? "#FFEBEE"
                                  : "#F5F5F5",
                          borderRadius: "12px",
                          border: "1px solid transparent",
                          ".MuiSelect-select": {
                            padding: "2px 28px 2px 10px !important",
                          },
                          ".MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            border: "1px solid #CCCCCC",
                          },
                          "& .MuiSvgIcon-root": {
                            color:
                              ticket?.ticket_status === "opened"
                                ? "#16A14E"
                                : ticket?.ticket_status === "in_progress"
                                  ? "#B8860B"
                                  : ticket?.ticket_status === "closed"
                                    ? "#FF5722"
                                    : "#333333",
                          },
                        }}
                      >
                        <MenuItem value="opened">
                          <Box display="flex" alignItems="center" gap={0.5}>
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
                          <Box display="flex" alignItems="center" gap={0.5}>
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
                          <Box display="flex" alignItems="center" gap={0.5}>
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
                    </FormControl>
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    mb={1.5}
                    fontSize="16px"
                  >
                    {ticket.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={2}
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: 1.5,
                    }}
                  >
                    {ticket.description}
                  </Typography>

                  {/* Module Badge */}
                  <Box mb={2}>
                    <Chip
                      label={ticket.module ? ticket.module.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "N/A"}
                      size="small"
                      sx={{
                        backgroundColor: "#E3F2FD",
                        color: "#1976D2",
                        fontWeight: 600,
                        fontSize: "11px",
                      }}
                    />
                  </Box>

                  {/* Footer - Raised By and Assigned To */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    pt={2}
                    borderTop="1px solid #f0f0f0"
                  >
                    {/* Raised By */}
                    <Box display="flex" alignItems="center" gap={1}>
                      <User size={16} color="#666" />
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Raised By
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          fontSize="13px"
                        >
                          {ticket.raised_by?.name || "N/A"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Assigned To */}
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      textAlign="right"
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Assigned To
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          fontSize="13px"
                        >
                          {ticket.assigned_to?.name || "Unassigned"}
                        </Typography>
                      </Box>
                      <UserCheck size={16} color="#666" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Orders Table */}
      <Box mt={3}>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Factory Operations
        </Typography>
        <AdvancedTable
          columns={factctoryDashboardColumns}
          data={factoryOperationDashboardData?.orders}
        />
      </Box>

      {/* Pagination */}
      <Pagination
        paginationData={factoryOperationPaginationData}
        handlePageChange={handlePageChange}
      />

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
    </Box>
  );
};

export default FactctoryOperationDashboard;
