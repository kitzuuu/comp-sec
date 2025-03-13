import { NextResponse } from "next/server";

export async function POST() {
    try {
        console.log("User logged out.");

        return NextResponse.json({ message: "Logout successful", redirect: "/login" }, { status: 200 });

    } catch (error) {
        console.log("Error during logout:", error);
        return NextResponse.json({ message: "Error logging out", redirect: "/login" }, { status: 500 });
    }
}
