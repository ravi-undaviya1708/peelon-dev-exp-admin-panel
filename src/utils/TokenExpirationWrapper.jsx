import React from "react";
import { useTokenExpiration } from "./useTokenExpiration";

const TokenExpirationWrapper = ({ children }) => {
    useTokenExpiration();
    return <>{children}</>;
};

export default TokenExpirationWrapper;