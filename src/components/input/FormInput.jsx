import { TextInput } from "@mantine/core";
import { DatePickerInput, DateTimePicker } from "@mantine/dates";
import { Controller } from "react-hook-form";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

export const FormInput = ({
  name,
  label,
  placeholder,
  type,
  control,
  disabled = false,
  min,
  max,
  autoComplete,
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        if (type === "date") {
          const parsedValue = field.value ? new Date(field.value) : null;
          return (
            <DatePickerInput
              size="md"
              disabled={disabled}
              placeholder={placeholder || "Enter Date"}
              label={label}
              value={parsedValue && !isNaN(parsedValue.getTime()) ? parsedValue : null}
              onChange={(val) => {
                if (!val) {
                  field.onChange("");
                } else {
                  const dateStr = val instanceof Date ? val.toISOString().split("T")[0] : val;
                  field.onChange(dateStr);
                }
              }}
              minDate={min ? new Date(min) : undefined}
              maxDate={max ? new Date(max) : undefined}
              error={error?.message}
              classNames={{ input: "inputGreenFocus" }}
              clearable
              valueFormat="DD-MM-YYYY"
              {...rest}
            />
          );
        }

        if (type === "datetime") {
          return (
            <DateTimePicker
              size="md"
              disabled={disabled}
              placeholder={placeholder || "Enter Schedule Date"}
              label={label}
              value={field.value || null}
              onChange={field.onChange}
              error={error?.message}
              classNames={{ input: "inputGreenFocus" }}
              clearable
              {...rest}
            />
          );
        }

        return (
          <TextInput
            classNames={{ input: "inputGreenFocus" }}
            type={type}
            name={name}
            size="md"
            label={label}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete={autoComplete}
            min={min}
            max={max}
            {...rest}
            value={field.value === null ? "" : field.value}
            onChange={(e) => {
              const rawValue = e.target.value;
              const value =
                type === "number"
                  ? rawValue !== ""
                    ? +rawValue
                    : ""
                  : rawValue;
              field.onChange(value);
            }}
            error={error?.message}
          />
        );
      }}
    />
  );
};
