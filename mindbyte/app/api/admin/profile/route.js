import { after, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import bcrypt from "bcrypt";

export async function POST(request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const { name, email, password } = await request.json();

    try {
        if (!session?.user?._id) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        let updateUser = await User.findByIdAndUpdate(
            session?.user?._id,
            { name, email, password: await bcrypt.hash(password, 10) },
            { returnDocument: "after" }
        );

        if(!updateUser) {
            return NextResponse.json({error: "User not found"}, {status: 500})
        }

        return NextResponse.json(
            {message: "User updated successfully", user: updateUser},
            {status: 200},
        );

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request) { 
    await dbConnect();
    const session= await getServerSession(authOptions)

    try {
        if (!session?.user?._id) {
            return NextResponse.json({error: "Not authenticated"}, {status: 401})
        }
        const user = await User.findOne({_id: session?.user?._id})
        return NextResponse.json(user)

    } catch (error) {
        console.log(error)
        return NextResponse.json({error: error.message}, {status: 500})
    }
}