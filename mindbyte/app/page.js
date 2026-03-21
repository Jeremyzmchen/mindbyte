"use client"

import dynamic from "next/dynamic";
import Tab from "@/components/tab/Tab";
import Footer from "@/components/footer/Footer";
import { Box } from "@mui/material";

const Navbar = dynamic(() => import("../components/navbar/Navbar"), {
    ssr: false,
});

export default function Page() {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <Tab />

            <Box sx={{ flexGrow: 1 }} />

            <Footer />
        </Box>
    );
}