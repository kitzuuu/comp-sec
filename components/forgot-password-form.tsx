"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [selectedQuestion, setSelectedQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [stage, setStage] = useState("request");
    const [message, setMessage] = useState("");

    const validatePassword = (password: string) => {
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
    };

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        console.log("Submitting data:", { email, name, selectedQuestion, securityAnswer });


        if (!email.trim() || !name.trim() || !selectedQuestion.trim() || !securityAnswer.trim()) {
            setMessage("❌ All fields are required.");
            return;
        }

        try {
            const res = await fetch(`/api/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name, securityAnswer }),
            });

            const data = await res.json();

            if (res.ok) {
                alert(`Your reset token: ${data.token}\nThis token expires in 5 minutes.`);
                setToken(data.token);
                setStage("reset");
            } else {
                setMessage(data.message || "Error resetting password.");
            }
        } catch {
            setMessage("❌ Error processing request. Please try again.");
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!token.trim() || !newPassword.trim() || !confirmPassword.trim()) {
            setMessage("❌ All fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            const res = await fetch(`/api/reset-password`, { // ✅ Now sending to /api/reset-password
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, token, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                alert("✅ Password successfully reset! Redirecting to login.");
                window.location.href = "/login";
            } else {
                setMessage(data.message || "Error resetting password.");
            }
        } catch {
            setMessage("❌ Error processing request. Please try again.");
        }
    };


    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-center">
                {stage === "request" ? "Forgot Password" : "Reset Password"}
            </h1>

            {stage === "request" ? (
                <form onSubmit={handleRequestReset} className="flex flex-col gap-4">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <select
                        className="border rounded-md p-2"
                        value={selectedQuestion}
                        onChange={(e) => setSelectedQuestion(e.target.value)}
                        required
                    >
                        <option value="">Select a security question</option>
                        <option value="mother">What is your mother&#39;s name?</option>
                    </select>
                    <Input
                        type="text"
                        placeholder="Enter your answer"
                        value={securityAnswer}
                        onChange={(e) => setSecurityAnswer(e.target.value)}
                        required
                        disabled={!selectedQuestion}
                    />
                    <Button type="submit">Request Password Reset</Button>
                </form>
            ) : (
                <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                    <Input
                        type="text"
                        placeholder="Enter reset token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button type="submit">Reset Password</Button>
                </form>
            )}

            {message && <p className="text-red-500 text-center">{message}</p>}
        </div>
    );
}
