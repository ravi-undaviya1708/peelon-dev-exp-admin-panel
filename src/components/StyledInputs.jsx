import { StyledLabel, StyledTextField } from "./StyledText";

export const TextInput = ({
  children,
  label,
  placeholder,
  fullWidth = true,
  required = false,
  ...props
}) => {
  return (
    <>
      <StyledLabel>
        {label}
        {required && `*`}
      </StyledLabel>
      <StyledTextField
        variant="outlined"
        fullWidth={fullWidth}
        required={required}
        placeholder={placeholder}
        {...props}
      />
    </>
  );
};