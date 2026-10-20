import * as yup from "yup";

export const leadValidation = yup.object().shape({
  company: yup.string().required("Company Name is requird"),
  // summary: yup.string().required("Notes is required"),
  lead_source: yup.string().required("Lead Source is required"),
  lead_stage: yup.string().required("Lead Stage is required"),
  last_follow_up: yup
    .string()
    .required("Last Follow Up is required")
    .test(
      "not-in-future",
      "Last Follow Up cannot be in the future",
      function (value) {
        if (!value) return true;

        const followUpDate = new Date(value);
        const today = new Date();

        followUpDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        return followUpDate <= today;
      },
    ),

  next_follow_up: yup
    .string()
    .required("Next Follow Up is required")
    .test(
      "not-in-past",
      "Next Follow Up cannot be in the past",
      function (value) {
        if (!value) return true;
        const nextDate = new Date(value);
        const today = new Date();
        nextDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        return nextDate >= today;
      }
    )
    .test(
      "after-last-followup",
      "Next Follow Up must be after Last Follow Up",
      function (value) {
        const { last_follow_up } = this.parent;

        if (!value || !last_follow_up) return true;

        const nextDate = new Date(value);
        const lastDate = new Date(last_follow_up);

        nextDate.setHours(0, 0, 0, 0);
        lastDate.setHours(0, 0, 0, 0);

        return nextDate > lastDate;
      },
    ),

  assigned_sales_representative: yup
    .string()
    .required("Sales Representative is required"),
  location: yup.string().required("Location is required"),
  // volume_of_produce:yup.string().required("Volume is required"),
  // monthly_order_size:yup.string().required("Size is required"),
  // trail_data: yup.string().required("Trial Data is required"),
  // follow_up_details: yup.string().required("Follow Up Details is required"),
  // website: yup.string().required("Website Link is required").url("Enter Valid Link"),
  // interested_product: yup
  //     .array()
  //     .min(1, "Please select at least one interested product")
  //     .required("Interested Product is required"),

  ...{
    lead_by_team: yup.string().when("lead_source", {
      is: "leads_passed_by_teammates",
      then: (schema) =>
        schema.required("Select Lead  Passsed By Teammates is required"),
    }),
  },
});

export const addCompanyValidation = yup.object().shape({
  name_of_poc: yup.string().required("POC Name is required"),
  company_name: yup.string().required("Company Name is required"),
  company_type: yup.string().required("Company Type is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  mobile: yup
    .string()
    .required("Contact Number is required")
    .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  location: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  // description: yup.string().required("Decription is required"),
  entry_type: yup.string().required("Entry type is required"),
});

export const convertDealValidation = yup.object().shape({
  value: yup
    .number()
    .required("Deal value is required")
    .positive("Deal value must be postive value")
    .typeError("Deal value is required"),
  currency: yup.string().required("Currency Type is required"),
  deal_type: yup.string().required("Deal Type is required"),
  other_details: yup.string().when("deal_type", {
    is: (val) => val === "others",
    then: (schema) => schema.required("Please specify other details"),
    otherwise: (schema) => schema.notRequired(),
  }),
  deal_stages: yup.string().required("Stage is required"),
exp_order_date: yup
  .date()
  .transform((value, originalValue) => (originalValue === "" ? null : value))
  .nullable()
  .required("Expected Order Date is required")
  .min(
    new Date(new Date().setHours(0, 0, 0, 0)),
    "Expected Order Date cannot be in the past"
  ),

converted_date: yup
  .date()
  .transform((value, originalValue) => (originalValue === "" ? null : value))
  .nullable()
  .required("Converted date is required")
  .max(new Date(), "Converted date cannot be in the future"),
  next_follow_up: yup
    .date()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .required("Next Follow Up is required")
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      "Next Follow Up must be a future date",
    ),

  interested_product: yup
    .array()
    .min(1, "Please select at least one products of interest")
    .required("Products of interest is required"),
  reason: yup.string().required("Summary is required"),
});

export const convertLostDealValidation = yup.object().shape({
  reason: yup.string().required("Enter reason of lost"),
});
