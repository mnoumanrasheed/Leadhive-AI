"""Persistent three-attempt channel trial, shared safely across threads/processes.

A slot is reserved before calling external services. Failed/ambiguous network attempts
still consume the slot, so a retry cannot accidentally exceed the public reply cap.
"""
import json
import os
import tempfile
import threading
from contextlib import contextmanager
from pathlib import Path

TRIAL_FILE = Path(__file__).with_name("trial_usage.json")
TRIAL_LIMIT = 3
_thread_lock = threading.Lock()


@contextmanager
def _file_lock(path):
    with open(path, "a+b") as handle:
        if handle.seek(0, os.SEEK_END) == 0:
            handle.write(b"0")
            handle.flush()
        handle.seek(0)
        if os.name == "nt":
            import msvcrt
            msvcrt.locking(handle.fileno(), msvcrt.LK_LOCK, 1)
        else:
            import fcntl
            fcntl.flock(handle.fileno(), fcntl.LOCK_EX)
        try:
            yield
        finally:
            handle.seek(0)
            if os.name == "nt":
                msvcrt.locking(handle.fileno(), msvcrt.LK_UNLCK, 1)
            else:
                fcntl.flock(handle.fileno(), fcntl.LOCK_UN)


def check_and_increment_trial(channel_id):
    if not isinstance(channel_id, str) or not channel_id.strip():
        return False
    ledger = Path(TRIAL_FILE)
    with _thread_lock, _file_lock(ledger.with_suffix(".lock")):
        if ledger.exists():
            try:
                with ledger.open(encoding="utf-8") as handle:
                    usage = json.load(handle)
            except (ValueError, OSError):
                return False  # Never reset an unreadable ledger and silently grant replies.
        else:
            usage = {}
        if not isinstance(usage, dict):
            return False
        used = usage.get(channel_id, 0)
        if type(used) is not int or used < 0 or used >= TRIAL_LIMIT:
            return False
        usage[channel_id] = used + 1
        temporary = None
        try:
            with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=ledger.parent, prefix=".trial-", suffix=".tmp", delete=False) as handle:
                temporary = Path(handle.name)
                json.dump(usage, handle, indent=2)
                handle.flush()
                os.fsync(handle.fileno())
            os.replace(temporary, ledger)
        finally:
            if temporary and temporary.exists():
                temporary.unlink()
        return True
