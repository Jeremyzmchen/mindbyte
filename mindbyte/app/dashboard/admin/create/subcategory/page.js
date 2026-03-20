"use client"

import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/components/sidebar/Sidebar"), { ssr: false });
const SubCategoryManager = dynamic(() => import("@/components/admin/subCategoryManager/subCategoryManager"), { ssr: false });

const CourseCreate = () => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
            <Sidebar />
            <SubCategoryManager />
        </div>
    );
};

export default CourseCreate;