import { Controller } from "react-hook-form";
import { TextInput } from "@mantine/core";

export const ControlInput = ({ name, label, placeholder, type, control }) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <TextInput classNames={{ input: "inputGreenFocus" }}
                    type={type}
                    name={name}
                    size="md"
                    label={label}
                    placeholder={placeholder}
                    {...field}
                    error={error ? error.message : ""}
                />
            )}
        />
    );
};