"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import Header from "@/components/templates/xero/sections/header";

const scenarioChips = ["Normal task", "Edge case", "Ambiguity", "Prompt injection", "Attack intent"];

const previewChecks = [
  {
    title: "Endpoint validation",
    body: "We verify the agent URL, check it is reachable, and prepare a multi-turn test session.",
  },
  {
    title: "Scenario generation",
    body: "A mix of happy-path and adversarial conversations is generated from your description.",
  },
  {
    title: "Judge pass",
    body: "Gemma scores every transcript and produces a reliability score plus failure breakdown.",
  },
];

export default function SubmitAgentPage() {
  const [agentUrl, setAgentUrl] = useState("https://");
  const [description, setDescription] = useState(
    "A support agent that helps users with account questions, bookings, and refunds.",
  );

  return (
    <>
      <Header mode="submit" />
      <main className="w-full max-w-[1600px] mx-auto px-3.5 pb-8 pt-4 md:px-6 md:pb-10 md:pt-6">
        <div className="xero-card relative overflow-hidden rounded-[20px] px-6 py-6 md:px-10 md:py-8">
        <div className="xero-hero-arc absolute inset-0 pointer-events-none z-0" />
        <div className="xero-hero-grid absolute inset-0 pointer-events-none z-0" />

        <div className="relative z-1 flex flex-col gap-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[0.72rem] text-[--text-muted] uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full bg-white/3 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[--accent-pink] shadow-[0_0_8px_var(--accent-pink)]" />
                Submit your agent
              </div>
              <h1 className="xero-section-title-lg font-light leading-[1.02] tracking-tight m-0 max-w-190">
                Add the endpoint.
                <br />
                <strong className="xero-gradient-text font-normal">Describe the job. Run the pre-flight.</strong>
              </h1>
            </div>

            <Link
              href="/"
              className="hidden md:inline-flex items-center justify-center rounded-full bg-white/6 px-5 py-3 text-[0.88rem] font-medium text-[--text] transition-all hover:bg-white/12"
            >
              Back to landing
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.12fr_0.88fr]">
            <section className="xero-card rounded-[20px] p-6 md:p-8 border border-white/5">
              <div className="flex items-center justify-between gap-4 mb-7">
                <div className="flex items-center gap-3">
                  <div className="xero-node flex h-11 w-11 items-center justify-center rounded-full">
                    <Bot className="h-5 w-5 text-white/70" />
                  </div>
                  <div>
                    <div className="text-[0.9rem] font-medium text-[--text]">Target agent</div>
                    <div className="text-[0.78rem] text-[--text-muted]">The endpoint the harness will stress-test first.</div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/8 bg-white/3 px-3 py-1.5 text-[0.75rem] text-white/55">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Ready for CI
                </div>
              </div>

              <div className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-[0.78rem] uppercase tracking-[0.14em] text-[--text-muted]">Agent URL</span>
                  <div className="xero-node rounded-2xl p-3 transition-transform duration-200 focus-within:scale-[1.005]">
                    <input
                      value={agentUrl}
                      onChange={(event) => setAgentUrl(event.target.value)}
                      placeholder="https://your-agent.example.com/chat"
                      className="w-full border-0 bg-transparent text-[0.95rem] text-[--text] outline-none placeholder:text-white/25"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-[0.78rem] uppercase tracking-[0.14em] text-[--text-muted]">Agent description</span>
                  <div className="xero-node rounded-2xl p-3 transition-transform duration-200 focus-within:scale-[1.005]">
                    <textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      rows={7}
                      placeholder="Describe what the agent does, who uses it, and what a good response looks like."
                      className="w-full resize-none border-0 bg-transparent text-[0.95rem] leading-[1.6] text-[--text] outline-none placeholder:text-white/25"
                    />
                  </div>
                </label>

                <div className="flex flex-wrap gap-2.5">
                  {scenarioChips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-white/10 bg-white/3 px-3 py-1 text-[0.76rem] text-white/60"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href="/results" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[0.9rem] font-semibold text-[#0a0a0f] transition-all hover:opacity-90 hover:-translate-y-px">
                    Start pre-flight run
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button className="inline-flex items-center rounded-full bg-white/6 px-6 py-3 text-[0.9rem] font-medium text-[--text] transition-all hover:bg-white/12">
                    Save draft
                  </button>
                </div>
              </div>
            </section>

            <aside className="flex flex-col gap-4">
              <section className="xero-card rounded-[20px] p-6 md:p-8 border border-white/5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="xero-node flex h-11 w-11 items-center justify-center rounded-full">
                    <Sparkles className="h-5 w-5 text-white/70" />
                  </div>
                  <div>
                    <div className="text-[0.9rem] font-medium text-[--text]">What happens next</div>
                    <div className="text-[0.78rem] text-[--text-muted]">Built with the same dark cards and neon accents as the homepage.</div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {previewChecks.map((item, index) => (
                    <div key={item.title} className="rounded-2xl border border-white/6 bg-white/3 p-4">
                      <div className="mb-1 flex items-center gap-2 text-[0.76rem] uppercase tracking-[0.14em] text-[--text-muted]">
                        <span className="text-[--accent-pink]">0{index + 1}</span>
                        {item.title}
                      </div>
                      <p className="m-0 text-[0.88rem] leading-[1.6] text-white/55">{item.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="xero-card rounded-[20px] p-6 md:p-8 border border-white/5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="xero-node flex h-11 w-11 items-center justify-center rounded-full">
                    <TerminalSquare className="h-5 w-5 text-white/70" />
                  </div>
                  <div>
                    <div className="text-[0.9rem] font-medium text-[--text]">Run preview</div>
                    <div className="text-[0.78rem] text-[--text-muted]">A quick summary of the report you will get.</div>
                  </div>
                </div>

                <div className="rounded-[16px] border border-white/6 bg-[#08070d] p-4">
                  <div className="mb-3 flex items-center justify-between text-[0.72rem] uppercase tracking-[0.14em] text-[--text-muted]">
                    <span>Report</span>
                    <span className="text-white/35">Draft</span>
                  </div>
                  <div className="space-y-3 text-[0.86rem] text-white/65">
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/3 px-3 py-2">
                      <span>Target</span>
                      <span className="truncate text-white/45">{agentUrl || "https://"}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/3 px-3 py-2">
                      <span>Scenarios</span>
                      <span className="text-white/45">5 parallel tracks</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/3 px-3 py-2">
                      <span>Judge</span>
                      <span className="text-white/45">Gemma</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/3 px-3 py-2">
                      <span>Output</span>
                      <span className="text-white/45">Score + transcript</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-[0.82rem] text-amber-200/90">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  Use this page to present the agent, not to collect production secrets.
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
      </main>
    </>
  );
}
