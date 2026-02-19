"use client";

import { Book, FileUp, MoreVertical, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function CurriculumPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); // Assuming useAuth is imported

    // Fetch real courses
    useEffect(() => {
        if (user) {
            fetch("http://127.0.0.1:8000/courses") // In real app, filter by teacher_id
                .then(res => res.json())
                .then(data => {
                    if (data.courses) {
                         const mapped = data.courses.map(c => ({
                             id: c.id,
                             title: c.title,
                             code: c.id.substring(0, 6).toUpperCase(), // simplified code
                             doubts: c.doubts_count || 0,
                             coverage: c.syllabus_uploaded ? 100 : 0,
                             color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
                             syllabus_uploaded: c.syllabus_uploaded
                         }));
                         setCourses(mapped);
                    }
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [user]);

    const difficultTopics = [
        "Dynamic Programming (CS202)",
        "Semaphores (CS204)",
        "B-Trees (CS305)",
        "TCP Congestion (CS401)",
        "Graph Traversals (CS101)"
    ];

    const [draggingId, setDraggingId] = useState(null);

    const handleDragOver = (e, id) => {
        e.preventDefault();
        setDraggingId(id);
    };

    const handleDragLeave = () => {
        setDraggingId(null);
    };

    const handleDrop = async (e, courseId) => {
        e.preventDefault();
        setDraggingId(null);
        
        // Simulating upload
        try {
            const token = await user.getIdToken();
            const res = await fetch(`http://127.0.0.1:8000/courses/${courseId}/syllabus`, {
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({ token, file_url: "https://example.com/mock-syllabus.pdf" })
            });
            if (res.ok) {
                alert("Syllabus marked as uploaded!");
                // Update local state
                setCourses(prev => prev.map(c => c.id === courseId ? { ...c, coverage: 100, syllabus_uploaded: true } : c));
            } else {
                alert("Upload failed");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const [deleteMenuOpen, setDeleteMenuOpen] = useState(null);

    const handleDelete = async (courseId) => {
        if (!confirm("Are you sure you want to delete this course?")) return;

        try {
            const token = await user.getIdToken();
            const res = await fetch(`http://127.0.0.1:8000/courses/${courseId}?token=${token}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.status === "success") {
                setCourses(prev => prev.filter(c => c.id !== courseId));
                setDeleteMenuOpen(null);
            } else {
                alert("Failed to delete: " + data.message);
            }
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in zoom-in duration-300">
      
      {/* Main Grid */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Book className="text-red-600" />
                Curriculum Manager
            </h1>
            <span className="text-sm text-gray-500 font-medium">{courses.length} Active Courses</span>
        </div>

        {loading ? (
             <p className="text-center text-gray-500">Loading courses...</p>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20"> {/* pb-20 for dropdown space */}
            {courses.map((subject) => (
                <div key={subject.id} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative group">
                    <div className="flex justify-between items-start mb-4 relative">
                        <div className={`p-3 rounded-xl ${subject.color}`}>
                            <Book size={24} />
                        </div>
                        <div className="relative">
                            <button 
                                onClick={() => setDeleteMenuOpen(deleteMenuOpen === subject.id ? null : subject.id)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                            >
                                <MoreVertical size={20} />
                            </button>
                            
                            {deleteMenuOpen === subject.id && (
                                <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
                                    <button 
                                        onClick={() => handleDelete(subject.id)}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{subject.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mb-6">{subject.code}</p>

                    <div className="space-y-3 mb-6">
                         <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Total Doubts</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{subject.doubts}</span>
                         </div>
                         <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Syllabus Status</span>
                                <span className={`font-semibold ${!subject.syllabus_uploaded ? "text-red-600" : "text-green-600"}`}>
                                    {subject.syllabus_uploaded ? "Uploaded" : "Pending"}
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${!subject.syllabus_uploaded ? "bg-red-500" : "bg-green-500"}`} 
                                    style={{ width: `${subject.coverage}%` }}
                                />
                            </div>
                         </div>
                    </div>

                    {/* Dropzone */}
                    <div 
                        className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative ${
                            draggingId === subject.id 
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20" 
                                : "border-gray-200 dark:border-slate-800 hover:border-red-300 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                        }`}
                        onDragOver={(e) => handleDragOver(e, subject.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, subject.id)}
                        onClick={() => document.getElementById(`file-upload-${subject.id}`).click()}
                    >
                        <input 
                            type="file" 
                            id={`file-upload-${subject.id}`}
                            className="hidden" 
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    handleDrop({ preventDefault: () => {} }, subject.id, e.target.files[0]);
                                }
                            }}
                        />

                        {subject.syllabus_uploaded ? (
                             <>
                                <CheckCircle size={20} className="mb-2 text-green-500" />
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Syllabus Added</span>
                             </>
                        ) : (
                             <>
                                <FileUp size={20} className={`mb-2 ${draggingId === subject.id ? "text-red-600" : "text-gray-400"}`} />
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Upload Syllabus</span>
                                <span className="text-xs text-gray-400">Drag & drop or Click to Browse</span>
                             </>
                        )}
                    </div>
                </div>
            ))}
            
            {/* Add New Subject Placeholder */}
             <button className="border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-red-600 hover:border-red-300 hover:bg-red-50/50 dark:hover:bg-slate-800/50 transition-all min-h-[300px]">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                    <span className="text-2xl font-light">+</span>
                </div>
                <span className="font-medium">Add New Subject</span>
            </button>
        </div>
        )}
      </div>

      {/* Sidebar / Insight */}
      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="text-orange-500" size={20} />
                Difficult Topics
            </h3>
            <div className="space-y-4">
                {difficultTopics.map((topic, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20">
                         <span className="w-6 h-6 rounded-full bg-orange-200 dark:bg-orange-800 flex items-center justify-center text-xs font-bold text-orange-700 dark:text-orange-200 flex-shrink-0">
                             {index + 1}
                         </span>
                         <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{topic}</span>
                    </div>
                ))}
            </div>
            <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                 <div className="flex items-start gap-2">
                     <AlertTriangle className="text-yellow-500 flex-shrink-0" size={16} />
                     <p className="text-xs text-gray-600 dark:text-gray-400">
                         Recommendation: Schedule remedial classes for "Dynamic Programming" as doubt frequency has increased by 15%.
                     </p>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}
