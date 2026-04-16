/* Teacher Dashboard — Maya Krishnan's command centre. */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SketchCard } from "@/components/ui/SketchCard";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { RatingDisplay } from "@/components/ui/RatingDisplay";
import { SketchButton } from "@/components/ui/SketchButton";
import { SketchDivider } from "@/components/ui/SketchDivider";
import { trpc } from "@/lib/trpc/client";
import { FullPageLoader } from "@/components/ui/FullPageLoader";

const STATS = [
  { value: "8", label: "Sessions this month" },
  { value: "₹11,200", label: "Earned this month" },
  { value: "72%", label: "Repeat learner rate" },
];

const TODAY_SESSIONS = [
  { learner: "Aayush Bharti", topic: "UX Research Fundamentals", time: "3:00 PM", duration: "60 min", imminent: false },
  { learner: "Sneha Kapoor", topic: "Usability Testing Methods", time: "6:30 PM", duration: "45 min", imminent: false },
];

const UPCOMING: Record<string, { learner: string; topic: string; time: string }[]> = {
  Wednesday: [{ learner: "Ravi Shankar", topic: "Design Systems Overview", time: "11:00 AM" }],
  Thursday: [{ learner: "Priya Mehta", topic: "Research Repository Setup", time: "4:00 PM" }],
  Friday: [{ learner: "Aayush Bharti", topic: "Usability Testing Basics", time: "2:00 PM" }],
};

const FEEDBACK = [
  {
    text: "Maya completely changed how I think about user feedback. The framework she showed me was exactly what I needed.",
    name: "Aayush",
    rating: 5.0,
    ago: "3 days ago",
    tilt: -0.8,
  },
  {
    text: "Clear, specific, and immediately useful. I walked away knowing exactly what to do next with my research.",
    name: "Sneha",
    rating: 4.5,
    ago: "1 week ago",
    tilt: 0.5,
  },
  {
    text: "She makes complex methodology feel approachable without dumbing it down. Highly recommend.",
    name: "Ravi",
    rating: 5.0,
    ago: "2 weeks ago",
    tilt: -0.3,
  },
];

const PROFILE_ITEMS = [
  { label: "Add a profile photo", icon: "camera", done: false },
  { label: "Link your LinkedIn profile", icon: "chain", done: false },
  { label: "Write your teaching philosophy", icon: "pen", done: false },
];

function ProfileIcon({ type }: { type: string }) {
  if (type === "camera") return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-4 h-4 text-ink-muted">
      <rect x="2" y="5" width="16" height="12" rx="2" />
      <circle cx="10" cy="11" r="3" />
      <path d="M7 5L8 3h4l1 2" />
    </svg>
  );
  if (type === "chain") return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-4 h-4 text-ink-muted">
      <path d="M8 12l-1.5 1.5a2.5 2.5 0 003.5 3.5L11.5 15.5" />
      <path d="M12 8l1.5-1.5a2.5 2.5 0 00-3.5-3.5L8.5 4.5" />
      <line x1="8.5" y1="11.5" x2="11.5" y2="8.5" />
    </svg>
  );
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-4 h-4 text-ink-muted">
      <path d="M3 17l4-1L16 7l-2-2L5 14z" />
      <path d="M12 5l2 2" />
    </svg>
  );
}

export default function TeacherDashboardPage() {
  const { data: user, isLoading } = trpc.users.getCurrentUser.useQuery();
  const firstName = user?.firstName || "Maya";
  const myImageUrl = user?.imageUrl ?? null;
  const [showLoader, setShowLoader] = useState(false);

  const shouldShowLoader = useMemo(() => isLoading, [isLoading]);

  useEffect(() => {
    if (!shouldShowLoader) {
      setShowLoader(false);
      return;
    }
    const t = window.setTimeout(() => setShowLoader(true), 350);
    return () => window.clearTimeout(t);
  }, [shouldShowLoader]);

  const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const },
  };

  if (isLoading && showLoader) {
    return <FullPageLoader label="Loading your teacher dashboard…" />;
  }

  if (isLoading) {
    return <div className="min-h-screen bg-warm-white" />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 pb-24">
      {/* Greeting */}
      <motion.div className="pt-12 pb-8" {...fadeUp}>
        <h2 className="text-[48px] font-bold text-ink leading-[1.1]">Good morning,</h2>
        <h1 className="font-hand font-bold text-[64px] text-ink leading-[1]" style={{ transform: "rotate(-2deg)", display: "inline-block" }}>
          {firstName}
        </h1>
        <p className="text-ink-muted text-[15px] mt-4 max-w-xl">
          You have 2 sessions today. Aayush joins you at 3:00 PM for UX Research Fundamentals.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" as const }}
      >
        {STATS.map((stat, i) => (
          <SketchCard key={i} className="px-6 py-5 flex items-center gap-4">
            <span className="font-hand font-bold text-[36px] text-ink leading-none">{stat.value}</span>
            <span className="text-[14px] text-ink-muted">{stat.label}</span>
          </SketchCard>
        ))}
      </motion.div>

      {/* Today's Sessions */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" as const }}
      >
        <h3 className="text-[20px] font-bold text-ink mb-5">
          Today&apos;s <span className="font-hand" style={{ transform: "rotate(-1deg)", display: "inline-block" }}>sessions</span>
        </h3>
        <div className="flex flex-col gap-3">
          {TODAY_SESSIONS.map((session, i) => (
            <SketchCard key={i} className="p-5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <ProfileAvatar seed={session.learner} size={44} />
                  <div>
                    <h4 className="text-[16px] font-bold text-ink">{session.learner}</h4>
                    <p className="font-hand text-[16px] text-ink-muted">{session.topic}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[14px] text-ink-muted">{session.time} · {session.duration}</span>
                  <SketchButton variant="ghost" className="!text-[13px] !px-4 !py-1.5">Prepare</SketchButton>
                  <SketchButton variant={session.imminent ? "primary" : "ghost"} className="!text-[13px] !px-4 !py-1.5">Join</SketchButton>
                </div>
              </div>
            </SketchCard>
          ))}
        </div>
      </motion.div>

      {/* Upcoming This Week */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" as const }}
      >
        <h3 className="text-[20px] font-bold text-ink mb-5">
          Upcoming this <span className="font-hand" style={{ transform: "rotate(-1deg)", display: "inline-block" }}>week</span>
        </h3>
        <div className="flex flex-col gap-1">
          {Object.entries(UPCOMING).map(([day, sessions]) => (
            <div key={day}>
              <p className="text-[11px] uppercase tracking-widest text-ink-muted font-medium mt-4 mb-2">{day}</p>
              {sessions.map((s, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5">
                  <ProfileAvatar seed={s.learner} size={32} />
                  <div className="flex-1 min-w-0">
                    <span className="text-[14px] text-ink font-medium">{s.learner}</span>
                    <span className="text-[14px] text-ink-muted ml-2 font-hand">{s.topic}</span>
                  </div>
                  <span className="text-[13px] text-ink/40 shrink-0">{s.time}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      <SketchDivider />

      {/* Recent Feedback */}
      <motion.div
        className="mb-12 mt-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" as const }}
      >
        <h3 className="text-[20px] font-bold text-ink mb-5">
          Recent <span className="font-hand" style={{ transform: "rotate(-1deg)", display: "inline-block" }}>feedback</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEEDBACK.map((fb, i) => (
            <SketchCard key={i} tilt={fb.tilt} className="p-6 flex flex-col justify-between min-h-[180px]">
              <p className="text-[14px] text-ink leading-relaxed italic">&ldquo;{fb.text}&rdquo;</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ProfileAvatar seed={fb.name} size={24} />
                  <span className="text-[13px] font-medium text-ink">{fb.name}</span>
                </div>
                <RatingDisplay rating={fb.rating} size={14} />
              </div>
              <span className="text-[12px] text-ink/40 mt-2">{fb.ago}</span>
            </SketchCard>
          ))}
        </div>
      </motion.div>

      <SketchDivider />

      {/* Profile Strength */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" as const }}
      >
        <h3 className="text-[20px] font-bold text-ink mb-5">
          Profile <span className="font-hand" style={{ transform: "rotate(-1deg)", display: "inline-block" }}>strength</span>
        </h3>
        <SketchCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <ProfileAvatar seed={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "You"} imageUrl={myImageUrl} size={44} />
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-ink truncate">
                {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Your profile"}
              </p>
              <p className="text-[12px] text-ink-muted truncate">{user?.email ?? ""}</p>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] text-ink-muted">75% complete</span>
              <span className="font-hand text-[14px] text-ink">3 items left</span>
            </div>
            <svg className="w-full h-2" viewBox="0 0 400 8" preserveAspectRatio="none">
              <path d="M 0 4 Q 100 2, 200 4 T 400 4" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-ink/[0.08]" vectorEffect="non-scaling-stroke" />
              <motion.path
                d="M 0 4 Q 75 2, 150 4 T 300 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                className="text-ink"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.6, ease: "easeOut" as const }}
              />
            </svg>
          </div>
          <div className="flex flex-col gap-3">
            {PROFILE_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <ProfileIcon type={item.icon} />
                  <span className="text-[14px] text-ink">{item.label}</span>
                </div>
                <SketchButton variant="ghost" className="!text-[12px] !px-3 !py-1">Add</SketchButton>
              </div>
            ))}
          </div>
        </SketchCard>
      </motion.div>
    </div>
  );
}
