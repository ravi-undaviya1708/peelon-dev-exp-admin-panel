import { useForm } from 'react-hook-form'
import { Box, Grid } from '@mui/material'
import { toast } from 'react-toastify'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useRef } from 'react'
import { ordersURLS } from '../../../../services/api/superadminApi'
import useFetchList from '../../../../hooks/useFetchList'
import { Label16 } from '../../../../components/StyledText'
import StyledModal from '../../../../components/StyledModal'
import useApiRequest from '../../../../hooks/useApiRequest'
import { FormInput } from '../../../../components/input/FormInput'
import { trackingIdValidation } from '../schema'

const initialPayloads = {
    tracking_id: ""
}


function TrackingIdModal({ opened, onClose, refetchOrdersData, from }) {
    const { put } = useApiRequest();
    // console.log("from", from);

    const { control, handleSubmit, reset, watch, setValue, formState: { isSubmitting, isDirty } } = useForm({
        defaultValues: initialPayloads,
        resolver: yupResolver(trackingIdValidation),
        mode: "onSubmit"
    });

    // console.log("watch", watch());


    const { trackingIdEditURL } = ordersURLS;
    const { data: orderDetailData } = useFetchList(`${trackingIdEditURL}/${from?.orderId}`, {}, true, { showLoader: false })
    // console.log("tracingId", orderDetailData);


    useEffect(() => {
        if (orderDetailData) {
            reset({
                tracking_id: orderDetailData?.tracking_id
            })
        }
    }, [orderDetailData]);

    const onSubmit = async (data) => {

        const response = await put(`${trackingIdEditURL}/${from?.orderId}`, data);

        if (response.settings.success) {
            toast.success(response.settings.message);
            onClose();
            refetchOrdersData();
        } else {
            toast.error(response.settings.message);
        }
    };

    return (
        <StyledModal opened={opened} onClose={onClose} isSubmitting={isSubmitting} isDirty={!isDirty} title="Edit Tracking Id" buttonText="Update" formProps={{ onSubmit: handleSubmit(onSubmit) }}>
            <Box>
                <Grid container spacing={2} >
                    <Grid size={{ xs: 12 }}>
                        <Label16>Tracing Id</Label16>
                        <FormInput
                            control={control}
                            name="tracking_id"
                            placeholder={"Enter Tracking Id"}
                        />
                    </Grid>
                </Grid>
            </Box>
        </StyledModal>

    )
}

export default TrackingIdModal