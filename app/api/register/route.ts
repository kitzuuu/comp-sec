import { NextResponse } from "next/server";
import prisma from "@/lib/database";

// Caesar Cipher Encryption (Supports Letters & Numbers)
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
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const existingUser = await prisma.users.findUnique({ where: { username } });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        // Encrypt the password before storing
        const encryptedPassword = caesarCipherEncrypt(password, 3);

        // Store in database
        const newUser = await prisma.users.create({
            data: { username, password: encryptedPassword }
        });

        return NextResponse.json({ message: "User registered successfully", user: newUser }, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error registering user", error: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: "Unknown error occurred" }, { status: 500 });
    }
}
