import { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import TokenExpirationWrapper from "../utils/TokenExpirationWrapper";
import { PublicRoute } from "../utils/PublicRoute";
import ProtectedRoute from "../utils/ProtectedRoute";
const Logout = lazy(() => import("../authentication/logout"));
import SuperAdminLayout from "../layout/SuperAdminLayout";
import { superAdminRoutes } from "./SuperAdminRoutes";
import {
  accountsPathConstants,
  customerPathConstants,
  deliveryDispatchPathConstants,
  factoryPathConstants,
  salesRepresentativePathConstants,
  superAdminPathConstants,
  warehouseManagerPathConstants,
} from "../constants/pathConstants";
import { factoryRoutes } from "./FactoryRoutes";
import { salesRepresentativeRoute } from "./SalesRepresentativeRoute";
import { deliveryDispatchRoutes } from "./DeliveryAndDispatch";
import { warehouseManagerRoutes } from "./WarehouseManagerRoutes";
import { accountsRoutes } from "./AccountsRoutes";
import { customerRoutes } from "./CustomerRoutes";
const PageNotFound = lazy(() =>
  import("../pages/superAdmin/pagenotfound/PageNotFound")
);
const Login = lazy(() => import("../authentication/login"));

const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={null}>
        <TokenExpirationWrapper>
          <Outlet />
        </TokenExpirationWrapper>
      </Suspense>
    ),
    children: [
      {
        path: "/",
        element: <Navigate to="/login" replace />,
      },
      {
        path: "/login",
        element: <PublicRoute element={<Login />} />,
      },
      {
        path: "/logout",
        element: <PublicRoute element={<Logout />} />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },

      {
        path: "/not-found",
        element: <PageNotFound />,
      },

      {
        path: superAdminPathConstants.DEFAULT,
        element: <ProtectedRoute element={<SuperAdminLayout />} />,
        children: superAdminRoutes,
      },
      {
        path: deliveryDispatchPathConstants.DEFAULT,
        element: <ProtectedRoute element={<SuperAdminLayout />} />,
        children: deliveryDispatchRoutes,
      },
      {
        path: warehouseManagerPathConstants.DEFAULT,
        element: <ProtectedRoute element={<SuperAdminLayout />} />,
        children: warehouseManagerRoutes,
      },
      {
        path: accountsPathConstants.DEFAULT,
        element: <ProtectedRoute element={<SuperAdminLayout />} />,
        children: accountsRoutes,
      },
      {
        path: customerPathConstants.DEFAULT,
        element: <ProtectedRoute element={<SuperAdminLayout />} />,
        children: customerRoutes,
      },
      {
        path: factoryPathConstants.DEFAULT,
        element: <ProtectedRoute element={<SuperAdminLayout />} />,
        children: factoryRoutes,
      },

      {
        path: salesRepresentativePathConstants.DEFAULT,
        element: <ProtectedRoute element={<SuperAdminLayout />} />,
        children: salesRepresentativeRoute,
      },
    ],
  },
]);

export const RoutingLayout = () => {
  return <RouterProvider router={router} />;
};
