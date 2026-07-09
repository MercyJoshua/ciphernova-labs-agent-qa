"use client";

import { motion, type Variants } from "motion/react";

const tiers = [
  {
    name: "Local",
    price: "Free",
    per: "for demos",
    blurb: "A quick solo check for one agent endpoint and a clean score.",
    features: [
      "One endpoint",
      "Five scenario types",
      "Reliability score",
      "Transcript export",
    ],
    cta: "Try it",
    featured: false,
  },
  {
    name: "Team",
    price: "Fast",
    per: "parallel",
    blurb: "Run the full harness with shared reports for the team.",
    features: [
      "Parallel runs",
      "Gemma judging",
      "Failure breakdowns",
      "CI gates",
      "JSON export",
    ],
    cta: "Use this",
    featured: true,
    tag: "Recommended",
  },
  {
    name: "Private",
    price: "Custom",
    per: "",
    blurb: "Self-hosted, single-tenant, and ready for private workflows.",
    features: [
      "VPC deployment",
      "Custom policies",
      "Auth hooks",
      "Dedicated support",
    ],
    cta: "Talk to us",
    featured: false,
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
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-3.5 h-3.5 shrink-0 mt-1 fill-none"
      stroke="var(--accent)"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 12 10 18 20 6" />
    </svg>
  );
}

export default function Pricing() {
  return (
    <motion.section
      id="pricing"
      className="w-full max-w-[1600px] mx-auto px-10 py-25 max-[768px]:px-5 max-[768px]:py-17.5"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.25 }}
    >
      <div className="flex flex-col items-center text-center mb-16">
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 text-[0.75rem] text-[--text-muted] uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full bg-white/3 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[--accent-pink] shadow-[0_0_8px_var(--accent-pink)]" />
          Plans
        </motion.div>
        <motion.h2 variants={itemVariants} className="xero-section-title font-light leading-[1.1] tracking-tight m-0 mb-4 max-w-190">
          Pick the right lane.
          <br />
          <strong className="xero-gradient-text font-normal">
            Ship with proof.
          </strong>
        </motion.h2>
        <motion.p variants={itemVariants} className="text-[0.95rem] text-white/45 max-w-135 leading-[1.6] m-0">
          From a local demo to a private deployment, every plan gives you the same scoring pipeline.
        </motion.p>
      </div>

      <div className="grid grid-cols-3 gap-4 max-[980px]:grid-cols-2 max-[768px]:grid-cols-1">
        {tiers.map((t, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="xero-card relative rounded-[20px] flex flex-col p-8"
          >
            {t.featured && (
              <>
                {/* gradient border */}
                <span className="xero-featured-border absolute inset-0 rounded-[20px] pointer-events-none" />
                {/* inner glow */}
                <span className="xero-featured-glow absolute inset-0 rounded-[20px] pointer-events-none" />
              </>
            )}

            {t.tag && (
              <span
                className="absolute top-4.5 right-4.5 text-[0.65rem] tracking-[0.14em] uppercase text-[--accent] px-2.5 py-1 rounded-full"
              >
                {t.tag}
              </span>
            )}

            <div className="text-[0.85rem] font-medium text-[--text-muted] mb-4.5 uppercase tracking-[0.04em] relative">
              {t.name}
            </div>
            <div className="flex items-baseline gap-1.5 mb-1.5 relative">
              <span className="text-5xl font-light tracking-[-0.03em] leading-none max-[480px]:text-4xl">
                {t.price}
              </span>
              {t.per && (
                <span className="text-[0.8rem] text-[--text-muted]">{t.per}</span>
              )}
            </div>
            <p className="text-[0.85rem] text-white/45 mb-7 leading-normal relative">
              {t.blurb}
            </p>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5 mb-7 relative">
              {t.features.map((f, j) => (
                <li key={j} className="flex items-start gap-2.5 text-[0.85rem] text-white/70">
                  <CheckIcon />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              className={`mt-auto flex justify-center py-2.5 px-5 rounded-full text-[0.85rem] font-medium cursor-pointer transition-all relative max-[480px]:w-full ${t.featured ? "xero-btn-featured" : "xero-btn-default"}`}
            >
              {t.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
