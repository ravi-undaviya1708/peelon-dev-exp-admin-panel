import { lazy, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDisclosure } from "@mantine/hooks";
import { Box, Breadcrumbs, Grid, Typography } from "@mui/material";
import { colors } from "../../../constants/constants";
import { DashboardCards, LeadsCard } from "../../../components/StyledCards";
import { Link, useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../../components/StyledButtons";
import { AdvancedTable } from "../../../components/AdvanceTable";
import Loader from "../../../components/loader/Loader";
import {
  UserRoundCheck,
  UserRoundMinus,
  UserRoundX,
  UsersRound,
} from "lucide-react";
import { LeadColumns } from "./LeadsTable";
const ConvertDealModal = lazy(() => import("./modals/ConvertDealModal"));
const LeadModal = lazy(() => import("./modals/LeadModal"));
const ConvertLostModal = lazy(() => import("./modals/ConvertLostModal"));
import useFetchList from "../../../hooks/useFetchList";
import useApiRequest from "../../../hooks/useApiRequest";
import useFetchDropdown from "../../../hooks/useFetchDropdown";
import { DealsURLS, LeadsURLS } from "../../../services/api/superadminApi";
import Pagination from "../../../components/pagination/Pagination";
import { useSelector } from "react-redux";
import { Suspense } from "react";
import Filters from "./modals/Filters";
import { useDebounce } from "use-debounce";
import { StyledTextField } from "../../../components/StyledText";
import {
  accountsPathConstants,
  customerPathConstants,
  deliveryDispatchPathConstants,
  factoryPathConstants,
  salesRepresentativePathConstants,
  superAdminPathConstants,
  warehouseManagerPathConstants,
} from "../../../constants/pathConstants";
import { FormInput } from "../../../components/input/FormInput";
import { useForm } from "react-hook-form";
import SingleSelect from "../../../components/select/SingleSelect";

const Leads = () => {
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

  const access = [
    "Accounts",
    "Delivery & Dispatch",
    "Warehouse Manager",
  ].includes(userType);

  const pathConstants = pathConstantsByRole[userType];
  const { DEFAULT, DASHBOARD } = pathConstants;
  const navigate = useNavigate();
  const { deleterequest } = useApiRequest();
  const [loader, setLoader] = useState(true);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedFilters] = useDebounce(filters, 1000);
  const [debouncedSearch] = useDebounce(search, 1000);
  const [hasTyped, setHasTyped] = useState(false);
  const { control, watch } = useForm({});

  const [from, setFrom] = useState({
    modal: "",
    leadId: "",
    covertToDealId: "",
    converToLostId: "",
  });

  const location = watch("location");
  const next_follow_up = watch("next_follow_up");
  const last_follow_up = watch("last_follow_up");
  const [params, setParams] = useState({});

  useEffect(() => {
    const newParams = {};

    if (debouncedSearch?.trim()) {
      newParams.search = debouncedSearch;
    }

    if (next_follow_up?.trim()) {
      newParams.next_follow_up = next_follow_up;
    }
    if (last_follow_up?.trim()) {
      newParams.last_follow_up = last_follow_up;
    }
    if (location) {
      newParams.location = location;
    }
    setParams(newParams);

    setPage(1);
  }, [debouncedSearch, next_follow_up, last_follow_up, location]);

  const searchInputRef = useRef(null);
  const [modalOpened, modalHandlers] = useDisclosure(false);
  const [leadModalOpended, leadModalHandlers] = useDisclosure(false);
  const [lostModalOpended, lostModalHandlers] = useDisclosure(false);

  const {
    getLeadsURL,
    leadSourceDropdownURL,
    leadStageDropdownURL,
    leadDetailsURL,
    usersDropdownURL,
    companiesDropdownURL,
    leadsDashboardURL,
    productsDropdownURL,
    salesRepresentivDropdownURL,
    locationDropdwonURL,
  } = LeadsURLS;
  const { dealStageDropdownURL, dealValueTypeDropdownURL } = DealsURLS;

  const prevFiltersRef = useRef(debouncedFilters);

  const params1 = useMemo(() => {
    const filtersChanged =
      JSON.stringify(prevFiltersRef.current) !==
      JSON.stringify(debouncedFilters);

    if (filtersChanged) {
      setPage(1);
      prevFiltersRef.current = debouncedFilters;
    }

    const queryParams = new URLSearchParams();

    Object.entries(debouncedFilters).forEach(([key, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        const backendKey =
          key === "source"
            ? "lead_source"
            : key === "lead"
            ? "lead_stage"
            : key === "type"
            ? "company_type"
            : key;

        values.forEach((val) => {
          queryParams.append(backendKey, val);
        });
      }
    });

    return queryParams.toString();
  }, [debouncedFilters]);

  const finalURL = `${getLeadsURL}?${params1}`;
  const { data: leadsDashboardData } = useFetchList(leadsDashboardURL);
  const {
    data: leadsData,
    refetch: refetchLeadsData,
    pagination: leadsPaginationData,
  } = useFetchList(finalURL, { page, ...params });
  const { data: prefetchLeadData, refetch: refetchPrefetchLeadData } =
    useFetchList(`${leadDetailsURL}/${from.leadId}`, {}, !!from.leadId);
  const { data: leadSourceDropdownData } = useFetchDropdown(
    leadSourceDropdownURL,
    "value",
    "key"
  );
  const { data: leadStageDropdownData } = useFetchDropdown(
    leadStageDropdownURL,
    "value",
    "key"
  );
  const { data: usersDropdownData } = useFetchDropdown(
    usersDropdownURL,
    "full_name",
    "id"
  );
  const { data: salesRepresentativeData } = useFetchDropdown(
    salesRepresentivDropdownURL,
    "full_name",
    "id"
  );
  const { data: productsDropdownData } = useFetchDropdown(
    productsDropdownURL,
    "product_name",
    "id"
  );
  const { data: dealStageDropdownData } = useFetchDropdown(
    dealStageDropdownURL,
    "value",
    "key"
  );
  const { data: dealValueTypeDropdownData } = useFetchDropdown(
    dealValueTypeDropdownURL,
    "value",
    "key"
  );
  const { data: companiesDropdownData, refetch: refetchcompaniesDropdownData } =
    useFetchDropdown(companiesDropdownURL, "company_name", "id");
  const { data: locationDropdownOptions } = useFetchDropdown(
    locationDropdwonURL,
    "value",
    "key"
  );

  useEffect(() => {
    if (hasTyped) {
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [leadsData]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleFiltersChange = (selectedFilters) => {
    setFilters(selectedFilters);
  };

  const handleLeadEdit = (row) => {
    modalHandlers.open();
    setFrom({ modal: "editLead", leadId: row?.id });
  };

  const handlConvertToLead = (row) => {
    leadModalHandlers.open();
    setFrom({ modal: "convertLead", covertToDealId: row?.id });
  };

  const handleConvertToLost = async (row) => {
    lostModalHandlers.open();
    setFrom({ modal: "convertLost", covertToLostId: row?.id });
  };

  const handleLeadDetail = (row) => {
    navigate("../leads/lead-details", {
      state: { leadId: row?.id },
    });
  };

  const handleLeadDelete = async (row) => {
    setLoader(false);
    const response = await deleterequest(`${leadDetailsURL}/${row?.id}`);
    if (response.settings.success) {
      toast.success(response.settings.message);
      setLoader(true);
      if (leadsData?.length === 1 && page > 1) {
        return setPage(page - 1);
      }
      refetchLeadsData();
    } else {
      toast.error(response.settings.message);
    }
  };

  if (isLoading && loader) {
    return <Loader />;
  }

  return (
    <>
      <Box>
        <Box>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 3 }}>
              <DashboardCards
                icon={UsersRound}
                title={"Total Leads"}
                number={leadsDashboardData?.total_leads}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 3 }}>
              <DashboardCards
                icon={UserRoundCheck}
                title={"Active Leads"}
                number={leadsDashboardData?.active_leads}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 3 }}>
              <DashboardCards
                icon={UserRoundMinus}
                title={"Inactive Leads"}
                number={leadsDashboardData?.in_active_leads}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 3 }}>
              <DashboardCards
                icon={UserRoundX}
                title={"Lost Leads"}
                number={leadsDashboardData?.lost_leads}
              />
            </Grid>
          </Grid>
        </Box>
        <Box
          mt={3}
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
              Leads
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                style={{ color: colors.darkgreen, textDecoration: "none" }}
                to={`${DEFAULT}/${DASHBOARD}`}
              >
                <Typography sx={{ fontSize: "14px" }}>Dashbaord</Typography>
              </Link>
              <Typography sx={{ fontSize: "14px" }}>Leads</Typography>
            </Breadcrumbs>
          </Box>
          <Box alignItems={"center"} gap={1} display={"flex"} flexWrap="wrap">
            <Box>
              <StyledTextField
                placeholder="Enter Company Name"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setHasTyped(true);
                }}
                ref={searchInputRef}
              />
            </Box>
            <Box>
              <SingleSelect
                control={control}
                placeholder={"Select Location"}
                name={"location"}
                options={locationDropdownOptions}
              />
            </Box>
            <Box>
              <FormInput
                placeholder="Previews Follow Up Date"
                type={"date"}
                control={control}
                name={"last_follow_up"}
              />
            </Box>
            <Box>
              <FormInput
                placeholder="Next Follow Up Date"
                type={"date"}
                control={control}
                name={"next_follow_up"}
              />
            </Box>
            {!access && (
              <Box>
                <PrimaryButton
                  onClick={() => {
                    modalHandlers.open();
                    setFrom({ modal: "addLead" });
                  }}
                >
                  Add Lead{" "}
                </PrimaryButton>
              </Box>
            )}
            <Box>
              <Filters
                onFiltersChange={handleFiltersChange}
                selectedFilters={filters}
              />
            </Box>
          </Box>
        </Box>
        {!access ? (
          <Box mt={3}>
            <AdvancedTable
              columns={LeadColumns}
              data={leadsData}
              isAction={true}
              onEdit={(row) => handleLeadEdit(row)}
              onDelete={(row) => handleLeadDelete(row)}
              onLost={(row) => {
                if (row?.lead_stage !== "Lost") {
                  handleConvertToLost(row);
                } else {
                  toast.error("Your already in Lost");
                }
              }}
              onView={(row) => handleLeadDetail(row)}
              onDeal={(row) => {
                handlConvertToLead(row);
              }}
            />
          </Box>
        ) : (
          <Box mt={3}>
            <AdvancedTable
              columns={LeadColumns}
              data={leadsData}
              isAction={true}
              onView={(row) => handleLeadDetail(row)}
            />
          </Box>
        )}

        <Pagination
          paginationData={leadsPaginationData}
          handlePageChange={handlePageChange}
        />
      </Box>
      {modalOpened && (
        <Suspense fallback={null}>
          <LeadModal
            opened={modalOpened}
            onClose={modalHandlers.close}
            leadSourceData={leadSourceDropdownData}
            leadStageData={leadStageDropdownData}
            usersDropdownData={usersDropdownData}
            salesRepresentativeData={salesRepresentativeData}
            productsDropdownData={productsDropdownData}
            refetchLeadsData={refetchLeadsData}
            prefetchLeadData={prefetchLeadData}
            refetchPrefetchLeadData={refetchPrefetchLeadData}
            companiesDropdownData={companiesDropdownData}
            from={from}
            setFrom={setFrom}
            setLoader={setLoader}
            refetchcompaniesDropdownData={refetchcompaniesDropdownData}
          />
        </Suspense>
      )}

      {leadModalOpended && (
        <Suspense fallback={null}>
          <ConvertDealModal
            opened={leadModalHandlers}
            onClose={leadModalHandlers.close}
            leadStageData={leadStageDropdownData}
            dealStageDropdownData={dealStageDropdownData}
            dealValueTypeDropdownData={dealValueTypeDropdownData}
            productsDropdownData={productsDropdownData}
            from={from}
            onSuccess={refetchLeadsData}
            setLoader={setLoader}
          />
        </Suspense>
      )}

      {lostModalOpended && (
        <Suspense fallback={null}>
          <ConvertLostModal
            opened={lostModalOpended}
            onClose={lostModalHandlers.close}
            from={from}
            onSuccess={refetchLeadsData}
          />
        </Suspense>
      )}
    </>
  );
};
export default Leads;
