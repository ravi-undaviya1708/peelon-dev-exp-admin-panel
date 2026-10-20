import React from 'react'
import StyledModal from '../../../../components/StyledModal'
import { useForm } from 'react-hook-form'
import { FormInput } from '../../../../components/input/FormInput'
import { TextareaInput } from '../../../../components/input/TextareaInput'
import { Box, Typography } from '@mui/material'
import { Font16, Label16 } from '../../../../components/StyledText'
import useApiRequest from '../../../../hooks/useApiRequest'
import { activitiesURLS } from '../../../../services/api/superadminApi'
import { toast } from 'react-toastify'
import { closedActivityValidation } from '../schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { MultiImageUploadController } from '../../../../components/image/MulitImageUpload'
import { useMulitImageArray } from '../../../../hooks/useMultiImageArray'

const initialClosedPayloads = {
  is_closed: "True",
  attachment_1: null,
  attachment_2: null,
  attachment_3: null,
  response: "",
}

function ClosedActivityModal({ opened, onClose, prefetchActivityDetailData, from, setFrom, refetchActivitiesData }) {
  const { filePut } = useApiRequest();
  const { closedActivityURL } = activitiesURLS;
  const files = ["attachment_1", "attachment_2", "attachment_3"];
  const { control, handleSubmit, reset, getValues, setValue, watch, formState: { isSubmitting, errors, isSubmitted } } = useForm({
    defaultValues: initialClosedPayloads,
    mode: "onSubmit",
    resolver: yupResolver(closedActivityValidation)
  })
  const { handleAddImage, handleDeleteImage } = useMulitImageArray(files, getValues, setValue);
  //console.log(watch());


  const onSumbit = async (data) => {
    const response = await filePut(`${closedActivityURL}/${prefetchActivityDetailData?.id}`, data, files);

    if (response.settings.success) {
      toast.success(response.settings.message)
      onClose()
      reset(),
        setFrom({ activityId: "" });
      refetchActivitiesData();
    }
    else {
      toast.error(response.settings.message)
    }
  }

  return (
    <StyledModal opened={opened} onClose={onClose} isSubmitting={isSubmitting} title={"Close Activity"} buttonText={"Close"} formProps={{ onSubmit: handleSubmit(onSumbit) }}>

      <Box>
        <Box sx={{ display: "flex", }}>
          <Font16 sx={{ color: "#666666" }}>Subject :</Font16>
          <Typography> {prefetchActivityDetailData?.subject}</Typography>
        </Box>
        <Box sx={{ display: "flex", mt: 0.5, mb: 1, flexWrap: "wrap" }}>
          <Font16 sx={{ color: "#666666" }}>Schedule Time :</Font16>
          <Typography> {prefetchActivityDetailData?.scheduled_time}</Typography>
        </Box>
      </Box>
      <TextareaInput
        control={control}
        minRows={2}
        placeholder={"Enter Activity Response"}
        name="response"
      />
      {from?.activityType === "email" && (
        <Box>
          <Label16 sx={{ py: 1 }}>Attachments</Label16>
          <MultiImageUploadController
            control={control}
            imageKeys={files}
            getValues={getValues}
            setValue={setValue}
            handleAddImage={handleAddImage}
            handleDeleteImage={handleDeleteImage}
            isSubmitted={isSubmitted}
            accept=".pdf,.doc,.docx,image/*"
          />
        </Box>
      )}

    </StyledModal>
  )
}

export default ClosedActivityModal