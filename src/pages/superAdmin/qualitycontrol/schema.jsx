import *  as yup from 'yup'
export const qulityControlValidation = yup.object().shape({
    id_assigned: yup.string().required("Assigned ID is required"),
    box_weight: yup.string().required("Box Weight is required"),
    liner_thickness: yup.string().required("Liner Thickness is required"),
    dimensions: yup.string().required("Dimensions are required"),
    seal_quality: yup.string().required("Seal Quality is required"),
    print_quality: yup.string().required("Print Quality is required"),
    bar_code: yup.mixed()
        .required("Bar Code is required")
        .test("fileType", "Please select a valid image file", (value) => {
            return value instanceof File || typeof value === "string";
        })
        .test("fileSize", "Image must be less than 2MB", (value) => {
            return value instanceof File ? value.size <= 2 * 1024 * 1024 : true;
        }),

})