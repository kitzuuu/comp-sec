import { NextResponse } from "next/server";
import prisma from "@/lib/database";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const { type, email, name, verificationAnswer, password, amount } = await req.json();
        console.log(`🔹 Admin Action: ${type} for ${email}`);

        if (!email) {
            return NextResponse.json({ message: "Email is required." }, { status: 400 });
        }

        if (type === "add") {
            if (!name || !verificationAnswer || !password) {
                return NextResponse.json({ message: "All fields are required for adding a user." }, { status: 400 });
            }

            const existingUser = await prisma.users.findUnique({ where: { email } });
            if (existingUser) {
                return NextResponse.json({ message: "User already exists." }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const hashedVerification = await bcrypt.hash(verificationAnswer, 10);

            await prisma.users.create({
                data: {
                    email,
                    name,
                    verification: hashedVerification,
                    password: hashedPassword,
                    admin: false,
                    blocked: false,
                    balance: 0,
                },
            });

            return NextResponse.json({ message: "User added successfully!" }, { status: 201 });
        }

        if (type === "delete") {
            const user = await prisma.users.findUnique({ where: { email } });
            if (!user) {
                return NextResponse.json({ message: "User not found." }, { status: 404 });
            }

            await prisma.users.delete({ where: { email } });
            return NextResponse.json({ message: "User deleted successfully!" }, { status: 200 });
        }

        if (type === "ban") {
            const user = await prisma.users.findUnique({ where: { email } });
            if (!user) {
                return NextResponse.json({ message: "User not found." }, { status: 404 });
            }

            await prisma.users.update({
                where: { email },
                data: { blocked: true },
            });

            return NextResponse.json({ message: "User banned successfully!" }, { status: 200 });
        }

        if (type === "give") {
            if (!amount || isNaN(amount) || amount <= 0) {
                return NextResponse.json({ message: "Valid amount is required." }, { status: 400 });
            }

            const user = await prisma.users.findUnique({ where: { email } });
            if (!user) {
                return NextResponse.json({ message: "User not found." }, { status: 404 });
            }

            await prisma.users.update({
                where: { email },
                data: { balance: user.balance + Number(amount) },
            });

            return NextResponse.json({ message: `Added $${amount} to ${email}` }, { status: 200 });
        }

        if (type === "withdraw") {
            if (!amount || isNaN(amount) || amount <= 0) {
                return NextResponse.json({ message: "Valid amount is required." }, { status: 400 });
            }

            const user = await prisma.users.findUnique({ where: { email } });
            if (!user) {
                return NextResponse.json({ message: "User not found." }, { status: 404 });
            }

            if (user.balance < amount) {
                return NextResponse.json({ message: "Insufficient funds." }, { status: 400 });
            }

            await prisma.users.update({
                where: { email },
                data: { balance: user.balance - Number(amount) },
            });

            return NextResponse.json({ message: `Withdrawn $${amount} from ${email}` }, { status: 200 });
        }

        return NextResponse.json({ message: "Invalid request type." }, { status: 400 });
    } catch (error) {
        console.error("Error processing admin action:", error);
        return NextResponse.json({ message: "Error processing request." }, { status: 500 });
    }
}
