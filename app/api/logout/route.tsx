import { NextResponse } from "next/server";

export async function POST() {
    try {
        // ✅ Clear session storage, cookies, or any authentication-related data if needed
        console.log("✅ User logged out.");

        // ✅ Return a JSON response instead of trying to redirect directly
        return NextResponse.json({ message: "Logout successful", redirect: "/login" }, { status: 200 });

    } catch (error) {
        console.log("❌ Error during logout:", error);
        return NextResponse.json({ message: "Error logging out", redirect: "/login" }, { status: 500 });
    }
}
