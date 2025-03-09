"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

export function AdminAddUser({ onCloseAction }: { onCloseAction: () => void }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [verificationQuestion, setVerificationQuestion] = useState("mother");
    const [verificationAnswer, setVerificationAnswer] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const validatePassword = (password: string) => {
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
    };

    const handleAddUser = async () => {
        setError(null);
        setMessage(null);

        if (!name.trim() || !email.trim() || !verificationAnswer.trim() || !password.trim() || !confirmPassword.trim()) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters, contain 1 uppercase letter, 1 number, and 1 symbol.");
            return;
        }

        try {
            const response = await fetch("/api/admin-dashboard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "add",
                    name,
                    email,
                    verificationQuestion,
                    verificationAnswer,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("User added successfully!");
                setTimeout(() => onCloseAction(), 2000); 
            } else {
                setError(data.message || "Failed to add user.");
            }
        } catch {
            setError("Error adding user. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md border border-gray-300">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New User</h2>

                <div className="mb-4">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Enter full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter user email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="verification">Security Question</Label>
                    <select
                        id="verification"
                        className="border rounded-md p-2 w-full"
                        value={verificationQuestion}
                        onChange={(e) => setVerificationQuestion(e.target.value)}
                    >
                        <option value="mother">What is your mother&#39;s name?</option>
                    </select>
                </div>

                <div className="mb-4">
                    <Label htmlFor="verificationAnswer">Answer to Security Question</Label>
                    <Input
                        id="verificationAnswer"
                        type="text"
                        placeholder="Enter your answer"
                        value={verificationAnswer}
                        onChange={(e) => setVerificationAnswer(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {message && <p className="text-green-500 text-sm">{message}</p>}

                <div className="flex justify-end space-x-4 mt-6">
                    <Button variant="secondary" onClick={onCloseAction}>Cancel</Button>
                    <Button variant="default" onClick={handleAddUser}>Add User</Button>
                </div>
            </div>
        </div>
    );
}
