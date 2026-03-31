import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
import SubscriptionOrder from "@/models/SubscriptionOrder";

// POST /api/subscription/cancel
export async function POST() {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
    }

    try {
        // 找到最新一条有效订阅
        const now = new Date();
        const active = await SubscriptionOrder.findOne({
            userId: session.user._id,
            orderStatus: "Paid",
            "plan.expiresAt": { $gt: now },
        }).sort({ createdAt: -1 });

        if (!active) {
            return NextResponse.json({ err: "No active subscription found" }, { status: 404 });
        }

        active.orderStatus = "Cancelled";
        await active.save();

        return NextResponse.json({ msg: "Subscription cancelled" });

    } catch (error) {
        console.error("Subscription cancel error:", error);
        return NextResponse.json({ err: "Error cancelling subscription" }, { status: 500 });
    }
}
