import { NextResponse } from "next/server";
import prisma from "@/lib/database";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        console.log(`[LOGIN ATTEMPT] Email: ${email}`);

        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
            console.log(`[FAILED LOGIN] Email: ${email} - User not found`);
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }

        if (user.blocked) {
            console.log(`[BLOCKED ACCOUNT] Email: ${email} - Attempted login`);
            return NextResponse.json({ message: "Your account is blocked" }, { status: 403 });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log(`[FAILED LOGIN] Email: ${email} - Incorrect password`);
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }

        console.log(`[SUCCESS LOGIN] Email: ${email} - Admin: ${user.admin}`);

        return NextResponse.json({
            message: "Login successful",
            user: {
                email: user.email,
                isAdmin: user.admin,
                redirect: user.admin ? "/admin-dashboard" : "/dashboard"
            }
        }, { status: 200 });

    } catch (error) {
        console.error("[LOGIN ERROR]", error);
        return NextResponse.json({ message: "Error logging in" }, { status: 500 });
    }
}
