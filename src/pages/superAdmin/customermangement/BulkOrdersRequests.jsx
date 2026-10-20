import { useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import { colors } from "../../../constants/constants";
import { AdvancedTable } from "../../../components/AdvanceTable";
import {
  accountsPathConstants,
  customerPathConstants,
  deliveryDispatchPathConstants,
  factoryPathConstants,
  salesRepresentativePathConstants,
  superAdminPathConstants,
  warehouseManagerPathConstants,
} from "../../../constants/pathConstants";
import Loader from "../../../components/loader/Loader";
import useFetchList from "../../../hooks/useFetchList";
import Pagination from "../../../components/pagination/Pagination";
import {
  bulkOrdersRequestsColumns,
  customerColumns,
} from "./CustomerMangementTable";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { customerManagementURLS } from "../../../services/api/superadminApi";
import { StyledTextField } from "../../../components/StyledText";
import { useDisclosure } from "@mantine/hooks";
import AssignedToModal from "./modals/AssignedToModal";

function BulkOrdersRequests() {
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
  const pathConstants = pathConstantsByRole[userType];
  const { DEFAULT, DASHBOARD } = pathConstants;
  const [page, setPage] = useState(1);
  const searchInputRef = useRef(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 1000);
  const [hasTyped, setHasTyped] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [from, setFrom] = useState({
    modal: "",
    orderId: "",
    assignedCustomer: "",
  });

  const [params, setParams] = useState({});

  useEffect(() => {
    const newParams = {};
    if (debouncedSearch?.trim()) {
      newParams.search = debouncedSearch;
    }
    setPage(1);
    setParams(newParams);
  }, [debouncedSearch]);

  const { getBulkOrderRequestsURL } = customerManagementURLS;

  const {
    data: bulkOrderRequestsData,
    pagination: bulkOrderRequestsPaginationData,
    refetch: refetchBulk,
  } = useFetchList(getBulkOrderRequestsURL, { page, ...params });

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleAssignedTo = async (row) => {
    (open(),
      setFrom({
        modal: "assignedTo",
        orderId: row?.id,
        assignedCustomer: row?.sales_representative?.id,
      }));
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Box>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 700,
                color: colors.headingclr,
              }}
            >
              Bulk Orders Requests
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                style={{ color: colors.darkgreen, textDecoration: "none" }}
                to={`${DEFAULT}/${DASHBOARD}`}
              >
                <Typography sx={{ fontSize: "14px" }}>Dashbaord</Typography>
              </Link>
              <Typography sx={{ fontSize: "14px" }}>Bulk Orders</Typography>
            </Breadcrumbs>
          </Box>
          <Box>
            <StyledTextField
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setHasTyped(true);
              }}
              ref={searchInputRef}
            />
          </Box>
        </Box>
        <Box mt={3}>
          <AdvancedTable
            columns={bulkOrdersRequestsColumns}
            data={bulkOrderRequestsData}
            isAction={userType === "Super Admin" ? true : false}
            onAssigneTo={(row) => {
              handleAssignedTo(row);
            }}
          />
        </Box>
        <Pagination
          paginationData={bulkOrderRequestsPaginationData}
          handlePageChange={handlePageChange}
        />
      </Box>

      {opened && (
        <AssignedToModal
          opened={opened}
          onClose={close}
          setFrom={setFrom}
          from={from}
          refetchBulk={refetchBulk}
        />
      )}
    </>
  );
}

export default BulkOrdersRequests;
