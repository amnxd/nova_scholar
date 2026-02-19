"use client";

import { useState, useEffect } from "react";
import { Users, AlertCircle, HelpCircle, Send, TrendingUp, AlertTriangle, BookOpen } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboardPage() {
    const [notificationSent, setNotificationSent] = useState(false);
    const [stats, setStats] = useState([
        { label: "Total Students", value: "...", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
        { label: "Avg Attendance", value: "...", icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
        { label: "Unsolved Doubts", value: "...", icon: HelpCircle, color: "text-orange-600", bg: "bg-orange-100" },
    ]);
    const { user } = useAuth(); // Assuming useAuth imported

    useEffect(() => {
        if (user) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const token = await user.getIdToken();
            const res = await fetch("http://127.0.0.1:8000/admin/stats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, teacher_id: user.uid })
            });
            const data = await res.json();
            
            if (data.total_students !== undefined) {
                setStats([
                    { label: "Total Students", value: data.total_students, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
                    { label: "Active Courses", value: data.active_courses, icon: BookOpen, color: "text-green-600", bg: "bg-green-100" },
                    { label: "Unsolved Doubts", value: data.unsolved_doubts, icon: HelpCircle, color: "text-orange-600", bg: "bg-orange-100" },
                ]);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    // --- Data ---
    const students = [
        { id: 1, name: "Arjun Singh", roll: "CS2101", attendance: 65, cgpa: 4.8, status: "Critical" },
        { id: 2, name: "Priya Sharma", roll: "CS2104", attendance: 88, cgpa: 8.5, status: "Safe" },
        { id: 3, name: "Rahul Verma", roll: "CS2109", attendance: 72, cgpa: 6.2, status: "Warning" },
        { id: 4, name: "Ananya Gupta", roll: "CS2115", attendance: 92, cgpa: 9.1, status: "Safe" },
        { id: 5, name: "Vikram Das", roll: "CS2120", attendance: 60, cgpa: 4.5, status: "Critical" },
        { id: 6, name: "Neha Patel", roll: "CS2122", attendance: 74, cgpa: 5.8, status: "Warning" },
    ];

    const doubtsData = [
        { name: 'Dyn. Prog.', count: 45 },
        { name: 'Semaphores', count: 32 },
        { name: 'React Hooks', count: 28 },
        { name: 'SQL Joins', count: 24 },
        { name: 'REST APIs', count: 18 },
        { name: 'Graph Theory', count: 15 },
    ];

    const handleBatchNotify = () => {
        setNotificationSent(true);
        setTimeout(() => setNotificationSent(false), 3000);
    };

    const atRiskCount = students.filter(s => s.status === 'Critical' || s.status === 'Warning').length;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-300">
        
        {/* Section C: Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                    <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl ${stat.bg} dark:bg-slate-800 flex items-center justify-center ${stat.color}`}>
                            <Icon size={28} />
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
                        </div>
                    </div>
                )
            })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Section A: The "At-Risk" Heatmap */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-lg overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <AlertCircle className="text-red-500" size={20} />
                            Critical Attention Needed
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Students falling below academic thresholds.</p>
                    </div>
                    
                    <button 
                        onClick={handleBatchNotify}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-red-500/20"
                    >
                        <Send size={16} />
                        Batch Notify ({atRiskCount})
                    </button>
                </div>

                {notificationSent && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 text-sm animate-in slide-in-from-top-2">
                        <p className="font-bold">Success!</p>
                        <p>Alert sent to {atRiskCount} at-risk students.</p>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Student Name</th>
                                <th className="px-6 py-4 font-semibold">Roll No</th>
                                <th className="px-6 py-4 font-semibold">Attendance</th>
                                <th className="px-6 py-4 font-semibold">CGPA</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        {student.name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                                        {student.roll}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${student.attendance < 75 ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}`}>
                                            {student.attendance}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${student.cgpa < 5.0 ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}`}>
                                            {student.cgpa}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                            student.status === 'Critical' ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/30" : 
                                            student.status === 'Warning' ? "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/10 dark:text-orange-400 dark:border-orange-900/30" : 
                                            "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/10 dark:text-green-400 dark:border-green-900/30"
                                        }`}>
                                            {student.status === 'Critical' && <AlertTriangle size={10} />}
                                            {student.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Section B: Curriculum Analytics */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-lg p-6 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <TrendingUp className="text-blue-600" size={20} />
                    Most Asked Doubts (This Week)
                </h3>
                <p className="text-sm text-gray-500 mb-6">Topic-wise breakdown of student queries.</p>

                <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={doubtsData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                            <XAxis type="number" hide />
                            <YAxis 
                                dataKey="name" 
                                type="category" 
                                width={100} 
                                tick={{fontSize: 12, fill: '#6b7280'}} 
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip 
                                cursor={{fill: 'transparent'}}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                                {doubtsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#3b82f6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl flex gap-3">
                    <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-lg h-fit text-blue-600 dark:text-blue-300">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">AI Insight</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            <span className="font-semibold text-blue-600">60%</span> of doubts are about <span className="font-semibold">'Dynamic Programming'</span>. Scheduling a remedial class is highly recommended.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
