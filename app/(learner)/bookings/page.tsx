/* My Sessions (Learner) — Aayush's upcoming and past sessions with coherent data. */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { SketchCard } from "@/components/ui/SketchCard";
import { TabBar } from "@/components/ui/TabBar";
import { SketchButton } from "@/components/ui/SketchButton";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { RatingDisplay } from "@/components/ui/RatingDisplay";
import { SketchDivider } from "@/components/ui/SketchDivider";
import { EmptyState } from "@/components/ui/EmptyState";

const UPCOMING = [
  {
    id: "s1",
    teacher: "Maya Krishnan",
    topic: "UX Research Fundamentals",
    specialty: "UX Research",
    date: "Today",
    time: "3:00 PM",
    duration: "60 min",
    rate: "₹1,200",
    notes: "Bring your research plan draft — Maya wants to review participant recruitment.",
  },
  {
    id: "s2",
    teacher: "Maya Krishnan",
    topic: "Usability Testing Methods",
    specialty: "UX Research",
    date: "Wednesday",
    time: "4:00 PM",
    duration: "45 min",
    rate: "₹900",
    notes: "Follow-up on the heuristic evaluation framework from last session.",
  },
  {
    id: "s3",
    teacher: "James Park",
    topic: "Financial Modeling Basics",
    specialty: "Financial Modeling",
    date: "Friday",
    time: "10:00 AM",
    duration: "60 min",
    rate: "₹1,800",
    notes: "First session. James asked you to prepare your company revenue numbers.",
  },
];

const PAST = [
  {
    id: "p1",
    teacher: "David Chen",
    topic: "System Design Fundamentals",
    date: "Apr 9, 2026",
    duration: "60 min",
    rating: 5.0,
    takeaway: "Learned the 4-step framework: requirements → estimation → high-level design → deep dive.",
  },
  {
    id: "p2",
    teacher: "Sarah Okafor",
    topic: "Writing for Conversion",
    date: "Apr 2, 2026",
    duration: "45 min",
    rating: 4.5,
    takeaway: "Rewrote the onboarding email sequence using Sarah's AIDA framework.",
  },
  {
    id: "p3",
    teacher: "Priya Nair",
    topic: "Product Roadmap Prioritization",
    date: "Mar 28, 2026",
    duration: "60 min",
    rating: 5.0,
    takeaway: "Applied the RICE framework to our backlog — cut scope by 40%.",
  },
  {
    id: "p4",
    teacher: "Maya Krishnan",
    topic: "UX Research Fundamentals",
    date: "Mar 22, 2026",
    duration: "60 min",
    rating: 5.0,
    takeaway: "Built my first moderated usability test script. Maya reviewed live.",
  },
  {
    id: "p5",
    teacher: "David Chen",
    topic: "API Design Patterns",
    date: "Mar 15, 2026",
    duration: "60 min",
    rating: 4.5,
    takeaway: "Understood REST vs gRPC trade-offs and designed our internal API contract.",
  },
];

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("Upcoming");

  const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const },
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 lg:px-8 pb-24">
      <motion.div className="pt-12 pb-6" {...fadeUp}>
        <h1 className="text-[32px] font-bold text-ink leading-tight">
          My <span className="font-hand inline-block" style={{ transform: "rotate(-2deg)" }}>sessions</span>
        </h1>
        <p className="text-ink-muted text-[15px] mt-2">
          Keep track of your learning journey and upcoming conversations.
        </p>
      </motion.div>

      <div className="mb-8">
        <TabBar tabs={["Upcoming", "Past"]} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Upcoming Tab */}
      {activeTab === "Upcoming" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" as const }}
          className="flex flex-col gap-5"
        >
          {UPCOMING.length > 0 ? (
            UPCOMING.map((s, i) => (
              <motion.div key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" as const }}
              >
                <SketchCard tilt={i % 2 === 0 ? -0.4 : 0.3} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <ProfileAvatar seed={s.teacher} size={48} />
                      <div>
                        <h3 className="text-[17px] font-bold text-ink leading-tight">{s.teacher}</h3>
                        <p className="font-hand text-[16px] text-ink-muted mt-0.5">{s.topic}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[13px] text-ink-muted">{s.date} · {s.time}</span>
                          <span className="text-[12px] text-ink/40 uppercase tracking-widest font-bold relative inline-flex px-2 py-0.5">
                            {s.duration}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 30">
                              <path d="M 15 2 L 85 2 C 95 2, 98 15, 95 28 C 85 29, 15 29, 5 28 C 2 15, 5 2, 15 2 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink/[0.12]" vectorEffect="non-scaling-stroke" />
                            </svg>
                          </span>
                          <span className="font-hand text-[14px] text-ink">{s.rate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 shrink-0 md:mt-1">
                      <SketchButton variant="ghost" className="!text-[13px] !px-4 !py-2">Reschedule</SketchButton>
                      <SketchButton variant="primary" className="!text-[13px] !px-5 !py-2">Join</SketchButton>
                    </div>
                  </div>
                  {s.notes && (
                    <div className="mt-4 pt-3 border-t border-ink/[0.06]">
                      <p className="text-[13px] text-ink/40 italic leading-relaxed">
                        <span className="text-ink/60 font-medium not-italic">Prep note:</span> {s.notes}
                      </p>
                    </div>
                  )}
                </SketchCard>
              </motion.div>
            ))
          ) : (
            <EmptyState
              illustration={
                <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[100px] h-[100px] text-ink/[0.2]">
                  <rect x="25" y="25" width="70" height="70" rx="6" />
                  <line x1="25" y1="45" x2="95" y2="45" />
                  <circle cx="50" cy="70" r="3" fill="currentColor" stroke="none" />
                  <circle cx="70" cy="70" r="3" fill="currentColor" stroke="none" />
                  <path d="M 55 80 Q 60 85 65 80" />
                </svg>
              }
              heading="Nothing coming up"
              body="Browse teachers and book your first session"
              action={<SketchButton variant="primary" href="/discover">Discover teachers</SketchButton>}
            />
          )}

          {/* Spending mini-summary */}
          <div className="mt-6 px-4">
            <SketchDivider />
            <div className="flex items-center justify-between py-4">
              <span className="text-[14px] text-ink-muted">This week&apos;s total</span>
              <span className="font-hand font-bold text-[20px] text-ink">₹3,900</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Past Tab */}
      {activeTab === "Past" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" as const }}
          className="flex flex-col gap-4"
        >
          <p className="text-[14px] text-ink-muted mb-2">{PAST.length} sessions completed · ₹14,400 invested in learning</p>
          {PAST.map((s, i) => (
            <motion.div key={s.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" as const }}
            >
              <SketchCard tilt={i % 2 === 0 ? 0.3 : -0.3} className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <ProfileAvatar seed={s.teacher} size={40} className="opacity-80" />
                    <div>
                      <h3 className="text-[16px] font-bold text-ink leading-tight">{s.teacher}</h3>
                      <p className="font-hand text-[15px] text-ink-muted mt-0.5">{s.topic}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <RatingDisplay rating={s.rating} size={12} />
                    <span className="text-[13px] text-ink/40">{s.date}</span>
                    <div className="flex gap-2">
                      <SketchButton variant="ghost" className="!text-[12px] !px-3 !py-1.5" href={`/summary/${s.id}`}>Summary</SketchButton>
                      <SketchButton variant="ghost" className="!text-[12px] !px-3 !py-1.5">Book again</SketchButton>
                    </div>
                  </div>
                </div>
                {s.takeaway && (
                  <div className="mt-3 pt-2 border-t border-ink/[0.04]">
                    <p className="text-[12px] text-ink/40 italic leading-relaxed">
                      <span className="text-ink/50 font-medium not-italic">Takeaway:</span> {s.takeaway}
                    </p>
                  </div>
                )}
              </SketchCard>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
