import * as yup from "yup"

export const profileValidation = yup.object().shape({
    image: yup.mixed()
        .required("Profile Image is required")
        .test("fileType", "Please select a valid image file", (value) => {
            return value instanceof File || typeof value === "string";
        })
        .test("fileSize", "Image must be less than 2MB", (value) => {
            return value instanceof File ? value.size <= 2 * 1024 * 1024 : true;
        }),

    full_name: yup.string().required("Sales Representative Name is required"),
    email: yup.string().required("Email is required").email("Enter a valid Email"),
    mobile: yup.string().required("Contact Number is required").length(10),   
})

export const changePasswordSchema = yup.object().shape({
  old_password: yup.string().required('Old password is required'),
  new_password: yup
          .string()
          .required("Password is required")
          .min(8, "Password must be at least 8 characters")
          .max(20, "Password must be at most 20 characters")
          .matches(/[a-z]/, "Password must contain at least one lowercase letter")
          .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
          .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
  confirm_password: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('new_password'), null], 'Passwords must match'),
});
