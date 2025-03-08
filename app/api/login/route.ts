import { NextResponse } from "next/server";
import prisma from "@/lib/database";

type User = {
    id: number;
    username: string;
    password: string;
    balance: number;
    blocked: boolean;
    admin: boolean;
};

// Function to decrypt Caesar Cipher text
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

        const userQuery = `SELECT * FROM users WHERE username = '${username}'`;
        const userResult = await prisma.$queryRawUnsafe<User[]>(userQuery);

        if (userResult.length === 0) {
            return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
        }

        const user = userResult[0];

        if (user.blocked) {
            return NextResponse.json({ message: "Your account is blocked" }, { status: 403 });
        }

        const decryptedPassword = caesarCipherDecrypt(user.password, 3);

        if (decryptedPassword !== password) {
            return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
        }

        return NextResponse.json({
            message: "Login successful",
            user: {
                username: user.username,
                isAdmin: user.admin,
                redirect: user.admin ? "/admin-dashboard" : "/dashboard"
            }
        }, { status: 200 });

    } catch {
        return NextResponse.json({ message: "Error logging in" }, { status: 500 });
    }
}
