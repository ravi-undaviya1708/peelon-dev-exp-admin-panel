import { Box, Grid } from "@mui/material"
import { Font20, Font24 } from "../../../components/StyledText"
import { FormInput } from "../../../components/input/FormInput"
import { PrimaryButton } from "../../../components/StyledButtons"
import { useForm } from "react-hook-form"
import { changePasswordValidation } from "./schema"
import useApiRequest from "../../../hooks/useApiRequest"
import { accountsURLS } from "../../../services/api/superadminApi"
import { yupResolver } from "@hookform/resolvers/yup"
import { StyledCircularProgress } from "../../../components/StyleCircularProgrerss"
import { PasswordInputField } from "../../../components/input/PasswordInputField"
import { toast } from "react-toastify"

const ChangePassword = ({ staffId }) => {
    const initialChangePassword = {
        new_password: "",
        confirm_password: ""
    }

    const { put } = useApiRequest();
    const { control, handleSubmit, reset, watch, formState: { isSubmitting, isDirty, isSubmitted }, errors } = useForm({
        defaultValues: initialChangePassword,
        mode: "onSubmit",
        resolver: yupResolver(changePasswordValidation)
    });

    const { changeStaffPasswordURL } = accountsURLS;

    const onSubmit = async (data) => {
        const response = await put(`${changeStaffPasswordURL}/${staffId}`, data);
        if (response?.settings?.success) {
            toast.success(response?.settings?.message)
            reset();
        }
        else {
            toast.error(response?.settings?.message)

        }
    }

    return (
        <Grid container spacing={0} mt={2}>
            <Grid size={{ xs: 12 }}>
                <Box
                    sx={{
                        backgroundColor: "#16A14E1A",
                        display: "flex",
                        flexDirection: "column",
                        maxWidth: "100%",
                        p: 4,
                        borderRadius: "24px",
                    }}

                >
                    <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
                        <Font24 sx={{ mb: 1 }}>Login Credentials</Font24>
                        <Grid container spacing={{ xs: 2, sm: 10, lg: 30 }} sx={{ display: "flex", alignItems: "center" }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Font20 sx={{ color: "#666666", mb: 2.3 }}>New Password</Font20>
                                <PasswordInputField control={control} type={"password"} name={"new_password"} placeholder={"Enter Password"} />

                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Font20 sx={{ color: "#666666", mb: 2.3 }}>Confirm Password</Font20>
                                <PasswordInputField control={control} type={"password"} name={"confirm_password"} placeholder={"Enter Confirm Password"} />

                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }} sx={{ textAlign: "center" }}>
                                <Box sx={{ mb: { xs: 2, sm: 6 } }}></Box>
                                <PrimaryButton
                                    type="submit"
                                >
                                    {isSubmitting && (
                                        <StyledCircularProgress />
                                    )}
                                    confirm
                                </PrimaryButton>

                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>

        </Grid>
    )
}

export default ChangePassword