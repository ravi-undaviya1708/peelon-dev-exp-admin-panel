import { useForm } from "react-hook-form";
import { Box, Grid } from "@mui/material";
import { toast } from "react-toastify";
import useApiRequest from "../../../../hooks/useApiRequest";
import useFetchDropdown from "../../../../hooks/useFetchDropdown";
import StyledModal from "../../../../components/StyledModal";
import { Label16 } from "../../../../components/StyledText";
import {
  customerManagementURLS,
  LeadsURLS,
} from "../../../../services/api/superadminApi";
import SingleSelect from "../../../../components/select/SingleSelect";
import { useEffect } from "react";

const initialPayloadsDeal = {
  sales_representative: "",
};

function AssignedToModal({
  opened,
  onClose,
  from,
  setFrom,
  refetchBulk,
}) {
  const { post, put } = useApiRequest();
  const { postAssignedToURL, putAssignedToURL,salesRepresentivDropdownURL } =
    customerManagementURLS;
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isDirty, errors },
  } = useForm({
    defaultValues: initialPayloadsDeal,
  });

  const { data: salesData } = useFetchDropdown(
    salesRepresentivDropdownURL,
    "full_name",
    "id",
  );

  const orderId = from?.orderId;
  console.log("from", from);

  useEffect(() => {
    if (from?.assignedCustomer ) {
      reset({
        sales_representative: from?.assignedCustomer,
      });
    }
  }, [from?.assignedCustomer]);

  const onSubmitAssignedTo = async (data) => {
    const paylaod = {
      sales_representative: data?.sales_representative,
      bulk_order_id: orderId,
    };

    let response;
    if (from?.assignedCustomer) {
      response = await put(`${putAssignedToURL}/${orderId}`, paylaod);
    } else {
      response = await post(postAssignedToURL, {
        ...paylaod,
      });
    }
    if (response.settings.success) {
      toast.success(response.settings.message);
      reset();
      onClose();
      refetchBulk();
      setFrom({ orderId: "" });
    } else {
      toast.error(response.settings.message);
    }
  };

  return (
    <StyledModal
      opened={opened}
      onClose={onClose}
      isDirty={false}
      title="Assign To"
      buttonText="Submit"
      formProps={{ onSubmit: handleSubmit(onSubmitAssignedTo) }}
      isSubmitting={isSubmitting}
    >
      <Box sx={{ maxHeight: 500, overflowY: "auto", pr: 1 }}>
        <Grid container spacing={2} sx={{ borderRadius: "30px" }}>
          {/* Assign To */}
          <Grid size={{ xs: 12 }}>
            <Label16>Assign To</Label16>
            <SingleSelect
              options={salesData}
              isClearable={false}
              control={control}
              name="sales_representative"
              placeholder="Select team or user"
            />
          </Grid>
        </Grid>
      </Box>
    </StyledModal>
  );
}

export default AssignedToModal;
