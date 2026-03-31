"use client";

import { Box, Typography, Button, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import CheckIcon from "@mui/icons-material/Check";
import StarIcon from "@mui/icons-material/Star";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const plans = [
    {
        name: "Daily",
        price: "0.99",
        period: "/ day",
        description: "Try it out with no commitment.",
        highlight: false,
        features: [
            "Ad-free reading",
            "AI article summary",
            "Full course access",
            "Cancel anytime",
        ],
    },
    {
        name: "Monthly",
        price: "20",
        period: "/ month",
        description: "The most popular choice for learners.",
        highlight: true,
        features: [
            "Ad-free reading",
            "AI article summary",
            "AI in-depth knowledge",
            "Full course access",
            "Priority support",
            "Cancel anytime",
        ],
    },
    {
        name: "Yearly",
        price: "199",
        period: "/ year",
        description: "Best value for serious learners.",
        highlight: false,
        features: [
            "Ad-free reading",
            "AI article summary",
            "AI in-depth knowledge",
            "Full course access",
            "Priority support",
            "Early access to new features",
            "Cancel anytime",
        ],
    },
];

export default function SubscribePage() {
    const router = useRouter();

    return (
        <>
            <Navbar />
            <Box sx={{ bgcolor: "#f9fafb", minHeight: "100vh", py: { xs: 6, md: 10 }, px: { xs: 2, md: 4 } }}>

                {/* Header */}
                <Box sx={{ textAlign: "center", mb: { xs: 6, md: 10 } }}>
                    <Typography
                        sx={{
                            fontSize: { xs: 28, md: 40 },
                            fontWeight: 800,
                            color: "#111827",
                            letterSpacing: "-0.03em",
                            lineHeight: 1.2,
                            mb: 2,
                        }}
                    >
                        Unlock everything.
                    </Typography>
                    <Typography sx={{ fontSize: 16, color: "#6b7280", maxWidth: 480, mx: "auto", lineHeight: 1.7 }}>
                        Choose a plan that fits your pace. Upgrade or cancel anytime.
                    </Typography>
                </Box>

                {/* Plans */}
                <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: 1000, mx: "auto" }}>
                    {plans.map((plan) => (
                        <Grid item xs={12} sm={6} md={4} key={plan.name}>
                            <Box
                                sx={{
                                    position: "relative",
                                    bgcolor: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "14px",
                                    p: { xs: 3, md: 4 },
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    transition: "box-shadow 0.25s ease, transform 0.25s ease",
                                    "&:hover": {
                                        boxShadow: "0 12px 40px rgba(17,24,39,0.12)",
                                        transform: "scale(1.03)",
                                    },
                                }}
                            >
                                {/* Most Popular badge */}
                                {plan.highlight && (
                                    <Box sx={{
                                        position: "absolute",
                                        top: -16,
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        bgcolor: "#fbbf24",
                                        border: "none",
                                        borderRadius: "20px",
                                        px: 2,
                                        py: 0.8,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                        whiteSpace: "nowrap",
                                    }}>
                                        <StarIcon sx={{ fontSize: 18, color: "#111827" }} />
                                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                            Most Popular
                                        </Typography>
                                    </Box>
                                )}

                                {/* Plan name */}
                                <Typography sx={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: "#6b7280",
                                    mb: 2,
                                }}>
                                    {plan.name}
                                </Typography>

                                {/* Price */}
                                <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5, mb: 1 }}>
                                    <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#6b7280", mt: 0.5 }}>
                                        $
                                    </Typography>
                                    <Typography sx={{
                                        fontSize: { xs: 36, md: 44 },
                                        fontWeight: 800,
                                        color: "#111827",
                                        letterSpacing: "-0.03em",
                                        lineHeight: 1,
                                    }}>
                                        {plan.price}
                                    </Typography>
                                    <Typography sx={{ fontSize: 13, color: "#9ca3af", mb: 0.5, alignSelf: "flex-end" }}>
                                        {plan.period}
                                    </Typography>
                                </Box>

                                {/* Description */}
                                <Typography sx={{ fontSize: 13, color: "#6b7280", mb: 3, lineHeight: 1.6 }}>
                                    {plan.description}
                                </Typography>

                                {/* Divider */}
                                <Box sx={{ borderTop: "1px solid #e5e7eb", mb: 3 }} />

                                {/* Features */}
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, flex: 1 }}>
                                    {plan.features.map((feature) => (
                                        <Box key={feature} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                            <Box sx={{
                                                width: 18,
                                                height: 18,
                                                borderRadius: "50%",
                                                bgcolor: "#f3f4f6",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                            }}>
                                                <CheckIcon sx={{ fontSize: 11, color: "#111827" }} />
                                            </Box>
                                            <Typography sx={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
                                                {feature}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>

                                {/* CTA Button */}
                                <Button
                                    fullWidth
                                    onClick={() => router.push("/payment")}
                                    sx={{
                                        textTransform: "none",
                                        fontWeight: 600,
                                        fontSize: 14,
                                        py: 1.5,
                                        borderRadius: "8px",
                                        mt: 3,
                                        background: "linear-gradient(135deg, #111827 0%, #374151 100%)",
                                        color: "#ffffff",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #374151 0%, #111827 100%)",
                                        },
                                    }}
                                >
                                    Get Started
                                </Button>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                {/* Footer note */}
                <Typography sx={{ textAlign: "center", mt: 8, fontSize: 13, color: "#9ca3af" }}>
                    All plans include a 7-day free trial. No credit card required to start.
                </Typography>

            </Box>
            <Footer />
        </>
    );
}
