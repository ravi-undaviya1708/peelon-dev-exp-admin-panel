import { Box } from '@mui/system';
import StyledModal from './StyledModal';
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react';
import { Typography } from '@mui/material';

function ExpandableImageStack({ images }) {
    const [opened, { open: expandableOpen, close: expandableClose }] = useDisclosure(false);
    const [hovered, setHovered] = useState(false);

    return (
        <>
                <StyledModal opened={opened} onClose={expandableClose} centered size="lg" title="Images" buttonCancel="Okay">
                    <Box sx={{ display: 'flex', gap: 5,overflowX:"auto",scrollbarWidth:"none"}}>
                        {images.map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt={`image-${index}`}
                                style={{
                                    width: 100,
                                    height: 100,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                                }}
                                onError={(e) => {
                                   e.target.onerror = null;
                                }}
                            />
                        ))}
                    </Box>
                </StyledModal>
                <div
                    style={{
                        position: "relative",
                        width: 150,
                        height: 100,
                        cursor: "pointer",
                        zIndex: 0,
                    }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={() => {
                        setTimeout(() => {
                            expandableOpen();   // ✅ safe now
                            setHovered(false);
                        }, 0);
                    }}

                >
                    {images.map((src, index) => {
                        const bottom = hovered ? `${index * 10}px` : `${index * 10}px`;
                        const right = hovered ? `${index * 25}px` : `${index * 15}px`;
                        return (
                            <img
                                key={index}
                                src={src}
                                alt={`layer-${index}`}
                                style={{
                                    backgroundColor: "white",
                                    position: "absolute",
                                    bottom,
                                    right,
                                    width: "35%",
                                    height: "50%",
                                    objectFit: "cover",
                                    zIndex: index + 1,
                                    borderRadius: 8,
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                                    transition: "all 0.2s ease",
                                }}
                            />
                        );
                    })}
                </div>
         
        </>
    )
}

export default ExpandableImageStack