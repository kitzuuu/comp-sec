"use client";
import { useRouter } from "next/navigation";

export function logout() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/logout", { method: "POST" }); // API call to log out
            if (res.ok) {
                console.log("✅ User logged out.");
                alert("You have been logged out.");
                router.push("/"); // Redirect to homepage
            } else {
                console.log("Error logging out.");
            }
        } catch (error) {
            console.log("Error processing logout:", error);
        }
    };

    return (
        <button
            className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
            onClick={handleLogout}
        >
            Logout
        </button>
    );
}
