/* Learner Dashboard — Aayush Sharma's learning command centre with coherent data. */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { motion } from "framer-motion";
import { SketchCard } from "@/components/ui/SketchCard";
import { SketchButton } from "@/components/ui/SketchButton";
import { SketchDivider } from "@/components/ui/SketchDivider";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { RatingDisplay } from "@/components/ui/RatingDisplay";
import { FullPageLoader } from "@/components/ui/FullPageLoader";

const STATS = [
  { value: "12", label: "Sessions completed" },
  { value: "4.9", label: "Average rating given" },
  { value: "3", label: "Active goals" },
];

const TODAY_SESSION = {
  teacher: "Maya Krishnan",
  topic: "UX Research Fundamentals",
  time: "3:00 PM",
  date: "Today",
  duration: "60 min",
};

const RECENT_SESSIONS = [
  { id: "1", teacher: "David Chen", topic: "System Design Fundamentals", date: "3 days ago", rating: 5.0 },
  { id: "2", teacher: "Sarah Okafor", topic: "Writing for Conversion", date: "1 week ago", rating: 4.5 },
  { id: "3", teacher: "Priya Nair", topic: "Product Roadmap Prioritization", date: "2 weeks ago", rating: 5.0 },
];

const UPCOMING_WEEK: Record<string, { teacher: string; topic: string; time: string }[]> = {
  Wednesday: [{ teacher: "Maya Krishnan", topic: "Usability Testing Methods", time: "4:00 PM" }],
  Friday: [{ teacher: "James Park", topic: "Financial Modeling Basics", time: "10:00 AM" }],
};

const SUGGESTED = [
  { name: "Alex Rivera", specialty: "Motion Design", bio: "Former Pixar animator, now teaching micro-interaction design and Lottie workflows.", rate: "₹1,100", tilt: -0.8 },
  { name: "James Park", specialty: "Financial Modeling", bio: "Goldman Sachs alum. Teaches startup financial modeling and unit economics.", rate: "₹1,800", tilt: 0.5 },
];

const LEARNING_GOALS = [
  { goal: "Understand SaaS pricing strategy", progress: 65, teacherAdvice: "Maya suggested reviewing the Van Westendorp framework before next session." },
  { goal: "Build a basic financial model", progress: 30, teacherAdvice: "James recommended starting with revenue drivers before expenses." },
  { goal: "Improve product writing skills", progress: 45, teacherAdvice: "Sarah left a reading list on persuasive microcopy patterns." },
];

export default function DashboardPage() {
  const router = useRouter();
  const { data: user, isLoading } = trpc.users.getCurrentUser.useQuery();
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

  useEffect(() => {
    if (user && user.role === "TEACHER") {
      router.push("/teacher-dashboard");
    }
  }, [user, router]);

  if ((isLoading && showLoader) || (user && user.role === "TEACHER")) {
    return <FullPageLoader label="Loading your dashboard…" />;
  }

  if (isLoading) {
    return <div className="min-h-screen bg-warm-white" />;
  }

  const firstName = user?.firstName || "Aayush";

  const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const },
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 pb-24">

      {/* Greeting */}
      <motion.div className="pt-12 pb-8" {...fadeUp}>
        <h2 className="text-[48px] font-bold text-ink leading-[1.1]">Good morning,</h2>
        <h1 className="font-hand font-bold text-[64px] text-ink leading-[1]" style={{ transform: "rotate(-2deg)", display: "inline-block" }}>
          {firstName}
        </h1>
        <p className="text-ink-muted text-[15px] mt-4 max-w-xl">
          You have a session with Maya today at 3:00 PM on UX Research Fundamentals. Keep the momentum going.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" as const }}
      >
        {STATS.map((stat, i) => (
          <SketchCard key={i} className="px-6 py-5 flex items-center gap-4">
            <span className="font-hand font-bold text-[36px] text-ink leading-none">{stat.value}</span>
            <span className="text-[14px] text-ink-muted">{stat.label}</span>
          </SketchCard>
        ))}
      </motion.div>

      {/* Today's Session */}
      <motion.div className="mb-12"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" as const }}
      >
        <h3 className="text-[20px] font-bold text-ink mb-5">
          Next <span className="font-hand" style={{ transform: "rotate(-1deg)", display: "inline-block" }}>session</span>
        </h3>
        <SketchCard tilt={-0.5} className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <svg className="absolute inset-0 w-[68px] h-[68px] text-ink/[0.08] pointer-events-none -translate-x-1 -translate-y-1"
                  viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 50 5 Q 85 10 90 40 Q 95 80 55 95 Q 20 105 10 60 Q 0 20 40 10" />
                </svg>
                <ProfileAvatar seed={TODAY_SESSION.teacher} size={56} className="relative z-10" />
              </div>
              <div>
                <h4 className="text-[20px] font-bold text-ink leading-tight">{TODAY_SESSION.teacher}</h4>
                <p className="font-hand text-[18px] text-ink-muted mt-1" style={{ transform: "rotate(-1deg)" }}>{TODAY_SESSION.topic}</p>
              </div>
            </div>
            <div className="flex flex-col md:items-end gap-2">
              <span className="text-[14px] text-ink-muted font-medium">{TODAY_SESSION.date} · {TODAY_SESSION.time}</span>
              <span className="text-[12px] text-ink/40 uppercase tracking-widest font-bold relative inline-flex px-3 py-1">
                {TODAY_SESSION.duration}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 30">
                  <path d="M 15 2 L 85 2 C 95 2, 98 15, 95 28 C 85 29, 15 29, 5 28 C 2 15, 5 2, 15 2 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink/[0.15]" vectorEffect="non-scaling-stroke" />
                </svg>
              </span>
            </div>
            <SketchButton variant="primary" className="!px-8 !py-3 shrink-0" href="/session/s1">Join session</SketchButton>
          </div>
        </SketchCard>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Column */}
        <div className="flex-[3] min-w-0">

          {/* Upcoming This Week */}
          <motion.div className="mb-12"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" as const }}
          >
            <h3 className="text-[20px] font-bold text-ink mb-5">
              This <span className="font-hand" style={{ transform: "rotate(-1deg)", display: "inline-block" }}>week</span>
            </h3>
            {Object.entries(UPCOMING_WEEK).map(([day, sessions]) => (
              <div key={day}>
                <p className="text-[11px] uppercase tracking-widest text-ink-muted font-medium mt-4 mb-2">{day}</p>
                {sessions.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5">
                    <ProfileAvatar seed={s.teacher} size={32} />
                    <div className="flex-1 min-w-0">
                      <span className="text-[14px] text-ink font-medium">{s.teacher}</span>
                      <span className="text-[14px] text-ink-muted ml-2 font-hand">{s.topic}</span>
                    </div>
                    <span className="text-[13px] text-ink/40 shrink-0">{s.time}</span>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>

          <SketchDivider />

          {/* Recent Activity */}
          <motion.div className="mb-12 mt-8"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" as const }}
          >
            <h3 className="text-[20px] font-bold text-ink mb-5">
              Recent <span className="font-hand" style={{ transform: "rotate(-1deg)", display: "inline-block" }}>activity</span>
            </h3>
            <div className="flex flex-col">
              {RECENT_SESSIONS.map((session, index) => (
                <React.Fragment key={session.id}>
                  <div className="flex items-center justify-between py-4 group cursor-pointer hover:bg-ink/[0.01] transition-colors -mx-4 px-4">
                    <div className="flex items-center gap-4">
                      <ProfileAvatar seed={session.teacher} size={36} />
                      <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-ink leading-tight">{session.teacher}</span>
                        <span className="text-[14px] text-ink-muted mt-0.5 leading-tight">{session.topic}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <RatingDisplay rating={session.rating} size={12} />
                      <span className="text-[13px] text-ink/40 hidden sm:block">{session.date}</span>
                      <Link href={`/summary/${session.id}`} className="text-[13px] font-bold text-ink flex items-center gap-1 group-hover:text-ink/70 transition-colors">
                        View
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3 h-3 transform group-hover:translate-x-[2px] transition-transform">
                          <path d="M 3 8 L 13 8 M 9 4 L 13 8 L 9 12" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                  {index < RECENT_SESSIONS.length - 1 && <SketchDivider />}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="flex-[2] min-w-[280px]">

          {/* Learning Goals */}
          <motion.div className="mb-10"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" as const }}
          >
            <h3 className="text-[20px] font-bold text-ink mb-5">
              Your <span className="font-hand" style={{ transform: "rotate(-1deg)", display: "inline-block" }}>goals</span>
            </h3>
            <div className="flex flex-col gap-4">
              {LEARNING_GOALS.map((g, i) => (
                <SketchCard key={i} className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[14px] font-medium text-ink">{g.goal}</span>
                    <span className="font-hand text-[14px] text-ink">{g.progress}%</span>
                  </div>
                  <svg className="w-full h-2 mb-3" viewBox="0 0 200 8" preserveAspectRatio="none">
                    <rect x="0" y="0" width="200" height="8" rx="4" fill="currentColor" className="text-ink/[0.06]" />
                    <motion.rect x="0" y="0" height="8" rx="4" fill="currentColor" className="text-ink"
                      initial={{ width: 0 }} animate={{ width: g.progress * 2 }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: "easeOut" as const }}
                    />
                  </svg>
                  <p className="text-[12px] text-ink/40 italic leading-relaxed">{g.teacherAdvice}</p>
                </SketchCard>
              ))}
            </div>
          </motion.div>

          <SketchDivider />

          {/* Suggested Teachers */}
          <motion.div className="mt-8"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" as const }}
          >
            <h3 className="text-[20px] font-bold text-ink mb-5">
              Suggested <span className="font-hand" style={{ transform: "rotate(-1deg)", display: "inline-block" }}>for you</span>
            </h3>
            <div className="flex flex-col gap-5">
              {SUGGESTED.map((teacher) => (
                <SketchCard key={teacher.name} tilt={teacher.tilt} className="p-5">
                  <div className="flex items-center gap-4 mb-3">
                    <ProfileAvatar seed={teacher.name} size={44} />
                    <div>
                      <h4 className="text-[16px] font-bold text-ink">{teacher.name}</h4>
                      <p className="text-[11px] text-ink-muted uppercase tracking-widest">{teacher.specialty}</p>
                    </div>
                  </div>
                  <p className="text-[13px] text-ink-muted leading-relaxed mb-4">{teacher.bio}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-hand font-bold text-[18px] text-ink">{teacher.rate}<span className="text-[12px] text-ink-muted font-sans font-normal ml-1">/hr</span></span>
                    <SketchButton variant="ghost" className="!text-[13px] !px-4 !py-1.5">Book</SketchButton>
                  </div>
                </SketchCard>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
