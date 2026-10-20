import * as yup from "yup";

export const dealValidation = yup.object().shape({
  deal_owner: yup.string().required("Deal Owner is required"),
  company_id: yup.string().required("Company Name is required"),
  interested_product: yup
    .array()
    .min(1, "Please select at least one interested product")
    .required("Interested Product is required"),
  deal_stages: yup.string().required("Deal Stage is required"),
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
  exp_order_date: yup
    .date()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .required("Expected Order Date is required")
    .test(
      "today-or-future",
      "Expected Order Date cannot be in the past",
      (value) => {
        if (!value) return false;

        const selected = new Date(value);
        const today = new Date();

        // Normalize both to local date (avoid timezone shift)
        selected.setHours(12, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        return selected >= today;
      },
    ),

  location: yup.string().required("Location is required"),
  value: yup
    .number()
    .required("Deal Amount is required")
    .positive("Price should be positive")
    .typeError("Indian Price is required"),
  summary: yup.string().required("Description is required"),
  deal_source: yup.string().required("Deal Source is required"),
  deal_by_team: yup.string().when("deal_source", {
    is: "deals_passed_by_teammates",
    then: (schema) =>
      schema.required("Select Deal Passsed By Teammates is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
