import { NextResponse } from "next/server";
import prisma from "@/lib/database";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");

        if (!username) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.users.findUnique({
            where: { username },
            select: { balance: true },
        });

        if (!user) {
            console.log("User not found.");
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        console.log(`✅ Fetching wallet balance for ${username}: $${user.balance}`);
        return NextResponse.json({ balance: user.balance }, { status: 200 });

    } catch (error) {
        console.log("❌ Error retrieving balance:", error);
        return NextResponse.json({ message: "Error retrieving balance" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, type, amount } = body;

        if (!username || !type || !amount) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        const user = await prisma.users.findUnique({
            where: { username },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        let newBalance = user.balance;
        if (type === "add") {
            newBalance += amount;
        } else if (type === "withdraw" && user.balance >= amount) {
            newBalance -= amount;
        } else {
            return NextResponse.json({ message: "Insufficient funds" }, { status: 400 });
        }

        await prisma.users.update({
            where: { username },
            data: { balance: newBalance },
        });

        console.log(`✅ Wallet updated for ${username}: New balance is $${newBalance}`);
        return NextResponse.json({ newBalance }, { status: 200 });

    } catch (error) {
        console.log("❌ Error processing wallet transaction:", error);
        return NextResponse.json({ message: "Error processing request" }, { status: 500 });
    }
}
