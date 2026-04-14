/* Session room — dark immersive video space with floating controls, PiP, timer, and chat panel. */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SessionRoomPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [messages] = useState([
    { from: "Maya", self: false, text: "Hey! Ready when you are." },
    { from: "You", self: true, text: "Let me share my screen — I have the pricing deck open." },
    { from: "Maya", self: false, text: "Perfect, let's start with the tier structure." },
  ]);

  // Auto-hide controls
  const showControls = useCallback(() => {
    setControlsVisible(true);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMove = () => {
      showControls();
      clearTimeout(timeout);
      timeout = setTimeout(() => setControlsVisible(false), 3000);
    };
    window.addEventListener("mousemove", handleMove);
    timeout = setTimeout(() => setControlsVisible(false), 3000);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      clearTimeout(timeout);
    };
  }, [showControls]);

  return (
    <div className="fixed inset-0 bg-[#0E0E0C] flex overflow-hidden" onMouseMove={showControls}>
      {/* ── Main Video Area ──────────────────────── */}
      <motion.div
        className="flex-1 flex items-center justify-center p-8 relative"
        animate={{ marginRight: chatOpen ? 300 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="relative w-full max-w-full aspect-video rounded-xl border border-white/[0.06] bg-[#161614] flex items-center justify-center overflow-hidden">
          {/* Placeholder */}
          <p className="font-hand text-[28px] text-white/50">Waiting for Maya...</p>

          {/* Timer */}
          <div className="absolute top-4 left-4">
            <motion.span
              className="font-hand font-bold text-[18px] text-white/80"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              24:13
            </motion.span>
          </div>

          {/* Self PiP */}
          <motion.div
            className="absolute bottom-4 right-4 w-[160px] h-[90px] rounded-lg border border-white/[0.1] bg-[#1C1C1A] flex items-center justify-center cursor-grab"
            drag
            dragConstraints={{ top: -200, left: -400, right: 0, bottom: 0 }}
            dragElastic={0.1}
          >
            <span className="font-hand text-[14px] text-white/40">You</span>
          </motion.div>

          {/* Dim overlay when chat is open */}
          <AnimatePresence>
            {chatOpen && (
              <motion.div
                className="absolute inset-0 bg-black/30 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Floating Controls ────────────────────── */}
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-5 px-7 h-16 rounded-full"
        style={{ background: "rgba(14,14,12,0.85)", backdropFilter: "blur(20px)" }}
        animate={{
          y: controlsVisible ? 0 : 80,
          opacity: controlsVisible ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Mic */}
        <button
          onClick={() => setMicOn(!micOn)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/[0.08] transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-[22px] h-[22px] text-white/80">
            {micOn ? (
              <>
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0 M12 17v4 M8 21h8" />
              </>
            ) : (
              <>
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0 M12 17v4 M8 21h8" />
                <line x1="3" y1="3" x2="21" y2="21" strokeWidth="2" />
              </>
            )}
          </svg>
        </button>

        {/* Camera */}
        <button
          onClick={() => setCamOn(!camOn)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/[0.08] transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-[22px] h-[22px] text-white/80">
            {camOn ? (
              <>
                <rect x="2" y="5" width="15" height="14" rx="2" />
                <path d="M17 9l5-3v12l-5-3" />
              </>
            ) : (
              <>
                <rect x="2" y="5" width="15" height="14" rx="2" />
                <path d="M17 9l5-3v12l-5-3" />
                <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" />
              </>
            )}
          </svg>
        </button>

        {/* Screen share */}
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/[0.08] transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-[22px] h-[22px] text-white/80">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8 M12 17v4" />
          </svg>
        </button>

        {/* Chat toggle */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            chatOpen ? "bg-white/[0.12]" : "hover:bg-white/[0.08]"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-[22px] h-[22px] text-white/80">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>

        {/* End session */}
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-500/20 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-[22px] h-[22px] text-red-400/80">
            <path d="M16 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2 M12 16l4-4-4-4 M16 12H4" />
          </svg>
        </button>
      </motion.div>

      {/* ── Chat Panel ───────────────────────────── */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-[300px] bg-[#161614] flex flex-col z-40"
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-4 border-b border-white/[0.06]">
              <h3 className="text-[14px] font-bold text-white/80">Chat</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.self ? "items-end" : "items-start"}`}>
                  <span className="font-hand text-[13px] text-white/50 mb-1">{msg.from}</span>
                  <div className={`text-[14px] text-white/90 leading-relaxed px-3 py-2 rounded-lg max-w-[85%] ${
                    msg.self ? "bg-white/[0.06]" : ""
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-white/[0.06]">
              <div className="relative flex items-center h-12">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-white/[0.06] text-white/90 text-[14px] h-full px-4 rounded-lg outline-none placeholder:text-white/30"
                />
                <motion.button
                  className="absolute right-2 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  whileHover={{ rotate: 45, scale: 1.1 }}
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-4 h-4">
                    <path d="M 3 10 L 17 3 L 10 17 L 9 11 Z" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
