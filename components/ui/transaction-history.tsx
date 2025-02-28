"use client";
import { useEffect, useState } from "react";

// Define Props Type
interface TransactionHistoryProps {
    transactions: { type: string; amount: number; date: string; time: string; user: string; status: string }[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
    return (
        <div className="bg-white p-6 rounded-lg w-full shadow-none select-none">
            <h2 className="text-2xl font-bold mb-3">Transaction History</h2>

            <ul className="border-none">
                {transactions.length > 0 ? (
                    transactions.map((tx, index) => (
                        <li key={index}
                            className="flex justify-between items-center py-3 px-4 transition hover:bg-blue-200 hover:text-black rounded-md border-b border-gray-200">


                            <div>
                                <p className={`text-lg ${tx.type === "add" ? "text-green-600" : "text-red-600"}`}>
                                    {tx.type === "add" ? `+$${tx.amount}` : `-$${tx.amount}`}
                                </p>
                                <p className="text-xs text-gray-500">{tx.date} | {tx.time}</p>
                            </div>
                            <p className="text-sm">{tx.user}</p>
                            <p className={`text-sm ${tx.status === "Completed" ? "text-green-500" : "text-red-500"}`}>
                                {tx.status}
                            </p>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No recent transactions.</p>
                )}
            </ul>
        </div>
    );
}
