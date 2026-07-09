"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";

const ITEMS = [
  {
    title: "Normal + adversarial scenarios",
    body: "Generate happy-path, edge-case, ambiguity, prompt injection, and attack-intent conversations automatically.",
    visual: <KeyVaultVisual />,
  },
  {
    title: "Parallel execution",
    body: "Run multiple scenarios at once so feedback stays fast, even when the target agent needs several turns.",
    visual: <AnnotateVisual />,
  },
  {
    title: "Judge scoring",
    body: "Let Gemma score task success, hallucination, instruction-following, safety violations, and injection success.",
    visual: <PipelineVisual />,
  },
  {
    title: "Failure breakdowns",
    body: "Turn every transcript into one reliability score plus a clear reason for each miss.",
    visual: <FieldControlVisual />,
  },
  {
    title: "Endpoint agnostic",
    body: "Point it at any chat or tool-using agent with a URL and a short description.",
    visual: <ModelVisual />,
  },
  {
    title: "Exportable reports",
    body: "Export transcripts and summaries so teams can gate releases before they merge or deploy.",
    visual: <AuditVisual />,
  },
];

function KeyVaultVisual() {
  return (
    <div className="xero-feat-visual-inner flex flex-col justify-center items-center gap-4">
      <div className="w-16 h-16 rounded-full xero-node flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 stroke-white/60 fill-none"
          strokeWidth={1.5}
          strokeLinecap="round"
        >
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      </div>
      <div className="flex flex-col gap-1.5 w-full max-w-50">
        {["Normal task", "Edge case", "Prompt injection"].map(
          (algo) => (
            <div
              key={algo}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/4 border border-white/6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,.8)] shrink-0" />
              <span className="text-[11px] text-white/50 font-mono">
                {algo}
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function AnnotateVisual() {
  return (
    <div className="xero-feat-visual-inner flex flex-col gap-2.5 px-4 justify-center">
      {[
        { col: "task_success", tag: "score", color: "text-emerald-300 bg-emerald-300/10 border-emerald-300/20" },
        { col: "hallucination", tag: "flag", color: "text-yellow-300 bg-yellow-300/10 border-yellow-300/20" },
        { col: "instruction_following", tag: "score", color: "text-blue-300 bg-blue-300/10 border-blue-300/20" },
        { col: "injection_success", tag: "flag", color: "text-teal-300 bg-teal-300/10 border-teal-300/20" },
        { col: "safety", tag: "flag", color: "text-[--accent-pink] bg-[--accent-pink]/10 border-[--accent-pink]/20" },
      ].map((row) => (
        <div
          key={row.col}
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/3 border border-white/6"
        >
          <span className="text-[12px] text-white/55 font-mono">{row.col}</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${row.color}`}
          >
            {row.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

function PipelineVisual() {
  const steps = ["Generate", "Run", "Judge", "Aggregate"];
  return (
    <div className="xero-feat-visual-inner flex items-center justify-center gap-0 px-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-xl xero-node flex items-center justify-center">
              <span className="text-[10px] text-white/50 font-mono">
                0{i + 1}
              </span>
            </div>
            <span className="text-[10px] text-white/35">{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className="w-6 h-px bg-white/10 mx-1 mb-4" />
          )}
        </div>
      ))}
    </div>
  );
}

function FieldControlVisual() {
  const roles = [
    { role: "normal", can: ["pass"] },
    { role: "ambiguous", can: ["warn"] },
    { role: "edge", can: ["warn"] },
    { role: "prompt_injection", can: ["block"] },
    { role: "attack_intent", can: ["warn"] },
  ];
  return (
    <div className="xero-feat-visual-inner flex flex-col justify-center gap-2 px-3">
      {roles.map((r) => (
        <div
          key={r.role}
          className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/3 border border-white/6"
        >
          <span className="text-[12px] text-white/50 font-mono">{r.role}</span>
          <div className="flex gap-1">
            {["pass", "warn", "block"].map((p) => (
              <span
                key={p}
                className={`text-[10px] px-1.5 py-0.5 rounded ${
                  r.can.includes(p)
                    ? "bg-emerald-400/15 text-emerald-400"
                    : "bg-white/3 text-white/15"
                }`}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ModelVisual() {
  const models = ["Target agent", "Gemma", "Report", "CI"];
  return (
    <div className="xero-feat-visual-inner flex flex-col items-center gap-3 justify-center">
      <div className="w-12 h-12 rounded-2xl xero-node flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 stroke-white/50 fill-none"
          strokeWidth={1.5}
          strokeLinecap="round"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-1.5 w-full max-w-45">
        {models.map((m) => (
          <div
            key={m}
            className="px-2 py-1.5 rounded-lg border border-white/6 text-center"
          >
            <span className="text-[10px] text-white/40">{m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditVisual() {
  const events = [
    { time: "09:41:02", event: "scenario.generated", who: "sys" },
    { time: "09:41:18", event: "run.started", who: "runner" },
    { time: "09:42:05", event: "judge.scored", who: "gemma" },
    { time: "09:42:11", event: "report.exported", who: "ci" },
  ];
  return (
    <div className="xero-feat-visual-inner flex flex-col justify-center gap-1.5 px-3">
      {events.map((e) => (
        <div
          key={e.time}
          className="flex items-center gap-2.5 text-[11px] px-3 py-2 rounded-lg bg-white/3 border border-white/4"
        >
          <span className="text-white/25 font-mono tabular-nums shrink-0">
            {e.time}
          </span>
          <span className="text-white/55 font-mono flex-1">{e.event}</span>
          <span className="text-white/30 ml-auto">{e.who}</span>
        </div>
      ))}
    </div>
  );
}

function Eyebrow({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-[0.75rem] text-[--text-muted] uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full bg-white/3 mb-6">
      <span className="w-1.5 h-1.5 rounded-full bg-[--accent-pink] shadow-[0_0_8px_var(--accent-pink)]" />
      {label}
    </div>
  );
}

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

export default function Features() {
  const [active, setActive] = useState(0);

  return (
    <motion.section
      id="method"
      className="w-full max-w-[1600px] mx-auto px-10 py-25 max-[768px]:px-5 max-[768px]:py-17.5"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.25 }}
    >
      <div className="flex flex-col items-center text-center mb-16">
        <motion.div variants={itemVariants}>
          <Eyebrow label="What it checks" />
        </motion.div>
        <motion.h2 variants={itemVariants} className="xero-section-title font-light leading-[1.1] tracking-tight mb-4 m-0 max-w-190">
          One harness.
          <br />
          <strong className="xero-gradient-text font-normal">
            Every failure mode.
          </strong>
        </motion.h2>
        <motion.p variants={itemVariants} className="text-[0.95rem] text-white/45 max-w-135 leading-[1.6] m-0">
          Preflight runs normal and adversarial conversations in parallel,
          then turns the transcripts into a reliability score and a failure report.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-w-275 mx-auto">
        {/* Accordion list */}
        <div className="flex flex-col">
          {ITEMS.map((item, i) => (
            <motion.button
              key={i}
              variants={itemVariants}
              onClick={() => setActive(i)}
              className="xero-feat-row text-left w-full relative"
            >
              {active === i && <span className="xero-feat-active-bar" />}
              <div
                className={`px-5 py-5 border-b border-white/[0.07] transition-colors duration-200 ${active === i ? "bg-white/3" : "hover:bg-white/2"}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className={`text-[0.95rem] font-medium tracking-tight transition-colors duration-200 ${active === i ? "text-white" : "text-white/55"}`}
                  >
                    {item.title}
                  </span>
                  <span
                    className={`text-[11px] tabular-nums shrink-0 transition-colors duration-200 ${active === i ? "text-[--accent-pink]" : "text-white/20"}`}
                  >
                    0{i + 1}
                  </span>
                </div>
                <div
                  className={`xero-feat-body-wrap ${active === i ? "xero-feat-body-open" : ""}`}
                >
                  <div>
                    <p className="text-[0.85rem] text-white/45 leading-[1.6] pt-2.5 pr-8">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Visual panel */}
        <motion.div className="lg:sticky lg:top-24 self-start" variants={itemVariants}>
          <div className="xero-feat-visual-panel min-h-90 max-[768px]:min-h-75 max-[480px]:min-h-65 flex items-center justify-center relative overflow-hidden">
            <div className="xero-feat-panel-glow absolute inset-0 pointer-events-none" />
            <div className="relative w-full py-10">
              {ITEMS.map((item, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                >
                  {item.visual}
                </div>
              ))}
              {/* keep layout height */}
              <div className="invisible py-10">{ITEMS[0].visual}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
