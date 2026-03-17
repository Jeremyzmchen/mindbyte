"use client"

//import CurriculumEditor  from "@/components/CurriculumEditor/CurriculumEditor"
import {
    Box,

} from '@mui/material';
import Sidebar from "@/components/sidebar/Sidebar";
import CategoryManager from "@/components/admin/categoryManager/CategoryManager";


const CourseCreate = () => {


    return (

        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#f0f0f0', // Exact dark background

            }}
        >categories


            <Sidebar/>
            <CategoryManager/>

        </Box>

    );
};
export default CourseCreate;