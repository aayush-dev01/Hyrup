/* Teacher public profile — trust page with sticky sidebar, tabs for About/Reviews/Availability. */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { SketchButton } from "@/components/ui/SketchButton";
import { SketchCard } from "@/components/ui/SketchCard";
import { TabBar } from "@/components/ui/TabBar";
import { RatingDisplay } from "@/components/ui/RatingDisplay";
import { SketchDivider } from "@/components/ui/SketchDivider";

const TEACHER = {
  name: "Maya Krishnan",
  specialty: "UX Research",
  topics: ["Design Thinking", "User Interviews", "Usability Testing", "Information Architecture"],
  bio: "I help product teams stop guessing and start listening. With 8 years leading research at companies from seed-stage to Series C, I've developed a practical approach to understanding users that doesn't require a PhD or a six-month study.",
  rate: "₹1,200",
  philosophy: "Good research isn't about asking the right questions — it's about creating the right conditions for honest answers. I teach by doing. Every session involves real problems from your actual work, not textbook exercises.",
  responseTime: "Usually responds within 2 hours",
};

const REVIEWS = [
  { learner: "Aayush", quote: "Maya completely changed how I think about user feedback. The framework she showed me for synthesizing interview data saved me weeks of confused spreadsheet work.", rating: 5, date: "2 weeks ago", tilt: -1 },
  { learner: "Priya", quote: "I was stuck on a pricing research project and Maya helped me see what I was missing in my interview script. Clear, specific, and immediately useful.", rating: 4.5, date: "1 month ago", tilt: 1.5 },
  { learner: "David", quote: "The best thing about working with Maya is that she makes complex methodology feel simple without dumbing it down. Highly recommend for anyone serious about research.", rating: 5, date: "2 months ago", tilt: -0.5 },
];

const AVAILABILITY = {
  Mon: ["10:00 AM", "2:00 PM", "4:00 PM"],
  Tue: ["11:00 AM", "3:00 PM"],
  Wed: ["10:00 AM", "1:00 PM", "3:00 PM"],
  Thu: ["2:00 PM", "5:00 PM"],
  Fri: ["10:00 AM", "11:00 AM"],
  Sat: [],
  Sun: [],
};

const TOPIC_DETAILS = [
  { name: "Design Thinking", desc: "Structured approaches to solving ambiguous problems through iterative prototyping." },
  { name: "User Interviews", desc: "How to ask questions that reveal real behavior, not just what people think they want." },
  { name: "Usability Testing", desc: "Running effective tests with small sample sizes that still produce actionable insights." },
  { name: "Information Architecture", desc: "Organizing content and navigation so users find what they need without thinking." },
];

export default function TeacherProfilePage() {
  const [activeTab, setActiveTab] = useState("About");
  const today = new Date().toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-12 pb-24">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* ── Left Sidebar — sticky ──────────────────── */}
        <div className="lg:w-[38%] lg:sticky lg:top-24 lg:self-start">
          {/* Avatar with scribble circle */}
          <div className="relative w-[120px] h-[120px] mx-auto lg:mx-0 mb-6">
            <ProfileAvatar seed={TEACHER.name} size={120} className="relative z-10" />
            <motion.svg
              className="absolute inset-[-8px] w-[136px] h-[136px]"
              viewBox="0 0 136 136"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <motion.circle
                cx="68" cy="68" r="62"
                className="text-ink/[0.12]"
                strokeDasharray="8 6"
                initial={{ strokeDashoffset: 400 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </motion.svg>
          </div>

          <h1 className="text-[32px] font-bold text-ink text-center lg:text-left">{TEACHER.name}</h1>
          <p className="text-[14px] text-ink-muted uppercase tracking-[0.15em] font-medium mt-1 text-center lg:text-left">
            {TEACHER.specialty}
          </p>

          {/* Topic pills */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center lg:justify-start">
            {TEACHER.topics.map((t) => (
              <span key={t} className="text-[12px] text-ink-muted px-3 py-1 relative">
                {t}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 28">
                  <path d="M 5 4 C 25 2, 75 2, 95 4 C 97 9, 97 19, 95 24 C 75 27, 25 26, 5 24 C 3 19, 3 9, 5 4" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink/[0.1]" vectorEffect="non-scaling-stroke" />
                </svg>
              </span>
            ))}
          </div>

          <SketchDivider className="my-6" />

          <p className="text-[15px] text-ink-muted leading-[1.8]">{TEACHER.bio}</p>

          <SketchDivider className="my-6" />

          {/* Rate */}
          <div className="flex items-baseline gap-2 mb-6">
            <span className="font-hand font-bold text-[38px] text-ink">{TEACHER.rate}</span>
            <span className="text-[16px] text-ink-muted">/session</span>
          </div>

          <div className="flex flex-col gap-3">
            <SketchButton variant="primary" className="w-full !text-[15px]">
              Book a session
            </SketchButton>
            <SketchButton variant="ghost" className="w-full !text-[15px]">
              Send a message
            </SketchButton>
          </div>

          {/* Response time */}
          <div className="flex items-center gap-2 mt-4 justify-center lg:justify-start">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="w-3.5 h-3.5 text-ink-faint">
              <circle cx="8" cy="8" r="6" />
              <path d="M 8 4 L 8 8 L 11 10" />
            </svg>
            <span className="text-[12px] text-ink-faint">{TEACHER.responseTime}</span>
          </div>
        </div>

        {/* ── Right Content Area ─────────────────────── */}
        <div className="lg:w-[62%]">
          <TabBar tabs={["About", "Reviews", "Availability"]} activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="mt-8">
            {/* ABOUT TAB */}
            {activeTab === "About" && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-10"
              >
                <section>
                  <h3 className="text-[18px] font-bold text-ink mb-4">Teaching philosophy</h3>
                  <p className="text-[15px] text-ink-muted leading-[1.8]">{TEACHER.philosophy}</p>
                </section>

                <section>
                  <h3 className="text-[18px] font-bold text-ink mb-4">What to expect</h3>
                  <div className="flex flex-col gap-5">
                    {[
                      { icon: "M 12 3 L 14 8 L 10 8 Z M 9 10 L 15 10 M 12 10 L 12 18", label: "Real-world problems only. Every session uses your actual work as the case study." },
                      { icon: "M 5 15 L 10 8 L 15 12 L 20 5", label: "Step-by-step frameworks you can apply immediately after the session ends." },
                      { icon: "M 12 2 L 14 7 L 10 7 Z M 8 9 L 16 9 M 6 14 C 8 18, 16 18, 18 14", label: "Honest, specific feedback that helps you grow faster than self-study." },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-5 h-5 text-ink flex-shrink-0 mt-0.5">
                          <path d={item.icon} />
                        </svg>
                        <p className="text-[15px] text-ink-muted leading-relaxed">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-[18px] font-bold text-ink mb-4">Topics I teach</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {TOPIC_DETAILS.map((t) => (
                      <SketchCard key={t.name} className="p-5">
                        <h4 className="text-[15px] font-bold text-ink mb-1">{t.name}</h4>
                        <p className="text-[13px] text-ink-muted leading-relaxed">{t.desc}</p>
                      </SketchCard>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === "Reviews" && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-8"
              >
                <div className="flex items-center gap-4">
                  <RatingDisplay rating={4.8} size={20} />
                  <span className="text-[14px] text-ink-muted">from {REVIEWS.length} sessions</span>
                </div>

                {REVIEWS.map((r) => (
                  <SketchCard key={r.learner} tilt={r.tilt} className="p-6">
                    {/* Opening quote mark */}
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-ink/[0.12] mb-2">
                      <path d="M 3 12 C 3 7 6 4 10 4 L 10 7 C 7 7 6 9 6 11 L 10 11 L 10 20 L 3 20 Z M 14 12 C 14 7 17 4 21 4 L 21 7 C 18 7 17 9 17 11 L 21 11 L 21 20 L 14 20 Z" fill="currentColor" />
                    </svg>
                    <p className="text-[16px] text-ink italic leading-[1.8] mb-4">{r.quote}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-hand text-[18px] text-ink">{r.learner}</span>
                      <span className="text-[13px] text-ink-faint">{r.date}</span>
                    </div>
                  </SketchCard>
                ))}
              </motion.div>
            )}

            {/* AVAILABILITY TAB */}
            {activeTab === "Availability" && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-7 gap-2">
                  {Object.entries(AVAILABILITY).map(([day, slots]) => {
                    const isToday = day === today;
                    return (
                      <div key={day} className={`flex flex-col gap-2 p-2 rounded-lg ${isToday ? "bg-ink/[0.02]" : ""}`}>
                        <span className={`text-[12px] uppercase tracking-wider text-center font-medium ${isToday ? "text-ink font-bold" : "text-ink-muted"}`}>
                          {day}
                        </span>
                        {slots.length === 0 ? (
                          <span className="text-[11px] text-ink-faint text-center">—</span>
                        ) : (
                          slots.map((slot) => (
                            <button key={slot} className="text-[12px] text-ink-muted text-center py-1.5 relative hover:text-ink transition-colors">
                              {slot}
                              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 80 28">
                                <path d="M 4 4 C 20 2, 60 3, 76 5 C 78 10, 77 18, 75 24 C 60 26, 20 25, 4 23 C 2 18, 3 10, 4 4" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-ink/[0.08]" vectorEffect="non-scaling-stroke" />
                              </svg>
                            </button>
                          ))
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
