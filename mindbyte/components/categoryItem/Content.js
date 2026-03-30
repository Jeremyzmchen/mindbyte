"use client";

import { Box, Typography, CircularProgress, useTheme, useMediaQuery } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import readingTime from "reading-time";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: (str, lang) => {
        const language = lang && hljs.getLanguage(lang) ? lang : "plaintext";
        try {
            const highlighted = hljs.highlight(str, { language }).value;
            return `<pre style="background:#f8fafc;padding:16px;border-radius:8px;overflow-x:auto;border:1px solid #e5e7eb;margin:16px 0"><code style="font-family:'Courier New',monospace;font-size:13px;line-height:1.7;color:#111827">${highlighted}</code></pre>`;
        } catch {
            return "";
        }
    },
});

const Content = ({ content, loading }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const plainText = content?.content?.replace(/<[^>]*>/g, "") || "";
    const renderedContent = content?.content ? md.render(String(content.content)) : "";

    return (
        <Box sx={{ mt: 3 }}>
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                    <CircularProgress size={24} sx={{ color: "#111827" }} />
                </Box>
            ) : (
                <>
                    {/* 阅读时长 */}
                    {plainText && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 3, color: "#9ca3af" }}>
                            <AccessTimeIcon sx={{ fontSize: 14 }} />
                            <Typography sx={{ fontSize: 12 }}>
                                {readingTime(plainText).text}
                            </Typography>
                        </Box>
                    )}

                    {/* 正文 */}
                    <Box
                        sx={{
                            color: "#374151",
                            fontSize: isMobile ? 15 : 16,
                            lineHeight: 1.9,
                            letterSpacing: "0.1px",
                            "& h1, & h2, & h3": { color: "#111827", fontWeight: 700, mt: 3, mb: 1.5 },
                            "& h1": { fontSize: 24 },
                            "& h2": { fontSize: 20 },
                            "& h3": { fontSize: 17 },
                            "& p": { mb: 2 },
                            "& img": { maxWidth: "100%", borderRadius: "8px", my: 2, display: "block" },
                            "& a": { color: "#111827", textDecoration: "underline" },
                            "& ul, & ol": { pl: 3, mb: 2 },
                            "& li": { mb: 0.5 },
                            "& blockquote": { borderLeft: "3px solid #e5e7eb", pl: 2, color: "#6b7280", my: 2 },
                        }}
                        dangerouslySetInnerHTML={{ __html: renderedContent || "<p style='color:#9ca3af'>No content available.</p>" }}
                    />

                    {/* 视频 */}
                    {content?.videoUrl?.startsWith("http") && (
                        <Box sx={{ mt: 4, borderRadius: "10px", overflow: "hidden", border: "1px solid #e5e7eb", aspectRatio: "16/9" }}>
                            <ReactPlayer
                                url={content.videoUrl}
                                width="100%"
                                height="100%"
                                controls
                                // light={true}
                            />
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default Content;
