"use client"

import { Box, Typography } from "@mui/material";

const features = [
    {
        icon: "▶",
        title: "Video-Based Learning",
        desc: "Every course is built around short, focused videos. Watch at your own pace, rewind anytime, and retain more by learning visually.",
    },
    {
        icon: "⚡",
        title: "Simple & Practical",
        desc: "No fluff. Every lesson maps directly to a real skill. You'll spend your time building, not reading endless theory.",
    },
    {
        icon: "📐",
        title: "Structured Curriculum",
        desc: "Courses are organized into clear sections and lectures, so you always know where you are and what comes next.",
    },
];

const WhySection = () => {
    return (
        <Box sx={{ px: { xs: 3, md: 10 }, py: { xs: 7, md: 10 }, backgroundColor: "#fff", borderTop: "1px solid #e5e7eb" }}>
            <Box sx={{ mb: 6 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.10em", mb: 1 }}>
                    Why MindByte
                </Typography>
                <Typography sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}>
                    Learning, done right.
                </Typography>
            </Box>

            <Box sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: 3,
            }}>
                {features.map((f) => (
                    <Box
                        key={f.title}
                        sx={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px",
                            p: 4,
                            backgroundColor: "#fff",
                        }}
                    >
                        <Box sx={{
                            width: 40, height: 40,
                            backgroundColor: "#f3f4f6",
                            borderRadius: "10px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 18,
                            mb: 2.5,
                        }}>
                            {f.icon}
                        </Box>
                        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827", mb: 1 }}>
                            {f.title}
                        </Typography>
                        <Typography sx={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>
                            {f.desc}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default WhySection;
