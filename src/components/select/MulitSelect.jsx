import React from "react";
import Select from "react-select";
import { Controller } from "react-hook-form";
import { reactSelectStyles } from "./reactSelectStyles";

const MulitiSelect = ({
  name,
  control,
  options,
  placeholder = "Select options",
  isClearable = true,
  isSearchable = true,
  menuPortalTarget

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
            isMulti
            placeholder={placeholder}
            value={options.filter((opt) => field.value?.includes(opt.value))}
            onChange={(selectedOptions) =>
              field.onChange(
                selectedOptions ? selectedOptions.map((opt) => opt.value) : []
              )
            }
            styles={reactSelectStyles(error)}
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

export default MulitiSelect;
