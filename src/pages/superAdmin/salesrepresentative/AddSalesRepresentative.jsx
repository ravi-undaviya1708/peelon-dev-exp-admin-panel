import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Breadcrumbs,
} from "@mui/material";
import { useState } from "react";
import editProfile from "../../../assets/profileimg.png";
import { Font14, Font16, Font20, Font24 } from "../../../components/StyledText";
import { FormInput } from "../../../components/input/FormInput";
import { useForm } from "react-hook-form";
import { PrimaryButton } from "../../../components/StyledButtons";
import { Package, UserMinus, UserPlus } from "lucide-react";
import { CiMoneyBill } from "react-icons/ci";
import { ImageUpload } from "../../../components/image/SingleImageUpload";
import { yupResolver } from "@hookform/resolvers/yup";
import { staffValidation } from "./schema";
import { accountsURLS } from "../../../services/api/superadminApi";
import { toast } from "react-toastify";
import useApiRequest from "../../../hooks/useApiRequest";
import SingleSelect from "../../../components/select/SingleSelect";
import { StyledCircularProgress } from "../../../components/StyleCircularProgrerss";
import { PasswordInputField } from "../../../components/input/PasswordInputField";
import { Link, useNavigate } from "react-router-dom";
import {
  accountsPathConstants,
  customerPathConstants,
  deliveryDispatchPathConstants,
  factoryPathConstants,
  salesRepresentativePathConstants,
  superAdminPathConstants,
  warehouseManagerPathConstants,
} from "../../../constants/pathConstants";
import { colors } from "../../../constants/constants";
import { useSelector } from "react-redux";

const initialSalesRespresentivePayload = {
  image: null,
  full_name: "",
  mobile: "",
  email: "",
  password: "",
  confirm_password: "",
  role: "",
};

const AddSalesRepresentative = () => {
  const { post } = useApiRequest();
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
  const { DEFAULT, DASHBOARD, ACCOUNTS } = pathConstants;
  const navigate = useNavigate();
  const { postStaffURL } = accountsURLS;
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isSubmitted, errors },
  } = useForm({
    defaultValues: initialSalesRespresentivePayload,
    mode: "onSubmit",
    resolver: yupResolver(staffValidation("addStaff")),
  });
  const roleOptions = [
    { label: "Sales Representative", value: "Sales Representative" },
    { label: "Factory Operation", value: "Factory Operation" },
    { label: "Accounts", value: "Accounts" },
    { label: "Delivery & Dispatch", value: "Delivery & Dispatch" },
    { label: "Warehouse Manager", value: "Warehouse Manager" },
    // { label: "Customer", value: "Customer" },
  ];

  useEffect(() => {
    reset(initialSalesRespresentivePayload);
  }, [reset]);

  const submit = async (data) => {
    const formData = new FormData();
    for (let field in data) {
      let value = data[field];
      if (value !== null) {
        formData.append(field, value);
      }
    }
    const response = await post(postStaffURL, formData);
    if (response?.settings?.success) {
      toast.success(response?.settings?.message);
      reset();
      setTimeout(() => {
        navigate("../accounts");
      }, 3);
    } else {
      toast.error(response?.settings?.message);
    }
  };
  //console.log(watch());

  return (
    <Box>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Box>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 700,
              color: colors.headingclr,
            }}
          >
            Add Staff
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
            <Typography sx={{ fontSize: "14px" }}>Add Staff</Typography>
          </Breadcrumbs>
        </Box>
      </Box>
      <Box component="form" onSubmit={handleSubmit(submit)} sx={{ mt: 3 }} autoComplete="off">
        <Grid container spacing={2}>
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
                minHeight: "320px",
              }}
            >
              <ImageUpload
                control={control}
                name="image"
                placeholder="Upload Staff Image"
                isSubmitted={isSubmitted}
                errors={errors?.image}
              />

              <>
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
                  <Font14 sx={{ color: "#666666", py: 1 }}>
                    Mobile Number
                  </Font14>
                  <FormInput
                    name="mobile"
                    type={"number"}
                    control={control}
                    placeholder={"Enter Mobile Number"}
                  />
                </Box>
                <Box sx={{ width: "90%" }}>
                  <Font14 sx={{ color: "#666666", py: 1 }}>Role</Font14>
                  <SingleSelect
                    name="role"
                    options={roleOptions}
                    control={control}
                    placeholder={"Select Role"}
                  />
                </Box>
              </>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <Box
              sx={{
                backgroundColor: "#16A14E1A",
                display: "flex",
                flexDirection: "column",
                width: { xs: "100%", sm: "auto" },
                maxWidth: "100%",
                p: 4,
                borderRadius: "24px",
                //  minHeight: "320px"
              }}
            >
              <Box>
                <Font24 sx={{ mb: 1 }}>Login Credentials</Font24>
                <Grid container spacing={{ xs: 2, sm: 10, lg: 30 }}>
                  <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
                    <Font20 sx={{ color: "#666666", mb: 2.3 }}>password</Font20>
                    <PasswordInputField
                      control={control}
                      name={"password"}
                      type={"password"}
                      placeholder={"Enter Password"}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
                    <Font20 sx={{ color: "#666666", mb: 2.3 }}>
                      Confirm Password
                    </Font20>
                    <PasswordInputField
                      control={control}
                      name={"confirm_password"}
                      type={"text"}
                      placeholder={"Enter Confirm Password"}
                    />
                  </Grid>
                </Grid>

                <Box display="flex" gap={2} mt={2}>
                  <PrimaryButton
                    variant="contained"
                    color="success"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    confirm
                    {isSubmitting && <StyledCircularProgress />}
                  </PrimaryButton>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AddSalesRepresentative;
