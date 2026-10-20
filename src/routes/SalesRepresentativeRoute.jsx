import { lazy } from "react";
import { salesRepresentativePathConstants } from "../constants/pathConstants";
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
const Manual = lazy(() => import("../pages/superAdmin/contacts/Manual"))
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
export const salesRepresentativeRoute = [
  {
    path: salesRepresentativePathConstants.DASHBOARD,
    element: <SuperAdminDashboard />
  },
  {
    path: salesRepresentativePathConstants.EDITPROFILE,
    element: <EditProfile />
  },

  {
    path: salesRepresentativePathConstants.LEADS,
    element: <Leads />
  },

  {
    path: salesRepresentativePathConstants.LEADDETAILS,
    element: <LeadDetails />
  },

  {
    path: salesRepresentativePathConstants.DEALS,
    element: <Deals />
  },

  {
    path: salesRepresentativePathConstants.DEALDETAILS,
    element: <DealDetails />
  },

  {
    path: salesRepresentativePathConstants.ACTIVITIES,
    element: <Activities />
  },

  {
    path: salesRepresentativePathConstants.CONTACTS,
    element: <Contacts />
  },

  {
    path: salesRepresentativePathConstants.ADDMANUAL,
    element: <Manual />
  },

  {
    path: salesRepresentativePathConstants.EDITMANUAL,
    element: <Manual />
  },
  {
    path: salesRepresentativePathConstants.PRICE,
    element: <CalculatePricing />
  },

  {
    path: salesRepresentativePathConstants.CONTACTDETAILS,
    element: <ContactDetails />
  },

  {
    path: salesRepresentativePathConstants.ORDERS,
    element: <Orders />
  },
  {
    path: salesRepresentativePathConstants.ORDERDETAILS,
    element: <OrderDetails />
  },
  {
    path: salesRepresentativePathConstants.CUSTOMER,
    element: <Customers />
  },
  {
    path: salesRepresentativePathConstants.BULK,
    element: <BulkOrdersRequests />
  },

  {
    path: salesRepresentativePathConstants.INVOICEPOANDQUOTE,
    element: <InvoicePoAndQuote />
  },

  {
    path: salesRepresentativePathConstants.QUOTATION,
    element: <Quotation />
  },

  {
    path: salesRepresentativePathConstants.PURCHARSEORDER,
    element: <Quotation />
  },

  {
    path: salesRepresentativePathConstants.INVOICE,
    element: <Quotation />
  },

  {
    path: salesRepresentativePathConstants.PRODUCTANDINVENTORY,
    element: <ProductAndInventory />
  },


  {
    path: salesRepresentativePathConstants.ADDPRODUCT,
    element: <Product />
  },

  {
    path: salesRepresentativePathConstants.EDITPRODUCT,
    element: <Product />
  },

  {
    path: salesRepresentativePathConstants.ADDINVENTORY,
    element: <Inventory />
  },

  {
    path: salesRepresentativePathConstants.EDITINVENTORY,
    element: <Inventory />
  },


  {
    path: salesRepresentativePathConstants.PRODUCTDETAIL,
    element: <ProductDetail />
  },

  {
    path: salesRepresentativePathConstants.DELIVERIESANDDISPATCH,
    element: <DeliveriesAndDispatch />
  },

  {
    path: salesRepresentativePathConstants.EDITDELIVERIESANDDISPATCH,
    element: <EditDeliveriesAndDispatch />
  },

  {
    path: salesRepresentativePathConstants.WAREHOUSE,
    element: <WareHouse />
  },

  {
    path: salesRepresentativePathConstants.ACCOUNTS,
    element: <Accounts />
  },

  {
    path: salesRepresentativePathConstants.EDITSALESREPRESENTATIVE,
    element: <EditSalesRepresentative />
  },
  {
    path: salesRepresentativePathConstants.ADDSALESREPRESENTATIVE,
    element: <AddSalesRepresentative />
  }
]
