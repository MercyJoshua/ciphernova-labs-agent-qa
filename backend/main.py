"""
FastAPI Application — AI Agent QA & Reliability Harness

Endpoints:
  POST /run                  — Submit an agent for testing, returns run_id
  GET  /results/{run_id}     — Poll for test results
  GET  /runs                 — List all past runs
  GET  /health               — Health check

Pipeline (runs as a background task on POST /run):
  1. ScenarioGenerator  → 25–30 test scenarios
  2. ExecutionEngine    → concurrent multi-turn simulations
  3. JudgeEngine        → Gemma-based LLM scoring per transcript
  4. ReportAggregator   → final score + breakdown
  5. Store              → persist to in-memory store
"""

from __future__ import annotations

import logging
import os
from contextlib import asynccontextmanager
from urllib.parse import urlparse, urlunparse

import json

from dotenv import load_dotenv
from fastapi import BackgroundTasks, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Load .env before importing modules that read env vars at import time
load_dotenv()

from execution_engine import run_all_scenarios  # noqa: E402
from judge_engine import judge_all_with_consensus  # noqa: E402
from models import FinalReport, RunRecord, RunRequest, RunResponse, RunStatus  # noqa: E402
from report_aggregator import aggregate  # noqa: E402
from scenario_generator import generate_scenarios  # noqa: E402
from store import (  # noqa: E402
    create_run,
    get_run,
    list_runs,
    set_done,
    set_error,
    set_running,
)

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
CORS_ORIGINS = json.loads(
    os.getenv("CORS_ORIGINS", f'["{FRONTEND_ORIGIN}", "http://localhost:5173", "http://localhost:3000"]')
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Agent QA Harness backend starting up.")
    yield
    logger.info("🛑 Agent QA Harness backend shutting down.")


app = FastAPI(
    title="AI Agent QA & Reliability Harness",
    description=(
        "Pre-flight check for AI agents. "
        "Submit any OpenAI-compatible agent endpoint and receive a structured reliability report."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# URL normalization
# ---------------------------------------------------------------------------


def _normalize_agent_url(url: str) -> str:
    """If the URL has no path (or only '/'), append '/chat'.

    Examples:
      https://example.com/chat    →  https://example.com/chat   (unchanged)
      https://example.com/v1/chat  →  https://example.com/v1/chat (unchanged)
      https://example.com          →  https://example.com/chat
      https://example.com/         →  https://example.com/chat
    """
    parsed = urlparse(url)
    path = parsed.path.rstrip("/")
    if not path:
        parsed = parsed._replace(path="/chat")
        return urlunparse(parsed)
    return url


# ---------------------------------------------------------------------------
# Background pipeline
# ---------------------------------------------------------------------------


async def _run_pipeline(run_id: str, agent_url: str, description: str) -> None:
    """
    Full evaluation pipeline executed as a FastAPI background task.

    Steps:
      1. Mark run as RUNNING
      2. Generate scenarios
      3. Execute simulations in parallel
      4. Judge each transcript
      5. Aggregate into final report
      6. Persist and mark as DONE (or ERROR on failure)
    """
    agent_url = _normalize_agent_url(agent_url)
    set_running(run_id)
    logger.info("[%s] Pipeline started for agent: %s", run_id, agent_url)

    try:
        # Step 1 — Scenario generation
        logger.info("[%s] Generating scenarios...", run_id)
        scenarios = await generate_scenarios(description, count=28)
        logger.info("[%s] %d scenarios generated.", run_id, len(scenarios))

        # Step 2 — Concurrent execution
        logger.info("[%s] Running simulations against %s ...", run_id, agent_url)
        results = await run_all_scenarios(scenarios, agent_url)

        # Step 3 — LLM judging (DeepSeek + optional Gemma consensus)
        logger.info("[%s] Running judge engine...", run_id)
        judged = await judge_all_with_consensus(results)

        # Step 4 — Aggregation
        logger.info("[%s] Aggregating report...", run_id)
        report = aggregate(judged, run_id)

        # Step 5 — Persist
        set_done(run_id, report)
        logger.info("[%s] ✅ Pipeline complete. Score: %d/100", run_id, report.overall_score)

    except Exception as exc:
        logger.exception("[%s] ❌ Pipeline failed: %s", run_id, exc)
        set_error(run_id, str(exc))


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@app.post("/run", response_model=RunResponse, status_code=202)
async def start_run(request: RunRequest, background_tasks: BackgroundTasks) -> RunResponse:
    """
    Submit an agent for QA testing.

    The pipeline runs asynchronously in the background.
    Poll GET /results/{run_id} to retrieve the report.
    """
    response = RunResponse()
    run_id = response.run_id
    create_run(run_id)

    background_tasks.add_task(
        _run_pipeline,
        run_id=run_id,
        agent_url=str(request.agent_url),
        description=request.description,
    )

    logger.info("[%s] Run queued for %s", run_id, request.agent_url)
    return response


@app.get("/results/{run_id}")
async def get_results(run_id: str) -> RunRecord | FinalReport:
    """
    Poll for the status and results of a test run.

    Returns:
      - status: "pending" | "running" | "done" | "error"
      - If done: full FinalReport with score, breakdown, and top failures.
      - If error: error message.
    """
    record = get_run(run_id)
    if record is None:
        raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found.")

    if record.status == RunStatus.DONE and record.report:
        return record.report

    return record


@app.get("/runs")
async def list_all_runs() -> list[RunRecord]:
    """List all test runs (newest first). Useful for a run history panel."""
    return list_runs()


@app.get("/health")
async def health() -> dict:
    """Health check — used by Docker, load balancers, and the frontend."""
    return {
        "status": "ok",
        "service": "agent-qa-harness-backend",
        "version": "1.0.0",
    }
