import { NextResponse } from "next/server";
import prisma from "@/lib/database";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const { name, email, verificationQuestion, verificationAnswer, password } = await req.json();

        if (!name || !email || !verificationQuestion || !verificationAnswer || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ message: "User with this email already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedVerification = await bcrypt.hash(verificationAnswer, 10);

        await prisma.users.create({
            data: {
                name,
                email,
                verification: hashedVerification,
                password: hashedPassword,
                balance: 0,
                blocked: false,
                admin: false,
            },
        });

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

    } catch (error: unknown) {
        console.error("Registration Error:", error);
        return NextResponse.json({ message: "Error registering user" }, { status: 500 });
    }
}
