"use client";

import { useState, useEffect } from "react";
import { BookOpen, PlayCircle, Clock, Calendar, CheckCircle } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const API_BASE = "http://127.0.0.1:8000";

// ─── ProgressBar Component ────────────────────────────────────────────────────
function ProgressBar({ value, colorClass }) {
    return (
        <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
                className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-1000 ease-out`}
                style={{ width: `${value}%` }}
            />
        </div>
    );
}

export default function CoursesPage() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [enrollingId, setEnrollingId] = useState(null);

    // Doubt Modal State
    const [doubtModalOpen, setDoubtModalOpen] = useState(false);
    const [doubtQuestion, setDoubtQuestion] = useState("");
    const [submittingDoubt, setSubmittingDoubt] = useState(false);
    const [selectedCourseForDoubt, setSelectedCourseForDoubt] = useState(null);

    const handleSubmitDoubt = async (e) => {
        e.preventDefault();
        setSubmittingDoubt(true);
        try {
             // In real app, we need selectedCourseForDoubt. For now, assuming only one course context or we need to set it.
             // But simpler: The modal is global, but "Ask Doubt" button is on course card.
             // We need to set `selectedCourseForDoubt` when opening modal.
             
             // ... waiting for implementation of open modal logic to set course id ...
             
             // For now, let's just simulate success if we don't have a course ID, or alert error.
             if (!selectedCourseForDoubt) {
                 alert("Error: No course selected.");
                 setSubmittingDoubt(false);
                 return;
             }

             const token = await user.getIdToken();
             const res = await fetch(`${API_BASE}/courses/doubts`, {
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({
                     student_id: user.uid,
                     course_id: selectedCourseForDoubt,
                     question: doubtQuestion,
                     token: token
                 })
             });

             if (res.ok) {
                 alert("Doubt submitted successfully!");
                 setDoubtModalOpen(false);
                 setDoubtQuestion("");
             } else {
                 alert("Failed to submit doubt.");
             }
        } catch (error) {
            console.error("Error submitting doubt:", error);
        } finally {
            setSubmittingDoubt(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCourses();
            // In a real app, we should also fetch user's enrolled course IDs to check status
            // For now, let's assume if it's in the list it might not be enrolled, 
            // but we need a specific endpoint to check enrollment status or 
            // return it with the course list. 
            // Simplified: The backend GET /courses returns ALL courses.
            // We'll simplisticly handle enrollment state locally for now or just allow re-enroll (idempotent).
        }
    }, [user]);

    const fetchCourses = async () => {
        try {
            const res = await fetch(`${API_BASE}/courses`);
            const data = await res.json();
            if (data.courses) {
                setCourses(data.courses);
            }
        } catch (error) {
            console.error("Failed to fetch courses", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (courseId) => {
        setEnrollingId(courseId);
        try {
            const token = await user.getIdToken();
            const res = await fetch(`${API_BASE}/courses/enroll`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    student_id: user.uid,
                    course_id: courseId,
                    token: token
                })
            });

            if (res.ok) {
                setEnrolledCourses(prev => new Set(prev).add(courseId));
                // Optional: Show success toast
            } else {
                alert("Enrollment failed");
            }
        } catch (error) {
            console.error("Error enrolling:", error);
        } finally {
            setEnrollingId(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="text-blue-600" />
                    Available Courses
                </h1>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {courses.length} Courses Found
                </span>
            </div>

            {loading ? (
                 <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-2 text-gray-500">Loading courses...</p>
                 </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => {
                        const isEnrolled = enrolledCourses.has(course.id); // Simple local state check for now
                        const color = "from-blue-500 to-indigo-600"; // Default color

                        return (
                            <div
                                key={course.id}
                                className="group bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                            >
                                {/* Course Header / Banner */}
                                <div className={`h-32 bg-gradient-to-r ${color} p-6 relative`}>
                                    <div className="absolute bottom-[-1.5rem] left-6">
                                        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-md flex items-center justify-center text-2xl font-bold text-gray-700 dark:text-white uppercase">
                                            {course.title.charAt(0)}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="pt-10 px-6 pb-6 space-y-4 flex-1 flex flex-col">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1" title={course.title}>
                                            {course.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {course.teacher_name || "Unknown Instructor"}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 min-h-[2.5rem]">
                                            {course.description || "No description provided."}
                                        </p>
                                    </div>

                                    {/* Action */}
                                    {isEnrolled ? (
                                        <a href={`/dashboard/courses/${course.id}`} className="w-full mt-2 py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                                            <CheckCircle size={18} />
                                            Open Course
                                        </a>
                                    ) : (
                                        <button 
                                            onClick={() => handleEnroll(course.id)}
                                            disabled={enrollingId === course.id}
                                            className="w-full mt-2 py-3 bg-gray-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-gray-700 dark:text-gray-300 font-medium rounded-xl flex items-center justify-center gap-2 transition-all group-hover:bg-blue-600 group-hover:text-white disabled:opacity-70"
                                        >
                                            {enrollingId === course.id ? (
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <PlayCircle size={18} />
                                            )}
                                            {enrollingId === course.id ? "Enrolling..." : "Enroll Now"}
                                        </button>
                                    )}
                                    {/* Ask Doubt Button (Only if enrolled) */}
                                    {isEnrolled && (
                                         <button 
                                            onClick={() => {
                                                setSelectedCourseForDoubt(course.id);
                                                setDoubtModalOpen(true);
                                            }}
                                            className="w-full mt-2 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                         >
                                            <span className="text-lg">?</span> Ask a Doubt
                                         </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {courses.length === 0 && (
                        <div className="col-span-full text-center py-10 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
                            <p className="text-gray-500 dark:text-gray-400">No courses available at the moment.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Ask Doubt Modal */}
            {doubtModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ask a Doubt</h2>
                            <p className="text-sm text-gray-500 mt-1">Post your question to the course instructor.</p>
                        </div>
                        <form onSubmit={handleSubmitDoubt} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Question</label>
                                <textarea 
                                    required
                                    value={doubtQuestion}
                                    onChange={(e) => setDoubtQuestion(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white h-32"
                                    placeholder="Type your question here..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setDoubtModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={submittingDoubt}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg shadow-blue-500/20 disabled:opacity-70 flex items-center gap-2"
                                >
                                    {submittingDoubt && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                    Submit Question
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
