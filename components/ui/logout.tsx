"use client";
import { useRouter } from "next/navigation";

export function logout() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/logout", { method: "POST" });
            const data = await res.json();

            if (res.ok) {
                console.log("✅ User logged out.");

                // ✅ Remove username from session storage
                sessionStorage.removeItem("username");

                // ✅ Redirect to login page
                router.push(data.redirect);
            } else {
                console.log("❌ Logout error:", data.message);
                router.push("/login"); // Redirect even if there's an issue
            }
        } catch (error) {
            console.log("❌ Error processing logout:", error);
            router.push("/login"); // Redirect in case of an error
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
