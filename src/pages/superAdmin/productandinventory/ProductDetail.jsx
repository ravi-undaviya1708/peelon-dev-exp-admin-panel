import { Box, Breadcrumbs, Grid, Typography } from "@mui/material";
import React from "react";
import { useLocation,Link } from "react-router-dom";
import { accountsPathConstants, customerPathConstants, deliveryDispatchPathConstants, factoryPathConstants, salesRepresentativePathConstants, superAdminPathConstants, warehouseManagerPathConstants } from "../../../constants/pathConstants";
import { colors } from "../../../constants/constants";
import { Font16} from "../../../components/StyledText";
import useFetchList from "../../../hooks/useFetchList";
import { productInventoryURLS } from "../../../services/api/superadminApi";
import checker from "../../../assets/checker.png"
import { useSelector } from "react-redux";
import Loader from "../../../components/loader/Loader";

function ProductDetail() {
  const isLoading=useSelector((state)=>state?.loader?.isLoading)
const userType = useSelector((state) => state.auth.userType);
    const pathConstantsByRole = {
        "Super Admin": superAdminPathConstants,
        "Factory Operation": factoryPathConstants,
        "Sales Representative": salesRepresentativePathConstants,
        "Delivery & Dispatch": deliveryDispatchPathConstants,
        "Warehouse Manager": warehouseManagerPathConstants,
        "Accounts": accountsPathConstants,
        "Customer": customerPathConstants,
    };
    const pathConstants = pathConstantsByRole[userType];
    const { DEFAULT, DASHBOARD,PRODUCTANDINVENTORY} = pathConstants;  const {getProductDetailsURL}=productInventoryURLS;
  const location=useLocation();
  const {productDetailId}=location.state;
  const {data:productDetailData}=useFetchList(`${getProductDetailsURL}/${productDetailId}`)

  if (isLoading){
    return <Loader/>
  }

  return (
    <>
      <Box>
        <Box
          display={"flex"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
        >
          <Box mt={1}>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 700,
                color: colors.headingclr,
              }}
            >
              Product Details
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                style={{ color: colors.darkgreen, textDecoration: "none" }}
                to={`${DEFAULT}/${DASHBOARD}`}
              >
                <Typography sx={{ fontSize: "14px" }}>Dashbaord</Typography>
              </Link>
              <Link
                style={{ color: colors.darkgreen, textDecoration: "none" }}
                to={`${DEFAULT}/${PRODUCTANDINVENTORY}`}
              >
                <Typography sx={{ fontSize: "14px" }}>
                  Products
                  </Typography>
              </Link>
              <Typography sx={{ fontSize: "14px" }}>Product Details</Typography>
            </Breadcrumbs>
          </Box>
        </Box>
        <Box mt={3}>
          <Box display={"flex"} gap={4} flexWrap={"wrap"} sx={{justifyContent:{xs:"center",sm:"start"}}}>
            <Box>
              <img
                src={productDetailData.image_1 || checker}
                height={"200px"}
                width={"200px"}
                style={{ borderRadius: "10px", objectFit: "cover" }}
              />
            </Box>
            <Box>
              <img
                 src={productDetailData.image_2 || checker}
                height={"200px"}
                width={"200px"}
                style={{ borderRadius: "10px", objectFit: "cover" }}
              />
            </Box>
            <Box>
              <img
                 src={productDetailData.image_3 || checker}
                height={"200px"}
                width={"200px"}
                style={{ borderRadius: "10px", objectFit: "cover" }}
              />
            </Box>
            <Box>
              <img
                 src={productDetailData.image_4 || checker}
                height={"200px"}
                width={"200px"}
                style={{ borderRadius: "10px", objectFit: "cover" }}
              />
            </Box>  
          </Box>
          <Box mt={2}>
            <Grid container>
              <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 8 }}>
                <Grid container>
                  <Grid size={{xs:4,sm:3,md:2,lg:2,xl:2}} mt={1}>
                  <Font16 sx={{color:"#666666",fontWeight:"bold"}}>Name</Font16>
                  </Grid>
                  <Grid size={{xs:8,sm:9,md:10,lg:10,xl:10}} mt={1}>
                  <Font16 sx={{color:"#666666"}}>: {productDetailData.product_name}</Font16>
                  </Grid>
                  <Grid size={{xs:4,sm:3,md:2,lg:2,xl:2}} mt={1}>
                  <Font16 sx={{color:"#666666",fontWeight:"bold"}}>Type</Font16>
                  </Grid>
                  <Grid size={{xs:8,sm:9,md:10,lg:10,xl:10}} mt={1}>
                  <Font16 sx={{color:"#666666"}}>: {productDetailData.product_type?.product_type_value}</Font16>
                  </Grid>
                  <Grid size={{xs:4,sm:3,md:2,lg:2,xl:2}} mt={1}>
                  <Font16 sx={{color:"#666666",fontWeight:"bold"}}>Description</Font16>
                  </Grid>
                  <Grid size={{xs:8,sm:9,md:10,lg:10,xl:10}} mt={1}>
                  <Font16 sx={{color:"#666666"}}> : {productDetailData.product_description}</Font16>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default ProductDetail;
