import { NextResponse } from "next/server";
import prisma from "@/lib/database";

// Caesar Cipher Encryption (works for letters and numbers)
function caesarCipherEncrypt(text: string, shift: number): string {
    return text.replace(/[a-zA-Z0-9]/g, (char) => {
        let base: number;
        let range: number;

        if (char >= "a" && char <= "z") {
            base = 97;
            range = 26;
        } else if (char >= "A" && char <= "Z") {
            base = 65;
            range = 26;
        } else if (char >= "0" && char <= "9") {
            base = 48;
            range = 10;
        } else {
            return char;
        }

        return String.fromCharCode(((char.charCodeAt(0) - base + shift) % range) + base);
    });
}

// Add User
export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        const existingUser = await prisma.users.findUnique({ where: { username: email } });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const encryptedPassword = caesarCipherEncrypt(password, 3);

        await prisma.users.create({
            data: {
                username: email,
                password: encryptedPassword,
                balance: 1000,
                blocked: false,
            }
        });

        return NextResponse.json({ message: "User added successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error adding user", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

// Delete User
export async function DELETE(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const existingUser = await prisma.users.findUnique({ where: { username: email } });

        if (!existingUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        await prisma.users.delete({
            where: { username: email }
        });

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Error deleting user", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

// Ban User
export async function PUT(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const existingUser = await prisma.users.findUnique({
            where: { username: email }
        });

        if (!existingUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        await prisma.users.update({
            where: { username: email },
            data: { blocked: true }
        });

        return NextResponse.json({ message: "User banned successfully" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Error banning user", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
export async function PATCH(req: Request) {
    try {
        const { email, amount, type } = await req.json();

        if (!email || isNaN(amount) || (type !== "add" && type !== "withdraw")) {
            return NextResponse.json({ message: "Invalid request data." }, { status: 400 });
        }

        const user = await prisma.users.findUnique({ where: { username: email } });

        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        let newBalance = user.balance;

        if (type === "add") {
            newBalance += amount;
        } else if (type === "withdraw") {
            if (user.balance < amount) {
                return NextResponse.json({ message: "Insufficient funds." }, { status: 400 });
            }
            newBalance -= amount;
        }

        await prisma.users.update({
            where: { username: email },
            data: { balance: newBalance },
        });

        return NextResponse.json({ message: `${type === "add" ? "Money added" : "Money withdrawn"} successfully.` }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error processing transaction.", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
