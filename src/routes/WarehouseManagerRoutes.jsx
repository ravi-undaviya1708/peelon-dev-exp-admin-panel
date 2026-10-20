import { lazy } from "react";
import {
  warehouseManagerPathConstants,
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
export const warehouseManagerRoutes = [
  {
    path: warehouseManagerPathConstants.DASHBOARD,
    element: <SuperAdminDashboard />,
  },
  {
    path: warehouseManagerPathConstants.EDITPROFILE,
    element: <EditProfile />,
  },

  {
    path: warehouseManagerPathConstants.LEADS,
    element: <Leads />,
  },

  {
    path: warehouseManagerPathConstants.LEADDETAILS,
    element: <LeadDetails />,
  },

  {
    path: warehouseManagerPathConstants.DEALS,
    element: <Deals />,
  },

  {
    path: warehouseManagerPathConstants.DEALDETAILS,
    element: <DealDetails />,
  },

  {
    path: warehouseManagerPathConstants.ACTIVITIES,
    element: <Activities />,
  },

  {
    path: warehouseManagerPathConstants.CONTACTS,
    element: <Contacts />,
  },

  {
    path: warehouseManagerPathConstants.ADDMANUAL,
    element: <Manual />,
  },

  {
    path: warehouseManagerPathConstants.EDITMANUAL,
    element: <Manual />,
  },
  {
    path: warehouseManagerPathConstants.PRICE,
    element: <CalculatePricing />,
  },

  {
    path: warehouseManagerPathConstants.CONTACTDETAILS,
    element: <ContactDetails />,
  },

  {
    path: warehouseManagerPathConstants.ORDERS,
    element: <Orders />,
  },
  {
    path: warehouseManagerPathConstants.ORDERDETAILS,
    element: <OrderDetails />,
  },
  {
    path: warehouseManagerPathConstants.CUSTOMER,
    element: <Customers />,
  },
  {
    path: warehouseManagerPathConstants.BULK,
    element: <BulkOrdersRequests />,
  },

  {
    path: warehouseManagerPathConstants.INVOICEPOANDQUOTE,
    element: <InvoicePoAndQuote />,
  },

  {
    path: warehouseManagerPathConstants.QUOTATION,
    element: <Quotation />,
  },

  {
    path: warehouseManagerPathConstants.PURCHARSEORDER,
    element: <Quotation />,
  },

  {
    path: warehouseManagerPathConstants.INVOICE,
    element: <Quotation />,
  },

  {
    path: warehouseManagerPathConstants.BLOGS,
    element: <Blogs />,
  },

  {
    path: warehouseManagerPathConstants.PRODUCTANDINVENTORY,
    element: <ProductAndInventory />,
  },

  {
    path: warehouseManagerPathConstants.ADDPRODUCT,
    element: <Product />,
  },

  {
    path: warehouseManagerPathConstants.EDITPRODUCT,
    element: <Product />,
  },

  {
    path: warehouseManagerPathConstants.ADDINVENTORY,
    element: <Inventory />,
  },

  {
    path: warehouseManagerPathConstants.EDITINVENTORY,
    element: <Inventory />,
  },

  {
    path: warehouseManagerPathConstants.PRODUCTDETAIL,
    element: <ProductDetail />,
  },

  {
    path: warehouseManagerPathConstants.DELIVERIESANDDISPATCH,
    element: <DeliveriesAndDispatch />,
  },

  {
    path: warehouseManagerPathConstants.EDITDELIVERIESANDDISPATCH,
    element: <EditDeliveriesAndDispatch />,
  },

  {
    path: warehouseManagerPathConstants.QUALITYCONTROL,
    element: <QualityControl />,
  },

  {
    path: warehouseManagerPathConstants.WAREHOUSE,
    element: <WareHouse />,
  },

  {
    path: warehouseManagerPathConstants.ACCOUNTS,
    element: <Accounts />,
  },

  {
    path: warehouseManagerPathConstants.EDITSALESREPRESENTATIVE,
    element: <EditSalesRepresentative />,
  },
  {
    path: warehouseManagerPathConstants.ADDSALESREPRESENTATIVE,
    element: <AddSalesRepresentative />,
  },
];
