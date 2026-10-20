import *  as yup from 'yup'
export const blogValidation = yup.object().shape({
    description: yup.string().required("Description  is required"),
    blog_name: yup.string().required("Blog name is required"),
    link: yup.string().required("Link is required").url("Enter valid  link"),
    // image: yup.mixed()
    //     .required("Image is required")
    //     .test("fileType", "Please select a valid image file", (value) => {
    //         return value instanceof File || typeof value === "string";
    //     })
    //     .test("fileSize", "Image must be less than 2MB", (value) => {
    //         return value instanceof File ? value.size <= 2 * 1024 * 1024 : true;
    //     }),

})