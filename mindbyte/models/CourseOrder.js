import mongoose from "mongoose";

const { Schema } = mongoose;

const CourseOrderSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        // 购买时的课程快照，防止课程信息变更影响历史订单
        course: {
            curriculumId: {
                type: Schema.Types.ObjectId,
                ref: "Curriculum",
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
                min: 0,
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

export default mongoose.models.CourseOrder || mongoose.model("CourseOrder", CourseOrderSchema);
