"use client";
import { useEffect } from "react";
import { DashboardForm } from "@/components/dashboard-form";

export default function DashboardPage() {
    useEffect(() => {
        localStorage.setItem("lastVisitedAdminDashboard", "false");
    }, []);

    return (
        <div className="relative flex justify-center items-center min-h-screen bg-gray-100">
            <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/stock-market.svg')" }}></div>
            <div className="relative z-10">
                <DashboardForm />
            </div>
        </div>
    );
}
