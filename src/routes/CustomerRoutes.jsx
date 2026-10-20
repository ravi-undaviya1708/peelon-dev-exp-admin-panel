import { lazy } from "react";
import {
  customerPathConstants,
} from "../constants/pathConstants";
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
export const customerRoutes = [
  {
    path: customerPathConstants.DASHBOARD,
    element: <SuperAdminDashboard />,
  },
  {
    path: customerPathConstants.EDITPROFILE,
    element: <EditProfile />,
  },

  {
    path: customerPathConstants.LEADS,
    element: <Leads />,
  },

  {
    path: customerPathConstants.LEADDETAILS,
    element: <LeadDetails />,
  },

  {
    path: customerPathConstants.DEALS,
    element: <Deals />,
  },

  {
    path: customerPathConstants.DEALDETAILS,
    element: <DealDetails />,
  },

  {
    path: customerPathConstants.ACTIVITIES,
    element: <Activities />,
  },

  {
    path: customerPathConstants.CONTACTS,
    element: <Contacts />,
  },

  {
    path: customerPathConstants.ADDMANUAL,
    element: <Manual />,
  },

  {
    path: customerPathConstants.EDITMANUAL,
    element: <Manual />,
  },
  {
    path: customerPathConstants.PRICE,
    element: <CalculatePricing />,
  },

  {
    path: customerPathConstants.CONTACTDETAILS,
    element: <ContactDetails />,
  },

  {
    path: customerPathConstants.ORDERS,
    element: <Orders />,
  },
  {
    path: customerPathConstants.ORDERDETAILS,
    element: <OrderDetails />,
  },
  {
    path: customerPathConstants.CUSTOMER,
    element: <Customers />,
  },
  {
    path: customerPathConstants.BULK,
    element: <BulkOrdersRequests />,
  },

  {
    path: customerPathConstants.INVOICEPOANDQUOTE,
    element: <InvoicePoAndQuote />,
  },

  {
    path: customerPathConstants.QUOTATION,
    element: <Quotation />,
  },

  {
    path: customerPathConstants.PURCHARSEORDER,
    element: <Quotation />,
  },

  {
    path: customerPathConstants.INVOICE,
    element: <Quotation />,
  },

  {
    path: customerPathConstants.BLOGS,
    element: <Blogs />,
  },

  {
    path: customerPathConstants.PRODUCTANDINVENTORY,
    element: <ProductAndInventory />,
  },

  {
    path: customerPathConstants.ADDPRODUCT,
    element: <Product />,
  },

  {
    path: customerPathConstants.EDITPRODUCT,
    element: <Product />,
  },

  {
    path: customerPathConstants.ADDINVENTORY,
    element: <Inventory />,
  },

  {
    path: customerPathConstants.EDITINVENTORY,
    element: <Inventory />,
  },

  {
    path: customerPathConstants.PRODUCTDETAIL,
    element: <ProductDetail />,
  },

  {
    path: customerPathConstants.DELIVERIESANDDISPATCH,
    element: <DeliveriesAndDispatch />,
  },

  {
    path: customerPathConstants.EDITDELIVERIESANDDISPATCH,
    element: <EditDeliveriesAndDispatch />,
  },

  {
    path: customerPathConstants.QUALITYCONTROL,
    element: <QualityControl />,
  },

  {
    path: customerPathConstants.WAREHOUSE,
    element: <WareHouse />,
  },

  {
    path: customerPathConstants.ACCOUNTS,
    element: <Accounts />,
  },

  {
    path: customerPathConstants.EDITSALESREPRESENTATIVE,
    element: <EditSalesRepresentative />,
  },
  {
    path: customerPathConstants.ADDSALESREPRESENTATIVE,
    element: <AddSalesRepresentative />,
  },
];
