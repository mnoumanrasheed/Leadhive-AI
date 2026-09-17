"""Contract/security checks. All Google/bot operations are replaced with in-memory stubs."""
import importlib.util
import sys
import types
import unittest
from pathlib import Path
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient

class AdapterTests(unittest.TestCase):
    def setUp(self):
        self.records = {
            "profiles": {}, "selection": {}, "schedules": {}, "logs": [],
            "tokens": {"owned": {"private": "never-send-this"}, "other": {"private": "other-secret"}},
        }
        self.core = types.ModuleType("bot")
        self.core.templates = types.SimpleNamespace(env=types.SimpleNamespace(globals={}))
        self.core.USER_TOKENS_FILE = "tokens"
        self.core.BUSINESS_PROFILE_FILE = "profiles"
        self.core.TARGET_VIDEOS_FILE = "selection"
        self.core.SCHEDULE_FILE = "schedules"
        self.core.LOGS_FILE = "logs"
        self.core.CLIENT_SECRETS_FILE = "unused"
        self.core.SCOPES = []
        self.core.active_bots = {}
        self.core.load_json = lambda key, fallback: self.records.get(key, fallback)
        self.core.save_json = lambda key, value: self.records.update({key: value})
        self.core.toggle_bot = Mock()
        self.core.save_selected_videos = Mock()
        self.core.update_schedule = Mock(return_value={"status": "success"})
        self.core.video_analytics = Mock(return_value=types.SimpleNamespace(context={"videos": []}))
        from datetime import datetime
        self.core.datetime = datetime
        spec = importlib.util.spec_from_file_location("tested_adapter", Path(__file__).with_name("leadhive_app.py"))
        self.adapter = importlib.util.module_from_spec(spec)
        with patch.dict(sys.modules, {"bot": self.core}), patch.dict("os.environ", {"LEADHIVE_PUBLIC_URL": "http://localhost:5173"}):
            spec.loader.exec_module(self.adapter)
        self.client = TestClient(self.adapter.app, raise_server_exceptions=False)
        self.addCleanup(self.client.close)
        bootstrap = self.client.get("/api/youtube/session").json()
        self.headers = {"Origin": "http://localhost:5173", "X-Leadhive-CSRF": bootstrap["csrf"]}
        self.state = self.adapter.sessions[self.client.cookies.get(self.adapter.COOKIE)]

    def connect(self):
        self.state["channels"] = [{"id": "owned", "title": "Test fixture", "thumbnail": ""}]
        self.state["selected"] = "owned"

    def test_anonymous_does_not_disclose_stored_accounts(self):
        result = self.client.get("/api/youtube/session")
        self.assertEqual(result.json()["channels"], [])
        self.assertNotIn("never-send-this", result.text)
        for path in ("workspace", "activity", "analytics", "videos"):
            self.assertEqual(self.client.get("/api/youtube/" + path).status_code, 401)

    def test_cookie_is_http_only_and_responses_are_not_cached(self):
        other = TestClient(self.adapter.app)
        self.addCleanup(other.close)
        result = other.get("/api/youtube/session")
        self.assertIn("httponly", result.headers["set-cookie"].lower())
        self.assertIn("samesite=lax", result.headers["set-cookie"].lower())
        self.assertEqual(result.headers["cache-control"], "no-store")

    def test_origin_and_csrf_are_required(self):
        self.connect()
        for headers in ({}, {"Origin": "http://evil.invalid", "X-Leadhive-CSRF": self.headers["X-Leadhive-CSRF"]}, {"Origin": self.headers["Origin"]}):
            self.assertEqual(self.client.post("/api/youtube/channel", json={"channel": "owned"}, headers=headers).status_code, 403)

    def test_cross_channel_access_is_rejected(self):
        self.connect()
        response = self.client.post("/api/youtube/channel", json={"channel": "other"}, headers=self.headers)
        self.assertEqual(response.status_code, 403)
        self.assertEqual(self.state["selected"], "owned")
        self.assertEqual(self.client.get("/api/youtube/workspace?channel=other").status_code, 401)

    def test_explicit_channel_scope_survives_other_tab_selection(self):
        self.connect()
        self.state["channels"].append({"id": "second-owned", "title": "Second fixture"})
        self.state["selected"] = "second-owned"
        self.records["profiles"] = {"owned": {"business_name": "First workspace"}, "second-owned": {"business_name": "Second workspace"}}
        result = self.client.get("/api/youtube/workspace?channel=owned")
        self.assertEqual(result.json()["profile"]["business_name"], "First workspace")

    def test_selection_is_scoped_to_loaded_uploads(self):
        self.connect()
        self.state["video_ids"] = {"upload"}
        bad = self.client.put("/api/youtube/selection", json={"video_ids": ["foreign"]}, headers=self.headers)
        self.assertEqual(bad.status_code, 422)
        good = self.client.put("/api/youtube/selection", json={"video_ids": ["upload"]}, headers=self.headers)
        self.assertEqual(good.status_code, 200)
        self.core.save_selected_videos.assert_called_once_with(channel_id="owned", video_ids=["upload"])

    def test_existing_analytics_contract_is_preserved(self):
        self.connect()
        response = self.client.get("/api/youtube/analytics")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["videos"], [])
        self.assertFalse(response.json()["capabilities"]["audience"])
        self.core.video_analytics.assert_called_once()

    def test_activity_cannot_leak_other_channel(self):
        self.connect()
        self.records["logs"] = [{"channel_id": "other", "author": "private"}, {"channel_id": "owned", "comment": "<script>test</script>"}]
        response = self.client.get("/api/youtube/activity")
        self.assertEqual(len(response.json()["logs"]), 1)
        self.assertNotIn("private", response.text)
        self.assertEqual(response.json()["logs"][0]["comment"], "<script>test</script>")

    def test_missing_trial_guard_prevents_false_running_state(self):
        self.connect()
        self.records["selection"] = {"owned": ["upload"]}
        result = self.client.put("/api/youtube/automation", json={"running": True}, headers=self.headers)
        self.assertEqual(result.status_code, 503)
        self.core.toggle_bot.assert_not_called()

    def test_settings_reject_invalid_period(self):
        self.connect()
        result = self.client.put("/api/youtube/schedule", json={"mode": "period", "target_date": "2026-09-15", "start_time": "18:00", "end_time": "09:00"}, headers=self.headers)
        self.assertEqual(result.status_code, 422)
        self.core.update_schedule.assert_not_called()

    def test_invalid_oauth_state_returns_to_leadhive(self):
        result = self.client.get("/api/youtube/auth/callback?state=invalid&code=unused", follow_redirects=False)
        self.assertEqual(result.status_code, 303)
        self.assertIn("/test-demo?connection=failed#channel", result.headers["location"])

    def test_provider_errors_are_sanitized(self):
        self.connect()
        self.core.video_analytics.side_effect = RuntimeError("a secret provider token")
        result = self.client.get("/api/youtube/analytics")
        self.assertEqual(result.status_code, 502)
        self.assertNotIn("secret", result.text)

    def test_oauth_success_exposes_channels_but_never_credentials(self):
        credentials = types.SimpleNamespace(token="provider-secret", refresh_token="refresh-secret",
            token_uri="https://provider.test/token", client_id="client-id", client_secret="client-secret", scopes=[])
        flow = types.SimpleNamespace(credentials=credentials, fetch_token=Mock())
        self.state["oauth"] = {"state": "bound-state", "flow": flow, "expires": self.adapter.time.time() + 60}
        youtube = Mock()
        youtube.channels.return_value.list.return_value.execute.return_value = {
            "items": [{"id": "owned", "snippet": {"title": "Connected fixture"}, "statistics": {"viewCount": "15"}}]}
        self.core.googleapiclient = types.SimpleNamespace(discovery=types.SimpleNamespace(build=Mock(return_value=youtube)))
        response = self.client.get("/api/youtube/auth/callback?state=bound-state&code=authorized-code", follow_redirects=False)
        self.assertEqual(response.status_code, 303)
        self.assertEqual(response.headers["location"], "http://localhost:5173/test-demo#channel")
        public = self.client.get("/api/youtube/session")
        self.assertEqual(public.json()["channels"][0]["id"], "owned")
        self.assertNotIn("secret", public.text)
        self.assertEqual(self.records["tokens"]["owned"]["token"], "provider-secret")
        replay = self.client.get("/api/youtube/auth/callback?state=bound-state&code=authorized-code", follow_redirects=False)
        self.assertIn("connection=failed", replay.headers["location"])
        flow.fetch_token.assert_called_once()

    def test_start_and_stop_are_idempotent_when_guard_is_present(self):
        self.connect()
        self.core.check_and_increment_trial = Mock(return_value=True)
        self.records["selection"] = {"owned": ["upload"]}
        self.core.toggle_bot.side_effect = lambda channel: self.core.active_bots.update({channel: not self.core.active_bots.get(channel, False)})
        for _ in range(2):
            result = self.client.put("/api/youtube/automation", json={"running": True}, headers=self.headers)
            self.assertTrue(result.json()["running"])
        self.core.toggle_bot.assert_called_once_with("owned")
        result = self.client.put("/api/youtube/automation", json={"running": False}, headers=self.headers)
        self.assertFalse(result.json()["running"])
        self.assertEqual(self.core.toggle_bot.call_count, 2)

if __name__ == "__main__":
    unittest.main(verbosity=2)
