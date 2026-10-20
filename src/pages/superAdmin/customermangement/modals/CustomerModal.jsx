import React from "react";
import { useForm } from "react-hook-form";
import { Grid } from "@mui/material";
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useApiRequest from "../../../../hooks/useApiRequest";
import StyledModal from "../../../../components/StyledModal";
import { Label16 } from "../../../../components/StyledText";
import { FormInput } from "../../../../components/input/FormInput";
import { PasswordInputField } from "../../../../components/input/PasswordInputField";
import { customerManagementURLS } from "../../../../services/api/superadminApi";

const customerSchema = yup.object().shape({
  full_name: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  mobile: yup
    .string()
    .required("Mobile number is required")
    .matches(/^\d{10,15}$/, "Mobile number must be between 10 and 15 digits"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirm_password: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const defaultValues = {
  full_name: "",
  email: "",
  mobile: "",
  password: "",
  confirm_password: "",
};

function CustomerModal({ opened, onClose, refetch }) {
  const { post } = useApiRequest();
  const { getCustomersURL } = customerManagementURLS;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(customerSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      role: "Customer",
    };
    const response = await post(getCustomersURL, payload);
    if (response?.settings?.success) {
      toast.success(response?.settings?.message || "Customer added successfully");
      reset(defaultValues);
      onClose();
      if (refetch) refetch();
    } else {
      toast.error(response?.settings?.message || "Failed to add customer");
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <StyledModal
      opened={opened}
      onClose={handleClose}
      isSubmitting={isSubmitting}
      title="Add Customer"
      buttonText="Add Customer"
      formProps={{ onSubmit: handleSubmit(onSubmit) }}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Label16>Full Name</Label16>
          <FormInput
            control={control}
            name="full_name"
            placeholder="Enter full name"
            type="text"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Label16>Email ID</Label16>
          <FormInput
            control={control}
            name="email"
            placeholder="Enter email address"
            type="email"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Label16>Phone Number</Label16>
          <FormInput
            control={control}
            name="mobile"
            placeholder="Enter phone number"
            type="text"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Label16>Password</Label16>
          <PasswordInputField
            control={control}
            name="password"
            placeholder="Enter password"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Label16>Confirm Password</Label16>
          <PasswordInputField
            control={control}
            name="confirm_password"
            placeholder="Confirm password"
          />
        </Grid>
      </Grid>
    </StyledModal>
  );
}

export default CustomerModal;
