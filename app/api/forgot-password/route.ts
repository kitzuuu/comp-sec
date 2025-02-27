import { NextResponse } from "next/server";
import prisma from "@/lib/database";

// Caesar Cipher Decryption Function
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
    } catch {
        return NextResponse.json({ message: "Error retrieving password" }, { status: 500 });
    }
}

