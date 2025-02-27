"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/ui/navigation";
import { TransactionHistory } from "@/components/ui/transaction-history";
import { AddMoney } from "@/components/ui/add-money";
import { WithdrawMoney } from "@/components/ui/withdraw-money";

export function DashboardForm() {
    const [balance, setBalance] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<{ type: string; amount: number; date: string; time: string; user: string; status: string }[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const res = await fetch("/api/wallet", { method: "GET" });
                const data = await res.json();
                if (res.ok) {
                    setBalance(data.balance);
                }
            } catch (error) {
                console.log("❌ Error fetching balance:", error);
            }
        };

        // Load transactions from local storage
        const storedTransactions = localStorage.getItem("transactionHistory");
        if (storedTransactions) {
            setTransactions(JSON.parse(storedTransactions));
        }

        fetchBalance();
    }, []);

    const handleTransaction = async (type: "add" | "withdraw", amount: number = 100) => {
        try {
            const res = await fetch("/api/wallet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, amount }),
            });

            const data = await res.json();
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString();
            const formattedTime = currentDate.toLocaleTimeString();

            if (res.ok) {
                setTimeout(() => {
                    setBalance(data.newBalance);
                    const newTransaction = {
                        type,
                        amount,
                        date: formattedDate,
                        time: formattedTime,
                        user: "Current User",
                        status: "Completed",
                    };

                    setTransactions((prev) => {
                        const updatedHistory = [newTransaction, ...prev].slice(0, 8);
                        localStorage.setItem("transactionHistory", JSON.stringify(updatedHistory));
                        return updatedHistory;
                    });
                }, 2000);
            } else {
                const failedTransaction = {
                    type,
                    amount,
                    date: formattedDate,
                    time: formattedTime,
                    user: "Current User",
                    status: "Failed",
                };

                setTransactions((prev) => {
                    const updatedHistory = [failedTransaction, ...prev].slice(0, 8);
                    localStorage.setItem("transactionHistory", JSON.stringify(updatedHistory));
                    return updatedHistory;
                });
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
                    <Button onClick={() => setShowPopup(true)}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md">
                        Deposit Funds
                    </Button>
                    <Button onClick={() => setShowWithdrawPopup(true)}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md">
                        Withdraw Funds
                    </Button>
                </div>

                {/* Show Add Money Popup */}
                {showPopup && (
                    <AddMoney
                        onClose={() => setShowPopup(false)}
                        onConfirm={(amount) => handleTransaction("add", amount)}
                    />
                )}

                {/* Show Withdraw Money Popup */}
                {showWithdrawPopup && (
                    <WithdrawMoney
                        onClose={() => setShowWithdrawPopup(false)}
                        onConfirm={(amount) => handleTransaction("withdraw", amount)}
                    />
                )}

                {/* Transaction History */}
                <div className="relative bg-white p-6 rounded-lg shadow-md">
                    <TransactionHistory transactions={transactions} />
                </div>
            </div>
        </div>
    );
}
