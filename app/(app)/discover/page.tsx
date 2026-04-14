/* Discover page — curated teacher marketplace with search, filters, and teacher card grid. */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SketchCard } from "@/components/ui/SketchCard";
import { SketchButton } from "@/components/ui/SketchButton";
import { AvatarSVG } from "@/components/ui/AvatarSVG";
import { Doodle } from "@/components/ui/Doodle";

const TOPICS = ["Design", "Engineering", "Writing", "Marketing", "Finance", "Product", "Leadership", "Communication"];

const TEACHERS = [
  { name: "Maya Krishnan", specialty: "UX Research", topics: ["Design", "Product"], rate: "₹1,200", nextSlot: "Tomorrow, 3:00 PM", tilt: -1.2 },
  { name: "David Chen", specialty: "System Design", topics: ["Engineering"], rate: "₹1,500", nextSlot: "Wed, 11:00 AM", tilt: 0.8 },
  { name: "Sarah Okafor", specialty: "Copywriting", topics: ["Writing", "Marketing"], rate: "₹900", nextSlot: "Thu, 2:00 PM", tilt: -0.5 },
  { name: "James Park", specialty: "Financial Modeling", topics: ["Finance"], rate: "₹1,800", nextSlot: "Fri, 10:00 AM", tilt: 1.5 },
  { name: "Priya Nair", specialty: "Product Strategy", topics: ["Product", "Leadership"], rate: "₹1,400", nextSlot: "Mon, 4:00 PM", tilt: -1.0 },
  { name: "Alex Rivera", specialty: "Motion Design", topics: ["Design", "Engineering"], rate: "₹1,100", nextSlot: "Tue, 1:00 PM", tilt: 0.6 },
];

export default function DiscoverPage() {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = activeTopic
    ? TEACHERS.filter((t) => t.topics.includes(activeTopic))
    : TEACHERS;

  const fadeUp = {
    initial: { y: 20, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 pb-24">
      {/* ── Heading ──────────────────────────────────── */}
      <motion.section className="pt-12 pb-8" {...fadeUp}>
        <h1 className="text-[42px] font-bold text-ink leading-tight">
          Find your
        </h1>
        <span
          className="font-hand font-bold text-[48px] text-ink inline-block"
          style={{ transform: "rotate(-2deg)" }}
        >
          teacher
        </span>
        <p className="text-ink-muted text-[16px] font-medium mt-4 max-w-lg leading-relaxed">
          Browse people who are genuinely good at what you want to learn.
        </p>
      </motion.section>

      {/* ── Search Bar ───────────────────────────────── */}
      <motion.div
        className="max-w-[720px] mx-auto mb-10"
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.1 }}
      >
        <motion.div
          className="relative h-14 flex items-center"
          animate={{ scale: searchFocused ? 1.01 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Sketch border */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 56">
            <motion.path
              d="M 6 6 C 100 3, 300 4, 394 6 C 396 16, 395 40, 393 50 C 300 53, 100 52, 6 50 C 4 40, 5 16, 6 6"
              fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={searchFocused ? "text-ink/[0.3]" : "text-ink/[0.1]"}
              vectorEffect="non-scaling-stroke"
              animate={{ pathLength: searchFocused ? 1 : 0.95 }}
              transition={{ duration: 0.3 }}
            />
          </svg>

          {/* Magnifying glass */}
          <div className="pl-5 pr-3 text-ink-muted">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-[18px] h-[18px]">
              <circle cx="9" cy="9" r="6" />
              <path d="M 13.5 13.5 L 18 18" />
            </svg>
          </div>

          <input
            type="text"
            placeholder="What do you want to learn?"
            className="flex-1 bg-transparent text-ink text-[15px] font-medium placeholder:text-ink-muted/60 outline-none h-full"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />

          <div className="pr-3">
            <button className="text-[13px] text-ink-muted font-medium px-4 py-1.5 relative">
              Search
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 80 32">
                <path d="M 3 3 C 20 2, 60 2, 77 4 C 78 10, 78 22, 76 29 C 60 30, 20 30, 4 28 C 2 22, 2 10, 3 3" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink/[0.12]" vectorEffect="non-scaling-stroke" />
              </svg>
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Topic Filters ────────────────────────────── */}
      <motion.div
        className="relative mb-8"
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.15 }}
      >
        <div
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
          style={{
            maskImage: "linear-gradient(to right, black 90%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, black 90%, transparent 100%)",
          }}
        >
          {TOPICS.map((topic) => {
            const isActive = activeTopic === topic;
            return (
              <button
                key={topic}
                onClick={() => setActiveTopic(isActive ? null : topic)}
                className={`relative flex-shrink-0 h-9 px-5 text-[13px] font-medium transition-colors whitespace-nowrap ${
                  isActive ? "text-warm-white" : "text-ink-muted hover:text-ink"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-topic"
                    className="absolute inset-0 bg-ink rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{topic}</span>
                {!isActive && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 36">
                    <path d="M 10 3 C 30 1, 70 2, 90 4 C 97 10, 98 26, 92 33 C 70 35, 30 34, 8 32 C 2 26, 3 10, 10 3" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink/[0.1]" vectorEffect="non-scaling-stroke" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── Results Count & Sort ──────────────────── */}
      <div className="flex justify-between items-center mb-8">
        <p className="text-ink-muted text-[14px]">
          {filtered.length} teacher{filtered.length !== 1 ? "s" : ""} available
          {activeTopic ? ` for ${activeTopic}` : ""}
        </p>
        <button className="text-[13px] text-ink-muted font-medium flex items-center gap-1.5 relative px-3 py-1">
          Best match
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-3 h-3">
            <path d="M 3 5 L 6 8 L 9 5" />
          </svg>
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 32">
            <path d="M 4 4 C 30 2, 70 3, 96 5 C 98 10, 97 22, 95 28 C 70 30, 30 29, 4 27 C 2 22, 3 10, 4 4" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink/[0.1]" vectorEffect="non-scaling-stroke" />
          </svg>
        </button>
      </div>

      {/* ── Teacher Grid ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map((teacher, i) => (
            <motion.div
              key={teacher.name}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
            >
              <SketchCard tilt={teacher.tilt} className="p-6 group">
                <div className="flex items-start gap-4 mb-4">
                  <AvatarSVG seed={teacher.name} size={52} />
                  <div>
                    <h3 className="text-[18px] font-bold text-ink">{teacher.name}</h3>
                    <p className="text-[13px] text-ink-muted uppercase tracking-wide font-medium">
                      {teacher.specialty}
                    </p>
                  </div>
                  {/* Stars doodle on hover */}
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Doodle type="stars-cluster" className="w-8 h-8 text-ink/20" />
                  </div>
                </div>

                {/* Topic pills */}
                <div className="flex gap-2 mb-4">
                  {teacher.topics.map((topic) => (
                    <span key={topic} className="text-[12px] text-ink-muted px-3 py-1 relative">
                      {topic}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 80 26">
                        <path d="M 4 3 C 20 1, 60 2, 76 4 C 78 8, 78 18, 76 23 C 60 25, 20 24, 4 22 C 2 18, 2 8, 4 3" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink/[0.1]" vectorEffect="non-scaling-stroke" />
                      </svg>
                    </span>
                  ))}
                </div>

                {/* Divider */}
                <svg className="w-full h-[2px] my-3" preserveAspectRatio="none" viewBox="0 0 200 2">
                  <path d="M 0 1 Q 50 0, 100 1 T 200 1" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-ink/[0.08]" vectorEffect="non-scaling-stroke" />
                </svg>

                <div className="flex items-center justify-between mb-5">
                  <span className="text-[13px] text-ink-muted">
                    Next: {teacher.nextSlot}
                  </span>
                  <span className="font-hand font-bold text-[16px] text-ink">
                    {teacher.rate}
                  </span>
                </div>

                <SketchButton variant="ghost" className="!text-[13px] !px-4 !py-2 w-full">
                  Book a session
                </SketchButton>
              </SketchCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Load More ────────────────────────────────── */}
      <div className="flex justify-center mt-12">
        <SketchButton variant="ghost" className="!text-[14px] !px-6 !py-2.5">
          <span className="flex items-center gap-2">
            Load more
            <motion.svg
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="w-3 h-3"
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M 6 2 L 6 10 M 3 7 L 6 10 L 9 7" />
            </motion.svg>
          </span>
        </SketchButton>
      </div>
    </div>
  );
}
