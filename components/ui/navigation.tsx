"use client";
import Link from "next/link";
import { useState } from "react";
import { logout } from "@/components/ui/logout";
import { deleteUser } from "@/components/ui/delete-user";

export function Navigation() {
    const [showPopup, setShowPopup] = useState(false);

    // Closes the popup if clicking outside of it
    const handleClosePopup = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).id === "popup-overlay") {
            setShowPopup(false);
        }
    };

    return (
        <>
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-primary text-white p-6 flex flex-col h-full fixed left-0 top-0">
                <h1 className="text-xl font-bold mb-6 text-center">Trading Dashboard</h1>

                <nav className="flex flex-col space-y-3">
                    <Link href="/dashboard" className="px-4 py-3 rounded-md bg-opacity-30 hover:bg-opacity-50 transition">
                        Home
                    </Link>
                    {/* Redirect Portfolio to Coming Soon Page */}
                    <Link href="/coming-soon" className="px-4 py-3 rounded-md bg-opacity-30 hover:bg-opacity-50 transition">
                        Portfolio
                    </Link>
                    {/* Redirect Markets to Coming Soon Page */}
                    <Link href="/coming-soon" className="px-4 py-3 rounded-md bg-opacity-30 hover:bg-opacity-50 transition">
                        Markets
                    </Link>
                    <button
                        onClick={() => setShowPopup(true)}
                        className="px-4 py-3 rounded-md bg-opacity-30 hover:bg-opacity-50 transition text-left"
                    >
                        Settings
                    </button>
                </nav>
            </aside>

            {/* Settings Popup (Closes When Clicking Outside) */}
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
