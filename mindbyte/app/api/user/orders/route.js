import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
import SubscriptionOrder from "@/models/SubscriptionOrder";
import CourseOrder from "@/models/CourseOrder";

// GET /api/user/orders
export async function GET() {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ err: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user._id;

    const [subscriptionOrders, courseOrders] = await Promise.all([
        SubscriptionOrder.find({ userId }).sort({ createdAt: -1 }).lean(),
        CourseOrder.find({ userId }).sort({ createdAt: -1 }).lean(),
    ]);

    return NextResponse.json({ subscriptionOrders, courseOrders });
}
