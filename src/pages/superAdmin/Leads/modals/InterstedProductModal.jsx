import React from 'react'
import StyledModal from '../../../../components/StyledModal'
import { useDisclosure } from '@mantine/hooks';
import { Box, Link } from '@mui/material';
import { StyledInterstedProducts } from '../../../../components/StyledText';

const InterstedProductModal = ({ row }) => {
    const [opened, { open, close }] = useDisclosure()

    return (
        <>
            <Link onClick={open} sx={{ color: "#23A75B",textDecoration: "underline", cursor: "pointer" }}>view</Link>
            {opened && (
                <StyledModal opened={opened} onClose={close} buttonCancel={"Okay"} title={"Interested Products"} >
                    <Box sx={{ display: "flex", maxHeight:"300px",overflowY:"scroll", scrollbarWidth:"none"}}>
                        {row?.interested_product.map((item, index) => (
                            <StyledInterstedProducts key={index} sx={{mr:1}}>
                                {item?.name}  
                            </StyledInterstedProducts>
                        )
                        )}
                    </Box>
                </StyledModal>
            )}
        </>
    );
};

export default InterstedProductModal;
