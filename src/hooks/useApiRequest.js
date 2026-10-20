import { useState } from "react";
import { postApi, putApi, deleteApi, filePutApi, filePostApi } from "./apiLogic";

const useApiRequest = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const post = async (url, payload = {}) => {
        setError(null);
        setData(null);

        const response = await postApi(url, payload);
        //console.log(response);

        if (response.settings.success) {
            setData(response.data);
            return response;
        } else {
            setError(response.error);
            return response;
        }
    };

    const put = async (url, payload = {}) => {
        setError(null);
        setData(null);
        const response = await putApi(url, payload);
        //console.log("from useAPI", response);
        if (response.settings.success) {
            setData(response.data);
            return response;
        } else {
            setError(response.error);
            return response;
        }
    };

    const filePost = async (url, payload = {}) => {
        setError(null);
        setData(null);
        const response = await filePostApi(url, payload);
        //console.log("from useAPI", response);
        if (response.settings.success) {
            setData(response.data);
            return response;
        } else {
            setError(response.error);
            return response;
        }
    };

    const filePut = async (url, payload = {}, files) => {
        setError(null);
        setData(null);
        const response = await filePutApi(url, payload, files);
        //console.log("from useAPI", response);
        if (response.settings.success) {
            setData(response.data);
            return response;
        } else {
            setError(response.error);
            return response;
        }
    };

    const deleterequest = async (url, payload = {}) => {
        setError(null);
        setData(null);
        const response = await deleteApi(url, payload);
        if (response.settings.success) {
            setData(response.data);
            return response;
        }
        else {
            setError(response.error);
            return response
        }
    }

    return { data, error, post, put, deleterequest, filePost, filePut };
};


export default useApiRequest;