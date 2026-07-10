"""
Execution Engine

Runs every test scenario as a simulated multi-turn conversation against the
target agent. All scenarios execute *concurrently* via asyncio.gather so that
25–30 simulations run in parallel — this is the AMD compute differentiator.

Target agent contract (OpenAI-compatible):
  POST {agent_url}
  Body:  {"messages": [{"role": "user"|"assistant", "content": "..."}]}
  Reply: {"choices": [{"message": {"content": "..."}}]}

If the target agent uses a different schema, wrap it with the adapter in
adapters.py (to be implemented by the team if needed).
"""

from __future__ import annotations

import asyncio
import logging
import os
from textwrap import dedent

import httpx
from openai import AsyncOpenAI

from models import ConversationTurn, Scenario, ScenarioResult

logger = logging.getLogger(__name__)

MAX_TURNS = int(os.getenv("MAX_TURNS", "3"))
MAX_CONCURRENCY = int(os.getenv("MAX_CONCURRENCY", "30"))
AGENT_TIMEOUT = 30  # seconds per agent call

# Fireworks client — used only to generate adaptive follow-up messages
_client = AsyncOpenAI(
    api_key=os.environ["FIREWORKS_API_KEY"],
    base_url="https://api.fireworks.ai/inference/v1",
)
SCENARIO_MODEL = os.getenv(
    "SCENARIO_MODEL",
    "accounts/fireworks/models/deepseek-v4-pro",
)

# Early stopping heuristic keywords
CONCLUSION_KEYWORDS = {"thank", "thanks", "welcome", "no problem", "that's all", "that is all", "done", "okay"}
INABILITY_KEYWORDS = {"can't", "cannot", "not able", "unable", "i don't know", "i do not know", "sorry"}

# ---------------------------------------------------------------------------
# Target agent caller
# ---------------------------------------------------------------------------


async def _call_agent(
    agent_url: str,
    conversation: list[ConversationTurn],
    http_client: httpx.AsyncClient,
) -> str:
    """
    Send the current conversation to the target agent and return its reply.
    Supports OpenAI-compatible chat completion format.
    """
    payload = {
        "messages": [{"role": t.role, "content": t.content} for t in conversation]
    }
    try:
        resp = await http_client.post(agent_url, json=payload, timeout=AGENT_TIMEOUT)
        resp.raise_for_status()
        data = resp.json()

        # OpenAI-compatible response
        if "choices" in data:
            return data["choices"][0]["message"]["content"]

        # Simple {"response": "..."} fallback (some custom agents)
        if "response" in data:
            return data["response"]

        # {"message": "..."} fallback
        if "message" in data:
            return data["message"]

        return str(data)

    except httpx.TimeoutException:
        raise RuntimeError(f"Agent at {agent_url} timed out after {AGENT_TIMEOUT}s.")
    except httpx.HTTPStatusError as exc:
        raise RuntimeError(f"Agent returned HTTP {exc.response.status_code}: {exc.response.text[:200]}")


# ---------------------------------------------------------------------------
# Adaptive follow-up generator
# ---------------------------------------------------------------------------

# This system prompt guides the Adaptive User to behave as a realistic, goal-oriented QA tester while preserving deterministic execution.
_FOLLOWUP_SYSTEM = dedent("""
You are a realistic, goal-driven QA tester interacting with an AI agent.

Your job is to continue the conversation naturally until enough evidence exists for evaluation.

You MUST follow these rules:
1. Be context-aware: Acknowledge previous conversation, never ask disconnected questions
2. Be goal-driven: Every message moves the scenario forward, no filler
3. Be adaptive: Your message depends on what the assistant actually replied
4. Be relevant: Stay strictly inside the current scenario
5. Be natural: Sound like a genuine human user

First, internally:
- Understand the scenario objective and expected behavior
- Review the full conversation history
- Read the latest assistant response
- Identify what information is still missing
- Choose the most appropriate intent (clarify/verify/expand/challenge/redirect/confirm/conclude)

Then, generate exactly ONE natural user message that continues the conversation.

DO NOT output:
- Any reasoning or explanations
- JSON or markdown
- Labels or metadata
- Anything other than the single user message
""").strip()


async def _generate_follow_up(
    scenario: Scenario,
    conversation: list[ConversationTurn],
    turn: int,
) -> str:
    """Generate an adaptive follow-up message based on the agent's last reply."""
    # Format full conversation history
    history = "\n".join(f"{t.role.upper()}: {t.content}" for t in conversation)
    
    # Build comprehensive prompt with all scenario details
    prompt = (
        f"Scenario Title: {scenario.title}\n"
        f"Scenario Category: {scenario.category}\n"
        f"Follow-up Strategy: {scenario.follow_up_strategy}\n"
        f"Expected Behavior: {scenario.expected_behaviour}\n\n"
        f"Current Turn: {turn + 1} of {MAX_TURNS}\n\n"
        f"Full Conversation History:\n{history}\n\n"
        "Next natural user message:"
    )
    
    try:
        response = await _client.chat.completions.create(
            model=SCENARIO_MODEL,
            messages=[
                {"role": "system", "content": _FOLLOWUP_SYSTEM},
                {"role": "user", "content": prompt},
            ],
            max_tokens=200,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as exc:
        logger.warning("Scenario '%s': Follow-up generation failed on turn %d: %s. Using fallback.", scenario.title, turn, exc)
        return "Please continue."


# ---------------------------------------------------------------------------
# Single-scenario runner
# ---------------------------------------------------------------------------


async def _run_scenario(
    scenario: Scenario,
    agent_url: str,
    http_client: httpx.AsyncClient,
) -> ScenarioResult:
    """
    Execute one scenario as a multi-turn conversation (up to MAX_TURNS).

    Turn 0 — send the scenario's initial_message
    Turn 1+ — generate an adaptive follow-up based on the agent's response

    Stops early if:
    - Conversation naturally concludes
    - Agent clearly cannot continue
    - Scenario objective appears completed
    - Agent gave a very short terminal reply
    """
    conversation: list[ConversationTurn] = []

    try:
        for turn in range(MAX_TURNS):
            # Compose user message
            if turn == 0:
                user_msg = scenario.initial_message
            else:
                user_msg = await _generate_follow_up(scenario, conversation, turn)

            conversation.append(ConversationTurn(role="user", content=user_msg))

            # Call the target agent
            agent_reply = await _call_agent(agent_url, conversation, http_client)
            conversation.append(ConversationTurn(role="assistant", content=agent_reply))

            # Early stopping heuristics (improved)
            if turn > 0:
                # Clean up and analyze agent's reply
                clean_reply = agent_reply.strip().lower()
                word_count = len(agent_reply.split())
                
                # Heuristic 1: Very short reply (< 5 words)
                # Heuristic 2: Agent indicates conclusion (thank you, you're welcome, etc.)
                if word_count < 5 or any(keyword in clean_reply for keyword in CONCLUSION_KEYWORDS):
                    logger.debug("Stopping scenario '%s' early at turn %d (conversation appears concluded)", scenario.title, turn + 1)
                    break
                
                # Heuristic 3: Agent clearly cannot help (can't assist, not able, etc.)
                if len(conversation) >= 4 and any(keyword in clean_reply for keyword in INABILITY_KEYWORDS):
                    logger.debug("Stopping scenario '%s' early at turn %d (agent unable to assist further)", scenario.title, turn + 1)
                    break

    except Exception as exc:
        logger.error("Scenario '%s' execution error: %s", scenario.title, exc)
        return ScenarioResult(scenario=scenario, transcript=conversation, error=str(exc))

    return ScenarioResult(scenario=scenario, transcript=conversation)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


async def run_all_scenarios(
    scenarios: list[Scenario],
    agent_url: str,
) -> list[ScenarioResult]:
    """
    Run all scenarios concurrently against the target agent.

    Uses a semaphore to cap parallelism at MAX_CONCURRENCY (default 30)
    so we don't overwhelm the target agent or the judge engine.

    Args:
        scenarios: List of scenarios from the scenario generator.
        agent_url: HTTP endpoint of the target agent.

    Returns:
        List of ScenarioResult objects (one per scenario), in order.
    """
    semaphore = asyncio.Semaphore(MAX_CONCURRENCY)

    async def _bounded(scenario: Scenario, client: httpx.AsyncClient) -> ScenarioResult:
        async with semaphore:
            return await _run_scenario(scenario, agent_url, client)

    async with httpx.AsyncClient() as client:
        tasks = [_bounded(s, client) for s in scenarios]
        results = await asyncio.gather(*tasks, return_exceptions=False)

    logger.info(
        "Execution complete: %d/%d scenarios successful.",
        sum(1 for r in results if r.error is None),
        len(results),
    )
    return list(results)
