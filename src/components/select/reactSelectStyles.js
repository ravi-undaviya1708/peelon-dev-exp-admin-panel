// reactSelectStyles.js

export const reactSelectStyles = (error) => ({
  control: (base, state) => ({
    ...base,
    padding: "1.7px",
    borderColor: error
      ? "#fa5252" // Red if error
      : state.isFocused
        ? "#12A14F" // Green if focused
        : base.borderColor, // Base color when not focused (regardless of hasValue)

    boxShadow: error
      ? "0 0 0 0px #fa5252"
      : state.isFocused
        ? "0 0 0 0px #12A14F"
        : "none",

    "&:hover": {
      borderColor: error
        ? "#fa5252"
        : state.isFocused
          ? "#12A14F"
          : base.borderColor,
    },
  }),

  placeholder: (base, state) => ({
    ...base,
    color: error ? "#fa5252" : "gray",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#a4e2b8"
      : state.isFocused
        ? "#d4f5e0"
        : "white",
    color: state.isSelected || state.isFocused ? "#666666" : "#666666",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "#a4e2b8",
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 3,
  }),

  menuPortal: (base) => ({
    ...base,
    zIndex: 1600, // IMPORTANT
  }),

  dropdownIndicator: (base, state) => ({
    ...base,
    color: error
      ? state.isFocused
        ? "#fa5252" // red when focused and error
        : "#fa5252" // red when not focused and error
      : state.isFocused
        ? "#12A14F" // green when focused and no error
        : "gray", // gray when not focused and no error

    "&:hover": {
      color: error
        ? "#fa5252" // always red on hover if error
        : state.isFocused
          ? "#12A14F"
          : "gray",
    },
  }),

  clearIndicator: (base) => ({
    ...base,
    color: "#12A14F",
    "&:hover": {
      color: "#12A14F",
    },
  }),

  singleValue: (base, state) => ({
    ...base,
    color: state.isFocused ? "#12A14F" : "#666666", 
  }),

});
