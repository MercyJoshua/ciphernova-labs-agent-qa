// ============================================================
// STUB FILE — TO BE IMPLEMENTED BY HAMZA (Frontend)
// ============================================================
//
// This file is the React app root.
//
// ── What Hamza needs to build ──────────────────────────────
//
// STATE MACHINE (3 views):
//   "onboard"  → OnboardForm component
//   "loading"  → LoadingState component (polls /results/{run_id})
//   "results"  → ResultsDashboard component
//
// ── API CALLS ──────────────────────────────────────────────
//
// 1. Start test:
//    POST http://localhost:8000/run
//    Body: { agent_url: string, description: string }
//    Response: { run_id: string, status: "pending", message: string }
//
// 2. Poll for results:
//    GET http://localhost:8000/results/{run_id}
//    Response when done: FinalReport (see models.py for schema)
//    Response when running: { run_id, status: "running" | "pending" }
//    Poll every 2 seconds until status === "done" or "error"
//
// ── FinalReport shape (from GET /results/{run_id}) ─────────
//
// {
//   run_id: string,
//   status: "done",
//   overall_score: number,          // 0–100
//   total_scenarios: number,
//   summary: {
//     task_success_rate: number,    // 0–1
//     hallucination_rate: number,   // 0–1
//     injection_success_rate: number,
//     instruction_failure_rate: number,
//     safety_violations: number,
//   },
//   top_failures: [
//     {
//       scenario_title: string,
//       category: string,
//       failure_type: string,
//       reasoning: string,
//       transcript: [{ role: "user"|"assistant", content: string }]
//     }
//   ],
//   all_results: [ ... ]           // full transcript data
// }
//
// ── Components to build ────────────────────────────────────
//
// <OnboardForm />
//   - Agent URL input (text, required)
//   - Description textarea (required)
//   - "Run Pre-Flight Check" button → POST /run → switch to loading
//
// <LoadingState runId={runId} onDone={report => setView("results")} />
//   - Animated progress phases:
//       "Generating scenarios..."
//       "Simulating conversations..."
//       "Judge evaluating..."
//       "Building report..."
//   - Polls every 2s until done
//
// <ResultsDashboard report={report} />
//   - <ScoreGauge score={report.overall_score} />  ← big animated number
//   - Failure breakdown cards (4 metric tiles)
//   - List of top_failures (clickable → opens TranscriptViewer)
//
// <TranscriptViewer transcript={[...]} />
//   - Modal / drawer showing full conversation
//   - Color-coded: user = blue, assistant = gray, violations = red highlight
//
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";

// TODO (Hamza): Replace this stub with the full App component.
function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "40px", textAlign: "center" }}>
      <h1>🛫 Agent QA Harness</h1>
      <p>
        Frontend stub — Hamza, implement the components described in this file.
      </p>
      <p>
        Backend API is running at{" "}
        <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer">
          http://localhost:8000/docs
        </a>
      </p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
