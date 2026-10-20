
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { superAdminPathConstants, factoryPathConstants, salesRepresentativePathConstants } from "../constants/pathConstants";

export const PublicRoute = ({ element }) => {
  const { isAuthenticated, accessToken, userType } = useSelector((state) => state.auth);

  if (isAuthenticated && accessToken) {
    if (userType === "Super Admin") {
      return <Navigate to={`${superAdminPathConstants.DEFAULT}/${superAdminPathConstants.DASHBOARD}`} replace />
    }
    if (userType === "Factory Operation") {
      return <Navigate to={`${factoryPathConstants.DEFAULT}/${factoryPathConstants.DASHBOARD}`} replace />

    }
    if (userType === "Sales Representative") {
      return <Navigate to={`${salesRepresentativePathConstants.DEFAULT}/${salesRepresentativePathConstants.DASHBOARD}`} replace />

    }
  }

  return element || <Outlet />;
};
