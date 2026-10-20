import { Drawer, Modal } from "@mantine/core";
import { OutlinedAddButton, PrimaryButton } from "./StyledButtons";
import { StyledCircularProgress } from "./StyleCircularProgrerss";
import { Box, Typography } from "@mui/material";

const StyledModal = ({isDirty=false, opened, onClose, title, children, size = "xl", isSubmitting, buttonText, formProps = {},maxHeight, buttonCancel = "cancel" }) => {

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            trapFocus={false}
            title={                    
                  <Typography sx={{fontSize:"20px",fontWeight:600,color:"#666666"}}>
                    {title}
                  </Typography>
            }
            size={size}
            centered
            styles={{
                content: {
                    border: "20px solid #A5A5A5",
                    borderRadius: "10px",
                    padding: 0,
                    scrollbarWidth:"none",
                    // maxHeight :maxHeight,
                    // overflowY:"scroll"
                },
            }}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            
        >
            <form
                {...formProps}
                style={{
                    borderRadius: "0 0 10px 10px",
                    overflow: "hidden",
                    padding: "20px",
                    margin: "-13px",
                    background: "white",
                }}
            >
                {children}

                <Box sx={{ display: "flex", placeSelf: "center" }} gap={2}>
                    {buttonCancel && (
                        <Box>
                            <OutlinedAddButton sx={{ mt: 2 }} type="button" onClick={onClose}>
                                {buttonCancel}
                                {isSubmitting && (
                                    <StyledCircularProgress />
                                )}
                            </OutlinedAddButton>
                        </Box>
                    )}
                    {buttonText && (
                        <Box>
                            <PrimaryButton sx={{ mt: 2 }} type="submit" disabled={isSubmitting||isDirty}>
                                {buttonText}
                                {isSubmitting && (
                                    <StyledCircularProgress />
                                )}
                            </PrimaryButton>
                        </Box>
                    )}
                </Box>
            </form>
        </Modal>
    );
};

export default StyledModal;
