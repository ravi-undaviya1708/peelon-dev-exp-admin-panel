import { useDisclosure } from "@mantine/hooks";
import { Box } from "@mui/material";
import StyledModal from "../../../../components/StyledModal";
import { Link } from "react-router-dom";

const DescriptionModal = ({ row }) => {
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
                <StyledModal opened={opened} onClose={close} buttonCancel={"Okay"} title={"Description"} maxHeight="500px">
                    <Box sx={{ display: "flex", alignItems: "center", maxHeight: "300px", overflowY: "scroll", scrollbarWidth: "none" }}>
                        {row?.description}
                    </Box>
                </StyledModal>
            )}
        </>
    );
};

export default DescriptionModal;
