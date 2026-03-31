import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/utils/dbConnect";
import SubscriptionOrder from "@/models/SubscriptionOrder";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/subscription/webhook
export async function POST(req) {
    await dbConnect();

    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json({ err: "Invalid signature" }, { status: 400 });
    }

    // 处理支付成功事件
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const { orderId } = session.metadata;

        try {
            await SubscriptionOrder.findByIdAndUpdate(orderId, {
                orderStatus: "Paid",
                "payment.status": "Paid",
                "payment.transactionId": session.payment_intent,
            });
        } catch (error) {
            console.error("Webhook order update error:", error);
            return NextResponse.json({ err: "Error updating order" }, { status: 500 });
        }
    }

    // 处理退款事件
    if (event.type === "charge.refunded") {
        const charge = event.data.object;
        const orderId = charge.metadata?.orderId;
        if (orderId) {
            await SubscriptionOrder.findByIdAndUpdate(orderId, {
                orderStatus: "Refunded",
                "payment.status": "Refunded",
                "refund.amount": charge.amount_refunded / 100,
                "refund.refundedAt": new Date(),
            });
        }
    }

    return NextResponse.json({ received: true });
}
