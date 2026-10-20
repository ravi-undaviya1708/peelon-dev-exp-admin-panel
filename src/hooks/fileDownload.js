import { toast } from "react-toastify";
import apiClient from "../services/interceptors/Interceptor";

export const fileDownload = async (path) => {
    try {
        const response = await apiClient.get(path, {
            responseType: "blob", // This is correct
        });

        const blob = new Blob([response.data], {
            type: "application/pdf", // correct MIME type
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        // Set correct file name and extension
        a.download = "documents.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Show toast based on actual success (this part depends on your backend)
        toast.success("PDF file downloaded successfully!");
    } catch (error) {
        toast.error(error?.response?.data?.error || "Failed to download File ");
        // console.log("Download PDF error:", error);
    }

    //  catch (error) {
    //     console.log(error);

    //     if (error?.response?.data instanceof Blob) {
    //         // Try to read the Blob as text and parse it
    //         error.response.data.text().then(text => {
    //             try {
    //                 const parsed = JSON.parse(text);
    //                 toast.error(parsed?.errors || parsed?.message || "Failed to download Excel file");
    //             } catch (e) {
    //                 toast.error("Failed to download Excel file");
    //             }
    //         });
    //     } else {
    //         toast.error(error?.response?.data?.errors || "Failed to download Excel file");
    //     }
    // }
};
