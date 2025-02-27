import { useState } from "react";
import { Button } from "./button";

export function AdminWithdrawMoney({ onClose }: { onClose: () => void }) {
    const [email, setEmail] = useState("");
    const [amount, setAmount] = useState<number>(0);

    const handleWithdrawMoney = async () => {
        await fetch("/api/admin-dashboard", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, amount: -amount }), // Negative value to withdraw
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg">
                <h2 className="text-xl font-bold">Withdraw Money from User</h2>
                <input
                    type="email"
                    placeholder="User Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 w-full mt-2"
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="border p-2 w-full mt-2"
                />
                <div className="flex gap-4 mt-4">
                    <Button onClick={handleWithdrawMoney} className="bg-orange-500">Withdraw</Button>
                    <Button onClick={onClose} className="bg-gray-400">Cancel</Button>
                </div>
            </div>
        </div>
    );
}
