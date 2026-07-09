"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4 shrink-0 mt-0.5 fill-none"
      stroke="var(--accent)"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 12 10 18 20 6" />
    </svg>
  );
}

const CODE_HTML = `<span class="tok-com">// spin up a pre-flight run in one call</span>
<span class="tok-key">import</span> { preflight } <span class="tok-key">from</span> <span class="tok-str">"@pre-flight/check"</span>;

<span class="tok-key">const</span> report = <span class="tok-key">await</span> <span class="tok-fn">preflight</span>({
  endpoint: <span class="tok-str">"https://agent.example.com/chat"</span>,
  description: <span class="tok-str">"Support agent for booking and refunds"</span>,
  scenarios: [<span class="tok-str">"normal"</span>, <span class="tok-str">"edge"</span>, <span class="tok-str">"prompt_injection"</span>],
  judge: <span class="tok-str">"gemma"</span>,
});

<span class="tok-com">// review the score, failure reasons, and transcripts</span>
<span class="tok-key">console</span>.<span class="tok-fn">log</span>(report.score, report.failures, report.transcripts);`;

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

export default function Showcase() {
  return (
    <motion.section
      id="runs"
      className="w-full max-w-[1600px] mx-auto px-10 py-25 max-[768px]:px-5 max-[768px]:py-17.5"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.25 }}
    >
      <motion.div
        className="xero-card relative w-full rounded-[20px] overflow-hidden p-15 grid grid-cols-[1fr_1.1fr] gap-14 items-center max-[980px]:grid-cols-1 max-[980px]:gap-8 max-[768px]:p-8"
        variants={itemVariants}
      >
        {/* Copy */}
        <div>
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 text-[0.75rem] text-[--text-muted] uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full bg-white/3 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[--accent-pink] shadow-[0_0_8px_var(--accent-pink)]" />
            Developer workflow
          </motion.div>
          <motion.h3 variants={itemVariants} className="xero-section-title-md font-light leading-[1.15] tracking-tight mt-4 mb-4">
            Point it at any agent,
            <br />
            <strong className="xero-gradient-text font-normal">
              keep your stack.
            </strong>
          </motion.h3>
          <motion.p variants={itemVariants} className="text-[0.9rem] text-white/45 leading-[1.65] mb-7 max-w-110">
            One endpoint and a short description. Preflight runs the conversations, scores the transcripts, and shows you what broke.
          </motion.p>
          <motion.ul variants={sectionVariants} className="list-none p-0 m-0 flex flex-col gap-3 mb-8">
            {[
              "Normal, edge-case, ambiguity, injection, and attack-intent scenarios",
              "Parallel runs across any HTTP agent endpoint",
              "Gemma scoring with reliability breakdowns and transcripts",
            ].map((item, i) => (
              <motion.li key={i} variants={itemVariants} className="flex items-start gap-3 text-[0.88rem] text-white/70">
                <CheckIcon />
                <span>{item}</span>
              </motion.li>
            ))}
          </motion.ul>
          <motion.div variants={itemVariants}>
            <Link
            href="/submit"
            className="inline-block bg-white text-[#0a0a0f] px-8 py-3 rounded-full font-semibold text-[0.9rem] transition-all hover:opacity-90 hover:-translate-y-px"
          >
            See the workflow
            </Link>
          </motion.div>
        </div>

        {/* Code panel */}
        <motion.div variants={itemVariants} className="xero-code-panel relative rounded-[14px] overflow-hidden text-[0.78rem] leading-[1.7]">
          {/* gradient border overlay */}
          <span className="xero-code-border absolute pointer-events-none rounded-[14px]" />
          <div className="xero-code-tab-bar flex items-center gap-2 px-3.5 py-3">
            <span className="xero-code-dot w-2.75 h-2.75 rounded-full" />
            <span className="xero-code-dot w-2.75 h-2.75  rounded-full" />
            <span className="xero-code-dot w-2.75 h-2.75  rounded-full" />
            <span className="xero-code-tab ml-3.5 px-3 py-1 rounded-md text-[0.7rem] text-white/60">
              preflight.ts
            </span>
          </div>
          <pre
            className="p-[18px_22px_22px] text-white/75 whitespace-pre overflow-x-auto m-0"
            dangerouslySetInnerHTML={{ __html: CODE_HTML }}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
