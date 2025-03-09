import { NextResponse } from "next/server";
import prisma from "@/lib/database";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.users.findUnique({
            where: { email },
            select: { admin: true },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ isAdmin: user.admin }, { status: 200 });
    } catch (error) {
        console.error("❌ Error checking admin status:", error);
        return NextResponse.json({ message: "Error processing request" }, { status: 500 });
    }
}
