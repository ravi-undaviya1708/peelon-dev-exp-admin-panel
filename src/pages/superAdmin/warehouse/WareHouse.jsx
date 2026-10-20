import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { useDisclosure } from "@mantine/hooks";
import { AdvancedTable } from "../../../components/AdvanceTable";
import { PrimaryButton } from "../../../components/StyledButtons";
import { Font16, Label16 } from "../../../components/StyledText";
import StyledModal from "../../../components/StyledModal";
import { FormInput } from "../../../components/input/FormInput";
import Loader from "../../../components/loader/Loader";
import useFetchList from "../../../hooks/useFetchList";
import { wareHouseURLS } from "../../../services/api/superadminApi";
import { colors } from "../../../constants/constants";
import useApiRequest from "../../../hooks/useApiRequest";
import { mapApiDataToForm } from "../../../hooks/mapApiDataToForm";
import {
  accountsPathConstants,
  customerPathConstants,
  deliveryDispatchPathConstants,
  factoryPathConstants,
  salesRepresentativePathConstants,
  superAdminPathConstants,
  warehouseManagerPathConstants,
} from "../../../constants/pathConstants";
import Pagination from "../../../components/pagination/Pagination";
import { yupResolver } from "@hookform/resolvers/yup";
import { orderColumns, inventoryColumns } from "./wareHouseTable";
import SingleSelect from "../../../components/select/SingleSelect";
import useFetchDropdown from "../../../hooks/useFetchDropdown";
import { Tabs } from "@mantine/core";
import { useDebounce } from "use-debounce";

const wareHouseValadition = yup.object().shape({
  location: yup.string().required("Location is required"),
});

const warehousePayloads = {
  location: "",
  warehouse_id: "",
};

function WareHouse() {
  const isLoading = useSelector((state) => state.loader.isLoading);
  const { post, deleterequest, put } = useApiRequest();
  const [from, setFrom] = useState({ modal: "", wareId: "" });
  const [page, setPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);
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

  const access = ["Accounts"].includes(userType);

  const pathConstants = pathConstantsByRole[userType];
  const { DEFAULT, DASHBOARD } = pathConstants;
  const savedTab = localStorage.getItem("selectedWareHouseTab") || "Inventroy";
  const [selectedTab, setSelectedTab] = useState(savedTab);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isDirty },
  } = useForm({
    defaultValues: warehousePayloads,
    resolver: yupResolver(wareHouseValadition),
    mode: "onSubmit",
  });

  const selectedLocation = watch("warehouse_id");
  // console.log("selectedLoaction",selectedLocation);
  
  const [debouncedSearch] = useDebounce(selectedLocation, 1000);

  const params = useMemo(() => {
    const filters = {};
    if (selectedLocation?.trim()) {
      filters.warehouse_id = selectedLocation;
    }
    return filters;
  }, [selectedLocation]);
  // console.log("params", params);
  // const [params, setParams] = useState({});
  // useEffect(() => {
  //   const newParams = {};
  //   if (selectedLocation?.trim()) {
  //     newParams.warehouse_id = selectedLocation;
  //   }
  //   setParams(newParams);
  // }, [selectedLocation]);

  const {
    getWareHousesURL,
    wareHouseDataURL,
    postWareHousesURL,
    deleteWareHousesURL,
    editWareHousesURL,
    wareHouseDetailURL,
  } = wareHouseURLS;

  const {
    data: warehouseData,
    refetch: refetchWareHouseData,
    pagination: wareHousePaginationData,
  } = useFetchDropdown(getWareHousesURL, "location", "id");
  const { data: wareHouseDetailData, refetch: refetchWareHouseDetailData } =
    useFetchList(
      `${wareHouseDetailURL}/${selectedLocation}`,
      params,
      !!selectedLocation
    );

  // const { data: prefetchWareHouseDetailData } = useFetchList(
  //   `${wareHouseDetailURL}/${from.wareId}`,
  //   {},
  //   !!from.wareId
  // );

  // useEffect(() => {
  //   if (from.modal === "edit" && prefetchWareHouseDetailData) {
  //     const formValues = mapApiDataToForm(
  //       warehousePayloads,
  //       prefetchWareHouseDetailData
  //     );
  //     reset(formValues);
  //   } else {
  //     reset(warehousePayloads);
  //   }
  // }, [from, prefetchWareHouseDetailData, reset]);
  //console.log(warehouseData);

  useEffect(() => {
    if (warehouseData && warehouseData?.length > 0) {
      reset({
        warehouse_id: warehouseData[0]?.value,
      });
    }
  }, [warehouseData]);

  useEffect(() => {
    localStorage.setItem("selectedWareHouseTab", selectedTab);
  }, [selectedTab]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleWareSubmit = async (data) => {
    let response;
    if (from.modal === "edit") {
      response = await put(`${editWareHousesURL}/${from.wareId}`, data);
    } else {
      response = await post(postWareHousesURL, data);
    }

    if (response.settings.success) {
      toast.success(response.settings.message);
      close();
      refetchWareHouseData();
      reset();
      setFrom({ wareId: "" });
    } else {
      toast.error(response.settings.message);
    }
  };

  const handleDelete = async (row) => {
    const wareId = row?.id;
    try {
      const response = await deleterequest(`${deleteWareHousesURL}/${wareId}`);
      if (response.settings.success) {
        refetchWareHouseData();
      }
    } catch (error) {
      //console.log("error", error)
    }
  };

  const handleEdit = (row) => {
    open();
    setFrom({ modal: "edit", wareId: row?.id });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <Box mt={1}>
          <Typography
            sx={{ fontSize: "24px", fontWeight: 700, color: colors.headingclr }}
          >
            WareHouse
          </Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link
              style={{ color: colors.darkgreen, textDecoration: "none" }}
              href={`${DEFAULT}/${DASHBOARD}`}
            >
              <Typography sx={{ fontSize: "14px" }}>Dashbaord</Typography>
            </Link>
            <Typography sx={{ fontSize: "14px" }}>Ware House List </Typography>
          </Breadcrumbs>
        </Box>

        <Box
          alignContent={"center"}
          mt={1}
          gap={1}
          display={"flex"}
          flexWrap={"wrap"}
        >
          {!access && (
            <Box>
              <PrimaryButton
                onClick={() => {
                  open(), setFrom({ modal: "add" });
                }}
              >
                Add WareHouse
              </PrimaryButton>
            </Box>
          )}

          <Box>
            <SingleSelect
              control={control}
              name={"warehouse_id"}
              placeholder="Select Location"
              options={warehouseData}
              isClearable={false}
            />
          </Box>
        </Box>
      </Box>
      <Box mt={3}>
        <StyledModal
          opened={opened}
          onClose={close}
          size="xs"
          isDirty={from.modal === "edit" && !isDirty}
          title={from.modal === "edit" ? "Edit Ware House" : "Add Ware House"}
          buttonText={from.modal === "edit" ? "Edit" : "Add"}
          isSubmitting={isSubmitting}
          formProps={{
            onSubmit: handleSubmit(handleWareSubmit),
          }}
        >
          <Box>
            <Label16>Location</Label16>
            <FormInput
              control={control}
              name="location"
              placeholder="Enter Location"
            />
          </Box>
        </StyledModal>
      </Box>

      <Box style={{ width: "100%" }}>
        <Tabs
          value={selectedTab}
          onChange={(value) => {
            // setShouldDebounce(false)
            // setSearch("");
            setSelectedTab(value);
          }}
          color="green"
        >
          <Tabs.List
            className="custom-tabs-list"
            style={{ paddingTop: "10px" }}
          >
            <Tabs.Tab value="Inventroy">
              <Font16 sx={{ color: "#444444" }}>Inventory</Font16>
            </Tabs.Tab>
            <Tabs.Tab value="Order">
              <Font16 sx={{ color: "#444444" }}>Orders</Font16>
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="Inventroy">
            <Box p={2}>
              <AdvancedTable
                columns={inventoryColumns}
                data={wareHouseDetailData?.inventory}
                // isAction={true}
                onEdit={(row) => handleEdit(row)}
                // onDelete={(row) => handleRawMaterialDelete(row)}
              />
            </Box>
            {/* <Pagination
                            paginationData={rawMaterialPagination}
                            handlePageChange={handlePageChange}
                        /> */}
          </Tabs.Panel>
          <Tabs.Panel value="Order">
            <Box p={2}>
              <AdvancedTable
                columns={orderColumns}
                data={wareHouseDetailData?.orders}
                // isAction={true}
                onEdit={(row) => handleEdit(row)}
                // onDelete={(row) => handleProductSizeDelete(row)}
              />
            </Box>
            {/* <Pagination
                            paginationData={productSizePagination}
                            handlePageChange={handlePageChange}
                        /> */}
          </Tabs.Panel>
        </Tabs>
      </Box>
    </>
  );
}

export default WareHouse;
