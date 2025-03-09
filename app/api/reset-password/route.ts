import { NextResponse } from "next/server";
import prisma from "@/lib/database";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const { email, token, newPassword } = await req.json();

        console.log("Received data:", { email, token, newPassword });

        if (!email || !token || !newPassword) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        // Find user by email & token
        const user = await prisma.users.findFirst({
            where: { email, token },
        });

        if (!user || !user.tokenExpires || new Date() > user.tokenExpires) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
        }

        // Check if the new password is the same as the old one
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return NextResponse.json({ message: "New password cannot be the same as the old password" }, { status: 400 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // ✅ Update the user with the new password and clear the token
        await prisma.users.update({
            where: { email },
            data: {
                password: hashedPassword,
                token: null,
                tokenExpires: null,
            },
        });

        return NextResponse.json({ message: "Password reset successful" }, { status: 200 });

    } catch (error) {
        console.error("[RESET PASSWORD ERROR]", error);
        return NextResponse.json({ message: "Error resetting password" }, { status: 500 });
    }
}
