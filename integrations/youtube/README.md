# LeadHive AI / YouTube Intelligence

The React product lives at `/test-demo` in LeadHive. Its API adapter calls the existing
YoutubeAPI profile, video-selection, schedule, bot-control, and analytics functions.
No credential files are copied into this repository or the browser.

## Local development

1. In `D:\YoutubeAPI`, run:
   ```powershell
   $env:LEADHIVE_PUBLIC_URL = 'http://localhost:5173'
   .\venv\Scripts\python.exe -m uvicorn leadhive_app:app --host 127.0.0.1 --port 8001
   ```
2. In the LeadHive project, run `npm.cmd run dev -- --host localhost --port 5173`.
3. Open `http://localhost:5173/test-demo`.
4. In the Google OAuth client's authorized redirect URIs, add:
   `http://localhost:5173/api/youtube/auth/callback`.
5. Click Connect YouTube and complete Google consent in your browser.

Use `localhost` consistently for the frontend: OAuth and request-origin validation
are bound to `LEADHIVE_PUBLIC_URL`. For local preview on another port, set that value
to the preview origin before starting the backend.

This workspace's ignored `.env.local` forwards `/api/youtube/*` to
`http://127.0.0.1:8001`, leaving the pre-existing service on port 8000 alone.
The configuration fallback when no override is present is port 8000.
Override that target with the server-only `YOUTUBE_BACKEND_ORIGIN` variable.
Never put Google/Gemini keys, OAuth tokens, or client secrets in a `VITE_*` variable.

## Backend installation and existing UI

To install or resynchronize the adapter, trial guard, and replacement templates:

```powershell
.\integrations\youtube\install.ps1 -BackendPath D:\YoutubeAPI
```

The script preserves the first backup and does not edit credential or channel data.

`leadhive_app.py` is kept here as the versioned integration source and installed at
`D:\YoutubeAPI\leadhive_app.py`. Synchronize it after editing this source.
The six old Jinja pages have been replaced with `legacy-shell.html`, which sends users
to the React module. Their original contents are recoverable from
`D:\YoutubeAPI\.leadhive-ui-backup`.

Run `leadhive_app:app` for the integration. Do not publicly expose `bot:app`:
its legacy endpoints do not enforce channel ownership. The only edit to `bot.py` is
the approved trial-guard import described below.
The adapter exposes only session-scoped routes and whitelists response fields.
Session cookies are HttpOnly, use SameSite=Lax, and become Secure under HTTPS.
Writes require the configured origin and a per-session CSRF token.
Sessions are currently process-local and expire after eight hours; use one backend
worker. A service restart requires users to reconnect. Multi-worker deployment needs
a shared server-side session store.

## Production routing

Deploy the LeadHive frontend and the Python adapter behind one HTTPS origin.
Set `LEADHIVE_PUBLIC_URL=https://leadhive-ai.com` on the Python server and register
`https://leadhive-ai.com/api/youtube/auth/callback` in Google Cloud.
Reverse proxy `/api/youtube/*` to the Python server before the SPA fallback.
Keep the existing PHP contact endpoint on its current handler.
The Vite development proxy is not a production proxy. No production deployment
or Google Console changes are performed by this implementation.

Keep `.env`, `client_secrets.json`, `user_tokens.json`, and bot data server-side.
This audit found credential files already tracked in the YoutubeAPI Git repository.
Before public deployment, remove them from tracking and rotate any credentials that
have been exposed. Adding ignore rules alone does not remove existing Git history.

## Supported surfaces

- Channel connection/selection: Google OAuth, channel details returned for that consent.
- Persona: original business profile fields and persistence.
- Video library: actual uploads, selection validated against the current channel.
- Command Center: original schedule fields, actual bot state, real activity.
- Analytics: original video views/comments/likes; overview totals are labeled as monitored data.
- Audience demographics, AI channel recommendations, and growth analysis: honest unavailable
  states because the existing backend provides no such endpoints.

Channel statistics are captured on connection. Video metrics can be refreshed from
Analytics. No placeholder numbers or generated account/activity data appear in the app.

## Three-reply trial guard

The supplied `bot_worker` called an undefined `check_and_increment_trial`. With the
user's approval, `trial_guard.py` now supplies it and `bot.py` imports it. The only
change to `bot.py` is that import; the previous file is backed up beside the templates.
The guard allows at most three reply attempts per channel, stored in `trial_usage.json`
beside the module. Slots are reserved before external API calls. Failed or ambiguous
network attempts consume a slot, so retries cannot accidentally exceed the cap.
Atomic writes plus thread and operating-system file locks preserve the limit across
concurrent workers and process restarts. Invalid/corrupt state fails closed. Existing
`bot_constraints.json` settings and other bot data are not changed.
The adapter rejects Start when the guard is absent and still permits Stop. Restart
the Python adapter after installing the guard. Do not run the legacy and integrated
workers for the same channel simultaneously: their in-memory running flags differ.
The original analytics function also catches provider errors and may return an empty
list; the UI cannot distinguish that legacy case from an empty monitoring selection.

## Checks

```powershell
npm.cmd run build
npx.cmd playwright test tests/youtube-intelligence.spec.ts
D:\YoutubeAPI\venv\Scripts\python.exe integrations/youtube/test_adapter.py
D:\YoutubeAPI\venv\Scripts\python.exe integrations/youtube/test_trial_guard.py
```

Tests use isolated fixtures and in-memory substitutes. They do not authorize Google,
send requests to YouTube/Gemini, or post replies.

## Frontend routes

`/test-demo` — landing; `#channel` — accounts; `#persona` — business voice;
`#content` — videos; `#dashboard` — intelligence overview;
`#command-center` — automation; `#analytics` — video statistics.
