"use client"

import { Box, Grid, CircularProgress } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import CurriculumAccordion from "@/components/categoryItem/Accordion";
import Advertisement from "@/components/categoryItem/Advertisement";
import SubscriptionAd from "@/components/categoryItem/SubscriptionAd";
import Title from "@/components/categoryItem/Title";
import Content from "@/components/categoryItem/Content";
import SimilarReads from "@/components/categoryItem/SimilarReads";
import { useState } from "react";

export default function ContentDisplay({ content, loading, slug }) {
    const lecture = content?.matchingLecture || content?.firstLecture || null;
    const [showAccordion, setShowAccordion] = useState(false)

    // 广告数据
    const topAds = [
        { image: '/images/ads1.png', link: 'https://github.com/Jeremyzmchen', title: 'Top Advertisement 1' },
        { image: '/images/ads2.png', link: 'https://github.com/Jeremyzmchen', title: 'Top Advertisement 2' },
    ];
    const middleAds = [
        { image: '/images/ads3.png', link: 'https://github.com/Jeremyzmchen', title: 'Middle Advertisement 1' },
        { image: '/images/ads1.png', link: 'https://github.com/Jeremyzmchen', title: 'Middle Advertisement 2' },
    ];
    const bottomAds = [
        { image: '/images/ads2.png', link: 'https://github.com/Jeremyzmchen', title: 'Bottom Advertisement 1' },
        { image: '/images/ads3.png', link: 'https://github.com/Jeremyzmchen', title: 'Bottom Advertisement 2' },
    ];

    return (
        <>
            <Navbar />

            <Box sx={{ bgcolor: "#f9fafb", minHeight: "100vh" }}>
                <Grid container sx={{ minHeight: "100vh", alignItems: "stretch" }}>

                    {/* 1. 左侧：课程目录 (SECTIONS) */}
                    <Grid item xs={12} lg={2}
                        sx={{
                            display: { xs: showAccordion ? "block" : "none", lg: "block" },
                            bgcolor: "#ffffff",
                            borderRight: "1px solid #e5e7eb",
                            position: { xs: "fixed", lg: "relative" },
                            zIndex: 100,
                            height: { xs: "100%", lg: "auto" },
                        }}>
                        <Box sx={{
                            position: "sticky",
                            top: "64px", // Navbar高度
                            height: "calc(100vh - 64px)",
                            overflowY: "auto",
                        }}>
                            <CurriculumAccordion slug={slug} />
                        </Box>
                    </Grid>

                    {/* 2. 中心：内容区 (TITLE & CONTENT) */}
                    <Grid item xs={12} md={12} lg={8} sx={{ display: "flex", justifyContent: "center", flexGrow: 1 }}>
                        <Box sx={{
                            width: "100%",
                            maxWidth: 900,
                            px: { xs: 2, md: 3, lg: 3 },
                            pt: 2,
                            pb: 6
                        }}>
                            {loading ? (
                                <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}>
                                    <CircularProgress size={24} sx={{ color: "#111827" }} />
                                </Box>
                            ) : (
                                <Box sx={{ width: "100%" }}>
                                    <Title content={lecture} />
                                    <Content content={lecture} loading={loading} />
                                    <SimilarReads />
                                </Box>
                            )}
                        </Box>
                    </Grid>

                    {/* 3. 右侧：广告区域 (ADVERTISEMENTS) */}
                    <Grid item xs={12} lg={2}
                        sx={{
                            display: { xs: "none", lg: "block" }, 
                            borderLeft: "1px solid #e5e7eb",
                            px: 3,
                            pt: 2,
                        }}>
                        <Box sx={{
                            position: "sticky",
                            top: "80px", 
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                            width: "100%",
                        }}>
                            {/* 会员广告 */}
                            <SubscriptionAd />
                            
                            <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                                <Advertisement adData={topAds} />
                                <Advertisement adData={middleAds} />
                                <Advertisement adData={bottomAds} />
                            </Box>
                        </Box>
                    </Grid>

                </Grid>

                {/* 手机端悬浮图标 */}
                <IconButton
                    sx={{
                        position: "fixed",
                        bottom: 16,
                        right: 16,
                        display: { lg: "none" },
                        bgcolor: "#111827",
                        color: "#fff",
                        zIndex: 1000,
                        "&:hover": { bgcolor: "#374151" },
                    }}
                    onClick={() => setShowAccordion(!showAccordion)}
                >
                    <MenuIcon />
                </IconButton>
            </Box>
            <Footer />
        </>
    )
}