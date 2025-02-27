"use client";
import { useState, useEffect } from "react";

export function ComingSoonForm() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const finalDate = new Date("October 13, 2025 00:00:00").getTime();

        const interval = setInterval(() => {
            const currentTime = new Date().getTime();
            const distance = finalDate - currentTime;

            if (distance < 0) {
                clearInterval(interval); // Stop the countdown once the date has passed
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative bg-white p-6 rounded-lg  w-4/5 max-w-2xl text-center">
            <h1 className="text-3xl font-bold mb-6 text-primary">Coming Soon</h1>
            <p className="text-lg text-gray-600 mb-6">We are working hard to bring this feature live! Stay tuned.</p>

            {/* Countdown Timer */}
            <div className="text-4xl font-semibold text-primary mb-6">
                <div className="flex justify-center space-x-6">
                    <div className="text-center">
                        <span className="block text-2xl font-bold">{timeLeft.days}</span>
                        <span className="text-sm">Days</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-2xl font-bold">{timeLeft.hours}</span>
                        <span className="text-sm">Hours</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-2xl font-bold">{timeLeft.minutes}</span>
                        <span className="text-sm">Minutes</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-2xl font-bold">{timeLeft.seconds}</span>
                        <span className="text-sm">Seconds</span>
                    </div>
                </div>
            </div>

            {/* Button to go back */}
            <button
                onClick={() => window.location.href = "/dashboard"}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
            >
                Go Back to Dashboard
            </button>
        </div>
    );
}
