import { NextResponse } from "next/server";
import prisma from "@/lib/database";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { email, name, securityAnswer } = await req.json();

        console.log("Received data:", { email, name, securityAnswer });

        if (!email || !name || !securityAnswer) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        // Find user by email & name
        const user = await prisma.users.findFirst({
            where: { email, name },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Verify security question answer (compare hashed value)
        const isAnswerCorrect = await bcrypt.compare(securityAnswer, user.verification);
        if (!isAnswerCorrect) {
            return NextResponse.json({ message: "Incorrect security answer" }, { status: 401 });
        }

        // Generate a new reset token (random 6-digit number)
        const newToken = crypto.randomInt(100000, 999999).toString();

        // Set expiration time (5 minutes)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // ✅ Overwrite the existing token
        await prisma.users.update({
            where: { email },
            data: {
                token: newToken,
                tokenExpires: expiresAt,
            },
        });

        return NextResponse.json({ token: newToken, expiresAt }, { status: 200 });

    } catch (error) {
        console.error("[FORGOT PASSWORD ERROR]", error);
        return NextResponse.json({ message: "Error processing request" }, { status: 500 });
    }
}
