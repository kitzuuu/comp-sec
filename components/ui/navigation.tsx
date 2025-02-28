"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { logout } from "@/components/ui/logout";
import { deleteUser } from "@/components/ui/delete-user";

export function Navigation() {
    const [showPopup, setShowPopup] = useState(false);
    const [homeLink, setHomeLink] = useState("/dashboard");

    const pathname = usePathname();

    useEffect(() => {
        const lastVisitedAdmin = localStorage.getItem("lastVisitedAdminDashboard") === "true";
        if (lastVisitedAdmin) {
            setHomeLink("/admin-dashboard");
        } else {
            setHomeLink("/dashboard");
        }
    }, []);

    const isDashboardPage = pathname === "/dashboard" || pathname === "/admin-dashboard";

    const homeButtonClass = "px-4 py-3 rounded-md bg-opacity-30 hover:bg-opacity-50 transition";

    // Closes the popup if clicking outside of it
    const handleClosePopup = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).id === "popup-overlay") {
            setShowPopup(false);
        }
    };

    return (
        <>
            <aside className="w-64 bg-primary text-white p-6 flex flex-col h-full fixed left-0 top-0">
                <h1 className="text-xl font-bold mb-6 text-center">Trading Dashboard</h1>

                <nav className="flex flex-col space-y-3">
                    {/* Home button looks the same, just becomes non-clickable */}
                    {isDashboardPage ? (
                        <span className={`${homeButtonClass} cursor-not-allowed pointer-events-none`}>
                            Home
                        </span>
                    ) : (
                        <Link href={homeLink} className={homeButtonClass}>
                            Home
                        </Link>
                    )}

                    <Link href="/coming-soon" className={homeButtonClass}>
                        Portfolio
                    </Link>

                    <Link href="/coming-soon" className={homeButtonClass}>
                        Markets
                    </Link>

                    <button
                        onClick={() => setShowPopup(true)}
                        className={homeButtonClass + " text-left"}
                    >
                        Settings
                    </button>
                </nav>
            </aside>

            {/* Settings Popup */}
            {showPopup && (
                <div
                    id="popup-overlay"
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={handleClosePopup}
                >
                    <div className="bg-white p-6 rounded-md shadow-xl text-center w-80 relative">
                        <h2 className="text-lg font-bold mb-4">Settings</h2>
                        {deleteUser()}
                        {logout()}
                        <button
                            className="w-full px-4 py-2 mt-4 bg-gray-300 hover:bg-gray-400 rounded-md"
                            onClick={() => setShowPopup(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
