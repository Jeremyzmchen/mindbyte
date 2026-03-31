"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import OverviewSection from "@/components/dashboard/OverviewSection";
import SubscriptionSection from "@/components/dashboard/SubscriptionSection";
import CoursesSection from "@/components/dashboard/CoursesSection";
import BillingSection from "@/components/dashboard/BillingSection";

export default function UserDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [activeSection, setActiveSection] = useState("overview");
    const [subscription, setSubscription] = useState(null);
    const [orders, setOrders] = useState({ subscriptionOrders: [], courseOrders: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status]);

    useEffect(() => {
        if (status !== "authenticated") return;
        Promise.all([
            fetch("/api/subscription/status").then((r) => r.json()),
            fetch("/api/user/orders").then((r) => r.json()),
        ]).then(([subData, orderData]) => {
            setSubscription(subData);
            setOrders(orderData);
            setLoading(false);
        });
    }, [status]);

    const refreshSubscription = async () => {
        const subData = await fetch("/api/subscription/status").then((r) => r.json());
        setSubscription(subData);
    };

    if (status === "loading" || loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <CircularProgress sx={{ color: "#111827" }} />
            </Box>
        );
    }

    const sectionProps = { subscription, orders, session, refreshSubscription, router };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f9fafb" }}>
            {/* Sidebar */}
            <DashboardSidebar
                active={activeSection}
                onChange={setActiveSection}
                user={session?.user}
            />

            {/* Main content */}
            <Box sx={{ flex: 1, overflow: "auto" }}>
                {activeSection === "overview"      && <OverviewSection {...sectionProps} onNavigate={setActiveSection} />}
                {activeSection === "subscription"  && <SubscriptionSection {...sectionProps} />}
                {activeSection === "courses"       && <CoursesSection {...sectionProps} />}
                {activeSection === "billing"       && <BillingSection {...sectionProps} />}
            </Box>
        </Box>
    );
}
