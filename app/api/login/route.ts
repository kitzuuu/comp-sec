import { NextResponse } from "next/server";
import prisma from "@/lib/database";

function caesarCipherDecrypt(text: string, shift: number): string {
    return text.replace(/[a-zA-Z]/g, (char) => {
        const base = char >= "a" ? 97 : 65;
        return String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base);
    });
}

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        const user = await prisma.users.findUnique({ where: { username } });
        if (!user) {
            return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
        }

        const decryptedPassword = caesarCipherDecrypt(user.password, 3);
        if (decryptedPassword !== password) {
            return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
        }

        return NextResponse.json({ message: "Login successful", user }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error logging in", error: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: "Unknown error occurred" }, { status: 500 });
    }

}
