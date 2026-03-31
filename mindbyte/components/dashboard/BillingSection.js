"use client";

import { Box, Typography, Chip, Button } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { format } from "date-fns";

const statusStyle = (s) => {
    if (s === "Paid")      return { bgcolor: "#dcfce7", color: "#16a34a" };
    if (s === "Cancelled") return { bgcolor: "#fef2f2", color: "#dc2626" };
    if (s === "Refunded")  return { bgcolor: "#fef9c3", color: "#b45309" };
    return { bgcolor: "#f3f4f6", color: "#6b7280" };
};

export default function BillingSection({ subscription, orders, router }) {
    const subOrders = orders.subscriptionOrders || [];

    return (
        <Box sx={{ p: { xs: 4, md: 6 } }}>
            <Typography sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 800, color: "#111827", mb: 1 }}>
                Billing &amp; Payments
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#6b7280", mb: 5 }}>
                Manage your subscription, and view your transaction history.
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 280px" }, gap: 4, mb: 4 }}>
                {/* Active plan summary */}
                <Box sx={{ bgcolor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", p: 4 }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.08em", mb: 2 }}>ACTIVE PLAN</Typography>
                    {subscription?.active ? (
                        <>
                            <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#111827", mb: 2 }}>
                                MindByte {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: "#6b7280", mb: 0.5 }}>
                                Expires on {format(new Date(subscription.expiresAt), "MMMM dd, yyyy")}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                                <Button
                                    onClick={() => router.push("/Subscribe")}
                                    sx={{
                                        textTransform: "none",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        bgcolor: "#111827",
                                        color: "#fff",
                                        borderRadius: "8px",
                                        px: 3,
                                        "&:hover": { bgcolor: "#374151" },
                                    }}
                                >
                                    Manage Subscription
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Typography sx={{ fontSize: 15, color: "#6b7280", mb: 3 }}>No active plan</Typography>
                            <Button
                                onClick={() => router.push("/Subscribe")}
                                sx={{
                                    textTransform: "none",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    bgcolor: "#111827",
                                    color: "#fff",
                                    borderRadius: "8px",
                                    px: 3,
                                    "&:hover": { bgcolor: "#374151" },
                                }}
                            >
                                View Plans
                            </Button>
                        </>
                    )}
                </Box>

                {/* FAQ box */}
                <Box sx={{ bgcolor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", p: 4 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#111827", mb: 2 }}>Common Questions</Typography>
                    {[
                        { q: "When will I be billed?", a: "Subscriptions are billed at the start of each billing cycle." },
                        { q: "How do I cancel?", a: "Go to Subscription and click Cancel Subscription. Access continues until period ends." },
                    ].map(({ q, a }) => (
                        <Box key={q} sx={{ mb: 2 }}>
                            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", mb: 0.5 }}>{q}</Typography>
                            <Typography sx={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6 }}>{a}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Billing history table */}
            <Box sx={{ bgcolor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 3, py: 2.5, borderBottom: "1px solid #f3f4f6" }}>
                    <ReceiptLongIcon sx={{ fontSize: 16, color: "#6b7280" }} />
                    <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>Billing History</Typography>
                </Box>

                {subOrders.length === 0 ? (
                    <Box sx={{ px: 3, py: 5, textAlign: "center" }}>
                        <Typography sx={{ fontSize: 13, color: "#9ca3af" }}>No billing history yet.</Typography>
                    </Box>
                ) : (
                    <>
                        {/* Table header */}
                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 90px 100px 1fr 120px", gap: 2, px: 3, py: 1.5, borderBottom: "1px solid #f3f4f6" }}>
                            {["PLAN", "AMOUNT", "STATUS", "PERIOD", "DATE"].map((h) => (
                                <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.06em" }}>{h}</Typography>
                            ))}
                        </Box>
                        {subOrders.map((order, i) => (
                            <Box
                                key={order._id}
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 90px 100px 1fr 120px",
                                    gap: 2,
                                    px: 3,
                                    py: 2,
                                    alignItems: "center",
                                    borderBottom: i < subOrders.length - 1 ? "1px solid #f9fafb" : "none",
                                    "&:hover": { bgcolor: "#fafafa" },
                                }}
                            >
                                <Typography sx={{ fontSize: 13, color: "#111827", textTransform: "capitalize" }}>
                                    MindByte {order.plan?.type}
                                </Typography>
                                <Typography sx={{ fontSize: 13, color: "#111827" }}>${order.totalPrice}</Typography>
                                <Chip
                                    label={order.orderStatus}
                                    size="small"
                                    sx={{ fontSize: 11, fontWeight: 600, width: "fit-content", ...statusStyle(order.orderStatus) }}
                                />
                                <Typography sx={{ fontSize: 12, color: "#6b7280" }}>
                                    {format(new Date(order.plan.startDate), "MMM dd")} — {format(new Date(order.plan.expiresAt), "MMM dd, yyyy")}
                                </Typography>
                                <Typography sx={{ fontSize: 12, color: "#6b7280" }}>
                                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                                </Typography>
                            </Box>
                        ))}
                    </>
                )}
            </Box>
        </Box>
    );
}
