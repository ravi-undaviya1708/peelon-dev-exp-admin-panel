import { Box, Link, Typography, TextField, Button, Grid, Divider } from "@mui/material";
import { toast } from "react-toastify";
import { lazy, Suspense, useEffect, useState } from "react";
import editProfile from "../../../assets/profileimg.png";
import { Font14, Font16, Font20, Font24 } from "../../../components/StyledText";
import { FormInput } from "../../../components/input/FormInput";
import { useForm } from "react-hook-form";
import { OutlinedAddButton, PrimaryButton } from "../../../components/StyledButtons";
import { ImageUpload } from "../../../components/image/SingleImageUpload";
import { authenticationURL } from "../../../services/api/api";
import useFetchList from "../../../hooks/useFetchList";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileValidation } from "./schema";
const UpdatePasswordModal = lazy(() => import("./UpdatePasswordModal"))
import useApiRequest from "../../../hooks/useApiRequest";
import { blobConversion } from "../../../hooks/blobConversion";
import { StyledCircularProgress } from "../../../components/StyleCircularProgrerss";

const EditProfile = () => {
    const { put } = useApiRequest();
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    const { control, handleSubmit, reset, formState: { isSubmitting, isSubmitted, isDirty, errors } } = useForm({
        mode: "onSubmit",
        resolver: yupResolver(profileValidation)
    });
    const { userDetailURL, editUserDetailURL } = authenticationURL;
    const { data: userData, refetch: refecthUserData } = useFetchList(userDetailURL);
    //console.log("userData", userData);

    useEffect(() => {
        reset({
            full_name: userData?.full_name,
            email: userData?.email,
            mobile: userData?.mobile,
            image: userData?.image
        })
    }, [userData])

    const images = ["image"];
    const onSubmit = async (data) => {
        const formData = new FormData()
        let response;
        for (let field in data) {
            let value = data[field];
            if (!images.includes(field)) {
                formData.append(field, value);
            }
        }
        const imageData = {};
        for (let field of images) {
            imageData[field] = data[field];
        }

        const imageConversionData = await blobConversion(imageData);
        for (const field in imageConversionData) {
            const { blob, fileName } = imageConversionData[field];
            formData.append(field, blob, fileName);
        }
        response = await put(
            editUserDetailURL,
            formData
        );
        if (response.settings.success) {
            toast.success(response.settings.message);
            reset();
            setIsEditing(false);
            refecthUserData();
        } else {
            toast.error(response.settings.message);
        }
    }

    return (
        <Box
            sx={{
                backgroundColor: "#16A14E1A",
                p: { xs: 2, sm: 3 },
                display: "flex",
                justifyContent: "center",
                placeSelf: "center",
                width: "100%",
                maxWidth: "448px",
                borderRadius: "32px"
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: { xs: "100%", sm: "100%" },
                }}
            >

                {isEditing ? (

                    <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <ImageUpload
                                control={control}
                                name="image"
                                placeholder="Upload Sales Representive Image"
                                isSubmitted={isSubmitted}
                                errors={errors?.image}
                                from={isEditing ? userData?.image : "undefined"}
                            />
                        </Box>

                        {/* Name */}
                        <Box sx={{ width: "90%" }}>
                            <Font14 sx={{ color: "#666666", py: 1 }}>Name</Font14>
                            <FormInput name="full_name" control={control} placeholder="Enter Name" />
                        </Box>

                        {/* Email */}
                        <Box sx={{ width: "90%" }}>
                            <Font14 sx={{ color: "#666666", py: 1 }}>Email</Font14>
                            <FormInput name="email" control={control} placeholder="Enter Email" />
                        </Box>

                        {/* Mobile */}
                        <Box sx={{ width: "90%" }}>
                            <Font14 sx={{ color: "#666666", py: 1 }}>Mobile Number</Font14>
                            <FormInput name="mobile" control={control} placeholder="Enter Mobile Number" type={"number"} />
                        </Box>
                        <Box sx={{ display: "flex", flexWrap: { xs: "wrap", sm: "nowrap" } }} gap={1} mt={2}>
                            <Box>
                                <PrimaryButton type="submit" disabled={isSubmitting || !isDirty}>
                                    Confirm
                                    {isSubmitting&&(
                                        <StyledCircularProgress/>
                                    )}
                                </PrimaryButton>
                            </Box>
                            <Box>
                                <OutlinedAddButton onClick={() => setIsEditing(false)} type="button">
                                    Cancel
                                </OutlinedAddButton>
                            </Box>
                            <Box sx={{ width: "100%", }}>
                                <PrimaryButton
                                    type="button"
                                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                                >
                                    {"Change Password"}
                                </PrimaryButton>
                            </Box>
                        </Box>
                    </Box>

                ) : (
                    <>

                        <Box>
                            <img src={userData?.image || editProfile}
                                alt="Profile Image"
                                style={{ width: "150px", height: "150px" }}
                            />
                        </Box>
                        <Typography
                            sx={{ mt: 2, fontSize: { xs: "16px", sm: "18px" }, fontWeight: 600, }}
                        >
                            {userData?.full_name}
                        </Typography>
                        <Font16 sx={{ mt: 1, fontSize: { xs: "14px", sm: "16px", color: "#666666", } }}>
                            {userData?.email}
                        </Font16>
                        <Font16 sx={{ mt: 1, fontSize: { xs: "14px", sm: "16px", color: "#666666", } }}>
                            {userData?.mobile}
                        </Font16>
                        <Link
                            onClick={() => setIsEditing(true)}
                            sx={{
                                color: "#23A75B",
                                cursor: "pointer",
                                textDecoration: "underline",
                                mt: 1,
                                fontSize: { xs: "14px", sm: "16px" },
                                fontWeight: 600
                            }}
                        >
                            Edit
                        </Link>
                    </>
                )}
            </Box>

            {showPasswordFields && (
                <Suspense fallback={null}>
                    <UpdatePasswordModal
                        opened={showPasswordFields}
                        onClose={() => setShowPasswordFields(false)}
                    />
                </Suspense>
            )}

        </Box>



    );
};

export default EditProfile;
