import React from 'react'
import StyledModal from '../../../../components/StyledModal'
import { useForm } from 'react-hook-form'
import { Box, Grid, } from '@mui/material'
import { InputLabel16, Label16 } from '../../../../components/StyledText'
import useApiRequest from '../../../../hooks/useApiRequest'
import { invoiceURLS } from '../../../../services/api/superadminApi'
import { toast } from 'react-toastify'
import { yupResolver } from '@hookform/resolvers/yup'
import { MultiImageUploadController } from '../../../../components/image/MulitImageUpload'
import { useMulitImageArray } from '../../../../hooks/useMultiImageArray'
import { purchaseOrderValidation } from '../schema'
import useFetchDropdown from '../../../../hooks/useFetchDropdown'
import { FormInput } from '../../../../components/input/FormInput'
import SingleSelect from '../../../../components/select/SingleSelect'

const initialUploadPayloads = {
    po_excel: null,
    date_of_release: "",
    company: ""
}

function UploadQuotation({ opened, onClose, from, setFrom, refetchQuotationData }) {

    const { put } = useApiRequest();
    const { convertStatustURL, companiesDropdownURL } = invoiceURLS;
    const files = ["po_excel"];
    const { control, handleSubmit, reset, getValues, setValue, watch, formState: { isSubmitting, errors, isSubmitted } } = useForm({
        defaultValues: initialUploadPayloads,
        mode: "onSubmit",
        resolver: yupResolver(purchaseOrderValidation)
    })
    const { handleAddImage, handleDeleteImage } = useMulitImageArray(files, getValues, setValue);
    // console.log("formFields", watch());
    const { data: companiesDropdownData } = useFetchDropdown(companiesDropdownURL, "company_name", "id");


    const onSumbit = async (data) => {

        const formData = new FormData();
        for (let field in data) {
            let value = data[field];
            if (value !== "") {
                formData.append(field, value)
            }
        }
        formData.append("status", from?.status);
        const response = await put(`${convertStatustURL}/${from?.quotationId}`, formData);

        if (response.settings.success) {
            toast.success(response.settings.message)
            onClose()
            reset(),
                setFrom({ quotationId: "" });
            refetchQuotationData();
        }
        else {
            toast.error(response.settings.message)
        }
    }

    return (
        <StyledModal opened={opened} onClose={onClose} isSubmitting={isSubmitting} title={"Upload Quotation"} buttonText={"Upload"} formProps={{ onSubmit: handleSubmit(onSumbit) }}>


            <Grid container spacing={3}>

                <Grid size={{ xs: 12, }}>
                    <Box>
                        <InputLabel16 sx={{ py: 1 }} >Upload Quotation</InputLabel16>
                        <MultiImageUploadController
                            width={"100%"}
                            height={200}
                            control={control}
                            errors={errors?.po_excel}
                            imageKeys={files}
                            getValues={getValues}
                            setValue={setValue}
                            handleAddImage={handleAddImage}
                            handleDeleteImage={handleDeleteImage}
                            isSubmitted={isSubmitted}
                            accept=".pdf,.doc,.docx,image/*"
                        />
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Box>
                        <InputLabel16 sx={{ py: 1 }}>Date Of Release</InputLabel16>
                        <FormInput
                          name="date_of_release"
                          control={control}
                          placeholder=""
                          type={"date"}
                          min={new Date().toISOString().split("T")[0]}
                        />
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6, }}>
                    <Box>
                        <InputLabel16 sx={{ py: 1 }}>Company Name</InputLabel16>
                        <SingleSelect menuPortalTarget={document.body} name="company" options={companiesDropdownData} control={control} placeholder="Select Company" />
                    </Box>
                </Grid>
            </Grid>

        </StyledModal>
    )
}

export default UploadQuotation