import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { Box, Link, Card, CardContent, Typography, Grid } from "@mui/material";
import StyledModal from "../../../../components/StyledModal";

const InterstedProductsModal = ({ row }) => {
    const [opened, { open, close }] = useDisclosure();

    return (
        <>
            <Link
                onClick={open}
                sx={{ color: "#23A75B", textDecoration: "underline", cursor: "pointer" }}
            >
                View
            </Link>

            {opened && (
                <StyledModal
                    opened={opened}
                    onClose={close}
                    buttonCancel={"Okay"}
                    title={"Products"}
                >
                    <Box sx={{maxHeight: "300px", overflowY: "scroll", scrollbarWidth: "none" }}>
                        <Grid container spacing={2}>
                            {row?.products?.map((product) => (
                                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }} key={product.id}>
                                    <Card
                                        sx={{
                                            borderRadius: 2,
                                            boxShadow: 2,
                                            height: "100%",
                                            background: "#fafafa",
                                        }}
                                    >
                                        <CardContent>
                                            <Typography
                                                variant="h6"
                                                sx={{ fontWeight: 600, textTransform: "capitalize" }}
                                            >
                                                {product.product_name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {product.product_type}
                                            </Typography>

                                            <Box mt={1}>
                                                <Typography variant="body2">
                                                    <strong>Size:</strong> {product.size || "N/A"}
                                                </Typography>
                                                <Typography variant="body2">
                                                    <strong>Volume:</strong> {product.volume || "N/A"}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </StyledModal >
            )}
        </>
    );
};

export default InterstedProductsModal;
