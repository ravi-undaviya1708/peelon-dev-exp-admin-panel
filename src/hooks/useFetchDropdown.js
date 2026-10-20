import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchDropdown } from "./apiLogic";

const useFetchDropdown = (url, label, value, params, enabled = true) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    const stableParams = useMemo(() => {
        if (!params) return null;
        return { ...params };
    }, [JSON.stringify(params)]);


   const fetchData = useCallback(async () => {
        setError(null);
        try {
            const response = await fetchDropdown(url, label, value, stableParams);
            setData(response);
        } catch (err) {
            //console.log(`failed while fetching from ${url}, err`);
            setData([]);
        }
    },[url,stableParams]);

    useEffect(() => {
        if (url && enabled) {
            fetchData();
        }

    }, [url, stableParams, enabled]);

    const refetch = useCallback(() => {
        if (url) {
            fetchData();
        }
    }, [fetchData]);

    return { data, error, refetch };
};

export default useFetchDropdown;
