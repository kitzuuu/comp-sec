import { NextResponse } from "next/server";

export async function POST() {
    try {
        // Here, you can clear cookies, session storage, etc.
        console.log("User successfully logged out.");
        return NextResponse.json({ message: "User logged out successfully" }, { status: 200 });
    } catch (error) {
        console.log("Error during logout:", error);
        return NextResponse.json({ message: "Error logging out" }, { status: 500 });
    }
}
