"use client";

import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8 dark:bg-gray-900">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <button
                        onClick={logout}
                        className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
                        User Profile
                    </h2>
                    <div className="flex items-center gap-4">
                        {user.photoURL && (
                            <img
                                src={user.photoURL}
                                alt="Profile"
                                className="h-16 w-16 rounded-full"
                            />
                        )}
                        <div>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">
                                {user.displayName}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
