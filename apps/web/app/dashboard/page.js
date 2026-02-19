"use client";

import { useState, useEffect, useRef } from "react";
import { TrendingUp, AlertTriangle, CheckCircle, Clock, Loader2, ArrowRight } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";

export default function DashboardPage() {
    // --- Widget A: Academic Predictor State ---
    const [attendance, setAttendance] = useState(85);
    const [cgpa, setCgpa] = useState(8.0);
    const [prediction, setPrediction] = useState({ risk_level: "Low", predicted_cgpa: 8.2 });
    const [isPredicting, setIsPredicting] = useState(false);
    const debounceRef = useRef(null);

    // Debounced API call on slider change
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setIsPredicting(true);
            try {
                const res = await fetch(`${API_BASE}/predict`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ attendance, marks: cgpa * 10 }),
                });
                if (res.ok) {
                    const data = await res.json();
                    setPrediction(data);
                }
            } catch (err) {
                console.error("Prediction API error:", err);
            } finally {
                setIsPredicting(false);
            }
        }, 500);
        return () => clearTimeout(debounceRef.current);
    }, [attendance, cgpa]);

    // Derive risk display from API response
    const getRiskDisplay = () => {
        const level = prediction?.risk_level ?? "Low";
        if (level === "High") return { level: "High", color: "text-red-600", bg: "bg-red-600", border: "border-red-600" };
        if (level === "Medium") return { level: "Medium", color: "text-amber-600", bg: "bg-amber-600", border: "border-amber-600" };
        return { level: "Low", color: "text-emerald-600", bg: "bg-emerald-600", border: "border-emerald-600" };
    };

    const risk = getRiskDisplay();
    const predictedCgpa = prediction?.predicted_cgpa ?? "-";

    // --- Widget B: Recent Activity Data ---
    const notifications = [
        { id: 1, text: "Assignment 3 is due tomorrow", type: "urgent", time: "2h ago" },
        { id: 2, text: "New grade posted for Physics", type: "info", time: "5h ago" },
        { id: 3, text: "Career fair registration is open", type: "success", time: "1d ago" },
        { id: 4, text: "Library book overdue", type: "warning", time: "2d ago" },
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'urgent': return <AlertTriangle size={16} className="text-zinc-900" />;
            case 'success': return <CheckCircle size={16} className="text-zinc-900" />;
            case 'warning': return <Clock size={16} className="text-zinc-900" />;
            default: return <TrendingUp size={16} className="text-zinc-900" />;
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">

            {/* Widget A: Academic Predictor/Simulator */}
            <div className="md:col-span-2 lg:col-span-2 bg-white border border-zinc-200 p-6 shadow-sm hover:border-zinc-900 transition-colors">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-heading font-bold text-zinc-900 flex items-center gap-2 uppercase tracking-tight">
                            <TrendingUp className="text-zinc-900" />
                            Academic Risk Simulator
                        </h3>
                        <p className="text-zinc-500 text-sm mt-1 font-medium">Analyze perfromance metrics</p>
                    </div>

                    {/* Risk Badge */}
                    <div className={`px-4 py-1 border ${risk.border} flex items-center gap-3 bg-white`}>
                        {isPredicting ? (
                            <Loader2 size={14} className="animate-spin text-zinc-900" />
                        ) : (
                            <span className={`w-2 h-2 ${risk.bg}`}></span>
                        )}
                        <span className={`font-bold font-mono text-sm uppercase ${risk.color}`}>Risk: {risk.level}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Controls */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Attendance (%)</label>
                                <span className="text-xl font-heading font-bold text-zinc-900">{attendance}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                value={attendance}
                                onChange={(e) => setAttendance(Math.min(100, Math.max(0, Number(e.target.value))))}
                                className="w-full h-1 bg-zinc-200 appearance-none cursor-pointer accent-zinc-900"
                            />
                            <p className="text-[10px] uppercase font-bold text-zinc-400 mt-2 tracking-widest">{attendance < 75 ? "⚠️ AT RISK" : "✓ SAFE ZONE"}</p>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Average CGPA</label>
                                <span className="text-xl font-heading font-bold text-zinc-900">{cgpa}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.1"
                                value={cgpa}
                                onChange={(e) => setCgpa(Math.min(10, Math.max(0, Number(e.target.value))))}
                                className="w-full h-1 bg-zinc-200 appearance-none cursor-pointer accent-zinc-900"
                            />
                            <p className="text-[10px] uppercase font-bold text-zinc-400 mt-2 tracking-widest">Target: 10.0</p>
                        </div>

                        {/* Predicted CGPA display */}
                        <div className="p-4 border border-zinc-900 bg-zinc-50">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">AI Projection</p>
                            <div className="flex items-baseline gap-2">
                                {isPredicting ? (
                                    <Loader2 size={20} className="animate-spin text-zinc-400" />
                                ) : (
                                    <span className="text-4xl font-heading font-bold text-zinc-900">{predictedCgpa}</span>
                                )}
                                <span className="text-zinc-400 text-sm font-medium">/ 10.0</span>
                            </div>
                        </div>
                    </div>

                    {/* Visual Gauge */}
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                {/* Background circle */}
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#e4e4e7" strokeWidth="2" />
                                {/* Attendance arc */}
                                <circle
                                    cx="50" cy="50" r="45" fill="none"
                                    stroke="#18181b" strokeWidth="2"
                                    strokeDasharray="283"
                                    strokeDashoffset={283 - (283 * attendance) / 100}
                                    className="transition-all duration-500 ease-out"
                                    transform="rotate(-90 50 50)"
                                    strokeLinecap="square"
                                />
                                {/* CGPA arc (inner) */}
                                <circle
                                    cx="50" cy="50" r="35" fill="none"
                                    stroke="#71717a" strokeWidth="2"
                                    strokeDasharray="220"
                                    strokeDashoffset={220 - (220 * cgpa) / 10}
                                    className="transition-all duration-500 ease-out"
                                    transform="rotate(-90 50 50)"
                                    strokeLinecap="square"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                {isPredicting ? (
                                    <Loader2 size={24} className="animate-spin text-zinc-400" />
                                ) : (
                                    <>
                                        <span className="text-3xl font-heading font-bold text-zinc-900">{predictedCgpa}</span>
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-500">CGPA</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-4 text-center">Live Analysis</p>
                    </div>
                </div>
            </div>

            {/* Widget B: Recent Activity */}
            <div className="bg-white border border-zinc-200 p-6 shadow-sm hover:border-zinc-900 transition-colors flex flex-col">
                <h3 className="text-lg font-heading font-bold text-zinc-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
                    <Clock className="text-zinc-900" size={18} />
                    Recent Activity
                </h3>

                <div className="flex-1 space-y-0 overflow-y-auto custom-scrollbar border-l border-zinc-100 ml-2 pl-6 relative">
                    {notifications.map((note) => (
                        <div key={note.id} className="group relative pb-8 last:pb-0">
                            <span className="absolute -left-[29px] top-1 w-2 h-2 bg-zinc-200 border border-white group-hover:bg-zinc-900 transition-colors"></span>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                     <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{note.time}</span>
                                     <span className={`text-[10px] px-1.5 py-0.5 border ${note.type === 'urgent' ? 'border-red-200 text-red-600 bg-red-50' : 'border-zinc-200 text-zinc-500 bg-zinc-50'}`}>
                                        {note.type.toUpperCase()}
                                     </span>
                                </div>
                                <p className="text-sm font-medium text-zinc-900 group-hover:underline decoration-zinc-900 underline-offset-4 transition-all">
                                    {note.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="mt-8 w-full py-3 text-xs text-zinc-600 hover:text-white hover:bg-zinc-900 border border-zinc-200 hover:border-zinc-900 font-bold uppercase tracking-widest transition-colors text-center">
                    View All Notifications
                </button>
            </div>

            {/* Widget C: Career CTA — REMOVED */}

        </div>
    );
}
