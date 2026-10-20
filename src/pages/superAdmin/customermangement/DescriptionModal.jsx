import React from 'react'
import { useDisclosure } from '@mantine/hooks';
import { Box,Link } from '@mui/material';
import StyledModal from '../../../components/StyledModal';

const DescriptionModal = ({ row }) => {
    const [opened, { open, close }] = useDisclosure()

    return (
        <>
            <Link onClick={open} sx={{color:"#23A75B", textDecoration:"underline",cursor:"pointer"}}>View Description</Link>
            {opened && (
                <StyledModal opened={opened} onClose={close} buttonCancel={"Okay"} title={"Description"}>
                    <Box sx={{display:"flex",alignItems:"center",textTransform:"capitalize"}}>
                        {row?.description}
                    </Box>
                </StyledModal>
            )}
        </>
    );
};

export default DescriptionModal