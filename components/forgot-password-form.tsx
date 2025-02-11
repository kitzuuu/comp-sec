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

    try {
      const res = await fetch(`/api/forgot-password?username=${email}`);
      const data = await res.json();

      if (res.ok) {
        setPassword(data.password); // Display decrypted password
      } else {
        setMessage(data.message || "User not found.");
      }
    } catch {
        console.log("Error retrieving password.");

    }
  };

  return (
      <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow-lg bg-white relative">
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
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

        {message && <p className="text-red-500 text-center">{message}</p>}
        {password && (
            <p className="text-center">
              Your password: <strong>{password}</strong>
            </p>
        )}

        <Button onClick={() => router.push("/login")} className="w-full mt-3">
          Back to Login
        </Button>
      </div>
  );
}
