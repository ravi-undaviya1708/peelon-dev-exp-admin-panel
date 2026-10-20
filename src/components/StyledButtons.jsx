import { Button, styled, Tab } from "@mui/material";
import { colors } from "../constants/constants";

export const LoginButton = styled(Button)({
  backgroundColor: colors.primary,
  color: "white",
  // fontSize: remValues.rem12,
  fontWeight: 600,
  textTransform: "capitalize",
});

export const PrimaryButton = styled(Button)({
  borderRadius: "4px",
  backgroundColor: "#16A14E",
  border: "1px solid #16A14E",

  color: "white",
  textTransform: "capitalize",
});

export const SubButton = styled(Button)({
  borderRadius: "24px",
  backgroundColor: "#E8F6ED",
  "&:hover": { border: "1px solid green" },
  color: "#616161",
  textTransform: "capitalize",
});

export const OutlinedAddButton = styled(Button)({
  borderRadius: "4px",
  border: "1px solid #16A14E",
  color: "#16A14E",
  textTransform: "capitalize",
});
// Custom styled Tab component
export const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontSize: "14px",
  margin:"5px",
  marginRight: theme.spacing(1),
  borderRadius: "20px",
  border: "1px solid #CCCCCC",
  padding: "0px 15px",
  color: "#666666",
  minHeight: "35px",
   boxShadow: "none",
  "&.Mui-selected": {
    backgroundColor: "#ffd700",
    color: "#000",
    border: "0px",
     boxShadow: "none",
  },


}));

export const ResponseButton = styled(Button)({
  border: "1px solid #EDEDED",
  borderRadius: "16px",
  padding:"12px,0px",
  fontSize: "12px",
  color: "#666666",
  textTransform: "capitalize",
});
