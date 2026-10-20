import { Box, Breadcrumbs, Card, Typography } from "@mui/material";
import { colors } from "../../../constants/constants";
import { Tabs } from "@mantine/core";
import { PrimaryButton } from "../../../components/StyledButtons";
import { Link } from "react-router-dom";
import { Font16 } from "../../../components/StyledText";
import { AdvancedTable } from "../../../components/AdvanceTable";
import { Mail, NotebookTabs, Phone, StickyNote } from "lucide-react";
import {
  callColumns,
  emailColumns,
  meetingColumns,
  remainderColumns,
} from "./ActivitiesTables";
import { lazy, Suspense, useEffect, useState } from "react";
const ActivitiesModal = lazy(() => import("./modals/ActivitiesModal"));
const ClosedActivityModal = lazy(() => import("./modals/ClosedActivityModal"));
import { useDisclosure } from "@mantine/hooks";
import { activitiesURLS } from "../../../services/api/superadminApi";
import useFetchList from "../../../hooks/useFetchList";
import useFetchDropdown from "../../../hooks/useFetchDropdown";
import Pagination from "../../../components/pagination/Pagination";
import { useSelector } from "react-redux";
import Loader from "../../../components/loader/Loader";
import useApiRequest from "../../../hooks/useApiRequest";
import { toast } from "react-toastify";
import { FormInput } from "../../../components/input/FormInput";
import { useForm } from "react-hook-form";
import SingleSelect from "../../../components/select/SingleSelect";
import {
  accountsPathConstants,
  customerPathConstants,
  deliveryDispatchPathConstants,
  factoryPathConstants,
  salesRepresentativePathConstants,
  superAdminPathConstants,
  warehouseManagerPathConstants,
} from "../../../constants/pathConstants";

const Activities = () => {
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
  const savedTab = localStorage.getItem("selecteActivitesTab") || "call";
  const { deleterequest } = useApiRequest();
  const [page, setPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState(savedTab);
  const [activitiesModalOpened, activitiesModalHandlers] = useDisclosure(false);
  const [closedActivityModalOpened, closedActivityModalHandlers] =
    useDisclosure(false);

  const [from, setFrom] = useState({
    modal: "",
    activityId: "",
    activityType: "",
  });

  const activityOptions = [
    { label: "Active", value: "false" },
    { label: "Closed", value: "true" },
  ];

  const { control, watch } = useForm({});
  //console.log(watch());
  const scheduled_time = watch("scheduled_time");
  const is_closed = watch("is_closed");

  const [params, setParams] = useState({});
  useEffect(() => {
    const newParams = {};
    if (scheduled_time?.trim()) {
      newParams.scheduled_time = scheduled_time;
    }
    if (is_closed?.trim()) {
      newParams.is_closed = is_closed;
    }
    setPage(1);
    setParams(newParams);
  }, [is_closed, scheduled_time]);

  useEffect(() => {
    localStorage.setItem("selecteActivitesTab", selectedTab);
  }, [selectedTab]);

  const handleNavigate = (selectedValue) => {
    setFrom({ modal: "addActivity" }), activitiesModalHandlers.open();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const {
    getActivitiesURL,
    activitiesDropdwonURL,
    usersDropdownURL,
    allUserURL,
    companiesDropdownURL,
    activityDetailURL,
    deletActivityDetailURL,
    leadsDropdownURL,
  } = activitiesURLS;

  const {
    data: activitiesData,
    refetch: refetchActivitiesData,
    pagination: activitiesPagenationData,
  } = useFetchList(getActivitiesURL, {
    activity_type: selectedTab,
    page,
    ...params,
  });
  const { data: activitiesDropdownData } = useFetchDropdown(
    activitiesDropdwonURL,
    "value",
    "key"
  );
  const { data: usersDropdownData } = useFetchDropdown(
    usersDropdownURL,
    "full_name",
    "id"
  );
  const { data: companiesDropdownData } = useFetchDropdown(
    companiesDropdownURL,
    "company_name",
    "id"
  );
  const { data: prefetchActivityDetailData } = useFetchList(
    `${activityDetailURL}/${from.activityId}`,
    {},
    !!from.activityId
  );
  const { data: leadsDropdownData } = useFetchDropdown(
    leadsDropdownURL,
    "lead_name",
    "id"
  );
  const { data: allUserData } = useFetchDropdown(allUserURL, "full_name", "id");

  const handleActivityEdit = (row) => {
    activitiesModalHandlers.open();
    setFrom({ modal: "editActivity", activityId: row.id });
  };

  const handleClosedActivity = (row, type) => {
    closedActivityModalHandlers.open();
    setFrom({
      modal: "closedActivity",
      activityId: row.id,
      activityType: type,
    });
  };

  const handleActivityDelete = async (row) => {
    const response = await deleterequest(
      `${deletActivityDetailURL}/${row?.id}`
    );
    if (response.settings.success) {
      toast.success(response.settings.message);
      if (activitiesData?.length === 1 && page > 1) {
        return setPage(page - 1);
      }
      refetchActivitiesData();
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
              Activities
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                style={{ color: colors.darkgreen, textDecoration: "none" }}
                to={`${DEFAULT}/${DASHBOARD}`}
              >
                <Typography sx={{ fontSize: "14px" }}>Dashbaord</Typography>
              </Link>
              <Typography sx={{ fontSize: "14px" }}>Activities</Typography>
            </Breadcrumbs>
          </Box>

          <Box alignItems={"center"} gap={1} display={"flex"} flexWrap={"wrap"}>
            <Box>
              <FormInput
                placeholder="Enter Date"
                type={"date"}
                control={control}
                name={"scheduled_time"}
              />
            </Box>
            <Box>
              <SingleSelect
                options={activityOptions}
                control={control}
                name={"is_closed"}
                // from={true}
                // setPage={setPage}
                placeholder="Select Status"
              />
            </Box>
            {!access && (
              <Box>
                <PrimaryButton
                  onClick={() => {
                    handleNavigate(selectedTab);
                  }}
                >
                  Add Activity
                </PrimaryButton>
              </Box>
            )}
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
                  <Tabs.Tab value="call">
                    <Box display={"flex"} gap={1}>
                      <Box alignContent={"center"}>
                        <Phone size={"15px"} />
                      </Box>
                      <Box>
                        <Font16 sx={{ color: "#444444" }}>Call</Font16>
                      </Box>
                    </Box>
                  </Tabs.Tab>
                  <Tabs.Tab value="meeting">
                    <Box display={"flex"} gap={1}>
                      <Box alignContent={"center"}>
                        <NotebookTabs size={"15px"} />
                      </Box>
                      <Box>
                        <Font16 sx={{ color: "#444444" }}>Meetings</Font16>
                      </Box>
                    </Box>
                  </Tabs.Tab>
                  <Tabs.Tab value="email">
                    <Box display={"flex"} gap={1}>
                      <Box alignContent={"center"}>
                        <Mail size={"15px"} />
                      </Box>
                      <Box>
                        <Font16 sx={{ color: "#444444" }}>Email</Font16>
                      </Box>
                    </Box>
                  </Tabs.Tab>
                  <Tabs.Tab value="reminder">
                    <Box display={"flex"} gap={1}>
                      <Box alignContent={"center"}>
                        <StickyNote size={"15px"} />
                      </Box>
                      <Box>
                        <Font16 sx={{ color: "#444444" }}>Reminder</Font16>
                      </Box>
                    </Box>
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="call">
                  <Box p={2}>
                    <AdvancedTable
                      columns={callColumns}
                      data={activitiesData}
                      isAction={!access}
                      onEdit={(row) => {
                        if (row?.is_closed !== true) {
                          handleActivityEdit(row);
                        } else {
                          toast.error("You already closed this activity");
                        }
                      }}
                      onDelete={(row) => handleActivityDelete(row)}
                      onClosedActivity={(row) => {
                        if (row?.is_closed !== true) {
                          handleClosedActivity(row);
                        } else {
                          toast.error("You already closed this activity");
                        }
                      }}
                    />
                  </Box>
                  <Pagination
                    paginationData={activitiesPagenationData}
                    handlePageChange={handlePageChange}
                  />
                </Tabs.Panel>
                <Tabs.Panel value="meeting">
                  <Box p={2}>
                    <AdvancedTable
                      columns={meetingColumns}
                      data={activitiesData}
                      isAction={!access}
                      onEdit={(row) => {
                        if (row?.is_closed !== true) {
                          handleActivityEdit(row);
                        } else {
                          toast.error("You already closed this activity");
                        }
                      }}
                      onDelete={(row) => handleActivityDelete(row)}
                      onClosedActivity={(row) => {
                        if (row?.is_closed !== true) {
                          handleClosedActivity(row);
                        } else {
                          toast.error("You already closed this activity");
                        }
                      }}
                    />
                  </Box>
                  <Pagination
                    paginationData={activitiesPagenationData}
                    handlePageChange={handlePageChange}
                  />
                </Tabs.Panel>
                <Tabs.Panel value="email">
                  <Box p={2}>
                    <AdvancedTable
                      columns={emailColumns}
                      data={activitiesData}
                      isAction={!access}
                      onEdit={(row) => {
                        if (row?.is_closed !== true) {
                          handleActivityEdit(row);
                        } else {
                          toast.error("You already closed this activity");
                        }
                      }}
                      onDelete={(row) => handleActivityDelete(row)}
                      onClosedActivity={(row) => {
                        if (row?.is_closed !== true) {
                          handleClosedActivity(row, "email");
                        } else {
                          toast.error("You already closed this activity");
                        }
                      }}
                    />
                  </Box>
                  <Pagination
                    paginationData={activitiesPagenationData}
                    handlePageChange={handlePageChange}
                  />
                </Tabs.Panel>
                <Tabs.Panel value="reminder">
                  <Box p={2}>
                    <AdvancedTable
                      columns={remainderColumns}
                      data={activitiesData}
                      isAction={!access}
                      onEdit={(row) => {
                        if (row?.is_closed !== true) {
                          handleActivityEdit(row);
                        } else {
                          toast.error("You already closed this activity");
                        }
                      }}
                      onDelete={(row) => handleProductDelete(row)}
                      onClosedActivity={(row) => {
                        if (row?.is_closed !== true) {
                          handleClosedActivity(row);
                        } else {
                          toast.error("You already closed this activity");
                        }
                      }}
                    />
                    <Pagination
                      paginationData={activitiesPagenationData}
                      handlePageChange={handlePageChange}
                    />
                  </Box>
                </Tabs.Panel>
              </Tabs>
            </Box>
          </Card>
        </Box>
      </Box>

      {activitiesModalOpened && (
        <Suspense fallback={null}>
          <ActivitiesModal
            opened={activitiesModalOpened}
            onClose={activitiesModalHandlers.close}
            onSuccess={refetchActivitiesData}
            from={from}
            setFrom={setFrom}
            activitiesDropdownData={activitiesDropdownData}
            usersDropdownData={usersDropdownData}
            companiesDropdownData={companiesDropdownData}
            prefetchActivityDetailData={prefetchActivityDetailData}
            leadsDropdownData={leadsDropdownData}
            allUserDropdown={allUserData}
          />
        </Suspense>
      )}

      {closedActivityModalOpened && (
        <Suspense fallback={null}>
          <ClosedActivityModal
            opened={closedActivityModalOpened}
            onClose={closedActivityModalHandlers.close}
            onSuccess={refetchActivitiesData}
            prefetchActivityDetailData={prefetchActivityDetailData}
            setFrom={setFrom}
            from={from}
            refetchActivitiesData={refetchActivitiesData}
          />
        </Suspense>
      )}
    </>
  );
};
export default Activities;
