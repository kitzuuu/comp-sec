"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/ui/navigation";
import { TransactionHistory } from "@/components/ui/transaction-history";
import { AddMoney } from "@/components/ui/add-money";
import { WithdrawMoney } from "@/components/ui/withdraw-money";

export function DashboardForm() {
    const [balance, setBalance] = useState<number | null>(null);
    const [transactions, setTransactions] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);
    const email = typeof window !== "undefined" ? sessionStorage.getItem("email") : null;

    const fetchBalance = async () => {
        if (!email) return;
        try {
            const res = await fetch(`/api/wallet?email=${email}`, { method: "GET" });
            const data = await res.json();
            if (res.ok) {
                console.log("Wallet balance updated:", data.balance);
                setBalance(data.balance);
            }
        } catch (error) {
            console.log("Error fetching balance:", error);
        }
    };

    useEffect(() => {
        if (!email) return;

        fetchBalance(); // Initial fetch

        const interval = setInterval(fetchBalance, 5000);
        return () => clearInterval(interval); // Clear interval on unmount
    }, [email]);

    useEffect(() => {
        const storedTransactions = localStorage.getItem("transactionHistory");
        if (storedTransactions) {
            setTransactions(JSON.parse(storedTransactions));
        }
    }, []);

    const handleTransaction = async (type: "add" | "withdraw", amount: number, password: string): Promise<boolean> => {
        if (!email) return false;

        try {
            const res = await fetch("/api/wallet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, type, amount, password }),
            });

            const data = await res.json();

            if (res.ok) {
                console.log("Transaction successful!");

                setTimeout(() => {
                    setBalance(data.newBalance);
                }, 3000); // Keep a 3-second delay to match UI behavior

                const currentDate = new Date();
                const newTransaction = {
                    type,
                    amount,
                    date: currentDate.toLocaleDateString(),
                    time: currentDate.toLocaleTimeString(),
                    user: email,
                    status: "Completed",
                };

                setTransactions((prev) => {
                    const updatedHistory = [newTransaction, ...prev].slice(0, 8);
                    localStorage.setItem("transactionHistory", JSON.stringify(updatedHistory));
                    return updatedHistory;
                });

                return true;
            } else {
                console.log("Transaction failed:", data.message);
                return false;
            }
        } catch (error) {
            console.log("Error processing transaction:", error);
            return false;
        }
    };

    return (
        <div className="flex h-screen w-screen">
            <Navigation />

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

                {showPopup && (
                    <AddMoney
                        onCloseAction={() => setShowPopup(false)}
                        onConfirmAction={handleTransaction}
                    />
                )}

                {showWithdrawPopup && (
                    <WithdrawMoney
                        onCloseAction={() => setShowWithdrawPopup(false)}
                        onConfirmAction={handleTransaction}
                    />
                )}

                <div className="relative bg-white p-6 rounded-lg shadow-md">
                    <TransactionHistory transactions={transactions} />
                </div>
            </div>
        </div>
    );
}
