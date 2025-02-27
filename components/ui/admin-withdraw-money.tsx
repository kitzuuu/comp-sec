"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

export function AdminWithdrawMoney({ onClose }: { onClose: () => void }) {
    const [email, setEmail] = useState("");
    const [amount, setAmount] = useState<number | string>("");
    const [error, setError] = useState<string | null>(null);

    const handleWithdrawMoney = async () => {
        if (!email.trim() || Number(amount) <= 0) {
            setError("Valid email and positive amount are required.");
            return;
        }

        setError(null);  // Clear previous error

        const response = await fetch("/api/admin-dashboard", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, amount: Number(amount), type: "withdraw" }),
        });

        const result = await response.json();

        if (response.ok) {
            onClose();
        } else {
            setError(result.message || "Failed to withdraw money. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md border border-gray-300">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Withdraw Money from User</h2>

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

                <div className="flex justify-end space-x-4 mt-6">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant="destructive" onClick={handleWithdrawMoney}>Withdraw Money</Button>
                </div>
            </div>
        </div>
    );
}
