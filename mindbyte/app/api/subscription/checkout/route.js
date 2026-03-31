import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
import SubscriptionOrder from "@/models/SubscriptionOrder";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLANS = {
    daily:   { price: 0.99,  days: 1,   label: "Daily Plan"   },
    monthly: { price: 20,    days: 30,  label: "Monthly Plan" },
    yearly:  { price: 199,   days: 365, label: "Yearly Plan"  },
};

// POST /api/subscription/checkout
export async function POST(req) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
    }

    try {
        const { plan } = await req.json();

        if (!PLANS[plan]) {
            return NextResponse.json({ err: "Invalid plan" }, { status: 400 });
        }

        const { price, days, label } = PLANS[plan];

        // 计算订阅起始时间（升级逻辑）
        const now = new Date();
        const existing = await SubscriptionOrder.findOne({
            userId: session.user._id,
            orderStatus: "Paid",
            "plan.expiresAt": { $gt: now },
        }).sort({ createdAt: -1 });

        const startDate = existing ? new Date(existing.plan.expiresAt) : now;
        const expiresAt = new Date(startDate);
        expiresAt.setDate(expiresAt.getDate() + days);

        // 先创建 Pending 订单
        const order = await SubscriptionOrder.create({
            userId: session.user._id,
            plan: { type: plan, price, startDate, expiresAt },
            totalPrice: price,
            orderStatus: "Pending",
            payment: {
                method: "Stripe",
                status: "Pending",
            },
        });

        // 创建 Stripe Checkout Session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: { name: `MindByte ${label}` },
                        unit_amount: Math.round(price * 100), // Stripe 用分计价
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/Subscribe?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/Subscribe?cancelled=true`,
            metadata: {
                orderId: order._id.toString(),
                userId: session.user._id.toString(),
            },
        });

        return NextResponse.json({ url: checkoutSession.url });

    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ err: "Error creating checkout session" }, { status: 500 });
    }
}
