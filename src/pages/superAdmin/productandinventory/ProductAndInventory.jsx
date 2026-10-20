import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, lazy, Suspense, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import { Box, Breadcrumbs, Card, Typography } from "@mui/material";
import { colors } from "../../../constants/constants";
import { Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Font16, StyledTextField } from "../../../components/StyledText";
import { AdvancedTable } from "../../../components/AdvanceTable";
import { PrimaryButton } from "../../../components/StyledButtons";
const RawMaterialModel = lazy(() => import("./modals/RawMaterialModel"));
const ProductSizeModal = lazy(() => import("./modals/ProductSizeModal"));
import {
  inventoryColumns,
  productColumns,
  ProductSizeColumns,
  RawMaterialcolumns,
} from "./ProductInventoryTables";
import Pagination from "../../../components/pagination/Pagination";
import Loader from "../../../components/loader/Loader";
import useFetchList from "../../../hooks/useFetchList";
import useApiRequest from "../../../hooks/useApiRequest";
import {
  productInventoryURLS,
  wareHouseURLS,
} from "../../../services/api/superadminApi";
import useFetchDropdown from "../../../hooks/useFetchDropdown";
import {
  accountsPathConstants,
  customerPathConstants,
  deliveryDispatchPathConstants,
  factoryPathConstants,
  salesRepresentativePathConstants,
  superAdminPathConstants,
  warehouseManagerPathConstants,
} from "../../../constants/pathConstants";
import { useDebounce } from "use-debounce";

const ProductAndInventory = () => {
  const isLoading = useSelector((state) => state.loader.isLoading);
  const userType = useSelector((state) => state.auth.userType);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [hasTyped, setHasTyped] = useState(false);
  const [shouldDebounce, setShouldDebounce] = useState(true);
  const [debouncedSearch] = useDebounce(search, shouldDebounce ? 500 : 0);
  const [modalOpened, modalHandlers] = useDisclosure(false);
  const [rawModalOpened, rawModalHandlers] = useDisclosure(false);
  const searchInputRef = useRef(null);
  const [from, setFrom] = useState({
    modal: "",
    productSizeId: "",
    rawMaterialId: "",
  });
  const pathConstantsByRole = {
    "Super Admin": superAdminPathConstants,
    "Factory Operation": factoryPathConstants,
    "Sales Representative": salesRepresentativePathConstants,
    "Delivery & Dispatch": deliveryDispatchPathConstants,
    "Warehouse Manager": warehouseManagerPathConstants,
    Accounts: accountsPathConstants,
    Customer: customerPathConstants,
  };
  const access = ["Accounts", "Factory Operation"].includes(userType);
  const FactoryAccess=["Factory Operation"].includes(userType)

  const pathConstants = pathConstantsByRole[userType];
  const { DEFAULT, DASHBOARD } = pathConstants;
  const { deleterequest } = useApiRequest();
  const savedTab = localStorage.getItem("selectedProductTab") || "Raw Material";
  const [selectedTab, setSelectedTab] = useState(savedTab);

  const {
    getRawMaterialURL,
    getProductSizeURL,
    getProductInventoryURL,
    getProductsURL,
    productInventoryDetailURL,
    productDetailURL,
    sizeOfProductDetailURL,
    getRawMaterialDetailURL,
    deleteRawMaterialURL,
  } = productInventoryURLS;
  const { getWareHousesURL } = wareHouseURLS;

  const [params, setParams] = useState({});

  useEffect(() => {
    const newParams = {};
    if (debouncedSearch?.trim()) {
      newParams.search = debouncedSearch;
    }
    setPage(1);
    setParams(newParams);
  }, [debouncedSearch]);

  useEffect(() => {
    if (!shouldDebounce) {
      setShouldDebounce(true);
    }
  }, [shouldDebounce]);

  const {
    data: productSizeData,
    refetch: refetchProductSizeData,
    pagination: productSizePagination,
  } = useFetchList(getProductSizeURL, params, selectedTab === "Product Size");

  const {
    data: productInventory,
    refetch: refetchProductInventory,
    pagination: productInventoryPagination,
  } = useFetchList(getProductInventoryURL, params, selectedTab === "Inventory");

  const {
    data: productsData,
    refetch: refetchProductsData,
    pagination: productsPagination,
  } = useFetchList(getProductsURL, params, selectedTab === "Products");

  const { data: prefetchProductSizeDetailData } = useFetchList(
    `${sizeOfProductDetailURL}/${from.productSizeId}`,
    {},
    !!from?.productSizeId
  );

  const {
    data: rawMaterialData,
    refetch: refetchRawMaterialData,
    pagination: rawMaterialPagination,
  } = useFetchList(
    getRawMaterialURL,
    { page, ...params },
    selectedTab === "Raw Material"
  );
  const { data: prefetchRawMaterialDetailData } = useFetchList(
    `${getRawMaterialDetailURL}/${from.rawMaterialId}`,
    {},
    !!from?.rawMaterialId
  );
  const rawMaterialOptions = useFetchDropdown(
    getWareHousesURL,
    "location",
    "id",
    {}
  );

  const handleNavigate = (selectedValue) => {
    selectedTab === "Raw Material" &&
      (setFrom({ modal: "addRawMaterial" }), rawModalHandlers.open());
    selectedTab === "Product Size" &&
      (setFrom({ modal: "addProductsSize" }), modalHandlers.open());
    selectedValue === "Products" &&
      navigate("../product-inventory/add-product");
    selectedValue === "Inventory" &&
      navigate("../product-inventory/add-inventory");
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setHasTyped(true);
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
  }, [rawMaterialData, productSizeData, productInventory, productsData]);

  useEffect(() => {
    localStorage.setItem("selectedProductTab", selectedTab);
  }, [selectedTab]);

  const handleProductSizeEdit = (row) => {
    modalHandlers.open();
    setFrom({ modal: "editProductSize", productSizeId: row?.id });
  };

  const handleProductInventoryEdit = (row) => {
    navigate("../product-inventory/edit-inventory", {
      state: { inventoryId: row?.id, from: "editInventory" },
    });
  };

  const handleRawMaterialEdit = (row) => {
    rawModalHandlers.open();
    setFrom({ modal: "editRawMaterial", rawMaterialId: row?.id });
  };

  const handleProductDetail = (row) => {
    navigate("../product-inventory/product-detail", {
      state: { productDetailId: row?.id },
    });
  };

  const handleRawMaterialDelete = async (row) => {
    setLoader(false);
    const response = await deleterequest(`${deleteRawMaterialURL}/${row.id}`);
    if (response.settings.success) {
      setLoader(true);
      toast.success(response.settings.message);
      if (rawMaterialData?.length === 1 && page > 1) {
        return setPage(page - 1);
      }
      refetchRawMaterialData();
    } else {
      toast.error(response.settings.message);
    }
  };

  const handleProductEdit = (row) => {
    navigate("../product-inventory/edit-product", {
      state: { productId: row?.id, from: "editProduct" },
    });
  };

  const handleProductInventoryDelete = async (row) => {
    const response = await deleterequest(
      `${productInventoryDetailURL}/${row.id}`
    );
    if (response.settings.success) {
      toast.success(response.settings.message);
      if (productInventory?.length === 1 && page > 1) {
        return setPage(page - 1);
      }
      refetchProductInventory();
    } else {
      toast.error(response.settings.message);
    }
  };

  const handleProductDelete = async (row) => {
    setLoader(false);
    const response = await deleterequest(`${productDetailURL}/${row.id}`);
    if (response.settings.success) {
      setLoader(true);
      toast.success(response.settings.message);
      if (productsData?.length === 1 && page > 1) {
        return setPage(page - 1);
      }
      refetchProductsData();
    } else {
      toast.error(response.settings.message);
    }
  };

  const handleProductSizeDelete = async (row) => {
    setLoader(false);
    const response = await deleterequest(`${sizeOfProductDetailURL}/${row.id}`);
    if (response.settings.success) {
      setLoader(true);
      toast.success(response.settings.message);
      if (productSizeData?.length === 1 && page > 1) {
        return setPage(page - 1);
      }
      refetchProductSizeData();
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
              Product & Inventory
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                style={{ color: colors.darkgreen, textDecoration: "none" }}
                to={`${DEFAULT}/${DASHBOARD}`}
              >
                <Typography sx={{ fontSize: "14px" }}>Dashbaord</Typography>
              </Link>
              <Typography sx={{ fontSize: "14px" }}>{savedTab}</Typography>
            </Breadcrumbs>
          </Box>

          <Box alignItems={"center"} gap={1} display={"flex"} flexWrap={"wrap"}>
            <Box>
              <StyledTextField
                placeholder="Search"
                value={search}
                onChange={handleSearchChange}
                ref={searchInputRef}
              />
            </Box>
            {((!access || FactoryAccess) &&
              ["Raw Material", "Inventory", "Product Size", "Products"].includes(selectedTab)) && (
              <PrimaryButton
                onClick={() => {
                  handleNavigate(selectedTab);
                }}
              >
                Add{" "}
                {selectedTab === "Products"
                  ? "Product"
                  : selectedTab === "Product Size"
                  ? "Size"
                  : selectedTab}
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
              p: 1,
            }}
          >
            <Box style={{ width: "100%" }}>
              <Tabs
                value={selectedTab}
                onChange={(value) => {
                  setShouldDebounce(false);
                  setSearch("");
                  setSelectedTab(value);
                }}
                color="green"
              >
                <Tabs.List
                  className="custom-tabs-list"
                  style={{ paddingTop: "10px" }}
                >
                  <Tabs.Tab value="Raw Material">
                    <Font16 sx={{ color: "#444444" }}>Raw Material</Font16>
                  </Tabs.Tab>
                  <Tabs.Tab value="Inventory">
                    <Font16 sx={{ color: "#444444" }}>Inventory</Font16>
                  </Tabs.Tab>
                  <Tabs.Tab value="Product Size">
                    <Font16 sx={{ color: "#444444" }}>Product Size</Font16>
                  </Tabs.Tab>
                  <Tabs.Tab value="Products">
                    <Font16 sx={{ color: "#444444" }}>Products</Font16>
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="Raw Material">
                  <Box p={2}>
                    <AdvancedTable
                      columns={RawMaterialcolumns}
                      data={rawMaterialData}
                      isAction={!access||FactoryAccess}
                      onEdit={(row) => handleRawMaterialEdit(row)}
                      onDelete={(row) => handleRawMaterialDelete(row)}
                    />
                  </Box>
                  <Pagination
                    paginationData={rawMaterialPagination}
                    handlePageChange={handlePageChange}
                  />
                </Tabs.Panel>
                <Tabs.Panel value="Product Size">
                  <Box p={2}>
                    <AdvancedTable
                      columns={ProductSizeColumns}
                      data={productSizeData}
                      // isAction={userType !== "Factory Operation" ? true : false}
                      isAction={!access}
                      onEdit={(row) => handleProductSizeEdit(row)}
                      onDelete={(row) => handleProductSizeDelete(row)}
                    />
                  </Box>
                  <Pagination
                    paginationData={productSizePagination}
                    handlePageChange={handlePageChange}
                  />
                </Tabs.Panel>
                <Tabs.Panel value="Inventory">
                  <Box p={2}>
                    <AdvancedTable
                      columns={inventoryColumns}
                      data={productInventory}
                      // isAction={userType !== "Factory Operation" ? true : false}
                      isAction={!access||FactoryAccess}
                      onEdit={(row) => handleProductInventoryEdit(row)}
                      onDelete={(row) => handleProductInventoryDelete(row)}
                      // onView={true}
                    />
                  </Box>
                  <Pagination
                    paginationData={productInventoryPagination}
                    handlePageChange={handlePageChange}
                  />
                </Tabs.Panel>
                <Tabs.Panel value="Products">
                  <Box p={2}>
                    <AdvancedTable
                      columns={productColumns}
                      data={productsData}
                      // isAction={userType !== "Factory Operation" ? true : false}
                      isAction={!access}
                      loading={isLoading}
                      onEdit={(row) => handleProductEdit(row)}
                      onDelete={(row) => handleProductDelete(row)}
                      onView={(row) => handleProductDetail(row)}
                    />
                    <Pagination
                      paginationData={productsPagination}
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
        <Suspense fallback={null}>
          <ProductSizeModal
            opened={modalOpened}
            onClose={modalHandlers.close}
            onSuccess={refetchProductSizeData}
            setLoader={setLoader}
            from={from}
            setFrom={setFrom}
            prefetchProductSizeDetailData={prefetchProductSizeDetailData}
          />
        </Suspense>
      )}

      {rawModalOpened && (
        <Suspense fallback={null}>
          <RawMaterialModel
            opened={rawModalOpened}
            onClose={rawModalHandlers.close}
            onSuccess={refetchRawMaterialData}
            setLoader={setLoader}
            from={from}
            setFrom={setFrom}
            prefetchRawMaterialDetailData={prefetchRawMaterialDetailData}
            rawMaterialOptions={rawMaterialOptions}
          />
        </Suspense>
      )}
    </>
  );
};
export default ProductAndInventory;
