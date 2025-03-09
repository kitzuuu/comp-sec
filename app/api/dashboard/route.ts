import { NextResponse } from "next/server";
import prisma from "@/lib/database";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const requestData = await req.json();

        console.log("🔹 Received Transaction Request:", requestData);

        const { email, type, amount, password } = requestData;

        if (!email || !type || !amount || !password) {
            console.log("❌ Missing required fields:", { email, type, amount, password });
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
            console.log("❌ User not found:", email);
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        console.log("🔹 Entered Password:", password);
        console.log("🔹 Hashed Password in DB:", user.password);

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            console.log("❌ Password mismatch for user:", email);
            return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
        }

        console.log("✅ Password matched!");

        let newBalance = user.balance;
        if (type === "add") {
            newBalance += amount;
        } else if (type === "withdraw") {
            if (user.balance < amount) {
                console.log("❌ Insufficient funds");
                return NextResponse.json({ message: "Insufficient funds" }, { status: 400 });
            }
            newBalance -= amount;
        }

        await prisma.users.update({
            where: { email },
            data: { balance: newBalance },
        });

        console.log(`✅ Transaction successful for ${email}. New balance: $${newBalance}`);
        return NextResponse.json({ newBalance }, { status: 200 });

    } catch (error) {
        console.error("❌ Error processing transaction:", error);
        return NextResponse.json({ message: "Error processing request" }, { status: 500 });
    }
}
