import { Box, Typography, Container, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import veg from "../../../assets/veg.jpg";
import {
  superAdminPathConstants,
  factoryPathConstants,
  salesRepresentativePathConstants,
  deliveryDispatchPathConstants,
  warehouseManagerPathConstants,
  accountsPathConstants,
} from "../../../constants/pathConstants";
import { useSelector } from "react-redux";

const PageNotFound = () => {
  const userType = useSelector((state) => state.auth.userType);
  const navigate = useNavigate();
  const location = useLocation();
  const reason = location.state?.reason;

  const handleGoHome = () => {
    if (userType === "Super Admin")
      navigate(
        `${superAdminPathConstants.DEFAULT}/${superAdminPathConstants.DASHBOARD}`,
        { replace: true }
      );
    else if (userType === "Factory Operation")
      navigate(
        `${factoryPathConstants.DEFAULT}/${factoryPathConstants.DASHBOARD}`,
        { replace: true }
      );
    else if (userType === "Sales Representative")
      navigate(
        `${salesRepresentativePathConstants.DEFAULT}/${salesRepresentativePathConstants.DASHBOARD}`,
        { replace: true }
      );
    else if (userType === "Delivery & Dispatch")
      navigate(
        `${deliveryDispatchPathConstants.DEFAULT}/${deliveryDispatchPathConstants.DASHBOARD}`,
        { replace: true }
      );
    else if (userType === "Warehouse Manager")
      navigate(
        `${warehouseManagerPathConstants.DEFAULT}/${warehouseManagerPathConstants.DASHBOARD}`,
        { replace: true }
      );
    else if (userType === "Accounts")
      navigate(
        `${accountsPathConstants.DEFAULT}/${accountsPathConstants.DASHBOARD}`,
        { replace: true }
      );
    else navigate("/login"); // fallback
  };

  return (
    <Box sx={{ height: "100vh", position: "relative" }}>
      {/* Background Image */}
      <Box
        sx={{
          backgroundImage: `url(${veg})`,
          width: "100%",
          height: "100%",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        {/* Gradient Overlay */}
        <Box
          sx={{
            background: "linear-gradient(to right,#364574,rgb(85, 138, 107))",
            opacity: 0.6,
            position: "absolute",
            height: "100%",
            width: "100%",
          }}
        />
      </Box>

      {/* Foreground Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Container>
          <Typography
            sx={{
              fontSize: { xs: "80px", sm: "100px" },
              fontWeight: 800,
              color: "white",
            }}
          >
            404
          </Typography>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 600,
              color: "white",
              mb: 2,
            }}
          >
            {reason === "unauthorized"
              ? "Unauthorized Access"
              : "Page Not Found"}
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              color: "#f0f0f0",
              mb: 3,
            }}
          >
            {reason === "unauthorized"
              ? "Sorry, you are not authorized to access this section."
              : "Sorry, the page you are looking for doesn't exist or has been moved."}
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#12A14F",
              "&:hover": { backgroundColor: "#0e8e44" },
              px: 4,
              py: 1,
              fontWeight: 600,
              fontSize: "14px",
            }}
            onClick={handleGoHome}
          >
            Go to Dashboard
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default PageNotFound;
