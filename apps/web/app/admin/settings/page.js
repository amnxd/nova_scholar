"use client";

import { Settings, Shield, Power, ToggleLeft, ToggleRight, Save, Bell } from "lucide-react";
import { useState } from "react";

export default function AdminSettingsPage() {
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [examMode, setExamMode] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-2">
            <Settings className="text-red-600" />
            System Configuration
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 ml-9">Manage global settings for the Manan AI platform.</p>

        {/* Section 1: System Controls */}
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-2">
                <Shield size={20} className="text-blue-500" />
                System Controls
            </h2>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800">
                <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">Maintenance Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Disable student access to the platform. Admins can still log in.</p>
                </div>
                <button 
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`p-1 transition-colors ${maintenanceMode ? "text-red-600" : "text-gray-400 hover:text-gray-600"}`}
                >
                    {maintenanceMode ? <ToggleRight size={48} className="fill-current" /> : <ToggleLeft size={48} />}
                </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800">
                <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">Exam Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Disable "Ask Manan" doubt solver and social features during exam hours.</p>
                </div>
                <button 
                    onClick={() => setExamMode(!examMode)}
                    className={`p-1 transition-colors ${examMode ? "text-red-600" : "text-gray-400 hover:text-gray-600"}`}
                >
                    {examMode ? <ToggleRight size={48} className="fill-current" /> : <ToggleLeft size={48} />}
                </button>
            </div>
        </div>

        {/* Section 2: Notification Rules */}
        <div className="space-y-6 mt-10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-2">
                <Bell size={20} className="text-orange-500" />
                Notification Rules
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                     <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-alert Attendance Threshold (%)</label>
                     <input 
                        type="number" 
                        defaultValue={75}
                        className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-gray-900 dark:text-white"
                     />
                     <p className="text-xs text-gray-500">Students below this will be marked "At-Risk".</p>
                 </div>

                 <div className="space-y-2">
                     <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-alert CGPA Threshold</label>
                     <input 
                        type="number" 
                        defaultValue={5.0}
                        step={0.1}
                        className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-gray-900 dark:text-white"
                     />
                     <p className="text-xs text-gray-500">Students below this will be marked "Critical".</p>
                 </div>
            </div>
        </div>

        <div className="pt-8 flex justify-end">
            <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transform hover:-translate-y-1">
                <Save size={20} />
                Save System Configuration
            </button>
        </div>

      </div>
    </div>
  );
}
