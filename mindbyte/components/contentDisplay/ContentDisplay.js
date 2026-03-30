"use client"

import { Box, Grid, CircularProgress } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import CurriculumAccordion from "@/components/categoryItem/Accordion";    // 左侧课程详情菜单栏
import Advertisement from "@/components/categoryItem/Advertisement";             // 非会员显示广告位
import Title from "@/components/categoryItem/Title";                      // 
import Content from "@/components/categoryItem/Content";                  // 课程内容
import SimilarReads from "@/components/categoryItem/SimilarReads";        // 类似课程推荐
import { useState } from "react";
//import { useEffect } from "react";
//import { useSession } from "next-auth/react";
//import { useRouter } from "next/router";                                  // 订阅状态查询失败强制跳转路由

// content接收数据内容，loading接收状态确认是否要显示加载图标
export default function ContentDisplay({ content, loading, slug }) {
    const lecture = content?.matchingLecture || content?.firstLecture || null;
    const [showAccordion, setShowAccordion] = useState(false)

    return (
        <>
            <Navbar />

            <Box sx={{ bgcolor: "#f9fafb", minHeight: "100vh" }}>
                <Grid container sx={{ minHeight: "100vh" }}>

                    {/* 左侧：课程目录，sticky 固定 */}
                    <Grid item xs={12} md={3} sx={{ display: { xs: showAccordion ? "block" : "none", md: "block" } }}>
                        <Box sx={{
                            position: "sticky",
                            top: "64px",
                            height: "calc(100vh - 64px)",
                            overflowY: "auto",
                            bgcolor: "#ffffff",
                            borderRight: "1px solid #e5e7eb",
                        }}>
                            <CurriculumAccordion slug={slug} />
                        </Box>
                    </Grid>

                    {/* 中心：讲座内容，sticky 固定 */}
                    <Grid item xs={12} md={7}>
                        {loading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}>
                                <CircularProgress size={24} sx={{ color: "#111827" }} />
                            </Box>
                        ) : (
                            <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 4 }, py: 4 }}>
                                <Title content={lecture} />
                                <Content content={lecture} loading={loading} />
                                <SimilarReads />
                            </Box>
                        )}
                    </Grid>

                    {/* 右侧：广告区域 */}
                    <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "center", }}>
                        <Advertisement />
                    </Grid>

                </Grid>

                {/* 手机端课程列表展开悬浮图标 */}
                <IconButton
                    sx={{
                        position: "fixed",
                        bottom: 16,
                        right: 16,
                        display: { md: "none" },  // 只在手机端显示
                        bgcolor: "#111827",
                        color: "#fff",
                        zIndex: 10,
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
