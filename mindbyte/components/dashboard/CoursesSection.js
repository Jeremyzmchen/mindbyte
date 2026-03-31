"use client";

import { Box, Typography, Chip, Button } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { format } from "date-fns";

export default function CoursesSection({ orders, router }) {
    const courseOrders = orders.courseOrders || [];

    return (
        <Box sx={{ p: { xs: 4, md: 6 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 5 }}>
                <Box>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.5 }}>
                        Learning Dashboard
                    </Typography>
                    <Typography sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 800, color: "#111827" }}>
                        My Courses
                    </Typography>
                </Box>
                <Button
                    onClick={() => router.push("/")}
                    sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: 13,
                        bgcolor: "#111827",
                        color: "#fff",
                        borderRadius: "8px",
                        px: 3,
                        "&:hover": { bgcolor: "#374151" },
                    }}
                >
                    + Explore Courses
                </Button>
            </Box>

            {courseOrders.length === 0 ? (
                <Box sx={{ bgcolor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", p: 8, textAlign: "center" }}>
                    <MenuBookIcon sx={{ fontSize: 40, color: "#e5e7eb", mb: 2 }} />
                    <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#111827", mb: 1 }}>No courses yet</Typography>
                    <Typography sx={{ fontSize: 13, color: "#9ca3af", mb: 3 }}>Start learning by purchasing your first course.</Typography>
                    <Button
                        onClick={() => router.push("/")}
                        sx={{
                            textTransform: "none",
                            fontSize: 13,
                            fontWeight: 600,
                            border: "1px solid #e5e7eb",
                            color: "#111827",
                            borderRadius: "8px",
                            px: 3,
                            "&:hover": { bgcolor: "#f3f4f6" },
                        }}
                    >
                        Browse Courses
                    </Button>
                </Box>
            ) : (
                <Box sx={{ bgcolor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
                    {/* Table header */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 130px 80px", gap: 2, px: 3, py: 2, borderBottom: "1px solid #f3f4f6" }}>
                        {["COURSE NAME", "PRICE", "STATUS", "PURCHASE DATE", "ACTION"].map((h) => (
                            <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.06em" }}>{h}</Typography>
                        ))}
                    </Box>
                    {courseOrders.map((order, i) => (
                        <Box
                            key={order._id}
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "1fr 100px 100px 130px 80px",
                                gap: 2,
                                px: 3,
                                py: 2.5,
                                alignItems: "center",
                                borderBottom: i < courseOrders.length - 1 ? "1px solid #f9fafb" : "none",
                                "&:hover": { bgcolor: "#fafafa" },
                            }}
                        >
                            <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
                                {order.course?.title}
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: "#374151" }}>${order.course?.price}</Typography>
                            <Chip
                                label={order.orderStatus}
                                size="small"
                                sx={{
                                    fontSize: 11, fontWeight: 600,
                                    bgcolor: order.orderStatus === "Paid" ? "#dcfce7" : "#f3f4f6",
                                    color: order.orderStatus === "Paid" ? "#16a34a" : "#6b7280",
                                    width: "fit-content",
                                }}
                            />
                            <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
                                {format(new Date(order.createdAt), "MMM dd, yyyy")}
                            </Typography>
                            <Typography
                                sx={{ fontSize: 13, fontWeight: 600, color: "#111827", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                            >
                                {order.orderStatus === "Paid" ? "Resume" : "Details"}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}
