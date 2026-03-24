import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
// import { getToken } from "next-auth/jwt";
import { authOptions } from "@/utils/authOptions";

// 初始化 S3 客户端
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export async function POST(request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    console.log("session:", session);

    // 检查是否登录
    if (!session?.user?._id) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    // console.log("token:", token);

    // if (!token?.user?._id) {
    //     return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    // }

    try {
        // 获取前端发来的图片文件
        const formData = await request.formData();
        const file = formData.get("avatar");

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // 把文件转成 Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // 生成唯一文件名
        const fileName = `avatars/${session.user._id}-${Date.now()}.${file.type.split("/")[1]}`;
        // const fileName = `avatars/${token.user._id}-${Date.now()}.${file.type.split("/")[1]}`
        

        // 上传到 S3
        await s3.send(new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: file.type,
        }));

        // 生成图片 URL
        const imageUrl = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${fileName}`;

        // 更新数据库里的用户头像
        await User.findByIdAndUpdate(session.user._id, { image: imageUrl });
        // await User.findByIdAndUpdate(token.user._id, { image: imageUrl });

        return NextResponse.json({ message: "Avatar updated successfully", imageUrl }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}