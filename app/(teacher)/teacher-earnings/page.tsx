/* Teacher Earnings — Maya's financial dashboard with animated bar chart. */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { SketchCard } from "@/components/ui/SketchCard";
import { SketchButton } from "@/components/ui/SketchButton";
import { SketchDivider } from "@/components/ui/SketchDivider";
import { EarningsBar } from "@/components/teacher/EarningsBar";
import { TransactionRow } from "@/components/teacher/TransactionRow";

const STATS = [
  { value: "₹11,200", label: "This month" },
  { value: "₹67,400", label: "All time" },
  { value: "₹8,900", label: "Pending payout" },
  { value: "₹2,300", label: "Next payout in 3 days" },
];

const MONTHLY_DATA = [
  { month: "Nov", amount: 6200 },
  { month: "Dec", amount: 8100 },
  { month: "Jan", amount: 9400 },
  { month: "Feb", amount: 7800 },
  { month: "Mar", amount: 10100 },
  { month: "Apr", amount: 11200 },
];

const TRANSACTIONS: { topic: string; learner: string; date: string; amount: number; status: "Paid" | "Pending" }[] = [
  { topic: "UX Research Fundamentals", learner: "Aayush Bharti", date: "Apr 9", amount: 1200, status: "Paid" },
  { topic: "Usability Testing Methods", learner: "Sneha Kapoor", date: "Apr 7", amount: 900, status: "Paid" },
  { topic: "Design Systems Overview", learner: "Ravi Shankar", date: "Apr 5", amount: 1200, status: "Paid" },
  { topic: "UX Research Fundamentals", learner: "Priya Mehta", date: "Apr 3", amount: 1200, status: "Paid" },
  { topic: "Research Repository Setup", learner: "Priya Mehta", date: "Mar 28", amount: 900, status: "Paid" },
  { topic: "Usability Testing Methods", learner: "Sneha Kapoor", date: "Mar 25", amount: 900, status: "Paid" },
  { topic: "UX Research Fundamentals", learner: "Karan Verma", date: "Mar 20", amount: 1200, status: "Paid" },
  { topic: "Design Systems Overview", learner: "Ravi Shankar", date: "Mar 18", amount: 1200, status: "Pending" },
];

export default function TeacherEarningsPage() {
  const maxAmount = Math.max(...MONTHLY_DATA.map((d) => d.amount));
  const barWidth = 48;
  const chartMaxHeight = 160;

  const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const },
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 pb-24">
      <motion.div className="pt-12 pb-8" {...fadeUp}>
        <h1 className="text-[32px] font-bold text-ink leading-tight">
          Your <span className="font-hand inline-block" style={{ transform: "rotate(-2deg)" }}>earnings</span>
        </h1>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" as const }}
      >
        {STATS.map((stat, i) => (
          <SketchCard key={i} className="px-5 py-4">
            <span className="font-hand font-bold text-[28px] text-ink leading-none block">{stat.value}</span>
            <span className="text-[13px] text-ink-muted mt-1 block">{stat.label}</span>
          </SketchCard>
        ))}
      </motion.div>

      {/* Bar Chart */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" as const }}
      >
        <h3 className="text-[20px] font-bold text-ink mb-5">
          Monthly <span className="font-hand" style={{ transform: "rotate(-1deg)", display: "inline-block" }}>overview</span>
        </h3>
        <SketchCard className="p-6 overflow-hidden">
          <svg
            viewBox={`0 0 ${MONTHLY_DATA.length * (barWidth + 16) + 60} ${chartMaxHeight + 60}`}
            className="w-full"
            style={{ maxHeight: "260px" }}
          >
            {/* Baseline */}
            <line
              x1="30"
              y1={chartMaxHeight + 20}
              x2={MONTHLY_DATA.length * (barWidth + 16) + 50}
              y2={chartMaxHeight + 20}
              stroke="currentColor"
              strokeWidth="1"
              className="text-ink/[0.08]"
            />
            {MONTHLY_DATA.map((d, i) => (
              <EarningsBar
                key={d.month}
                amount={d.amount}
                maxAmount={maxAmount}
                label={d.month}
                index={i}
                barWidth={barWidth}
                maxHeight={chartMaxHeight}
              />
            ))}
          </svg>
        </SketchCard>
      </motion.div>

      <SketchDivider />

      {/* Transactions */}
      <motion.div
        className="mb-12 mt-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" as const }}
      >
        <h3 className="text-[20px] font-bold text-ink mb-5">
          Recent <span className="font-hand" style={{ transform: "rotate(-1deg)", display: "inline-block" }}>transactions</span>
        </h3>
        <div className="flex flex-col">
          {TRANSACTIONS.map((tx, i) => (
            <React.Fragment key={i}>
              <TransactionRow {...tx} />
              {i < TRANSACTIONS.length - 1 && <SketchDivider />}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      <SketchDivider />

      {/* Payout Settings */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" as const }}
      >
        <h3 className="text-[20px] font-bold text-ink mb-5">
          Payout <span className="font-hand" style={{ transform: "rotate(-1deg)", display: "inline-block" }}>settings</span>
        </h3>
        <SketchCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-ink inline-block" />
            <span className="text-[15px] font-medium text-ink">Stripe Connect — Connected</span>
          </div>
          <div className="flex flex-col gap-2 text-[14px] text-ink-muted ml-5">
            <span>Bank account ending in 4242</span>
            <span>Payout schedule: Weekly every Monday</span>
          </div>
          <div className="flex gap-3 mt-6 flex-wrap">
            <SketchButton variant="ghost" className="!text-[13px] !px-4 !py-2">Manage payout settings</SketchButton>
            <SketchButton variant="ghost" className="!text-[13px] !px-4 !py-2">View full transaction history</SketchButton>
          </div>
        </SketchCard>
      </motion.div>
    </div>
  );
}
