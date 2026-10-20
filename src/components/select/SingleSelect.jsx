import Select from "react-select";
import { Controller } from "react-hook-form";
import { reactSelectStyles } from "./reactSelectStyles"

const SingleSelect = ({
  name,
  control,
  options,
  placeholder = "Select options",
  isClearable = true,
  isSearchable = true,
  onChangeOverride,
  menuPortalTarget,
  isDisabled = false,
  errors,
  from,
  setPage
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <Select
            {...field}
            options={options}
            isClearable={isClearable}
            isSearchable={isSearchable}
            menuPortalTarget={menuPortalTarget||document.body}
            placeholder={placeholder}
            isDisabled={isDisabled}
            value={options.find((opt) => opt.value === field.value) || null}
            styles={reactSelectStyles(error)}
            onChange={(selectedOptions) => {
              field.onChange(selectedOptions?.value || "");
              if (from) {
                setPage(1)
              }
              if (onChangeOverride) {
                onChangeOverride(selectedOptions?.value)
              }
            }}
          />
          {error && (
            <p
              style={{
                color: "#fa5252",
                fontSize: "12px",
                marginTop: "2px",
              }}
            >
              {error?.message}
            </p>
          )}

        </>
      )}
    />
  );
};

export default SingleSelect;
