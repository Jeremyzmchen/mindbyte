"use client"

import CourseCard from "./CourseCard";
import MultimediaCard from "./MultimediaCard";
import Sidebar from "@/components/sidebar/Sidebar";

import { Box } from "@mui/material";

const ResponsiveCards = () => {

    return (

        <>

            <Sidebar />

            <Box sx={{ marginLeft: "64px" }}>
                <CourseCard />
                <MultimediaCard />
            </Box>
        </>
    )
}
export default ResponsiveCards;