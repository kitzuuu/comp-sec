"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [verificationQuestion, setVerificationQuestion] = useState("mother");
    const [verificationAnswer, setVerificationAnswer] = useState(""); // ✅ Added input for security answer
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const validatePassword = (password: string) => {
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters, contain 1 uppercase letter, 1 number, and 1 symbol.");
            return;
        }

        if (verificationAnswer.trim() === "") {
            setError("Please provide an answer to the security question.");
            return;
        }

        const response = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, verificationQuestion, verificationAnswer, password }),
        });

        const data = await response.json();

        if (response.ok) {
            setMessage("Account created successfully!");
        } else {
            setError(data.message || "Registration failed.");
        }
    };

    return (
        <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your details below to sign up
                </p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="verification">Security Question</Label>
                    <select
                        id="verification"
                        className="border rounded-md p-2"
                        required
                        value={verificationQuestion}
                        onChange={(e) => setVerificationQuestion(e.target.value)}
                    >
                        <option value="mother">What is your mother's name?</option>
                    </select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="verificationAnswer">Answer to Security Question</Label>
                    <Input
                        id="verificationAnswer"
                        type="text"
                        placeholder="Enter your answer"
                        required
                        value={verificationAnswer}
                        onChange={(e) => setVerificationAnswer(e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                        id="confirm-password"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {message && <p className="text-green-500 text-sm">{message}</p>}

                <Button type="submit" className="w-full">
                    Sign Up
                </Button>
            </div>
            <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                    Login
                </a>
            </div>
        </form>
    );
}
