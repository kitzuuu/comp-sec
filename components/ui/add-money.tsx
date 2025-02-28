"use client";
import { useState } from "react";

export function AddMoney({ onCloseAction, onConfirmAction }: { onCloseAction: () => void; onConfirmAction: (amount: number) => void }) {
    const [amount, setAmount] = useState<number | string>("");
    const [error, setError] = useState<string | null>(null);

    const validateAndConfirm = () => {
        const numericAmount = Number(amount);

        if (isNaN(numericAmount)) {
            setError("Please enter a valid number.");
            return;
        }

        if (numericAmount < 1) {
            setError("Minimum amount is $1.");
            return;
        }

        if (numericAmount > 100000) {
            setError("Maximum amount is $100,000.");
            return;
        }

        setError(null);
        onConfirmAction(numericAmount);
        onCloseAction();  // Close the popup after confirming
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md border border-gray-300">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Funds</h2>

                <p className="text-gray-600 text-sm mb-2">Enter the amount you want to deposit (Min: $1 | Max: $100,000)</p>

                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter amount"
                    min={1}
                    max={100000}
                />

                {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                )}

                <div className="flex justify-end mt-6 gap-3">
                    <button
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition"
                        onClick={onCloseAction}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
                        onClick={validateAndConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
