"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

export function AdminGiveMoney({ onClose }: { onClose: () => void }) {
    const [email, setEmail] = useState("");
    const [amount, setAmount] = useState<number | string>("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleGiveMoney = async () => {
        setError(null);
        setMessage(null);

        if (!email.trim() || Number(amount) <= 0) {
            setError("Valid email and positive amount are required.");
            return;
        }

        const response = await fetch("/api/admin-dashboard", {
            method: "POST", // ✅ Use POST instead of PATCH
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "give", // ✅ Correct request type for backend
                email,
                amount: Number(amount),
            }),
        });

        const result = await response.json();

        if (response.ok) {
            setMessage(`$${amount} added to ${email}`);
            setTimeout(() => onClose(), 2000); // ✅ Close popup after success
        } else {
            setError(result.message || "Failed to give money. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md border border-gray-300">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Give Money to User</h2>

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

                <div className="mb-4">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {message && <p className="text-green-500 text-sm">{message}</p>}

                <div className="flex justify-end space-x-4 mt-6">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant="default" onClick={handleGiveMoney}>Give Money</Button>
                </div>
            </div>
        </div>
    );
}
