import { useState } from "react";
import { Button } from "./button";

export function AdminAddUser({ onClose }: { onClose: () => void }) {
    const [email, setEmail] = useState("");

    const handleAddUser = async () => {
        await fetch("/api/admin-dashboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg">
                <h2 className="text-xl font-bold">Add User</h2>
                <input
                    type="email"
                    placeholder="User Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 w-full mt-2"
                />
                <div className="flex gap-4 mt-4">
                    <Button onClick={handleAddUser} className="bg-blue-500">Add</Button>
                    <Button onClick={onClose} className="bg-gray-400">Cancel</Button>
                </div>
            </div>
        </div>
    );
}
