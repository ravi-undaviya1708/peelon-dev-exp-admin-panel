import { Box, Typography } from "@mui/material"
import noData from "../assets/Group.png"

export const StyledNoData = ({ minHeight,width="100px"}) => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={minHeight || "300px"}
            flexDirection={"column"}
        >
            <img
                src={noData}
                alt="No Data Available"
                style={{ width , height: "auto", opacity: "0.5" }}
            />
            <Typography sx={{opacity:"0.5"}}>No Data Found</Typography>

        </Box>
    )
}