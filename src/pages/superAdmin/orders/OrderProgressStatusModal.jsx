import { useForm } from 'react-hook-form'
import { Box, Grid } from '@mui/material'
import { Label16 } from '../../../components/StyledText'
import StyledModal from '../../../components/StyledModal'
import { TextareaInput } from '../../../components/input/TextareaInput'
import SingleSelect from '../../../components/select/SingleSelect'
import useApiRequest from '../../../hooks/useApiRequest'
import { ordersURLS } from '../../../services/api/superadminApi'
import { toast } from 'react-toastify'
import { orderStatusValidation } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useRef } from 'react'
import useFetchDropdown from '../../../hooks/useFetchDropdown'
import { FormInput } from '../../../components/input/FormInput'

const initialOrderStatusPayloads = {
    order_progress_status: "",
    dispatch_confirmed_by: "",
    delivery_confirmed_by: "",
    order_tracking: ""
}


function OrderProgressStatusModal({ opened, onClose, orderStatusDropdownData, usersDropdownData, refetchOrdersData, from }) {
    const { put } = useApiRequest();
    // console.log("from", from);

    const { control, handleSubmit, reset, watch, setValue, formState: { isSubmitting, isDirty } } = useForm({
        defaultValues: initialOrderStatusPayloads,
        resolver: yupResolver(orderStatusValidation),
        mode: "onSubmit"
    });

    // console.log("watch", watch());


    const { factoryDropdownURL } = ordersURLS;
    const { data: factoryDropdownData } = useFetchDropdown(factoryDropdownURL, "full_name", "id")
    const status = watch("order_progress_status")
    //console.log("status", status);

    useEffect(() => {
        reset({
            order_progress_status: from?.orderStatus,
            dispatch_confirmed_by: from?.dispatchConfirmedBy,
            delivery_confirmed_by: from?.deliveryConfirmedBy,
            order_tracking: from?.orderTracking,
        });
    }, [from?.id]);


    useEffect(() => {
        const originalStatus = from?.orderStatus;
        const originalDispatch = from?.dispatchConfirmedBy || "";
        const originalDelivery = from?.deliveryConfirmedBy || "";
        const orginalOrderTracking = from?.orderTracking || ""

        if (status === originalStatus) {
            reset({
                order_progress_status: originalStatus,
                dispatch_confirmed_by: originalDispatch,
                delivery_confirmed_by: originalDelivery,
                order_tracking: orginalOrderTracking,

            });
        } else {
            setValue("dispatch_confirmed_by", status === "dispatched" ? originalDispatch : "");
            setValue("delivery_confirmed_by", status === "delivered" ? originalDelivery : "");
        }
    }, [status]);

    const { orderUpdateURL } = ordersURLS
    const onSubmit = async (data) => {
        const cleanedData = {};

        for (const key in data) {
            const value = data[key];
            if (value !== null && value !== '' && value !== undefined) {
                cleanedData[key] = value;
            }
        }
        let response;
        response = await put(`${orderUpdateURL}/${from?.orderId}`, cleanedData);

        if (response.settings.success) {
            toast.success(response.settings.message);
            onClose();
            refetchOrdersData();
        } else {
            toast.error(response.settings.message);
        }
    };

    return (
        <StyledModal opened={opened} onClose={onClose} isSubmitting={isSubmitting} isDirty={!isDirty} title="Order Status" buttonText="Change Status" formProps={{ onSubmit: handleSubmit(onSubmit) }}>
            <Box>
                <Grid container spacing={2} sx={{ borderRadius: "30px" }}>

                    <Grid size={{ xs: 12 }}>
                        <Label16>Order Status</Label16>
                        <SingleSelect
                            menuPortalTarget={document.body}
                            options={orderStatusDropdownData}
                            control={control}
                            name="order_progress_status"
                            placeholder={"Select Order Status"}
                        />
                    </Grid>
                    {status === "delivered" && (
                        <Grid size={{ xs: 12 }}>
                            <Label16>Confirmed By</Label16>
                            <SingleSelect
                                menuPortalTarget={document.body}
                                control={control}
                                options={status === "dispatched" ? factoryDropdownData : usersDropdownData}
                                name={status === "dispatched" ? "dispatch_confirmed_by" : "delivery_confirmed_by"}
                                placeholder={" Select Confirmed By"}
                            />
                        </Grid>
                    )}

                    {status === "dispatched" && (
                        <>
                            <Grid size={{ xs: 12 }}>
                                <Label16>Confirmed By</Label16>
                                <SingleSelect
                                    menuPortalTarget={document.body}
                                    control={control}
                                    options={status === "dispatched" ? factoryDropdownData : usersDropdownData}
                                    name={status === "dispatched" ? "dispatch_confirmed_by" : "delivery_confirmed_by"}
                                    placeholder={" Select Confirmed By"}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Label16>Order Tracking</Label16>
                                <FormInput
                                    control={control}
                                    name={"order_tracking"}
                                    placeholder={"Enter the Order Tracking"}
                                />
                            </Grid>
                        </>
                    )}

                </Grid>
            </Box>
        </StyledModal>

    )
}

export default OrderProgressStatusModal