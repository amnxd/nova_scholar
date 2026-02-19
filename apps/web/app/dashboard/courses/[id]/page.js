"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";
import { BookOpen, FileText, ArrowLeft, HelpCircle, Send, Download } from "lucide-react";

export default function CourseDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    // Doubt State
    const [doubtOpen, setDoubtOpen] = useState(false);
    const [doubtQuestion, setDoubtQuestion] = useState("");
    const [submittingDoubt, setSubmittingDoubt] = useState(false);

    useEffect(() => {
        if (user && id) {
            fetchCourseDetails();
        }
    }, [user, id]);

    const fetchCourseDetails = async () => {
        try {
            // In a real app, we'd have a specific GET /courses/:id endpoint
            // For now, we'll fetch all and filter (prototype shortcut)
            const res = await fetch("http://127.0.0.1:8000/courses");
            const data = await res.json();
            if (data.courses) {
                const found = data.courses.find(c => c.id === id);
                if (found) {
                    setCourse(found);
                } else {
                    alert("Course not found");
                    router.push("/dashboard/courses");
                }
            }
        } catch (error) {
            console.error("Error fetching course:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadSyllabus = () => {
        if (course?.syllabus_url) {
            window.open(course.syllabus_url, "_blank");
        } else {
            alert("Syllabus URL not available.");
        }
    };

    const handleSubmitDoubt = async (e) => {
        e.preventDefault();
        setSubmittingDoubt(true);
        try {
             const token = await user.getIdToken();
             const res = await fetch("http://127.0.0.1:8000/courses/doubts", {
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({
                     student_id: user.uid,
                     course_id: id,
                     question: doubtQuestion,
                     token: token
                 })
             });

             if (res.ok) {
                 alert("Doubt submitted successfully!");
                 setDoubtOpen(false);
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

    if (loading) return <div className="p-10 text-center">Loading course...</div>;
    if (!course) return <div className="p-10 text-center">Course not found.</div>;

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-300 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
                    <p className="text-gray-500 dark:text-gray-400">Instructor: {course.teacher_name || "Unknown"}</p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Syllabus & Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <BookOpen className="text-blue-600" size={24} />
                            Course Overview
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {course.description || "No description provided for this course."}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <FileText className="text-green-600" size={24} />
                            Syllabus
                        </h2>
                        {course.syllabus_uploaded ? (
                            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center text-green-600 dark:text-green-200">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Course Syllabus</h3>
                                        <p className="text-xs text-green-600 dark:text-green-400">Available for download</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleDownloadSyllabus}
                                    className="px-4 py-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                                >
                                    <Download size={16} />
                                    Download
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
                                <p>Syllabus has not been uploaded yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Actions & Doubts */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
                        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                            <HelpCircle className="text-blue-200" />
                            Have a Doubt?
                        </h2>
                        <p className="text-blue-100 text-sm mb-6">
                            Ask your instructor directly. Get clarifications on topics you find difficult.
                        </p>
                        <button 
                            onClick={() => setDoubtOpen(true)}
                            className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl shadow-md hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                        >
                            Ask Question
                        </button>
                    </div>

                    {/* Doubt Modal (Inline or Global) */}
                    {doubtOpen && (
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
                                            onClick={() => setDoubtOpen(false)}
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
            </div>
        </div>
    );
}
