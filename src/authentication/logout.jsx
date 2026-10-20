import {
  Box,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import veg from "../assets/veg.jpg";
import { Font10, Font12, Font14, Font16 } from "../components/StyledText";
import { colors } from "../constants/constants";
import { Checkbox, Input } from "@mantine/core";
import { TextInput } from "../components/StyledInputs";
import { LoginButton, } from "../components/StyledButtons";
import vegwaste from "../assets/logo.png"
import { replace, useNavigate } from "react-router-dom";

 const Logout = () => {
 const navigate =useNavigate();
  const handleLogin=()=>{
    navigate("/login",replace);
  }
  return (
    <>
      {/* <Box sx={{ height: "100vh" }}> */}
      <Box sx={{ paddingTop: "7rem" }}>
        <Box
          sx={{
            backgroundImage: `url(${veg})`,
            width: "100%",
            height: {
              xs: "380px",
              lg: "400px",
              xl: "400px",
            },
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(to right,#364574,rgb(85, 138, 107))",
              opacity: 0.6,
              position: "absolute",
              height: "100%",
              width: "100%",
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          ></Box>
          <Box
            sx={{
              bottom: 0,
              right: 0,
              left: 0,
              position: "absolute",
              zIndex: 1,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 6 1440 120"
              style={{
                width: "100%",
                height: "auto",
                fill: "white",
                verticalAlign: "middle",
              }}
            >
              <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
            </svg>
          </Box>
        </Box>
        <Box
          sx={{
            paddingBottom: "60px",
            position: "relative",
            zIndex: 2,
            width: "100%",
          }}
        >
          <Container>
            <Box sx={{ alignContent: "center", textAlign: "center" }}>
              {/* <Typography
                sx={{ fontSize: "40px", color: "white", fontWeight: 900 }}
              >
                Peelon
              </Typography> */}
              {/* <Typography sx={{ color: "white" }}>
                A Solution To Reduce Food Waste
              </Typography> */}
            </Box>
            <Box sx={{ placeSelf: "center" }}>
              <Card
                sx={{
                  mt: 4,
                  borderRadius: "4px",
                  px: 3,
                  py: 4,
                  width: {
                    sm: "400px",
                    xs: "320px",
                    md: "400px",
                    lg: "400px",
                    xl: "500px",
                  },
                }}
              >
                <CardContent>
                  <Box>
                    <Box >
                        <Box textAlign={"center"}>
                        <img src={vegwaste} height={"100px"} width={"60%"}/>
                        </Box>
                        <Box textAlign={"center"}>
                        <Typography sx={{ color: colors.pinkygray }}>
                            A Solution To Reduce Food Waste
                        </Typography>
                        </Box>
                    </Box>
                    <Box mt={4}  sx={{ textAlign: "center" }}>
                      <Box mb={4}>
                        <Typography
                          sx={{
                            color: colors.primary,
                            fontSize: "16px",
                            fontWeight: 700,
                          }}
                        >
                          You are Logged Out
                        </Typography>
                        <Typography
                          sx={{
                            color: "#909599",
                            fontSize: "14px",
                            fontWeight: 700,
                          }}
                        >
                         Thank you for using peelon 
                        </Typography>
                      </Box>
                    
                      
                      <Box mt={2}>
                        <LoginButton onClick={()=>handleLogin()}   sx={{ width: "100%" }}>
                          Sign In
                        </LoginButton>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            
            </Box>
          </Container>
        </Box>
      </Box>
      {/* </Box> */}
    </>
  );
};
export default Logout;
    