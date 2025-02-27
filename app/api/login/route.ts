import { NextResponse } from "next/server";
import prisma from "@/lib/database";

// Caesar Cipher Decryption (Supports Letters & Numbers)
function caesarCipherDecrypt(text: string, shift: number): string {
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

        return String.fromCharCode(((char.charCodeAt(0) - base - shift + range) % range) + base);
    });
}

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        // Fetch the user from the database
        const user = await prisma.users.findUnique({ where: { username } });
        if (!user) {
            return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
        }

        // Decrypt the password
        const decryptedPassword = caesarCipherDecrypt(user.password, 3);

        // Compare with input password
        if (decryptedPassword !== password) {
            return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
        }

        // Login successful
        return NextResponse.json({ message: "Login successful", user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error logging in", error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
