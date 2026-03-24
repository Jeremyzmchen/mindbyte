"use client"

import dynamic from "next/dynamic";
import { Box } from "@mui/material";

const Sidebar = dynamic(() => import("@/components/sidebar/Sidebar"), { ssr: false });
const Content = dynamic(() => import("@/components/admin/content/Content"), { ssr: false });

const CourseManagementPage = () => {
    return (
        <Box sx={{ display: "flex", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
            <Sidebar />
            <Box
                component="main"
                sx={{
                    marginLeft: "64px",
                    flexGrow: 1,
                    minHeight: "100vh",
                    backgroundColor: "#f9fafb",
                }}
            >
                <Content />
            </Box>
        </Box>
    );
};

export default CourseManagementPage;
