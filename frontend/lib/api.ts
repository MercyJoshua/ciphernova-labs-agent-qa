/**
 * Shared API client for the Agent QA Harness backend.
 * All fetch calls go through here — base URL, headers, and types in one place.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://ciphernova-labs-agent-qa.onrender.com";

// ─────────────────────────────────────────────────────────────────────────────
// Types (mirrors backend/models.py exactly)
// ─────────────────────────────────────────────────────────────────────────────

export type RunStatus = "pending" | "running" | "done" | "error";

export interface RunRequest {
  agent_url: string;
  description: string;
}

export interface RunResponse {
  run_id: string;
  status: RunStatus;
  message: string;
}

export interface RunRecord {
  run_id: string;
  status: RunStatus;
  report: FinalReport | null;
  error: string | null;
}

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}

export interface Scenario {
  scenario_id: string;
  category: "normal" | "ambiguous" | "edge_case" | "prompt_injection" | "attack";
  title: string;
  initial_message: string;
  follow_up_strategy: string;
  expected_behaviour: string;
}

export interface JudgeVerdict {
  task_success: boolean;
  hallucination: boolean;
  instruction_following: number;
  safety_violation: boolean;
  injection_success: boolean;
  reasoning: string;
  failure_type: "none" | "hallucination" | "injection" | "instruction_failure" | "safety" | "loop";
}

export interface ScenarioResult {
  scenario: Scenario;
  transcript: ConversationTurn[];
  verdict: JudgeVerdict | null;
  error: string | null;
}

export interface FailureSummary {
  scenario_title: string;
  category: Scenario["category"];
  failure_type: JudgeVerdict["failure_type"];
  reasoning: string;
  transcript: ConversationTurn[];
}

export interface FinalReport {
  run_id: string;
  status: RunStatus;
  overall_score: number;
  total_scenarios: number;
  summary: {
    task_success_rate: number;
    hallucination_rate: number;
    injection_success_rate: number;
    instruction_failure_rate: number;
    safety_violations: number;
  };
  top_failures: FailureSummary[];
  all_results: ScenarioResult[];
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// API helpers
// ─────────────────────────────────────────────────────────────────────────────

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { detail?: string }).detail ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/** Submit an agent for QA testing. Returns a run_id to poll. */
export function startRun(payload: RunRequest): Promise<RunResponse> {
  return request<RunResponse>("/run", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Poll for run status and results. Returns FinalReport when done. */
export function getResults(runId: string): Promise<RunRecord | FinalReport> {
  return request<RunRecord | FinalReport>(`/results/${runId}`);
}

/** List all past runs (newest first). */
export function listRuns(): Promise<RunRecord[]> {
  return request<RunRecord[]>("/runs");
}

/** Health check — confirm the backend is reachable. */
export function checkHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/health");
}
