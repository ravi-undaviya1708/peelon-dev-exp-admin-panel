import { lazy } from "react";
import { deliveryDispatchPathConstants } from "../constants/pathConstants";
import EditProfile from "../pages/superAdmin/profile/EditProfile";
import AddSalesRepresentative from "../pages/superAdmin/salesrepresentative/AddSalesRepresentative";
const ContactDetails = lazy(() =>
  import("../pages/superAdmin/contacts/ContactDetails")
);
const OrderDetails = lazy(() =>
  import("../pages/superAdmin/orders/OrderDetails")
);
const SuperAdminDashboard = lazy(() =>
  import("../pages/superAdmin/superAdminDashboard/SuperAdminDashboard")
);
const Leads = lazy(() => import("../pages/superAdmin/Leads/Leads"));
const LeadDetails = lazy(() => import("../pages/superAdmin/Leads/LeadDetails"));
const Deals = lazy(() => import("../pages/superAdmin/deals/Deals"));
const DealDetails = lazy(() => import("../pages/superAdmin/deals/DealDetails"));
const Activities = lazy(() =>
  import("../pages/superAdmin/activities/Activities")
);
const CalculatePricing = lazy(() =>
  import("../pages/superAdmin/calculatepricing/CalculatePricing")
);
const Orders = lazy(() => import("../pages/superAdmin/orders/Orders"));
const InvoicePoAndQuote = lazy(() =>
  import("../pages/superAdmin/Invoicepoandquote/InvoicePoAndQuote")
);
const Quotation = lazy(() =>
  import("../pages/superAdmin/Invoicepoandquote/Quotation")
);
const Contacts = lazy(() => import("../pages/superAdmin/contacts/Contacts"));
const Manual = lazy(() => import("../pages/superAdmin/contacts/Manual"));
const Blogs = lazy(() => import("../pages/superAdmin/blogs/Blogs"));
const ProductAndInventory = lazy(() =>
  import("../pages/superAdmin/productandinventory/ProductAndInventory")
);
const Product = lazy(() =>
  import("../pages/superAdmin/productandinventory/Product")
);
const Inventory = lazy(() =>
  import("../pages/superAdmin/productandinventory/Inventory")
);
const ProductDetail = lazy(() =>
  import("../pages/superAdmin/productandinventory/ProductDetail")
);
const DeliveriesAndDispatch = lazy(() =>
  import("../pages/superAdmin/deliveriesanddispatch/DeliveriesAndDispatch")
);
const QualityControl = lazy(() =>
  import("../pages/superAdmin/qualitycontrol/QualityControl")
);
const EditDeliveriesAndDispatch = lazy(() =>
  import("../pages/superAdmin/deliveriesanddispatch/EditDeliveriesAndDispatch")
);
const WareHouse = lazy(() => import("../pages/superAdmin/warehouse/WareHouse"));
const Accounts = lazy(() => import("../pages/superAdmin/accounts/Accounts"));
const EditSalesRepresentative = lazy(() =>
  import("../pages/superAdmin/salesrepresentative/EditSalesRepresentative")
);
const Customers = lazy(() =>
  import("../pages/superAdmin/customermangement/Customers")
);
const BulkOrdersRequests = lazy(() =>
  import("../pages/superAdmin/customermangement/BulkOrdersRequests")
);

// Use RELATIVE paths for child routes (not absolute like "/dashboard")
export const deliveryDispatchRoutes = [
  {
    path: deliveryDispatchPathConstants.DASHBOARD,
    element: <SuperAdminDashboard />,
  },
  {
    path: deliveryDispatchPathConstants.EDITPROFILE,
    element: <EditProfile />,
  },

  {
    path: deliveryDispatchPathConstants.LEADS,
    element: <Leads />,
  },

  {
    path: deliveryDispatchPathConstants.LEADDETAILS,
    element: <LeadDetails />,
  },

  {
    path: deliveryDispatchPathConstants.DEALS,
    element: <Deals />,
  },

  {
    path: deliveryDispatchPathConstants.DEALDETAILS,
    element: <DealDetails />,
  },

  {
    path: deliveryDispatchPathConstants.ACTIVITIES,
    element: <Activities />,
  },

  {
    path: deliveryDispatchPathConstants.CONTACTS,
    element: <Contacts />,
  },

  {
    path: deliveryDispatchPathConstants.ADDMANUAL,
    element: <Manual />,
  },

  {
    path: deliveryDispatchPathConstants.EDITMANUAL,
    element: <Manual />,
  },
  {
    path: deliveryDispatchPathConstants.PRICE,
    element: <CalculatePricing />,
  },

  {
    path: deliveryDispatchPathConstants.CONTACTDETAILS,
    element: <ContactDetails />,
  },

  {
    path: deliveryDispatchPathConstants.ORDERS,
    element: <Orders />,
  },
  {
    path: deliveryDispatchPathConstants.ORDERDETAILS,
    element: <OrderDetails />,
  },
  {
    path: deliveryDispatchPathConstants.CUSTOMER,
    element: <Customers />,
  },
  {
    path: deliveryDispatchPathConstants.BULK,
    element: <BulkOrdersRequests />,
  },

  {
    path: deliveryDispatchPathConstants.INVOICEPOANDQUOTE,
    element: <InvoicePoAndQuote />,
  },

  {
    path: deliveryDispatchPathConstants.QUOTATION,
    element: <Quotation />,
  },

  {
    path: deliveryDispatchPathConstants.PURCHARSEORDER,
    element: <Quotation />,
  },

  {
    path: deliveryDispatchPathConstants.INVOICE,
    element: <Quotation />,
  },

  {
    path: deliveryDispatchPathConstants.BLOGS,
    element: <Blogs />,
  },

  {
    path: deliveryDispatchPathConstants.PRODUCTANDINVENTORY,
    element: <ProductAndInventory />,
  },

  {
    path: deliveryDispatchPathConstants.ADDPRODUCT,
    element: <Product />,
  },

  {
    path: deliveryDispatchPathConstants.EDITPRODUCT,
    element: <Product />,
  },

  {
    path: deliveryDispatchPathConstants.ADDINVENTORY,
    element: <Inventory />,
  },

  {
    path: deliveryDispatchPathConstants.EDITINVENTORY,
    element: <Inventory />,
  },

  {
    path: deliveryDispatchPathConstants.PRODUCTDETAIL,
    element: <ProductDetail />,
  },

  {
    path: deliveryDispatchPathConstants.DELIVERIESANDDISPATCH,
    element: <DeliveriesAndDispatch />,
  },

  {
    path: deliveryDispatchPathConstants.EDITDELIVERIESANDDISPATCH,
    element: <EditDeliveriesAndDispatch />,
  },

  {
    path: deliveryDispatchPathConstants.QUALITYCONTROL,
    element: <QualityControl />,
  },

  {
    path: deliveryDispatchPathConstants.WAREHOUSE,
    element: <WareHouse />,
  },

  {
    path: deliveryDispatchPathConstants.ACCOUNTS,
    element: <Accounts />,
  },

  {
    path: deliveryDispatchPathConstants.EDITSALESREPRESENTATIVE,
    element: <EditSalesRepresentative />,
  },
  {
    path: deliveryDispatchPathConstants.ADDSALESREPRESENTATIVE,
    element: <AddSalesRepresentative />,
  },
];
