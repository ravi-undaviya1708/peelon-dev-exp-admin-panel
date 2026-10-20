import React from 'react'
import StyledModal from '../../../../components/StyledModal'
import { useDisclosure } from '@mantine/hooks';
import { Box,Link } from '@mui/material';

const SummaryModal = ({ row }) => {
    const [opened, { open, close }] = useDisclosure()

    return (
        <>
            <Link onClick={open} sx={{color:"#23A75B", textDecoration:"underline",cursor:"pointer"}}>View Summary</Link>
            {opened && (
                <StyledModal opened={opened} onClose={close} buttonCancel={"Okay"} title={"Summary"} >
                    <Box sx={{display:"flex",alignItems:"center", maxHeight:"300px",overflowY:"scroll", scrollbarWidth:"none"}}>
                        {row?.summary}
                    </Box>
                </StyledModal>
            )}
        </>
    );
};

export default SummaryModal;
