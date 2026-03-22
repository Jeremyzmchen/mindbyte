"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GitHub, Instagram, LinkedIn, YouTube, Twitter } from "@mui/icons-material";
import { Box, Grid, Typography, IconButton, CircularProgress } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

const Footer = () => {
    const router = useRouter();
    const isSmallScreen = useMediaQuery("(max-width: 600px)");

    const [categoryinfo, setCategoryinfo] = useState([]);
    const [loading, setLoading] = useState(false);

    const formatted = categoryinfo.reduce((totalinfo, item) => {
        const categoryName = item.categoryId.name;
        const categorySlug = item.categoryId.slug;
        const subcategoryName = item.subcategoryId.name;
        const subcategorySlug = item.subcategoryId.slug;

        let category = totalinfo.find((c) => c.name === categoryName);
        if (!category) {
            category = { name: categoryName, slug: categorySlug, subcategories: [] };
            totalinfo.push(category);
        }

        let subcategory = category.subcategories.find((sc) => sc.name === subcategoryName);
        if (!subcategory) {
            category.subcategories.push({ name: subcategoryName, slug: subcategorySlug });
        }

        return totalinfo;
    }, []);

    const fetchCurriculum = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/homepage/categorywithsubs`);
            const data = await response.json();
            setCategoryinfo(data || []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCurriculum(); }, []);

    return (
        <Box sx={{
            backgroundColor: "#f5f5f5",
            color: "#333",
            py: 3,
            px: isSmallScreen ? 2 : 8,
            borderTop: "1px solid #e0e0e0",
        }}>
            <Grid container spacing={1} alignItems="flex-start">

                {/* 左侧：About Us */}
                <Grid size={{ xs: 12, md: 2 }} sx={{ alignSelf: "flex-start" }}>
                    <Typography fontWeight="bold" sx={{ fontSize: "12px", letterSpacing: 1.5, textTransform: "uppercase", mb: 1.5 }}>
                        About Us
                    </Typography>
                    <Typography sx={{ color: "#666", lineHeight: 1.8, fontSize: "12px", mb: 2 }}>
                        MindByte is a video-based learning platform designed to make knowledge simple, practical, and accessible.
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                        <IconButton size="small" sx={{ color: "black", p: 0.5 }}><GitHub fontSize="small" /></IconButton>
                        <IconButton size="small" sx={{ color: "black", p: 0.5 }}><LinkedIn fontSize="small" /></IconButton>
                        <IconButton size="small" sx={{ color: "black", p: 0.5 }}><Instagram fontSize="small" /></IconButton>
                        <IconButton size="small" sx={{ color: "black", p: 0.5 }}><YouTube fontSize="small" /></IconButton>
                        <IconButton size="small" sx={{ color: "black", p: 0.5 }}><Twitter fontSize="small" /></IconButton>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" style={{ maxWidth: "120px", height: "auto" }} />
                        <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" style={{ maxWidth: "120px", height: "auto" }} />
                    </Box>
                </Grid>

                {/* 右侧：主分类 + 子分类链接 */}
                {loading ? (
                    <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
                        <CircularProgress sx={{ color: "black" }} />
                    </Grid>
                ) : (
                    formatted.map((category) => (
                        <Grid size={{ xs: 12, sm: 4, md: 2 }} key={category.slug}>
                            <Typography
                                fontWeight="bold"
                                sx={{
                                    cursor: "pointer",
                                    color: "#111",
                                    fontSize: "12px",
                                    letterSpacing: 1.5,
                                    textTransform: "uppercase",
                                    "&:hover": { color: "#555" },
                                    mb: 1.5,
                                }}
                                onClick={() => router.push(`/content/${category.slug}`)}
                            >
                                {category.name}
                            </Typography>

                            {category.subcategories.map((sub) => (
                                <Typography
                                    key={sub.slug}
                                    sx={{
                                        cursor: "pointer",
                                        color: "#666",
                                        fontSize: "12px",
                                        letterSpacing: 0.5,
                                        "&:hover": { color: "#111" },
                                        mb: 0.6,
                                    }}
                                    onClick={() => router.push(`/content/${sub.slug}`)}
                                >
                                    {sub.name}
                                </Typography>
                            ))}
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    );
};

export default Footer;