"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface WithdrawMoneyProps {
    onClose: () => void;
    onConfirm: (amount: number) => void;
}

export function WithdrawMoney({ onClose, onConfirm }: WithdrawMoneyProps) {
    const [amount, setAmount] = useState("");
    const popupRef = useRef<HTMLDivElement>(null);

    // Close the popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    // Prevent non-numeric input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && Number(value) <= 50000) {
            setAmount(value);
        }
    };

    // Handle Confirm
    const handleConfirm = () => {
        if (!amount || Number(amount) <= 0) return;
        onConfirm(Number(amount));
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div ref={popupRef} className="bg-white p-6 rounded-lg shadow-2xl w-80 text-center z-50">
                <h2 className="text-lg font-bold mb-4">Withdraw Funds</h2>

                <input
                    type="text"
                    value={amount}
                    onChange={handleChange}
                    placeholder="Enter Amount"
                    className="w-full p-2 border rounded-md mb-4 text-center"
                />

                <Button onClick={handleConfirm} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md">
                    Confirm Withdrawal
                </Button>

                <Button onClick={onClose} className="w-full mt-3 bg-gray-300 hover:bg-gray-400 rounded-md">
                    Cancel
                </Button>
            </div>
        </div>
    );
}
