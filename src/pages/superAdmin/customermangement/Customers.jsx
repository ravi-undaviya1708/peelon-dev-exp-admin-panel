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
import { customerColumns } from "./CustomerMangementTable";
import { Link } from "react-router-dom";
import { customerManagementURLS } from "../../../services/api/superadminApi";
import { StyledTextField } from "../../../components/StyledText";
import { PrimaryButton } from "../../../components/StyledButtons";
import { useDisclosure } from "@mantine/hooks";
import CustomerModal from "./modals/CustomerModal";

function Customers() {
  const [opened, { open, close }] = useDisclosure(false);
  const isLoading = useSelector((state) => state.loader.isLoading);
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
  const [page, setPage] = useState(1);
  const searchInputRef = useRef(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 1000);
  const [hasTyped, setHasTyped] = useState(false);

  const [params, setParams] = useState({});

  useEffect(() => {
    const newParams = {};
    if (debouncedSearch?.trim()) {
      newParams.search = debouncedSearch;
    }
    setPage(1);
    setParams(newParams);
  }, [debouncedSearch]);

  const { getCustomersURL } = customerManagementURLS;

  const {
    data: customersData,
    pagination: customerPaginationData,
    refetch: refetchCustomers,
  } = useFetchList(getCustomersURL, { page, ...params });

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (hasTyped) {
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [customersData]);

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
              Customers
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                style={{ color: colors.darkgreen, textDecoration: "none" }}
                to={`${DEFAULT}/${DASHBOARD}`}
              >
                <Typography sx={{ fontSize: "14px" }}>Dashbaord</Typography>
              </Link>
              <Typography sx={{ fontSize: "14px" }}>customers</Typography>
            </Breadcrumbs>
          </Box>

          <Box display={"flex"} alignItems={"center"} gap={2} flexWrap={"wrap"}>
            <StyledTextField
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setHasTyped(true);
              }}
              ref={searchInputRef}
            />
            {userType === "Super Admin" && (
              <PrimaryButton onClick={open}>Add Customer</PrimaryButton>
            )}
          </Box>
        </Box>
        <Box mt={3}>
          <AdvancedTable columns={customerColumns} data={customersData} />
        </Box>
        <Pagination
          paginationData={customerPaginationData}
          handlePageChange={handlePageChange}
        />
        {opened && (
          <CustomerModal
            opened={opened}
            onClose={close}
            refetch={refetchCustomers}
          />
        )}
      </Box>
    </>
  );
}

export default Customers;
