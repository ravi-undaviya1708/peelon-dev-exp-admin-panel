import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Box, Grid } from '@mui/material';
import { FormInput } from '../../../../components/input/FormInput';
import StyledModal from '../../../../components/StyledModal';
import { Label16 } from '../../../../components/StyledText';
import useApiRequest from '../../../../hooks/useApiRequest';
import { LeadsURLS } from '../../../../services/api/superadminApi';
import SingleSelect from '../../../../components/select/SingleSelect';
import { yupResolver } from '@hookform/resolvers/yup';
import { convertDealValidation, convertLostDealValidation } from '../schema';
import MulitiSelect from '../../../../components/select/MulitSelect';
import { TextareaInput } from '../../../../components/input/TextareaInput';

const initialPayloadsLostDeal = {
  lead_stage:"lost",
  reason:"",
}

const ConvertLostModal = ({ opened, onClose, onSuccess,from,}) => {
    const { put} = useApiRequest();
    const { control, handleSubmit, reset, watch,formState: { isSubmitting } } = useForm({
        defaultValues: initialPayloadsLostDeal,
        resolver: yupResolver(convertLostDealValidation),
        mode: "onSubmit"
    });

    //console.log("formFields",watch());
    

    const{convertLeadToLostURL}=LeadsURLS;
    const onSubmit = async (data) => {
        let response;
        //console.log(response);
        response = await put(`${convertLeadToLostURL}/${from?.covertToLostId}`, data)
        if (response.settings.success) {
            toast.success(response.settings.message)
            reset();
            onClose();
            onSuccess();
        }
        else {
            toast.error(response.settings.message)
        }
    }

    return (
        <StyledModal opened={opened} onClose={onClose} title="Reason for Lost Deal"
            buttonText="Done" isSubmitting={isSubmitting} size="lg"
            formProps={{ onSubmit: handleSubmit(onSubmit) }}>
          <TextareaInput
            control={control}
            name={"reason"}
            placeholder={"Enter Reason for Lost Deal"}
          />

        </StyledModal>
    );
}

export default ConvertLostModal;
