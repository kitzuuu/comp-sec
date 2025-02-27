import { DashboardForm } from "@/components/dashboard-form";

export default function DashboardPage() {
    return (
        <div className="relative flex justify-center items-center min-h-screen bg-gray-100">
            {/* Background Image */}
            <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/cristi.svg')" }}></div>

            {/* Dashboard Content */}
            <div className="relative z-10">
                <DashboardForm />
            </div>
        </div>
    );
}
