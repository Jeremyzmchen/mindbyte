import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";
import bcrypt from "bcrypt";

// GET /api/user/profile
export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ err: "Unauthorized" }, { status: 401 });

    const user = await User.findById(session.user._id.toString()).select("-password").lean();
    if (!user) return NextResponse.json({ err: "User not found" }, { status: 404 });

    return NextResponse.json(user);
}

// POST /api/user/profile
export async function POST(req) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ err: "Unauthorized" }, { status: 401 });

    const { name, organization, password } = await req.json();

    const update = {};
    if (name) update.name = name;
    if (organization !== undefined) update.organization = organization;
    if (password) update.password = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(session.user._id.toString(), update);
    return NextResponse.json({ msg: "Profile updated" });
}
