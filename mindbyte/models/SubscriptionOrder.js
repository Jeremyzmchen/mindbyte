import mongoose from "mongoose";

const { Schema } = mongoose;

const SubscriptionOrderSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        plan: {
            type: {
                type: String,
                enum: ["daily", "monthly", "yearly"],
                required: true,
            },
            price: {
                type: Number,
                required: true,
                min: 0,
            },
            startDate: {
                type: Date,
                required: true,
            },
            expiresAt: {
                type: Date,
                required: true,
            },
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            default: "USD",
        },

        orderStatus: {
            type: String,
            enum: ["Pending", "Paid", "Cancelled", "Refunded"],
            default: "Pending",
            index: true,
        },

        payment: {
            method: {
                type: String,
                enum: ["Stripe", "PayPal", "Apple Pay", "Google Pay", "Alipay", "WeChat Pay"],
                required: true,
            },
            status: {
                type: String,
                enum: ["Pending", "Paid", "Failed", "Refunded"],
                default: "Pending",
            },
            transactionId: {
                type: String,
                index: true,
            },
        },

        coupon: {
            code: String,
            discountAmount: {
                type: Number,
                default: 0,
            },
        },

        refund: {
            amount: Number,
            reason: String,
            refundedAt: Date,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.SubscriptionOrder || mongoose.model("SubscriptionOrder", SubscriptionOrderSchema);
