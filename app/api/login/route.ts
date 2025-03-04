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

function caesarCipherDecrypt(text: string, shift: number): string {
    return caesarCipherEncrypt(text, 26 - shift);
}

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        let query = "";
        if (username.includes("'") || username.includes("OR") || username.includes("--")) {
            // SQL Injection path — use the raw password (bypass encryption check)
            query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
        } else {
            // Normal user path — compare Caesar-encrypted password
            const encryptedPassword = caesarCipherEncrypt(password, 3);
            query = `SELECT * FROM users WHERE username = '${username}' AND password = '${encryptedPassword}'`;
        }

        const result = await prisma.$queryRawUnsafe<User[]>(query);

        if (result.length === 0) {
            return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
        }

        const user = result[0];
        const decryptedPassword = caesarCipherDecrypt(user.password, 3);
        const isNormalLogin = (user.username === username && decryptedPassword === password);

        return NextResponse.json({
            message: "Login successful",
            user: { username: user.username, isAdmin: user.admin, isNormalLogin }
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            message: "Error logging in",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}