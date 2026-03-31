import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
import SubscriptionOrder from "@/models/SubscriptionOrder";

// GET /api/subscription/status
export async function GET() {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
    }

    try {
        // 查找该用户最新一条已付款且未过期的订阅
        const now = new Date();
        const active = await SubscriptionOrder.findOne({
            userId: session.user._id,
            orderStatus: "Paid",
            "plan.expiresAt": { $gt: now },
        }).sort({ createdAt: -1 });

        if (!active) {
            return NextResponse.json({ active: false });
        }

        return NextResponse.json({
            active: true,
            plan: active.plan.type,
            expiresAt: active.plan.expiresAt,
        });

    } catch (error) {
        console.error("Subscription status error:", error);
        return NextResponse.json({ err: "Error fetching subscription status" }, { status: 500 });
    }
}
