import importlib
import json
import tempfile
import unittest
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor
from pathlib import Path
from unittest.mock import patch
import trial_guard


def reserve_in_process(path):
    import trial_guard as guard
    guard.TRIAL_FILE = Path(path)
    return guard.check_and_increment_trial("channel")


class TrialGuardTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.path = Path(self.directory.name) / "trial.json"
        self.ledger = patch.object(trial_guard, "TRIAL_FILE", self.path)
        self.ledger.start()
        self.addCleanup(self.ledger.stop)

    def test_three_attempts_persist(self):
        self.assertEqual([trial_guard.check_and_increment_trial("channel") for _ in range(5)], [True, True, True, False, False])
        self.assertEqual(json.loads(self.path.read_text())["channel"], 3)
        self.assertTrue(trial_guard.check_and_increment_trial("another-channel"))

    def test_threads_cannot_exceed_cap(self):
        with ThreadPoolExecutor(max_workers=8) as pool:
            results = list(pool.map(trial_guard.check_and_increment_trial, ["channel"] * 20))
        self.assertEqual(sum(results), 3)

    def test_processes_cannot_exceed_cap(self):
        with ProcessPoolExecutor(max_workers=4) as pool:
            results = list(pool.map(reserve_in_process, [str(self.path)] * 12))
        self.assertEqual(sum(results), 3)

    def test_corrupt_state_fails_closed(self):
        self.path.write_text("broken", encoding="utf-8")
        self.assertFalse(trial_guard.check_and_increment_trial("channel"))
        self.assertEqual(self.path.read_text(), "broken")

    def test_invalid_usage_fails_closed(self):
        for value in [-1, True, "0", None]:
            self.path.write_text(json.dumps({"channel": value}), encoding="utf-8")
            self.assertFalse(trial_guard.check_and_increment_trial("channel"))

    def test_empty_channel_does_not_create_ledger(self):
        self.assertFalse(trial_guard.check_and_increment_trial(""))
        self.assertFalse(self.path.exists())


if __name__ == "__main__":
    unittest.main(verbosity=2)
