import * as yup from "yup"

export const contactsValidation = yup.object().shape({
    name_of_poc: yup.string().required("Name of POC is required"),
    company_name: yup.string().required("Company Name is required"),
    email: yup.string().required("Email is required").email("Enter a valid Email"),
    company_type: yup.string().required("Company Type is requried"),
    mobile: yup.string().required("Contact Number is required").length(10),
    // notes: yup.string().required("Notes is required"),
    // entry_type: yup.string().required("Entry Type is required"),
    location: yup.string().required("Location is required"),
    city: yup.string().required("Address is required"),
    annual_contract_details:yup.string().required("Annual contract details required")
    // interested_product:yup.array().of(yup.string()).min(1,"At least on Product is required"),

    // upload_document: yup.mixed()
    //     .required("File is required")
    //     .test("FileType", "Please select a valid  File", (value) => {
    //         return value instanceof File || typeof value === "string";
    //     })
    //     .test("fileSize", "File must be less than 2MB", (value) => {
    //         return value instanceof File ? value.size <= 2 * 1024 * 1024 : true;
    //     }),
})