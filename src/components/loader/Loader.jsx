import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import loader from "../../assets/loadercirclegif.gif"

const Loader = () => {
  const isLoading = useSelector((state) => state.loader.isLoading);
  if (!isLoading) return null;

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div style={{ width: "300px",textAlign: "center" }}>
        <img
          style={{ width: "100px", height: "100px", mixBlendMode: "multiply" }}
          src={loader}
        />
      </div>
    </Box>
  );
};

export default Loader;
