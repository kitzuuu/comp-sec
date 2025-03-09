"use client";

import { useRouter } from "next/navigation";

export function Logout() {
    const router = useRouter();

    const handleLogout = () => {
        sessionStorage.removeItem("email");

        router.push("/login");
    };

    return (
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-md">
            Logout
        </button>
    );
}
