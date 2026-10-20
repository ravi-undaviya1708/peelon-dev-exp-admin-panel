import { useForm } from "react-hook-form";
import { Box, Grid } from "@mui/material";
import { toast } from "react-toastify";
import useApiRequest from "../../hooks/useApiRequest";
import StyledModal from "../../components/StyledModal";
import { Label16 } from "../../components/StyledText";
import { TextareaInput } from "../../components/input/TextareaInput";
import { dashboardURLS, DealsURLS } from "../../services/api/superadminApi";
import { FormInput } from "../../components/input/FormInput";
import SingleSelect from "../../components/select/SingleSelect";
import { superAdminURL } from "../../services/api/api";
import useFetchDropdown from "../../hooks/useFetchDropdown";
import { useEffect, useMemo } from "react";
import { mapApiDataToForm } from "../../hooks/mapApiDataToForm";

const initialPayloadsDeal = {
  title: "",
  module: "",
  module_ref_id: "",
  assigned_to: "",
  description: "",
  ticket_status:""
};

const statusOptions = [
  { label: "Opened", value: "opened" },
  { label: "Closed", value: "closed" },
  { label: "In Progress", value: "in_progress" },
];

function RaiseTicketModal({
  opened,
  onClose,
  from,
  setFrom,
  refetchRaisedTicket,
}) {
  const { post, put } = useApiRequest();
  const {
    postRaiseTicketURL,
    allUserURL,
    getModuleDropdownURL,
    putRaiseTicketURL,
    commonDrodownUrL,
  } = dashboardURLS;
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting, isDirty, errors },
  } = useForm({
    defaultValues: initialPayloadsDeal,
    // resolver: yupResolver(dealValidation)
  });
  console.log("from", from?.ticketDetail?.id);

  const watchedModule = watch("module");

  const { data: allUserData } = useFetchDropdown(allUserURL, "email", "id");
  const { data: moduleData } = useFetchDropdown(
    getModuleDropdownURL,
    "value",
    "key",
  );
  const moduleLabelKey = watchedModule ? `${watchedModule}_id` : "id";
  const { data: rawCommonDropdownData } = useFetchDropdown(
    commonDrodownUrL,
    moduleLabelKey,
    "id",
    watchedModule ? { module: watchedModule } : null,
    !!watchedModule,
  );
  const commonDropdownData = useMemo(
    () =>
      rawCommonDropdownData.map((item) => ({
        value: item.value,
        label: item.label,
      })),
    [rawCommonDropdownData],
  );

  useEffect(() => {
    setValue("module_ref_id", "");
  }, [watchedModule, setValue]);

  useEffect(() => {
    if (from?.modal === "editTicket" && from?.ticketDetail) {
      const formValues = mapApiDataToForm(
        initialPayloadsDeal,
        from?.ticketDetail,
      );
      reset({
        ...formValues,
        assigned_to: from?.ticketDetail?.assigned_to?.id,
      });
    }
  }, [from.modal, from?.ticketDetail, reset]);
  console.log("formValues", watch());

  const onSubmitDeal = async (data) => {
    const payload = {};
    for (let field in data) {
      const value = data[field];
      if (value !== null && value !== "") {
        if (field === "module_ref_id" && data.module) {
          payload[data.module] = value;
        } else {
          payload[field] = value;
        }
      }
    }
    let response;
    if (from?.modal === "editTicket") {
      response = await put(
        `${putRaiseTicketURL}/${from?.ticketDetail?.id}`,
        payload,
      );
    } else {
      response = await post(postRaiseTicketURL, payload);
    }
    if (response?.settings?.success) {
      toast.success(response?.settings?.message);
      refetchRaisedTicket();
      console.log("swamy");
      
      reset();
      onClose();
      setFrom({ ticketDetail: "" });
    } else {
      toast.error(response.settings.message);
    }
  };

  return (
    <StyledModal
      opened={opened}
      onClose={onClose}
      isDirty={from?.modal === "editTicket" && !isDirty}
      title={from?.modal === "editTicket" ? "Edit Ticket" : "Raise Ticket"}
      buttonText={from?.modal === "editTicket" ? "Edit Ticket" : "Raise Ticket"}
      formProps={{ onSubmit: handleSubmit(onSubmitDeal) }}
      isSubmitting={isSubmitting}
    >
      <Box sx={{ maxHeight: 500, overflowY: "auto", pr: 1 }}>
        <Grid container spacing={2} sx={{ borderRadius: "30px" }}>
          {/* Title */}
          <Grid size={{ xs: 12 }}>
            <Label16>Ticket Title</Label16>
            <FormInput
              control={control}
              name="title"
              placeholder="Enter ticket title"
              type="text"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Label16>Module</Label16>
            <SingleSelect
              control={control}
              name="module"
              options={moduleData}
              placeholder="Select module"
            />
          </Grid>

          {watchedModule && (
            <Grid size={{ xs: 12 }}>
              <Label16>Select ID</Label16>
              <SingleSelect
                control={control}
                name="module_ref_id"
                options={commonDropdownData}
                placeholder={`Select ${watchedModule} ID`}
              />
            </Grid>
          )}

          {/* Assign To */}
          <Grid size={{ xs: 12 }}>
            <Label16>Assign To</Label16>
            <SingleSelect
              options={allUserData}
              control={control}
              name="assigned_to"
              placeholder="Select employee"
            />
          </Grid>

          {/* Description */}
          <Grid size={{ xs: 12 }}>
            <Label16>Description</Label16>
            <TextareaInput
              minRows={4}
              control={control}
              name="description"
              placeholder="Describe your issue in detail"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Label16>Status</Label16>
            <SingleSelect
              options={statusOptions}
              control={control}
              name="ticket_status"
              placeholder="Select status"
            />
          </Grid>
        </Grid>
      </Box>
    </StyledModal>
  );
}

export default RaiseTicketModal;
