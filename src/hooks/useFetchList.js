         import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchList } from "./apiLogic";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../redux/features/loader/loaderSlice";

const useFetchList = (url, params = { page: 1 }, enabled = true, options = { showLoader: true }) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const[response,setResponse]=useState([])
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({});

    const stableParams = useMemo(() => {
        if (!params) return { page: 1 };
        return { page: params.page || 1, ...params };
    }, [JSON.stringify(params)]);

    const fetchData = useCallback(async () => {
        const shouldShowLoader = options?.showLoader;
        if (shouldShowLoader) dispatch(showLoader());
        //console.log("Fetching:", url, stableParams);
        setError(null);
        try {
            const response = await fetchList(url, stableParams);
            setData(response.data);
            setPagination(response.settings);
            setResponse(response);

        } catch (err) {
            //console.log(`failed while fetching from ${url}`, err);
            setError(err.message || "Failed to fetch data");
            setData([]);
        }
        finally {
            if (shouldShowLoader) {
                setTimeout(() => {
                    dispatch(hideLoader());
                }, 3);
            }
        }

    }, [url, stableParams]);

    useEffect(() => {
        if (url && enabled) {
            fetchData();
        }
    }, [fetchData, enabled]);

    const refetch = useCallback(() => {
        if (url) {
            fetchData();
        }
    }, [fetchData]);

    return { data, error, pagination, refetch,response };
};

export default useFetchList;
