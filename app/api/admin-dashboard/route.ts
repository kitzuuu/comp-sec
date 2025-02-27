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
