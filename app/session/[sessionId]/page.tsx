/* Live Session Room — the core peer-to-peer learning environment. */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { Doodle } from "@/components/ui/Doodle";

const TEACHER = { name: "Maya Krishnan" };
const LEARNER = { name: "Aayush Sharma" };

export default function SessionRoom({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [activeTab, setActiveTab] = useState<"chat" | "notes">("notes");
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 mins

  // Setup mock timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleLeave = () => {
    // Navigate to post-session reflection/feedback
    router.push(`/summary/${params.sessionId}/feedback`);
  };

  return (
    <div className="flex w-full h-screen bg-warm-white overflow-hidden font-sans text-ink">
      {/* ── Main Stage (Video + Controls) ─────────────────────── */}
      <div className="flex-1 flex flex-col relative z-10 transition-all duration-300">

        {/* Header Bar */}
        <div className="h-16 flex items-center justify-between px-6 shrink-0 relative z-20">
          <div className="flex items-center gap-3">
            <span className="font-hand font-bold text-xl text-ink" style={{ transform: "rotate(-2deg)" }}>
              UX Research Fundamentals
            </span>
            <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 text-[11px] uppercase tracking-widest font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Recording
            </span>
          </div>
          <div className="font-mono font-medium text-sm text-ink-muted">
            {formatTime(timeRemaining)} remaining
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 p-6 pt-0 flex flex-col lg:flex-row gap-4 relative z-10">

          {/* Main Speaker (Teacher) */}
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-ink/[0.04]">
            {/* The actual video element would go here. For now, mock a placeholder. */}
            <div className="absolute inset-0 flex items-center justify-center">
              <ProfileAvatar seed={TEACHER.name} size={160} className="opacity-80" />
            </div>

            {/* Nameplate */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <div className="bg-warm-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-ink/10 flex items-center gap-2">
                <span className="text-sm font-bold">{TEACHER.name}</span>
              </div>
            </div>

            {/* AI Agent "Conducting" Overlay (subtle) */}
            <motion.div
              className="absolute top-4 right-4 bg-warm-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-ink/10 flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
            >
              <Doodle type="scribble-line" className="w-4 h-4 text-ink-muted animate-spin-slow" />
              <span className="text-[11px] font-medium uppercase tracking-widest text-ink-muted">Agent active</span>
            </motion.div>
          </div>

          {/* Self View & Screenshare Stack */}
          <div className="lg:w-1/4 flex flex-row lg:flex-col gap-4">
            {/* Self View */}
            <div className="w-1/2 lg:w-full aspect-video rounded-xl overflow-hidden bg-ink border border-ink/10 relative">
              {isVideoOn ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                  <ProfileAvatar seed={LEARNER.name} size={64} className="opacity-90 saturate-50" />
                  <p className="mt-4 text-[11px] text-warm-white/50 uppercase tracking-widest">Aayush Sharma</p>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ProfileAvatar seed={LEARNER.name} size={64} className="opacity-50" />
                  <div className="absolute top-2 right-2 bg-ink/50 p-1 rounded-md">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 text-red-400" stroke="currentColor" fill="none">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 4h.01" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              )}
              {/* Mic off indicator for self view */}
              {!isMicOn && (
                <div className="absolute top-2 right-2 bg-red-500/80 p-1.5 rounded-md backdrop-blur-sm text-warm-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                </div>
              )}
            </div>

            {/* Context/Presentation Placeholder */}
            <div className="hidden lg:flex w-full flex-1 rounded-xl bg-ink/[0.02] border-2 border-dashed border-ink/10 items-center justify-center flex-col gap-2 relative">
              {/* Sketchy framing bracket */}
              <svg className="absolute -top-1 -right-1 w-6 h-6 text-ink/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M 2 8 L 2 2 L 8 2" />
              </svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-ink-muted">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M 3 9 L 21 9" />
                <path d="M 9 21 L 9 9" />
              </svg>
              <span className="text-[12px] font-medium text-ink-muted">Focus mode (inactive)</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="h-20 flex items-center justify-center gap-4 shrink-0 pb-4 relative z-20">
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isMicOn ? "bg-ink/[0.05] hover:bg-ink/[0.1] text-ink" : "bg-red-500/10 text-red-600 border border-red-500/20"
              }`}
          >
            {isMicOn ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            )}
          </button>

          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isVideoOn ? "bg-ink/[0.05] hover:bg-ink/[0.1] text-ink" : "bg-red-500/10 text-red-600 border border-red-500/20"
              }`}
          >
            {isVideoOn ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            )}
          </button>

          <div className="w-px h-8 bg-ink/10 mx-2" />

          <button className="w-12 h-12 rounded-2xl bg-ink/[0.05] hover:bg-ink/[0.1] text-ink flex items-center justify-center transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
          </button>

          <div className="w-px h-8 bg-ink/10 mx-2" />

          {showExitConfirm ? (
            <div className="flex bg-red-500/10 p-1 rounded-2xl items-center border border-red-500/20 animate-in slide-in-from-right-4 duration-200">
              <span className="px-3 text-sm font-semibold text-red-600">End session?</span>
              <button onClick={handleLeave} className="px-4 py-2 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors">Leave</button>
              <button onClick={() => setShowExitConfirm(false)} className="px-3 py-2 text-ink-muted font-medium hover:text-ink">Cancel</button>
            </div>
          ) : (
            <button
              onClick={() => setShowExitConfirm(true)}
              className="px-6 h-12 rounded-2xl bg-red-500 text-warm-white font-semibold flex items-center justify-center hover:bg-red-600 transition-all shadow-sm"
            >
              Leave
            </button>
          )}
        </div>
      </div>

      {/* ── Side Panel (Notes / Chat / Agent) ──────────────────── */}
      <div className="w-[320px] lg:w-[380px] h-full border-l border-ink/[0.06] flex flex-col bg-warm-white shrink-0 relative z-20">

        {/* Panel Tabs */}
        <div className="flex items-center p-2 border-b border-ink/[0.06]">
          {["notes", "chat"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "chat" | "notes")}
              className={`flex-1 py-3 text-sm font-semibold capitalize rounded-xl transition-colors relative ${activeTab === tab ? "text-ink bg-ink/[0.04]" : "text-ink-muted hover:text-ink"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
          {activeTab === "notes" && (
            <div className="flex flex-col h-full animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 text-ink-muted"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  Shared Notes
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-ink-faint font-medium">Auto-saves to summary</span>
              </div>
              <textarea
                className="flex-1 w-full bg-transparent resize-none outline-none text-[15px] leading-relaxed text-ink placeholder:text-ink-muted/30 font-sans"
                placeholder="Type notes here... both you and Maya can see and edit this document in real-time."
                defaultValue="- Review heuristic evaluation framework
- Goal today: understand moderated vs unmoderated testing
- Tool stack: UserTesting vs Maze"
              />
            </div>
          )}

          {activeTab === "chat" && (
            <div className="flex flex-col h-full animate-in fade-in duration-300 justify-end">
              <div className="flex flex-col gap-4 mb-4">
                <div className="text-center font-mono text-[10px] uppercase tracking-widest text-ink-faint my-2">Session started at 3:00 PM</div>

                <div className="flex flex-col items-start gap-1">
                  <span className="text-[11px] font-bold text-ink-muted ml-2">Maya Krishnan</span>
                  <div className="bg-ink/[0.04] px-4 py-2.5 rounded-2xl rounded-tl-sm text-[14px]">
                    Hi Aayush! Have you brought the research plan draft we discussed?
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] font-bold text-ink-muted mr-2">You</span>
                  <div className="bg-ink text-warm-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-[14px]">
                    Yes! Just dropping the figma link in the notes now.
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 relative">
                <input type="text" placeholder="Message..." className="w-full bg-ink/[0.04] border border-transparent focus:border-ink/20 focus:bg-white transition-colors rounded-xl px-4 py-3 text-[14px] outline-none" />
                <button className="absolute right-3 top-1/2 mt-2 -translate-y-1/2 p-2 text-ink-muted hover:text-ink">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
