/* Teacher Schedule — Maya's weekly calendar with session blocks. */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SketchCard } from "@/components/ui/SketchCard";
import { SketchButton } from "@/components/ui/SketchButton";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { SessionBlock } from "@/components/teacher/SessionBlock";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7AM to 9PM

interface Session {
  learner: string;
  topic: string;
  startHour: number;
  endHour: number;
}

const WEEK_SESSIONS: Record<string, Session[]> = {
  Mon: [],
  Tue: [{ learner: "Aayush Bharti", topic: "UX Research Fundamentals", startHour: 15, endHour: 16 }],
  Wed: [
    { learner: "Ravi Shankar", topic: "Design Systems Overview", startHour: 11, endHour: 12 },
    { learner: "Sneha Kapoor", topic: "Usability Testing Methods", startHour: 14, endHour: 15 },
  ],
  Thu: [{ learner: "Priya Mehta", topic: "Research Repository Setup", startHour: 16, endHour: 17 }],
  Fri: [{ learner: "Aayush Bharti", topic: "Usability Testing Basics", startHour: 14, endHour: 15 }],
  Sat: [],
  Sun: [],
};

const AVAILABILITY: Record<string, { start: number; end: number } | null> = {
  Mon: { start: 9, end: 19 },
  Tue: { start: 9, end: 19 },
  Wed: { start: 9, end: 19 },
  Thu: { start: 9, end: 19 },
  Fri: { start: 9, end: 19 },
  Sat: { start: 10, end: 14 },
  Sun: null,
};

const SETTINGS = [
  { label: "Session durations", value: "45 min, 60 min" },
  { label: "Buffer time", value: "15 min" },
  { label: "Advance booking", value: "Up to 2 weeks" },
  { label: "Cancellation policy", value: "24 hours notice" },
];

function formatHour(h: number): string {
  if (h === 0 || h === 12) return "12";
  return h > 12 ? `${h - 12}` : `${h}`;
}
function amPm(h: number): string {
  return h >= 12 ? "PM" : "AM";
}

export default function TeacherSchedulePage() {
  const [selectedSession, setSelectedSession] = useState<(Session & { day: string }) | null>(null);

  const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const },
  };

  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 pb-24">
      <motion.div className="pt-12 pb-8" {...fadeUp}>
        <h1 className="text-[32px] font-bold text-ink leading-tight">
          Your <span className="font-hand inline-block" style={{ transform: "rotate(-2deg)" }}>schedule</span>
        </h1>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left — Calendar */}
        <motion.div
          className="flex-[2] min-w-0"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" as const }}
        >
          {/* Week Navigator */}
          <div className="flex items-center justify-between mb-6">
            <SketchButton variant="ghost" className="!px-3 !py-1.5 !text-[14px]">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
                <path d="M12 4L6 10L12 16" />
              </svg>
            </SketchButton>
            <span className="text-[15px] font-medium text-ink">
              {monday.toLocaleDateString("en-IN", { month: "short", day: "numeric" })} — {new Date(monday.getTime() + 6 * 86400000).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <SketchButton variant="ghost" className="!px-3 !py-1.5 !text-[14px]">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
                <path d="M8 4L14 10L8 16" />
              </svg>
            </SketchButton>
          </div>

          {/* Calendar Grid */}
          <SketchCard className="p-4 overflow-x-auto">
            <div className="grid grid-cols-8 min-w-[700px]">
              {/* Time labels column */}
              <div className="pr-2">
                <div className="h-10" />
                {HOURS.map((h) => (
                  <div key={h} className="h-[60px] flex items-start justify-end pr-2">
                    <span className="text-[11px] text-ink/40 -mt-2">
                      {formatHour(h)} {amPm(h)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {DAYS.map((day, di) => {
                const dateObj = new Date(monday.getTime() + di * 86400000);
                const dateNum = dateObj.getDate();
                const isToday = dateObj.toDateString() === today.toDateString();
                const sessions = WEEK_SESSIONS[day] || [];

                return (
                  <div key={day} className="relative border-l border-ink/[0.06]">
                    {/* Day Header */}
                    <div className="h-10 flex flex-col items-center justify-center">
                      <span className="text-[11px] uppercase tracking-widest text-ink-muted">{day}</span>
                      <span className={`text-[14px] font-bold leading-none mt-0.5 ${
                        isToday ? "text-ink bg-ink/[0.06] w-7 h-7 rounded-full flex items-center justify-center" : "text-ink-muted"
                      }`}>
                        {dateNum}
                      </span>
                    </div>

                    {/* Hour rows */}
                    <div className="relative">
                      {HOURS.map((h) => {
                        const avail = AVAILABILITY[day];
                        const isAvail = avail && h >= avail.start && h < avail.end;
                        return (
                          <div
                            key={h}
                            className={`h-[60px] border-t border-ink/[0.04] ${
                              isAvail ? "bg-ink/[0.02]" : ""
                            }`}
                          />
                        );
                      })}

                      {/* Session blocks */}
                      {sessions.map((s, si) => (
                        <SessionBlock
                          key={si}
                          learnerName={s.learner.split(" ")[0]}
                          topic={s.topic}
                          startHour={s.startHour}
                          endHour={s.endHour}
                          isActive={selectedSession?.learner === s.learner && selectedSession?.day === day}
                          onClick={() => setSelectedSession({ ...s, day })}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </SketchCard>

          {/* Selected Session Detail */}
          <AnimatePresence>
            {selectedSession && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" as const }}
                className="overflow-hidden mt-4"
              >
                <SketchCard className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <ProfileAvatar seed={selectedSession.learner} size={48} />
                    <div>
                      <h4 className="text-[17px] font-bold text-ink">{selectedSession.learner}</h4>
                      <p className="font-hand text-[15px] text-ink-muted">{selectedSession.topic}</p>
                    </div>
                  </div>
                  <p className="text-[14px] text-ink-muted mb-4">
                    {selectedSession.day} · {formatHour(selectedSession.startHour)}:00 {amPm(selectedSession.startHour)} – {formatHour(selectedSession.endHour)}:00 {amPm(selectedSession.endHour)}
                  </p>
                  <div className="relative mb-4">
                    <textarea
                      placeholder="Add session notes..."
                      className="w-full bg-transparent text-ink text-[14px] font-sans resize-none focus:outline-none placeholder:text-ink/30 h-16 p-3"
                    />
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path d="M 2 3 L 98 1 L 99 97 L 1 98 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-ink/[0.12]" vectorEffect="non-scaling-stroke" />
                    </svg>
                  </div>
                  <div className="flex gap-3">
                    <SketchButton variant="primary" className="!text-[13px] !px-5 !py-2">Start session</SketchButton>
                    <SketchButton variant="ghost" className="!text-[13px] !px-4 !py-2" onClick={() => setSelectedSession(null)}>Close</SketchButton>
                  </div>
                </SketchCard>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right — Availability & Settings */}
        <motion.div
          className="flex-1 min-w-[280px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" as const }}
        >
          {/* Availability */}
          <SketchCard className="p-5 mb-6">
            <h4 className="text-[16px] font-bold text-ink mb-4">Your availability</h4>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {DAYS.map((day) => (
                <div key={day} className="flex flex-col items-center gap-0.5">
                  <span className="text-[10px] uppercase tracking-widest text-ink-muted mb-1">{day.charAt(0)}</span>
                  {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((h) => {
                    const avail = AVAILABILITY[day];
                    const isOn = avail && h >= avail.start && h < avail.end;
                    return (
                      <div
                        key={h}
                        className={`w-full h-2.5 rounded-sm transition-colors ${
                          isOn ? "bg-ink" : "bg-ink/[0.06]"
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-[12px] text-ink/40 mb-3">
              <span>9 AM</span>
              <span>6 PM</span>
            </div>
            <SketchButton variant="ghost" className="w-full !text-[13px] !py-2">Edit availability</SketchButton>
          </SketchCard>

          {/* Session Settings */}
          <SketchCard className="p-5">
            <h4 className="text-[16px] font-bold text-ink mb-4">Session settings</h4>
            <div className="flex flex-col gap-3">
              {SETTINGS.map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-[14px] text-ink-muted">{s.label}</span>
                  <span className="text-[14px] text-ink font-medium">{s.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <SketchButton variant="ghost" className="w-full !text-[13px] !py-2">Edit settings</SketchButton>
            </div>
          </SketchCard>
        </motion.div>
      </div>
    </div>
  );
}
