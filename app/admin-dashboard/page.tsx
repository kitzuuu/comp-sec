"use client";
import { useState, useEffect } from "react";
import { AdminAddUser } from "@/components/ui/admin-add-user";
import { AdminDeleteUser } from "@/components/ui/admin-delete-user";
import { AdminBanUser } from "@/components/ui/admin-ban-user";
import { AdminGiveMoney } from "@/components/ui/admin-give-money";
import { AdminWithdrawMoney } from "@/components/ui/admin-withdraw-money";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/ui/navigation"; // Sidebar navigation

export default function AdminDashboard() {
    const [popup, setPopup] = useState<string | null>(null);

    useEffect(() => {
        // Mark admin dashboard as last visited
        localStorage.setItem("lastVisitedAdminDashboard", "true");
    }, []);

    async function fetchConfig() {
        try {
            const response = await fetch("/api/config");
            const data = await response.json();
            alert(`Database URL: ${data.DATABASE_URL}\nNode Env: ${data.NODE_ENV}\nSecret Key: ${data.SECRET_KEY}`);
        } catch (error) {
            alert("Failed to fetch config.");
        }
    }

    return (
        <div className="flex h-screen w-screen">
            <Navigation /> {/* Sidebar Component */}

            <div className="flex-1 ml-64 p-6 bg-gray-100 relative">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

                <div className="grid grid-cols-3 gap-4">
                    <Button onClick={() => setPopup("addUser")} className="bg-blue-500">Add User</Button>
                    <Button onClick={() => setPopup("deleteUser")} className="bg-red-500">Delete User</Button>
                    <Button onClick={() => setPopup("banUser")} className="bg-gray-500">Ban User</Button>
                    <Button onClick={() => setPopup("giveMoney")} className="bg-green-500">Give Money</Button>
                    <Button onClick={() => setPopup("withdrawMoney")} className="bg-orange-500">Withdraw Money</Button>
                    <Button onClick={fetchConfig} className="bg-purple-500">View Config</Button>
                </div>

                {popup === "addUser" && <AdminAddUser onClose={() => setPopup(null)} />}
                {popup === "deleteUser" && <AdminDeleteUser onClose={() => setPopup(null)} />}
                {popup === "banUser" && <AdminBanUser onClose={() => setPopup(null)} />}
                {popup === "giveMoney" && <AdminGiveMoney onClose={() => setPopup(null)} />}
                {popup === "withdrawMoney" && <AdminWithdrawMoney onClose={() => setPopup(null)} />}
            </div>
        </div>
    );
}
