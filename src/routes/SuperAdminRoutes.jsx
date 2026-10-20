import { lazy } from "react";
import { superAdminPathConstants } from "../constants/pathConstants";
import EditProfile from "../pages/superAdmin/profile/EditProfile";
import AddSalesRepresentative from "../pages/superAdmin/salesrepresentative/AddSalesRepresentative";
const ContactDetails = lazy(() => import("../pages/superAdmin/contacts/ContactDetails"));
const OrderDetails = lazy(() => import("../pages/superAdmin/orders/OrderDetails"));
const SuperAdminDashboard = lazy(() => import("../pages/superAdmin/superAdminDashboard/SuperAdminDashboard"));
const Leads = lazy(() => import("../pages/superAdmin/Leads/Leads"));
const LeadDetails = lazy(() => import("../pages/superAdmin/Leads/LeadDetails"))
const Deals = lazy(() => import("../pages/superAdmin/deals/Deals"));
const DealDetails = lazy(() => import("../pages/superAdmin/deals/DealDetails"));
const Activities = lazy(() => import("../pages/superAdmin/activities/Activities"));
const CalculatePricing = lazy(() => import("../pages/superAdmin/calculatepricing/CalculatePricing"));
const Orders = lazy(() => import("../pages/superAdmin/orders/Orders"));
const InvoicePoAndQuote = lazy(() => import("../pages/superAdmin/Invoicepoandquote/InvoicePoAndQuote"));
const Quotation = lazy(() => import("../pages/superAdmin/Invoicepoandquote/Quotation"))
const Contacts = lazy(() => import("../pages/superAdmin/contacts/Contacts"));
const Manual = lazy(() => import("../pages/superAdmin/contacts/Manual"));
const Blogs = lazy(() => import("../pages/superAdmin/blogs/Blogs"));
const ProductAndInventory = lazy(() => import("../pages/superAdmin/productandinventory/ProductAndInventory"));
const Product = lazy(() => import("../pages/superAdmin/productandinventory/Product"));
const Inventory = lazy(() => import("../pages/superAdmin/productandinventory/Inventory"));
const ProductDetail = lazy(() => import("../pages/superAdmin/productandinventory/ProductDetail"));
const DeliveriesAndDispatch = lazy(() => import("../pages/superAdmin/deliveriesanddispatch/DeliveriesAndDispatch"));
const QualityControl = lazy(() => import("../pages/superAdmin/qualitycontrol/QualityControl"));
const EditDeliveriesAndDispatch = lazy(() => import("../pages/superAdmin/deliveriesanddispatch/EditDeliveriesAndDispatch"));
const WareHouse = lazy(() => import("../pages/superAdmin/warehouse/WareHouse"));
const Accounts = lazy(() => import("../pages/superAdmin/accounts/Accounts"));
const EditSalesRepresentative = lazy(() => import("../pages/superAdmin/salesrepresentative/EditSalesRepresentative"));
const Customers = lazy(() => import("../pages/superAdmin/customermangement/Customers"));
const BulkOrdersRequests = lazy(() => import("../pages/superAdmin/customermangement/BulkOrdersRequests"));

// Use RELATIVE paths for child routes (not absolute like "/dashboard")
export const superAdminRoutes = [
  {
    path: superAdminPathConstants.DASHBOARD,
    element: <SuperAdminDashboard />
  },
  {
    path: superAdminPathConstants.EDITPROFILE,
    element: <EditProfile />
  },

  {
    path: superAdminPathConstants.LEADS,
    element: <Leads />
  },

  {
    path: superAdminPathConstants.LEADDETAILS,
    element: <LeadDetails />
  },

  {
    path: superAdminPathConstants.DEALS,
    element: <Deals />
  },

  {
    path: superAdminPathConstants.DEALDETAILS,
    element: <DealDetails />
  },

  {
    path: superAdminPathConstants.ACTIVITIES,
    element: <Activities />
  },

  {
    path: superAdminPathConstants.CONTACTS,
    element: <Contacts />
  },

  {
    path: superAdminPathConstants.ADDMANUAL,
    element: <Manual />
  },

  {
    path: superAdminPathConstants.EDITMANUAL,
    element: <Manual />
  },
  {
    path: superAdminPathConstants.PRICE,
    element: <CalculatePricing />
  },

  {
    path: superAdminPathConstants.CONTACTDETAILS,
    element: <ContactDetails />
  },

  {
    path: superAdminPathConstants.ORDERS,
    element: <Orders />
  },
  {
    path: superAdminPathConstants.ORDERDETAILS,
    element: <OrderDetails />
  },
  {
    path: superAdminPathConstants.CUSTOMER,
    element: <Customers />
  },
  {
    path: superAdminPathConstants.BULK,
    element: <BulkOrdersRequests />
  },

  {
    path: superAdminPathConstants.INVOICEPOANDQUOTE,
    element: <InvoicePoAndQuote />
  },

  {
    path: superAdminPathConstants.QUOTATION,
    element: <Quotation />
  },

  {
    path: superAdminPathConstants.PURCHARSEORDER,
    element: <Quotation />
  },

  {
    path: superAdminPathConstants.INVOICE,
    element: <Quotation />
  },

  {
    path: superAdminPathConstants.BLOGS,
    element: <Blogs />
  },

  {
    path: superAdminPathConstants.PRODUCTANDINVENTORY,
    element: <ProductAndInventory />
  },


  {
    path: superAdminPathConstants.ADDPRODUCT,
    element: <Product />
  },

  {
    path: superAdminPathConstants.EDITPRODUCT,
    element: <Product />
  },

  {
    path: superAdminPathConstants.ADDINVENTORY,
    element: <Inventory />
  },

  {
    path: superAdminPathConstants.EDITINVENTORY,
    element: <Inventory />
  },


  {
    path: superAdminPathConstants.PRODUCTDETAIL,
    element: <ProductDetail />
  },

  {
    path: superAdminPathConstants.DELIVERIESANDDISPATCH,
    element: <DeliveriesAndDispatch />
  },

  {
    path: superAdminPathConstants.EDITDELIVERIESANDDISPATCH,
    element: <EditDeliveriesAndDispatch />
  },

  {
    path: superAdminPathConstants.QUALITYCONTROL,
    element: <QualityControl />
  },

  {
    path: superAdminPathConstants.WAREHOUSE,
    element: <WareHouse />
  },

  {
    path: superAdminPathConstants.ACCOUNTS,
    element: <Accounts />
  },

  {
    path: superAdminPathConstants.EDITSALESREPRESENTATIVE,
    element: <EditSalesRepresentative />
  },
  {
    path: superAdminPathConstants.ADDSALESREPRESENTATIVE,
    element: <AddSalesRepresentative />
  }
]
