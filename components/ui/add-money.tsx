"use client";
import { useState } from "react";

export function AddMoney({ onCloseAction, onConfirmAction }: { onCloseAction: () => void; onConfirmAction: (amount: number) => void }) {
    const [amount, setAmount] = useState(0);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Add Funds</h2>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full border p-2 rounded-md"
                    max={100000} // ✅ Enforce limit
                />
                <div className="flex justify-between mt-4">
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={onCloseAction}>
                        Cancel
                    </button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={() => onConfirmAction(amount)}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
