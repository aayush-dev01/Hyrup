/* Teacher Dashboard — warm greeting, stat strip, today's sessions, feedback, and profile strength. */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { SketchCard } from "@/components/ui/SketchCard";
import { StatCard } from "@/components/ui/StatCard";
import { SketchButton } from "@/components/ui/SketchButton";
import { SketchDivider } from "@/components/ui/SketchDivider";
import { AvatarSVG } from "@/components/ui/AvatarSVG";
import { RatingDisplay } from "@/components/ui/RatingDisplay";

const TODAY_SESSIONS = [
  { learner: "Aayush", topic: "SaaS Pricing Strategy", time: "3:00 PM", imminent: false },
  { learner: "Ravi", topic: "User Interview Synthesis", time: "5:00 PM", imminent: false },
  { learner: "Sneha", topic: "Research Repository Setup", time: "7:30 PM", imminent: false },
];

const UPCOMING_WEEK = [
  { day: "Wednesday", sessions: [{ learner: "David", topic: "Competitive Analysis", time: "11:00 AM" }] },
  { day: "Thursday", sessions: [{ learner: "Priya", topic: "Stakeholder Interviews", time: "2:00 PM" }, { learner: "James", topic: "Survey Design", time: "4:00 PM" }] },
];

const FEEDBACK = [
  { learner: "Aayush", quote: "Maya completely changed how I think about user feedback. The framework she showed me was exactly what I needed.", rating: 5 },
  { learner: "Priya", quote: "Clear, specific, and immediately useful. I walked away knowing exactly what to do next.", rating: 4.5 },
  { learner: "David", quote: "She makes complex methodology feel simple without dumbing it down. Highly recommend.", rating: 5 },
];

const PROFILE_ITEMS = [
  { label: "Add a profile photo", done: true },
  { label: "Write your teaching philosophy", done: true },
  { label: "Set your availability", done: false },
  { label: "Connect Stripe for payouts", done: false },
];

export default function TeacherDashboardPage() {
  const firstName = "Maya";
  const completeness = PROFILE_ITEMS.filter((i) => i.done).length / PROFILE_ITEMS.length;

  const fadeUp = {
    initial: { y: 20, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 pb-24">
      {/* ── Greeting ─────────────────────────────────── */}
      <motion.section className="pt-12 pb-6" {...fadeUp}>
        <h1 className="text-[40px] font-bold text-ink leading-tight">Good morning,</h1>
        <span className="font-hand font-bold text-[52px] text-ink inline-block" style={{ transform: "rotate(-2deg)" }}>
          {firstName}
        </span>
        <p className="text-ink-muted text-[16px] font-medium mt-4 leading-relaxed">
          You have {TODAY_SESSIONS.length} sessions today. Your next one starts in 40 minutes.
        </p>
      </motion.section>

      {/* ── Stat Strip ───────────────────────────────── */}
      <motion.section className="mb-12" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard value="12" label="Sessions this month" />
          <StatCard value="₹24,000" label="Earned this month" />
          <StatCard value="68%" label="Repeat learner rate" />
        </div>
      </motion.section>

      {/* ── Two Column ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Left — 60% */}
        <div className="lg:col-span-3 flex flex-col gap-12">
          {/* Today's Sessions */}
          <motion.section {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted mb-4">
              Today&apos;s sessions
            </p>
            <div className="flex flex-col gap-4">
              {TODAY_SESSIONS.map((s, i) => (
                <motion.div
                  key={s.learner}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <SketchCard tilt={i % 2 === 0 ? -0.5 : 0.7} className="p-6">
                    <div className="flex items-center gap-4">
                      <AvatarSVG seed={s.learner} size={44} />
                      <div className="flex-1">
                        <h3 className="text-[16px] font-bold text-ink">{s.learner}</h3>
                        <p className="font-hand text-[16px] text-ink-muted" style={{ transform: "rotate(-0.5deg)" }}>
                          {s.topic}
                        </p>
                        <p className="text-[14px] text-ink-muted mt-1">{s.time}</p>
                      </div>
                      <div className="flex gap-2">
                        <SketchButton variant="ghost" className="!text-[12px] !px-4 !py-1.5">
                          Prepare
                        </SketchButton>
                        <SketchButton
                          variant={s.imminent ? "primary" : "ghost"}
                          className="!text-[12px] !px-4 !py-1.5"
                        >
                          Join
                        </SketchButton>
                      </div>
                    </div>
                  </SketchCard>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Upcoming this week */}
          <motion.section {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted mb-4">
              Upcoming this week
            </p>
            <div className="flex flex-col gap-6">
              {UPCOMING_WEEK.map((day) => (
                <div key={day.day}>
                  <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted mb-2">
                    {day.day}
                  </p>
                  {day.sessions.map((s) => (
                    <div key={s.learner} className="flex items-center gap-4 py-3">
                      <AvatarSVG seed={s.learner} size={32} className="flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-[14px] font-bold text-ink">{s.learner}</p>
                        <p className="text-[13px] text-ink-muted">{s.topic}</p>
                      </div>
                      <span className="text-[13px] text-ink-muted">{s.time}</span>
                    </div>
                  ))}
                  <SketchDivider />
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Right — 40% */}
        <div className="lg:col-span-2 flex flex-col gap-12">
          {/* Recent Feedback */}
          <motion.section {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted mb-4">
              Recent feedback
            </p>
            <div className="flex flex-col gap-4">
              {FEEDBACK.map((f, i) => (
                <SketchCard key={f.learner} tilt={[-1, 1.5, -0.5][i]} className="p-5">
                  <p className="text-[14px] text-ink italic leading-relaxed mb-3">{f.quote}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-hand text-[16px] text-ink">{f.learner}</span>
                    <RatingDisplay rating={f.rating} size={14} />
                  </div>
                </SketchCard>
              ))}
            </div>
          </motion.section>

          {/* Profile Strength */}
          <motion.section {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.25 }}>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted mb-4">
              Profile strength
            </p>
            <SketchCard className="p-6">
              {/* Progress bar */}
              <div className="w-full h-2 bg-ink/[0.06] rounded-full overflow-hidden mb-5">
                <motion.div
                  className="h-full bg-ink rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${completeness * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                />
              </div>

              <div className="flex flex-col gap-3">
                {PROFILE_ITEMS.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <svg viewBox="0 0 20 20" className="w-4 h-4 text-ink flex-shrink-0">
                      <rect x="1" y="1" width="18" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      {item.done && (
                        <path d="M 5 10 L 8 14 L 15 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      )}
                    </svg>
                    <span className={`text-[14px] ${item.done ? "text-ink-faint line-through" : "text-ink"}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </SketchCard>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
