"use client";

import { motion, type Variants } from "motion/react";

const items = [
  {
    q: "Where do the test runs go?",
    a: "They stay in memory or SQLite, depending on how you wire the backend. You can keep the harness lightweight for hackathon demos.",
  },
  {
    q: "What kinds of agents can I test?",
    a: "Any HTTP-based chat or tool-using agent with an endpoint and a short description of the task it should handle.",
  },
  {
    q: "How does the scoring work?",
    a: "Gemma scores task success, hallucination, instruction-following, safety violations, and injection success, then the backend rolls that into a 0-100 reliability score.",
  },
  {
    q: "Can the runs happen in parallel?",
    a: "Yes. Scenarios are designed to execute at the same time so the feedback loop stays fast.",
  },
  {
    q: "Is this meant for CI?",
    a: "Yes. The output is designed to gate merges or releases with a reliability score, transcripts, and a failure breakdown.",
  },
];

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function FAQ() {
  return (
    <motion.section
      id="faq"
      className="w-full max-w-[1600px] mx-auto px-10 py-25 max-[768px]:px-5 max-[768px]:py-17.5"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.25 }}
    >
      <div className="flex flex-col items-center text-center mb-16">
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 text-[0.75rem] text-[--text-muted] uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full bg-white/3 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[--accent-pink] shadow-[0_0_8px_var(--accent-pink)]" />
          Questions
        </motion.div>
        <motion.h2 variants={itemVariants} className="xero-section-title font-light leading-[1.1] tracking-tight m-0">
          Answers, before{" "}
          <strong className="font-normal xero-gradient-text">
            you run.
          </strong>
        </motion.h2>
      </div>

      <div className="max-w-205 mx-auto w-full">
        {items.map((it, i) => (
          <motion.details
            key={i}
            className="group"
            variants={itemVariants}
          >
            <summary className="w-full list-none text-[--text] py-5.5 px-1 text-[0.98rem] tracking-[-0.005em] flex items-center justify-between cursor-pointer gap-6 [&::-webkit-details-marker]:hidden">
              <span>{it.q}</span>
              <svg
                viewBox="0 0 24 24"
                className="w-4.5 h-4.5 shrink-0 fill-none transition-transform duration-250 group-open:rotate-180"
                stroke="var(--text-muted)"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <div className="faq-answer open text-[0.88rem] text-white/50 leading-[1.65]">
              {it.a}
            </div>
          </motion.details>
        ))}
      </div>
    </motion.section>
  );
}
