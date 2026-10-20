import { InputLabel, styled, TableCell, TextField, Typography } from "@mui/material";
import { colors, remValues } from "../constants/constants";
import { TextInput } from "@mantine/core";


export const Font16 = styled(Typography)({
  fontSize: remValues.rem16,
  color: colors.black,
});
// export const Font20 = styled(Typography)({
//   fontSize: remValues.rem20,
//   color: colors.headingclr,
// });

export const Font20 = ({ sx = {}, children, ...props }) => {
  return (
    <>
      <Typography sx={{
        fontSize: remValues.rem20,
        color: colors.headingclr, ...sx
      }} {...props}>{children}</Typography>
    </>
  )
}

export const DashboardFont12 = ({ sx = {}, children, ...props }) => {
  return (
    <>
      <Typography sx={{
        fontSize: remValues.rem12,
        color: "#777777", ...sx
      }} {...props}>{children}</Typography>
    </>
  )
}

export const Font14 = styled(Typography)({
  fontSize: remValues.rem14,
  color: colors.black,
});
export const Font12 = styled(Typography)({
  fontSize: remValues.rem12,
  fontWeight: 700,
  color: colors.black,
});

export const Font24 = styled(Typography)({
  fontSize: remValues.rem24,
  fontWeight: 700,
  color: colors.headingclr,
});
export const Font22 = styled(Typography)({
  fontSize: remValues.rem22,
  fontWeight: 700,
  color: "#141414",
});

export const Font10 = styled(Typography)({
  fontSize: remValues.rem10,
  fontWeight: 900,
  color: colors.black,
});

export const StyledLabel = styled(InputLabel)({
  fontWeight: "500 !important",
  color: "rgb(8, 8, 8) !important",
  fontWeight: 600,
  fontSize: "0.875rem !important",
  lineHeight: "1.125rem",
  marginBottom: "0.5rem",
  textAlign: "left",
});
export const InputLabel16 = styled(InputLabel)({
  fontWeight: "500 !important",
  color: "#555555 !important",
  fontWeight: 500,
  fontSize: "16px",
});

// export const StyledTextField = styled(TextField)({
//   borderRadius: "4px",
//   minHeight: "1.4375em !important",
//   "& input": {
//     padding: "0.5rem 0.9rem !important",
//     color: "black !important", // Change entered text color
//     "&::placeholder": {
//       fontSize: "1rem", // Adjust this value to make the placeholder text smaller
//       color: "#999 !important", // Optional: Adjust placeholder color if needed
//     },
//   },
//   // Override autofill background
//   "& input:-webkit-autofill": {
//     WebkitBoxShadow: "0 0 0px 1000px white inset !important",
//     backgroundColor: "white !important",
//     color: "black !important",
//   },

//   "& fieldset": {
//     border: "1px solid #E5E5E5",
//   },

//   "&:hover fieldset": {
//     borderColor: "#12A14F !important",
//   },

//   "& .MuiOutlinedInput-root": {
//     "&.Mui-focused input": {
//       color: "#64666c !important", // Change entered text color on focus
//     },

//     "&.Mui-focused fieldset": {
//       border: "1px solid #12A14F !important", // Green border on focus
//     },
//   },

//   "& .Mui-error": {
//     marginLeft: 0,
//   },
// });

export const Label16 = styled(Typography)({
  fontSize: '16px',
  fontWeight: 500,
  color: '#555555',
});

import { forwardRef } from "react";
import { Padding } from "@mui/icons-material";


export const StyledTextField = forwardRef((props, ref) => (
  <TextInput classNames={{ input: "inputGreenFocus" }}
    {...props}
    ref={ref}
  />
));

StyledTextField.displayName = "StyledTextInput";




export const StyledTableCell = styled(TableCell)({
  color: `${colors.headingclr} !important`,
  fontWeight: "600 !important",
  padding: "15px 15px !important",
  fontSize: `${remValues.rem14 || "0.875rem"} !important`,
  backgroundColor: `${"#FFFDF3"} !important`,

})

export const StyledInterstedProducts = styled(Typography)({
  fontSize: '16px',
  fontWeight: 500,
  backgroundColor: '#E8F6ED',
  borderRadius: "24px",
  padding: "4px 12px",
  color: "#333333",
})



// import React, { forwardRef } from "react";

// export const StyledTextField = forwardRef(
//   (
//     {
//       label = "Search",
//       id = "search",
//       value,
//       onChange,
//       placeholder = "Enter Company Name",
//       ...rest
//     },
//     ref // ✅ this is the forwarded ref
//   ) => {
//     return (
//       <div className="styled-text-input-container">
//         <label htmlFor={id} className="styled-text-input-label">
//           {label}
//         </label>
//         <input
//           type="text"
//           id={id}
//           name={id}
//           className="styled-text-input"
//           placeholder={placeholder}
//           value={value}
//           onChange={onChange}
//           ref={ref} // ✅ pass ref to input
//           {...rest}
//         />
//       </div>
//     );
//   }
// );











