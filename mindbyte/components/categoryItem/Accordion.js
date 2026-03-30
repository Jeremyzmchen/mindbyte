"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const C = {
    bg: "#ffffff",
    border: "#e5e7eb",
    text: "#111827",
    subtext: "#374151",
    label: "#9ca3af",
    hover_bg: "#f9fafb",
    active_bg: "#f3f4f6",
    active_border: "#111827",
};

export default function CurriculumAccordion({ slug }) {
    const pathname = usePathname();    // 获取url
    const router = useRouter();
    const [curriculum, setCurriculum] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (slug) fetchCurriculum(slug);
    }, [slug]);

    // 请求对应课程目录数据
    const fetchCurriculum = async (slug) => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/accordion/${slug}`);
            const data = await response.json();
            setCurriculum(data?.sections || []);
        } catch (error) {
            console.log("Error fetching curriculum:", error);
        }
        setLoading(false);
    };

    return (
        <Box sx={{ 
            zIndex: 1, 
            bgcolor: C.bg, 
            width: "270px", 
            overflowY: "auto", 
            }}>

            {/* 目录标题 */}
            <Box sx={{ px: 3, py: 2.5, borderBottom: `1px solid ${C.border}` }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: C.label, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Sections
                </Typography>
            </Box>

            {loading ? (
                // 1. 数据加载状态
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                    <CircularProgress size={20} sx={{ color: C.active_border }} />
                </Box>
            ) : curriculum.length === 0 ? (
                // 2. 课程暂无具体sections
                <Box sx={{ px: 3, py: 4 }}>
                    <Typography sx={{ fontSize: 12, color: C.label }}>No sections currently</Typography>
                </Box>
            ) : (
                // 3. 遍历具体sections
                curriculum.map((section, index) => (
                    <Accordion
                        key={index}
                        disableGutters
                        defaultExpanded={index === 0}    // 默认展开第一个section列表
                        elevation={0}
                        sx={{
                            bgcolor: C.bg,
                            borderBottom: `1px solid ${C.border}`,
                            "&:before": { display: "none" },
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: C.label, fontSize: 16 }} />}
                            sx={{ px: 3, py: 0, minHeight: 44, "&.Mui-expanded": { minHeight: 44 } }}
                        >
                            <Typography sx={{ fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.4 }}>
                                {section.title}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 2, pt: 0, pb: 1 }}>
                            {section.lectures?.map((lecture, i) => {
                                const isActive = pathname.endsWith(lecture.slug);
                                return (
                                    <Box
                                        key={i}
                                        onClick={() => router.push(`/content/${lecture.slug}`)}
                                        sx={{
                                            px: 2,
                                            py: 0.8,
                                            mb: 0.25,
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            borderLeft: isActive ? `2px solid ${C.active_border}` : "2px solid transparent",
                                            bgcolor: isActive ? C.active_bg : "transparent",
                                            "&:hover": { bgcolor: C.hover_bg },
                                            transition: "all 0.15s ease",
                                        }}
                                    >
                                        <Typography sx={{ fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? C.text : C.subtext, lineHeight: 1.5 }}>
                                            {lecture.title}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </AccordionDetails>
                    </Accordion>
                ))
            )}
        </Box>
    );
}
