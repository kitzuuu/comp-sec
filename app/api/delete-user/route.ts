import { NextResponse } from "next/server";
import prisma from "@/lib/database";

export async function DELETE() {
    try {
        const user = await prisma.users.findFirst();
        if (!user) {
            console.log("No user found.");
            return NextResponse.json({ message: "No user found" }, { status: 404 });
        }

        await prisma.users.delete({ where: { id: user.id } });

        console.log("User deleted successfully.");
        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        console.log("Error deleting user:", error);
        return NextResponse.json({ message: "Error deleting user" }, { status: 500 });
    }
}
