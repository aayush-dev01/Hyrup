/* Booking flow backed by real teacher + slots + booking mutation. */
"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { SketchButton } from "@/components/ui/SketchButton";
import { SketchCard } from "@/components/ui/SketchCard";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { trpc } from "@/lib/trpc/client";

function money(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function BookingPage({ params }: { params: { teacherId: string } }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [duration, setDuration] = useState<30 | 60>(60);
  const [intention, setIntention] = useState("");
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [slotsUpdatedNotice, setSlotsUpdatedNotice] = useState<string | null>(null);

  const teacherQ = trpc.teachers.getById.useQuery({ teacherId: params.teacherId });
  const slotsQ = trpc.teachers.getAvailableSlots.useQuery({ teacherId: params.teacherId, weekOffset: 0 });
  const bookingM = trpc.bookings.create.useMutation({
    onSuccess: (res) => {
      const name = `${teacherQ.data?.user.firstName ?? ""} ${teacherQ.data?.user.lastName ?? ""}`.trim();
      router.push(
        `/book/${params.teacherId}/success?room=${encodeURIComponent(
          res.roomIdentifier
        )}&teacher=${encodeURIComponent(name)}`
      );
    },
  });

  const groupedSlots = useMemo(() => {
    const arr = slotsQ.data ?? [];
    const map = new Map<string, string[]>();
    for (const iso of arr) {
      const d = new Date(iso);
      const day = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      const curr = map.get(day) ?? [];
      curr.push(iso);
      map.set(day, curr);
    }
    return Array.from(map.entries()).slice(0, 7);
  }, [slotsQ.data]);

  if (teacherQ.isLoading) return <div className="min-h-screen bg-warm-white" />;
  if (!teacherQ.data) return <div className="min-h-screen bg-warm-white p-8">Teacher not found.</div>;

  const teacher = teacherQ.data;
  const teacherName = `${teacher.user.firstName} ${teacher.user.lastName}`.trim();
  const topic = teacher.topics[0]?.name ?? "Session";
  const baseRate = Number(teacher.hourlyRate) || 0;
  const price = duration === 60 ? baseRate : Math.max(1, Math.round(baseRate / 2));
  const fee = Math.round(price * 0.15);

  return (
    <div className="w-full max-w-5xl mx-auto px-6 lg:px-8 py-12 pb-24">
      <div className="mb-12">
        <StepIndicator steps={["Choose time", "Set intention", "Complete"]} currentStep={step} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          {step === 0 && (
            <>
              <h2 className="text-[24px] font-bold text-ink mb-6">Choose your time</h2>
              {slotsUpdatedNotice ? (
                <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-700">
                  {slotsUpdatedNotice}
                </div>
              ) : null}
              {slotsQ.isLoading ? (
                <p className="text-ink-muted">Loading slots…</p>
              ) : groupedSlots.length === 0 ? (
                <p className="text-ink-muted">No available slots this week.</p>
              ) : (
                <div className="space-y-4">
                  {groupedSlots.map(([day, values]) => (
                    <div key={day}>
                      <p className="text-[13px] text-ink-muted mb-2">{day}</p>
                      <div className="flex flex-wrap gap-2">
                        {values.map((iso) => {
                          const selected = selectedSlot === iso;
                          const label = new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
                          return (
                            <button
                              key={iso}
                              onClick={() => setSelectedSlot(iso)}
                              className={`px-3 py-2 rounded-xl text-[13px] ${
                                selected ? "bg-ink text-warm-white" : "bg-ink/[0.04] text-ink hover:bg-ink/[0.08]"
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-8 flex justify-end">
                <SketchButton
                  variant="primary"
                  onClick={() => {
                    if (!selectedSlot) return;
                    setBookingError(null);
                    setSlotsUpdatedNotice(null);
                    setStep(1);
                  }}
                  className={!selectedSlot ? "opacity-50 pointer-events-none" : ""}
                >
                  Continue
                </SketchButton>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-[24px] font-bold text-ink mb-6">Set your intention</h2>
              <textarea
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="What do you want to focus on?"
                className="w-full min-h-[130px] p-4 rounded-2xl border border-ink/10 bg-transparent"
              />
              <div className="mt-4 flex gap-2">
                {[30, 60].map((m) => (
                  <SketchButton key={m} variant={duration === m ? "primary" : "ghost"} onClick={() => setDuration(m as 30 | 60)}>
                    {m} min
                  </SketchButton>
                ))}
              </div>
              <p className="mt-5 text-ink text-lg">{money(price)}</p>
              <div className="mt-8 flex justify-between">
                <SketchButton variant="ghost" onClick={() => setStep(0)}>Back</SketchButton>
                <SketchButton variant="primary" onClick={() => setStep(2)}>Continue</SketchButton>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-[24px] font-bold text-ink mb-6">Complete booking</h2>
              {bookingError ? (
                <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-700">
                  {bookingError}
                </div>
              ) : null}
              <SketchCard className="p-5">
                <div className="space-y-2 text-[14px]">
                  <div className="flex justify-between"><span className="text-ink-muted">Teacher</span><span>{teacherName}</span></div>
                  <div className="flex justify-between"><span className="text-ink-muted">Topic</span><span>{topic}</span></div>
                  <div className="flex justify-between"><span className="text-ink-muted">Time</span><span>{selectedSlot ? new Date(selectedSlot).toLocaleString() : "-"}</span></div>
                  <div className="flex justify-between"><span className="text-ink-muted">Duration</span><span>{duration} min</span></div>
                  <div className="flex justify-between"><span className="text-ink-muted">Session fee</span><span>{money(price)}</span></div>
                  <div className="flex justify-between"><span className="text-ink-muted">Platform fee</span><span>{money(fee)}</span></div>
                  <div className="flex justify-between font-semibold pt-2"><span>Total</span><span>{money(price + fee)}</span></div>
                </div>
              </SketchCard>
              <div className="mt-6 flex justify-between">
                <SketchButton variant="ghost" onClick={() => setStep(1)}>Back</SketchButton>
                <SketchButton
                  variant="primary"
                  onClick={async () => {
                    if (!selectedSlot) return;
                    setBookingError(null);
                    setSlotsUpdatedNotice(null);
                    try {
                      await bookingM.mutateAsync({
                        teacherId: params.teacherId,
                        startTime: new Date(selectedSlot),
                        durationMinutes: duration,
                        notes: intention.trim() || undefined,
                      });
                    } catch (error) {
                      const message =
                        error instanceof Error ? error.message : "Booking failed. Please try again.";
                      if (message.toLowerCase().includes("slot") || message.toLowerCase().includes("conflict")) {
                        setBookingError("That slot was just booked by someone else. Please pick another time.");
                        setStep(0);
                        setSelectedSlot(null);
                        setSlotsUpdatedNotice("Updated slots loaded. Please choose a new time.");
                        void slotsQ.refetch();
                      } else {
                        setBookingError(message);
                      }
                    }
                  }}
                  className={bookingM.isPending ? "opacity-70 pointer-events-none" : ""}
                >
                  {bookingM.isPending ? "Booking..." : "Confirm and book"}
                </SketchButton>
              </div>
            </>
          )}
        </div>

        <div>
          <SketchCard className="p-5 sticky top-24">
            <ProfileAvatar seed={teacherName} imageUrl={teacher.user.imageUrl} size={48} className="mb-3" />
            <h3 className="font-bold text-ink">{teacherName}</h3>
            <p className="text-[13px] text-ink-muted">{topic}</p>
            <p className="mt-3 text-[13px] text-ink-muted">{money(baseRate)} / hour</p>
          </SketchCard>
        </div>
      </div>
    </div>
  );
}
