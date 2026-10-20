import React from 'react'
import StyledModal from '../../../../components/StyledModal'
import { useDisclosure } from '@mantine/hooks';
import { Box,Link } from '@mui/material';

const LocationModal = ({ row }) => {
    const [opened, { open, close }] = useDisclosure()

    return (
        <>
            <Link onClick={open} sx={{color:"#23A75B", textDecoration:"underline",cursor:"pointer"}}>View</Link>
            {opened && (
                <StyledModal opened={opened} onClose={close} buttonCancel={"Okay"} title={"Location"}>
                    <Box sx={{display:"flex",alignItems:"center", maxHeight:"300px",overflowY:"scroll", scrollbarWidth:"none"}}>
                        {row?.location}
                    </Box>
                </StyledModal>
            )}
        </>
    );
};
export default LocationModal;

