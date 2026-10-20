import { lazy } from "react";
import { factoryPathConstants } from "../constants/pathConstants";
import EditProfile from "../pages/superAdmin/profile/EditProfile";
const OrderDetails = lazy(() => import("../pages/superAdmin/orders/OrderDetails"));
const SuperAdminDashboard = lazy(() => import("../pages/superAdmin/superAdminDashboard/SuperAdminDashboard"));
const Activities = lazy(() => import("../pages/superAdmin/activities/Activities"));
const Orders = lazy(() => import("../pages/superAdmin/orders/Orders"));
const InvoicePoAndQuote = lazy(() => import("../pages/superAdmin/Invoicepoandquote/InvoicePoAndQuote"));
const Quotation = lazy(() => import("../pages/superAdmin/Invoicepoandquote/Quotation"))
const ProductAndInventory = lazy(() => import("../pages/superAdmin/productandinventory/ProductAndInventory"));
const Product = lazy(() => import("../pages/superAdmin/productandinventory/Product"));
const Inventory = lazy(() => import("../pages/superAdmin/productandinventory/Inventory"));
const ProductDetail = lazy(() => import("../pages/superAdmin/productandinventory/ProductDetail"));
const DeliveriesAndDispatch = lazy(() => import("../pages/superAdmin/deliveriesanddispatch/DeliveriesAndDispatch"));
const QualityControl = lazy(() => import("../pages/superAdmin/qualitycontrol/QualityControl"));
const EditDeliveriesAndDispatch = lazy(() => import("../pages/superAdmin/deliveriesanddispatch/EditDeliveriesAndDispatch"));
const WareHouse = lazy(() => import("../pages/superAdmin/warehouse/WareHouse"));

// Use RELATIVE paths for child routes (not absolute like "/dashboard")
export const factoryRoutes = [
  {
    path: factoryPathConstants.DASHBOARD,
    element: <SuperAdminDashboard />
  },
  {
    path: factoryPathConstants.EDITPROFILE,
    element: <EditProfile />
  },

  {
    path: factoryPathConstants.ACTIVITIES,
    element: <Activities />
  },

  {
    path: factoryPathConstants.ORDERS,
    element: <Orders />
  },
  {
    path: factoryPathConstants.ORDERDETAILS,
    element: <OrderDetails />
  },

  {
    path: factoryPathConstants.INVOICEPOANDQUOTE,
    element: <InvoicePoAndQuote />
  },

  {
    path: factoryPathConstants.QUOTATION,
    element: <Quotation />
  },

  {
    path: factoryPathConstants.PURCHARSEORDER,
    element: <Quotation />
  },

  {
    path: factoryPathConstants.INVOICE,
    element: <Quotation />
  },

  {
    path: factoryPathConstants.PRODUCTANDINVENTORY,
    element: <ProductAndInventory />
  },

  {
    path: factoryPathConstants.ADDPRODUCT,
    element: <Product />
  },

  {
    path: factoryPathConstants.EDITPRODUCT,
    element: <Product />
  },

  {
    path: factoryPathConstants.ADDINVENTORY,
    element: <Inventory />
  },

  {
    path: factoryPathConstants.EDITINVENTORY,
    element: <Inventory />
  },

  {
    path: factoryPathConstants.PRODUCTDETAIL,
    element: <ProductDetail />
  },

  {
    path: factoryPathConstants.DELIVERIESANDDISPATCH,
    element: <DeliveriesAndDispatch />
  },

  {
    path: factoryPathConstants.EDITDELIVERIESANDDISPATCH,
    element: <EditDeliveriesAndDispatch />
  },

  {
    path: factoryPathConstants.QUALITYCONTROL,
    element: <QualityControl />
  },

  {
    path: factoryPathConstants.WAREHOUSE,
    element: <WareHouse />
  },

]
