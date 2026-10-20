import React, { useEffect } from "react";
import { FormInput } from "../../../../components/input/FormInput";
import { useForm } from "react-hook-form";
import { Box, Grid } from "@mui/material";
import { Label16 } from "../../../../components/StyledText";
import StyledModal from "../../../../components/StyledModal";
import SingleSelect from "../../../../components/select/SingleSelect";
import { DealsURLS } from "../../../../services/api/superadminApi";
import { TextareaInput } from "../../../../components/input/TextareaInput";
import useApiRequest from "../../../../hooks/useApiRequest";
import { toast } from "react-toastify";
import MulitiSelect from "../../../../components/select/MulitSelect";
import { mapApiDataToForm } from "../../../../hooks/mapApiDataToForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { dealValidation } from "../schema";
import useFetchDropdown from "../../../../hooks/useFetchDropdown";

const initialPayloadsDeal = {
  company_id: "",
  deal_owner: "",
  summary: "",
  deal_stages: "",
  last_follow_up: "",
  exp_order_date: "",
  value: "",
  location: "",
  interested_product: [],
  deal_source: "",
  deal_by_team: "",
  next_follow_up:""
};

function DealModal({
  opened,
  onClose,
  userDropdownData,
  prefetchDealDetailData,
  ProductDropdownData,
  from,
  setFrom,
  onSuccess,
  companiesDropdownData,
  dealStageDropdownData,
  dealSourceDropdownData,
}) {
  const { post, put } = useApiRequest();
  const { postDealURL, editDealURL, locationDropdwonURL } = DealsURLS;
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isDirty, errors },
  } = useForm({
    defaultValues: initialPayloadsDeal,
    resolver: yupResolver(dealValidation),
  });

  const { data: locationDropdownOptions } = useFetchDropdown(
    locationDropdwonURL,
    "value",
    "key",
  );
  console.log("formaValues", watch());

  const leadByTeam = watch("deal_source");
  const toDateOnly = (value) => {
    if (!value) return null;

    const d = new Date(value);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`; // YYYY-MM-DD (local)
  };

  useEffect(() => {
    if (from?.modal === "editDeal" && prefetchDealDetailData) {
      const formValues = mapApiDataToForm(
        initialPayloadsDeal,
        prefetchDealDetailData,
      );
      reset({
        ...formValues,
        deal_stages: prefetchDealDetailData?.deal_stages?.deal_key,
        interested_product:
          prefetchDealDetailData?.interested_product?.map((item) => item.id) ||
          [],
        deal_owner: prefetchDealDetailData?.deal_owner?.id,
        company_id: prefetchDealDetailData?.company_name?.id,
        deal_source: prefetchDealDetailData?.deal_source?.key,
        deal_by_team: prefetchDealDetailData?.deal_by_team,
        location: prefetchDealDetailData?.location?.key,
      });
    } else if (from.modal === "addDeal") {
      reset(initialPayloadsDeal);
    }
  }, [from.modal, prefetchDealDetailData, reset]);

  const onSubmitDeal = async (data) => {
    const fieldData = {};
    for (let field in data) {
      const value = data[field];
      if (value !== null && value !== "") {
        fieldData[field] = value;
      }
    }
    const payload = {
      ...fieldData,
      exp_order_date: toDateOnly(data?.exp_order_date),
      last_follow_up: toDateOnly(data?.last_follow_up),
    };
    let response;
    if (from.modal === "editDeal") {
      response = await put(
        `${editDealURL}/${prefetchDealDetailData?.id}`,
        payload,
      );
    } else {
      response = await post(postDealURL, payload);
    }
    if (response.settings.success) {
      toast.success(response.settings.message);
      reset();
      onClose();
      onSuccess();
      setFrom({ dealId: "" });
    } else {
      toast.error(response.settings.message);
    }
  };

  return (
    <StyledModal
      opened={opened}
      onClose={onClose}
      isDirty={from?.modal === "editDeal" && !isDirty}
      title={from.modal == "addDeal" ? "Add Deal" : "Edit Deal"}
      buttonText={from.modal == "addDeal" ? "Add deal" : "Update"}
      formProps={{ onSubmit: handleSubmit(onSubmitDeal) }}
      isSubmitting={isSubmitting}
    >
      <Box
        sx={{ maxHeight: "500px", overflowY: "scroll", scrollbarWidth: "none" }}
      >
        <Grid container spacing={2} sx={{ borderRadius: "30px" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Label16>Deal Owner</Label16>
            <SingleSelect
              isClearable
              options={userDropdownData}
              control={control}
              name="deal_owner"
              placeholder="Select Owner"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Label16>Deal Source</Label16>
            <SingleSelect
              isClearable
              options={dealSourceDropdownData}
              control={control}
              name="deal_source"
            />
          </Grid>
          {leadByTeam === "deals_passed_by_teammates" && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Label16>Deal By Team</Label16>
              <SingleSelect
                control={control}
                name="deal_by_team"
                placeholder="Select Deal Team"
                options={userDropdownData || []}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12, md: 6 }}>
            <Label16>Company Name</Label16>
            <SingleSelect
              isClearable
              options={companiesDropdownData}
              control={control}
              name="company_id"
              placeholder="Select Company Name"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Label16>Deal Stage</Label16>
            <SingleSelect
              control={control}
              name="deal_stages"
              options={dealStageDropdownData}
              placeholder={"Select Deal Stage"}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Label16>Last follow up</Label16>
            <FormInput
              control={control}
              name="last_follow_up"
              placeholder={"Enter last followup"}
              type={"date"}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Label16>Next follow up</Label16>
            <FormInput
              control={control}
              name="next_follow_up"
              placeholder={"Enter next followup"}
              type={"date"}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Label16>Expected Order Date</Label16>
            <FormInput
              control={control}
              name="exp_order_date"
              placeholder={"Enter Expected Order Date "}
              type={"date"}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Label16>Deal Amount($)</Label16>
            <FormInput
              control={control}
              name="value"
              type={"number"}
              placeholder={"Enter Deal Amount"}
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
          <Grid size={{ xs: 12, md: 12 }}>
            <Label16>Interested Product</Label16>
            <MulitiSelect
              isClearable
              options={ProductDropdownData}
              control={control}
              name="interested_product"
              placeholder="Select interested products"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Label16>Summary</Label16>
            <TextareaInput
              minRows={3}
              control={control}
              name="summary"
              placeholder={"Enter Summary"}
            />
          </Grid>
        </Grid>
      </Box>
    </StyledModal>
  );
}

export default DealModal;
