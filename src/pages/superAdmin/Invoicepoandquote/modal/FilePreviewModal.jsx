import { useDisclosure } from "@mantine/hooks";
import { Box, Link } from "@mui/material";
import StyledModal from "../../../../components/StyledModal";
import { getFilePreview } from "../../../../components/getFilePreview";

const FilePreviewModal = ({ row, heading }) => {
    const [opened, { open, close }] = useDisclosure(false);
    return (
        <>
            <Link
                onClick={open}
                style={{ color: "#23A75B", cursor: "pointer" }}
            >
                View
            </Link>
            {opened && (
                <StyledModal opened={opened} onClose={close} buttonCancel={"Okay"} title={heading} size="sm" >
                    <Box sx={{ display: "flex", alignItems: "center", maxHeight: "300px", overflowY: "scroll", scrollbarWidth: "none" }}>
                        {getFilePreview(row)}
                    </Box>
                </StyledModal>
            )}
        </>
    );
};

export default FilePreviewModal;
