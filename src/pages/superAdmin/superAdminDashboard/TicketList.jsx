// import { Box, Typography } from "@mui/material";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// const TicketList = ({ tickets }) => {
//   const userType = useSelector((state) => state.auth.userType);

//   // console.log("tickets",tickets);

//   const navigate = useNavigate();

//   const handleOrderDetails = (id) => {
//     navigate("../orders/order-details", { state: { orderId: id } });
//   };

//   // console.log("tickets", tickets);
//   if (!tickets?.length) {
//     return <Typography>No tickets found.</Typography>;
//   }
//   return (
//     <Box display="flex" flexDirection="column" gap={2}>
//       {tickets?.map((ticket) => (
//         <Box
//           key={ticket?.id}
//           sx={{
//             border: "1px solid #ddd",
//             borderRadius: 2,
//             padding: 2,
//             display: "flex",
//             gap: 2,
//           }}
//         >
//           {/* Image */}
//           <Box
//             component="img"
//             src={ticket?.order?.products[0]?.image_1}
//             alt="product"
//             sx={{
//               width: 80,
//               height: 80,
//               borderRadius: 1,
//               objectFit: "cover",
//               cursor: "pointer",
//             }}
//             onClick={
//               userType === "Factory Operation"
//                 ? () => handleOrderDetails(ticket?.order_id)
//                 : undefined
//             }
//           />
//           {/* Details */}
//           <Box>
//             <Typography fontWeight={600}>
//               {ticket?.order?.products[0]?.product_name}
//             </Typography>
//             <Typography fontSize={14}>
//               Order ID: {ticket?.order?.order.order_id}
//             </Typography>
//             <Typography fontSize={14}>
//               Amount: {ticket?.order?.pricing.total_amount}
//             </Typography>
//             <Typography fontSize={14}>Status: {ticket?.status}</Typography>
//           </Box>
//         </Box>
//       ))}
//     </Box>
//   );
// };
// export default TicketList;

import BlankImage from "../../../assets/checker.png"

const FULL_ORDER_ROLES = ["Factory Operation", "Super Admin"];
const SIMPLE_ORDER_ROLES = ["Sales Representative", "Delivery & Dispatch","Accounts"];

const getTicketViewData = (ticket, userType) => {

  
  if (FULL_ORDER_ROLES?.includes(userType)) {
    return {
      image: ticket?.order?.products?.[0]?.image_1||BlankImage,
      productName: ticket?.order?.products?.[0]?.product_name,
      orderId: ticket?.order?.order?.order_id,
      amount: ticket?.order?.pricing?.total_amount,
      status: ticket?.status,
      clickable: true,
    };
  }

  if (SIMPLE_ORDER_ROLES?.includes(userType)) {
    return {
      image: null,
      productName: null,
      orderId: ticket?.order_id,
      amount: null,
      status: ticket?.order_progress_status,
      clickable: false,
    };
  }

  return {};
};
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StyledNoData } from "../../../components/StyledNoData";

const TicketList = ({ tickets }) => {
  const userType = useSelector((state) => state.auth.userType);
  const navigate = useNavigate();

  const handleOrderDetails = (id) => {
    navigate("../orders/order-details", { state: { orderId: id } });
  };

  if (!tickets?.length) {
    return <StyledNoData />;
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {tickets.map((ticket) => {
        const view = getTicketViewData(ticket, userType);

        return (
          <Box
            key={ticket.id}
            sx={{
              border: "1px solid #ddd",
              borderRadius: 2,
              padding: 2,
              display: "flex",
              gap: 2,
            }}
          >
            {/* IMAGE (only for full roles) */}
            {view?.image && (
              <Box
                component="img"
                src={view?.image}
                alt="product"
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 1,
                  objectFit: "cover",
                  cursor: view.clickable ? "pointer" : "default",
                }}
                onClick={
                  view.clickable
                    ? () => handleOrderDetails(ticket?.order_id)
                    : undefined
                }
              />
            )}

            {/* DETAILS */}
            <Box>
              {view?.productName && (
                <Typography fontWeight={600}>{view?.productName}</Typography>
              )}

              <Typography fontSize={14}>Order ID: {view?.orderId}</Typography>

              {view?.amount && (
                <Typography fontSize={14}>Amount: {view?.amount}</Typography>
              )}

              <Typography fontSize={14}>Status: {view?.status}</Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default TicketList;
