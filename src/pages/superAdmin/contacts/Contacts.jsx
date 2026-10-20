import { Box, Breadcrumbs, Card, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { colors } from "../../../constants/constants";
import { Tabs } from "@mantine/core";
import {
  Font16,
  StyledTableCell,
  StyledTextField,
} from "../../../components/StyledText";
import { AdvancedTable } from "../../../components/AdvanceTable";
import { PrimaryButton } from "../../../components/StyledButtons";
import { websiteColumns, manualColumns } from "./ContactsTable";
import { useDisclosure } from "@mantine/hooks";
import AddWebsite from "./modals/AddWebsite";
import Loader from "../../../components/loader/Loader";
import { Eye, Laptop, Pencil, PencilIcon, Trash2 } from "lucide-react";
import { contactusURLS } from "../../../services/api/superadminApi";
import useFetchList from "../../../hooks/useFetchList";
import { useEffect, useMemo, useRef, useState } from "react";
import { Menu } from "@mantine/core";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import Pagination from "../../../components/pagination/Pagination";
import useApiRequest from "../../../hooks/useApiRequest";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import {
  accountsPathConstants,
  customerPathConstants,
  deliveryDispatchPathConstants,
  factoryPathConstants,
  salesRepresentativePathConstants,
  superAdminPathConstants,
  warehouseManagerPathConstants,
} from "../../../constants/pathConstants";
import SingleSelect from "../../../components/select/SingleSelect";
import { useForm } from "react-hook-form";
import useFetchDropdown from "../../../hooks/useFetchDropdown";

const Contacts = () => {
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
  const [hasTyped, setHasTyped] = useState(false);
  const [loader, setLoader] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 1000);
  const [modalOpened, modalHandlers] = useDisclosure(false);
  const [page, setPage] = useState(1);
  const savedTab = localStorage.getItem("selectedContactTab") || "All";
  const [selectedTab, setSelectedTab] = useState(savedTab);
  const { getContactusURL, deleteContactURL, locationDropdwonURL } =
    contactusURLS;
  const searchInputRef = useRef(null);
  const { control, watch } = useForm({});

  const location = watch("location");
  const [params, setParams] = useState({});
  useEffect(() => {
    const newParams = {};
    if (debouncedSearch?.trim()) {
      newParams.search = debouncedSearch;
    }
    if (location?.trim()) {
      newParams.location = location;
    }
    setPage(1);
    setParams(newParams);
  }, [debouncedSearch, location]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setHasTyped(true);
  };

  const {
    data: contactusData,
    refetch: refetchContactsData,
    pagination: contactsPaginationData,
  } = useFetchList(getContactusURL, {
    ...(selectedTab !== "All" && {
      entry_type: selectedTab === "Manual" ? "manual" : "web_site",
    }),
    page,
    ...params,
  });

  const { data: locationDropdownOptions } = useFetchDropdown(
    locationDropdwonURL,
    "value",
    "key"
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    localStorage.setItem("selectedContactTab", selectedTab);
  }, [selectedTab]);

  useEffect(() => {
    if (hasTyped) {
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [contactusData]);

  const handleNavigate = (selectedTab) => {
    navigate("../contacts/add-contact");
  };

  const handleEditContactDetail = (row) => {
    navigate("../contacts/edit-manual", {
      state: { contactId: row?.id, from: "editManual" },
    });
  };

  const handleContactDetail = (row) => {
    navigate("../contacts/contact-details", {
      state: { contactManualId: row?.id },
    });
  };

  const handleDeleteContact = async (row) => {
    const response = await deleterequest(`${deleteContactURL}/${row?.id}`);
    if (response.settings.success) {
      toast.success(response.settings.message);
      if (contactusData?.length === 1 && page > 1) {
        return setPage(page - 1);
      }
      refetchContactsData();
    } else {
      toast.error(response.settings.message);
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
              Contacts
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                style={{ color: colors.darkgreen, textDecoration: "none" }}
                to={`${DEFAULT}/${DASHBOARD}`}
              >
                <Typography sx={{ fontSize: "14px" }}>Dashbaord</Typography>
              </Link>
              <Typography sx={{ fontSize: "14px" }}>Contacts </Typography>
            </Breadcrumbs>
          </Box>
          <Box alignItems={"center"} gap={1} display={"flex"} flexWrap={"wrap"}>
            <Box>
              <StyledTextField
                placeholder="Company Name/ID/Location"
                value={search}
                onChange={handleSearchChange}
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
            {!access && (
              <PrimaryButton
                onClick={() => {
                  handleNavigate(selectedTab);
                }}
              >
                Add Contact
              </PrimaryButton>
            )}
          </Box>
        </Box>
        <Box mt={3}>
          <Card
            sx={{
              boxShadow: "none",
              border: "2px solid #eaeaea",
              borderRadius: "8px",
              // p: 1,
            }}
          >
            <Box style={{ width: "100%" }}>
              <Tabs color="green" value={selectedTab} onChange={setSelectedTab}>
                <Tabs.List
                  className="custom-tabs-list"
                  style={{ paddingTop: "10px" }}
                >
                  <Tabs.Tab value="All">
                    <Box display={"flex"} gap={1}>
                      <Box>
                        <Font16 sx={{ color: "#444444" }}>All</Font16>
                      </Box>
                    </Box>
                  </Tabs.Tab>
                  <Tabs.Tab value="Manual">
                    <Box display={"flex"} gap={1}>
                      <Box alignContent={"center"}>
                        <Pencil size={"15px"} />
                      </Box>
                      <Box>
                        <Font16 sx={{ color: "#444444" }}>Manual Data</Font16>
                      </Box>
                    </Box>
                  </Tabs.Tab>
                  <Tabs.Tab value="Website">
                    <Box display={"flex"} gap={1}>
                      <Box alignContent={"center"}>
                        <Laptop size={"16px"} />
                      </Box>
                      <Box>
                        <Font16 sx={{ color: "#444444" }}>
                          Website-Based Data
                        </Font16>
                      </Box>
                    </Box>
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="All">
                  {!access ? (
                    <Box p={2}>
                      <AdvancedTable
                        columns={manualColumns}
                        data={contactusData}
                        isAction={true}
                        onEdit={(row) => handleEditContactDetail(row)}
                        onDelete={(row) => handleDeleteContact(row)}
                        onView={(row) => handleContactDetail(row)}
                      />
                    </Box>
                  ) : (
                    <Box p={2}>
                      <AdvancedTable
                        columns={manualColumns}
                        data={contactusData}
                        isAction={true}
                        onView={(row) => handleContactDetail(row)}
                      />
                    </Box>
                  )}
                  <Pagination
                    paginationData={contactsPaginationData}
                    handlePageChange={handlePageChange}
                  />
                </Tabs.Panel>
                <Tabs.Panel value="Manual">
                  {!access ? (
                    <Box p={2}>
                      <AdvancedTable
                        columns={manualColumns}
                        data={contactusData}
                        isAction={true}
                        onEdit={(row) => handleEditContactDetail(row)}
                        onDelete={(row) => handleDeleteContact(row)}
                        onView={(row) => handleContactDetail(row)}
                      />
                    </Box>
                  ) : (
                    <Box p={2}>
                      <AdvancedTable
                        columns={manualColumns}
                        data={contactusData}
                        isAction={true}
                        onView={(row) => handleContactDetail(row)}
                      />
                    </Box>
                  )}

                  <Pagination
                    paginationData={contactsPaginationData}
                    handlePageChange={handlePageChange}
                  />
                </Tabs.Panel>
                <Tabs.Panel value="Website">
                  <Box p={2}>
                    <AdvancedTable
                      columns={websiteColumns}
                      data={contactusData}
                    />
                    <Pagination
                      paginationData={contactsPaginationData}
                      handlePageChange={handlePageChange}
                    />
                  </Box>
                </Tabs.Panel>
              </Tabs>
            </Box>
          </Card>
        </Box>
      </Box>

      {modalOpened && (
        <AddWebsite opened={modalOpened} onClose={modalHandlers.close} />
      )}
    </>
  );
};
export default Contacts;
