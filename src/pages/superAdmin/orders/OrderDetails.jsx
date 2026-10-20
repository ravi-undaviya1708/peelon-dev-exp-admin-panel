import { Box, Breadcrumbs, Divider, Grid, Typography } from "@mui/material";
import React from "react";
import {
  superAdminPathConstants,
  factoryPathConstants,
  salesRepresentativePathConstants,
  deliveryDispatchPathConstants,
  warehouseManagerPathConstants,
  accountsPathConstants,
  customerPathConstants,
} from "../../../constants/pathConstants";
import { colors } from "../../../constants/constants";
import { Font14, Font16, Font22 } from "../../../components/StyledText";
import { Rating } from "@mantine/core";
import { useLocation, Link } from "react-router-dom";
import useFetchList from "../../../hooks/useFetchList";
import { ordersURLS } from "../../../services/api/superadminApi";
import Loader from "../../../components/loader/Loader";
import { useSelector } from "react-redux";

const SectionCard = ({ children, mt = 3 }) => (
  <Box
    mt={mt}
    sx={{
      backgroundColor: "#fff",
      border: "1px solid #E5E8EB",
      borderRadius: "12px",
      p: { xs: 2, sm: 3 },
    }}
  >
    {children}
  </Box>
);

const SectionHeading = ({ children }) => (
  <Typography
    sx={{
      fontSize: { xs: "15px", sm: "16px" },
      fontWeight: 700,
      color: "#141414",
      mb: 2,
      pb: 1,
      borderBottom: "2px solid #E5E8EB",
    }}
  >
    {children}
  </Typography>
);

const InfoRow = ({ label, value }) => {
  if (!value && value !== 0) return null;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: { xs: 0.5, sm: 1 },
        py: { xs: "4px", sm: "5px" },
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "13px", sm: "14px" },
          fontWeight: 700,
          color: "#444",
          minWidth: { xs: "110px", sm: "150px" },
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: "13px", sm: "14px" },
          color: "#444",
          fontWeight: 400,
          flexShrink: 0,
        }}
      >
        :
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: "13px", sm: "14px" },
          color: "#141414",
          fontWeight: 400,
          flex: 1,
          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

function OrderDetails() {
  const isLoading = useSelector((state) => state.loader.isLoading);
  const userType = useSelector((state) => state.auth.userType);
  const pathConstantsByRole = {
    "Super Admin": superAdminPathConstants,
    "Factory Operation": factoryPathConstants,
    "Sales Representative": salesRepresentativePathConstants,
    "Delivery & Dispatch": deliveryDispatchPathConstants,
    "Warehouse Manager": warehouseManagerPathConstants,
    Accounts: accountsPathConstants,
    Customer: customerPathConstants,
  };
  const pathConstants = pathConstantsByRole[userType];
  const { DEFAULT, DASHBOARD, ORDERS } = pathConstants;
  const { getOrderDetailsURL } = ordersURLS;
  const location = useLocation();
  const { orderId } = location?.state || {};
  const { data: orderDetailsData } = useFetchList(
    `${getOrderDetailsURL}/${orderId}`,
  );

  if (isLoading) {
    return <Loader />;
  }

  const currency = orderDetailsData?.order?.currency;
  const formatAmount = (amount) =>
    currency === "INR"
      ? `₹ ${Number(amount || 0).toFixed(2)}`
      : `${currency} ${Number(amount || 0).toFixed(2)}`;

  return (
    <Box sx={{ px: { xs: 0, sm: 0 }, pb: 4 }}>
      {/* Page Header */}
      <Box>
        <Typography
          sx={{
            fontSize: { xs: "20px", sm: "24px" },
            fontWeight: 700,
            color: colors.headingclr,
          }}
        >
          Order Summary
        </Typography>
        <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mt: 0.5 }}>
          <Link
            style={{ color: colors.darkgreen, textDecoration: "none" }}
            to={`${DEFAULT}/${DASHBOARD}`}
          >
            <Typography sx={{ fontSize: { xs: "12px", sm: "14px" } }}>
              Dashboard
            </Typography>
          </Link>
          <Link
            style={{ color: colors.darkgreen, textDecoration: "none" }}
            to={`${DEFAULT}/${ORDERS}`}
          >
            <Typography sx={{ fontSize: { xs: "12px", sm: "14px" } }}>
              Orders
            </Typography>
          </Link>
          <Typography sx={{ fontSize: { xs: "12px", sm: "14px" } }}>
            Order Summary
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Products */}
      {orderDetailsData?.products?.length > 0 ? (
        orderDetailsData.products.map((item) => (
          <SectionCard key={item.id}>
            <SectionHeading>Product Details</SectionHeading>

            {/* Mobile: image on top, then details. Desktop: details left, image right */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 2, sm: 3 },
              }}
            >
              {/* Product Image — top on mobile, right on desktop */}
              <Box
                sx={{
                  order: { xs: -1, sm: 1 },
                  width: { xs: "100%", sm: "200px" },
                  flexShrink: 0,
                }}
              >
                <Box
                  component="img"
                  src={item.image_1}
                  alt={item.product_name}
                  sx={{
                    width: "100%",
                    height: { xs: "200px", sm: "170px" },
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                />
              </Box>

              {/* Product Info */}
              <Box sx={{ flex: 1, order: { xs: 1, sm: 0 } }}>
                <Typography
                  sx={{
                    fontSize: { xs: "15px", sm: "16px" },
                    fontWeight: 700,
                    color: "#141414",
                    mb: 1.5,
                  }}
                >
                  {item.product_name}
                </Typography>
                <InfoRow label="Type" value={item.product_type} />
                <InfoRow label="Description" value={item.product_description} />
                <InfoRow label="Size" value={item?.size} />
                {orderDetailsData?.order_type !== "Boxes" && (
                  <InfoRow label="Volume" value={item?.volume} />
                )}
                {orderDetailsData?.order_type !== "bulk" && (
                  <InfoRow label="Number of Boxes" value={item?.no_of_boxes} />
                )}
                <InfoRow
                  label="Invoice Number"
                  value={orderDetailsData?.invoice?.quote_no}
                />
              </Box>
            </Box>

            {/* Review */}
            {item?.review?.description && (
              <Box mt={3}>
                <Divider sx={{ mb: 2 }} />
                <SectionHeading>Review</SectionHeading>
                <Box display="flex" gap={2} alignItems="center" mb={1}>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: { xs: "14px", sm: "15px" },
                        fontWeight: 700,
                        color: "#141414",
                      }}
                    >
                      {item?.review?.name}
                    </Typography>
                    <Typography
                      sx={{ fontSize: { xs: "12px", sm: "13px" }, color: "#757575" }}
                    >
                      {item?.review?.date}
                    </Typography>
                  </Box>
                </Box>
                <Rating defaultValue={item?.review?.rating} readOnly />
                <Typography
                  sx={{
                    fontSize: { xs: "14px", sm: "15px" },
                    color: "#141414",
                    mt: 1,
                  }}
                >
                  {item?.review?.description}
                </Typography>
              </Box>
            )}
          </SectionCard>
        ))
      ) : (
        <SectionCard>
          <Typography sx={{ color: "#757575", fontSize: "14px" }}>
            No products found.
          </Typography>
        </SectionCard>
      )}

      {/* Order Information */}
      <SectionCard>
        <SectionHeading>Order Information</SectionHeading>
        <InfoRow label="Order ID" value={orderDetailsData?.order?.order_id} />
        <InfoRow label="Placed Date" value={orderDetailsData?.order?.placed_on} />
      </SectionCard>

      {/* Customer Details */}
      {orderDetailsData?.user && (
        <SectionCard>
          <SectionHeading>Customer Details</SectionHeading>
          <InfoRow
            label="Customer ID"
            value={orderDetailsData?.user?.customer_id}
          />
          <InfoRow label="Name" value={orderDetailsData?.user?.name} />
          <InfoRow label="Email" value={orderDetailsData?.user?.email} />
          <InfoRow label="Mobile" value={orderDetailsData?.user?.mobile} />
        </SectionCard>
      )}

      {/* Delivery Address (from order.delivery_address) */}
      {orderDetailsData?.order?.delivery_address && (
        <SectionCard>
          <SectionHeading>Delivery Address</SectionHeading>
          <InfoRow
            label="Address"
            value={orderDetailsData?.order?.delivery_address?.address}
          />
          <InfoRow
            label="State"
            value={orderDetailsData?.order?.delivery_address?.state}
          />
          <InfoRow
            label="Country"
            value={orderDetailsData?.order?.delivery_address?.country}
          />
          <InfoRow
            label="Pincode"
            value={orderDetailsData?.order?.delivery_address?.pincode}
          />
        </SectionCard>
      )}

      {/* Delivery Address (from order_address) */}
      {orderDetailsData?.order_address && (
        <SectionCard>
          <SectionHeading>Delivery Address</SectionHeading>
          <InfoRow
            label="Address"
            value={orderDetailsData?.order_address?.address}
          />
          <InfoRow
            label="Address Line"
            value={orderDetailsData?.order_address?.line}
          />
          <InfoRow
            label="Street"
            value={orderDetailsData?.order_address?.street}
          />
          <InfoRow
            label="State"
            value={orderDetailsData?.order_address?.state}
          />
          <InfoRow
            label="Country"
            value={orderDetailsData?.order_address?.country}
          />
          <InfoRow
            label="Pincode"
            value={orderDetailsData?.order_address?.pincode}
          />
        </SectionCard>
      )}

      {/* Pricing Summary */}
      <SectionCard>
        <SectionHeading>Pricing Summary</SectionHeading>
        <InfoRow
          label="Price"
          value={formatAmount(orderDetailsData?.pricing?.price)}
        />
        <InfoRow
          label="Shipping"
          value={formatAmount(orderDetailsData?.pricing?.shipping_charges)}
        />
        <Divider sx={{ my: 1.5 }} />
        {/* Total row — bold + green */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
            py: { xs: "4px", sm: "5px" },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "14px", sm: "15px" },
              fontWeight: 700,
              color: "#141414",
              minWidth: { xs: "110px", sm: "150px" },
              flexShrink: 0,
            }}
          >
            Total
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "14px", sm: "15px" },
              fontWeight: 700,
              color: "#141414",
              flexShrink: 0,
            }}
          >
            :
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "14px", sm: "15px" },
              fontWeight: 700,
              color: colors.darkgreen,
              flex: 1,
            }}
          >
            {formatAmount(orderDetailsData?.pricing?.total_amount)}
          </Typography>
        </Box>
      </SectionCard>
    </Box>
  );
}

export default OrderDetails;
