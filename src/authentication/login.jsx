import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import veg from "../assets/veg.jpg";
import { Font16 } from "../components/StyledText";
import { colors } from "../constants/constants";
import { Checkbox } from "@mantine/core";
import { LoginButton } from "../components/StyledButtons";
import { useForm } from "react-hook-form";
import { ControlInput } from "../components/input/ControlInput";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "./loginSchema";
import { authenticationURL } from "../services/api/api";
import { useDispatch } from "react-redux";
import useApiRequest from "../hooks/useApiRequest";
import { useEffect } from "react";
import { loginAuth } from "../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { StyledCircularProgress } from "../components/StyleCircularProgrerss";
import {
  accountsPathConstants,
  customerPathConstants,
  deliveryDispatchPathConstants,
  superAdminPathConstants,
  warehouseManagerPathConstants,
} from "../constants/pathConstants";
import { PasswordInputField } from "../components/input/PasswordInputField";

const initialLoginData = {
  email: "",
  password: "",
};

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: initialLoginData,
  });
  const { loginURL } = authenticationURL;
  const dispatchToken = useDispatch();
  const navigate = useNavigate();
  const { post, error } = useApiRequest();

  useEffect(() => {
    const body = document.getElementsByTagName("body")[0];
    body.style.overflow = "hidden";
  }, []);

  const submitLogin = async (data) => {
    const response = await post(loginURL, data);
    //console.log(response);

    if (response?.settings.success) {
      //console.log(response);
      const { access, refresh, role,user_id} = response.data;
      dispatchToken(
        loginAuth({
          accessToken: access,
          refreshToken: refresh,
          isAuthenticated: true,
          userType: role,
          userId:user_id
        })
      );
      console.log(role, "role");
      toast.success(response?.settings.message);
      if (role === "Delivery & Dispatch") {
        navigate(
          `${deliveryDispatchPathConstants.DEFAULT}/${deliveryDispatchPathConstants.DASHBOARD}`
        );
      } else if (role === "Warehouse Manager") {
        navigate(
          `${warehouseManagerPathConstants.DEFAULT}/${warehouseManagerPathConstants.DASHBOARD}`
        );
      } else if (role === "Accounts") {
        navigate(
          `${accountsPathConstants.DEFAULT}/${accountsPathConstants.DASHBOARD}`
        );
      } else if (role === "Customer") {
        navigate(
          `${customerPathConstants.DEFAULT}/${customerPathConstants.DASHBOARD}`
        );
      } else {
        navigate(
          `${superAdminPathConstants.DEFAULT}/${superAdminPathConstants.DASHBOARD}`
        );
      }
    } else {
      toast.error(response.settings.message);
    }
  };
  return (
    <>
      {/* <Box sx={{ height: "100vh" }}> */}
      <Box
        sx={{ paddingTop: "4rem" }}
        component="form"
        onSubmit={handleSubmit(submitLogin)}
      >
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
          {" "}
          {/* <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  textAlign: "center",
                  alignContent: "center",
                }}
              >
                <Typography
                  sx={{ fontSize: "40px", color: "white", fontWeight: 900 }}
                >
                  Peelon
                </Typography>
              </Box> */}
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
              <Typography
                sx={{ fontSize: "40px", color: "white", fontWeight: 900 }}
              >
                Peelon
              </Typography>
              <Typography sx={{ color: "white" }}>
                A Solution To Reduce Food Waste
              </Typography>
            </Box>
            <Box sx={{ placeSelf: "center" }}>
              <Card
                sx={{
                  mt: 4,
                  borderRadius: "4px",
                  px: 2,
                  py: 3,
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
                    <Box sx={{ textAlign: "center" }}>
                      <Font16 sx={{ color: "#417939", fontWeight: 600 }}>
                        Welcome Back!
                      </Font16>
                      <Typography
                        sx={{ color: colors.pinkygray, fontSize: "14px" }}
                      >
                        Sign in to continue to Peelon.
                      </Typography>
                    </Box>
                    <Box mt={2} sx={{ textAlign: "start" }}>
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          sx={{
                            color: colors.greishblack,
                            fontSize: "14px",
                            fontWeight: 700,
                          }}
                        >
                          UserName
                        </Typography>
                        <ControlInput
                          name="email"
                          type="email"
                          placeholder="Enter Your Email"
                          control={control}
                        />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          sx={{
                            color: colors.greishblack,
                            fontSize: "14px",
                            fontWeight: 700,
                          }}
                        >
                          Password
                        </Typography>
                        <PasswordInputField
                          name="password"
                          type="password"
                          placeholder="Enter Your Password"
                          control={control}
                        />
                      </Box>
                      <Box mt={2} display={"flex"} gap={1}>
                        <Checkbox size="xs" />
                        <Typography
                          sx={{
                            color: colors.greishblack,
                            fontSize: "14px",
                            fontWeight: 700,
                          }}
                        >
                          Remember me
                        </Typography>
                      </Box>
                      <Box mt={2}>
                        <LoginButton
                          sx={{ width: "100%" }}
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Sign In
                          {isSubmitting && <StyledCircularProgress />}
                        </LoginButton>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              <Box textAlign={"center"} mt={3}>
                <Box>
                  <Typography
                    sx={{
                      color: colors.greishblack,
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  ></Typography>
                </Box>
              </Box>
              {/* <Box>
                  <Typography
                    sx={{
                      color: colors.greishblack,
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    Sign Up
                  </Typography>
                </Box> */}
            </Box>
          </Container>
        </Box>
      </Box>
      {/* </Box> */}
    </>
  );
};
export default Login;
