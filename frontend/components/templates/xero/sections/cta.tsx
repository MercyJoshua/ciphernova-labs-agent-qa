"use client";

import { motion, type Variants } from "motion/react";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function CTA() {
  return (
    <motion.section
      className="xero-card relative w-full max-w-[1600px] mx-auto rounded-[20px] overflow-hidden px-10 py-25 pb-27.5 text-center flex flex-col items-center mb-20 max-[768px]:px-5 max-[768px]:py-17.5 max-[768px]:mb-12"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
    >
      {/* Gradient arc */}
      <div className="xero-cta-arc absolute inset-0 pointer-events-none z-0" />
      {/* Grid */}
      <div className="xero-cta-grid absolute inset-0 pointer-events-none z-0" />

      <motion.div variants={itemVariants} className="relative z-1 inline-flex items-center gap-2 text-[0.75rem] text-[--text-muted] uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full bg-white/3 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-[--accent-pink] shadow-[0_0_8px_var(--accent-pink)]" />
        Ready to run
      </motion.div>

      <motion.h2 variants={itemVariants} className="xero-section-title relative z-1 font-light leading-[1.1] tracking-tight m-0 mb-4 max-w-190">
        Stress-test every release.
        <br />
        <strong className="xero-gradient-text font-normal">
          Ship with confidence.
        </strong>
      </motion.h2>
      <motion.p variants={itemVariants} className="relative z-1 text-white/45 text-[0.95rem] mb-8 max-w-120">
        Turn your agent into something you can measure before users do. Start with a demo run or wire it into CI.
      </motion.p>
      <motion.div variants={itemVariants} className="relative z-1 flex gap-2.5 flex-wrap justify-center">
        <a
          href="/submit"
          className="inline-block bg-white text-[#0a0a0f] px-8 py-3 rounded-full font-semibold text-[0.9rem] transition-all hover:opacity-90 hover:-translate-y-px"
        >
          Start a demo
        </a>
        <a
          href="/submit"
          className="inline-flex items-center px-5.5 py-3 text-[0.9rem] rounded-full bg-white/6 text-[--text] hover:bg-white/12 transition-all"
        >
          See sample report
        </a>
      </motion.div>
    </motion.section>
  );
}
