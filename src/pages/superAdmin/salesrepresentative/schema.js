import * as yup from "yup"

export const staffValidation = (type) => yup.object().shape({
    image: yup.mixed()
        .required("Sales Representative image is required")
        .test("fileType", "Please select a valid image file", (value) => {
            return value instanceof File || typeof value === "string";
        })
        .test("fileSize", "Image must be less than 2MB", (value) => {
            return value instanceof File ? value.size <= 2 * 1024 * 1024 : true;
        }),

    full_name: yup.string().required("Sales Representative Name is required"),
    email: yup.string().required("Email is required").email("Enter a valid Email"),
    mobile: yup.string().required("Contact Number is required").length(10),
    ...(type ==="addStaff" && {
        role: yup.string().required("role is required"),
        password: yup
            .string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters")
            .max(20, "Password must be at most 20 characters")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),

        confirm_password: yup
            .string()
            .required("Confirm Password is required")
            .oneOf([yup.ref("password")], "Passwords must match"),
    })

})


export const changePasswordValidation = yup.object().shape({
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
        .required("Confirm Password is required")
        .oneOf([yup.ref("new_password")], "Passwords must match"),

})