import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
    return (
        <div className="relative flex justify-center items-center min-h-screen bg-gray-100">
            {/* Background SVG */}
            <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/stock-market.svg')" }}></div>

            {/* Forgot Password Form */}
            <div className="relative z-10">
                <ForgotPasswordForm />
            </div>
        </div>
    );
}
