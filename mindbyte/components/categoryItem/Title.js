"use client";

import { Box, Typography, Divider, useTheme, useMediaQuery, IconButton, Tooltip, Modal, CircularProgress, Button } from "@mui/material";
import { format } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FlutterDashIcon from "@mui/icons-material/FlutterDash";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ReactMarkdown from "react-markdown";
import Share from "./Share";
// import { runAi } from "@/ai/ai"; // 非流式版本备用

const Title = ({ content }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const router = useRouter();

    const [summaryOpen, setSummaryOpen] = useState(false);
    const [summaryContent, setSummaryContent] = useState("");
    const [summaryLoading, setSummaryLoading] = useState(false);

    const [gainOpen, setGainOpen] = useState(false);
    const [gainContent, setGainContent] = useState("");
    const [gainLoading, setGainLoading] = useState(false);

    const date = content?.date ? new Date(content.date) : null;
    const formattedDate = date && !isNaN(date) ? format(date, "dd MMM, yyyy") : null;

    // 非流式版本（保留备用）
    // const SUMMARIZE_PROMPT = (articleContent) => `
    // You are a concise study assistant. Summarize the following article in under 200 words.
    // Follow these rules:
    // - Use **bold** to highlight the most important concepts or terms
    // - Structure the summary with 2-3 short paragraphs
    // - End with a "**Key Takeaway:**" line that captures the single most important idea
    // - Be direct and informative, no filler phrases
    // Article:
    // ${articleContent}
    // `;
    // const handleSummarize = async () => {
    //     if (!content?.content) return;
    //     setSummaryLoading(true);
    //     setSummaryOpen(true);
    //     try {
    //         const result = await runAi(SUMMARIZE_PROMPT(content.content));
    //         setSummaryContent(result);
    //     } catch (e) {
    //         setSummaryContent("Error generating summary.");
    //     } finally {
    //         setSummaryLoading(false);
    //     }
    // };

    const handleSummarize = async () => {
        if (!content?.content) return;
        setSummaryLoading(true);
        setSummaryOpen(true);
        setSummaryContent("");
        try {
            const res = await fetch("/api/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: content.content }),
            });
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            setSummaryLoading(false);
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                setSummaryContent((prev) => prev + decoder.decode(value));
            }
        } catch (e) {
            setSummaryContent("Error generating summary.");
            setSummaryLoading(false);
        }
    };

    const handleGain = async () => {
        if (!content?.content) return;
        setGainLoading(true);
        setGainOpen(true);
        setGainContent("");
        try {
            const res = await fetch("/api/gain", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: content.content }),
            });
            if (res.status === 401 || res.status === 403) {
                setGainOpen(false);
                setGainLoading(false);
                router.push("/Subscribe");
                return;
            }
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            setGainLoading(false);
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                setGainContent((prev) => prev + decoder.decode(value));
            }
        } catch (e) {
            setGainContent("Error generating content.");
            setGainLoading(false);
        }
    };

    return (
        <Box sx={{ mb: 3 }}>
            {/* 标题 */}
            <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{
                    fontWeight: 700,
                    color: "#111827",
                    lineHeight: 1.3,
                    mb: 1.5,
                    pt: 4,
                    pb: 1,
                }}
            >
                {content?.title || "Untitled"}
            </Typography>

            {/* 文章更新时间，文章分享 */}
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 1,
            }}>
                {formattedDate && (
                    <Typography sx={{ fontSize: 13, color: "#9ca3af" }}>
                        Last updated: {formattedDate}
                    </Typography>
                )}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Tooltip title="Summarize Article" arrow>
                        <IconButton size="small" onClick={handleSummarize} sx={{ bgcolor: "#f9fafb", color: "#111827", border: "1px solid #e5e7eb", "&:hover": { bgcolor: "#f3f4f6" } }}>
                            {summaryLoading ? <CircularProgress size={16} sx={{ color: "#111827" }} /> : <AutoAwesomeIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                                    <Tooltip title="Gain in-depth knowledge" arrow>
                        <IconButton size="small" onClick={handleGain} sx={{ bgcolor: "#f9fafb", color: "#111827", border: "1px solid #e5e7eb", "&:hover": { bgcolor: "#f3f4f6" } }}>
                            {gainLoading ? <CircularProgress size={16} sx={{ color: "#111827" }} /> : <FlutterDashIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                    {/* TODO: implement Comments */}
                    <Tooltip title="Comments" arrow>
                        <IconButton size="small" sx={{ bgcolor: "#f9fafb", color: "#111827", border: "1px solid #e5e7eb", "&:hover": { bgcolor: "#f3f4f6" } }}>
                            <ChatBubbleOutlineIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Share />
                </Box>
            </Box>

            <Divider sx={{ mt: 2, borderColor: "#e5e7eb" }} />

            {/* Gain in-depth knowledge Modal */}
            <Modal open={gainOpen} onClose={() => setGainOpen(false)} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Box sx={{
                    bgcolor: "#fff",
                    borderRadius: "12px",
                    p: 4,
                    width: { xs: "90%", md: "600px" },
                    maxHeight: "80vh",
                    display: "flex",
                    flexDirection: "column",
                    outline: "none",
                    boxShadow: 24,
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827", mb: 2 }}>
                        In-depth Knowledge
                    </Typography>
                    <Box sx={{ overflowY: "auto", flex: 1, color: "#374151", fontSize: 15, lineHeight: 1.8 }}>
                        {gainLoading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                                <CircularProgress size={24} sx={{ color: "#111827" }} />
                            </Box>
                        ) : (
                            <ReactMarkdown>{gainContent}</ReactMarkdown>
                        )}
                    </Box>
                    <Button
                        onClick={() => setGainOpen(false)}
                        sx={{ mt: 3, textTransform: "none", color: "#111827", border: "1px solid #e5e7eb", borderRadius: "8px", "&:hover": { bgcolor: "#f9fafb" } }}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>

            {/* Summarize Modal */}
            <Modal open={summaryOpen} onClose={() => setSummaryOpen(false)} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Box sx={{
                    bgcolor: "#fff",
                    borderRadius: "12px",
                    p: 4,
                    width: { xs: "90%", md: "600px" },
                    maxHeight: "80vh",
                    display: "flex",
                    flexDirection: "column",
                    outline: "none",
                    boxShadow: 24,
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827", mb: 2 }}>
                        Article Summary
                    </Typography>
                    <Box sx={{ overflowY: "auto", flex: 1, color: "#374151", fontSize: 15, lineHeight: 1.8 }}>
                        {summaryLoading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                                <CircularProgress size={24} sx={{ color: "#111827" }} />
                            </Box>
                        ) : (
                            <ReactMarkdown>{summaryContent}</ReactMarkdown>
                        )}
                    </Box>
                    <Button
                        onClick={() => setSummaryOpen(false)}
                        sx={{ mt: 3, textTransform: "none", color: "#111827", border: "1px solid #e5e7eb", borderRadius: "8px", "&:hover": { bgcolor: "#f9fafb" } }}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default Title;
