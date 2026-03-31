"use client";

import { Box, Typography, Avatar } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { format } from "date-fns";

const statusColor = (s) => {
    if (s === "Paid")      return "#16a34a";
    if (s === "Cancelled") return "#dc2626";
    return "#d97706";
};

export default function OverviewSection({ session, subscription, orders, onNavigate }) {
    const user = session?.user;

    const recentActivity = [
        ...orders.subscriptionOrders.map((o) => ({
            id: o._id,
            description: `${o.plan?.type?.charAt(0).toUpperCase() + o.plan?.type?.slice(1)} Subscription`,
            amount: o.totalPrice,
            date: o.createdAt,
            status: o.orderStatus,
            type: "subscription",
        })),
        ...orders.courseOrders.map((o) => ({
            id: o._id,
            description: o.course?.title,
            amount: o.totalPrice,
            date: o.createdAt,
            status: o.orderStatus,
            type: "course",
        })),
    ]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    const courseOrders = orders.courseOrders || [];

    return (
        <Box sx={{ p: { xs: 4, md: 6 }, pt: { xs: 4, md: 4 } }}>
            {/* Greeting + Avatar */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 5 }}>
                <Avatar
                    src={user?.image}
                    sx={{ width: 64, height: 64, bgcolor: "#111827", fontSize: 24, flexShrink: 0 }}
                >
                    {user?.name?.[0]?.toUpperCase()}
                </Avatar>
                <Box>
                    <Typography sx={{ fontSize: { xs: 24, md: 32 }, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>
                        Welcome back, {user?.name?.split(" ")[0] || "there"}
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: "#6b7280", mt: 0.5 }}>
                        Your intellectual workspace is up to date.
                    </Typography>
                </Box>
            </Box>

            {/* Stat cards */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, mb: 5 }}>

                {/* Subscription Status */}
                <Box sx={{ p: 3, borderBottom: "2px solid #e5e7eb", borderRight: { md: "1px solid #e5e7eb" }, display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            Subscription Status
                        </Typography>
                        <CheckCircleIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                        <Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>
                                    {subscription?.active ? "Active" : "Inactive"}
                                </Typography>
                                {subscription?.active && <Box sx={{ width: 8, height: 8, bgcolor: "#16a34a", borderRadius: "50%" }} />}
                            </Box>
                            <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
                                {subscription?.active ? "Verified professional account" : "No active plan"}
                            </Typography>
                        </Box>
                        {/* Upgrade / Change Plan */}
                        <Box
                            onClick={() => onNavigate("subscription")}
                            sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer", bgcolor: "#fbbf24", borderRadius: "20px", px: 1.5, py: 0.6, "&:hover": { bgcolor: "#f59e0b" } }}
                        >
                            <StarIcon sx={{ fontSize: 15, color: "#111827" }} />
                            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                                {subscription?.active ? "Change Plan" : "Upgrade"}
                            </Typography>
                            <ArrowForwardIcon sx={{ fontSize: 14, color: "#111827" }} />
                        </Box>
                    </Box>
                </Box>

                {/* Current Plan */}
                <Box sx={{ p: 3, borderBottom: "2px solid #e5e7eb", borderRight: { md: "1px solid #e5e7eb" } }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            Current Plan
                        </Typography>
                        <CalendarTodayIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                    </Box>
                    <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#111827", mb: 0.5 }}>
                        {subscription?.active ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1) : "—"}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
                        {subscription?.active ? `$${orders.subscriptionOrders?.[0]?.totalPrice ?? "—"} per billing cycle` : "No plan selected"}
                    </Typography>
                </Box>

                {/* Expiry Date */}
                <Box sx={{ p: 3, borderBottom: "2px solid #e5e7eb" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            Expiry Date
                        </Typography>
                        <CalendarTodayIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                    </Box>
                    <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#111827", mb: 0.5 }}>
                        {subscription?.active ? format(new Date(subscription.expiresAt), "MMM dd, yyyy") : "—"}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
                        {subscription?.active ? "Auto-renewal enabled" : "—"}
                    </Typography>
                </Box>
            </Box>

            {/* My Courses (left 2 cols) + Recent Activity (right 1 col) */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2.5, mb: 4 }}>

                {/* My Courses — span 2，pl 与 stat card 内边距对齐 */}
                <Box sx={{ gridColumn: { md: "span 2" }, pl: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>My Courses</Typography>
                        <Typography
                            onClick={() => onNavigate("courses")}
                            sx={{ fontSize: 12, fontWeight: 600, color: "#6b7280", cursor: "pointer", letterSpacing: "0.04em", "&:hover": { color: "#111827" } }}
                        >
                            VIEW ALL
                        </Typography>
                    </Box>

                    {courseOrders.length === 0 ? (
                        <Box sx={{ py: 5, textAlign: "center" }}>
                            <MenuBookIcon sx={{ fontSize: 36, color: "#e5e7eb", mb: 1 }} />
                            <Typography sx={{ fontSize: 13, color: "#9ca3af" }}>No courses purchased yet.</Typography>
                        </Box>
                    ) : (
                        <>
                            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 80px", gap: 2, pb: 1.5, borderBottom: "1px solid #e5e7eb" }}>
                                {["COURSE", "PRICE", "DATE", "STATUS"].map((h) => (
                                    <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.06em" }}>{h}</Typography>
                                ))}
                            </Box>
                            {courseOrders.slice(0, 4).map((order, i) => (
                                <Box
                                    key={order._id}
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 80px 100px 80px",
                                        gap: 2,
                                        py: 2,
                                        alignItems: "center",
                                        borderBottom: i < Math.min(courseOrders.length, 4) - 1 ? "1px solid #e5e7eb" : "none",
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <MenuBookIcon sx={{ fontSize: 14, color: "#374151" }} />
                                        </Box>
                                        <Typography sx={{ fontSize: 13, color: "#111827" }}>{order.course?.title}</Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>${order.course?.price}</Typography>
                                    <Typography sx={{ fontSize: 13, color: "#6b7280" }}>{format(new Date(order.createdAt), "MMM dd, yyyy")}</Typography>
                                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: statusColor(order.orderStatus), letterSpacing: "0.04em" }}>
                                        {order.orderStatus.toUpperCase()}
                                    </Typography>
                                </Box>
                            ))}
                        </>
                    )}
                </Box>

                {/* Recent Activity — right 1 col，pl 与 stat card 内边距对齐 */}
                <Box sx={{ pl: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>Recent Activity</Typography>
                        <Typography
                            onClick={() => onNavigate("billing")}
                            sx={{ fontSize: 12, fontWeight: 600, color: "#6b7280", cursor: "pointer", letterSpacing: "0.04em", "&:hover": { color: "#111827" } }}
                        >
                            VIEW ALL
                        </Typography>
                    </Box>

                    <Box sx={{ pb: 1.5, borderBottom: "1px solid #e5e7eb", mb: 0 }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.06em" }}>DESCRIPTION</Typography>
                    </Box>

                    {recentActivity.length === 0 ? (
                        <Box sx={{ py: 5, textAlign: "center" }}>
                            <Typography sx={{ fontSize: 13, color: "#9ca3af" }}>No activity yet.</Typography>
                        </Box>
                    ) : (
                        recentActivity.map((item, i) => (
                            <Box
                                key={item.id}
                                sx={{
                                    py: 2,
                                    borderBottom: i < recentActivity.length - 1 ? "1px solid #e5e7eb" : "none",
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                                    <Box sx={{ width: 26, height: 26, borderRadius: "50%", bgcolor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        {item.type === "subscription"
                                            ? <StarBorderIcon sx={{ fontSize: 13, color: "#374151" }} />
                                            : <MenuBookIcon sx={{ fontSize: 13, color: "#374151" }} />
                                        }
                                    </Box>
                                    <Typography sx={{ fontSize: 13, color: "#111827" }}>{item.description}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", pl: 4.5 }}>
                                    <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>{format(new Date(item.date), "MMM dd, yyyy")}</Typography>
                                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: statusColor(item.status) }}>
                                        {item.status.toUpperCase()}
                                    </Typography>
                                </Box>
                            </Box>
                        ))
                    )}
                </Box>
            </Box>

            {/* Featured Courses */}
            <Box sx={{ mb: 4, pl: 3 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#111827", mb: 2 }}>Featured Courses</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2.5 }}>
                    {[
                        { title: "JavaScript Fundamentals", img: "/images/c-js.jpg" },
                        { title: "Java for Beginners",      img: "/images/c-java.jpg" },
                        { title: "Build & Ship Products",   img: "/images/bg.jpg" },
                    ].map((course) => (
                        <Box
                            key={course.title}
                            sx={{
                                borderRadius: "8px",
                                overflow: "hidden",
                                border: "1px solid #e5e7eb",
                                bgcolor: "#fff",
                                cursor: "default",
                            }}
                        >
                            <Box sx={{ height: 300, overflow: "hidden" }}>
                                <img
                                    src={course.img}
                                    alt={course.title}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                />
                            </Box>
                            <Box sx={{ p: 2 }}>
                                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{course.title}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>

        </Box>
    );
}
