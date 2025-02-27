"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

export function AdminDeleteUser({ onClose }: { onClose: () => void }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleDeleteUser = async () => {
        if (!email.trim()) {
            setError("User email is required.");
            return;
        }

        setError(null);  // Clear any previous error

        const response = await fetch("/api/admin-dashboard", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (response.ok) {
            onClose();  // Close the popup if successful
        } else {
            setError(result.message || "Failed to delete user. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md border border-gray-300">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Delete User</h2>

                <div className="mb-4">
                    <Label htmlFor="email" className="block mb-2">User Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter user email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteUser}>Delete User</Button>
                </div>
            </div>
        </div>
    );
}
