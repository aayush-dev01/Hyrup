"use client";

/**
 * FeaturedTeachers.tsx
 * Presents three featured teachers with unique tilted cards, SVG sketchy outlines,
 * inline drawn avatars, and rich Framer Motion hover mechanics.
 */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HandText } from "../ui/HandText";
import { SketchButton } from "../ui/SketchButton";
import { Doodle } from "../ui/Doodle";

const teachers = [
  {
    name: "Alia Roberts",
    specialty: "UX/UI Design & Prototyping",
    tags: ["Figma", "Research", "CSS"],
    rotate: -1,
    avatar: (
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full text-ink"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="50" cy="50" r="45" fill="#F9F8F6" />
        <path d="M 30 70 C 40 50, 60 50, 70 70" />
        <circle cx="40" cy="40" r="2.5" fill="currentColor" stroke="none" />
        <circle cx="60" cy="40" r="2.5" fill="currentColor" stroke="none" />
        <path d="M 45 55 Q 50 60 55 55" />
        <path
          d="M 30 30 C 50 10, 80 40, 85 60 M 20 50 C 15 30, 40 20, 50 20"
          strokeWidth="3"
        />
      </svg>
    ),
  },
  {
    name: "David Chen",
    specialty: "Full Stack Engineering",
    tags: ["React", "Node.js", "System Design"],
    rotate: 1.5,
    avatar: (
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full text-ink"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="50" cy="50" r="45" fill="#F9F8F6" />
        <path d="M 25 75 C 40 60, 60 60, 75 75" />
        <path d="M 35 40 L 45 40 M 55 40 L 65 40" strokeWidth="3" />
        <path d="M 42 55 Q 50 58 58 55" />
        {/* Glasses */}
        <rect x="30" y="32" width="18" height="12" rx="2" />
        <rect x="52" y="32" width="18" height="12" rx="2" />
        <path d="M 48 38 L 52 38" />
        <path d="M 35 25 Q 50 15 65 25" strokeWidth="3" />
      </svg>
    ),
  },
  {
    name: "Sarah Jenkins",
    specialty: "Product Strategy & Growth",
    tags: ["GTM", "Analytics", "PLG"],
    rotate: -0.5,
    avatar: (
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full text-ink"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="50" cy="50" r="45" fill="#F9F8F6" />
        <path d="M 32 72 Q 50 50 68 72" />
        <circle cx="40" cy="42" r="2.5" fill="currentColor" stroke="none" />
        <circle cx="60" cy="42" r="2.5" fill="currentColor" stroke="none" />
        <path d="M 46 58 Q 50 62 54 58" />
        <path d="M 28 45 Q 25 30 50 20 Q 75 30 72 45" strokeWidth="3" />
      </svg>
    ),
  },
];

const TeacherCard = ({ teacher }: { teacher: (typeof teachers)[0] }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative flex flex-col p-8 bg-warm-white items-center text-center max-w-sm w-full mx-auto outline-none"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      initial={{ rotate: teacher.rotate }}
      whileHover={{ y: -6, rotate: 0 }}
      transition={{ duration: 0.2 }}
      tabIndex={0}
    >
      {/* Sketchy SVG Border Overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        preserveAspectRatio="none"
        viewBox="0 0 200 300"
      >
        <path d="M 4 4 L 196 6 L 195 296 L 5 295 Z" fill="#F9F8F6" />
        <path
          d="M 5 10 C 20 5, 180 4, 195 6 C 197 50, 194 250, 196 295 C 180 297, 20 295, 5 294 C 3 250, 6 50, 5 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
          className="text-ink text-opacity-80"
        />
      </svg>

      {/* Decorative Stars that appear on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute -top-6 -right-6 w-16 h-16 z-20 text-ink pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Doodle type="stars-cluster" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Avatar Area */}
        <div className="w-24 h-24 mb-6 relative">{teacher.avatar}</div>

        {/* Text Area */}
        <h3 className="text-xl font-bold text-ink mb-1">{teacher.name}</h3>
        <p className="text-[13px] text-ink-muted font-medium tracking-wide mb-6">
          {teacher.specialty.toUpperCase()}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {teacher.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-semibold text-ink-muted relative"
            >
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                <path
                  d="M 5 50 C 5 10, 95 10, 95 50 C 95 90, 5 90, 5 50 Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  className="text-ink text-opacity-30"
                />
              </svg>
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <SketchButton variant="ghost" className="w-full text-sm py-2">
          Book a session
        </SketchButton>
      </div>
    </motion.div>
  );
};

export const FeaturedTeachers = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  return (
    <section className="w-full bg-warm-white py-[100px] px-6 md:px-12 overflow-visible">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-ink">
            Featured <HandText rotate={1.5}>teachers</HandText>
          </h2>
        </motion.div>

        {/* Grid Container */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pt-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {teachers.map((teacher) => (
            <motion.div
              key={teacher.name}
              variants={itemVariants}
              className="flex justify-center h-full"
            >
              <TeacherCard teacher={teacher} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
