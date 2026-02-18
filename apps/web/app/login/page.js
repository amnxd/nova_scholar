"use client";

import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { user, googleSignIn, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const handleSignIn = async () => {
        try {
            await googleSignIn();
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
                <h1 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome Back
                </h1>
                <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
                    Sign in to access your dashboard
                </p>

                <button
                    onClick={handleSignIn}
                    className="flex w-full items-center justify-center gap-3 rounded-lg bg-white border border-gray-300 px-4 py-3 text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                >
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google logo"
                        className="h-6 w-6"
                    />
                    <span className="text-base font-medium">Sign in with Google</span>
                </button>
            </div>
        </div>
    );
}
