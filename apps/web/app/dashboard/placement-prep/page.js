"use client";

import { useState, useEffect } from "react";
import {
  GraduationCap,
  Target,
  Flame,
  Building2,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  Trophy,
  Zap,
  BookOpen,
  Code2,
  Brain,
  Users,
  Sparkles,
  MapPin,
  Briefcase,
  Star,
} from "lucide-react";

// ──────────────────────────────────────────────
// STATIC DATA
// ──────────────────────────────────────────────

const TOPICS = [
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    icon: Code2,
    items: [
      "Arrays & Strings", "Linked Lists", "Stacks & Queues", "Trees & BST",
      "Graphs (BFS/DFS)", "Dynamic Programming", "Greedy Algorithms",
      "Sorting & Searching", "Recursion & Backtracking", "Hashing",
    ],
  },
  {
    id: "aptitude",
    name: "Aptitude & Reasoning",
    icon: Brain,
    items: [
      "Quantitative Aptitude", "Logical Reasoning", "Verbal Ability",
      "Data Interpretation", "Probability & Permutations", "Time & Work",
      "Profit & Loss", "Number Series",
    ],
  },
  {
    id: "corecs",
    name: "Core CS (OS, DBMS, CN)",
    icon: BookOpen,
    items: [
      "Operating Systems — Processes", "OS — Memory Management",
      "OS — File Systems & Scheduling", "DBMS — SQL & Normalization",
      "DBMS — Transactions & Indexing", "Computer Networks — OSI & TCP/IP",
      "CN — HTTP, DNS, DHCP", "CN — Subnetting & Routing",
    ],
  },
  {
    id: "sysdesign",
    name: "System Design",
    icon: Target,
    items: [
      "Load Balancing", "Caching Strategies", "Database Sharding",
      "Message Queues", "API Design", "Microservices Architecture",
    ],
  },
  {
    id: "softskills",
    name: "Soft Skills & HR",
    icon: Users,
    items: [
      "Self Introduction", "Tell Me About Yourself", "Strengths & Weaknesses",
      "Behavioral Questions (STAR)", "Group Discussion Prep", "Salary Negotiation",
    ],
  },
];

const DAILY_GOALS = [
  { id: "goal1", text: "Solve 3 DSA problems" },
  { id: "goal2", text: "Revise 1 Core CS concept" },
  { id: "goal3", text: "Practice 1 aptitude set" },
  { id: "goal4", text: "Read 1 system design article" },
  { id: "goal5", text: "Do a mock interview round" },
];

const PLACEMENT_DRIVES = [
  {
    company: "Google",
    role: "SDE Intern",
    date: "March 5, 2026",
    location: "Bangalore, India",
    cgpa: "8.0+",
    status: "upcoming",
    logo: "G",
  },
  {
    company: "Amazon",
    role: "SDE-1",
    date: "March 12, 2026",
    location: "Hyderabad, India",
    cgpa: "7.0+",
    status: "upcoming",
    logo: "A",
  },
  {
    company: "Microsoft",
    role: "Software Engineer",
    date: "March 20, 2026",
    location: "Noida, India",
    cgpa: "7.5+",
    status: "upcoming",
    logo: "M",
  },
  {
    company: "Flipkart",
    role: "SDE Intern",
    date: "Feb 28, 2026",
    location: "Bangalore, India",
    cgpa: "7.0+",
    status: "ongoing",
    logo: "F",
  },
  {
    company: "Infosys",
    role: "Systems Engineer",
    date: "Feb 10, 2026",
    location: "Pune, India",
    cgpa: "6.0+",
    status: "completed",
    logo: "I",
  },
];

const COMPANY_CHECKLIST = [
  {
    name: "Google",
    difficulty: "Hard",
    focusAreas: ["DSA (Hard)", "System Design", "Behavioral"],
    tips: "Focus on graph algorithms, DP, and system design. Google values clean code and optimal solutions.",
    checklist: [
      "Solve 50+ Leetcode Hard problems",
      "Study Google-specific system design questions",
      "Practice coding on Google Docs (no autocomplete)",
      "Prepare STAR-format behavioral answers",
      "Review past Google interview experiences",
    ],
  },
  {
    name: "Amazon",
    difficulty: "Medium-Hard",
    focusAreas: ["DSA (Medium)", "Leadership Principles", "System Design"],
    tips: "Amazon heavily tests Leadership Principles. Prepare 2 stories per LP. DSA is medium-level.",
    checklist: [
      "Memorize all 16 Amazon Leadership Principles",
      "Prepare 2 STAR stories per principle",
      "Solve 30+ Leetcode Medium problems",
      "Study scalable system design (e.g., URL shortener)",
      "Practice OOD questions",
    ],
  },
  {
    name: "Microsoft",
    difficulty: "Medium",
    focusAreas: ["DSA (Medium)", "OS & DBMS", "Problem Solving"],
    tips: "Microsoft focuses on fundamentals — OS, DBMS, and clean problem solving. Coding rounds are medium difficulty.",
    checklist: [
      "Revise OS concepts (scheduling, deadlocks, paging)",
      "Revise DBMS (normalization, SQL, transactions)",
      "Solve 30+ Leetcode Medium problems",
      "Practice whiteboard coding",
      "Study Azure basics (bonus)",
    ],
  },
  {
    name: "Goldman Sachs",
    difficulty: "Medium-Hard",
    focusAreas: ["DSA", "Aptitude", "Core CS", "Puzzles"],
    tips: "Goldman Sachs has a strong aptitude + puzzle round. DSA is medium. Brush up on probability.",
    checklist: [
      "Practice aptitude & probability problems",
      "Solve classic puzzles (gold bar, bridge crossing)",
      "Revise Core CS fundamentals",
      "Solve 20+ Leetcode Medium DSA problems",
      "Prepare HR questions about finance interest",
    ],
  },
];

const statusBadge = {
  upcoming: "bg-zinc-100 text-zinc-900 border-zinc-900",
  ongoing: "bg-zinc-900 text-white border-zinc-900",
  completed: "bg-white text-zinc-400 border-zinc-200 line-through decoration-zinc-400",
};

// ──────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────

export default function PlacementPrepPage() {
  // ── localStorage state ──
  const [topicProgress, setTopicProgress] = useState({});
  const [dailyGoals, setDailyGoals] = useState({});
  const [companyChecks, setCompanyChecks] = useState({});
  const [expandedCompany, setExpandedCompany] = useState(null);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [streak, setStreak] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedTopics = JSON.parse(localStorage.getItem("pp_topics") || "{}");
      const savedGoals = JSON.parse(localStorage.getItem("pp_goals") || "{}");
      const savedCompany = JSON.parse(localStorage.getItem("pp_company") || "{}");
      const savedStreak = JSON.parse(localStorage.getItem("pp_streak") || "0");
      setTopicProgress(savedTopics);
      setDailyGoals(savedGoals);
      setCompanyChecks(savedCompany);
      setStreak(savedStreak);
    } catch { /* ignore parse errors */ }
    setMounted(true);
  }, []);

  // Persist helpers
  const persistTopics = (next) => {
    setTopicProgress(next);
    localStorage.setItem("pp_topics", JSON.stringify(next));
  };
  const persistGoals = (next) => {
    setDailyGoals(next);
    localStorage.setItem("pp_goals", JSON.stringify(next));
  };
  const persistCompany = (next) => {
    setCompanyChecks(next);
    localStorage.setItem("pp_company", JSON.stringify(next));
  };

  // Toggle topic item
  const toggleTopicItem = (topicId, itemIdx) => {
    const key = `${topicId}_${itemIdx}`;
    const next = { ...topicProgress, [key]: !topicProgress[key] };
    persistTopics(next);
  };

  // Toggle daily goal
  const toggleGoal = (goalId) => {
    const today = new Date().toDateString();
    const next = { ...dailyGoals, [`${goalId}_${today}`]: !dailyGoals[`${goalId}_${today}`] };
    persistGoals(next);

    // Check if all goals done → increment streak
    const allDone = DAILY_GOALS.every((g) => next[`${g.id}_${today}`]);
    if (allDone && !dailyGoals[`streak_${today}`]) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("pp_streak", JSON.stringify(newStreak));
      next[`streak_${today}`] = true;
      persistGoals(next);
    }
  };

  // Toggle company checklist item
  const toggleCompanyItem = (companyName, itemIdx) => {
    const key = `${companyName}_${itemIdx}`;
    const next = { ...companyChecks, [key]: !companyChecks[key] };
    persistCompany(next);
  };

  // ── Computed stats ──
  const totalTopicItems = TOPICS.reduce((acc, t) => acc + t.items.length, 0);
  const completedTopicItems = TOPICS.reduce(
    (acc, t) => acc + t.items.filter((_, i) => topicProgress[`${t.id}_${i}`]).length,
    0
  );
  const today = new Date().toDateString();
  const completedGoalsToday = DAILY_GOALS.filter((g) => dailyGoals[`${g.id}_${today}`]).length;

  if (!mounted) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* ── Page Header ── */}
      <div className="space-y-1 py-4 border-b border-zinc-200">
        <h1 className="text-3xl font-heading font-bold text-zinc-900 inline-flex items-center gap-3 uppercase tracking-tighter">
          <GraduationCap className="text-zinc-900" size={32} />
          Placement Prep Tracker
        </h1>
        <p className="text-zinc-500 font-medium text-sm">
          TRACK YOUR PREPARATION JOURNEY ACROSS TOPICS, COMPANIES, AND DAILY GOALS.
        </p>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Topics Covered", value: `${completedTopicItems}/${totalTopicItems}`, icon: BookOpen },
          { label: "Streak Days", value: `${streak} 🔥`, icon: Flame },
          { label: "Companies Targeted", value: COMPANY_CHECKLIST.length, icon: Building2 },
          { label: "Today's Goals", value: `${completedGoalsToday}/${DAILY_GOALS.length}`, icon: Trophy },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-zinc-200 p-6 flex flex-col justify-between hover:border-zinc-900 transition-colors group relative"
          >
             {/* Decorative Corner */}
             <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="w-10 h-10 border border-zinc-200 bg-zinc-50 flex items-center justify-center mb-4 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
              <stat.icon size={20} />
            </div>
            <div>
                <p className="text-3xl font-heading font-bold text-zinc-900">{stat.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── LEFT COLUMN: Topic Progress + Company Checklist ── */}
        <div className="lg:col-span-2 space-y-8">
          {/* ── Topics Progress ── */}
          <div className="bg-white border border-zinc-200 p-0 shadow-none">
            <div className="p-6 border-b border-zinc-200 bg-zinc-50">
                <h2 className="text-lg font-heading font-bold text-zinc-900 flex items-center gap-2 uppercase tracking-tight">
                <Target className="text-zinc-900" size={20} />
                Topic-wise Progress
                </h2>
            </div>

            <div className="divide-y divide-zinc-100">
              {TOPICS.map((topic) => {
                const Icon = topic.icon;
                const done = topic.items.filter((_, i) => topicProgress[`${topic.id}_${i}`]).length;
                const pct = Math.round((done / topic.items.length) * 100);
                const isExpanded = expandedTopic === topic.id;

                return (
                  <div key={topic.id} className={`transition-all ${isExpanded ? "bg-zinc-50" : "bg-white"}`}>
                    {/* Topic Header */}
                    <button
                      onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                      className="w-full flex items-center gap-4 p-5 hover:bg-zinc-50 transition-colors text-left"
                    >
                      <div className={`w-10 h-10 border border-zinc-200 bg-white flex items-center justify-center flex-shrink-0 text-zinc-900`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-zinc-900 text-sm uppercase tracking-wide">{topic.name}</span>
                          <span className="text-xs font-mono font-bold text-zinc-900">{pct}%</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-200">
                          <div
                            className="h-full bg-zinc-900 transition-all duration-700 ease-out"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-zinc-400 flex-shrink-0">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </button>

                    {/* Expanded Items */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-200 border border-zinc-200">
                          {topic.items.map((item, idx) => {
                            const checked = !!topicProgress[`${topic.id}_${idx}`];
                            return (
                              <button
                                key={idx}
                                onClick={() => toggleTopicItem(topic.id, idx)}
                                className={`flex items-center gap-3 p-3 transition-all text-left text-xs font-medium uppercase tracking-wide ${
                                  checked
                                    ? "bg-zinc-900 text-white"
                                    : "bg-white text-zinc-600 hover:bg-zinc-100"
                                }`}
                              >
                                {checked ? (
                                  <CheckCircle2 size={16} className="text-white flex-shrink-0" />
                                ) : (
                                  <Circle size={16} className="text-zinc-300 flex-shrink-0" />
                                )}
                                <span className={checked ? "line-through opacity-70" : ""}>{item}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Company Preparation Checklist ── */}
          <div className="bg-white border border-zinc-200 p-0 shadow-none">
             <div className="p-6 border-b border-zinc-200 bg-zinc-50">
                <h2 className="text-lg font-heading font-bold text-zinc-900 flex items-center gap-2 uppercase tracking-tight">
                <Building2 className="text-zinc-900" size={20} />
                Company Preparation
                </h2>
            </div>

            <div className="divide-y divide-zinc-100">
              {COMPANY_CHECKLIST.map((company) => {
                const isExpanded = expandedCompany === company.name;
                const done = company.checklist.filter((_, i) => companyChecks[`${company.name}_${i}`]).length;
                const pct = Math.round((done / company.checklist.length) * 100);

                return (
                  <div key={company.name} className={`transition-all ${isExpanded ? "bg-zinc-50" : "bg-white"}`}>
                    {/* Company Header */}
                    <button
                      onClick={() => setExpandedCompany(isExpanded ? null : company.name)}
                      className="w-full flex items-center gap-4 p-5 hover:bg-zinc-50 transition-colors text-left"
                    >
                      <div className="w-12 h-12 border border-zinc-900 bg-zinc-900 text-white flex items-center justify-center font-heading font-bold text-xl shadow-sm">
                        {company.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-zinc-900 uppercase tracking-tight">{company.name}</span>
                          <span className="text-[10px] px-2 py-0.5 border border-zinc-200 bg-white text-zinc-500 font-bold uppercase tracking-wider">{company.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1 bg-zinc-200">
                            <div
                              className="h-full bg-zinc-900 transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono font-bold text-zinc-900">{done}/{company.checklist.length}</span>
                        </div>
                      </div>
                      <div className="text-zinc-400 flex-shrink-0">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
                        {/* Focus Areas */}
                        <div className="flex flex-wrap gap-2 mt-4 mb-4">
                          {company.focusAreas.map((area) => (
                            <span key={area} className="px-2 py-1 bg-white border border-zinc-200 text-zinc-600 text-[10px] font-bold uppercase tracking-wider">
                              {area}
                            </span>
                          ))}
                        </div>

                        {/* Tip */}
                        <div className="bg-zinc-100 border-l-2 border-zinc-900 p-3 mb-5">
                          <p className="text-xs text-zinc-600 flex items-start gap-2 italic leading-relaxed">
                            <Sparkles size={14} className="mt-0.5 flex-shrink-0 text-zinc-900" />
                            {company.tips}
                          </p>
                        </div>

                        {/* Checklist */}
                        <div className="space-y-1">
                          {company.checklist.map((item, idx) => {
                            const checked = !!companyChecks[`${company.name}_${idx}`];
                            return (
                              <button
                                key={idx}
                                onClick={() => toggleCompanyItem(company.name, idx)}
                                className={`w-full flex items-center gap-3 p-3 transition-all text-left text-xs font-medium uppercase tracking-wide border ${
                                  checked
                                    ? "bg-zinc-900 text-white border-zinc-900"
                                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                                }`}
                              >
                                {checked ? (
                                  <CheckCircle2 size={16} className="text-zinc-400 flex-shrink-0" />
                                ) : (
                                  <Circle size={16} className="text-zinc-300 flex-shrink-0" />
                                )}
                                <span className={checked ? "line-through opacity-70" : ""}>{item}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Daily Goals + Placement Drives ── */}
        <div className="space-y-8">
          {/* ── Study Streak & Daily Goals ── */}
          <div className="bg-white border border-zinc-200 p-0 shadow-none">
             <div className="p-6 border-b border-zinc-200">
                <h2 className="text-lg font-heading font-bold text-zinc-900 flex items-center gap-2 uppercase tracking-tight">
                <Flame className="text-zinc-900" size={20} />
                Daily Goals
                </h2>
            </div>
            
            <div className="p-6">
                {/* Streak display */}
                <div className="bg-zinc-900 p-6 mb-6 text-white relative overflow-hidden">
                <div className="relative z-10 text-center">
                    <p className="text-5xl font-heading font-bold mb-1">{streak}</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Day Streak</p>
                    <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-wider">Keep pushing!</p>
                </div>
                </div>

                {/* Goals checklist */}
                <div className="space-y-2">
                {DAILY_GOALS.map((goal) => {
                    const checked = !!dailyGoals[`${goal.id}_${today}`];
                    return (
                    <button
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        className={`w-full flex items-center gap-3 p-3 transition-all text-left text-xs font-bold uppercase tracking-wide border ${
                        checked
                            ? "bg-zinc-100 text-zinc-900 border-zinc-200"
                            : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900"
                        }`}
                    >
                        {checked ? (
                        <CheckCircle2 size={18} className="text-zinc-900 flex-shrink-0" />
                        ) : (
                        <Circle size={18} className="text-zinc-300 flex-shrink-0" />
                        )}
                        <span className={checked ? "line-through opacity-50" : ""}>{goal.text}</span>
                    </button>
                    );
                })}
                </div>

                {completedGoalsToday === DAILY_GOALS.length && (
                <div className="mt-6 p-4 bg-zinc-50 border border-zinc-200 text-center animate-in fade-in zoom-in duration-300">
                    <p className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center justify-center gap-2">
                    <Trophy size={14} />
                    All goals completed!
                    </p>
                </div>
                )}
            </div>
          </div>

          {/* ── Upcoming Placement Drives ── */}
          <div className="bg-white border border-zinc-200 p-0 shadow-none">
             <div className="p-6 border-b border-zinc-200 bg-zinc-50">
                <h2 className="text-lg font-heading font-bold text-zinc-900 flex items-center gap-2 uppercase tracking-tight">
                <Calendar className="text-zinc-900" size={20} />
                Placement Drives
                </h2>
            </div>

            <div className="divide-y divide-zinc-100">
              {PLACEMENT_DRIVES.map((drive, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-5 hover:bg-zinc-50 transition-colors group"
                >
                  <div className="w-10 h-10 border border-zinc-900 bg-zinc-900 text-white flex items-center justify-center font-heading font-bold text-sm shadow-sm">
                    {drive.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-zinc-900 text-sm uppercase tracking-tight">{drive.company}</span>
                      <span className={`text-[10px] px-2 py-0.5 border font-bold uppercase tracking-wider ${statusBadge[drive.status]} rounded-none`}>
                        {drive.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide flex items-center gap-1">
                      {drive.role}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="text-[10px] text-zinc-400 flex items-center gap-1 uppercase tracking-wider">
                        <Calendar size={10} /> {drive.date}
                      </span>
                      <span className="text-[10px] text-zinc-400 flex items-center gap-1 uppercase tracking-wider">
                        <MapPin size={10} /> {drive.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
