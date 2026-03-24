"use client"

import { Box } from '@mui/material';
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/components/sidebar/Sidebar"), { ssr: false });
const SubCategoryManager = dynamic(() => import("@/components/admin/subCategoryManager/subCategoryManager"), { ssr: false });

const SubCategoryPage = () => {
    return (
        <Box sx={{ display: "flex", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
            <Sidebar />
            <Box component="main" sx={{ marginLeft: "64px", flexGrow: 1, minHeight: "100vh", backgroundColor: "#f9fafb" }}>
                <SubCategoryManager />
            </Box>
        </Box>
    );
};

export default SubCategoryPage;
