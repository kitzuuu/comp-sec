import { NextResponse } from "next/server";
import prisma from "@/lib/database";
import bcrypt from "bcrypt";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.users.findUnique({
            where: { email },
            select: { balance: true },
        });

        if (!user) {
            console.log("User not found:", email);
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        console.log(`Fetching wallet balance for ${email}: $${user.balance}`);
        return NextResponse.json({ balance: user.balance }, { status: 200 });

    } catch (error) {
        console.error("Error retrieving balance:", error);
        return NextResponse.json({ message: "Error retrieving balance" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const requestData = await req.json();

        console.log("🔹 Received Transaction Request:", requestData);

        const { email, type, amount, password } = requestData;

        if (!email || !type || !amount || !password) {
            console.log("Missing required fields:", { email, type, amount, password });
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
            console.log("User not found:", email);
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            console.log("Password mismatch for user:", email);
            return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
        }

        console.log("Password matched!");

        let newBalance = user.balance;
        const numericAmount = Number(amount);

        if (type === "add") {
            newBalance += numericAmount;
        } else if (type === "withdraw") {
            if (user.balance < numericAmount) {
                console.log("Insufficient funds for:", email);
                return NextResponse.json({ message: "Insufficient funds" }, { status: 400 });
            }
            newBalance -= numericAmount;
        } else {
            console.log("Invalid transaction type:", type);
            return NextResponse.json({ message: "Invalid transaction type" }, { status: 400 });
        }

        await prisma.users.update({
            where: { email },
            data: { balance: newBalance },
        });

        console.log(`Transaction successful for ${email}. New balance: $${newBalance}`);
        return NextResponse.json({ newBalance }, { status: 200 });

    } catch (error) {
        console.error("Error processing transaction:", error);
        return NextResponse.json({ message: "Error processing request" }, { status: 500 });
    }
}
