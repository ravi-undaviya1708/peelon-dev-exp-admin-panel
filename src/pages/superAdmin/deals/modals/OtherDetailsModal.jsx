import React from "react";
import StyledModal from "../../../../components/StyledModal";
import { useDisclosure } from "@mantine/hooks";
import { Box, Link } from "@mui/material";

const OtherDetailModal = ({ row }) => {
  const [opened, { open, close }] = useDisclosure();

  return (
    <>
      <Link
        onClick={open}
        sx={{
          color: "#23A75B",
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        View other detail
      </Link>
      {opened && (
        <StyledModal
          opened={opened}
          onClose={close}
          buttonCancel={"Okay"}
          title={"Other Detail"}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              maxHeight: "300px",
              overflowY: "scroll",
              scrollbarWidth: "none",
            }}
          >
            {row}
          </Box>
        </StyledModal>
      )}
    </>
  );
};

export default OtherDetailModal;
