import { useDisclosure } from "@mantine/hooks";
import { Box,Link} from "@mui/material";
import StyledModal from "../../../../components/StyledModal";

const SummaryModal = ({ row }) => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Link
        onClick={open}
        style={{ color: "#23A75B", cursor: "pointer",textDecoration:"underline" }}
      >
        View Summary
      </Link>
      
      {opened && (
        <StyledModal opened={opened} onClose={close} buttonCancel={"Okay"}title={"Summary"} >
          <Box sx={{ display: "flex", alignItems: "center", maxHeight:"300px",overflowY:"scroll", scrollbarWidth:"none"}}>
            {row?.summary||row}
          </Box>
        </StyledModal>
      )}
    </>
  );
};

export default SummaryModal;
