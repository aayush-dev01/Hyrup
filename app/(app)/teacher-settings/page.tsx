/* Teacher Settings — profile, availability grid, pricing, payouts with sticky save bar. */
"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SketchButton } from "@/components/ui/SketchButton";
import { SketchCard } from "@/components/ui/SketchCard";
import { SketchDivider } from "@/components/ui/SketchDivider";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM"];
const INITIAL_SLOTS: Record<string, string[]> = {
  Mon: ["10 AM", "2 PM", "4 PM"],
  Tue: ["11 AM", "3 PM"],
  Wed: ["10 AM", "1 PM", "3 PM"],
  Thu: ["2 PM", "5 PM"],
  Fri: ["10 AM", "11 AM"],
  Sat: [],
  Sun: [],
};

const AVAILABLE_TOPICS = ["UX Research", "Design Thinking", "User Interviews", "Usability Testing", "Information Architecture", "Prototyping", "Surveys", "A/B Testing"];

export default function TeacherSettingsPage() {
  const [firstName, setFirstName] = useState("Maya");
  const [lastName, setLastName] = useState("Krishnan");
  const [bio, setBio] = useState("I help product teams stop guessing and start listening. With 8 years leading research at companies from seed-stage to Series C, I've developed a practical approach to understanding users that doesn't require a PhD or a six-month study.");
  const [rate, setRate] = useState("1200");
  const [selectedTopics, setSelectedTopics] = useState(["UX Research", "Design Thinking", "User Interviews"]);
  const [topicSearch, setTopicSearch] = useState("");
  const [slots, setSlots] = useState<Record<string, string[]>>(INITIAL_SLOTS);
  const [isDirty, setDirty] = useState(false);

  const markDirty = () => setDirty(true);

  const filteredTopics = useMemo(() => {
    if (!topicSearch) return [];
    return AVAILABLE_TOPICS.filter(
      (t) => t.toLowerCase().includes(topicSearch.toLowerCase()) && !selectedTopics.includes(t)
    );
  }, [topicSearch, selectedTopics]);

  const toggleSlot = (day: string, hour: string) => {
    markDirty();
    setSlots((prev) => {
      const daySlots = prev[day] || [];
      if (daySlots.includes(hour)) {
        return { ...prev, [day]: daySlots.filter((h) => h !== hour) };
      }
      return { ...prev, [day]: [...daySlots, hour] };
    });
  };

  const rateNum = parseInt(rate) || 0;
  const netEarning = Math.round(rateNum * 0.85);

  return (
    <div className="w-full max-w-[680px] mx-auto px-6 py-12 pb-32">
      <motion.h1
        className="text-[32px] font-bold text-ink mb-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Your{" "}
        <span className="font-hand inline-block" style={{ transform: "rotate(-1.5deg)" }}>
          settings
        </span>
      </motion.h1>

      {/* ── Section 1: Profile ────────────────────── */}
      <section className="mt-10">
        <h2 className="text-[18px] font-bold text-ink mb-6">Your profile</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <input
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); markDirty(); }}
              className="w-full p-4 bg-transparent text-ink text-[15px] font-medium outline-none"
              placeholder="First name"
            />
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 200 50">
              <path d="M 4 5 C 50 2, 150 3, 196 5 C 198 15, 197 35, 195 45 C 150 48, 50 47, 4 45 C 2 35, 3 15, 4 5" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/[0.12]" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            </svg>
          </div>
          <div className="relative">
            <input
              value={lastName}
              onChange={(e) => { setLastName(e.target.value); markDirty(); }}
              className="w-full p-4 bg-transparent text-ink text-[15px] font-medium outline-none"
              placeholder="Last name"
            />
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 200 50">
              <path d="M 4 5 C 50 2, 150 3, 196 5 C 198 15, 197 35, 195 45 C 150 48, 50 47, 4 45 C 2 35, 3 15, 4 5" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/[0.12]" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Bio */}
        <div className="relative mb-4">
          <textarea
            value={bio}
            onChange={(e) => { setBio(e.target.value); markDirty(); }}
            className="w-full min-h-[140px] p-4 bg-transparent text-ink text-[15px] font-medium outline-none resize-y leading-relaxed"
            placeholder="Write your bio..."
          />
          <span className={`absolute bottom-3 right-4 text-[12px] ${bio.length > 450 ? "text-ink-muted" : "text-ink-faint"}`}>
            {bio.length} / 500
          </span>
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 140">
            <path d="M 6 6 C 100 3, 300 4, 394 6 C 396 35, 395 105, 393 134 C 300 137, 100 136, 6 134 C 4 105, 5 35, 6 6" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/[0.12]" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
          </svg>
        </div>

        {/* Topic selector */}
        <div className="mb-2">
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedTopics.map((t) => (
              <span key={t} className="relative text-[13px] text-ink px-3 py-1.5 flex items-center gap-2">
                {t}
                <button onClick={() => { setSelectedTopics((p) => p.filter((x) => x !== t)); markDirty(); }} className="text-ink-muted hover:text-ink">
                  <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="2" y1="2" x2="8" y2="8" /><line x1="8" y1="2" x2="2" y2="8" />
                  </svg>
                </button>
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 30">
                  <path d="M 5 4 C 25 2, 75 2, 95 4 C 97 10, 97 20, 95 26 C 75 28, 25 27, 5 25 C 3 20, 3 10, 5 4" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink/[0.12]" vectorEffect="non-scaling-stroke" />
                </svg>
              </span>
            ))}
          </div>
          <div className="relative">
            <input
              value={topicSearch}
              onChange={(e) => setTopicSearch(e.target.value)}
              className="w-full p-4 bg-transparent text-ink text-[15px] font-medium outline-none"
              placeholder="Add a topic..."
            />
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 50">
              <path d="M 6 5 C 100 2, 300 3, 394 5 C 396 15, 395 35, 393 45 C 300 48, 100 47, 6 45 C 4 35, 5 15, 6 5" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/[0.12]" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            </svg>
          </div>
          {filteredTopics.length > 0 && (
            <div className="mt-1 border border-ink/[0.08] rounded-lg overflow-hidden">
              {filteredTopics.map((t) => (
                <button
                  key={t}
                  onClick={() => { setSelectedTopics((p) => [...p, t]); setTopicSearch(""); markDirty(); }}
                  className="w-full flex items-center justify-between px-4 py-3 text-[14px] text-ink hover:bg-ink/[0.02] transition-colors"
                >
                  {t}
                  <svg viewBox="0 0 12 12" className="w-3 h-3 text-ink-muted" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="6" y1="2" x2="6" y2="10" /><line x1="2" y1="6" x2="10" y2="6" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <SketchDivider className="my-14" />

      {/* ── Section 2: Availability ───────────────── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold text-ink">Your availability</h2>
          <SketchButton variant="ghost" className="!text-[12px] !px-4 !py-1.5">
            Copy week
          </SketchButton>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((day) => (
            <div key={day} className="flex flex-col items-center gap-1">
              <span className="text-[11px] uppercase tracking-wider text-ink-muted font-medium mb-1">{day}</span>
              {HOURS.map((hour) => {
                const isActive = (slots[day] || []).includes(hour);
                return (
                  <button
                    key={hour}
                    onClick={() => toggleSlot(day, hour)}
                    className={`w-full h-8 text-[10px] font-medium rounded transition-colors ${
                      isActive ? "bg-ink text-warm-white" : "text-ink-muted hover:bg-ink/[0.04]"
                    }`}
                  >
                    {hour}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      <SketchDivider className="my-14" />

      {/* ── Section 3: Pricing ───────────────────── */}
      <section>
        <h2 className="text-[18px] font-bold text-ink mb-6">Pricing</h2>

        <div className="flex items-center gap-4">
          <div className="relative w-[180px]">
            <input
              value={rate}
              onChange={(e) => { setRate(e.target.value.replace(/\D/g, "")); markDirty(); }}
              className="w-full h-14 px-4 bg-transparent text-ink text-[24px] font-bold outline-none text-center"
            />
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 180 56">
              <path d="M 5 6 C 45 3, 135 4, 175 6 C 177 16, 176 40, 174 50 C 135 53, 45 52, 5 50 C 3 40, 4 16, 5 6" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/[0.12]" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-[16px] text-ink-muted">/session</span>
        </div>

        <p className="text-[13px] text-ink-muted mt-3 leading-relaxed">
          Clario takes a 15% platform fee. You&apos;ll receive ₹{netEarning.toLocaleString()} per 60-min session at this rate.
        </p>
      </section>

      <SketchDivider className="my-14" />

      {/* ── Section 4: Payouts ───────────────────── */}
      <section>
        <h2 className="text-[18px] font-bold text-ink mb-6">Payouts</h2>

        <SketchCard className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6 text-ink">
              <rect x="2" y="6" width="20" height="14" rx="2" />
              <path d="M 2 10 L 22 10" />
              <circle cx="7" cy="15" r="1.5" />
            </svg>
            <span className="text-[15px] text-ink font-medium">Not yet connected</span>
          </div>
          <SketchButton variant="primary" className="!text-[14px] !px-6 !py-2.5">
            Connect with Stripe
          </SketchButton>
        </SketchCard>

        <p className="text-[13px] text-ink-muted mt-3 leading-relaxed">
          Connect your Stripe account to receive payouts. Earnings are transferred weekly on Fridays.
        </p>
      </section>

      {/* ── Sticky Save Bar ──────────────────────── */}
      <AnimatePresence>
        {isDirty && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-warm-white flex items-center justify-between px-8 border-t border-ink/[0.06]"
            initial={{ y: 64 }}
            animate={{ y: 0 }}
            exit={{ y: 64 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <span className="text-[14px] text-ink-muted">You have unsaved changes</span>
            <div className="flex gap-3">
              <SketchButton variant="ghost" onClick={() => setDirty(false)} className="!text-[13px] !px-5 !py-2">
                Discard
              </SketchButton>
              <SketchButton variant="primary" onClick={() => setDirty(false)} className="!text-[13px] !px-5 !py-2">
                Save changes
              </SketchButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
