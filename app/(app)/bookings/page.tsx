/* My Sessions (Learner) — organized list of upcoming and past sessions with summaries and actions. */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { SketchCard } from "@/components/ui/SketchCard";
import { TabBar } from "@/components/ui/TabBar";
import { SketchButton } from "@/components/ui/SketchButton";
import { AvatarSVG } from "@/components/ui/AvatarSVG";
import { EmptyState } from "@/components/ui/EmptyState";
import { SketchDivider } from "@/components/ui/SketchDivider";

const UPCOMING = [
  {
    id: "s1",
    teacher: "Maya Krishnan",
    topic: "SaaS Pricing Strategy",
    date: "Tomorrow",
    time: "3:00 PM",
    duration: "60 min",
    status: "Upcoming",
  },
  {
    id: "s2",
    teacher: "James Park",
    topic: "Financial Modeling",
    date: "Apr 20, 2026",
    time: "10:00 AM",
    duration: "60 min",
    status: "Confirmed",
  },
];

const PAST = [
  {
    id: "p1",
    teacher: "David Chen",
    topic: "System Design Fundamentals",
    date: "Apr 9, 2026",
    duration: "60 min",
    hasSummary: true,
  },
  {
    id: "p2",
    teacher: "Sarah Okafor",
    topic: "Writing for Conversion",
    date: "Apr 2, 2026",
    duration: "30 min",
    hasSummary: true,
  },
];

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("Upcoming");

  const fadeUp = {
    initial: { y: 20, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 lg:px-8 py-12 pb-24">
      <motion.section className="mb-10" {...fadeUp}>
        <h1 className="text-[40px] font-bold text-ink leading-tight">
          My{" "}
          <span
            className="font-hand font-bold text-[48px] text-ink inline-block"
            style={{ transform: "rotate(-1.5deg)" }}
          >
            sessions
          </span>
        </h1>
        <p className="text-ink-muted text-[16px] font-medium mt-2">
          Keep track of your learning journey and upcoming conversations.
        </p>
      </motion.section>

      <div className="mb-8">
        <TabBar
          tabs={["Upcoming", "Past"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <div className="mt-10">
        {activeTab === "Upcoming" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            {UPCOMING.length > 0 ? (
              UPCOMING.map((s, i) => (
                <SketchCard key={s.id} tilt={i % 2 === 0 ? -0.4 : 0.6} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex items-center gap-4 flex-1">
                      <AvatarSVG seed={s.teacher} size={48} />
                      <div>
                        <h3 className="text-[18px] font-bold text-ink">{s.teacher}</h3>
                        <p
                          className="font-hand text-[18px] text-ink-muted leading-none mt-1"
                          style={{ transform: "rotate(-1deg)" }}
                        >
                          {s.topic}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 md:text-right">
                      <p className="text-[14px] text-ink font-medium">{s.date} · {s.time}</p>
                      <p className="text-[12px] text-ink-faint uppercase tracking-wider">{s.duration}</p>
                    </div>

                    <div className="flex gap-3">
                      <SketchButton variant="ghost" className="!text-[13px] !px-4 !py-2">
                        Reschedule
                      </SketchButton>
                      <SketchButton variant="primary" className="!text-[13px] !px-6 !py-2" href={`/session/${s.id}`}>
                        Join Room
                      </SketchButton>
                    </div>
                  </div>
                </SketchCard>
              ))
            ) : (
              <EmptyState
                illustration={
                  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full opacity-20">
                    <rect x="25" y="25" width="50" height="50" rx="4" />
                    <line x1="25" y1="40" x2="75" y2="40" />
                    <circle cx="50" cy="55" r="3" />
                  </svg>
                }
                heading="No upcoming sessions"
                body="Find a teacher and book your first session to get started."
                action={<SketchButton variant="primary" href="/discover">Browse teachers</SketchButton>}
              />
            )}
          </motion.div>
        )}

        {activeTab === "Past" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
          >
            {PAST.length > 0 ? (
              PAST.map((s, i) => (
                <div key={s.id}>
                  <div className="flex items-center justify-between py-6 group cursor-pointer hover:bg-ink/[0.01] transition-colors -mx-4 px-4 rounded-xl">
                    <div className="flex items-center gap-4">
                      <AvatarSVG seed={s.teacher} size={40} />
                      <div>
                        <p className="text-[15px] font-bold text-ink">{s.teacher}</p>
                        <p className="text-[14px] text-ink-muted">{s.topic}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <span className="text-[13px] text-ink-faint hidden md:inline-block">{s.date}</span>
                      <div className="flex gap-2">
                        <SketchButton variant="ghost" className="!text-[12px] !px-4 !py-1.5" href={`/summary/${s.id}`}>
                          Summary
                        </SketchButton>
                        <SketchButton variant="ghost" className="!text-[12px] !px-4 !py-1.5" href={`/book/maya`}>
                          Book again
                        </SketchButton>
                      </div>
                    </div>
                  </div>
                  {i < PAST.length - 1 && <SketchDivider />}
                </div>
              ))
            ) : (
              <EmptyState
                heading="No past sessions"
                body="Completed sessions will appear here with their summaries and action items."
              />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
