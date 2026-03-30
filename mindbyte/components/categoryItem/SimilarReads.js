"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Chip, Divider, useTheme, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";

const SimilarReads = () => {
    const theme = useTheme();
    const router = useRouter();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [curriculum, setCurriculum] = useState([]);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/similarread`);
            const data = await response.json();
            setCurriculum(data?.curriculums || []);
            setTags(data?.subCategory || []);
        } catch (error) {
            console.log("Error fetching similar reads:", error);
        }
    };

    const lectures = curriculum.flatMap((course) =>
        course.sections.flatMap((section) =>
            section.lectures.map((lecture) => ({
                title: lecture.title,
                slug: lecture?.slug,
                // 去掉所有 HTML 标签，只保留纯文字
                description: lecture.content?.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().substring(0, 120) || "",
            }))
        )
    );

    const shuffledLectures = lectures.sort(() => Math.random() - 0.5).slice(0, 4);
    const randomTags = tags.sort(() => 0.5 - Math.random()).slice(0, 9);

    if (shuffledLectures.length === 0 && randomTags.length === 0) return null;

    return (
        <Box sx={{ mt: 6 }}>
            <Divider sx={{ mb: 4, borderColor: "#e5e7eb" }} />

            {/* Similar Reads */}
            {shuffledLectures.length > 0 && (
                <>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#111827", mb: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Similar Reads
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 4 }}>
                        {shuffledLectures.map((article, index) => (
                            <Box
                                key={index}
                                onClick={() => router.push(`/content/${article.slug}`)}
                                sx={{
                                    p: 2,
                                    borderRadius: "8px",
                                    border: "1px solid #e5e7eb",
                                    cursor: "pointer",
                                    bgcolor: "#ffffff",
                                    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                                    "&:hover": { borderColor: "#9ca3af", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
                                }}
                            >
                                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#111827", mb: 0.5 }}>
                                    {article.title}
                                </Typography>
                                {article.description && (
                                    <Typography sx={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
                                        {article.description}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </Box>
                </>
            )}

            {/* Tags */}
            {randomTags.length > 0 && (
                <>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#111827", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Topics
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {randomTags.map((tag, index) => (
                            <Chip
                                key={index}
                                label={tag.name}
                                size="small"
                                onClick={() => router.push(`/content/${tag?.slug?.toLowerCase()}`)}
                                sx={{
                                    bgcolor: "#f3f4f6",
                                    color: "#374151",
                                    fontSize: 12,
                                    fontWeight: 500,
                                    border: "1px solid #e5e7eb",
                                    "&:hover": { bgcolor: "#111827", color: "#ffffff" },
                                    transition: "all 0.15s ease",
                                }}
                            />
                        ))}
                    </Box>
                </>
            )}
        </Box>
    );
};

export default SimilarReads;
