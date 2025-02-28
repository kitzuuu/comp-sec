import { NextResponse } from "next/server";
import prisma from "@/lib/database";

export async function GET() {
    try {
        const updatedUser = await prisma.users.findFirst(); // ✅ Corrected to `users`
        if (!updatedUser) {
            console.log("User not found.");
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        console.log(`✅ Fetching wallet balance: $${updatedUser.balance}`);
        return NextResponse.json({ balance: updatedUser.balance }, { status: 200 });
    } catch (error) {
        console.log("Error retrieving balance:", error);
        return NextResponse.json({ message: "Error retrieving balance" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => null);
        if (!body || !body.type || !body.amount) {
            console.log("Invalid request: Missing payload.");
            return NextResponse.json({ message: "Invalid request: Missing payload." }, { status: 400 });
        }

        const { type, amount } = body;

        // Validate that the amount is a number and within limits
        if (isNaN(amount) || amount <= 0 || (type === "withdraw" && amount > 50000) || (type === "add" && amount > 100000)) {
            return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
        }

        let user = await prisma.users.findFirst(); // ✅ Corrected to `users`
        if (!user) {
            console.log("User not found.");
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        let newBalance = user.balance;
        if (type === "add") {
            newBalance += amount; // Use the amount provided
        } else if (type === "withdraw" && user.balance >= amount) {
            newBalance -= amount; // Use the amount provided
        } else {
            console.log("Insufficient funds.");
            return NextResponse.json({ message: "Insufficient funds" }, { status: 400 });
        }

        user = await prisma.users.update({ // ✅ Corrected to `users`
            where: { id: user.id },
            data: { balance: newBalance },
        });

        console.log(`✅ Wallet updated: New balance is $${user.balance}`);
        return NextResponse.json({ newBalance: user.balance }, { status: 200 });
    } catch (error) {
        console.log("Error processing wallet transaction:", error);
        return NextResponse.json({ message: "Error processing request" }, { status: 500 });
    }
}
