import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid } from '@mui/material'
import { FormInput } from '../../../../components/input/FormInput'
import StyledModal from '../../../../components/StyledModal'
import { Label16 } from '../../../../components/StyledText'
import { initialAddCompanyPayload } from '../initialPayloads'
import { addCompanyValidation } from '../schema'
import { TextareaInput } from '../../../../components/input/TextareaInput'
import { contactusURLS, LeadsURLS } from '../../../../services/api/superadminApi'
import useApiRequest from '../../../../hooks/useApiRequest'
import { toast } from 'react-toastify'
import SingleSelect from '../../../../components/select/SingleSelect'
import useFetchDropdown from '../../../../hooks/useFetchDropdown'

function AddCompanyModal({ opened, onClose, refetchcompaniesDropdownData, setAddCompanyId }) {
    const { post } = useApiRequest();
    const { postCompanyURL } = LeadsURLS;
    const { getCompanyTypeURL } = contactusURLS
    const { control, watch, handleSubmit, formState: { isSubmitting } } = useForm({
        defaultValues: initialAddCompanyPayload,
        resolver: yupResolver(addCompanyValidation),
        mode: "onSubmit",
    })

    const entryOptions = [
        { label: "WebSite", value: "web_site" },
        { label: "Manual", value: "manual" },
    ]

    // const companyTypeOptions = [
    //     { label: "Retailer", value: "retailer" },
    //     { label: "Whole Seller", value: "whole_seller" },
    // ]

    const { data: companyTypeOptions } = useFetchDropdown( getCompanyTypeURL,"value", "key")

    //console.log("formaFields", watch());

    const onSubmit = async (data) => {
        const response = await post(postCompanyURL, data)
        if (response.settings.success) {
            setAddCompanyId(response?.data?.company_id || "swamy")
            toast.success(response.settings.message);
            refetchcompaniesDropdownData();
            onClose();
        }
        else {
            toast.error(response.settings.message)
        }
    }

    return (
        <StyledModal opened={opened} onClose={onClose} title="Add Company" buttonText="Add Company" isSubmitting={isSubmitting} formProps={{ onSubmit: handleSubmit(onSubmit) }}>
            <Box sx={{ maxHeight: "500px", overflowY: "scroll", scrollbarWidth: "none" }}>
                <Grid container spacing={2} sx={{ borderRadius: "30px" }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Label16>POC Name</Label16>
                        <FormInput
                            control={control}
                            name="name_of_poc"
                            placeholder="Enter Name of POC "
                            type="text"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Label16>Company Name</Label16>
                        <FormInput
                            control={control}
                            name="company_name"
                            placeholder="Enter Company Name"
                            type="text"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Label16>Company Type</Label16>
                        <SingleSelect
                            control={control}
                            name="company_type"
                            options={companyTypeOptions}
                            placeholder="Select Company Type"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Label16>Mail Id</Label16>
                        <FormInput
                            control={control}
                            name="email"
                            placeholder="Enter Mail ID"
                            type="text"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Label16>Contact No</Label16>
                        <FormInput
                            control={control}
                            name="mobile"
                            placeholder="Enter Contact Number"
                            type="number"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Label16>Entry Type</Label16>
                        <SingleSelect
                            control={control}
                            name="entry_type"
                            placeholder="Select Entry Type"
                            options={entryOptions}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Label16>City</Label16>
                        <TextareaInput
                            control={control}
                            name="city"
                            type="text"
                            placeholder="Enter City"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Label16>Address</Label16>
                        <TextareaInput
                            control={control}
                            name="location"
                            type="text"
                            placeholder="Enter Address"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Label16>Description</Label16>
                        <TextareaInput
                            control={control}
                            name="description"
                            type="text"
                            placeholder="Enter Description"
                        />
                    </Grid>

                </Grid>
            </Box>
        </StyledModal>
    )
}

export default AddCompanyModal