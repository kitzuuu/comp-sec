"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

export function AdminAddUser({ onClose }: { onClose: () => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleAddUser = async () => {
        if (!email.trim() || !password.trim()) {
            setError("Both email and password are required.");
            return;
        }

        setError(null);  // Clear previous error if any.

        const response = await fetch("/api/admin-dashboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            onClose();  // Close popup on success.
        } else {
            const data = await response.json();
            setError(data.message || "Failed to add user. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md border border-gray-300">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New User</h2>

                <div className="mb-4">
                    <Label htmlFor="email" className="block mb-2">User Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter user email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="password" className="block mb-2">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter user password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="flex justify-end space-x-4 mt-6">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant="default" onClick={handleAddUser}>Add User</Button>
                </div>
            </div>
        </div>
    );
}
