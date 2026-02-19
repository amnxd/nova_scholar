"use client";

import { useState, useEffect } from "react";
import { Plus, BookOpen, User, Calendar } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const API_BASE = "http://127.0.0.1:8000";

export default function AdminCoursesPage() {
    const { user, userRole } = useAuth();
    const [courses, setCourses] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: "", description: "" });
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/courses`);
            const data = await res.json();
            if (data.courses) {
                // Filter to show only courses created by this admin (optional, showing all for now)
                setCourses(data.courses);
            }
        } catch (error) {
            console.error("Failed to fetch courses", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setCreating(true);

        try {
            const token = await user.getIdToken();
            const res = await fetch(`${API_BASE}/courses`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newCourse.title,
                    description: newCourse.description,
                    teacher_id: user.uid,
                    teacher_name: user.email.split("@")[0], // Simple name derivation
                    token: token
                })
            });

            if (res.ok) {
                setShowCreateModal(false);
                setNewCourse({ title: "", description: "" });
                fetchCourses(); // Refresh list
            } else {
                alert("Failed to create course");
            }
        } catch (error) {
            console.error("Error creating course:", error);
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Create and manage your courses.</p>
                </div>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus size={18} />
                    Create New Course
                </button>
            </div>

            {/* Course List */}
            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading courses...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div key={course.id} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                    <BookOpen size={24} />
                                </div>
                                <span className="text-xs font-mono text-gray-400">ID: {course.id.slice(0, 6)}...</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                            
                            <div className="flex items-center gap-2 text-xs text-gray-400 border-t border-gray-100 dark:border-slate-800 pt-4">
                                <User size={14} />
                                <span>{course.teacher_name}</span>
                            </div>
                        </div>
                    ))}
                    
                    {courses.length === 0 && (
                        <div className="col-span-full text-center py-10 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
                            <p className="text-gray-500 dark:text-gray-400">No courses found. Create your first course!</p>
                        </div>
                    )}
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Course</h2>
                        </div>
                        <form onSubmit={handleCreateCourse} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Title</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newCourse.title}
                                    onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    placeholder="e.g. Advanced Python"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea 
                                    required
                                    value={newCourse.description}
                                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white h-24"
                                    placeholder="Brief description of the course..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={creating}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg shadow-blue-500/20 disabled:opacity-70 flex items-center gap-2"
                                >
                                    {creating && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                    Create Course
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
