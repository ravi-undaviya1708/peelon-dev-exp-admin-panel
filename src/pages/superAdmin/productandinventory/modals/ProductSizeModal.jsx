import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Box } from '@mui/material';
import { FormInput } from '../../../../components/input/FormInput';
import StyledModal from '../../../../components/StyledModal';
import { Label16 } from '../../../../components/StyledText';
import useApiRequest from '../../../../hooks/useApiRequest';
import { mapApiDataToForm } from "../../../../hooks/mapApiDataToForm";
import { productInventoryURLS } from '../../../../services/api/superadminApi';
import { productSizeValidation } from '../schema';

const initialPayloadProductSize = {
    size: "",
    india_price: "",
    us_price: "",
}

const ProductSizeModal = ({ opened, onClose, onSuccess, setLoader, from, prefetchProductSizeDetailData, setFrom }) => {
    const { post,put } = useApiRequest();
    const { postProductSizeURL, editSizeOfProductDetailURL } = productInventoryURLS;
    const { control, handleSubmit, reset, formState: { isSubmitting, isDirty } } = useForm({
        defaultValues: initialPayloadProductSize,
        resolver: yupResolver(productSizeValidation)
    });

    useEffect(() => {
        if (from.modal === "editProductSize" && prefetchProductSizeDetailData) {
            const formValues = mapApiDataToForm(initialPayloadProductSize, prefetchProductSizeDetailData);
            reset(formValues)
        }
    }, [prefetchProductSizeDetailData, reset])

    const onSubmit = async (data) => {
        setLoader(false)
        let response;
        if (from?.modal === "editProductSize") {
            response = await put(`${editSizeOfProductDetailURL}/${prefetchProductSizeDetailData?.id}`, data)
        }
        else {
            response = await post(postProductSizeURL, data)
        }
        if (response.settings.success) {
            setLoader(true)
            toast.success(response.settings.message)
            reset();
            onClose();
            onSuccess();
            setFrom({ productSizeId: "" })
        }
        else {
            toast.error(response.settings.message)
        }
    }

    return (
        <StyledModal opened={opened} onClose={onClose} title={from.modal === "editProductSize" ? "Edit Product Size" : "Add Product Size"}
            buttonText={from.modal == "editProductSize" ? "Edit Product" : "Add product"} isSubmitting={isSubmitting} size="md"
            formProps={{ onSubmit: handleSubmit(onSubmit) }}
            isDirty={from?.modal === "editProductSize" && !isDirty}

        >
            <Box>
                <Box>
                    <Label16 >Product Size</Label16>
                    <FormInput
                        control={control}
                        name="size"
                        placeholder="Enter Size"
                        type="text"
                    />
                </Box>
                <Box mt={2}>
                    <Label16 >Indian Price (Per Box(₹))</Label16>
                    <FormInput
                        control={control}
                        name="india_price"
                        placeholder="Indian Price"
                        type="number"
                    />
                </Box>
                <Box mt={2}>
                    <Label16 >US Price (Per Box($))</Label16>
                    <FormInput
                        control={control}
                        name="us_price"
                        placeholder="US Price"
                        type="number"
                    />
                </Box>
            </Box>
        </StyledModal>
    );
}

export default ProductSizeModal;
