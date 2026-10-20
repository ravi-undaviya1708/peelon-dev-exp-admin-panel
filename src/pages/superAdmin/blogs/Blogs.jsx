import { Box, Breadcrumbs, Card, Typography, } from "@mui/material";
import { colors } from "../../../constants/constants";
import { AdvancedTable } from "../../../components/AdvanceTable";
import { blogColumns } from "./BlogsTable.jsx";
import { accountsPathConstants, customerPathConstants, deliveryDispatchPathConstants, factoryPathConstants, salesRepresentativePathConstants, superAdminPathConstants, warehouseManagerPathConstants } from "../../../constants/pathConstants";
import useFetchList from "../../../hooks/useFetchList";
import { PrimaryButton } from "../../../components/StyledButtons";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { deleteApi } from "../../../hooks/apiLogic.js";
import { toast } from "react-toastify";
import { productInventoryURLS } from "../../../services/api/superadminApi.js";
import useApiRequest from "../../../hooks/useApiRequest.js";
import { useSelector } from "react-redux";
import Loader from "../../../components/loader/Loader.jsx";
import Pagination from "../../../components/pagination/Pagination.jsx";
import { Link } from "react-router-dom";
import BlogModal from "./modals/BlogModal.jsx";

const Blogs = () => {
    const isLoading = useSelector((state) => state.loader.isLoading)
    const userType = useSelector((state) => state.auth.userType);
    const pathConstantsByRole = {
    "Super Admin": superAdminPathConstants,
    "Factory Operation": factoryPathConstants,
    "Sales Representative": salesRepresentativePathConstants,
    "Delivery & Dispatch": deliveryDispatchPathConstants,
    "Warehouse Manager": warehouseManagerPathConstants,
    "Accounts": accountsPathConstants,
    "Customer": customerPathConstants,        
    };
    const pathConstants = pathConstantsByRole[userType];
    const { DEFAULT, DASHBOARD } = pathConstants;
    const [opened, { open, close }] = useDisclosure(false);
    const [page, setPage] = useState(1);
    const { getBlogs, deleteBlogs } = productInventoryURLS;
    const { deleterequest } = useApiRequest();
    const [from, setFrom] = useState({
        modal: "",
        blogData: ""
    })

    const { data: blogsData, refetch: refetchBlogData, pagination: blogSPagination } = useFetchList(getBlogs, { page });

    const handleBlogsDelete = async (id) => {
        const response = await deleterequest(`${deleteBlogs}/${id}`)
        if (response.settings.success) {
            toast.success(response.settings.message);
            if (blogsData?.length === 1 && page > 1) {
                return setPage(page - 1)
            }
            refetchBlogData();
        }
        else {
            toast.error(response.settings.message)
        }
    }

    const handleEdit = (blogData) => {
        open()
        setFrom({
            modal: "editBlog",
            blogData: blogData,
        })
    }
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    if (isLoading) {
        return <Loader />
    }


    return (
        <>
            <Box>
                <Box display={"flex"} justifyContent={"space-between"} flexWrap={"wrap"} >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: "24px",
                                fontWeight: 700,
                                color: colors.headingclr,
                            }}
                        >
                            Blogs
                        </Typography>
                        <Breadcrumbs separator="›" aria-label="breadcrumb">
                            <Link
                                style={{ color: colors.darkgreen, textDecoration: "none" }}
                                to={`${DEFAULT}/${DASHBOARD}`}
                            >
                                <Typography sx={{ fontSize: "14px" }}>Dashbaord</Typography>
                            </Link>
                            <Typography sx={{ fontSize: "14px" }}>Blogs</Typography>
                        </Breadcrumbs>
                    </Box>
                    <Box alignContent={"center"} mt={1}>
                        <PrimaryButton onClick={() => { open(), setFrom({ modal: "addBlog" }) }}> Add Blog</PrimaryButton>
                    </Box>
                </Box>
                <Box mt={2}>
                    <AdvancedTable columns={blogColumns} data={blogsData} isAction={true} onEdit={(row) => { handleEdit(row) }} onDelete={(row) => handleBlogsDelete(row?.id)} />
                    <Pagination
                        paginationData={blogSPagination}
                        handlePageChange={handlePageChange}
                    />
                </Box>
                {
                    opened && (
                        <BlogModal
                            opened={opened}
                            onClose={close}
                            from={from}
                            onSuccess={refetchBlogData}
                            prefetchBlogDetailData={from?.blogData}
                        />
                    )

                }
            </Box>
        </>
    );
};
export default Blogs;
