import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";



// 配置 S3 客户端
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  
  export async function POST(req) {
    const { image } = await req.json();  // image 是 base64 字符串
  
    await dbConnect();
  
    try {
      // 把 base64 转成 Buffer
      // image 格式通常是 "data:image/jpeg;base64,/9j/4AAQ..."
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
  
      // 从 base64 头部提取文件类型，例如 "image/jpeg"
      const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";
      const extension = mimeType.split("/")[1];
      const fileName = `uploads/${Date.now()}.${extension}`;  // 生成唯一文件名
  
      // 上传到 S3
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: mimeType,
      });
  
      await s3.send(command);
  
      // 拼接 S3 文件的公开 URL
      const url = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${fileName}`;
  
      return NextResponse.json({ url });
  
    } catch (err) {
      return NextResponse.json(
        { err: err.message },
        { status: 500 }
      );
    }
  }
