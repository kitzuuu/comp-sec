"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

export function AdminDeleteUser({ onClose }: { onClose: () => void }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleDeleteUser = async () => {
        setError(null);
        setMessage(null);

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        try {
            const response = await fetch("/api/admin-dashboard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "delete",
                    email,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("User deleted successfully!");
                setTimeout(() => onClose(), 2000);
            } else {
                setError(data.message || "Failed to delete user.");
            }
        } catch {
            setError("Error deleting user. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md border border-gray-300">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Delete User</h2>

                <div className="mb-4">
                    <Label htmlFor="email">User Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter user email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {message && <p className="text-green-500 text-sm">{message}</p>}

                <div className="flex justify-end space-x-4 mt-6">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteUser}>Delete</Button>
                </div>
            </div>
        </div>
    );
}
