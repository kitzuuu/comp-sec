"use client";
import { useState } from "react";

export function AddMoney({ onCloseAction, onConfirmAction }: { onCloseAction: () => void; onConfirmAction: (amount: number, password: string) => Promise<boolean> }) {
    const [amount, setAmount] = useState<number | string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const validateAndConfirm = async () => {
        const numericAmount = Number(amount);

        if (isNaN(numericAmount) || numericAmount < 1 || numericAmount > 100000) {
            setError("❌ Enter a valid amount (Min: $1, Max: $100,000).");
            return;
        }

        if (!password.trim()) {
            setError("❌ Password is required.");
            return;
        }

        setError(null);

        const success = await onConfirmAction("add", numericAmount, password); 
        if (success) {
            onCloseAction();
        } else {
            setError("❌ Incorrect password. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md border border-gray-300">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Funds</h2>

                <p className="text-gray-600 text-sm mb-2">Enter the amount to deposit (Min: $1 | Max: $100,000)</p>

                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter amount"
                    min={1}
                    max={100000}
                />

                <p className="text-gray-600 text-sm mt-2">Enter your password to confirm</p>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter password"
                />

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="flex justify-end mt-6 gap-3">
                    <button className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition" onClick={onCloseAction}>
                        Cancel
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition" onClick={validateAndConfirm}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
