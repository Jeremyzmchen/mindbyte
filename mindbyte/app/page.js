"use client"

import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import Tab from "@/components/tab/Tab";
import Footer from "@/components/footer/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import WhySection from "@/components/home/WhySection";
import CtaBanner from "@/components/home/CtaBanner";

const Navbar = dynamic(() => import("../components/navbar/Navbar"), { ssr: false });

export default function Page() {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <Tab />
            <HeroSection />
            <FeaturedCategories />
            <WhySection />
            <CtaBanner />
            <Footer />
        </Box>
    );
}
