import Select from "react-select";
import { Box, Breadcrumbs, Typography, Grid, Card } from "@mui/material";
import { colors } from "../../../constants/constants";
import { Font20 } from "../../../components/StyledText";
import { BarChart, TotalSales } from "./AccountsCharts";
import { factoryMember, salesRepresentative } from "./AccountsTable";
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
import { reactSelectStyles } from "../../../components/select/reactSelectStyles";
import { accountsURLS } from "../../../services/api/superadminApi";
import useFetchList from "../../../hooks/useFetchList";
import { useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../../../components/loader/Loader";
import Pagination from "../../../components/pagination/Pagination";
import { PrimaryButton } from "../../../components/StyledButtons";
import { Link, useNavigate } from "react-router-dom";

function Accounts() {
  const navigate = useNavigate();
  const userType = useSelector((state) => state.auth.userType);
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [page, setPage] = useState("");
  const [factoryPage, setFactoryPage] = useState("");
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
  const currentYear = new Date().getFullYear();
  const monthsOptions = Array.from({ length: 12 }, (_, i) => ({
    label: new Date(0, i).toLocaleString("en-US", { month: "long" }),
    value: new Date(0, i)
      .toLocaleString("en-US", { month: "long" })
      .toLocaleLowerCase(),
  }));

  // console.log(monthsOptions);

  const yearOptions = Array.from({ length: 11 }, (_, i) => {
    const year = currentYear - i;
    return { value: year, label: year.toString() };
  });
  const [selectedYear, setSelectedYear] = useState(yearOptions[0]);
  const currentMonth = new Date()
    .toLocaleString("en-US", { month: "long" })
    .toLocaleLowerCase();
  // console.log("currentMont",currentMonth);
  const initailaMonth = monthsOptions.find((f) => f.value === currentMonth);
  // console.log("intialMonth",initailaMonth);

  const [selectedMonth, setSelectedMonth] = useState(initailaMonth);
  // console.log("selectedMonth",selectedMonth);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageChangeFactory = (newPage) => {
    setFactoryPage(newPage);
  };
  const { salesRepresentativeURL, totalSalesURL, regionURL, factoryMemberURL } =
    accountsURLS;

  const {
    data: salesRepresentativeData,
    pagination: salesRepresentativePaginationData,
  } = useFetchList(salesRepresentativeURL, { page });
  const { data: factoryMemberData, pagination: factoryDropdownPaginationData } =
    useFetchList(factoryMemberURL, { page: factoryPage });
  const { data: totalSalesData } = useFetchList(
    totalSalesURL,
    { year: selectedYear.value, month: selectedMonth.value },
    true,
    { showLoader: false }
  );
  const { data: regionData } = useFetchList(regionURL, {});

  if (isLoading) {
    return <Loader />;
  }

  const handleAddSalesRepresentative = () => {
    navigate("../accounts/add-staff");
  };

  const salesRepresentativeTable =
    userType === "Super Admin"
      ? salesRepresentative
      : salesRepresentative.filter((col) => col.name !== "View");

  const factoryMemberTable =
    userType === "Super Admin"
      ? factoryMember
      : factoryMember.filter((col) => col.name !== "View");

  return (
    <>
      <Box display={"flex"} flexWrap={"wrap"} justifyContent={"space-between"}>
        <Box mt={1}>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 700,
              color: colors.headingclr,
            }}
          >
            Accounts
          </Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link
              style={{ color: colors.darkgreen, textDecoration: "none" }}
              to={`${DEFAULT}/${DASHBOARD}`}
            >
              <Typography sx={{ fontSize: "14px" }}>Dashbaord</Typography>
            </Link>
            <Typography sx={{ fontSize: "14px" }}>Accounts</Typography>
          </Breadcrumbs>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>
            <Card sx={{ p: 2, borderRadius: "16px" }}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <Font20 sx={{ mb: 2 }}>Total Sales</Font20>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  <Box>
                    <Select
                      styles={reactSelectStyles()}
                      menuPortalTarget={document.body}
                      placeholder="Months"
                      options={monthsOptions}
                      value={selectedMonth}
                      onChange={(selected) => setSelectedMonth(selected)}
                    />
                  </Box>
                  <Box>
                    <Select
                      styles={reactSelectStyles()}
                      placeholder="Year"
                      menuPortalTarget={document.body}
                      options={yearOptions}
                      value={selectedYear}
                      onChange={(selected) => setSelectedYear(selected)}
                    />
                  </Box>
                </Box>
              </Box>
              <TotalSales totalSalesData={totalSalesData} />
            </Card>
          </Grid>
          <Grid size={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>
            <Card sx={{ p: 2, borderRadius: "16px" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Font20 sx={{ mb: 2 }}>Region</Font20>
              </Box>
              <BarChart regionData={regionData} />
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Box
          sx={{ mb: 1, display: "flex", justifyContent: "space-between" }}
          flexWrap={"wrap"}
        >
          <Font20>Sales Representative </Font20>
          {userType === "Super Admin" && (
            <PrimaryButton
              onClick={() => {
                handleAddSalesRepresentative();
              }}
            >
              Add Staff
            </PrimaryButton>
          )}
        </Box>
        <Box>
          <AdvancedTable
            columns={salesRepresentativeTable}
            data={salesRepresentativeData}
          />
        </Box>
        <Pagination
          paginationData={salesRepresentativePaginationData}
          handlePageChange={handlePageChange}
        />

        <Box sx={{ mt: 0 }}>
          <Font20 sx={{ mb: 2 }}>Factory Operation Members </Font20>
          <AdvancedTable
            columns={factoryMemberTable}
            data={factoryMemberData}
          />
        </Box>
        <Pagination
          paginationData={factoryDropdownPaginationData}
          handlePageChange={handlePageChangeFactory}
        />
      </Box>
    </>
  );
}

export default Accounts;
