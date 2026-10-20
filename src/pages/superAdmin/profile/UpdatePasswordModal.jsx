import React from 'react';
import { toast } from 'react-toastify';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import StyledModal from '../../../components/StyledModal';
import { FormInput } from '../../../components/input/FormInput';
import { Font14 } from '../../../components/StyledText';
import { changePasswordSchema } from './schema';
import useApiRequest from '../../../hooks/useApiRequest';
import { authenticationURL } from '../../../services/api/api';
import { PasswordInputField } from '../../../components/input/PasswordInputField';

function UpdatePasswordModal({ opened, onClose}) {
    const { put } = useApiRequest();
    const { changePasswordURL } = authenticationURL;
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm({
        resolver: yupResolver(changePasswordSchema),
        mode: 'onSubmit',
        defaultValues: {
            old_password: '',
            new_password: '',
            confirm_password: '',
        },
    });

    const handleClose = () => {    
        reset();
        onClose();
    };

    const onSubmit = async(data) => {
        const response = await put(changePasswordURL, data);
        if (response?.settings?.success) {
            toast.success(response?.settings?.message)
            reset();
            onClose();
        }
        else {
            toast.error(response?.settings?.message)
        }
    }

return (
    <StyledModal
        opened={opened}
        onClose={handleClose}
        title="Change Password"
        buttonText="Confirm"
        isSubmitting={isSubmitting}
        formProps={{ onSubmit: handleSubmit(onSubmit) }}
    >
        <Box sx={{ width: '90%', mx: 'auto' }}>
            <Font14 sx={{ color: '#666666', py: 1 }}>Old Password</Font14>
            <PasswordInputField
                name="old_password"
                control={control}
                placeholder="Enter Old Password"
                type="password"
            />

            <Font14 sx={{ color: '#666666', py: 1 }}>New Password</Font14>
            <PasswordInputField
                name="new_password"
                control={control}
                placeholder="Enter New Password"
                type="password"
            />

            <Font14 sx={{ color: '#666666', py: 1 }}>Confirm Password</Font14>
            <PasswordInputField
                name="confirm_password"
                control={control}
                placeholder="Confirm New Password"
                type="password"
            />
        </Box>
    </StyledModal>
);
}

export default UpdatePasswordModal;
