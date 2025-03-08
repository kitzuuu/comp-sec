"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Save username in session storage
        sessionStorage.setItem("username", data.user.username);

        if (data.user.isAdmin) {
          // Admin user — save flag for later (helps with navigation logic if needed)
          localStorage.setItem("isAdmin", "true");
          router.push("/admin-dashboard");
        } else {
          // Normal user
          localStorage.setItem("isAdmin", "false");
          router.push("/dashboard");
        }
      } else {
        setError(data.message || "Login failed.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    }
  };

  return (
      <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
                id="email"
                type="text"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2 relative">
            <Label htmlFor="password">Password</Label>
            <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <a
                href="/forgot-password"
                className="absolute right-0 text-sm mt-[-10px] text-primary hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <a href="/register" className="underline underline-offset-4">
            Sign up
          </a>
        </div>
      </form>
  );
}
