/* Learner Dashboard — warm morning briefing with sessions, action items, stats, and suggestions. */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { motion } from "framer-motion";
import { SketchCard } from "@/components/ui/SketchCard";
import { StatCard } from "@/components/ui/StatCard";
import { SketchButton } from "@/components/ui/SketchButton";
import { SketchDivider } from "@/components/ui/SketchDivider";
import { AvatarSVG } from "@/components/ui/AvatarSVG";
import { EmptyState } from "@/components/ui/EmptyState";

/* ── Placeholder Data ────────────────────────────────────── */
const NEXT_SESSION = {
  teacher: "Maya Krishnan",
  topic: "SaaS Pricing Strategy",
  date: "Tomorrow",
  time: "3:00 PM IST",
  duration: "60 min",
  isImminent: false,
  daysAway: 1,
};

const RECENT_SESSIONS = [
  { teacher: "David Chen", topic: "System Design Fundamentals", date: "3 days ago" },
  { teacher: "Sarah Okafor", topic: "Writing for Conversion", date: "1 week ago" },
  { teacher: "Priya Nair", topic: "Product Roadmap Prioritization", date: "2 weeks ago" },
];

const ACTION_ITEMS = [
  { id: "1", task: "Reprice the three main tiers using the margin formula", done: false },
  { id: "2", task: "Write one paragraph positioning statement for each segment", done: false },
  { id: "3", task: "Research how three competitors structure their pricing pages", done: false },
  { id: "4", task: "Read the article Maya shared on value-based pricing", done: false },
];

const SUGGESTED_TEACHERS = [
  { name: "James Park", specialty: "Financial Modeling", rate: "₹1,800" },
  { name: "Alex Rivera", specialty: "Motion Design", rate: "₹1,100" },
];

/* ── ActionItemRow component ─────────────────────────────── */
function ActionItemRow({ task, initialDone }: { task: string; initialDone: boolean }) {
  const [done, setDone] = useState(initialDone);

  return (
    <motion.div
      className="flex gap-3 items-start py-3"
      animate={{ opacity: done ? 0.4 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <button
        onClick={() => setDone(!done)}
        className="mt-0.5 flex-shrink-0"
      >
        <svg viewBox="0 0 20 20" className="w-4 h-4 text-ink">
          <rect
            x="1" y="1" width="18" height="18" rx="4"
            fill="none" stroke="currentColor" strokeWidth="1.5"
          />
          {done && (
            <motion.path
              d="M 5 10 L 8 14 L 15 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </svg>
      </button>
      <span
        className={`text-[15px] leading-relaxed font-medium transition-all duration-200 ${
          done ? "line-through text-ink-faint" : "text-ink"
        }`}
      >
        {task}
      </span>
    </motion.div>
  );
}

/* ── Main Dashboard ──────────────────────────────────────── */
export default function LearnerDashboardPage() {
  const firstName = "Aayush";
  const hasSessionToday = false;

  const fadeUp = {
    initial: { y: 20, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 pb-24">
      {/* ── Greeting Zone ──────────────────────────────── */}
      <motion.section className="pt-12 pb-10" {...fadeUp}>
        <h1 className="text-[40px] font-bold text-ink leading-tight">
          Good morning,
        </h1>
        <span
          className="font-hand font-bold text-[52px] text-ink inline-block"
          style={{ transform: "rotate(-2deg)" }}
        >
          {firstName}
        </span>

        <p className="text-ink-muted text-[16px] font-medium mt-4 leading-relaxed">
          {hasSessionToday
            ? "You have a session with Maya at 3pm."
            : "No sessions today — a good day to explore."}
        </p>
      </motion.section>

      {/* ── Two Column Layout ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Left Column — 60% */}
        <div className="lg:col-span-3 flex flex-col gap-12">
          {/* Next Session */}
          <motion.section {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted mb-4">
              Next session
            </p>

            {NEXT_SESSION ? (
              <SketchCard tilt={-0.8} className="p-8 bg-ink/[0.02]">
                <div className="flex gap-5 items-start">
                  <AvatarSVG seed={NEXT_SESSION.teacher} size={56} />
                  <div className="flex-1">
                    <h3 className="text-[20px] font-bold text-ink">
                      {NEXT_SESSION.teacher}
                    </h3>
                    <p
                      className="font-hand text-[18px] text-ink-muted mt-0.5"
                      style={{ transform: "rotate(-1deg)" }}
                    >
                      {NEXT_SESSION.topic}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-ink-muted text-[14px]">
                        {NEXT_SESSION.date} · {NEXT_SESSION.time}
                      </span>
                      <span className="text-[12px] text-ink-muted px-3 py-1 relative">
                        {NEXT_SESSION.duration}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 40">
                          <path d="M 4 4 C 30 2, 70 3, 96 5 C 98 12, 97 28, 95 36 C 70 38, 30 37, 4 35 C 2 28, 3 12, 4 4" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink/[0.12]" vectorEffect="non-scaling-stroke" />
                        </svg>
                      </span>
                    </div>
                    <div className="mt-6">
                      <SketchButton
                        variant={NEXT_SESSION.isImminent ? "primary" : "ghost"}
                        className="!text-[14px] !px-5 !py-2 w-full"
                      >
                        {NEXT_SESSION.isImminent
                          ? "Join session"
                          : `Upcoming — ${NEXT_SESSION.daysAway} day away`}
                      </SketchButton>
                    </div>
                  </div>
                </div>
              </SketchCard>
            ) : (
              <EmptyState
                illustration={
                  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
                    <circle cx="50" cy="40" r="12" />
                    <path d="M 50 52 L 50 70 M 50 60 L 38 55 M 50 60 L 62 55" />
                    <path d="M 30 80 L 70 80" strokeWidth="2.5" />
                    <rect x="35" y="72" width="12" height="8" rx="1" />
                    <path d="M 65 35 Q 72 25 75 30" strokeDasharray="3 3" />
                  </svg>
                }
                heading="Nothing scheduled yet"
                body="Find someone who knows what you want to learn"
                action={<SketchButton variant="primary" href="/discover">Discover teachers</SketchButton>}
              />
            )}
          </motion.section>

          {/* Recent Sessions */}
          <motion.section {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted mb-4">
              Recent sessions
            </p>
            <div className="flex flex-col">
              {RECENT_SESSIONS.map((session, i) => (
                <React.Fragment key={session.teacher}>
                  <div className="flex items-center gap-4 py-4">
                    <AvatarSVG seed={session.teacher} size={36} className="flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold text-ink truncate">
                        {session.teacher}
                      </p>
                      <p className="text-[14px] text-ink-muted truncate">
                        {session.topic}
                      </p>
                    </div>
                    <span className="text-[13px] text-ink-faint whitespace-nowrap">
                      {session.date}
                    </span>
                    <motion.button
                      className="text-[13px] text-ink-muted flex items-center gap-1 whitespace-nowrap"
                      whileHover="hover"
                    >
                      View summary
                      <motion.svg
                        viewBox="0 0 12 12"
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        variants={{ hover: { x: 3 } }}
                        transition={{ duration: 0.2 }}
                      >
                        <path d="M 2 6 L 10 6 M 7 3 L 10 6 L 7 9" />
                      </motion.svg>
                    </motion.button>
                  </div>
                  {i < RECENT_SESSIONS.length - 1 && <SketchDivider />}
                </React.Fragment>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Right Column — 40% */}
        <div className="lg:col-span-2 flex flex-col gap-12">
          {/* Action Items */}
          <motion.section {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted mb-4">
              Action items
            </p>
            <div className="flex flex-col">
              {ACTION_ITEMS.map((item) => (
                <ActionItemRow key={item.id} task={item.task} initialDone={item.done} />
              ))}
            </div>
          </motion.section>

          {/* Your Journey Stats */}
          <motion.section {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.25 }}>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted mb-4">
              Your journey
            </p>
            <div className="flex flex-col gap-3">
              <StatCard value="7" label="Total sessions" />
              <StatCard value="12" label="Hours learned" />
              <StatCard value="4" label="Teachers worked with" />
            </div>
          </motion.section>

          {/* Suggested For You */}
          <motion.section {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.3 }}>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted mb-4">
              Suggested for you
            </p>
            <div className="flex flex-col gap-3">
              {SUGGESTED_TEACHERS.map((t) => (
                <SketchCard key={t.name} tilt={0.5} className="p-5">
                  <div className="flex items-center gap-4">
                    <AvatarSVG seed={t.name} size={40} />
                    <div className="flex-1">
                      <p className="text-[15px] font-bold text-ink">{t.name}</p>
                      <p className="text-[13px] text-ink-muted uppercase tracking-wide">
                        {t.specialty}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <SketchButton variant="ghost" className="!text-[13px] !px-4 !py-1.5 w-full">
                      Book a session · {t.rate}
                    </SketchButton>
                  </div>
                </SketchCard>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
