import { Box, Breadcrumbs, Card, Typography } from "@mui/material";
import { colors } from "../../../constants/constants";
import { AdvancedTable } from "../../../components/AdvanceTable";
import { qualityColumns } from "./QualityControlTable";
import {
  accountsPathConstants,
  customerPathConstants,
  deliveryDispatchPathConstants,
  factoryPathConstants,
  salesRepresentativePathConstants,
  superAdminPathConstants,
  warehouseManagerPathConstants,
} from "../../../constants/pathConstants";
import useFetchList from "../../../hooks/useFetchList";
import { qualityControlURLS } from "../../../services/api/superadminApi";
import { PrimaryButton } from "../../../components/StyledButtons";
import { useDisclosure } from "@mantine/hooks";
import StyledModal from "../../../components/StyledModal";
import QualityModaljsx from "./modals/QualityModal.jsx";
import QualityModal from "./modals/QualityModal.jsx";
import { useState } from "react";
import { deleteApi } from "../../../hooks/apiLogic.js";
import { toast } from "react-toastify";
import useApiRequest from "../../../hooks/useApiRequest.js";
import { useSelector } from "react-redux";
import Loader from "../../../components/loader/Loader.jsx";
import Pagination from "../../../components/pagination/Pagination.jsx";
import { Link } from "react-router-dom";

const QualityControl = () => {
  const [loader, setLoader] = useState(true);
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
  const access = ["Accounts"].includes(userType);

  const pathConstants = pathConstantsByRole[userType];
  const { DEFAULT, DASHBOARD } = pathConstants;
  const [opened, { open, close }] = useDisclosure(false);
  const [page, setPage] = useState(1);
  const { getQualityURL, deleteQualityURL, getQualityDetailURL } =
    qualityControlURLS;
  const { deleterequest } = useApiRequest();
  const [from, setFrom] = useState({
    modal: "",
    qualityId: "",
  });
  const {
    data: qualityData,
    refetch: refetchQualityData,
    pagination: qualityPagination,
  } = useFetchList(getQualityURL);
  const { data: prefetchQualityDetailData } = useFetchList(
    `${getQualityDetailURL}/${from.qualityId}`,
    {},
    !!from?.qualityId
  );

  const handleQualityDelete = async (id) => {
    setLoader(false);
    const response = await deleterequest(`${deleteQualityURL}/${id}`);
    if (response.settings.success) {
      setLoader(true);
      toast.success(response.settings.message);
      if (qualityData?.length === 1 && page > 1) {
        return setPage(page - 1);
      }
      refetchQualityData();
    } else {
      toast.error(response.settings.message);
    }
  };

  const handleEdit = (id) => {
    open();
    setFrom({
      modal: "editQuality",
      qualityId: id,
    });
  };
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (isLoading && loader) {
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
              Quality Control
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                style={{ color: colors.darkgreen, textDecoration: "none" }}
                to={`${DEFAULT}/${DASHBOARD}`}
              >
                <Typography sx={{ fontSize: "14px" }}>Dashbaord</Typography>
              </Link>
              <Typography sx={{ fontSize: "14px" }}>Quality Control</Typography>
            </Breadcrumbs>
          </Box>
          {!access && (
            <Box alignContent={"center"} mt={1}>
              <PrimaryButton
                onClick={() => {
                  open(), setFrom({ modal: "addQuality" });
                }}
              >
                {" "}
                Add Quality Control
              </PrimaryButton>
            </Box>
          )}
        </Box>
        <Box mt={2}>
          <AdvancedTable
            columns={qualityColumns}
            data={qualityData}
            isAction={!access}
            onEdit={(row) => {
              handleEdit(row.id);
            }}
            onDelete={(row) => handleQualityDelete(row?.id)}
          />
          <Pagination
            paginationData={qualityPagination}
            handlePageChange={handlePageChange}
          />
        </Box>
        {opened && (
          <QualityModal
            opened={opened}
            onClose={close}
            from={from}
            setFrom={setFrom}
            onSuccess={refetchQualityData}
            prefetchQualityDetailData={prefetchQualityDetailData}
          />
        )}
      </Box>
    </>
  );
};
export default QualityControl;
