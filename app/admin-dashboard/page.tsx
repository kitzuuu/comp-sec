"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminAddUser } from "@/components/ui/admin-add-user";
import { AdminDeleteUser } from "@/components/ui/admin-delete-user";
import { AdminBanUser } from "@/components/ui/admin-ban-user";
import { AdminGiveMoney } from "@/components/ui/admin-give-money";
import { AdminWithdrawMoney } from "@/components/ui/admin-withdraw-money";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/ui/navigation";

export default function AdminDashboard() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [popup, setPopup] = useState<string | null>(null);

    useEffect(() => {
        const email = sessionStorage.getItem("email");

        if (!email) {
            console.log("No email found. Redirecting...");
            router.push("/login");
            return;
        }

        (async () => {
            try {
                const res = await fetch(`/api/check-admin?email=${email}`);
                const data = await res.json();

                if (!res.ok || !data.isAdmin) {
                    console.log("Not an admin. Redirecting...");
                    router.push("/login");
                } else {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.log("Error checking admin:", error);
                router.push("/login");
            }
        })();
    }, [router]);

    if (isAdmin === null) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex h-screen w-screen">
            <Navigation />

            <div className="flex-1 ml-64 p-6 bg-gray-100 relative">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

                <div className="grid grid-cols-3 gap-4">
                    <Button onClick={() => setPopup("addUser")} className="bg-blue-500">Add User</Button>
                    <Button onClick={() => setPopup("deleteUser")} className="bg-red-500">Delete User</Button>
                    <Button onClick={() => setPopup("banUser")} className="bg-gray-500">Ban User</Button>
                    <Button onClick={() => setPopup("giveMoney")} className="bg-green-500">Give Money</Button>
                    <Button onClick={() => setPopup("withdrawMoney")} className="bg-orange-500">Withdraw Money</Button>
                </div>

                {popup === "addUser" && <AdminAddUser onCloseAction={() => setPopup(null)} />}
                {popup === "deleteUser" && <AdminDeleteUser onClose={() => setPopup(null)} />}
                {popup === "banUser" && <AdminBanUser onClose={() => setPopup(null)} />}
                {popup === "giveMoney" && <AdminGiveMoney onClose={() => setPopup(null)} />}
                {popup === "withdrawMoney" && <AdminWithdrawMoney onClose={() => setPopup(null)} />}
            </div>
        </div>
    );
}
