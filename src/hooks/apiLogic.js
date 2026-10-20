import Swal from "sweetalert2";
import apiClient from "../services/interceptors/Interceptor";
import { colors } from "../constants/constants";
import { blobConversion } from "./blobConversion";

export const postApi = async (url, payload = {}) => {
    try {
        const response = await apiClient.post(url, payload);
        return response.data;
    } catch (error) {
        console.error("error while posting", error);
    }
};

export const putApi = async (url, payload = {}) => {
    try {
        const response = await apiClient.put(url, payload);
        return response.data;
    } catch (error) {
        console.error(`Error in PUT request to ${url}:`, error);
        return {
            success: false,
            error: error.response?.data?.message || error.message || "PUT request failed",
        };
    }
};

export const filePostApi = async (url, payload = {}) => {
    console.log("payload", payload);

    try {
        const formData = new FormData();
        for (let field in payload) {
            let value = payload[field];

            if (Array.isArray(value) && value.length === 0) {
                continue;
            }
            if (value === "" || value === undefined || value === null) {
                continue;
            }

            formData.append(field, value);
        }
        const response = await apiClient.post(url, formData)
        return response.data
    }
    catch (error) {
        console.error("error while File POST", error);
        return {
            success: false,
            error: error.response?.data?.message || error.message || " File POST request failed",
        }
    }
}


export const filePutApi = async (url, payload = {}, files) => {
    try {
        const formData = new FormData();
        for (let field in payload) {
            let value = payload[field];
            if (files.includes(field)) continue

            if (Array.isArray(value) && value.length === 0) {
                continue;
            }
            if (value === "" || value === undefined || value === null) {
                continue;
            }

            formData.append(field, value);

        }
        const imageData = {};
        for (let field of files) {
            imageData[field] = payload[field];
        }

        const imageConversionData = await blobConversion(imageData);
        //console.log("imagec", imageConversionData);

        // for (const field in imageConversionData) {
        //     const { blob, fileName } = imageConversionData[field];
        //     formData.append(field, blob, fileName);
        // }

        for (const field in imageConversionData) {
            const fileData = imageConversionData[field];
            if (fileData) {
                const { blob, fileName } = fileData;
                formData.append(field, blob, fileName)
            }
            else {
                formData.append(field, "")

            }

        }
        const response = await apiClient.put(url, formData)
        return response.data
    }
    catch (error) {
        console.error("error while file put", error);
        return {
            success: false,
            error: error.response?.data?.message || error.message || " File PUT request failed",
        }
    }
}

export const deleteApi = async (url, payload = {}) => {
    try {
        const confirmation = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: colors.secondarygreen,
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete it",
            cancelButtonText: "Cancel",
            customClass: {
                popup: "custom-small-popup",
                icon: "custom-icon",
                title: "custom-title",
                confirmButton: "custom-confirm-btn",
                cancelButton: "custom-cancel-btn"
            }
        });
        if (confirmation.isConfirmed) {
            const response = await apiClient.delete(url, payload);
            return response.data;
        }
    } catch (error) {
        console.error("error while deleting", error);
    }
}




export const fetchList = async (url, params = { page: 1 }) => {
    try {
        const options = {
            params: {
                page: params.page || 1, // Default to page 1 if not provided
                ...params, // Spread other parameters
            },
        };
        const response = await apiClient.get(url, options);
        return response.data;
    } catch (err) {
        console.error(`Error fetching from ${url}:`, err);
        return [];
    }
};

export const fetchDropdown = async (
    url,
    labelKey = "manager_name",
    valueKey = "manager_id",
    params = {},
) => {
    try {
        const options = {
            params: {
                ...params,
            },
        };
        const res = await apiClient.get(url, options);

        const rawList = Array.isArray(res?.data?.data)
            ? res.data.data
            : Array.isArray(res?.data?.data?.results)
            ? res.data.data.results
            : Array.isArray(res?.data?.results)
            ? res.data.results
            : Array.isArray(res?.data)
            ? res.data
            : [];

        return rawList.map((item) => ({
            value: item[valueKey],
            label: item[labelKey],
        }));
    } catch (err) {
        console.error(`Error fetching from ${url}:`, err);
        return [];
    }
};
