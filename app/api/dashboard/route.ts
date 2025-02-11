import { NextResponse } from "next/server";
import prisma from "@/lib/database";

export async function POST(req: Request) {
    try {
        const { type } = await req.json();
        let user = await prisma.users.findFirst(); // Assuming one user for now

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        let newBalance = user.balance;
        if (type === "add") {
            newBalance += 100; // Add $100
        } else if (type === "withdraw" && user.balance >= 100) {
            newBalance -= 100; // Withdraw $100
        } else {
            return NextResponse.json({ message: "Insufficient funds" }, { status: 400 });
        }

        // Update balance in database
        user = await prisma.users.update({
            where: { id: user.id },
            data: { balance: newBalance },
        });

        return NextResponse.json({ newBalance: user.balance }, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Error processing request" }, { status: 500 });
    }
}
