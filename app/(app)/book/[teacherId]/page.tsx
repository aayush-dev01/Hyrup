/* Booking flow — calm three-step guided ritual: Choose time → Set intention → Complete booking. */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { SketchButton } from "@/components/ui/SketchButton";
import { SketchCard } from "@/components/ui/SketchCard";
import { AvatarSVG } from "@/components/ui/AvatarSVG";

const TEACHER = { name: "Maya Krishnan", specialty: "UX Research", rate60: 1200, rate30: 700 };

const WEEK_DAYS = [
  { day: "Mon", date: "Apr 14", slots: ["10:00 AM", "2:00 PM", "4:00 PM"] },
  { day: "Tue", date: "Apr 15", slots: ["11:00 AM", "3:00 PM"] },
  { day: "Wed", date: "Apr 16", slots: ["10:00 AM", "1:00 PM", "3:00 PM"] },
  { day: "Thu", date: "Apr 17", slots: ["2:00 PM", "5:00 PM"] },
  { day: "Fri", date: "Apr 18", slots: ["10:00 AM", "11:00 AM"] },
  { day: "Sat", date: "Apr 19", slots: [] },
  { day: "Sun", date: "Apr 20", slots: [] },
];

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null);
  const [duration, setDuration] = useState<30 | 60>(60);
  const [intention, setIntention] = useState("");

  const price = duration === 60 ? TEACHER.rate60 : TEACHER.rate30;
  const fee = Math.round(price * 0.15);

  return (
    <div className="w-full max-w-5xl mx-auto px-6 lg:px-8 py-12 pb-24">
      {/* Step indicator */}
      <div className="mb-12">
        <StepIndicator steps={["Choose time", "Set intention", "Complete"]} currentStep={step} />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {/* ── STEP 1: Choose Time ──────────────── */}
            {step === 0 && (
              <motion.div
                key="step1"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-[24px] font-bold text-ink mb-8">Choose your time</h2>

                <div className="grid grid-cols-7 gap-2">
                  {WEEK_DAYS.map((d) => (
                    <div key={d.day} className="flex flex-col gap-2">
                      <div className="text-center">
                        <p className="text-[11px] uppercase tracking-wider text-ink-muted font-medium">{d.day}</p>
                        <p className="text-[13px] text-ink font-medium">{d.date}</p>
                      </div>
                      {d.slots.length === 0 ? (
                        <span className="text-[11px] text-ink-faint text-center py-2">—</span>
                      ) : (
                        d.slots.map((slot) => {
                          const isSelected = selectedSlot?.day === d.day && selectedSlot?.time === slot;
                          return (
                            <motion.button
                              key={slot}
                              onClick={() => setSelectedSlot({ day: d.day, time: slot })}
                              className={`relative text-[12px] py-2 rounded-lg font-medium transition-colors ${
                                isSelected
                                  ? "bg-ink text-warm-white"
                                  : "text-ink-muted hover:text-ink"
                              }`}
                              animate={isSelected ? { scale: 1.05 } : { scale: 1, opacity: selectedSlot ? 0.6 : 1 }}
                              whileHover={{ scale: 1.05, opacity: 1 }}
                            >
                              {slot}
                              {!isSelected && (
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 80 32">
                                  <path d="M 4 4 C 20 2, 60 3, 76 5 C 78 10, 77 22, 75 28 C 60 30, 20 29, 4 27 C 2 22, 3 10, 4 4" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-ink/[0.08]" vectorEffect="non-scaling-stroke" />
                                </svg>
                              )}
                            </motion.button>
                          );
                        })
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex justify-end">
                  <SketchButton
                    variant="primary"
                    onClick={() => selectedSlot && setStep(1)}
                    className={`!text-[14px] !px-8 !py-2.5 ${!selectedSlot ? "opacity-40 pointer-events-none" : ""}`}
                  >
                    Continue
                  </SketchButton>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Set Intention ────────────── */}
            {step === 1 && (
              <motion.div
                key="step2"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-[24px] font-bold text-ink mb-8">Set your intention</h2>

                <SketchCard className="p-6 mb-8">
                  <p className="text-[14px] text-ink-muted">
                    {selectedSlot?.day}, {selectedSlot?.time}
                  </p>
                </SketchCard>

                <div className="relative mb-6">
                  <textarea
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                    placeholder="What would you like to focus on? The more specific you are, the better your session will be."
                    className="w-full min-h-[120px] p-5 bg-transparent text-ink text-[15px] font-medium placeholder:text-ink-muted/50 outline-none resize-y leading-relaxed"
                  />
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 120">
                    <path d="M 6 6 C 100 3, 300 4, 394 6 C 396 30, 395 90, 393 114 C 300 117, 100 116, 6 114 C 4 90, 5 30, 6 6" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/[0.12]" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Duration selector */}
                <div className="flex gap-3 mb-6">
                  {([30, 60] as const).map((d) => (
                    <SketchButton
                      key={d}
                      variant={duration === d ? "primary" : "ghost"}
                      onClick={() => setDuration(d)}
                      className="!text-[14px] !px-6 !py-2"
                    >
                      {d} min
                    </SketchButton>
                  ))}
                </div>

                <p className="font-hand font-bold text-[32px] text-ink mb-8">
                  ₹{price.toLocaleString()}
                </p>

                <div className="flex gap-3 justify-between">
                  <SketchButton variant="ghost" onClick={() => setStep(0)} className="!text-[14px] !px-6 !py-2.5">
                    Back
                  </SketchButton>
                  <SketchButton variant="primary" onClick={() => setStep(2)} className="!text-[14px] !px-8 !py-2.5">
                    Continue
                  </SketchButton>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Complete ─────────────────── */}
            {step === 2 && (
              <motion.div
                key="step3"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-[24px] font-bold text-ink mb-8">Complete booking</h2>

                {/* Order summary */}
                <SketchCard className="p-6 mb-8">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between">
                      <span className="text-[14px] text-ink-muted">Teacher</span>
                      <span className="text-[14px] text-ink font-medium">{TEACHER.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[14px] text-ink-muted">Date & time</span>
                      <span className="text-[14px] text-ink font-medium">{selectedSlot?.day}, {selectedSlot?.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[14px] text-ink-muted">Duration</span>
                      <span className="text-[14px] text-ink font-medium">{duration} minutes</span>
                    </div>

                    <svg className="w-full h-[2px] my-2" preserveAspectRatio="none" viewBox="0 0 200 2">
                      <path d="M 0 1 Q 50 0, 100 1 T 200 1" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-ink/[0.08]" vectorEffect="non-scaling-stroke" />
                    </svg>

                    <div className="flex justify-between">
                      <span className="text-[14px] text-ink-muted">Session fee</span>
                      <span className="text-[14px] text-ink">₹{price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[14px] text-ink-muted">Platform fee</span>
                      <span className="text-[14px] text-ink-muted">₹{fee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-[20px] font-bold text-ink">Total</span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-hand font-bold text-[24px] text-ink">₹{(price + fee).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </SketchCard>

                {/* Payment placeholder */}
                <div className="relative h-[200px] mb-4 flex items-center justify-center">
                  <p className="text-ink-muted text-[14px]">Stripe card element will appear here</p>
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 200">
                    <path d="M 6 6 C 100 3, 300 4, 394 6 C 396 50, 395 150, 393 194 C 300 197, 100 196, 6 194 C 4 150, 5 50, 6 6" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/[0.1]" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeDasharray="8 6" />
                  </svg>
                </div>

                <div className="flex items-center gap-2 mb-6 justify-center">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="w-3.5 h-3.5 text-ink-faint">
                    <rect x="3" y="6" width="10" height="8" rx="1.5" />
                    <path d="M 5 6 L 5 4 A 3 3 0 0 1 11 4 L 11 6" />
                  </svg>
                  <span className="text-[12px] text-ink-faint">Secured by Stripe</span>
                </div>

                <SketchButton variant="primary" className="w-full !text-[15px] !py-3">
                  Confirm and book · ₹{(price + fee).toLocaleString()}
                </SketchButton>

                <p className="text-[11px] text-ink-faint text-center mt-3">
                  You won&apos;t be charged until the session begins.
                </p>

                <div className="flex justify-start mt-6">
                  <SketchButton variant="ghost" onClick={() => setStep(1)} className="!text-[14px] !px-6 !py-2">
                    Back
                  </SketchButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Persistent Teacher Summary (desktop) ── */}
        <div className="hidden lg:block w-[280px] flex-shrink-0">
          <SketchCard tilt={1} className="p-6 sticky top-24">
            <AvatarSVG seed={TEACHER.name} size={48} className="mb-3" />
            <h3 className="text-[16px] font-bold text-ink">{TEACHER.name}</h3>
            <p className="text-[13px] text-ink-muted">{TEACHER.specialty}</p>
            {selectedSlot && (
              <div className="mt-4 pt-4 border-t border-ink/[0.06]">
                <p className="text-[13px] text-ink-muted">{selectedSlot.day}</p>
                <p className="text-[14px] font-medium text-ink">{selectedSlot.time}</p>
              </div>
            )}
          </SketchCard>
        </div>
      </div>
    </div>
  );
}
