/* Teacher Students — real learner roster from bookings. */

import React from "react";
import { motion } from "framer-motion";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { StudentRow } from "@/components/teacher/StudentRow";

function timeAgo(d: Date) {
  const ms = Date.now() - d.getTime();
  const days = Math.floor(ms / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 week ago";
  if (weeks < 5) return `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

export default async function TeacherStudentsPage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { teacherProfile: true },
  });
  if (!user) redirect("/onboarding");
  if (user.role !== "TEACHER") redirect("/dashboard");
  if (!user.teacherProfile) redirect("/onboarding/teacher-setup");

  const teacherId = user.teacherProfile.id;
  const bookings = await db.booking.findMany({
    where: { teacherId },
    orderBy: { startTime: "desc" },
    include: {
      learner: { include: { user: { select: { firstName: true, lastName: true, imageUrl: true } } } },
      teacher: { include: { topics: true } },
    },
  });

  const byLearner = new Map<
    string,
    { name: string; topic: string; totalSessions: number; lastSession: Date; tilt: number }
  >();

  for (const b of bookings) {
    const lid = b.learnerId;
    const name = b.learner?.user ? `${b.learner.user.firstName} ${b.learner.user.lastName}`.trim() : "Unknown Learner";
    const topic = b.teacher.topics?.[0]?.name ?? "Session";
    const prev = byLearner.get(lid);
    if (!prev) {
      byLearner.set(lid, { name, topic, totalSessions: 1, lastSession: b.startTime, tilt: -0.4 });
    } else {
      prev.totalSessions += 1;
      if (b.startTime > prev.lastSession) prev.lastSession = b.startTime;
    }
  }

  const rows = Array.from(byLearner.values()).map((r, i) => ({
    ...r,
    tilt: i % 2 === 0 ? -0.35 : 0.25,
    lastSession: timeAgo(r.lastSession),
  }));

  const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const },
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 pb-24">
      <motion.div className="pt-12 pb-6" {...fadeUp}>
        <h1 className="text-[32px] font-bold text-ink leading-tight">
          Your <span className="font-hand inline-block" style={{ transform: "rotate(-2deg)" }}>students</span>
        </h1>
      </motion.div>

      <p className="text-[14px] text-ink-muted mb-6">{rows.length} students total</p>

      <div className="flex flex-col gap-3">
        {rows.map((student, i) => (
          <motion.div
            key={student.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: "easeOut" as const }}
          >
            <StudentRow {...student} />
          </motion.div>
        ))}
      </div>

      {rows.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-ink-muted text-[15px] italic">No students yet.</p>
        </div>
      )}
    </div>
  );
}
