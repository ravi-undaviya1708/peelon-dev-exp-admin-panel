import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Breadcrumbs, Typography, Slider } from "@mui/material";
import { colors } from "../../../constants/constants";
import { PrimaryButton } from "../../../components/StyledButtons";
import { AdvancedTable } from "../../../components/AdvanceTable";
import { SlidersHorizontal } from "lucide-react";
import { dealColumns } from "./DealsTable";
import { DealsURLS, LeadsURLS } from "../../../services/api/superadminApi";
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
import { useDisclosure } from "@mantine/hooks";
const DealModal = lazy(() => import("./modals/DealModal"));
import useApiRequest from "../../../hooks/useApiRequest";
import useFetchList from "../../../hooks/useFetchList";
import Pagination from "../../../components/pagination/Pagination";
import useFetchDropdown from "../../../hooks/useFetchDropdown";
import Filters from "./modals/Filters";
import { StyledTextField } from "../../../components/StyledText";
import { set, useForm } from "react-hook-form";
import { FormInput } from "../../../components/input/FormInput";
import SingleSelect from "../../../components/select/SingleSelect";

function Deals() {
  const isLoading = useSelector((state) => state.loader.isLoading);
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const userType = useSelector((state) => state.auth.userType);
  const [companySearch, setCompanySearch] = useState("");
  const [hasTyped, setHasTyped] = useState(false);
  const [hasPriceTyped, setHasPriceTyped] = useState(false);

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
  const { deleterequest } = useApiRequest();
  const [page, setPage] = useState(1);
  const [from, setFrom] = useState({
    modal: "",
    dealId: "",
  });
  const {
    getDealsURL,
    getUsersDropdownURL,
    getCompaniesDropdownURL,
    getDealDetailsURL,
    getProductDropdownURL,
    deleteDealURL,
    dealStageDropdownURL,
    dealSourceDropdownURL,
    locationDropdwonURL,
  } = DealsURLS;

  const [search, setSearch] = useState([]);
  const [debouncedValue] = useDebounce(search, 1000);
  const [debouncedSearch] = useDebounce(companySearch, 1000);
  const [minPriceRange, setMinPriceRange] = useState("");
  const [maxPriceRange, setMaxPriceRange] = useState("");
  const [debounceMinPrice] = useDebounce(minPriceRange, 1000);
  const [debounceMaxPrice] = useDebounce(maxPriceRange, 1000);
  const { control, watch } = useForm({});

  const last_follow_up = watch("last_follow_up");
  const location = watch("location");

  const [params1, setParams1] = useState({});

  useEffect(() => {
    const newParams = {};

    if (debouncedSearch?.trim()) {
      newParams.search = debouncedSearch;
    }

    if (debounceMinPrice?.trim()) {
      newParams.min_value = debounceMinPrice;
    }

    if (debounceMaxPrice?.trim()) {
      newParams.max_value = debounceMaxPrice;
    }

    if (last_follow_up?.trim()) {
      newParams.last_follow_up = last_follow_up;
    }
    if (location?.trim()) {
      newParams.location = location;
    }

    setPage(1);
    setParams1(newParams);
  }, [
    debouncedSearch,
    debounceMinPrice,
    debounceMaxPrice,
    last_follow_up,
    location,
  ]);

  const searchInputRef = useRef(null);
  const minPriceRef = useRef(null);
  const maxPriceRef = useRef(null);

  const params = new URLSearchParams();
  debouncedValue.forEach((val) => params.append("stage", val));
  //console.log(debouncedValue);

  const finalURL = `${getDealsURL}?${params.toString()}`;

  const {
    data: dealsData,
    refetch: refetchDealData,
    pagination: DealPaginationData,
  } = useFetchList(finalURL, { page, ...params1 });
  const { data: userDropdownData } = useFetchDropdown(
    getUsersDropdownURL,
    "full_name",
    "id"
  );
  const { data: companiesDropdownData } = useFetchDropdown(
    getCompaniesDropdownURL,
    "company_name",
    "id"
  );
  const { data: ProductDropdownData } = useFetchDropdown(
    getProductDropdownURL,
    "product_name",
    "id"
  );
  const { data: dealStageDropdownData } = useFetchDropdown(
    dealStageDropdownURL,
    "value",
    "key"
  );
  const { data: dealSourceDropdownData } = useFetchDropdown(
    dealSourceDropdownURL,
    "value",
    "key"
  );
  const { data: prefetchDealDetailData } = useFetchList(
    `${getDealDetailsURL}/${from.dealId}`,
    {},
    !!from.dealId
  );
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
  }, [dealsData]);

  useEffect(() => {
    if (hasPriceTyped) {
      const timer = setTimeout(() => {
        if (minPriceRef.current) {
          minPriceRef.current.focus();
        }
        if (maxPriceRef.current) {
          maxPriceRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [dealsData]);

  const handleFiltersChange = (filterData) => {
    setSearch(filterData?.stages || []);
    setPage(1);
  };

  const handleNavigateDetail = (row) => {
    navigate("../deals/deal-details", { state: { dealId: row?.id } });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDealEdit = (row) => {
    open();
    setFrom({ modal: "editDeal", dealId: row?.id });
  };

  const handleDealDelete = async (row) => {
    try {
      const response = await deleterequest(`${deleteDealURL}/${row.id}`);
      if (response.settings.success) {
        if (dealsData?.length === 1 && page > 1) {
          return setPage(page - 1);
        }
        refetchDealData();
        toast.success(response.settings.message);
      } else {
        toast.error(response.settings.message);
      }
    } catch (error) {
      console.error(error);
    }
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
              Deals
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                style={{ color: colors.darkgreen, textDecoration: "none" }}
                to={`${DEFAULT}/${DASHBOARD}`}
              >
                <Typography sx={{ fontSize: "14px" }}>Dashbaord</Typography>
              </Link>
              <Typography sx={{ fontSize: "14px" }}>Deals</Typography>
            </Breadcrumbs>
          </Box>
          <Box alignItems={"center"} gap={2} display={"flex"} flexWrap="wrap">
            <Box>
              <StyledTextField
                placeholder="Deal Owner"
                value={companySearch}
                onChange={(e) => {
                  setCompanySearch(e.target.value);
                  setHasTyped(true);
                }}
                ref={searchInputRef}
              />
            </Box>
            <Box>
              <StyledTextField
                placeholder="Minimum Price(USD)"
                type={"number"}
                value={minPriceRange}
                onChange={(e) => {
                  setMinPriceRange(e.target.value);
                  setHasPriceTyped(true);
                }}
                ref={minPriceRef}
              />
            </Box>
            <Box>
              <StyledTextField
                placeholder="Maximum Price(USD)"
                type={"number"}
                value={maxPriceRange}
                onChange={(e) => {
                  setMaxPriceRange(e.target.value);
                  setHasPriceTyped(true);
                }}
                ref={maxPriceRef}
              />
            </Box>
            <Box>
              <FormInput
                placeholder="Last Follow Up Date"
                type={"date"}
                control={control}
                name={"last_follow_up"}
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
            {!access && (
              <Box>
                <PrimaryButton
                  onClick={() => {
                    open(), setFrom({ modal: "addDeal" });
                  }}
                >
                  Add Deal{" "}
                </PrimaryButton>
              </Box>
            )}

            <Box>
              <Filters
                dealStageDropdownData={dealStageDropdownData}
                onFiltersChange={handleFiltersChange}
                selectedFilters={{ stages: search }}
              />
            </Box>
          </Box>
        </Box>
        {!access ? (
          <Box mt={3}>
            <AdvancedTable
              columns={dealColumns}
              data={dealsData}
              onEdit={handleDealEdit}
              onDelete={(row) => handleDealDelete(row)}
              onView={(row) => handleNavigateDetail(row)}
              isAction={true}
            />
          </Box>
        ) : (
          <Box mt={3}>
            <AdvancedTable
              columns={dealColumns}
              data={dealsData}
              onView={(row) => handleNavigateDetail(row)}
              isAction={true}
            />
          </Box>
        )}

        <Pagination
          paginationData={DealPaginationData}
          handlePageChange={handlePageChange}
        />
        {opened && (
          <Suspense fallback={null}>
            <DealModal
              opened={opened}
              onClose={close}
              prefetchDealDetailData={prefetchDealDetailData}
              ProductDropdownData={ProductDropdownData}
              userDropdownData={userDropdownData}
              companiesDropdownData={companiesDropdownData}
              from={from}
              onSuccess={refetchDealData}
              dealStageDropdownData={dealStageDropdownData}
              dealSourceDropdownData={dealSourceDropdownData}
              setFrom={setFrom}
            />
          </Suspense>
        )}
      </Box>
    </>
  );
}

export default Deals;
