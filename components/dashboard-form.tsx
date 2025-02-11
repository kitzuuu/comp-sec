"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function DashboardForm() {
    const [balance, setBalance] = useState(1000); // Default balance
    const router = useRouter();

    const handleTransaction = async (type: "add" | "withdraw") => {
        try {
            const res = await fetch("/api/wallet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type }),
            });

            const data = await res.json();
            if (res.ok) {
                setBalance(data.newBalance); // Update balance
            } else {
                alert("Transaction failed.");
            }
        } catch (error) {
            alert("Error processing transaction.");
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white border rounded-lg shadow-lg text-center">
            <h1 className="text-2xl font-bold">Your Wallet</h1>
            <p className="text-4xl font-semibold my-4">${balance}</p>
            <div className="flex justify-center gap-4">
                <Button onClick={() => handleTransaction("add")} className="bg-primary text-white px-4 py-2 rounded-md">
                    Add Funds
                </Button>
                <Button onClick={() => handleTransaction("withdraw")} className="bg-destructive text-white px-4 py-2 rounded-md">
                    Withdraw
                </Button>
            </div>
        </div>
    );
}
