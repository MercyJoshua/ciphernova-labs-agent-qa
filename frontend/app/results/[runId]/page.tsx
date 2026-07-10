"use client";

import { use } from "react";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Header from "@/components/templates/xero/sections/header";
import {
  AlertTriangle,
  ArrowLeft,
  CircleAlert,
  CircleCheckBig,
  CircleX,
  Loader2,
  Minus,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import {
  getResults,
  type FinalReport,
  type JudgeVerdict,
  type RunRecord,
} from "@/lib/api";

const POLL_INTERVAL_MS = 3000;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function statusTone(status: string) {
  if (status === "done") return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
  if (status === "running") return "border-amber-400/20 bg-amber-400/10 text-amber-200";
  if (status === "error") return "border-red-400/20 bg-red-400/10 text-red-200";
  return "border-white/10 bg-white/5 text-white/70";
}

function verdictTone(verdict: JudgeVerdict | null) {
  if (!verdict) return "text-white/50";
  if (verdict.failure_type === "none") return "text-emerald-300";
  if (verdict.failure_type === "safety") return "text-red-300";
  return "text-amber-300";
}

function verdictIcon(verdict: JudgeVerdict | null) {
  if (!verdict) return <Minus className="h-4 w-4" />;
  if (verdict.failure_type === "none") return <CircleCheckBig className="h-4 w-4" />;
  if (verdict.failure_type === "safety") return <CircleX className="h-4 w-4" />;
  return <CircleAlert className="h-4 w-4" />;
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="xero-card rounded-[20px] p-6 md:p-7 border border-white/5">
      <div className="xero-stat-value font-light tracking-[-0.03em] leading-none mb-2.5">{value}</div>
      <div className="text-[0.78rem] text-white/45 tracking-[0.06em]">{label}</div>
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/6 bg-white/3 px-4 py-3">
      <div className="text-[0.68rem] uppercase tracking-[0.14em] text-white/38">{label}</div>
      <div className="mt-1 text-[0.92rem] text-white/78">{value}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Loading/polling state UI
// ─────────────────────────────────────────────────────────────────────────────

function PollingState({ status, runId }: { status: string; runId: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-32 text-center">
      <div className="relative">
        <div className="xero-node flex h-20 w-20 items-center justify-center rounded-full">
          <Loader2 className="h-9 w-9 animate-spin text-white/60" />
        </div>
        <span className="absolute -right-1 -top-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[--accent-pink] opacity-50" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-[--accent-pink]" />
        </span>
      </div>
      <div>
        <div className="text-[1.25rem] font-light text-[--text]">
          {status === "pending" ? "Queued…" : "Running tests…"}
        </div>
        <div className="mt-2 text-[0.88rem] text-white/45">
          {status === "pending"
            ? "Your test run is queued and will start shortly."
            : "Generating scenarios, simulating conversations, and judging responses."}
        </div>
        <div className="mt-3 text-[0.75rem] text-white/28 tracking-[0.1em] uppercase">
          Run ID: {runId}
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-4 py-2 text-[0.78rem] text-white/50">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
        Polling for results every 3 seconds…
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Full report UI
// ─────────────────────────────────────────────────────────────────────────────

function ReportView({ report }: { report: FinalReport }) {
  const topFailure = report.top_failures[0];

  return (
    <div className="relative z-1 flex flex-col gap-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-190">
          <div className="inline-flex items-center gap-2 text-[0.72rem] text-[--text-muted] uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full bg-white/3 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[--accent-pink] shadow-[0_0_8px_var(--accent-pink)]" />
            Results report {report.run_id}
          </div>
          <h1 className="xero-section-title-lg font-light leading-[1.02] tracking-tight m-0">
            Reliability score {report.overall_score}.
            <br />
            <strong className="xero-gradient-text font-normal">
              {report.overall_score >= 70
                ? "Your agent passed most scenarios, but the report still has clear failure modes."
                : report.overall_score >= 40
                ? "Several failures detected. Review the breakdown below."
                : "Significant issues found. Your agent needs attention."}
            </strong>
          </h1>
          <p className="mt-4 max-w-150 text-[0.95rem] leading-[1.65] text-white/45">
            The harness ran {report.total_scenarios} scenarios across normal, adversarial, and edge-case
            categories and scored each transcript using an LLM judge.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[0.9rem] font-semibold text-[#0a0a0f] transition-all hover:opacity-90 hover:-translate-y-px"
          >
            <ArrowLeft className="h-4 w-4" />
            New run
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-white/6 px-6 py-3 text-[0.9rem] font-medium text-[--text] transition-all hover:bg-white/12"
          >
            Back home
          </Link>
        </div>
      </div>

      <div className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-[0.78rem] uppercase tracking-[0.14em] ${statusTone(report.status)}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {report.status}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard value={`${report.overall_score}`} label="Overall reliability" />
        <MetricCard value={`${report.total_scenarios}`} label="Scenarios executed" />
        <MetricCard value={formatPercent(report.summary.task_success_rate)} label="Task success rate" />
        <MetricCard value={`${report.summary.safety_violations}`} label="Safety violations" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
        <section className="xero-card rounded-[20px] p-5 md:p-7 border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="xero-node flex h-11 w-11 items-center justify-center rounded-full">
              <TrendingUp className="h-5 w-5 text-white/70" />
            </div>
            <div>
              <div className="text-[0.9rem] font-medium text-[--text]">Scenario breakdown</div>
              <div className="text-[0.78rem] text-[--text-muted]">Click any row to expand the transcript and verdict.</div>
            </div>
          </div>

          <div className="grid gap-3">
            {report.all_results.map((result) => {
              const verdict = result.verdict;
              const score = verdict ? Math.round(Math.max(0, verdict.instruction_following) * 100) : 0;

              return (
                <details
                  key={result.scenario.scenario_id}
                  className="group rounded-2xl border border-white/6 bg-white/3 p-4 transition-colors open:bg-white/5"
                >
                  <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[0.76rem] uppercase tracking-[0.14em] text-white/35">{result.scenario.category}</span>
                        <span className={`flex items-center gap-1 text-[0.78rem] font-medium ${verdictTone(verdict)}`}>
                          {verdictIcon(verdict)}
                          {verdict?.failure_type ?? "pending"}
                        </span>
                      </div>
                      <div className="mt-1 text-[0.95rem] font-medium text-[--text]">{result.scenario.title}</div>
                      <div className="mt-1 line-clamp-1 text-[0.82rem] text-white/45">{result.scenario.initial_message}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[0.72rem] uppercase tracking-[0.14em] text-white/35">Instruction-following</div>
                        <div className="text-[0.95rem] font-semibold text-white">
                          {verdict ? formatPercent(verdict.instruction_following) : "n/a"}
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-full border border-white/10 bg-black/20 flex items-center justify-center text-[0.72rem] text-white/65">
                        {score}
                      </div>
                    </div>
                  </summary>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <KeyValue label="Expected behaviour" value={result.scenario.expected_behaviour} />
                    <KeyValue label="Follow-up strategy" value={result.scenario.follow_up_strategy} />
                    <KeyValue label="Verdict" value={result.verdict ? result.verdict.reasoning : result.error ?? "Waiting for judge output."} />
                    <KeyValue label="Transcript turns" value={`${result.transcript.length} turns`} />
                  </div>

                  <div className="mt-4 grid gap-2 rounded-2xl border border-white/6 bg-[#08070d] p-4 md:grid-cols-2">
                    {result.transcript.slice(0, 2).map((line, index) => (
                      <div key={`${line.role}-${index}`} className="rounded-xl bg-white/3 px-3 py-2.5">
                        <div className="mb-1 text-[0.68rem] uppercase tracking-[0.14em] text-[--text-muted]">{line.role}</div>
                        <p className="m-0 text-[0.84rem] leading-[1.55] text-white/72">{line.content}</p>
                      </div>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        <aside className="flex flex-col gap-4 xl:sticky xl:top-6 self-start">
          <section className="xero-card rounded-[20px] p-5 md:p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-5">
              <div className="xero-node flex h-11 w-11 items-center justify-center rounded-full">
                <ShieldAlert className="h-5 w-5 text-white/70" />
              </div>
              <div>
                <div className="text-[0.9rem] font-medium text-[--text]">Run snapshot</div>
                <div className="text-[0.78rem] text-[--text-muted]">At-a-glance summary.</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <KeyValue label="Score" value={`${report.overall_score}/100`} />
              <KeyValue label="Scenarios" value={`${report.total_scenarios}`} />
              <KeyValue label="Task success" value={formatPercent(report.summary.task_success_rate)} />
              <KeyValue label="Injection rate" value={formatPercent(report.summary.injection_success_rate)} />
              <KeyValue label="Hallucination" value={formatPercent(report.summary.hallucination_rate)} />
              <KeyValue label="Safety violations" value={`${report.summary.safety_violations}`} />
            </div>

            {topFailure && (
              <>
                <div className="mt-4 rounded-2xl border border-white/6 bg-white/3 p-4">
                  <div className="mb-2 text-[0.72rem] uppercase tracking-[0.14em] text-white/40">Top failure</div>
                  <div className="text-[0.92rem] font-medium text-[--text]">{topFailure.scenario_title}</div>
                  <div className="mt-1 text-[0.82rem] text-white/55">{topFailure.reasoning}</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-[0.68rem] uppercase tracking-[0.12em] text-white/45">
                    <span className="rounded-full border border-white/10 px-2 py-0.5">{topFailure.category}</span>
                    <span className="rounded-full border border-white/10 px-2 py-0.5">{topFailure.failure_type}</span>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/6 bg-[#08070d] p-4">
                  <div className="mb-3 text-[0.72rem] uppercase tracking-[0.14em] text-white/40">Transcript preview</div>
                  <div className="space-y-2">
                    {topFailure.transcript.map((line, index) => (
                      <div key={`${line.role}-${index}`} className="rounded-xl bg-white/3 px-3 py-2.5">
                        <div className="mb-1 text-[0.68rem] uppercase tracking-[0.14em] text-[--text-muted]">{line.role}</div>
                        <p className="m-0 text-[0.84rem] leading-[1.55] text-white/72">{line.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-[0.82rem] text-amber-200/90">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {report.summary.safety_violations > 0
                ? "Safety and injection failures are still present in this run."
                : "No critical safety issues detected in this run."}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page — receives runId from the dynamic route segment
// ─────────────────────────────────────────────────────────────────────────────

export default function ResultsPage({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = use(params);

  const [report, setReport] = useState<FinalReport | null>(null);
  const [status, setStatus] = useState<string>("pending");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function poll() {
      try {
        const data = await getResults(runId);

        if ("overall_score" in data) {
          setReport(data as FinalReport);
          setStatus("done");
          if (intervalRef.current) clearInterval(intervalRef.current);
        } else {
          const record = data as RunRecord;
          setStatus(record.status);
          if (record.status === "error") {
            setFetchError(record.error ?? "An unknown error occurred.");
            if (intervalRef.current) clearInterval(intervalRef.current);
          }
        }
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : "Failed to fetch results.");
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }

    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [runId]);

  return (
    <>
      <Header mode="results" />
      <main className="w-full max-w-[1600px] mx-auto px-3.5 pb-8 pt-4 md:px-6 md:pb-10 md:pt-6">
        <section className="xero-card relative overflow-hidden rounded-[24px] px-6 py-6 md:px-10 md:py-8 border border-white/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))]">
          <div className="xero-hero-arc absolute inset-0 pointer-events-none z-0" />
          <div className="xero-hero-grid absolute inset-0 pointer-events-none z-0" />

          {fetchError ? (
            <div className="flex flex-col items-center justify-center gap-6 py-32 text-center">
              <div className="xero-node flex h-16 w-16 items-center justify-center rounded-full border border-red-400/20">
                <CircleX className="h-7 w-7 text-red-400" />
              </div>
              <div>
                <div className="text-[1.1rem] font-light text-[--text]">Run failed</div>
                <div className="mt-2 text-[0.88rem] text-white/45">{fetchError}</div>
              </div>
              <Link href="/submit" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[0.9rem] font-semibold text-[#0a0a0f] hover:opacity-90">
                <ArrowLeft className="h-4 w-4" />
                Try again
              </Link>
            </div>
          ) : !report ? (
            <PollingState status={status} runId={runId} />
          ) : (
            <ReportView report={report} />
          )}
        </section>
      </main>
    </>
  );
}
