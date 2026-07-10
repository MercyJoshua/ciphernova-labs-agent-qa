"use client";

import { motion, type Variants } from "motion/react";

const stats = [
  { v: "5", l: "Scenario types" },
  { v: "Parallel", l: "Runs at once" },
  { v: "0-100", l: "Reliability score" },
  { v: "Full", l: "Failure report + transcripts" },
];

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut", staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Metrics() {
  return (
    <motion.section
      className="w-full max-w-[1600px] mx-auto px-10 py-15 max-[768px]:px-5"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.35 }}
    >
      <div className="xero-metrics-grid grid max-[980px]:grid-cols-2 max-[768px]:grid-cols-1">
        {stats.map((s, i) => (
          <motion.div key={i} variants={itemVariants} className="px-7 py-9 text-left">
            <div className="xero-stat-value font-light tracking-[-0.03em] leading-none mb-2.5">
              {s.v}
            </div>
            <div className="text-[0.78rem] text-white/45 tracking-[0.06em]">{s.l}</div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
