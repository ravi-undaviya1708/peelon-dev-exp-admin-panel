import { lazy } from "react";
import { accountsPathConstants } from "../constants/pathConstants";
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
export const accountsRoutes = [
  {
    path: accountsPathConstants.DASHBOARD,
    element: <SuperAdminDashboard />,
  },
  {
    path: accountsPathConstants.EDITPROFILE,
    element: <EditProfile />,
  },

  {
    path: accountsPathConstants.LEADS,
    element: <Leads />,
  },

  {
    path: accountsPathConstants.LEADDETAILS,
    element: <LeadDetails />,
  },

  {
    path: accountsPathConstants.DEALS,
    element: <Deals />,
  },

  {
    path: accountsPathConstants.DEALDETAILS,
    element: <DealDetails />,
  },

  {
    path: accountsPathConstants.ACTIVITIES,
    element: <Activities />,
  },

  {
    path: accountsPathConstants.CONTACTS,
    element: <Contacts />,
  },

  {
    path: accountsPathConstants.ADDMANUAL,
    element: <Manual />,
  },

  {
    path: accountsPathConstants.EDITMANUAL,
    element: <Manual />,
  },
  {
    path: accountsPathConstants.PRICE,
    element: <CalculatePricing />,
  },

  {
    path: accountsPathConstants.CONTACTDETAILS,
    element: <ContactDetails />,
  },

  {
    path: accountsPathConstants.ORDERS,
    element: <Orders />,
  },
  {
    path: accountsPathConstants.ORDERDETAILS,
    element: <OrderDetails />,
  },
  {
    path: accountsPathConstants.CUSTOMER,
    element: <Customers />,
  },
  {
    path: accountsPathConstants.BULK,
    element: <BulkOrdersRequests />,
  },

  {
    path: accountsPathConstants.INVOICEPOANDQUOTE,
    element: <InvoicePoAndQuote />,
  },

  {
    path: accountsPathConstants.QUOTATION,
    element: <Quotation />,
  },

  {
    path: accountsPathConstants.PURCHARSEORDER,
    element: <Quotation />,
  },

  {
    path: accountsPathConstants.INVOICE,
    element: <Quotation />,
  },

  {
    path: accountsPathConstants.BLOGS,
    element: <Blogs />,
  },

  {
    path: accountsPathConstants.PRODUCTANDINVENTORY,
    element: <ProductAndInventory />,
  },

  {
    path: accountsPathConstants.ADDPRODUCT,
    element: <Product />,
  },

  {
    path: accountsPathConstants.EDITPRODUCT,
    element: <Product />,
  },

  {
    path: accountsPathConstants.ADDINVENTORY,
    element: <Inventory />,
  },

  {
    path: accountsPathConstants.EDITINVENTORY,
    element: <Inventory />,
  },

  {
    path: accountsPathConstants.PRODUCTDETAIL,
    element: <ProductDetail />,
  },

  {
    path: accountsPathConstants.DELIVERIESANDDISPATCH,
    element: <DeliveriesAndDispatch />,
  },

  {
    path: accountsPathConstants.EDITDELIVERIESANDDISPATCH,
    element: <EditDeliveriesAndDispatch />,
  },

  {
    path: accountsPathConstants.QUALITYCONTROL,
    element: <QualityControl />,
  },

  {
    path: accountsPathConstants.WAREHOUSE,
    element: <WareHouse />,
  },

  {
    path: accountsPathConstants.ACCOUNTS,
    element: <Accounts />,
  },

  {
    path: accountsPathConstants.EDITSALESREPRESENTATIVE,
    element: <EditSalesRepresentative />,
  },
  {
    path: accountsPathConstants.ADDSALESREPRESENTATIVE,
    element: <AddSalesRepresentative />,
  },
];
