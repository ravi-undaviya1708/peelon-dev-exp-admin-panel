import { Box, Card, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { colors } from "../constants/constants"
import { Font16, Font20 } from "./StyledText"
import LemonImage from "../assets/Lemon.svg";
import { ActivityIcon } from "lucide-react";

export const LeadsCard=({sx={},icon:Icon,number,title,...props})=>{
    return (
        <>
         <Card sx={{borderRadius:"8px",p:2,...sx}}{...props}>
                  <Box display={"flex"} justifyContent={"space-between"}>
                    <Box
                      sx={{
                        backgroundColor: colors.secondarygreen,
                        color: "white",
                        placeContent: "center",
                        textAlign: "center",
                        height: "35px",
                        width: "40px",
                        borderRadius: "4px",
                      }}
                    >
                      {Icon && <Icon size={"20px"} style={{marginTop:"6px"}} />}
                    </Box>
                    <Font20 sx={{ color: "#153A1A", fontWeight: 600 }}>
                      {number}
                    </Font20>
                  </Box>
                  <Box mt={3}>
                    <Font16 sx={{ fontWeight: 500, color: "#666666" }}>
                     {title}
                    </Font16>
                  </Box>
              </Card>
        </>
    )
}


export const DashboardCards=({sx={},title,number,icon:Icon,link,onClick,...props})=>{
  return (
    <>
      <Card
      component={link ? Link : "div"}
      to={link || undefined}
      sx={{
        width: "100%",
        height: 120,
        bgcolor: "#F6DE04CC", // Yellow
        borderRadius: 2,
        position: "relative",
        boxShadow: "none",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        textDecoration: "none",
        cursor: link || onClick ? "pointer" : "default",
        ...sx
      }}
      onClick={onClick}
      {...props}
    >
      <Box
        sx={{
          backgroundColor: "#FDF9CF",
          width: 36,
          height: 36,
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
         {Icon && <Icon size={"20px"} style={{ color: "#928608" }} />}
       
      </Box>

      {/* Bottom Row - Text & Number */}
      <Box display={"flex"} justifyContent={"space-between"}>
        <Box alignContent={"center"}>
        <Typography  sx={{ color: "#444444",fontSize:"16px",fontWeight:500}}>
         {title}
        </Typography>
        </Box>
        <Typography sx={{ fontWeight: 700,fontSize:"20px" }}>
          {number}
        </Typography>
      </Box>
      <Box
        component="img"
        src={LemonImage}
        alt="lemon corner"
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 80,
          height: 60,
        }}
      />
    </Card>
    </>
  )
}
