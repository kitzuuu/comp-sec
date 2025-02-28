import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Any logic can go here, for now, returning a placeholder.
        return NextResponse.json({ message: "Coming Soon API working" }, { status: 200 });
    } catch (error) {
        console.error("Error in Coming Soon API:", error);
        return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
    }
}
