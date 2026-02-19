"use client";

import { FileText, Mic, Upload, ArrowRight, Sparkles, CheckCircle2, Loader2, Star, X, Brain, AlertCircle, XCircle, CheckCircle } from "lucide-react";
import { useState, useRef } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function CareerPage() {
    // --- Resume Roaster State ---
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    // --- Mock Test State ---
    const [quizStatus, setQuizStatus] = useState("idle"); // idle, config, loading, active, finished
    const [quizConfig, setQuizConfig] = useState({ subject: "", topic: "" });
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); // { index: "option value" }
    const [quizScore, setQuizScore] = useState(0);

    // --- Resume Handlers ---
    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => { setIsDragging(false); };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setSelectedFile(file);
            setUploadedFileName(file.name);
            setAnalysisResult(null);
        }
    };
    const handleFileInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setUploadedFileName(file.name);
            setAnalysisResult(null);
        }
    };

    const analyzeResume = async () => {
        if (!selectedFile) return;
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            const res = await fetch(`${API_BASE}/analyze-resume`, { method: "POST", body: formData });
            if (res.ok) {
                const data = await res.json();
                setAnalysisResult(data);
            } else {
                setAnalysisResult({ score: 0, feedback: ["Server error. Please try again."] });
            }
        } catch (err) {
            console.error("Resume upload error:", err);
            setAnalysisResult({ score: 0, feedback: ["Could not connect to the server."] });
        } finally {
            setIsUploading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 75) return { text: "text-green-600", bg: "bg-green-100", ring: "ring-green-500", label: "Excellent" };
        if (score >= 50) return { text: "text-yellow-600", bg: "bg-yellow-100", ring: "ring-yellow-500", label: "Good" };
        return { text: "text-red-600", bg: "bg-red-100", ring: "ring-red-500", label: "Needs Work" };
    };

    // --- Quiz Handlers ---
    const startQuizConfig = () => setQuizStatus("config");
    
    const fetchQuiz = async (e) => {
        e.preventDefault();
        setQuizStatus("loading");
        try {
            const res = await fetch(`${API_BASE}/generate-quiz`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(quizConfig)
            });
            const data = await res.json();
            if (data.status === "success" && data.quiz) {
                setQuestions(data.quiz);
                setCurrentQuestionIndex(0);
                setUserAnswers({});
                setQuizStatus("active");
            } else {
                alert(data.message || "Failed to generate quiz. Please try again.");
                setQuizStatus("idle");
            }
        } catch (error) {
            console.error(error);
            alert("Error generating quiz: " + error.message);
            setQuizStatus("idle");
        }
    };

    const handleAnswerSelect = (option) => {
        setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }));
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const submitQuiz = () => {
        let score = 0;
        questions.forEach((q, idx) => {
            if (userAnswers[idx] === q.answer) score++;
        });
        setQuizScore(score);
        setQuizStatus("finished");
    };

    const resetQuiz = () => {
        setQuizStatus("idle");
        setQuizConfig({ subject: "", topic: "" });
        setUserAnswers({});
        setQuestions([]);
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in zoom-in duration-300">
            <div className="text-center space-y-3 py-6">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 inline-flex items-center gap-3">
                    <Sparkles className="text-yellow-500" size={32} />
                    Nova Career Agent
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                    Level up your career with AI-powered tools designed to help you land your dream job.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Card A: Resume Roaster */}
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-50 group-hover:opacity-100"></div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                            <FileText size={28} />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Resume Roaster</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Get your resume roasted by an AI recruiter. Receive brutal, honest feedback and actionable scores to improve your CV.
                        </p>

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.docx,.doc,.txt"
                            className="hidden"
                            onChange={handleFileInputChange}
                        />

                        {/* Dropzone */}
                        <div
                            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative overflow-hidden ${isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50/30 bg-gray-50 dark:bg-slate-800/50"}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => !isUploading && fileInputRef.current?.click()}
                        >
                            {isUploading ? (
                                <div className="flex flex-col items-center gap-3 py-2">
                                    <Loader2 size={36} className="animate-spin text-blue-500" />
                                    <p className="font-medium text-blue-600">Analyzing your resume...</p>
                                    <p className="text-xs text-gray-400">{uploadedFileName}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center mb-3 text-blue-500">
                                        <Upload size={20} />
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-white">Click to upload or drag &amp; drop</p>
                                    <p className="text-xs text-gray-400 mt-1">PDF, DOCX, or TXT (Max 5MB)</p>
                                    {uploadedFileName && (
                                        <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-800">
                                            <p className="text-sm font-bold text-blue-600 flex items-center gap-2">
                                                <FileText size={16} />
                                                {uploadedFileName}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        
                        {/* Analyze Button */}
                        {selectedFile && !isUploading && !analysisResult && (
                            <button 
                                onClick={analyzeResume}
                                className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <Sparkles size={20} />
                                Analyze Resume
                            </button>
                        )}

                        {/* Feature tags */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {['ATS Score', 'Formatting Check', 'Keyword Optimization'].map(tag => (
                                <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-full flex items-center gap-1">
                                    <CheckCircle2 size={12} className="text-green-500" />
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Report Card */}
                        {analysisResult && (
                            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <Star size={20} className="text-yellow-500 fill-yellow-500" />
                                            Analysis Report
                                        </h3>
                                        <p className="text-sm text-gray-500">{analysisResult.details.candidate_name} • {analysisResult.details.role}</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setAnalysisResult(null); setUploadedFileName(null); }}
                                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 transition"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Score Badge */}
                                {(() => {
                                    const sc = getScoreColor(analysisResult.score);
                                    return (
                                        <div className={`flex items-center gap-6 p-6 rounded-3xl ${sc.bg} ring-1 ${sc.ring}`}>
                                            <div className={`text-6xl font-black ${sc.text}`}>{analysisResult.score}</div>
                                            <div className="flex-1">
                                                <p className={`text-xl font-bold ${sc.text} mb-1`}>{sc.label}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Overall ATS Compatibility Score</p>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Category Breakdown */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {analysisResult.details.category_scores.map((cat, i) => (
                                        <div key={i} className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl flex justify-between items-center">
                                            <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">{cat.name}</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{cat.score}%</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Keywords */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Sparkles size={18} className="text-purple-500" />
                                        Keyword Analysis
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs font-bold text-green-600 mb-2 uppercase tracking-wider">✅ Strong Matches</p>
                                            <div className="flex flex-wrap gap-2">
                                                {analysisResult.details.keywords.strong.map((k, i) => (
                                                    <span key={i} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">{k}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-red-500 mb-2 uppercase tracking-wider">❌ Missing Keywords</p>
                                            <div className="flex flex-wrap gap-2">
                                                {analysisResult.details.keywords.missing.map((k, i) => (
                                                    <span key={i} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold rounded-full">{k}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">💡 Recommendation</p>
                                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{analysisResult.details.recommendation}</p>
                                    </div>
                                </div>

                                {/* Projects Review */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <FileText size={18} className="text-blue-500" />
                                        Project Evaluation
                                    </h4>
                                    <div className="space-y-4">
                                        {analysisResult.details.projects.map((proj, i) => (
                                            <div key={i} className="border border-gray-100 dark:border-slate-800 rounded-xl p-4">
                                                <h5 className="font-bold text-gray-900 dark:text-white mb-2">{proj.name}</h5>
                                                <div className="space-y-2">
                                                    <div>
                                                        <span className="text-xs font-bold text-green-600">Strengths:</span>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{proj.strengths.join(", ")}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-bold text-orange-500">Improvement:</span>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{proj.improvements.join(", ")}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* ATS Checks Table */}
                                <div className="space-y-2">
                                    <h4 className="font-bold text-gray-900 dark:text-white">📑 ATS Formatting Check</h4>
                                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 dark:bg-slate-800">
                                                <tr>
                                                    <th className="px-4 py-3 font-medium text-gray-500">Check</th>
                                                    <th className="px-4 py-3 font-medium text-gray-500 text-right">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                                {analysisResult.details.ats_formatting.map((item, i) => (
                                                    <tr key={i}>
                                                        <td className="px-4 py-3 text-gray-900 dark:text-white">{item.check}</td>
                                                        <td className="px-4 py-3 text-right font-medium">
                                                            <span className={`inline-flex items-center gap-1 ${item.icon === "✅" ? "text-green-600" : "text-gray-500"}`}>
                                                                {item.icon} {item.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Card B: Mock Test (Replaces Mock Interview) */}
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-50"></div>
                    <div className="relative z-10 flex flex-col h-full">
                        
                        {/* Header Area */}
                        {(quizStatus === "idle" || quizStatus === "config") && (
                            <>
                                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                    <Brain size={28} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AI Mock Test</h2>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    Generate personalized quizzes on any subject. Test your knowledge with AI-crafted questions and get instant feedback.
                                </p>
                            </>
                        )}

                        {/* IDLE STATE */}
                        {quizStatus === "idle" && (
                            <div className="mt-auto">
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 font-bold text-sm">1</div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Choose Topic</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 font-bold text-sm">2</div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Take Quiz</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 font-bold text-sm">3</div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">View Results</span>
                                    </div>
                                </div>
                                <button onClick={startQuizConfig} className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1">
                                    <Brain size={20} />
                                    Generate New Quiz
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* CONFIG STATE */}
                        {quizStatus === "config" && (
                            <form onSubmit={fetchQuiz} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="e.g. Computer Science, History"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                        value={quizConfig.subject}
                                        onChange={e => setQuizConfig({...quizConfig, subject: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Topic</label>
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="e.g. Data Structures, WWII"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                        value={quizConfig.topic}
                                        onChange={e => setQuizConfig({...quizConfig, topic: e.target.value})}
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setQuizStatus("idle")} className="flex-1 py-3 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition-colors">
                                        Start Quiz
                                    </button>
                                </div>
                            </form>
                        )}
                        
                        {/* LOADING STATE */}
                        {quizStatus === "loading" && (
                             <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in">
                                 <Loader2 size={48} className="text-purple-600 animate-spin mb-4" />
                                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">Generating Quiz...</h3>
                                 <p className="text-gray-500 text-sm">Crafting questions on {quizConfig.topic}</p>
                             </div>
                        )}

                        {/* ACTIVE STATE */}
                        {quizStatus === "active" && questions.length > 0 && (
                            <div className="flex-1 flex flex-col animate-in fade-in">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-sm font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full">
                                        Question {currentQuestionIndex + 1} / {questions.length}
                                    </span>
                                    <span className="text-xs text-gray-400">Time: Unlimited</span>
                                </div>
                                
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 leading-relaxed">
                                    {questions[currentQuestionIndex].question}
                                </h3>

                                <div className="space-y-3 mb-8">
                                    {questions[currentQuestionIndex].options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswerSelect(option)}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                                userAnswers[currentQuestionIndex] === option
                                                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-medium"
                                                    : "border-gray-100 dark:border-slate-800 hover:border-purple-200 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                                            }`}
                                        >
                                            <span className="mr-3 font-mono text-gray-400 dark:text-gray-500">{String.fromCharCode(65 + idx)}.</span>
                                            {option}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-auto flex justify-end">
                                    {currentQuestionIndex < questions.length - 1 ? (
                                        <button 
                                            onClick={nextQuestion}
                                            disabled={!userAnswers[currentQuestionIndex]}
                                            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                                        >
                                            Next Question
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={submitQuiz}
                                            disabled={!userAnswers[currentQuestionIndex]}
                                            className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20"
                                        >
                                            Submit Quiz
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* FINISHED STATE */}
                        {quizStatus === "finished" && (
                            <div className="flex-1 flex flex-col animate-in fade-in space-y-6 overflow-y-auto max-h-[500px] custom-scrollbar pr-2">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 mb-4">
                                        <span className="text-3xl font-black">{Math.round((quizScore / questions.length) * 100)}%</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Completed!</h2>
                                    <p className="text-gray-500 text-sm">You got {quizScore} out of {questions.length} correct.</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500">Review Breakdown</h3>
                                    {questions.map((q, idx) => {
                                        const isCorrect = userAnswers[idx] === q.answer;
                                        return (
                                            <div key={idx} className={`p-4 rounded-xl border ${isCorrect ? "border-green-100 bg-green-50 dark:bg-green-900/10 dark:border-green-900/30" : "border-red-100 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30"}`}>
                                                <div className="flex items-start gap-3">
                                                    {isCorrect ? <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={18} /> : <XCircle className="text-red-500 flex-shrink-0 mt-1" size={18} />}
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white text-sm mb-2">{q.question}</p>
                                                        {!isCorrect && (
                                                            <div className="text-xs text-red-600 dark:text-red-400 mb-1">
                                                                <span className="font-bold">Your Ans:</span> {userAnswers[idx]}
                                                            </div>
                                                        )}
                                                        <div className="text-xs text-green-600 dark:text-green-400">
                                                            <span className="font-bold">Correct:</span> {q.answer}
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-2 italic border-t border-gray-200/50 dark:border-slate-700/50 pt-2">{q.explanation}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <button onClick={resetQuiz} className="w-full py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                                    Take Another Quiz
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
