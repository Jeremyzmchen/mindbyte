import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/user";
import dbConnect from "@/utils/dbConnect";

// ============================================================
// reCAPTCHA 验证函数（带重试机制）
// token   - 前端传来的 reCAPTCHA token
// retries - 最大重试次数，默认 3 次
// ============================================================
const verifyRecaptcha = async (token, retries = 3) => {
    // 从环境变量读取密钥，不硬编码在代码里
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const url = "https://www.google.com/recaptcha/api/siteverify";
    const params = `secret=${secretKey}&response=${token}`;

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            // 用 Next.js 内置的 fetch，不需要额外安装 node-fetch
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params,
            });
            const data = await response.json();

            if (data.success) {
                return true;
            } else {
                console.log(`reCAPTCHA verification failed: ${data["error-codes"]}`);
                return false;
            }
        } catch (error) {
            console.log(`Attempt ${attempt + 1} failed: ${error.message}`);
            if (attempt === retries - 1) {
                throw new Error("All reCAPTCHA verification attempts failed");
            }
        }
    }
};

// ============================================================
// POST /api/register - 用户注册接口
// ============================================================
export async function POST(req) {
    await dbConnect();

    const body = await req.json();
    const { name, email, password, organization, recaptchaToken } = body;

    try {
        // 检查邮箱是否已注册
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // 409 Conflict 语义更准确，表示资源冲突
            return NextResponse.json({ err: "Email already in use" }, { status: 409 });
        }

        // 验证 reCAPTCHA
        const isHuman = await verifyRecaptcha(recaptchaToken);
        if (!isHuman) {
            return NextResponse.json(
                { err: "reCAPTCHA verification failed, please try again" },
                { status: 400 }
            );
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);

        // 创建用户
        const user = await new User({
            name,
            email,
            password: hashedPassword,
            organization,
        }).save();

        return NextResponse.json(
            { msg: "User created successfully", user },
            { status: 201 }
        );

    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json(
            { err: "Error creating user" },
            { status: 500 }
        );
    }
}