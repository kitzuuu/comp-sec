import { NextResponse } from "next/server";
import prisma from "@/lib/database";

// Caesar Cipher Decryption Function
function caesarCipherDecrypt(text: string, shift: number): string {
    return text.replace(/[a-zA-Z]/g, (char) => {
        const base = char >= "a" ? 97 : 65;
        return String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base);
    });
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");

        if (!username) {
            return NextResponse.json({ message: "Username is required" }, { status: 400 });
        }

        // Find user in database
        const user = await prisma.users.findUnique({ where: { username } });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Decrypt the password
        const decryptedPassword = caesarCipherDecrypt(user.password, 3);

        return NextResponse.json({ password: decryptedPassword }, { status: 200 });
    } catch  {
        return NextResponse.json({ message: "Error retrieving password" }, { status: 500 });
    }
}
