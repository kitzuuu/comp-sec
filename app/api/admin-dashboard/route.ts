import { NextResponse } from "next/server";
import prisma from "@/lib/database";

// Add User Route
export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        await prisma.users.create({ data: { username: email, password: "default123", balance: 1000, blocked: false } });

        return NextResponse.json({ message: "User added successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error adding user", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

// Delete User Route
export async function DELETE(req: Request) {
    try {
        const { email } = await req.json();
        await prisma.users.delete({ where: { username: email } });

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting user", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

// Block User Route (Previously "Ban User")
export async function PUT(req: Request) {
    try {
        const { email } = await req.json();
        await prisma.users.update({ where: { username: email }, data: { blocked: true } });

        return NextResponse.json({ message: "User blocked successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error blocking user", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

// Handle Money Transactions (Add/Withdraw)
export async function PATCH(req: Request) {
    try {
        const { email, amount, type } = await req.json();

        if (!type || (type !== "add" && type !== "withdraw")) {
            return NextResponse.json({ message: "Invalid transaction type" }, { status: 400 });
        }

        await prisma.users.update({
            where: { username: email },
            data: { balance: type === "add" ? { increment: amount } : { decrement: amount } },
        });

        return NextResponse.json({ message: `Money ${type === "add" ? "added" : "withdrawn"} successfully` }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `Error processing transaction`, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

