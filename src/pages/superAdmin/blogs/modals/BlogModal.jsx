import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import StyledModal from "../../../../components/StyledModal";
import { useForm } from "react-hook-form";
import { FormInput } from "../../../../components/input/FormInput";
import { Label16 } from "../../../../components/StyledText";
import { ImageUpload } from "../../../../components/image/SingleImageUpload";
import useApiRequest from "../../../../hooks/useApiRequest";
import { productInventoryURLS } from "../../../../services/api/superadminApi";
import { toast } from "react-toastify";
import { mapApiDataToForm } from "../../../../hooks/mapApiDataToForm";
import { blobConversion } from "../../../../hooks/blobConversion";
import useFetchDropdown from "../../../../hooks/useFetchDropdown";
import SingleSelect from "../../../../components/select/SingleSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextareaInput } from "../../../../components/input/TextareaInput";
import { blogValidation } from "../schema";
import { MultiImageUploadController } from "../../../../components/image/MulitImageUpload";
import { useMulitImageArray } from "../../../../hooks/useMultiImageArray";

const blogInitialPayloads = {
    description: "",
    link: "",
    blog_name: "",
    image: null,
};

function BlogModal({
    opened,
    onClose,
    from,
    onSuccess,
    prefetchBlogDetailData,
}) {
    const { filePut, filePost } = useApiRequest();
    const { postBlogs, editBlogs, } = productInventoryURLS;
    const {
        control,
        handleSubmit,
        watch,
        reset,
        setValue,
        getValues,
        formState: { isSubmitted, isSubmitting, isDirty, errors },
    } = useForm({
        defaultValues: blogInitialPayloads,
        mode: "onSubmit",
        resolver: yupResolver(blogValidation)
    });
    const images = ["image"];
    const { handleAddImage, handleDeleteImage } = useMulitImageArray(images, getValues, setValue);

    console.log("watch", watch());

    useEffect(() => {
        if (from.modal === "editBlog" && prefetchBlogDetailData) {
            const formValues = mapApiDataToForm(
                blogInitialPayloads,
                prefetchBlogDetailData
            );
            reset(formValues);
        }
    }, [from, prefetchBlogDetailData, reset]);

    const handleBlogSubmit = async (data) => {
        let response;
        if (from.modal === "editBlog") {
            response = await filePut(`${editBlogs}/${prefetchBlogDetailData?.id}`, data, images)


        } else {
            response = await filePost(postBlogs, data)

        }
        if (response.settings.success) {
            toast.success(response.settings.message);
            reset();
            onSuccess();
            onClose();
        } else {
            toast.error(response.settings.message);
        }
    };

    return (
        <>
            <StyledModal
                opened={opened}
                onClose={onClose}
                title={from.modal === "addBlog" ? "Add Blog" : "Edit Blog"}
                buttonText={
                    from.modal === "addBlog" ? "Add Blog" : "Update"
                }
                isDirty={from.modal === "editBlog" && !isDirty}
                isSubmitting={isSubmitting}
                formProps={{ onSubmit: handleSubmit(handleBlogSubmit) }}
                size="lg"
            >
                <Box sx={{ maxHeight: "500px", overflowY: "scroll", scrollbarWidth: "none", }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                            <Box>
                                <Label16 sx={{ py: 1 }} >Blog Image</Label16>
                                <MultiImageUploadController
                                    width="100%"
                                    height={200}
                                    control={control}
                                    // errors={errors?.image}
                                    imageKeys={images}
                                    getValues={getValues}
                                    setValue={setValue}
                                    handleAddImage={handleAddImage}
                                    handleDeleteImage={handleDeleteImage}
                                    isSubmitted={isSubmitted}
                                    
                                    accept="image/*"
                                />
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                            <Box>
                                <Label16 sx={{ py: 1 }}>Blog Name</Label16>
                                <TextareaInput
                                    control={control}
                                    name="blog_name"
                                    placeholder="Enter Blog Name"
                                />
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                            <Box>
                                <Label16 sx={{ py: 1 }}>Description</Label16>
                                <TextareaInput
                                    control={control}
                                    name="description"
                                    placeholder="Enter Description"
                                />
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                            <Box>
                                <Label16 sx={{ py: 1 }}>Blog Link</Label16>
                                <FormInput
                                    control={control}
                                    name="link"
                                    placeholder="Enter Blog Link"
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </StyledModal>
        </>
    );
}

export default BlogModal;
