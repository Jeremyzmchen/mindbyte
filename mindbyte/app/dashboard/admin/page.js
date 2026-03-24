"use client"

import { Box, Typography } from '@mui/material';
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/components/sidebar/Sidebar"), { ssr: false });

// 颜色常量 — Charcoal Minimal
const C = {
    bg: "#f9fafb",
    card: "#ffffff",
    primary: "#111827",
    text: "#111827",
    text_secondary: "#6b7280",
    label: "#9ca3af",
    border: "#e5e7eb",
};

const statCards = [
    { label: "TOTAL COURSES",     value: "1,284",   change: "+12%", up: true  },
    { label: "TOTAL USERS",       value: "42,903",  change: "+4%",  up: true  },
    { label: "TOTAL REVENUE",     value: "$842.5k", change: "-2%",  up: false },
    { label: "TOTAL ENROLLMENTS", value: "156,290", change: "+28%", up: true  },
];

const recentOrders = [
    { course: "Advanced Figma Workflows",  user: "alex.rivera@example.com",  amount: "$89.00",  date: "Oct 24, 2024", status: "COMPLETED" },
    { course: "Python for Data Science",   user: "m.jenkins@cloud.io",        amount: "$124.50", date: "Oct 23, 2024", status: "PENDING" },
    { course: "Digital Marketing 101",     user: "sarah.quinn@startup.co",    amount: "$45.00",  date: "Oct 23, 2024", status: "COMPLETED" },
];

const statusColor = {
    COMPLETED: { bg: "#f0fdf4", text: "#16a34a" },
    PENDING:   { bg: "#f9fafb", text: "#374151" },
};

const AdminDashboardPage = () => {
    return (
        <Box sx={{ display: "flex", backgroundColor: C.bg, minHeight: "100vh" }}>
            <Sidebar />

            <Box
                component="main"
                sx={{
                    marginLeft: "64px",
                    flexGrow: 1,
                    minHeight: "100vh",
                    backgroundColor: C.bg,
                    p: { xs: 3, md: 5 },
                }}
            >
                {/* ── 页面标题栏 ── */}
                <Box sx={{ mb: 4 }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: C.text_secondary, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.5 }}>
                        System Administration
                    </Typography>
                    <Typography sx={{ fontSize: 28, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>
                        Admin Dashboard
                    </Typography>
                </Box>

                {/* ── 统计卡片 ── */}
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2.5, mb: 4 }}>
                    {statCards.map((card, i) => (
                        <Box
                            key={i}
                            sx={{
                                backgroundColor: C.card,
                                borderRadius: "12px",
                                p: 3,
                                border: `1px solid ${C.border}`,
                            }}
                        >
                            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1.5 }}>
                                <Typography sx={{ fontSize: 12, fontWeight: 600, color: card.up ? "#16a34a" : "#dc2626", backgroundColor: card.up ? "#f0fdf4" : "#fef2f2", px: 1, py: 0.25, borderRadius: "999px" }}>
                                    {card.change}
                                </Typography>
                            </Box>
                            <Typography sx={{ fontSize: 26, fontWeight: 700, color: C.text, letterSpacing: "-0.02em", lineHeight: 1 }}>
                                {card.value}
                            </Typography>
                            <Typography sx={{ fontSize: 11, fontWeight: 600, color: C.label, textTransform: "uppercase", letterSpacing: "0.06em", mt: 0.75 }}>
                                {card.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* ── 图表 + Top Categories ── */}
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 280px" }, gap: 2.5, mb: 4 }}>
                    {/* 折线图（静态SVG） */}
                    <Box sx={{ backgroundColor: C.card, borderRadius: "12px", p: 3, border: `1px solid ${C.border}` }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                            <Box>
                                <Typography sx={{ fontSize: 15, fontWeight: 600, color: C.text }}>Enrollments Over Time</Typography>
                                <Typography sx={{ fontSize: 12, color: C.label }}>Last 30 days performance comparison</Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: 1 }}>
                                {["7D", "30D"].map((t, i) => (
                                    <Box key={t} sx={{ px: 1.5, py: 0.5, borderRadius: "6px", fontSize: 12, fontWeight: 600, cursor: "pointer", backgroundColor: i === 1 ? "#111827" : "transparent", color: i === 1 ? "#fff" : C.label, border: i === 1 ? "none" : `1px solid ${C.border}` }}>
                                        {t}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                        {/* 静态 SVG 折线图 */}
                        <svg viewBox="0 0 600 180" style={{ width: "100%", height: 180 }}>
                            <defs>
                                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#111827" stopOpacity="0.15" />
                                    <stop offset="100%" stopColor="#111827" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* 网格线 */}
                            {[40, 80, 120, 160].map(y => (
                                <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#f3f4f6" strokeWidth="1" />
                            ))}
                            {/* 填充区域 */}
                            <path d="M0,140 C60,120 100,100 150,80 C200,60 230,100 280,90 C330,80 370,50 420,60 C470,70 520,40 600,30 L600,180 L0,180 Z" fill="url(#chartGrad)" />
                            {/* 折线 */}
                            <path d="M0,140 C60,120 100,100 150,80 C200,60 230,100 280,90 C330,80 370,50 420,60 C470,70 520,40 600,30" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            {/* 数据点 */}
                            {[[0,140],[150,80],[280,90],[420,60],[600,30]].map(([x,y], i) => (
                                <circle key={i} cx={x} cy={y} r="4" fill="#fff" stroke="#111827" strokeWidth="2.5" />
                            ))}
                            {/* X轴标签 */}
                            {["MON","TUE","WED","THU","FRI","SAT","SUN"].map((d, i) => (
                                <text key={d} x={i * 96 + 8} y={175} fontSize="10" fill="#9ca3af" fontFamily="Inter, sans-serif">{d}</text>
                            ))}
                        </svg>
                    </Box>

                    {/* Top Categories */}
                    <Box sx={{ backgroundColor: C.card, borderRadius: "12px", p: 3, border: `1px solid ${C.border}` }}>
                        <Typography sx={{ fontSize: 15, fontWeight: 600, color: C.text, mb: 0.5 }}>Top Categories</Typography>
                        <Typography sx={{ fontSize: 12, color: C.label, mb: 2.5 }}>By revenue share</Typography>
                        {[
                            { name: "UI/UX Design", short: "UX", pct: 42, color: "#111827" },
                            { name: "Python Mastery", short: "PY", pct: 31, color: "#374151" },
                            { name: "Business Strategy", short: "MB", pct: 18, color: "#9ca3af" },
                        ].map((cat, i) => (
                            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                                <Box sx={{ width: 32, height: 32, borderRadius: "8px", backgroundColor: cat.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{cat.short}</Typography>
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                        <Typography sx={{ fontSize: 13, fontWeight: 500, color: C.text }}>{cat.name}</Typography>
                                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.text }}>{cat.pct}%</Typography>
                                    </Box>
                                    <Box sx={{ height: 4, backgroundColor: "#f3f4f6", borderRadius: "999px" }}>
                                        <Box sx={{ height: 4, width: `${cat.pct}%`, backgroundColor: cat.color, borderRadius: "999px" }} />
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.text, fontWeight: 600, cursor: "pointer", "&:hover": { color: C.text_secondary } }}>View All Reports →</Typography>
                        </Box>
                    </Box>
                </Box>

                {/* ── Recent Orders ── */}
                <Box sx={{ backgroundColor: C.card, borderRadius: "12px", p: 3, border: `1px solid ${C.border}` }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                        <Typography sx={{ fontSize: 15, fontWeight: 600, color: C.text }}>Recent Orders</Typography>
                        <Typography sx={{ fontSize: 13, fontWeight: 500, color: C.text_secondary, cursor: "pointer", "&:hover": { color: C.text } }}>Download CSV →</Typography>
                    </Box>
                    {/* 表头 */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1.5fr 1fr", pb: 1, mb: 1, borderBottom: `1px solid ${C.border}` }}>
                        {["COURSE", "USER", "AMOUNT", "DATE", "STATUS"].map(h => (
                            <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: C.label, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</Typography>
                        ))}
                    </Box>
                    {/* 数据行 */}
                    {recentOrders.map((order, i) => (
                        <Box
                            key={i}
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "2fr 2fr 1fr 1.5fr 1fr",
                                py: 1.5,
                                borderBottom: i < recentOrders.length - 1 ? `1px solid ${C.border}` : "none",
                                alignItems: "center",
                                "&:hover": { backgroundColor: "#f9fafb" },
                                borderRadius: "6px",
                            }}
                        >
                            <Typography sx={{ fontSize: 13, fontWeight: 500, color: C.text }}>{order.course}</Typography>
                            <Typography sx={{ fontSize: 13, color: C.text_secondary }}>{order.user}</Typography>
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.text }}>{order.amount}</Typography>
                            <Typography sx={{ fontSize: 13, color: C.text_secondary }}>{order.date}</Typography>
                            <Box sx={{ display: "inline-flex" }}>
                                <Typography sx={{
                                    fontSize: 11, fontWeight: 700,
                                    px: 1.5, py: 0.4, borderRadius: "999px",
                                    backgroundColor: statusColor[order.status].bg,
                                    color: statusColor[order.status].text,
                                    letterSpacing: "0.04em",
                                }}>
                                    {order.status}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default AdminDashboardPage;
