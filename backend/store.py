"""
In-memory store for test run records.

Keeps a dict of RunRecord objects keyed by run_id.
For the demo / MVP this is sufficient — no database needed.
If persistence is required later, swap this module for a SQLite/Redis backend
without touching any other module.
"""

from __future__ import annotations

import threading
from typing import Optional

from models import FinalReport, RunRecord, RunStatus

# Thread-safe lock — asyncio background tasks update runs while FastAPI
# serves /results reads concurrently.
_lock = threading.Lock()
_store: dict[str, RunRecord] = {}


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def create_run(run_id: str) -> RunRecord:
    """Initialise a new run record and persist it. Returns the record."""
    record = RunRecord(run_id=run_id, status=RunStatus.PENDING)
    with _lock:
        _store[run_id] = record
    return record


def get_run(run_id: str) -> Optional[RunRecord]:
    """Return the run record for the given ID, or None if not found."""
    with _lock:
        return _store.get(run_id)


def set_running(run_id: str) -> None:
    """Mark a run as actively running."""
    with _lock:
        if run_id in _store:
            _store[run_id].status = RunStatus.RUNNING


def set_done(run_id: str, report: FinalReport) -> None:
    """Attach the final report and mark run as done."""
    with _lock:
        if run_id in _store:
            _store[run_id].status = RunStatus.DONE
            _store[run_id].report = report


def set_error(run_id: str, error: str) -> None:
    """Mark a run as errored with an explanation."""
    with _lock:
        if run_id in _store:
            _store[run_id].status = RunStatus.ERROR
            _store[run_id].error = error


def list_runs() -> list[RunRecord]:
    """Return all stored run records (newest-first by insertion order)."""
    with _lock:
        return list(reversed(list(_store.values())))
