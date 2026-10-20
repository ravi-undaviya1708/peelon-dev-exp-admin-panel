import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { colors } from "../../../constants/constants";
import useFetchList from "../../../hooks/useFetchList";
import { ordersURLS } from "../../../services/api/superadminApi";
import { PrimaryButton } from "../../../components/StyledButtons";
import { useDisclosure } from "@mantine/hooks";
const OrderModal = lazy(() => import("./modal/OrderModal"));
const DescriptionModal = lazy(() => import("./modal/DescriptionModal"));
const InterstedProductModal = lazy(
  () => import("./modal/InterstedProductsModal"),
);
import {
  Font16,
  StyledTableCell,
  StyledTextField,
} from "../../../components/StyledText";
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
import Loader from "../../../components/loader/Loader";
import { Menu } from "@mantine/core";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Eye, Pencil, Trash2, Watch } from "lucide-react";
import SingleSelect from "../../../components/select/SingleSelect";
import useApiRequest from "../../../hooks/useApiRequest";
import useFetchDropdown from "../../../hooks/useFetchDropdown";
import { Link, useNavigate } from "react-router-dom";
import OrderProgressStatusModal from "./OrderProgressStatusModal";
import { useDebounce } from "use-debounce";
import { StyledNoData } from "../../../components/StyledNoData";
import TrackingIdModal from "./modal/TrackingIdModal";
import { useMediaQuery, useTheme } from "@mui/material";

const ordersInitialPayload = {
  order_progress_status: "",
};

const paymentStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "success", label: "Success" },
  { value: "cancel", label: "Cancel" },
];

function Orders() {
  const isLoading = useSelector((state) => state.loader.isLoading);
  const userType = useSelector((state) => state.auth.userType);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [page, setPage] = useState(1);
  const [from, setFrom] = useState({
    modal: "",
    orderId: "",
    orderStatus: "",
    deliveryConfirmedBy: "",
    dispatchConfirmedBy: "",
    orderTracking: "",
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 1000);
  const [hasTyped, setHasTyped] = useState(false);
  const searchInputRef = useRef(null);
  const [modalOpened, modalHandlers] = useDisclosure(false);
  const [trackingModalOpened, trackingModalHandlers] = useDisclosure(false);
  const [productsModalOpened, productsModalHandlers] = useDisclosure(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const pathConstantsByRole = {
    "Super Admin": superAdminPathConstants,
    "Factory Operation": factoryPathConstants,
    "Sales Representative": salesRepresentativePathConstants,
    "Delivery & Dispatch": deliveryDispatchPathConstants,
    "Warehouse Manager": warehouseManagerPathConstants,
    Accounts: accountsPathConstants,
    Customer: customerPathConstants,
  };
  const access = ["Warehouse Manager"].includes(userType);
  const factoryAccess = !["Super Admin"].includes(userType);

  const pathConstants = pathConstantsByRole[userType];
  const { DEFAULT, DASHBOARD } = pathConstants;
  const { deleterequest, put } = useApiRequest();

  const orderStatus = localStorage.getItem("orderStatus");

  useEffect(() => {
    return () => {
      localStorage.removeItem("orderStatus");
    };
  }, []);

  const { control, reset, watch, setValue } = useForm({
    defaultValues: { ...ordersInitialPayload, status: orderStatus || "" },
  });

  const {
    getOrdersURL,
    orderStatusDropdownURL,
    companiesDropdownURL,
    getWarehousesOptionsURL,
    getProductsDropdownURL,
    getUsersDropdownURL,
    deleteOrderDetailURL,
    orderTypeDropdownURL,
    orderUpdateURL,
    paymentStatusURL,
    invoiceDropdownURL,
  } = ordersURLS;

  const selectedOrderStatus = watch("status", orderStatus || "");

  const [params, setParams] = useState(() => {
    const initial = {};
    if (orderStatus) initial.order_progress_status = orderStatus;
    return initial;
  });
  useEffect(() => {
    localStorage.removeItem("orderStatus");
  }, [selectedOrderStatus]);

  useEffect(() => {
    const newParams = {};
    if (debouncedSearch?.trim()) {
      newParams.search = debouncedSearch;
    }
    if (selectedOrderStatus) {
      newParams.order_progress_status = selectedOrderStatus;
    }
    setPage(1);
    setParams(newParams);
  }, [debouncedSearch, selectedOrderStatus]);

  const {
    data: ordersData,
    refetch: refetchOrdersData,
    pagination: ordersPaginationData,
  } = useFetchList(getOrdersURL, { page, ...params });

  const { data: orderStatusDropdownData } = useFetchDropdown(
    orderStatusDropdownURL,
    "value",
    "key",
  );
  const updateOrderStatusDropdownData=[...orderStatusDropdownData,{label:"Closed",value:"closed"}]
  const { data: companiesDropdownData } = useFetchDropdown(
    companiesDropdownURL,
    "company_name",
    "id",
  );
  const { data: productsDropdownData } = useFetchDropdown(
    getProductsDropdownURL,
    "product_name",
    "id",
  );
  const { data: usersDropdownData } = useFetchDropdown(
    getUsersDropdownURL,
    "full_name",
    "id",
  );
  const { data: warehousesDropdownData } = useFetchDropdown(
    getWarehousesOptionsURL,
    "location",
    "id",
  );
  const { data: orderTypeDropdownData } = useFetchDropdown(
    orderTypeDropdownURL,
    "value",
    "key",
  );
  const { data: invoiceDropdownData } = useFetchDropdown(
    invoiceDropdownURL,
    "quote_no",
    "id",
  );

  useEffect(() => {
    if (ordersData && Array.isArray(ordersData)) {
      const formValues = {};
      ordersData.forEach((item) => {
        formValues[`payment_status${item.id}`] = item.payment_status || "";
      });
      reset((prev) => ({ ...prev, ...formValues }));
    }
  }, [ordersData]);

  useEffect(() => {
    if (hasTyped) {
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [ordersData]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePaymentStatusSubmit = async (data) => {
    let response;
    response = await put(`${paymentStatusURL}/${data?.id}`, {
      payment_status: data?.payment_status,
    });
    if (response.settings.success) {
      toast.success(response.settings.message);
      refetchOrdersData();
    } else {
      toast.error(response.settings.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleterequest(`${deleteOrderDetailURL}/${id}`);
      if (response.settings.success) {
        toast.success(response.settings.message);
        if (ordersData?.length === 1 && page > 1) {
          return setPage(page - 1);
        }
        refetchOrdersData();
      }
    } catch (error) {
      toast.error(response.settings.message);
    }
  };

  const handleOrderDetails = (id) => {
    navigate("../orders/order-details", { state: { orderId: id } });
  };

  const handleTrackingId = (id) => {
    trackingModalHandlers.open();
    setFrom({ modal: "trackingOrder", orderId: id });
  };

  if (isLoading) {
    return <Loader />;
  }

  const cellFontSize = isTablet ? "0.75rem" : "0.813rem";
  const cellPadding = isTablet ? "10px 8px" : "12px 10px";

  const headerCellSx = {
    fontSize: cellFontSize,
    padding: cellPadding,
    whiteSpace: "nowrap",
    backgroundColor: "#FFFDF3",
    color: colors.headingclr,
    fontWeight: 600,
  };

  const bodyCellSx = {
    fontSize: cellFontSize,
    padding: cellPadding,
    whiteSpace: "nowrap",
    verticalAlign: "middle",
  };

  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <Box>
          <Typography
            sx={{ fontSize: "24px", fontWeight: 700, color: colors.headingclr }}
          >
            Orders
          </Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link
              style={{ color: colors.darkgreen, textDecoration: "none" }}
              to={`${DEFAULT}/${DASHBOARD}`}
            >
              <Typography sx={{ fontSize: "14px" }}>Dashboard</Typography>
            </Link>
            <Typography sx={{ fontSize: "14px" }}>Orders List</Typography>
          </Breadcrumbs>
        </Box>
        <Box alignItems={"center"} gap={1} display={"flex"} flexWrap={"wrap"}>
          <Box>
            <StyledTextField
              placeholder="Order ID / Customer ID"
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
              placeholder={"Select Order Progress Status"}
              name={"status"}
              options={updateOrderStatusDropdownData}
            />
          </Box>
          {!access && (
            <PrimaryButton
              onClick={() => {
                setSelectedOrder(null);
                open();
              }}
            >
              Add Order
            </PrimaryButton>
          )}
        </Box>
      </Box>

      {/* Desktop / Tablet Table
          tableLayout:"fixed" forces the browser to honour our % widths.
      <Box sx={{ width: "100%", mt: 2 }} display={{ xs: "none", sm: "block" }}>
        <TableContainer
          sx={{
            maxHeight: 500,
            overflowY: "auto",
            overflowX: "auto",
            borderRadius: "12px",
            border: "1px solid #E6E6E6",
            backgroundColor: "#FFFFFF",
            "&::-webkit-scrollbar": { width: "8px", height: "8px" },
            "&::-webkit-scrollbar-track": {
              background: "#F5F5F5",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#C1C1C1",
              borderRadius: "10px",
              "&:hover": { background: "#A0A0A0" },
            },
          }}
        >
          <Table stickyHeader sx={{ width: "100%", minWidth: 1450 }}>
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ ...headerCellSx, minWidth: "100px" }}>
                  Order ID
                </StyledTableCell>
                <StyledTableCell sx={{ ...headerCellSx, minWidth: "110px" }}>
                  Customer ID
                </StyledTableCell>
                <StyledTableCell sx={{ ...headerCellSx, minWidth: "120px" }}>
                  Customer
                </StyledTableCell>
                <StyledTableCell sx={{ ...headerCellSx, minWidth: "110px" }}>
                  Order Type
                </StyledTableCell>
                <StyledTableCell sx={{ ...headerCellSx, minWidth: "110px" }}>
                  Products
                </StyledTableCell>
                <StyledTableCell sx={{ ...headerCellSx, minWidth: "110px" }}>
                  Warehouse
                </StyledTableCell>
                <StyledTableCell sx={{ ...headerCellSx, minWidth: "110px" }}>
                  Tracking ID
                </StyledTableCell>
                <StyledTableCell sx={{ ...headerCellSx, minWidth: "120px" }}>
                  Order Tracking
                </StyledTableCell>
                <StyledTableCell sx={{ ...headerCellSx, minWidth: "110px" }}>
                  Description
                </StyledTableCell>
                <StyledTableCell sx={{ ...headerCellSx, minWidth: "110px" }}>
                  Order Date
                </StyledTableCell>
                <StyledTableCell sx={{ ...headerCellSx, minWidth: "150px" }}>
                  Progress Status
                </StyledTableCell>
                <StyledTableCell sx={{ ...headerCellSx, minWidth: "180px" }}>
                  Payment Status
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  sx={{ ...headerCellSx, width: "80px", minWidth: "80px" }}
                >
                  Actions
                </StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody sx={{ backgroundColor: "white" }}>
              {ordersData && ordersData.length > 0 ? (
                ordersData?.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{ "&:hover": { backgroundColor: "#F9FAF9" } }}
                  >
                    <TableCell sx={{ ...bodyCellSx, minWidth: "100px" }}>
                      <Font16 sx={{ color: "#666666", fontSize: "inherit" }}>
                        {item?.order_id}
                      </Font16>
                    </TableCell>
                    <TableCell sx={{ ...bodyCellSx, minWidth: "110px" }}>
                      <Font16 sx={{ color: "#666666", fontSize: "inherit" }}>
                        {item?.customer_id}
                      </Font16>
                    </TableCell>
                    <TableCell sx={{ ...bodyCellSx, minWidth: "120px" }}>
                      <Font16 sx={{ color: "#666666", fontSize: "inherit" }}>
                        {item?.user_name}
                      </Font16>
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, minWidth: "110px" }}>
                      <Font16 sx={{ color: "#666666", fontSize: "inherit" }}>
                        {item.order_type || "-"}
                      </Font16>
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, minWidth: "110px" }}>
                      <Suspense fallback={null}>
                        <InterstedProductModal row={item} />
                      </Suspense>
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, minWidth: "110px" }}>
                      <Font16 sx={{ color: "#666666", fontSize: "inherit" }}>
                        {item?.warehouse || "-"}
                      </Font16>
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, minWidth: "110px" }}>
                      <Font16 sx={{ color: "#666666", fontSize: "inherit" }}>
                        {item?.tracking_id || "-"}
                      </Font16>
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, minWidth: "120px" }}>
                      <Font16 sx={{ color: "#666666", fontSize: "inherit" }}>
                        {item?.order_tracking || "-"}
                      </Font16>
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, minWidth: "110px" }}>
                      <Suspense fallback={null}>
                        <DescriptionModal row={item} />
                      </Suspense>
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, minWidth: "110px" }}>
                      <Typography
                        sx={{ fontSize: "inherit", color: "#666666" }}
                      >
                        {item.date_of_order}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, minWidth: "150px" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            color: "#666666",
                            fontSize: "inherit",
                            flex: 1,
                          }}
                        >
                          {item?.order_progress_status?.order_value}
                        </Box>
                        {item.order_progress_status?.order_key !=="delivered"&&
                        !access &&
                          (!factoryAccess ||
                            (item.order_progress_status?.order_key !==
                              "delivered" &&
                              item.order_progress_status?.order_key !==
                                "closed")) && (
                            <IconButton
                              style={{
                                color: "#16A14E",
                                padding: "2px",
                                flexShrink: 0,
                              }}
                              onClick={() => {
                                modalHandlers.open();
                                setFrom({
                                  modal: "editStatus",
                                  orderId: item.id,
                                  orderStatus:
                                    item?.order_progress_status?.order_key,
                                  deliveryConfirmedBy:
                                    item?.delivery_confirmed_by?.id,
                                  dispatchConfirmedBy:
                                    item?.dispatch_confirmed_by?.id,
                                  orderTracking: item?.order_tracking,
                                });
                              }}
                              size="small"
                            >
                              <Pencil size={12} />
                            </IconButton>
                          )}
                      </Box>
                    </TableCell>

                    <TableCell
                      sx={{
                        ...bodyCellSx,
                        minWidth: "180px",
                        padding: isTablet ? "6px 4px" : "10px 8px",
                      }}
                    >
                      <Box sx={{ minWidth: 160 }}>
                        <SingleSelect
                          options={paymentStatusOptions}
                          control={control}
                          isDisabled={
                            access ||
                            (userType !== "Super Admin" &&
                              userType !== "Accounts")
                          }
                          isClearable={false}
                          menuPortalTarget={document.body}
                          name={`payment_status${item.id}`}
                          onChangeOverride={(value) => {
                            const rowData = {
                              id: item.id,
                              payment_status: value,
                            };
                            handlePaymentStatusSubmit(rowData);
                          }}
                        />
                      </Box>
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{ ...bodyCellSx, width: "80px", minWidth: "80px", padding: "6px 2px" }}
                    >
                      <Menu shadow="md" width={200} position="bottom-end">
                        <Menu.Target>
                          <Button
                            variant="text"
                            sx={{
                              minWidth: "auto",
                              padding: "4px",
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                              },
                            }}
                          >
                            <BsThreeDotsVertical color="grey" fontSize={16} />
                          </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                          {!access && (
                            <>
                              <Menu.Item
                                leftSection={
                                  <Pencil size={16} style={{ color: "gray" }} />
                                }
                                style={{ color: "gray" }}
                                onClick={() => {
                                  setSelectedOrder(item);
                                  open();
                                }}
                              >
                                Edit Order
                              </Menu.Item>
                              <Menu.Item
                                leftSection={
                                  <Pencil size={16} style={{ color: "gray" }} />
                                }
                                style={{ color: "gray" }}
                                onClick={() => handleTrackingId(item?.id)}
                              >
                                Edit Tracking Id
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<Trash2 size={16} color="gray" />}
                                style={{ color: "gray" }}
                                onClick={() => handleDelete(item?.id)}
                              >
                                Delete
                              </Menu.Item>
                            </>
                          )}
                          <Menu.Item
                            leftSection={
                              <Eye size={16} style={{ color: "gray" }} />
                            }
                            style={{ color: "gray" }}
                            onClick={() => handleOrderDetails(item?.id)}
                          >
                            View
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={13} align="center">
                    <StyledNoData />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Mobile Card View — unchanged */}
      <Box
        mt={2}
        display={{ xs: "block", sm: "none" }}
        flexDirection="column"
        gap={2}
      >
        {ordersData && ordersData.length > 0 ? (
          ordersData.map((item) => (
            <Card
              key={item.id}
              sx={{
                borderRadius: "12px",
                border: "1px solid #E6E6E6",
                backgroundColor: "#FFFDF3",
                boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.05)",
                marginBottom: 2,
              }}
            >
              <CardContent>
                <Box mb={1}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: colors.headingclr,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  >
                    Order ID
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666666",
                      fontWeight: 500,
                      fontSize: "0.813rem",
                      wordBreak: "break-word",
                    }}
                  >
                    {item?.order_id || "-"}
                  </Typography>
                </Box>

                <Box mb={1}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: colors.headingclr,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  >
                    Customer ID
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666666",
                      fontWeight: 500,
                      fontSize: "0.813rem",
                      wordBreak: "break-word",
                    }}
                  >
                    {item?.customer_id || "-"}
                  </Typography>
                </Box>

                <Box mb={1}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: colors.headingclr,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  >
                    Customer
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666666",
                      fontWeight: 500,
                      fontSize: "0.813rem",
                      wordBreak: "break-word",
                    }}
                  >
                    {item?.user_name || "-"}
                  </Typography>
                </Box>

                <Box mb={1}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: colors.headingclr,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  >
                    Order Type
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666666",
                      fontWeight: 500,
                      fontSize: "0.813rem",
                      wordBreak: "break-word",
                    }}
                  >
                    {item?.order_type || "-"}
                  </Typography>
                </Box>

                <Box mt={1}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: colors.headingclr,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  >
                    Products
                  </Typography>
                  <Suspense fallback={null}>
                    <InterstedProductModal row={item} />
                  </Suspense>
                </Box>

                <Box mb={1}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: colors.headingclr,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  >
                    Warehouse
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666666",
                      fontWeight: 500,
                      fontSize: "0.813rem",
                      wordBreak: "break-word",
                    }}
                  >
                    {item?.warehouse || "-"}
                  </Typography>
                </Box>

                <Box mb={1}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: colors.headingclr,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  >
                    Tracking ID
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666666",
                      fontWeight: 500,
                      fontSize: "0.813rem",
                      wordBreak: "break-word",
                    }}
                  >
                    {item?.tracking_id || "-"}
                  </Typography>
                </Box>

                <Box mb={1}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: colors.headingclr,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  >
                    Order Tracking
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666666",
                      fontWeight: 500,
                      fontSize: "0.813rem",
                      wordBreak: "break-word",
                    }}
                  >
                    {item?.order_tracking || "-"}
                  </Typography>
                </Box>

                <Box mb={1}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: colors.headingclr,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  >
                    Date
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666666",
                      fontWeight: 500,
                      fontSize: "0.813rem",
                    }}
                  >
                    {item?.date_of_order || "-"}
                  </Typography>
                </Box>

                <Box mb={1}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: colors.headingclr,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  >
                    Order Progress Status
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666666",
                        fontWeight: 500,
                        fontSize: "0.813rem",
                        wordBreak: "break-word",
                      }}
                    >
                      {item?.order_progress_status?.order_value}
                    </Typography>
                    {!access &&
                      (!factoryAccess ||
                        (item.order_progress_status?.order_key !==
                          "delivered" &&
                          item.order_progress_status?.order_key !==
                            "closed")) && (
                        <Button
                          onClick={() => {
                            modalHandlers.open();
                            setFrom({
                              modal: "editStatus",
                              orderId: item.id,
                              orderStatus:
                                item?.order_progress_status?.order_key,
                              deliveryConfirmedBy:
                                item?.delivery_confirmed_by?.id,
                              dispatchConfirmedBy:
                                item?.dispatch_confirmed_by?.id,
                            });
                          }}
                          size="small"
                          variant="contained"
                          sx={{
                            backgroundColor: "#16A14E",
                            color: "#fff",
                            minWidth: 0,
                            px: 1,
                            fontSize: "0.7rem",
                          }}
                        >
                          <Pencil size={12} />
                        </Button>
                      )}
                  </Box>
                </Box>

                <Box mb={1}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: colors.headingclr,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  >
                    Payment Status
                  </Typography>
                  <SingleSelect
                    options={paymentStatusOptions}
                    control={control}
                    isDisabled={
                      access ||
                      (userType !== "Super Admin" && userType !== "Accounts")
                    }
                    isClearable={false}
                    menuPortalTarget={document.body}
                    name={`payment_status${item.id}`}
                    onChangeOverride={(value) => {
                      const rowData = { id: item.id, payment_status: value };
                      handlePaymentStatusSubmit(rowData);
                    }}
                  />
                </Box>

                <Box mt={1}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: colors.headingclr,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  >
                    Description
                  </Typography>
                  <Suspense fallback={null}>
                    <DescriptionModal row={item} />
                  </Suspense>
                </Box>

                {!access ? (
                  <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                    <Button
                      onClick={() => {
                        setSelectedOrder(item);
                        open();
                      }}
                      size="small"
                      variant="contained"
                      sx={{
                        backgroundColor: "#16A14E",
                        color: "white",
                        fontSize: "0.7rem",
                        textTransform: "none",
                        padding: "4px 8px",
                      }}
                      startIcon={<Pencil size={12} />}
                    >
                      Edit Order
                    </Button>
                    <Button
                      onClick={() => handleTrackingId(item?.id)}
                      size="small"
                      variant="contained"
                      sx={{
                        backgroundColor: "#16A14E",
                        color: "white",
                        fontSize: "0.7rem",
                        textTransform: "none",
                        padding: "4px 8px",
                      }}
                      startIcon={<Pencil size={12} />}
                    >
                      Edit Tracking
                    </Button>
                    <Button
                      onClick={() => handleDelete(item?.id)}
                      size="small"
                      variant="contained"
                      color="error"
                      sx={{
                        fontSize: "0.7rem",
                        textTransform: "none",
                        padding: "4px 8px",
                      }}
                      startIcon={<Trash2 size={12} />}
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() => handleOrderDetails(item?.id)}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: "#999",
                        color: "#444",
                        fontSize: "0.7rem",
                        textTransform: "none",
                        padding: "4px 8px",
                      }}
                      startIcon={<Eye size={12} />}
                    >
                      View
                    </Button>
                  </Box>
                ) : (
                  <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                    <Button
                      onClick={() => handleOrderDetails(item?.id)}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: "#999",
                        color: "#444",
                        fontSize: "0.7rem",
                        textTransform: "none",
                        padding: "4px 8px",
                      }}
                      startIcon={<Eye size={12} />}
                    >
                      View
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <StyledNoData />
        )}
      </Box>

      <Pagination
        paginationData={ordersPaginationData}
        handlePageChange={handlePageChange}
      />

      {opened && (
        <Suspense fallback={null}>
          <OrderModal
            opened={opened}
            onClose={() => {
              setSelectedOrder(null);
              close();
            }}
            selectedOrder={selectedOrder}
            companiesDropdownData={companiesDropdownData}
            productsDropdownData={productsDropdownData}
            usersDropdownData={usersDropdownData}
            warehousesDropdownData={warehousesDropdownData}
            orderTypeDropdownData={orderTypeDropdownData}
            invoiceDropdownData={invoiceDropdownData}
            refetchOrdersData={refetchOrdersData}
          />
        </Suspense>
      )}

      {modalOpened && (
        <Suspense fallback={null}>
          <OrderProgressStatusModal
            opened={modalOpened}
            onClose={modalHandlers.close}
            orderStatusDropdownData={orderStatusDropdownData}
            usersDropdownData={usersDropdownData}
            ordersData={ordersData}
            from={from}
            refetchOrdersData={refetchOrdersData}
          />
        </Suspense>
      )}

      {trackingModalOpened && (
        <Suspense fallback={null}>
          <TrackingIdModal
            opened={trackingModalOpened}
            onClose={trackingModalHandlers.close}
            from={from}
            refetchOrdersData={refetchOrdersData}
          />
        </Suspense>
      )}
    </>
  );
}

export default Orders;
