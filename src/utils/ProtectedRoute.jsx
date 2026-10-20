import React, { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  superAdminPathConstants,
  factoryPathConstants,
  salesRepresentativePathConstants,
  deliveryDispatchPathConstants,
  warehouseManagerPathConstants,
  accountsPathConstants,
  customerPathConstants,
} from "../constants/pathConstants";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, accessToken, userType } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/logout" replace />;
  }

  const currentPath = window.location.pathname;

  const allowedPaths = {
    "Super Admin": superAdminPathConstants.DEFAULT,
    "Factory Operation": factoryPathConstants.DEFAULT,
    "Sales Representative": salesRepresentativePathConstants.DEFAULT,
    "Delivery & Dispatch": deliveryDispatchPathConstants.DEFAULT,
    "Warehouse Manager": warehouseManagerPathConstants.DEFAULT,
    "Accounts": accountsPathConstants.DEFAULT,
    "Customer": customerPathConstants.DEFAULT,
  };

  const allowedBasePath = allowedPaths[userType];
  // console.log(allowedBasePath,currentPath,"allowed");

  const isAllowedPath = currentPath.startsWith(allowedBasePath);

  if (!isAllowedPath) {
    // console.log("notallowedpath");
    return (
      <Navigate to="/not-found" replace state={{ reason: "unauthorized" }} />
    );
  }

  if (React.isValidElement(element)) {
    return <Suspense fallback={null}>{element}</Suspense>;
  }

  return <Outlet />;
};

export default ProtectedRoute;
