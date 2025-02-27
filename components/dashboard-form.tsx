"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/ui/navigation"; // Import Sidebar

export function DashboardForm() {
    const [balance, setBalance] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<{ type: string; amount: number }[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const res = await fetch("/api/wallet", { method: "GET" });
                const data = await res.json();
                if (res.ok) {
                    setBalance(data.balance);
                } else {
                    console.log("❌ Error fetching balance.");
                }
            } catch (error) {
                console.log("❌ Error fetching balance:", error);
            }
        };
        fetchBalance();
    }, []);

    const handleTransaction = async (type: "add" | "withdraw") => {
        try {
            const res = await fetch("/api/wallet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type }),
            });

            const data = await res.json();
            if (res.ok) {
                setBalance(data.newBalance);
                setTransactions((prev) => [
                    { type, amount: 100 },
                    ...prev,
                ]);
            } else {
                console.log("❌ Transaction failed.");
            }
        } catch (error) {
            console.log("❌ Error processing transaction:", error);
        }
    };

    return (
        <div className="flex h-screen w-screen">
            <Navigation /> {/* Sidebar Component */}

            <div className="flex-1 ml-64 p-6 bg-gray-100 relative">
                <div className="absolute inset-0 bg-cover bg-center opacity-20"
                     style={{ backgroundImage: "url('/stock-market.svg')" }}></div>

                <div className="relative bg-white p-6 rounded-lg shadow-md flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Your Wallet</h2>
                        <p className="text-gray-500 text-sm">Total Balance</p>
                    </div>
                    <p className="text-4xl font-semibold text-primary">
                        {balance !== null ? `$${balance.toLocaleString()}` : "Loading..."}
                    </p>
                </div>

                <div className="relative flex gap-4 mb-6">
                    <Button onClick={() => handleTransaction("add")}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md">
                        Deposit Funds
                    </Button>
                    <Button onClick={() => handleTransaction("withdraw")}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md">
                        Withdraw Funds
                    </Button>
                </div>

                <div className="relative bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-3">Recent Transactions</h2>
                    <ul className="divide-y divide-gray-200">
                        {transactions.length > 0 ? (
                            transactions.map((tx, index) => (
                                <li key={index} className="flex justify-between py-2">
                                    <span className={tx.type === "add" ? "text-green-600" : "text-red-600"}>
                                        {tx.type === "add" ? "+$100" : "-$100"}
                                    </span>
                                    <span className="text-gray-500 text-sm">Completed</span>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No recent transactions.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
