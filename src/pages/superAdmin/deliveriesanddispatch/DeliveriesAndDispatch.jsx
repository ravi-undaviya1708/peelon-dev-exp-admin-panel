import { Box, Breadcrumbs, Card, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { colors } from "../../../constants/constants";
import { Tabs } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { Font16 } from "../../../components/StyledText";
import { AdvancedTable } from "../../../components/AdvanceTable";
import {
  deliveriesColumns,
  dispatchColumns,
} from "./DeliveriesAndDispatchTable";
import { deliveriesAndDispatchURLS } from "../../../services/api/superadminApi";
import useFetchList from "../../../hooks/useFetchList";
import Pagination from "../../../components/pagination/Pagination";
import { useSelector } from "react-redux";
import Loader from "../../../components/loader/Loader";
import {
  accountsPathConstants,
  customerPathConstants,
  deliveryDispatchPathConstants,
  factoryPathConstants,
  salesRepresentativePathConstants,
  superAdminPathConstants,
  warehouseManagerPathConstants,
} from "../../../constants/pathConstants";

const DeliveriesAndDispatch = () => {
  const isLoading = useSelector((state) => state.loader.isLoading);
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
  const access = ["Sales Representative", "Accounts"].includes(userType);

  const pathConstants = pathConstantsByRole[userType];
  const { DEFAULT, DASHBOARD } = pathConstants;
  const navigate = useNavigate();
  const savedTab =
    localStorage.getItem("selectedDelivery&DispatchTab") || "Deliveries";
  const [selectedTab, setSelectedTab] = useState(savedTab);
  const [page, setPage] = useState(1);

  useEffect(() => {
    localStorage.setItem("selectedDelivery&DispatchTab", selectedTab);
  }, [selectedTab]);

  const handleEditOrdersAndDispatch = (row, from) => {
    navigate("../delivers-dispatch/edit-delivers-and-dispatch", {
      state: { id: row?.id, from: from },
    });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const { getDeliveriesOrdersURL, getDispatchedOrdersURL } =
    deliveriesAndDispatchURLS;

  const {
    data: deliveriesData,
    refetch: refetchDeliveriesData,
    pagination: deliveriesPaginationData,
  } = useFetchList(
    getDeliveriesOrdersURL,
    { page },
    selectedTab === "Deliveries",
  );
  const {
    data: dispatchedData,
    refetch: refetchDispatchedData,
    pagination: dispatchedPaginationData,
  } = useFetchList(
    getDispatchedOrdersURL,
    { page },
    selectedTab === "Dispatch",
  );

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <Box>
        <Box
          display={"flex"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
        >
          <Box mt={1}>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 700,
                color: colors.headingclr,
              }}
            >
              Delivery & Dispatch
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                style={{ color: colors.darkgreen, textDecoration: "none" }}
                to={`${DEFAULT}/${DASHBOARD}`}
              >
                <Typography sx={{ fontSize: "14px" }}>Dashbaord</Typography>
              </Link>
              <Typography sx={{ fontSize: "14px" }}>{selectedTab}</Typography>
            </Breadcrumbs>
          </Box>
        </Box>
        <Box mt={3}>
          <Card
            sx={{
              boxShadow: "none",
              border: "2px solid #eaeaea",
              borderRadius: "8px",
              p: 1,
            }}
          >
            <Box style={{ width: "100%" }}>
              <Tabs value={selectedTab} onChange={setSelectedTab} color="green">
                <Tabs.List
                  className="custom-tabs-list"
                  style={{ paddingTop: "10px" }}
                >
                  <Tabs.Tab value="Dispatch">
                    <Box display={"flex"} gap={1}>
                      <Box>
                        <Font16 sx={{ color: "#444444" }}>Dispatch</Font16>
                      </Box>
                    </Box>
                  </Tabs.Tab>
                  <Tabs.Tab value="Deliveries">
                    <Box display={"flex"} gap={1}>
                      <Box>
                        <Font16 sx={{ color: "#444444" }}>Delivery</Font16>
                      </Box>
                    </Box>
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="Deliveries">
                  <Box p={2}>
                    <AdvancedTable
                      columns={deliveriesColumns}
                      data={deliveriesData}
                      // isAction={
                      //   userType !== "Sales Representative" ? true : false
                      // }
                      isAction={!access}
                      onEdit={(row) =>
                        handleEditOrdersAndDispatch(row, "deliveries")
                      }
                    />
                  </Box>
                  <Pagination
                    paginationData={deliveriesPaginationData}
                    handlePageChange={handlePageChange}
                  />
                </Tabs.Panel>
                <Tabs.Panel value="Dispatch">
                  <Box p={2}>
                    <AdvancedTable
                      columns={dispatchColumns}
                      data={dispatchedData}
                      // isAction={
                      //   userType !== "Sales Representative" ? true : false
                      // }
                      isAction={!access}
                      onEdit={(row) =>
                        handleEditOrdersAndDispatch(row, "dispatched")
                      }
                    />
                  </Box>
                  <Pagination
                    paginationData={dispatchedPaginationData}
                    handlePageChange={handlePageChange}
                  />
                </Tabs.Panel>
              </Tabs>
            </Box>
          </Card>
        </Box>
      </Box>
    </>
  );
};
export default DeliveriesAndDispatch;
