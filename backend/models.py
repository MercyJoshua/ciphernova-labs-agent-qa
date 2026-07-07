"""
Pydantic schemas for the AI Agent QA & Reliability Harness.
Defines the data contracts for API requests, responses, and internal pipeline types.
"""

from __future__ import annotations

from enum import Enum
from typing import Any
from uuid import uuid4

from pydantic import BaseModel, Field, HttpUrl


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------


class RunStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    DONE = "done"
    ERROR = "error"


class FailureType(str, Enum):
    NONE = "none"
    HALLUCINATION = "hallucination"
    INJECTION = "injection"
    INSTRUCTION_FAILURE = "instruction_failure"
    SAFETY = "safety"
    LOOP = "loop"


class ScenarioCategory(str, Enum):
    NORMAL = "normal"
    AMBIGUOUS = "ambiguous"
    EDGE_CASE = "edge_case"
    PROMPT_INJECTION = "prompt_injection"
    ATTACK = "attack"


# ---------------------------------------------------------------------------
# API request / response
# ---------------------------------------------------------------------------


class RunRequest(BaseModel):
    """POST /run — user submits their agent for evaluation."""

    agent_url: str = Field(
        ...,
        description="HTTP endpoint of the target agent (OpenAI-compatible chat completion format).",
        examples=["http://localhost:8001/chat"],
    )
    description: str = Field(
        ...,
        min_length=10,
        max_length=1000,
        description="Short description of the agent's purpose and tools.",
        examples=["Customer support agent for a flight-booking platform."],
    )


class RunResponse(BaseModel):
    """Returned immediately after POST /run."""

    run_id: str = Field(default_factory=lambda: str(uuid4())[:8])
    status: RunStatus = RunStatus.PENDING
    message: str = "Test run queued. Poll /results/{run_id} for updates."


# ---------------------------------------------------------------------------
# Internal pipeline types
# ---------------------------------------------------------------------------


class ConversationTurn(BaseModel):
    """A single message in a simulated conversation."""

    role: str  # "user" | "assistant"
    content: str


class Scenario(BaseModel):
    """A generated test scenario including its initial prompt and strategy."""

    scenario_id: str = Field(default_factory=lambda: str(uuid4())[:8])
    category: ScenarioCategory
    title: str
    initial_message: str
    follow_up_strategy: str  # instruction for follow-up turn generation
    expected_behaviour: str  # what a well-behaved agent should do


class JudgeVerdict(BaseModel):
    """Structured output from the Judge Engine for a single scenario run."""

    task_success: bool
    hallucination: bool
    instruction_following: float = Field(ge=0.0, le=1.0)
    safety_violation: bool
    injection_success: bool
    reasoning: str
    failure_type: FailureType


class ScenarioResult(BaseModel):
    """Full result for a single scenario: transcript + judge verdict."""

    scenario: Scenario
    transcript: list[ConversationTurn]
    verdict: JudgeVerdict | None = None
    error: str | None = None  # execution error if agent call failed


# ---------------------------------------------------------------------------
# Report
# ---------------------------------------------------------------------------


class FailureSummary(BaseModel):
    """A summarised failure record for the top-failures list."""

    scenario_title: str
    category: ScenarioCategory
    failure_type: FailureType
    reasoning: str
    transcript: list[ConversationTurn]


class ReportBreakdown(BaseModel):
    task_success_rate: float = Field(ge=0.0, le=1.0)
    hallucination_rate: float = Field(ge=0.0, le=1.0)
    injection_success_rate: float = Field(ge=0.0, le=1.0)
    instruction_failure_rate: float = Field(ge=0.0, le=1.0)
    safety_violations: int


class FinalReport(BaseModel):
    """The fully aggregated test report returned by GET /results/{run_id}."""

    run_id: str
    status: RunStatus
    overall_score: int = Field(ge=0, le=100)
    total_scenarios: int
    summary: ReportBreakdown
    top_failures: list[FailureSummary]
    all_results: list[ScenarioResult]  # full data for transcript viewer


class RunRecord(BaseModel):
    """Internal storage record held in the in-memory store."""

    run_id: str
    status: RunStatus = RunStatus.PENDING
    report: FinalReport | None = None
    error: str | None = None
