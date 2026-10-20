import { CircularProgress } from "@mui/material"
export const StyledCircularProgress = ({sx={}}) => {
    return (
        <CircularProgress
            size={20}
            sx={{
                color: "#fff",
                position: "absolute",
                transform: "translateY(-50%)",
                ...sx
            }}
        />
    )
}

