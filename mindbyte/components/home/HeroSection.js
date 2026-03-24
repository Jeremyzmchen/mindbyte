"use client"

import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const HeroSection = () => {
    const router = useRouter();

    return (
        <Box sx={{
            backgroundColor: "#fff",
            borderBottom: "1px solid #e5e7eb",
            px: { xs: 3, md: 10 },
            py: { xs: 8, md: 12 },
            textAlign: "center",
        }}>
            <Typography sx={{
                fontSize: 11, fontWeight: 600, color: "#6b7280",
                textTransform: "uppercase", letterSpacing: "0.12em", mb: 2,
            }}>
                Video-Based Learning Platform
            </Typography>

            <Typography sx={{
                fontSize: { xs: 36, md: 56 },
                fontWeight: 800,
                color: "#111827",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                mb: 3,
                maxWidth: 720,
                mx: "auto",
            }}>
                Learn Smarter.<br />Build Faster.
            </Typography>

            <Typography sx={{
                fontSize: { xs: 15, md: 18 },
                color: "#6b7280",
                maxWidth: 520,
                mx: "auto",
                lineHeight: 1.7,
                mb: 5,
            }}>
                MindByte delivers practical, video-based courses designed to take you from concept to real-world skill — fast.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                <Button
                    onClick={() => router.push("/register")}
                    sx={{
                        backgroundColor: "#111827",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 15,
                        px: 4,
                        py: 1.5,
                        borderRadius: "10px",
                        textTransform: "none",
                        "&:hover": { opacity: 0.85 },
                    }}
                >
                    Start Learning Free
                </Button>
                <Button
                    onClick={() => router.push("/courses")}
                    sx={{
                        backgroundColor: "transparent",
                        color: "#111827",
                        fontWeight: 600,
                        fontSize: 15,
                        px: 4,
                        py: 1.5,
                        borderRadius: "10px",
                        textTransform: "none",
                        border: "1.5px solid #e5e7eb",
                        "&:hover": { backgroundColor: "#f9fafb" },
                    }}
                >
                    Browse Courses
                </Button>
            </Box>

            {/* 统计数字 */}
            <Box sx={{
                display: "flex", justifyContent: "center", gap: { xs: 4, md: 8 },
                mt: 8, flexWrap: "wrap",
            }}>
                {[
                    { value: "50+", label: "Courses" },
                    { value: "10k+", label: "Students" },
                    { value: "100+", label: "Video Lessons" },
                ].map((stat) => (
                    <Box key={stat.label} sx={{ textAlign: "center" }}>
                        <Typography sx={{ fontSize: { xs: 28, md: 34 }, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}>
                            {stat.value}
                        </Typography>
                        <Typography sx={{ fontSize: 13, color: "#9ca3af", fontWeight: 500 }}>
                            {stat.label}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default HeroSection;
