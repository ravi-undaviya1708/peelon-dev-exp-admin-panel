import * as yup from 'yup';

export const activityValidation = (type) =>
    yup.object({
        subject: yup.string().required("Subject is required"),
        scheduled_time: yup.string().required("Scheduled Time is required"),
        activity_type: yup.string().required("Activity Type is required"),
        summary: yup.string().required("Summary is required"),
        assigned_to: yup.array().of(yup.string()).min(1, "At least one assigned memember is required"),
        linked_to: yup.string().required("Client is required"),
        ...(type === "meeting" && {
            activity_link: yup.string().required("Meeting Link is required"),
        }),
        ...(type === "email" && {
            to_email: yup.array().of(yup.string().required("Email is required").email("Enter a valid email"))
            .min(1, "At least one email address is required"),
        }),
    });


export const closedActivityValidation = yup.object().shape({
    response: yup.string().required("Activity Response is required"),
})

