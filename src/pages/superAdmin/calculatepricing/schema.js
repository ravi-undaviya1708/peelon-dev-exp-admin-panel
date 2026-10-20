import * as yup from 'yup';

export const priceValidation = yup.object().shape({
    length_of_box: yup.number().required("Length of box Type is required").positive("should be postive number").typeError("Length of box Type is required"),
    width_of_box: yup.number().required(" Width of box is required").positive("should be postive number").typeError(" Width of box is required"),
    height_of_box: yup.number().required("Height of box is required").positive("should be postive number").typeError("Height of box is required")
})

export const linerPriceValidation = yup.object().shape({
    length_of_liner: yup
        .number()
        .typeError("Length of liner is required")
        .required("Length of liner is required")
        .positive("Should be a positive number"),
    width_of_liner: yup
        .number()
        .typeError("Width of liner is required")
        .required("Width of liner is required")
        .positive("Should be a positive number"),
});
