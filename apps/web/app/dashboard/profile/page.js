"use client";

import { useState, useEffect } from "react";
import { User, Mail, GraduationCap, Save, Award, Calendar, Shield, Loader2, Phone, Hash, Github, Linkedin, BookOpen, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const API_BASE = "http://127.0.0.1:8000";

// Simple internal icon components
function TrendingUpIcon({ size, className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
    );
}

function CheckCircleIcon({ size, className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    );
}

// Skeleton loader for text fields
function SkeletonLine({ wide }) {
    return (
        <div className={`h-4 bg-zinc-100 rounded-none animate-pulse ${wide ? "w-3/4" : "w-1/2"}`} />
    );
}

export default function ProfilePage() {
    const { user, userUid } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);

    // Editable form state
    const [form, setForm] = useState({
        uid: "student_1",
        name: "",
        email: "",
        phone: "",
        branch: "",
        year: 3,
        semester: "",
        enrollment_no: "",
        cgpa: 0,
        attendance: 0,
        github_url: "",
        linkedin_url: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const uid = userUid || "student_1";
            try {
                const res = await fetch(`${API_BASE}/student/profile?uid=${uid}`);
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                    setForm({
                        uid: data.uid || uid,
                        name: data.name || "",
                        email: user?.email || data.email || "",
                        phone: data.phone || "",
                        branch: data.branch || "",
                        year: data.year || 3,
                        semester: data.semester || "",
                        enrollment_no: data.enrollment_no || "",
                        cgpa: data.cgpa || 0,
                        attendance: data.attendance || 0,
                        github_url: data.github_url || "",
                        linkedin_url: data.linkedin_url || "",
                    });
                }
            } catch (err) {
                console.error("Profile fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        if (!user) return; // wait for auth
        fetchProfile();
    }, [user, userUid]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage(null);
        try {
            const res = await fetch(`${API_BASE}/student/profile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    email: user?.email || form.email,
                    year: parseInt(form.year) || 0,
                    cgpa: parseFloat(form.cgpa) || 0,
                    attendance: parseFloat(form.attendance) || 0,
                }),
            });
            const data = await res.json();
            if (data.status === "success") {
                setSaveMessage({ type: "success", text: "Profile saved successfully!" });
                // Update displayed profile with new values
                setProfile(prev => ({
                    ...prev,
                    ...form,
                    risk_status: data.risk_status,
                }));
            } else {
                setSaveMessage({ type: "error", text: data.message || "Failed to save." });
            }
        } catch (err) {
            setSaveMessage({ type: "error", text: "Could not connect to the server." });
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage(null), 4000);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Section 1: Header */}
            <div className="bg-white border border-zinc-200 p-8 shadow-sm relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6">
                    <div className="w-32 h-32 border border-zinc-200 bg-zinc-50 flex items-center justify-center text-zinc-400">
                        <User size={64} className="opacity-50" />
                    </div>

                    <div className="flex-1 text-center md:text-left mb-2">
                        {isLoading ? (
                            <div className="space-y-3">
                                <div className="h-8 bg-zinc-100 animate-pulse w-48 mx-auto md:mx-0" />
                                <div className="h-4 bg-zinc-100 animate-pulse w-64 mx-auto md:mx-0" />
                            </div>
                        ) : (
                            <>
                                <h1 className="text-3xl font-heading font-bold text-zinc-900 uppercase tracking-tighter">{profile?.name ?? "—"}</h1>
                                <p className="text-zinc-500 font-medium font-mono text-sm">{profile?.branch ?? "—"}</p>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4">
                                    <span className="px-3 py-1 border border-zinc-200 text-zinc-600 text-xs font-bold uppercase tracking-wider">
                                        Year {profile?.year ?? "—"}
                                    </span>
                                    {profile?.semester && (
                                        <span className="px-3 py-1 border border-zinc-200 text-zinc-600 text-xs font-bold uppercase tracking-wider">
                                            {profile.semester}
                                        </span>
                                    )}
                                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-1 border ${
                                        profile?.risk_status === "At Risk" 
                                        ? "border-red-200 text-red-600 bg-red-50" 
                                        : "border-emerald-200 text-emerald-600 bg-emerald-50"
                                    }`}>
                                        {profile?.risk_status === "At Risk" ? <AlertTriangle size={12} /> : <Shield size={12} />}
                                        {profile?.risk_status ?? "Safe"}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Section 2: Edit Details Form */}
                <div className="md:col-span-2 bg-white border border-zinc-200 p-8 shadow-sm">
                    <h2 className="text-xl font-heading font-bold text-zinc-900 mb-8 flex items-center gap-2 uppercase tracking-tight border-b border-zinc-100 pb-4">
                        <User size={20} className="text-zinc-900" />
                        Personal Details
                        {isLoading && <Loader2 size={16} className="animate-spin text-zinc-400 ml-1" />}
                    </h2>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Full Name</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    {isLoading ? (
                                        <div className="w-full pl-10 pr-4 py-2 bg-zinc-50"><SkeletonLine wide /></div>
                                    ) : (
                                        <input type="text" value={form.name} onChange={e => handleChange("name", e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:ring-0 outline-none text-zinc-900 text-sm font-medium transition-colors placeholder:text-zinc-400" />
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    {isLoading ? (
                                        <div className="w-full pl-10 pr-4 py-2 bg-zinc-50"><SkeletonLine wide /></div>
                                    ) : (
                                        <input type="email" value={user?.email || form.email} readOnly
                                            className="w-full pl-10 pr-4 py-2 bg-zinc-100 border border-zinc-200 outline-none text-zinc-500 cursor-not-allowed text-sm font-medium font-mono" />
                                    )}
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Phone Number</label>
                                <div className="relative">
                                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    {isLoading ? (
                                        <div className="w-full pl-10 pr-4 py-2 bg-zinc-50"><SkeletonLine wide /></div>
                                    ) : (
                                        <input type="tel" placeholder="+91 9876543210" value={form.phone} onChange={e => handleChange("phone", e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:ring-0 outline-none text-zinc-900 text-sm font-medium transition-colors placeholder:text-zinc-400" />
                                    )}
                                </div>
                            </div>

                            {/* Enrollment No */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Enrollment No.</label>
                                <div className="relative">
                                    <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    {isLoading ? (
                                        <div className="w-full pl-10 pr-4 py-2 bg-zinc-50"><SkeletonLine /></div>
                                    ) : (
                                        <input type="text" placeholder="e.g. 21CSE1234" value={form.enrollment_no} onChange={e => handleChange("enrollment_no", e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:ring-0 outline-none text-zinc-900 text-sm font-medium transition-colors placeholder:text-zinc-400 font-mono" />
                                    )}
                                </div>
                            </div>

                            {/* Branch */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Branch / Major</label>
                                <div className="relative">
                                    <GraduationCap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    {isLoading ? (
                                        <div className="w-full pl-10 pr-4 py-2 bg-zinc-50"><SkeletonLine wide /></div>
                                    ) : (
                                        <select value={form.branch} onChange={e => handleChange("branch", e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:ring-0 outline-none text-zinc-900 text-sm font-medium transition-colors appearance-none">
                                            <option value="">Select Branch</option>
                                            <option value="CSE">Computer Science & Engineering</option>
                                            <option value="ECE">Electronics & Communication</option>
                                            <option value="ME">Mechanical Engineering</option>
                                            <option value="EE">Electrical Engineering</option>
                                            <option value="CE">Civil Engineering</option>
                                            <option value="IT">Information Technology</option>
                                        </select>
                                    )}
                                </div>
                            </div>

                            {/* Year */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Year</label>
                                <div className="relative">
                                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    {isLoading ? (
                                        <div className="w-full pl-10 pr-4 py-2 bg-zinc-50"><SkeletonLine /></div>
                                    ) : (
                                        <select value={form.year} onChange={e => handleChange("year", e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:ring-0 outline-none text-zinc-900 text-sm font-medium transition-colors appearance-none">
                                            <option value={1}>1st Year</option>
                                            <option value={2}>2nd Year</option>
                                            <option value={3}>3rd Year</option>
                                            <option value={4}>4th Year</option>
                                        </select>
                                    )}
                                </div>
                            </div>

                            {/* Semester */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Semester</label>
                                <div className="relative">
                                    <BookOpen size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    {isLoading ? (
                                        <div className="w-full pl-10 pr-4 py-2 bg-zinc-50"><SkeletonLine /></div>
                                    ) : (
                                        <select value={form.semester} onChange={e => handleChange("semester", e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:ring-0 outline-none text-zinc-900 text-sm font-medium transition-colors appearance-none">
                                            <option value="">Select Semester</option>
                                            {[1,2,3,4,5,6,7,8].map(s => (
                                                <option key={s} value={`Semester ${s}`}>Semester {s}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Separator — Academic Data */}
                        <div className="pt-2">
                            <h3 className="text-sm font-heading font-bold text-zinc-900 mb-6 flex items-center gap-2 uppercase tracking-wide border-t border-zinc-100 pt-6">
                                <Award size={16} className="text-zinc-900" />
                                Academic Data
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* CGPA */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Current CGPA</label>
                                    <input type="number" step="0.1" min="0" max="10" value={form.cgpa} onChange={e => handleChange("cgpa", e.target.value)}
                                        className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:ring-0 outline-none text-zinc-900 text-sm font-medium transition-colors" />
                                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Scale: 0.0 – 10.0</p>
                                </div>

                                {/* Attendance */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Attendance (%)</label>
                                    <input type="number" step="1" min="0" max="100" value={form.attendance} onChange={e => handleChange("attendance", e.target.value)}
                                        className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:ring-0 outline-none text-zinc-900 text-sm font-medium transition-colors" />
                                    {form.attendance < 75 && form.attendance > 0 && (
                                        <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider flex items-center gap-1 mt-1">
                                            <AlertTriangle size={10} /> Below 75% — At Risk
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Separator — Links */}
                        <div className="pt-2">
                            <h3 className="text-sm font-heading font-bold text-zinc-900 mb-6 flex items-center gap-2 uppercase tracking-wide border-t border-zinc-100 pt-6">
                                <Github size={16} className="text-zinc-900" />
                                Social & Portfolio Links
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* GitHub */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">GitHub URL</label>
                                    <div className="relative">
                                        <Github size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input type="url" placeholder="https://github.com/username" value={form.github_url} onChange={e => handleChange("github_url", e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:ring-0 outline-none text-zinc-900 text-sm font-medium transition-colors placeholder:text-zinc-400" />
                                    </div>
                                </div>

                                {/* LinkedIn */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">LinkedIn URL</label>
                                    <div className="relative">
                                        <Linkedin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                        <input type="url" placeholder="https://linkedin.com/in/username" value={form.linkedin_url} onChange={e => handleChange("linkedin_url", e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:ring-0 outline-none text-zinc-900 text-sm font-medium transition-colors placeholder:text-zinc-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save Button + Message */}
                        <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                            {saveMessage && (
                                <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 border ${
                                    saveMessage.type === "success"
                                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                        : "bg-red-50 border-red-200 text-red-700"
                                }`}>
                                    {saveMessage.type === "success" ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                                    {saveMessage.text}
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-60 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all ml-auto"
                            >
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section 3: Academic Stats (right sidebar) */}
                <div className="space-y-6">
                    <div className="bg-white border border-zinc-200 p-6 shadow-sm">
                        <h3 className="text-lg font-heading font-bold text-zinc-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
                            <Award className="text-zinc-900" size={20} />
                            Academic Performance
                        </h3>

                        <div className="space-y-4">
                            <div className="p-4 bg-zinc-50 border border-zinc-100 flex items-center justify-between group hover:border-zinc-300 transition-colors">
                                <div>
                                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Current CGPA</p>
                                    {isLoading ? (
                                        <div className="h-8 w-16 bg-zinc-200 animate-pulse mt-1" />
                                    ) : (
                                        <p className="text-3xl font-heading font-bold text-zinc-900 mt-1">{profile?.cgpa ?? "—"}</p>
                                    )}
                                </div>
                                <div className="h-10 w-10 bg-white border border-zinc-200 flex items-center justify-center text-zinc-900">
                                    <TrendingUpIcon size={20} />
                                </div>
                            </div>

                            <div className="p-4 bg-zinc-50 border border-zinc-100 flex items-center justify-between group hover:border-zinc-300 transition-colors">
                                <div>
                                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Attendance</p>
                                    {isLoading ? (
                                        <div className="h-8 w-16 bg-zinc-200 animate-pulse mt-1" />
                                    ) : (
                                        <p className="text-3xl font-heading font-bold text-zinc-900 mt-1">{profile?.attendance ?? "—"}%</p>
                                    )}
                                </div>
                                <div className="h-10 w-10 bg-white border border-zinc-200 flex items-center justify-center text-zinc-900">
                                    <CheckCircleIcon size={20} />
                                </div>
                            </div>

                            {/* Risk Status indicator */}
                            {!isLoading && (
                                <div className={`p-4 border flex items-center gap-3 ${
                                    profile?.risk_status === "At Risk" 
                                        ? "bg-red-50 border-red-100 text-red-900" 
                                        : "bg-emerald-50 border-emerald-100 text-emerald-900"
                                }`}>
                                    {profile?.risk_status === "At Risk" ? <AlertTriangle size={20} className="text-red-600" /> : <Shield size={20} className="text-emerald-600" />}
                                    <div>
                                        <p className="font-bold text-sm uppercase tracking-wider">Status: {profile?.risk_status ?? "Safe"}</p>
                                        <p className="text-[10px] font-medium opacity-75">
                                            {profile?.risk_status === "At Risk"
                                                ? "Attendance < 75% or CGPA < 5.0"
                                                : "Academic standing is good"}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-zinc-900 p-6 text-white shadow-sm border border-zinc-900 pattern-grid">
                        <h3 className="font-bold font-heading text-lg mb-2 uppercase tracking-wide">Pro Tip</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">Add your GitHub and LinkedIn URLs to boost your profile visibility for placement drives and recruiters.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
