import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { checkTokenExpiration } from "./TokenExpiration";
import { logoutAuth } from "../redux/features/auth/authSlice";

export const useTokenExpiration = () => {
    const { accessToken } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (accessToken && checkTokenExpiration(accessToken)) {
            dispatch(logoutAuth());
            toast.error("Your session has expired. Please log in again.");
            navigate("/login", { replace: true });
        }

        const interval = setInterval(() => {
            if (accessToken && checkTokenExpiration(accessToken)) {
                dispatch(logoutAuth());
                toast.error("Your session has expired. Please log in again.");
                navigate("/login", { replace: true });
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [accessToken, dispatch, navigate]);
};