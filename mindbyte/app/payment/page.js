"use client";

import { Box, Typography } from "@mui/material";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

export default function PaymentPage() {
    return (
        <>
            <Navbar />
            <Box sx={{ bgcolor: "#f9fafb", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>
                    Payment
                </Typography>
            </Box>
            <Footer />
        </>
    );
}
