"use client";

import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
    const { user, userRole, signUp, loading } = useAuth();
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // If already logged in, redirect
    useEffect(() => {
        if (!loading && user && userRole) {
            router.replace(userRole === "admin" ? "/admin" : "/dashboard");
        }
    }, [user, userRole, loading, router]);

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        // Validate confirm password
        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setErrorMsg("Password must be at least 6 characters.");
            return;
        }



        setIsSubmitting(true);
        try {
            const { role } = await signUp(email, password, selectedRole);
            if (role === "admin") {
                router.push("/admin");
            } else if (role) {
                router.push("/dashboard");
            } else {
                setErrorMsg("Account created but failed to sync with server. Try logging in.");
            }
        } catch (error) {
            if (error?.code === "auth/email-already-in-use") {
                setErrorMsg("This email is already registered. Try logging in.");
            } else if (error?.code === "auth/invalid-email") {
                setErrorMsg("Please enter a valid email address.");
            } else if (error?.code === "auth/weak-password") {
                setErrorMsg("Password is too weak. Use at least 6 characters.");
            } else {
                setErrorMsg(error?.message || "Signup failed. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || (user && userRole)) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
                <h1 className="mb-2 text-center text-3xl font-bold text-gray-900 dark:text-white">
                    Manan AI
                </h1>
                <p className="mb-8 text-center text-gray-500 dark:text-gray-400">
                    Create your account
                </p>

                {errorMsg && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-5">
                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            I am a
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => { setSelectedRole("student"); setErrorMsg(""); }}
                                className={`flex flex-col items-center justify-center rounded-xl border-2 p-3 transition-all ${selectedRole === "student"
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                        : "border-gray-200 hover:border-blue-200 dark:border-gray-700 dark:hover:border-gray-600"
                                    }`}
                            >
                                <span className="text-xl mb-1">🎓</span>
                                <span className={`text-sm font-medium ${selectedRole === "student" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
                                    }`}>Student</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => { setSelectedRole("admin"); setErrorMsg(""); }}
                                className={`flex flex-col items-center justify-center rounded-xl border-2 p-3 transition-all ${selectedRole === "admin"
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                        : "border-gray-200 hover:border-blue-200 dark:border-gray-700 dark:hover:border-gray-600"
                                    }`}
                            >
                                <span className="text-xl mb-1">👨‍🏫</span>
                                <span className={`text-sm font-medium ${selectedRole === "admin" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
                                    }`}>Admin/Faculty</span>
                            </button>
                        </div>

                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            required
                            minLength={6}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter your password"
                            required
                            minLength={6}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-white font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/30 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                Creating account...
                            </span>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium dark:text-blue-400">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
