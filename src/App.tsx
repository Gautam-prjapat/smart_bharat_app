import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, ClipboardList, AlertCircle, TrendingUp, CheckCircle, Heart, Award } from 'lucide-react';
import CivicCompanionChat from './components/CivicCompanionChat';
import SchemeDiscoveryHub from './components/SchemeDiscoveryHub';
import CivicIssuePortal from './components/CivicIssuePortal';

type TabType = 'chat' | 'schemes' | 'portal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Banner & Navigation Header */}
      <header className="bg-white border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-emerald-800 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="font-sans font-extrabold text-slate-900 text-base sm:text-lg tracking-tight flex items-center gap-1.5">
                  Smart Bharat
                </h1>
                <p className="text-[10px] sm:text-xs font-mono font-bold text-emerald-700 tracking-wider uppercase">
                  AI Civic Companion
                </p>
              </div>
            </div>

            {/* DEVENGERS PromptWars Banner Accent */}
            <div className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-3.5 py-1.5 rounded-full border border-slate-800 shadow-sm">
              <Award className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono tracking-wider font-semibold uppercase">
                DEVENGERS PromptWars 2026
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Welcome Block & Metrics */}
        <section id="civic-metrics-summary" className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Welcome Card */}
          <div className="md:col-span-2 bg-white border border-slate-200/60 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase tracking-wider">
                Digital Inclusion Platform
              </span>
              <h2 className="text-lg sm:text-xl font-sans font-extrabold text-slate-900 tracking-tight leading-snug">
                Welcome to Citizen Sevak!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
                Simplifying complex municipal circulars, recommending welfare programs based on social parameters, and empowering collective local digital advocacy.
              </p>
            </div>
            <div className="flex gap-1.5 items-center text-xs font-semibold text-slate-700 mt-4 font-sans">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>National Node Online: Direct Connection Active</span>
            </div>
          </div>

          {/* Metric Item 1 */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 font-mono">ACTIVE GRIEVANCES</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">1,420</h3>
              </div>
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-sans flex items-center gap-1.5 pt-4">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>+18% neighborhood reports resolved</span>
            </div>
          </div>

          {/* Metric Item 2 */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 font-mono">SCHEMES ENROLLED</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">428</h3>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-sans flex items-center gap-1.5 pt-4">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>₹1.2 Cr in direct welfare mapped</span>
            </div>
          </div>
        </section>

        {/* Tab Selection */}
        <section id="platform-tabs-navigation" className="flex justify-center border-b border-slate-200/60 pb-1">
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-5 py-2.5 rounded-xl font-sans font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                activeTab === 'chat'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              AI Sevak Chat
            </button>
            <button
              onClick={() => setActiveTab('schemes')}
              className={`px-5 py-2.5 rounded-xl font-sans font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                activeTab === 'schemes'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Scheme Matcher
            </button>
            <button
              onClick={() => setActiveTab('portal')}
              className={`px-5 py-2.5 rounded-xl font-sans font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                activeTab === 'portal'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              Grievance Portal
            </button>
          </div>
        </section>

        {/* Animated Active Screen View */}
        <section id="active-tab-viewport">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === 'chat' && <CivicCompanionChat />}
              {activeTab === 'schemes' && <SchemeDiscoveryHub />}
              {activeTab === 'portal' && <CivicIssuePortal />}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      {/* Elegant minimalist Footer */}
      <footer className="bg-white border-t border-slate-200/50 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-sans">
            © 2026 Smart Bharat AI Platform. Built with GenAI technology to promote transparency, digital inclusion, and safe public services.
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-400 font-sans">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>for Devengers PromptWars 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
