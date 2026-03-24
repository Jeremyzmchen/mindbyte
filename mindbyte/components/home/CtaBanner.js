"use client"

import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const CtaBanner = () => {
    const router = useRouter();

    return (
        <Box sx={{
            backgroundColor: "#111827",
            px: { xs: 3, md: 10 },
            py: { xs: 8, md: 10 },
            textAlign: "center",
        }}>
            <Typography sx={{
                fontSize: { xs: 28, md: 38 },
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.02em",
                mb: 2,
                lineHeight: 1.2,
            }}>
                Ready to start learning?
            </Typography>
            <Typography sx={{
                fontSize: { xs: 14, md: 16 },
                color: "#9ca3af",
                mb: 5,
                maxWidth: 420,
                mx: "auto",
                lineHeight: 1.7,
            }}>
                Join thousands of learners building real skills with MindByte. It's free to get started.
            </Typography>
            <Button
                onClick={() => router.push("/register")}
                sx={{
                    backgroundColor: "#fff",
                    color: "#111827",
                    fontWeight: 700,
                    fontSize: 15,
                    px: 5,
                    py: 1.75,
                    borderRadius: "10px",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#f3f4f6" },
                }}
            >
                Get Started Free
            </Button>
        </Box>
    );
};

export default CtaBanner;
