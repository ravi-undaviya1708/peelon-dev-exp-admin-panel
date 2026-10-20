import { Link } from "@mui/material";
import { lazy, Suspense } from "react";
const DescriptionModal = lazy(() => import("./modals/DescriptionModal"))

export const blogColumns = [

    {
        key: "image",
        name: "Blog",
        renderFunction: (row) => {
            return <img src={row.image} alt="Blog Image" width={100} height="50px" style={{ mixBlendMode: "multiply", borderRadius: "8px", objectFit: "cover" }} />;
        }
    },
    {
        key: "blog_name",
        name: "Blog Name",
        renderFunction: (row) => {
            if (!row.blog_name) return "-";

            const words = row.blog_name.split(" ");
            const truncated =
                words.length > 3 ? words.slice(0, 3).join(" ") + "..." : row.blog_name;

            return <span>{truncated}</span>;
        },
    },
    {
        name: "Blog Link",
        key: "link",
        renderFunction: (row) => row?.link ? (
            <Link href={row.link} target="_blank" rel="noopener noreferrer" sx={{ fontSize: "14px" }}>
                {row.link}
            </Link>
        ) : ("-")
    },
    {
        key: "description",
        name: "Description",
        renderFunction: (row) => <Suspense fallback={null}>
            <DescriptionModal row={row} />
        </Suspense>
    },


];
