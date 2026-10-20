import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { BsFilePdf, BsFileEarmarkImage, BsFileEarmark } from "react-icons/bs";

export const getFilePreview = (url, fileName = "") => {
    if (!url) return null;

    const extension = url.split(".").pop().toLowerCase();
    const fileDisplayName = fileName || url.split("/").pop();

    const baseBoxStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 128, // 32 * 4
        // backgroundColor: "#f3f4f6", 
        // borderRadius: 8,
        // border: "1px solid #e5e7eb",
        p: 1,
    };

    const clickableWrapper = (content) => (
        <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            download={fileDisplayName}
            underline="none"
            sx={{ display: "block", width: "100%", color:"green" }}
        >
            {content}
        </Link>
    );

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
        return clickableWrapper(
            <Box textAlign="center">
                <Box
                    component="img"
                    src={url}
                    alt={fileDisplayName}
                    sx={{
                        width: "100%",
                        height: 128,
                        objectFit: "contain",
                        borderRadius: 1,
                    }}
                />
                <Typography
                    variant="body2"
                    sx={{ textAlign: "center", mt: 0.5 }}
                    noWrap
                >
                    {fileDisplayName}
                </Typography>
            </Box>
        );
    }

    if (extension === "pdf") {
        return clickableWrapper(
            <Box sx={baseBoxStyle}>
                <BsFilePdf size={40} color="red" />
                <Typography
                    variant="caption"
                    sx={{ textAlign: "center", mt: 0.5 }}
                    noWrap
                >
                    {fileDisplayName}
                </Typography>
            </Box>
        );
    }

    

    if (["doc", "docx", "txt", "xls", "xlsx"].includes(extension)) {
        return clickableWrapper(
            <Box sx={baseBoxStyle}>
                <BsFileEarmark size={40} color="#6b7280" />
                <Typography
                    variant="caption"
                    sx={{ textAlign: "center", mt: 0.5 }}
                    noWrap
                >
                    {fileDisplayName}
                </Typography>
            </Box>
        );
    }

    // fallback
    return clickableWrapper(
        <Box sx={baseBoxStyle}>
            <BsFileEarmark size={40} color="#6b7280" />
            <Typography
                variant="caption"
                sx={{ textAlign: "center", mt: 0.5 }}
                noWrap
            >
                {fileDisplayName}
            </Typography>
        </Box>
    );
};
