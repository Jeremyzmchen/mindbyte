import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
import SubscriptionOrder from "@/models/SubscriptionOrder";

// 套餐配置
const PLANS = {
    daily:   { price: 0.99,  days: 1   },
    monthly: { price: 20,    days: 30  },
    yearly:  { price: 199,   days: 365 },
};

// POST /api/subscription/create
export async function POST(req) {
    await dbConnect();

    // 先验证登陆状态
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
    }

    try {
        const { plan, paymentMethod } = await req.json();

        if (!PLANS[plan]) {
            return NextResponse.json({ err: "Invalid plan" }, { status: 400 });
        }
        
        const { price, days } = PLANS[plan];

        // 如果已有有效订阅，从旧订阅到期时间开始续期（升级逻辑）
        const now = new Date();
        const existing = await SubscriptionOrder.findOne({
            userId: session.user._id,
            orderStatus: "Paid",
            "plan.expiresAt": { $gt: now },
        }).sort({ createdAt: -1 });

        const startDate = existing ? new Date(existing.plan.expiresAt) : now;
        const expiresAt = new Date(startDate);
        expiresAt.setDate(expiresAt.getDate() + days);

        const order = await SubscriptionOrder.create({
            userId: session.user._id,
            plan: { type: plan, price, startDate, expiresAt },
            totalPrice: price,
            // 支付组件处理状态，成功后从 Pending 改为 Paid。
            orderStatus: "Pending",
            payment: {
                method: paymentMethod,
                status: "Pending",
            },
        });

        return NextResponse.json({ msg: "Order created", order }, { status: 201 });

    } catch (error) {
        console.error("Subscription create error:", error);
        return NextResponse.json({ err: "Error creating subscription" }, { status: 500 });
    }
}
