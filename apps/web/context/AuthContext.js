"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

const API_BASE = "http://127.0.0.1:8000";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Sync user role with backend
    const syncUserRole = async (firebaseUser, selectedRole = "student") => {
        try {
            const token = await firebaseUser.getIdToken();
            const response = await fetch(`${API_BASE}/auth/sync`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, role: selectedRole }),
            });

            if (!response.ok) {
                throw new Error("Failed to sync user with backend");
            }

            const data = await response.json();
            if (data.status === "success") {
                setUserRole(data.role);
                return data.role;
            } else {
                throw new Error(data.message || "Sync failed");
            }
        } catch (err) {
            console.error("syncUserRole error:", err);
            return null;
        }
    };

    useEffect(() => {
        let unsubscribe = () => { };
        try {
            unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
                if (currentUser) {
                    const role = await syncUserRole(currentUser);
                    if (role) {
                        setUser(currentUser);
                    } else {
                        // Sync failed — sign out stale session
                        try { await signOut(auth); } catch (_) { }
                        setUser(null);
                        setUserRole(null);
                    }
                } else {
                    setUser(null);
                    setUserRole(null);
                }
                setLoading(false);
            });
        } catch (err) {
            console.warn("Firebase auth not available:", err.message);
            setLoading(false);
        }
        return () => unsubscribe();
    }, []);

    // Sign up with email/password
    const signUp = async (email, password, role) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const syncedRole = await syncUserRole(result.user, role);
        return { user: result.user, role: syncedRole };
    };

    // Sign in with email/password
    const signIn = async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const syncedRole = await syncUserRole(result.user);
        return { user: result.user, role: syncedRole };
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setUserRole(null);
            router.push("/login");
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userRole, setUserRole, loading, signUp, signIn, syncUserRole, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
