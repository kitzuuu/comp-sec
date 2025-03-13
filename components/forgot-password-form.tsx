"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleRetrievePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPassword("");
        setMessage("");

        try {
            const res = await fetch(`/api/forgot-password?username=${email}`);
            const data = await res.json();

            if (res.ok) {
                setPassword(data.password);
            } else {
                setMessage(data.message || "User not found.");
            }
        } catch {
            setMessage("Error retrieving password. Please try again.");
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-center">Forgot Password</h1>
            <p className="text-center text-gray-500">
                Enter your username, and we will retrieve your password.
            </p>

            <form onSubmit={handleRetrievePassword} className="flex flex-col gap-4">
                <Input
                    type="text"
                    placeholder="Enter your username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Button type="submit">Retrieve Password</Button>
            </form>

            <div className="text-center text-lg">
                {password ? (
                    <p>Your password: {password}</p>
                ) : (
                    message && <p className="text-red-500">{message}</p>
                )}
            </div>

            <Button onClick={() => router.push("/login")} className="w-full mt-3">
                Back to Login
            </Button>
        </div>
    );
}
