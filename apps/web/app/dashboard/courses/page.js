"use client";

import { useState, useEffect } from "react";
import { BookOpen, PlayCircle, Clock, Calendar, CheckCircle, ArrowRight, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const API_BASE = "http://127.0.0.1:8000";

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
        <div className="space-y-8 animate-in fade-in zoom-in duration-300 min-h-screen">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-6">
                <h1 className="text-2xl font-heading font-bold text-zinc-900 flex items-center gap-3 uppercase tracking-tight">
                    <BookOpen className="text-zinc-900" />
                    Available Courses
                </h1>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest border border-zinc-200 px-3 py-1 bg-white">
                    {courses.length} Courses Found
                </span>
            </div>

            {loading ? (
                 <div className="text-center py-20">
                    <div className="inline-block animate-spin h-8 w-8 border-4 border-zinc-900 border-t-transparent"></div>
                    <p className="mt-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Loading courses...</p>
                 </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
                    {courses.map((course) => {
                        const isEnrolled = enrolledCourses.has(course.id);

                        return (
                            <div
                                key={course.id}
                                className="group bg-white border border-zinc-200 hover:border-zinc-900 transition-all duration-300 flex flex-col relative"
                            >
                                {/* Decorative Corner */}
                                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                {/* Course Header / Banner */}
                                <div className="h-32 bg-zinc-50 border-b border-zinc-200 p-6 relative group-hover:bg-zinc-100 transition-colors">
                                    <div className="absolute -bottom-6 left-6">
                                        <div className="w-12 h-12 bg-zinc-900 text-white flex items-center justify-center text-xl font-heading font-bold uppercase tracking-widest shadow-sm">
                                            {course.title.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-white border border-zinc-200 px-2 py-1">Course</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="pt-10 px-6 pb-6 space-y-6 flex-1 flex flex-col">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-heading font-bold text-zinc-900 line-clamp-1 uppercase tracking-tight" title={course.title}>
                                            {course.title}
                                        </h3>
                                        <p className="text-xs font-bold text-zinc-500 mt-2 uppercase tracking-wide">
                                            INSTR: {course.teacher_name || "Unknown"}
                                        </p>
                                        <p className="text-sm text-zinc-600 mt-4 line-clamp-2 min-h-[2.5rem] font-medium leading-relaxed">
                                            {course.description || "No description provided."}
                                        </p>
                                    </div>

                                    {/* Action */}
                                    <div className="space-y-3 pt-4 border-t border-zinc-100">
                                        {isEnrolled ? (
                                            <>
                                                <a href={`/dashboard/courses/${course.id}`} className="w-full py-3 bg-zinc-900 text-white font-heading font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors">
                                                    <CheckCircle size={16} />
                                                    OPEN COURSE
                                                </a>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedCourseForDoubt(course.id);
                                                        setDoubtModalOpen(true);
                                                    }}
                                                    className="w-full py-3 bg-white text-zinc-900 border border-zinc-200 hover:border-zinc-900 font-heading font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                                                >
                                                    <span className="text-sm">?</span> ASK DOUBT
                                                </button>
                                            </>
                                        ) : (
                                            <button 
                                                onClick={() => handleEnroll(course.id)}
                                                disabled={enrollingId === course.id}
                                                className="w-full py-3 bg-white text-zinc-900 border border-zinc-900 hover:bg-zinc-900 hover:text-white font-heading font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {enrollingId === course.id ? (
                                                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <PlayCircle size={16} />
                                                )}
                                                {enrollingId === course.id ? "PROCESSING..." : "ENROLL NOW"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {courses.length === 0 && (
                        <div className="col-span-full text-center py-16 bg-zinc-50 border border-zinc-200">
                            <p className="text-zinc-500 font-medium">NO COURSES AVAILABLE</p>
                        </div>
                    )}
                </div>
            )}

            {/* Ask Doubt Modal */}
            {doubtModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white border border-zinc-900 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-zinc-200 flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-heading font-bold text-zinc-900 uppercase tracking-tight">Ask a Doubt</h2>
                                <p className="text-xs text-zinc-500 mt-1 font-medium">Post query to course instructor.</p>
                            </div>
                            <button onClick={() => setDoubtModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmitDoubt} className="p-6 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">Your Question</label>
                                <textarea 
                                    required
                                    value={doubtQuestion}
                                    onChange={(e) => setDoubtQuestion(e.target.value)}
                                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 p-4 h-32 outline-none transition-colors text-sm font-medium resize-none placeholder:text-zinc-400"
                                    placeholder="TYPE YOUR QUESTION HERE..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setDoubtModalOpen(false)}
                                    className="px-6 py-3 text-zinc-600 hover:text-zinc-900 border border-transparent hover:border-zinc-200 font-heading font-bold text-xs uppercase tracking-widest transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={submittingDoubt}
                                    className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-heading font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all disabled:opacity-70"
                                >
                                    {submittingDoubt && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                    SUBMIT
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
