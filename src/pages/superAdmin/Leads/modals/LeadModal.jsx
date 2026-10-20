import React, { lazy, Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "../../../../components/input/FormInput";
import { TextareaInput } from "../../../../components/input/TextareaInput";
import SingleSelect from "../../../../components/select/SingleSelect";
import { useForm } from "react-hook-form";
import { Box, Grid, IconButton } from "@mui/material";
import { Font16, Label16 } from "../../../../components/StyledText";
import StyledModal from "../../../../components/StyledModal";
import { LeadsURLS } from "../../../../services/api/superadminApi";
import useApiRequest from "../../../../hooks/useApiRequest";
import { mapApiDataToForm } from "../../../../hooks/mapApiDataToForm";
import { initialLeadPayload, volumeUnitsOptions } from "../initialPayloads";
import { leadValidation } from "../schema";
import { useDisclosure } from "@mantine/hooks";
import { PrimaryButton } from "../../../../components/StyledButtons";
import CreateNewFieldModal from "./CreateNewFieldModal";
import { X } from "lucide-react";
import MulitiSelect from "../../../../components/select/MulitSelect";
import useFetchDropdown from "../../../../hooks/useFetchDropdown";
const AddCompanyModal = lazy(() => import("./AddCompanyModal"));

function LeadModal({
  opened,
  onClose,
  from,
  setLoader,
  leadSourceData,
  leadStageData,
  salesRepresentativeData,
  usersDropdownData,
  refetchLeadsData,
  prefetchLeadData,
  companiesDropdownData,
  productsDropdownData,
  refetchcompaniesDropdownData,
  setFrom,
}) {
  const [customFields, setCustomFields] = useState([]);
  const [addCompanyId, setAddCompanyId] = useState(null);
  const [addCompanyOpened, { open: companyOpen, close: companyClose }] =
    useDisclosure(false);
  const [
    createFieldOpened,
    { open: createFieldOpen, close: createFieldClose },
  ] = useDisclosure(false);
  const { post, put } = useApiRequest();
  const { postLeadURL, editLeadDetailURL, locationDropdwonURL } = LeadsURLS;
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isDirty, errors },
  } = useForm({
    defaultValues: initialLeadPayload,
    resolver: yupResolver(leadValidation),
  });

  //console.log("form fields", watch());
  const leadByTeam = watch("lead_source");
  console.log(errors);

  const toDateOnly = (value) => {
    if (!value) return null;

    const d = new Date(value);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`; // YYYY-MM-DD (local)
  };

  const { data: locationDropdownOptions } = useFetchDropdown(
    locationDropdwonURL,
    "value",
    "key",
  );

  useEffect(() => {
    reset({
      company: addCompanyId,
    });
  }, [addCompanyId]);

  useEffect(() => {
    if (
      (from?.modal === "editLead" || from.modal === "leadDetail") &&
      prefetchLeadData
    ) {
      const formValues = mapApiDataToForm(initialLeadPayload, prefetchLeadData);
      reset({
        ...formValues,
        company: prefetchLeadData?.company_name?.id,
        follow_up: prefetchLeadData?.lead_details?.follow_up,
        lead_source: prefetchLeadData.lead_source?.key,
        lead_stage: prefetchLeadData.lead_details?.lead_stage?.key,
        assigned_sales_representative:
          prefetchLeadData?.lead_details?.assigned_sales_representative?.id,
        interested_product:
          prefetchLeadData?.lead_details?.interested_product?.map(
            (item) => item.id,
          ) || [],
        lead_by_team: prefetchLeadData?.lead_by_team?.id,
        lead_source: prefetchLeadData?.lead_source?.key,
        // trail_data:prefetchLeadData?.trail_data
        location: prefetchLeadData?.location?.key,
      });
    }
  }, [from, prefetchLeadData, reset]);

  const handleCustomNewField = (field) => {
    setCustomFields((prev) => [...prev, field]);
  };

  //console.log("form fields", watch());
  //console.log("customfelds", customFields);

  const handleRemoveField = (fieldName) => {
    setCustomFields((prev) => prev.filter((field) => field.name !== fieldName));
    reset((prevValues) => {
      const newValues = { ...prevValues };
      delete newValues[fieldName];
      return newValues;
    });
  };

  const onSubmit = async (data) => {
    const fieldData = {};
    for (let field in data) {
      const value = data[field];
      if (value !== "") {
        fieldData[field] = value;
      }
    }

    const payload = {
      ...fieldData,
      last_follow_up: toDateOnly(data?.last_follow_up),
      next_follow_up: toDateOnly(data?.next_follow_up),
    };

    let response;

    try {
      if (from?.modal === "editLead") {
        response = await put(`${editLeadDetailURL}/${from?.leadId}`, payload);
      } else {
        response = await post(postLeadURL, payload);
      }

      if (response?.settings?.success) {
        reset();
        onClose();
        toast.success(response.settings.message);
        setFrom({ leadId: "" });
        refetchLeadsData();
      } else {
        toast.error(response?.settings?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast.error("Failed to submit lead");
    }
  };

  return (
    <>
      <StyledModal
        isDirty={from?.modal === "editLead" && !isDirty}
        opened={opened}
        onClose={onClose}
        title={from?.modal === "editLead" ? "Edit Lead" : "Add Lead"}
        buttonText={from?.modal === "editLead" ? "Update" : "Add lead"}
        isSubmitting={isSubmitting}
        formProps={{ onSubmit: handleSubmit(onSubmit) }}
      >
        <Box
          sx={{
            maxHeight: "500px",
            overflowY: "scroll",
            scrollbarWidth: "none",
          }}
        >
          {/* <Font16 sx={{ display: "flex", justifyContent: "flex-end", color: "#16A14E", cursor: "pointer" }} onClick={createFieldOpen}>+ Add New Field</Font16> */}
          <Grid container spacing={2} sx={{ borderRadius: "30px" }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Label16>Company Name</Label16>
              <SingleSelect
                control={control}
                name={"company"}
                placeholder="Select Company Name"
                options={companiesDropdownData}
              />
            </Grid>
            {from.modal === "addLead" && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ mt: { xs: 0, md: 3 } }}>
                  <PrimaryButton onClick={() => companyOpen()}>
                    + Add
                  </PrimaryButton>
                </Box>
              </Grid>
            )}

            <Grid size={{ xs: 12, md: 6 }}>
              <Label16>Previous Follow Up</Label16>
              <FormInput
                control={control}
                name="last_follow_up"
                type="date"
                max={new Date().toISOString().split("T")[0]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Label16>Next Follow Up</Label16>
              <FormInput
                control={control}
                name="next_follow_up"
                type="date"
                min={new Date().toISOString().split("T")[0]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Label16>Lead Source</Label16>
              <SingleSelect
                control={control}
                name="lead_source"
                placeholder="Select Lead Source"
                options={leadSourceData || []}
              />
            </Grid>

            {leadByTeam === "leads_passed_by_teammates" && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Label16>Lead By Team</Label16>
                <SingleSelect
                  control={control}
                  name="lead_by_team"
                  placeholder="Select Lead Team"
                  options={usersDropdownData || []}
                />
              </Grid>
            )}

            <Grid size={{ xs: 12, md: 6 }}>
              <Label16>Lead Stage</Label16>
              <SingleSelect
                control={control}
                name="lead_stage"
                placeholder="Select Lead Stage"
                options={leadStageData || []}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Label16>Sales Representative</Label16>
              <SingleSelect
                control={control}
                name="assigned_sales_representative"
                placeholder="Select Sales Representative "
                options={salesRepresentativeData || []}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Label16>Location</Label16>
              <SingleSelect
                menuPortalTarget={document.body}
                control={control}
                placeholder="Select Location"
                name="location"
                options={locationDropdownOptions}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Label16>Website</Label16>
              <FormInput
                control={control}
                name="website"
                type="text"
                placeholder={"Enter Website Link"}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Label16>Monthly Order Size</Label16>
              <FormInput
                control={control}
                name="monthly_order_size"
                type="number"
                placeholder={"Enter Monthly Order Size"}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Label16>Volume of Produce</Label16>
              <FormInput
                control={control}
                name="volume_of_produce"
                type="number"
                placeholder={"Enter Volume of Produce"}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Label16>Volume in Units</Label16>
              <SingleSelect
                menuPortalTarget={document.body}
                control={control}
                placeholder="Select Units"
                name="volume_units"
                options={volumeUnitsOptions}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
              <Label16>Interested Products</Label16>
              <MulitiSelect
                menuPortalTarget={document.body}
                control={control}
                placeholder="Select interested products"
                name="interested_product"
                options={productsDropdownData}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Label16>Trial Data</Label16>
              <TextareaInput
                control={control}
                name="trail_data"
                placeholder="Enter Trial Data"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Label16>Follow Up Details</Label16>
              <TextareaInput
                control={control}
                name="follow_up_details"
                placeholder="Enter Follow Up Details"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Label16>Notes</Label16>
              <TextareaInput
                control={control}
                name="summary"
                placeholder="Enter Notes (max 255 characters)"
                maxLength={255}
              />
            </Grid>
            {customFields.map((field, index) => (
              <Grid key={index} item xs={12} md={6}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Label16>{field.name}</Label16>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveField(field.name)}
                    sx={{ ml: 1 }}
                  >
                    <X size={16} />
                  </IconButton>
                </Box>
                <FormInput
                  control={control}
                  name={field.name}
                  placeholder={field.placeholder || ""}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </StyledModal>
      {addCompanyOpened && (
        <Suspense fallback={null}>
          <AddCompanyModal
            opened={addCompanyOpened}
            onClose={companyClose}
            leadSourceData={leadSourceData}
            refetchcompaniesDropdownData={refetchcompaniesDropdownData}
            setAddCompanyId={setAddCompanyId}
          />
        </Suspense>
      )}
      {createFieldOpened && (
        <Suspense fallback={null}>
          <CreateNewFieldModal
            opened={createFieldOpened}
            onClose={createFieldClose}
            onCreateField={handleCustomNewField}
          />
        </Suspense>
      )}
    </>
  );
}

export default LeadModal;
