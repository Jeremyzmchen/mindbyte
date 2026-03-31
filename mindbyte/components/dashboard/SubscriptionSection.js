"use client";

import { useState } from "react";
import { Box, Typography, Button, Chip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { differenceInDays, format } from "date-fns";

const plans = [
    { key: "daily",   label: "Daily Pass",  period: "/ day",   price: 0.99, tag: "SHORT TERM", features: ["Full Access", "No Commitment"] },
    { key: "monthly", label: "Monthly",     period: "/ month", price: 20,   tag: "STANDARD",  features: ["AI In-depth Knowledge", "Priority Support"], highlight: true },
    { key: "yearly",  label: "Yearly",      period: "/ year",  price: 199,  tag: "LONG TERM", features: ["2 Months Free", "All Premium Features"] },
];

export default function SubscriptionSection({ subscription, router, refreshSubscription }) {
    const [cancelling, setCancelling] = useState(false);

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel your subscription?")) return;
        setCancelling(true);
        await fetch("/api/subscription/cancel", { method: "POST" });
        await refreshSubscription();
        setCancelling(false);
    };

    const handleSelectPlan = async (planKey) => {
        const res = await fetch("/api/subscription/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan: planKey }),
        });
        const data = await res.json();
        if (data.url) router.push(data.url);
    };

    const daysRemaining = subscription?.active
        ? differenceInDays(new Date(subscription.expiresAt), new Date())
        : null;

    return (
        <Box sx={{ p: { xs: 4, md: 6 } }}>
            <Typography sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 800, color: "#111827", mb: 5 }}>
                Subscription
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 280px" }, gap: 4 }}>
                <Box>
                    {/* Current plan card */}
                    {subscription?.active ? (
                        <Box sx={{ bgcolor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", p: 4, mb: 4 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                                <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                    Current Plan
                                </Typography>
                                <Chip label="MOST POPULAR" size="small" sx={{ bgcolor: "#111827", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em" }} />
                            </Box>
                            <Typography sx={{ fontSize: 28, fontWeight: 800, color: "#111827", mb: 2 }}>
                                {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                                    <Box sx={{ width: 8, height: 8, bgcolor: "#16a34a", borderRadius: "50%" }} />
                                    <Typography sx={{ fontSize: 13, color: "#374151" }}>Status: Active</Typography>
                                </Box>
                                <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
                                    {daysRemaining} days remaining
                                </Typography>
                            </Box>
                            <Typography sx={{ fontSize: 12, color: "#9ca3af", mb: 3 }}>
                                Expires on {format(new Date(subscription.expiresAt), "MMM dd, yyyy")}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Button
                                    disabled={cancelling}
                                    onClick={handleCancel}
                                    sx={{
                                        textTransform: "none",
                                        fontSize: 13,
                                        color: "#374151",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        px: 3,
                                        "&:hover": { bgcolor: "#fef2f2", borderColor: "#fecaca", color: "#dc2626" },
                                    }}
                                >
                                    {cancelling ? "Cancelling..." : "Cancel Subscription"}
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ bgcolor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", p: 4, mb: 4 }}>
                            <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#111827", mb: 1 }}>No active subscription</Typography>
                            <Typography sx={{ fontSize: 13, color: "#6b7280" }}>Choose a plan below to get started.</Typography>
                        </Box>
                    )}

                    {/* Available plans */}
                    <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#111827", mb: 2 }}>Available Plans</Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2 }}>
                        {plans.map((plan) => {
                            const isCurrent = subscription?.active && subscription.plan === plan.key;
                            return (
                                <Box
                                    key={plan.key}
                                    sx={{
                                        bgcolor: "#fff",
                                        border: isCurrent ? "2px solid #111827" : "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        p: 3,
                                        position: "relative",
                                    }}
                                >
                                    {isCurrent && (
                                        <Chip label="CURRENT" size="small" sx={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", bgcolor: "#111827", color: "#fff", fontSize: 10, fontWeight: 700 }} />
                                    )}
                                    <Typography sx={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.08em", mb: 1 }}>{plan.tag}</Typography>
                                    <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827", mb: 1 }}>{plan.label}</Typography>
                                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5, mb: 2 }}>
                                        <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>${plan.price}</Typography>
                                        <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>{plan.period}</Typography>
                                    </Box>
                                    {plan.features.map((f) => (
                                        <Box key={f} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.8 }}>
                                            <CheckIcon sx={{ fontSize: 13, color: "#16a34a" }} />
                                            <Typography sx={{ fontSize: 12, color: "#374151" }}>{f}</Typography>
                                        </Box>
                                    ))}
                                    <Button
                                        fullWidth
                                        disabled={isCurrent}
                                        onClick={() => !isCurrent && handleSelectPlan(plan.key)}
                                        sx={{
                                            mt: 2,
                                            textTransform: "none",
                                            fontSize: 13,
                                            fontWeight: 600,
                                            borderRadius: "8px",
                                            border: "1px solid #e5e7eb",
                                            color: isCurrent ? "#9ca3af" : "#111827",
                                            "&:hover": { bgcolor: "#f3f4f6" },
                                            "&.Mui-disabled": { color: "#9ca3af", border: "1px solid #e5e7eb" },
                                        }}
                                    >
                                        {isCurrent ? "Currently Active" : "Select Plan"}
                                    </Button>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                {/* Right panel placeholder */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box sx={{ bgcolor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", p: 3 }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", mb: 2 }}>
                            Need assistance?
                        </Typography>
                        <Typography sx={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                            Contact us if you have questions about your plan or billing.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
