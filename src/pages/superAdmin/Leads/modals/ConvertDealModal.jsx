import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Box, Grid } from "@mui/material";
import { FormInput } from "../../../../components/input/FormInput";
import StyledModal from "../../../../components/StyledModal";
import { Label16 } from "../../../../components/StyledText";
import useApiRequest from "../../../../hooks/useApiRequest";
import { LeadsURLS } from "../../../../services/api/superadminApi";
import SingleSelect from "../../../../components/select/SingleSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import { convertDealValidation } from "../schema";
import MulitiSelect from "../../../../components/select/MulitSelect";
import { TextareaInput } from "../../../../components/input/TextareaInput";
import { currencyOptions } from "../initialPayloads";

const initialPayloadProductSize = {
  value: "",
  deal_type: "",
  deal_stages: "",
  exp_order_date: "",
  converted_date: "",
  next_follow_up: "",
  reason: "",
  interested_product: [],
  currency: "",
};

const toDateOnly = (value) => {
  if (!value) return null;

  const d = new Date(value);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`; // YYYY-MM-DD (local)
};

const ConvertDealModal = ({
  opened,
  onClose,
  onSuccess,
  setLoader,
  from,
  leadStageData,
  productsDropdownData,
  dealStageDropdownData,
  dealValueTypeDropdownData,
}) => {
  const { post } = useApiRequest();
  const { convertLeadToDealURL } = LeadsURLS;
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: initialPayloadProductSize,
    resolver: yupResolver(convertDealValidation),
    mode: "onSubmit",
  });

  console.log("errors", errors);

  const dealType = watch("deal_type");
  console.log("dealType", dealType);

  const onSubmit = async (data) => {
    setLoader(false);
    let response;
    //console.log(response);
    const payload = {
      ...data,
      converted_date: toDateOnly(data.converted_date),
      exp_order_date: toDateOnly(data.exp_order_date),
      next_follow_up: toDateOnly(data?.next_follow_up),
    };

    response = await post(
      `${convertLeadToDealURL}/${from?.covertToDealId}`,
      payload,
    );
    if (response.settings.success) {
      setLoader(true);
      toast.success(response.settings.message);
      reset();
      onClose();
      onSuccess();
    } else {
      toast.error(response.settings.message);
    }
  };

  return (
    <StyledModal
      opened={opened}
      onClose={onClose}
      title="Convert to Deal"
      buttonText="Convert"
      isSubmitting={isSubmitting}
      size="lg"
      formProps={{ onSubmit: handleSubmit(onSubmit) }}
    >
      <Grid container spacing={2} sx={{ borderRadius: "30px" }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Label16>Deal Value</Label16>
          <FormInput
            control={control}
            name={"value"}
            type={"number"}
            placeholder="Enter Value"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Label16>Currency</Label16>
          <SingleSelect
            control={control}
            name="currency"
            placeholder="Select Currency"
            options={currencyOptions}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Label16>Converted Date</Label16>
          <FormInput control={control} name="converted_date" type="date" />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Label16>Expected Order Date</Label16>
          <FormInput control={control} name="exp_order_date" type="date" />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Label16>Next Follow Up Date</Label16>
          <FormInput control={control} name="next_follow_up" type="date" />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Label16>Deal Stage</Label16>
          <SingleSelect
            menuPortalTarget={document.body}
            control={control}
            name="deal_stages"
            placeholder="Select Deal Stage"
            options={dealStageDropdownData || []}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Label16>Deal Type</Label16>
          <SingleSelect
            control={control}
            name="deal_type"
            placeholder="Select Deal Type"
            options={dealValueTypeDropdownData || []}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Label16>Products of Interest</Label16>
          <MulitiSelect
            menuPortalTarget={document.body}
            control={control}
            placeholder="Select interested products"
            name="interested_product"
            options={productsDropdownData}
          />
        </Grid>
        {dealType === "others" && (
          <Grid size={{ xs: 12 }}>
            <Label16>Other Details</Label16>
            <TextareaInput
              control={control}
              name="other_details"
              placeholder="Enter Other Details"
            />
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Label16>Summary</Label16>
          <TextareaInput
            control={control}
            name="reason"
            placeholder="Enter Summary"
          />
        </Grid>
      </Grid>
    </StyledModal>
  );
};

export default ConvertDealModal;
