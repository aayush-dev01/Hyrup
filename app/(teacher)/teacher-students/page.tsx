/* Teacher Students — Maya's learner roster with expandable notes. */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { StudentRow } from "@/components/teacher/StudentRow";

const STUDENTS = [
  { name: "Aayush Bharti", topic: "UX Research Fundamentals", totalSessions: 6, lastSession: "3 days ago", tilt: -0.4 },
  { name: "Sneha Kapoor", topic: "Usability Testing Methods", totalSessions: 4, lastSession: "1 week ago", tilt: 0.3 },
  { name: "Ravi Shankar", topic: "Design Systems Overview", totalSessions: 3, lastSession: "2 weeks ago", tilt: -0.2 },
  { name: "Priya Mehta", topic: "Research Repository Setup", totalSessions: 2, lastSession: "3 weeks ago", tilt: 0.5 },
  { name: "Karan Verma", topic: "UX Research Fundamentals", totalSessions: 1, lastSession: "1 month ago", tilt: -0.3 },
];

export default function TeacherStudentsPage() {
  const [search, setSearch] = useState("");
  const filtered = STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.topic.toLowerCase().includes(search.toLowerCase()),
  );

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

      {/* Search */}
      <motion.div
        className="mb-6 relative"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" as const }}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search students by name or topic..."
          className="w-full bg-transparent text-ink text-[15px] font-sans py-3 px-4 focus:outline-none placeholder:text-ink/30"
        />
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M 2 3 L 98 1 L 99 97 L 1 98 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-ink/[0.12]" vectorEffect="non-scaling-stroke" />
        </svg>
      </motion.div>

      <p className="text-[14px] text-ink-muted mb-6">{filtered.length} students total</p>

      {/* Student List */}
      <div className="flex flex-col gap-3">
        {filtered.map((student, i) => (
          <motion.div
            key={student.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.05, ease: "easeOut" as const }}
          >
            <StudentRow {...student} />
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-ink-muted text-[15px] italic">No students match your search.</p>
        </div>
      )}
    </div>
  );
}
