"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Plus, ChevronLeft, ChevronRight, Edit2, Eye, MoreHorizontal } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const API_BASE = "http://127.0.0.1:8000";

export default function StudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
        fetchStudents();
    }
  }, [user]);

  const fetchStudents = async () => {
    try {
        const token = await user.getIdToken();
        const res = await fetch(`${API_BASE}/teacher/students`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                teacher_id: user.uid,
                token: token
            })
        });
        const data = await res.json();
        if (data.students) {
            setStudents(data.students);
        }
    } catch (error) {
        console.error("Failed to fetch students", error);
    } finally {
        setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Roster</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage enrolled students across your courses.</p>
        </div>
        {/* Removed "Add Student" button as enrollment is now self-service via courses */}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-red-500/20 outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
             <div className="text-center py-10 text-gray-500">Loading roster...</div>
        ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Name/Email</th>
                    <th className="px-6 py-4 font-semibold">Roll No</th>
                    <th className="px-6 py-4 font-semibold">Branch</th>
                    <th className="px-6 py-4 font-semibold">Year</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                            {student.avatar}
                        </div>
                        <div>
                             <span className="block font-medium text-gray-900 dark:text-white">{student.name}</span>
                             <span className="text-xs text-gray-500">{student.email}</span>
                        </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                        {student.roll}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                        {student.branch}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                        {student.year}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition">
                            <Eye size={16} />
                        </button>
                        </div>
                    </td>
                    </tr>
                ))}
                {filteredStudents.length === 0 && (
                     <tr>
                        <td colSpan="5" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                            No students found.
                        </td>
                     </tr>
                )}
                </tbody>
            </table>
            </div>
        )}
      </div>
    </div>
  );
}
