"use client"

import { Box } from '@mui/material';
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/components/sidebar/Sidebar"), { ssr: false });
const CategoryManager = dynamic(() => import("@/components/admin/categoryManager/CategoryManager"), { ssr: false });

const CategoryPage = () => {
    return (
        <Box sx={{ display: "flex", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
            <Sidebar />
            <Box component="main" sx={{ marginLeft: "64px", flexGrow: 1, minHeight: "100vh", backgroundColor: "#f9fafb" }}>
                <CategoryManager />
            </Box>
        </Box>
    );
};

export default CategoryPage;
