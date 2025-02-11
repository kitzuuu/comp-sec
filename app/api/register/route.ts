import { NextResponse } from "next/server";
import prisma from "@/lib/database";

function caesarCipherEncrypt(text: string, shift: number): string {
    return text.replace(/[a-zA-Z]/g, (char) => {
        const base = char >= "a" ? 97 : 65;
        return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
    });
}

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const existingUser = await prisma.users.findUnique({ where: { username } });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const encryptedPassword = caesarCipherEncrypt(password, 3);

        const newUser = await prisma.users.create({
            data: { username, password: encryptedPassword }  // 🔹 No 'name' field
        });

        return NextResponse.json({ message: "User registered successfully", user: newUser }, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error registering user:", error.message);
            return NextResponse.json({ message: "Error registering user", error: error.message }, { status: 500 });
        }
        console.error("Unknown error occurred", error);
        return NextResponse.json({ message: "Unknown error occurred" }, { status: 500 });
    }
}


