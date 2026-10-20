import { Box, Typography, TextField, Button, Grid, Divider, Breadcrumbs } from "@mui/material";
import { useEffect, useState } from "react";
import editProfile from "../../../assets/profileimg.png";
import { Font14, Font16, Font20, Font24 } from "../../../components/StyledText";
import { FormInput } from "../../../components/input/FormInput";
import { useForm } from "react-hook-form";
import { PrimaryButton } from "../../../components/StyledButtons";
import { Package, UserMinus, UserPlus } from "lucide-react";
import { CiMoneyBill } from "react-icons/ci";
import { ImageUpload } from "../../../components/image/SingleImageUpload";
import { accountsPathConstants, customerPathConstants, deliveryDispatchPathConstants, factoryPathConstants, salesRepresentativePathConstants, superAdminPathConstants, warehouseManagerPathConstants } from "../../../constants/pathConstants";
import { colors } from "../../../constants/constants";
import { Link, useLocation } from "react-router-dom";
import { Center } from "@mantine/core";
import { accountsURLS } from "../../../services/api/superadminApi";
import useApiRequest from "../../../hooks/useApiRequest";
import useFetchList from "../../../hooks/useFetchList";
import { showLoader } from "../../../redux/features/loader/loaderSlice";
import { mapApiDataToForm } from "../../../hooks/mapApiDataToForm";
import { Link as MuiLink } from '@mui/material';
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { staffValidation } from "./schema";
import ChangePassword from "./ChangePassword";
import { StyledCircularProgress } from "../../../components/StyleCircularProgrerss";
import { blobConversion } from "../../../hooks/blobConversion";
import { useSelector } from "react-redux";

const initialStaffPayload = {
    image: null,
    full_name: "",
    mobile: "",
    email: "",
}

const EditSalesRepresentative = () => {
    const location = useLocation();
    const { staffId } = location.state || {};
    //console.log("staffId", staffId);
    const { put } = useApiRequest()
    const [isEditing, setIsEditing] = useState(false);
    const userType = useSelector((state) => state.auth.userType);
    const pathConstantsByRole = {
        "Super Admin": superAdminPathConstants,
        "Factory Operation": factoryPathConstants,
        "Sales Representative": salesRepresentativePathConstants,
            "Delivery & Dispatch": deliveryDispatchPathConstants,
    "Warehouse Manager": warehouseManagerPathConstants,
    "Accounts": accountsPathConstants,
    "Customer": customerPathConstants,
    };
    const pathConstants = pathConstantsByRole[userType];
    const { DEFAULT, DASHBOARD,ACCOUNTS} = pathConstants;    const { control, handleSubmit, reset, watch, formState: { isSubmitting, isDirty, isSubmitted }, errors } = useForm({
        defaultValues: initialStaffPayload,
        mode: "onSubmit",
        resolver: yupResolver(staffValidation())
    });

    const { editStaffURL, staffDetailURL } = accountsURLS;
    const { data: staffDetailData, refetch: refetchStaffDetailData } = useFetchList(`${staffDetailURL}/${staffId}`, {}, true,)

    useEffect(() => {
        if (staffDetailData) {
            const formValue = mapApiDataToForm(initialStaffPayload, staffDetailData)
            reset(formValue)
        }
    }, [staffDetailData])
    //console.log(watch());

    const images = ["image"];
    const onSubmit = async (data) => {
        const formData=new FormData()
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
            `${editStaffURL}/${staffId}`,
            formData
        );
         if (response.settings.success) {
              toast.success(response.settings.message);
               refetchStaffDetailData();
            } else {
              toast.error(response.settings.message);
            }
    }

    return (
        <Box >
            <Box display={"flex"} justifyContent={"space-between"}>
                <Box>
                    <Typography
                        sx={{
                            fontSize: "24px",
                            fontWeight: 700,
                            color: colors.headingclr,
                        }}
                    >
                        Edit Staff
                    </Typography>
                    <Breadcrumbs separator="›" aria-label="breadcrumb">
                        <Link
                            style={{ color: colors.darkgreen, textDecoration: "none" }}
                            to={`${DEFAULT}/${DASHBOARD}`}
                        >
                            <Typography sx={{ fontSize: "14px" }}>Dashbaord</Typography>
                        </Link>
                        <Link
                            style={{ color: colors.darkgreen, textDecoration: "none" }}
                            to={`${DEFAULT}/${ACCOUNTS}`}
                        >
                            <Typography sx={{ fontSize: "14px" }}>Accounts</Typography>
                        </Link>
                        <Typography sx={{ fontSize: "14px" }}>Edit Staff</Typography>
                    </Breadcrumbs>
                </Box>
            </Box>
            <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Box
                        sx={{
                            backgroundColor: "#16A14E1A",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: { xs: "100%", sm: "auto" },
                            maxWidth: "100%",
                            p: 4,
                            borderRadius: "24px",
                            minHeight: "320px"
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
                                        from={isEditing ? staffDetailData?.image : "undefined"}
                                    />
                                </Box>
                                <Box sx={{ width: "90%" }}>
                                    <Font14 sx={{ color: "#666666", py: 1 }}>Name</Font14>
                                    <FormInput
                                        name="full_name"
                                        control={control}
                                        placeholder={"Enter Name"}
                                    />
                                </Box>
                                <Box sx={{ width: "90%" }}>
                                    <Font14 sx={{ color: "#666666", py: 1 }}>Email</Font14>
                                    <FormInput
                                        name="email"
                                        control={control}
                                        placeholder={"Enter Email"}
                                    />
                                </Box>
                                <Box sx={{ width: "90%" }}>
                                    <Font14 sx={{ color: "#666666", py: 1 }}>Mobile Number</Font14>
                                    <FormInput
                                        name="mobile"
                                        type={"number"}
                                        control={control}
                                        placeholder={"Enter Mobile Number"}
                                    />
                                </Box>
                                <Box display="flex" gap={2} mt={2}>
                                    <PrimaryButton
                                        disabled={!isDirty}
                                        type="submit"
                                    >
                                        {isSubmitting && (
                                            <StyledCircularProgress />
                                        )}
                                        confirm
                                    </PrimaryButton>

                                </Box>
                            </Box>

                        ) : (
                            <>

                                <Box>
                                    <img src={staffDetailData?.image || editProfile}
                                        alt="Profile Image"
                                        style={{ width: "150px", height: "150px" }}
                                    />
                                </Box>
                                <Typography
                                    sx={{ mt: 2, fontSize: { xs: "16px", sm: "18px" }, fontWeight: 600 }}
                                >
                                    {staffDetailData?.full_name}
                                </Typography>
                                <Font16 sx={{ mt: 1, fontSize: { xs: "14px", sm: "16px", color: "#666666", } }}>
                                    {staffDetailData?.email}
                                </Font16>
                                <Font16 sx={{ mt: 1, fontSize: { xs: "14px", sm: "16px", color: "#666666", } }}>
                                    {staffDetailData?.mobile}
                                </Font16>
                                <MuiLink
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
                                </MuiLink>
                            </>
                        )}
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 8 }}>
                    <Grid container spacing={0}
                        sx={{
                            backgroundColor: "#16A14E1A",
                            display: "flex",
                            alignItems: "center",
                            width: { xs: "100%", sm: "auto" },
                            maxWidth: "100%",
                            borderRadius: "24px",
                            padding: "32px",
                            minHeight: isEditing ? "480px" : "360px"
                        }}
                    >
                        <Grid size={{ xs: 12, sm: 6 }} sx={{ mb: { xs: 3, sm: 0 } }}>
                            <Box sx={{ display: "flex", fontSize: "20px", alignItems: "center", gap: 1 }}>
                                <Package />
                                <Font20 sx={{ color: "#666666" }}>Total Orders</Font20>
                            </Box>
                            <Box>
                                <Typography sx={{ color: "#333333", fontSize: "32px", fontWeight: "bold" }}>{staffDetailData?.total_orders}</Typography>
                            </Box>
                            <Divider sx={{ width: "50%" }} />
                        </Grid>
                        {/* <Grid size={{ xs: 12, sm: 6 }} sx={{ mb: { xs: 3, sm: 0 } }}>
                            <Box sx={{ display: "flex", fontSize: "20px", alignItems: "center", gap: 1 }}>
                                <CiMoneyBill style={{ fontSize: "x-large" }} />
                                <Font20 sx={{ color: "#666666" }}>Sale Value</Font20>
                            </Box>
                            <Box>
                                <Typography sx={{ color: "#333333", fontSize: "32px", fontWeight: "bold" }}>{staffDetailData?.sale_value}</Typography>
                            </Box>
                            <Divider sx={{ width: "50%" }} />
                        </Grid> */}
                        <Grid size={{ xs: 12, sm: 6 }} sx={{ mb: { xs: 3, sm: 0 } }}>
                            <Box sx={{ display: "flex", fontSize: "20px", alignItems: "center", gap: 1 }}>
                                <UserMinus />
                                <Font20 sx={{ color: "#666666" }}>Lost Deals</Font20>
                            </Box>
                            <Box>
                                <Typography sx={{ color: "#333333", fontSize: "32px", fontWeight: "bold" }}>{staffDetailData?.lost_deals}</Typography>
                            </Box>
                            <Divider sx={{ width: "50%" }} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} sx={{ mb: { xs: 3, sm: 0 } }}>
                            <Box sx={{ display: "flex", fontSize: "20px", alignItems: "center", gap: 1 }}>
                                <UserPlus />
                                <Font20 sx={{ color: "#666666" }}>Leads Assigned</Font20>
                            </Box>
                            <Box>
                                <Typography sx={{ color: "#333333", fontSize: "32px", fontWeight: "bold" }}>{staffDetailData?.leads_assigned}</Typography>
                            </Box>
                            <Divider sx={{ width: "50%" }} />
                        </Grid>

                    </Grid>
                </Grid>
            </Grid>

            {isEditing && (

                <ChangePassword staffId={staffId} />
            )}
        </Box >
    );

}

export default EditSalesRepresentative