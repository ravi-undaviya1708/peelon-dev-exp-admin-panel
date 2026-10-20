import { PasswordInput } from "@mantine/core";
import { Controller } from "react-hook-form";

export const PasswordInputField = ({ name, label, placeholder, type, control, autoComplete = "new-password", ...rest }) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <PasswordInput
                    type={type}
                    name={name}
                    size="md"
                    label={label}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    {...field}
                    {...rest}
                    error={error ? error.message : ""}
                    styles={{
                        input: {
                            "--input-bd-focus": error ? "12A14F" : "#12A14F",
                            "--input-box-shadow": "0 0 0 1px #12A14F",
                        },
                    }}
                />
            )}
        />
    );
};