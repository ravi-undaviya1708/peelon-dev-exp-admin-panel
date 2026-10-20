import * as yup from "yup";

export const deliveriesSchema = (from) =>
  yup.object().shape({
    // volume: yup.string().required("Volume is required"),

    // 🔹 Expected Delivery Time

    ...(from === "dispatched" && {
      dispatch_confirmed_by: yup
        .string()
        .required("Dispatch confirmed by is required")
        .typeError("Dispatch confirmed by is required"),
      tracking_id: yup.string().required("Tracking ID is required"),
      // dispatched_date: yup
      //   .date()
      //   .typeError("Dispatched date must be a valid date")
      //   .required("Dispatched date is required")
      //   .test(
      //     "not-in-past",
      //     "Dispatched date & time cannot be in the past",
      //     function (value) {
      //       if (!value) return true;

      //       const selectedDateTime = new Date(value).getTime();
      //       const now = Date.now();

      //       return selectedDateTime >= now;
      //     },
      //   ),

      dispatched_date: yup.string().required("Dispatch date is required"),

      expected_delivery_time: yup
        .date()
        .typeError("Expected delivery time must be a valid date")
        .required("Expected delivery time is required")
        .test(
          "exp_after_dispatch",
          "Expected Delivery Time must be after or equal to Dispatched Date",
          function (value) {
            const { dispatched_date } = this.parent;
            if (!value || !dispatched_date) return true;

            const dispatchDate = new Date(dispatched_date);
            const deliveryDate = new Date(value);

            return deliveryDate >= dispatchDate;
          },
        ),
    }),

    ...(from === "deliveries" && {
      delivery_confirmed_by: yup
        .string()
        .required("Delivery confirmed by is required"),
      delivered_date: yup.string().required("Deliveryed date is required"),
    }),
  });
