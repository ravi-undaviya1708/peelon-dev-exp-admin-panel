import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import StyledModal from "../../../../components/StyledModal";
import { useForm } from "react-hook-form";
import { FormInput } from "../../../../components/input/FormInput";
import { Label16 } from "../../../../components/StyledText";
import { ImageUpload } from "../../../../components/image/SingleImageUpload";
import useApiRequest from "../../../../hooks/useApiRequest";
import { qualityControlURLS } from "../../../../services/api/superadminApi";
import { toast } from "react-toastify";
import { mapApiDataToForm } from "../../../../hooks/mapApiDataToForm";
import { blobConversion } from "../../../../hooks/blobConversion";
import useFetchDropdown from "../../../../hooks/useFetchDropdown";
import SingleSelect from "../../../../components/select/SingleSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import { qulityControlValidation } from "../schema";

const qualityInitialPayloads = {
  id_assigned: "",
  box_weight: "",
  liner_thickness: "",
  dimensions: "",
  seal_quality: "",
  print_quality: "",
  bar_code: null,
};

function QualityModal({
  opened,
  onClose,
  from,
  setFrom,
  onSuccess,
  prefetchQualityDetailData,
}) {
  const { post, put,filePut,filePost} = useApiRequest();
  const { postQualityURL, editQualityURL, getQualityLevelDropdown } = qualityControlURLS;
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitted, isSubmitting, isDirty, errors },
  } = useForm({
    defaultValues: qualityInitialPayloads,
    mode: "onSubmit",
    resolver: yupResolver(qulityControlValidation)
  });
  const images = ["bar_code"];
  //console.log("watch", watch());

  const { data: levelOptions } = useFetchDropdown(getQualityLevelDropdown, "value", "key")
  //console.log("levelOptions", levelOptions)

  useEffect(() => {
    if (from.modal === "editQuality" && prefetchQualityDetailData) {
      const formValues = mapApiDataToForm(
        qualityInitialPayloads,
        prefetchQualityDetailData
      );
      reset({
        ...formValues,
        seal_quality: prefetchQualityDetailData.seal_quality?.key,
        print_quality: prefetchQualityDetailData.print_quality?.key,
      });
    }
  }, [from, prefetchQualityDetailData, reset]);

  const handleQualitySubmit = async (data) => {
    const formData = new FormData();
    let response;
    if (from.modal === "editQuality") {
      // for (let field in data) {
      //   let value = data[field];
      //   if (!images.includes(field)) {
      //     formData.append(field, value);
      //   }
      // }
      // const imageData = {};
      // for (let field of images) {
      //   imageData[field] = data[field];
      // }

      // const imageConversionData = await blobConversion(imageData);
      // for (const field in imageConversionData) {
      //   const { blob, fileName } = imageConversionData[field];
      //   formData.append(field, blob, fileName);
      // }
      // response = await put(
      //   `${editQualityURL}/${prefetchQualityDetailData?.id}`,
      //   formData
      // );

      response=await filePut(`${editQualityURL}/${prefetchQualityDetailData?.id}`,data,images)


    } else {
      // for (let field in data) {
      //   let value = data[field];
      //   if (value !== null) {
      //     formData.append(field, value);
      //   }
      // }
      // response = await post(postQualityURL, formData);
      response=await filePost(postQualityURL, data)

    }
    if (response.settings.success) {
      toast.success(response.settings.message);
      reset();
      onSuccess();
      setFrom({
        qualityId: ""
      })
      onClose();
    } else {
      toast.error(response.settings.message);
    }
  };

  return (
    <>
      <StyledModal
        opened={opened}
        onClose={onClose}
        title={from.modal === "addQuality" ? "Add Quality" : "Edit Quality"}
        buttonText={
          from.modal === "addQuality" ? "Add Quality" : "Update"
        }
        isDirty={from.modal === "editQuality" && !isDirty}
        isSubmitting={isSubmitting}
        formProps={{ onSubmit: handleSubmit(handleQualitySubmit) }}
      >
        <Box sx={{ maxHeight: "500px", overflowY: "scroll", scrollbarWidth: "none" }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
            <Box>
              <Label16>BarCode</Label16>
              <ImageUpload
                label=""
                placeholder="Upload Barcode"
                control={control}
                name="bar_code"
                isSubmitted={isSubmitted}
                errors={errors?.bar_code}
                from={prefetchQualityDetailData?.bar_code}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
            <Box>
              <Label16>Id Assigned</Label16>
              <FormInput
                control={control}
                name="id_assigned"
                placeholder="Enter Id Assigned"
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
            <Box>
              <Label16>Box Weight</Label16>
              <FormInput
                control={control}
                name="box_weight"
                type="number"
                placeholder="Enter Box Weight"
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
            <Box>
              <Label16>Seal Quality</Label16>
              <SingleSelect
                control={control}
                options={levelOptions}
                name="seal_quality"
                placeholder="Enter Seal Quality"
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
            <Box>
              <Label16>Print Quality </Label16>
              <SingleSelect
                control={control}
                options={levelOptions}
                name="print_quality"
                placeholder="Enter Print Quality"
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
            <Box>
              <Label16>Liner Thickness</Label16>
              <FormInput
                control={control}
                name="liner_thickness"
                type="number"
                placeholder="Enter Liner Thickness"
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
            <Box>
              <Label16>Dimension(cms)</Label16>
              <FormInput
                control={control}
                name="dimensions"
                placeholder="Initial Dimension"
              />
            </Box>
          </Grid>

        </Grid>
        </Box>
      </StyledModal>
    </>
  );
}

export default QualityModal;
