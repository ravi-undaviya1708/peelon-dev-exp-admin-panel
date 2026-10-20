import { Box, Breadcrumbs, Card, Typography } from "@mui/material";
import { colors } from "../../../constants/constants";
import { Tabs } from "@mantine/core";
import { PrimaryButton } from "../../../components/StyledButtons";
import { Link, useNavigate } from "react-router-dom";
import { Font16, StyledTextField } from "../../../components/StyledText";
import { AdvancedTable } from "../../../components/AdvanceTable";
import {
  quotationColumns,
  InvoiceColumns,
  purchaseOrderColumns,
} from "./InvoicePoAndQuoteTable";
import { Mail, NotebookTabs, Phone, StickyNote } from "lucide-react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  accountsPathConstants,
  customerPathConstants,
  deliveryDispatchPathConstants,
  factoryPathConstants,
  salesRepresentativePathConstants,
  superAdminPathConstants,
  warehouseManagerPathConstants,
} from "../../../constants/pathConstants";
import { invoiceURLS } from "../../../services/api/superadminApi";
import useFetchList from "../../../hooks/useFetchList";
import { toast } from "react-toastify";
import Pagination from "../../../components/pagination/Pagination";
import useApiRequest from "../../../hooks/useApiRequest";
import apiClient from "../../../services/interceptors/Interceptor";
import Loader from "../../../components/loader/Loader";
import { useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import UploadQuotation from "./modal/UploadQuotation";
import { useDisclosure } from "@mantine/hooks";

const InvoicePoAndQuote = () => {
  const isLoading = useSelector((state) => state.loader.isLoading);
  const userType = useSelector((state) => state.auth.userType);
  const searchInputRef = useRef(null);
  const [hasTyped, setHasTyped] = useState(false);
  const { deleterequest } = useApiRequest();
  const [uploadQuotationModal, uploadQuotationModalHandlers] =
    useDisclosure(false);

  const savedTab = localStorage.getItem("selectedInvoice") || "Quotation";
  const pathConstantsByRole = {
    "Super Admin": superAdminPathConstants,
    "Factory Operation": factoryPathConstants,
    "Sales Representative": salesRepresentativePathConstants,
    "Delivery & Dispatch": deliveryDispatchPathConstants,
    "Warehouse Manager": warehouseManagerPathConstants,
    Accounts: accountsPathConstants,
    Customer: customerPathConstants,
  };
  const access = ["Warehouse Manager", "Factory Operation"]?.includes(userType);

  const pathConstants = pathConstantsByRole[userType];
  const { DEFAULT, DASHBOARD } = pathConstants;
  const [page, setPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState(savedTab);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 1000);
  const [from, setFrom] = useState({
    modal: "",
    quotationId: "",
    status: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("selectedInvoice", selectedTab);
  }, [selectedTab]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const [params, setParams] = useState({});
  useEffect(() => {
    const newParams = {};
    if (debouncedSearch?.trim()) {
      newParams.search = debouncedSearch;
    }
    setPage(1);
    setParams(newParams);
  }, [debouncedSearch]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setHasTyped(true);
  };

  const { getQuotationURL, deleteQutatationURL, convertStatustURL } =
    invoiceURLS;
  const status = selectedTab?.toLocaleLowerCase();

  const {
    data: quotationData,
    refetch: refetchQuotationData,
    pagination: quotationPaginationData,
  } = useFetchList(
    getQuotationURL,
    {
      status: status === "purchase order" ? "purchase_order" : status,
      page: page,
      ...params,
    },
    !!selectedTab
  );

  const handleNavigate = (selectedValue) => {
    selectedValue === "Quotation" &&
      navigate("../invoice-po-and-quote/quotation", {
        state: { status: selectedValue },
      });
    selectedValue === "Purchase Order" &&
      navigate("../invoice-po-and-quote/purchase_order", {
        state: { status: selectedValue },
      });
    selectedValue === "Invoice" &&
      navigate("../invoice-po-and-quote/invoice", {
        state: { status: selectedValue },
      });
  };

  const handleEditQuotation = (row, from) => {
    navigate("../invoice-po-and-quote/quotation", {
      state: {
        status: selectedTab,
        status: selectedTab,
        from: "editQuatation",
        id: row?.id,
      },
    });
  };

  const handleEditPurchase = (row, from) => {
    navigate("../invoice-po-and-quote/purchase_order", {
      state: {
        status: selectedTab,
        status: selectedTab,
        from: "editPurchaseOrder",
        id: row?.id,
      },
    });
  };

  const handleEditInvoice = (row, from) => {
    navigate("../invoice-po-and-quote/invoice", {
      state: {
        status: selectedTab,
        status: selectedTab,
        from: "editInvoice",
        id: row?.id,
      },
    });
  };

  const handleDelete = async (row) => {
    const response = await deleterequest(`${deleteQutatationURL}/${row.id}`);
    if (response.settings.success) {
      toast.success(response.settings.message);
      if (quotationData?.length === 1 && page > 1) {
        return setPage(page - 1);
      }
      refetchQuotationData();
    } else {
      toast.error(response.settings.message);
    }
  };

  // const handleConvert = async (row, from) => {
  //   try {
  //     const response = await apiClient.put(`${convertStatustURL}/${row?.id}`, { status: from });
  //     //console.log(response);
  //     if (response?.data?.settings?.success) {
  //       toast.success(response?.data?.settings?.message || "Status updated successfully");
  //       refetchQuotationData();
  //     } else {
  //       toast.error(response?.settings?.message || "Failed to update status");
  //     }
  //   } catch (error) {
  //     console.error("Convert status failed:", error);
  //     toast.error("Something went wrong while converting status.");
  //   }
  // };

  const handleConvert = (row, from) => {
    uploadQuotationModalHandlers.open();
    setFrom({ quotationId: row.id, status: from });
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
  }, [quotationData]);

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
              Transactions Hub
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
                placeholder="Enter Quote Number"
                value={search}
                onChange={handleSearchChange}
                ref={searchInputRef}
              />
            </Box>

            {!access && (
              <PrimaryButton
                onClick={() => {
                  handleNavigate(selectedTab);
                }}
              >
                Add {selectedTab}
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
              <Tabs value={selectedTab} onChange={setSelectedTab} color="green">
                <Tabs.List
                  className="custom-tabs-list"
                  style={{ paddingTop: "10px" }}
                >
                  <Tabs.Tab value="Quotation">
                    <Box display={"flex"} gap={1}>
                      <Box alignContent={"center"}>
                        <Phone size={"15px"} />
                      </Box>
                      <Box>
                        <Font16 sx={{ color: "#444444" }}>Quotation</Font16>
                      </Box>
                    </Box>
                  </Tabs.Tab>
                  <Tabs.Tab value="Purchase Order">
                    <Box display={"flex"} gap={1}>
                      <Box alignContent={"center"}>
                        <NotebookTabs size={"15px"} />
                      </Box>
                      <Box>
                        <Font16 sx={{ color: "#444444" }}>
                          Purchase Order
                        </Font16>
                      </Box>
                    </Box>
                  </Tabs.Tab>
                  <Tabs.Tab value="Invoice">
                    <Box display={"flex"} gap={1}>
                      <Box alignContent={"center"}>
                        <Mail size={"15px"} />
                      </Box>
                      <Box>
                        <Font16 sx={{ color: "#444444" }}>Invoice</Font16>
                      </Box>
                    </Box>
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="Quotation">
                  <Box p={2}>
                    <AdvancedTable
                      columns={quotationColumns}
                      data={quotationData}
                      // isAction={userType !== "Factory Operation" ? true : false}
                      isAction={!access}
                      onEdit={(row) => handleEditQuotation(row)}
                      convertPurchase={(row) =>
                        handleConvert(row, "purchase_order")
                      }
                      onDelete={(row) => handleDelete(row)}
                      // uploadQuotation={(row) => handleUploadQuotation(row)}
                    />
                  </Box>
                  <Pagination
                    paginationData={quotationPaginationData}
                    handlePageChange={handlePageChange}
                  />
                </Tabs.Panel>
                <Tabs.Panel value="Purchase Order">
                  <Box p={2}>
                    <AdvancedTable
                      columns={purchaseOrderColumns}
                      data={quotationData}
                      // isAction={userType !== "Factory Operation" ? true : false}
                      isAction={!access}
                      onEdit={(row) => handleEditPurchase(row)}
                      convertInvoice={(row) => handleConvert(row, "invoice")}
                      onDelete={(row) => handleDelete(row)}
                    />
                  </Box>
                  <Pagination
                    paginationData={quotationPaginationData}
                    handlePageChange={handlePageChange}
                  />
                </Tabs.Panel>
                <Tabs.Panel value="Invoice">
                  <Box p={2}>
                    <AdvancedTable
                      columns={InvoiceColumns}
                      data={quotationData}
                      // isAction={userType !== "Factory Operation" ? true : false}
                      isAction={!access}
                      onEdit={(row) => handleEditInvoice(row)}
                      onDelete={(row) => handleDelete(row)}
                      //   onView={true}
                    />
                  </Box>
                  <Pagination
                    paginationData={quotationPaginationData}
                    handlePageChange={handlePageChange}
                  />
                </Tabs.Panel>
              </Tabs>
            </Box>
          </Card>
        </Box>
      </Box>

      {uploadQuotationModal && (
        <Suspense fallback={null}>
          <UploadQuotation
            from={from}
            setFrom={setFrom}
            opened={uploadQuotationModal}
            onClose={uploadQuotationModalHandlers.close}
            refetchQuotationData={refetchQuotationData}
          />
        </Suspense>
      )}
    </>
  );
};
export default InvoicePoAndQuote;
