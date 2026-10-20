import { Textarea, TextInput } from "@mantine/core";
import { Controller } from "react-hook-form";
import { colors } from "../../constants/constants";

export const TextareaInput = ({ name, label, placeholder, type, control, minRows="3", ...rest }) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Textarea classNames={{ input: "inputGreenFocus" }}
                    type={type}
                    name={name}
                    label={label}
                    autosize
                    minRows={minRows}
                    placeholder={placeholder}
                    {...field}
                    {...rest}
                    size="md"
                    error={error ? error.message : ""}
                />
            )}
        />
    );
};
