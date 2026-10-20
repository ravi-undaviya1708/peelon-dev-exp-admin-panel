import { useDisclosure } from "@mantine/hooks";
import { Box, Link } from "@mui/material";
import StyledModal from "../../../../components/StyledModal";

const AddressModal = ({ row, heading }) => {
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
        <StyledModal opened={opened} onClose={close} buttonCancel={"Okay"} title={heading} >
          <Box sx={{ display: "flex", alignItems: "center", maxHeight: "300px", overflowY: "scroll", scrollbarWidth: "none" }}>
            {row}
          </Box>
        </StyledModal>
      )}
    </>
  );
};

export default AddressModal;
