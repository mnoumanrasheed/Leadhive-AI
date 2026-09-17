"""LeadHive transport adapter for the existing YoutubeAPI backend.

Run from D:/YoutubeAPI: venv/Scripts/python -m uvicorn leadhive_app:app --port 8000
Google credentials and all bot data remain in the YoutubeAPI directory.
"""
import os
import secrets
import threading
import time
from pathlib import Path
from urllib.parse import urlparse

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse, RedirectResponse
from pydantic import BaseModel, Field

# The original module owns Google/Gemini clients, storage, and bot behavior.
import bot as core

PUBLIC_URL = os.getenv("LEADHIVE_PUBLIC_URL", "http://localhost:5173").rstrip("/")
parsed_public = urlparse(PUBLIC_URL)
if parsed_public.scheme not in ("http", "https") or not parsed_public.netloc or parsed_public.path:
    raise RuntimeError("LEADHIVE_PUBLIC_URL must be an origin, without a path")
if parsed_public.scheme != "https" and parsed_public.hostname not in ("localhost", "127.0.0.1"):
    raise RuntimeError("Use HTTPS for a public LeadHive deployment")
SECURE = parsed_public.scheme == "https"
if SECURE:
    os.environ.pop("OAUTHLIB_INSECURE_TRANSPORT", None)
CALLBACK_URL = PUBLIC_URL + "/api/youtube/auth/callback"
COOKIE = "leadhive_youtube"
SESSION_TTL = 8 * 60 * 60
sessions = {}
storage_lock = threading.RLock()
app = FastAPI(title="LeadHive AI | YouTube Intelligence", docs_url=None, redoc_url=None, openapi_url=None)
# Legacy template routes now hand off to the LeadHive product UI.
core.templates.env.globals["leadhive_url"] = PUBLIC_URL


@app.middleware("http")
async def session_and_headers(request: Request, call_next):
    now = time.time()
    for key, value in list(sessions.items()):
        if value["expires"] < now:
            sessions.pop(key, None)
    session_id = request.cookies.get(COOKIE)
    fresh = session_id not in sessions
    if fresh:
        session_id = secrets.token_urlsafe(32)
        sessions[session_id] = {"expires": now + SESSION_TTL, "csrf": secrets.token_urlsafe(32), "channels": [], "selected": None}
    request.state.workspace = sessions[session_id]
    response = await call_next(request)
    if fresh:
        response.set_cookie(COOKIE, session_id, max_age=SESSION_TTL, httponly=True, secure=SECURE, samesite="lax", path="/api/youtube")
    response.headers["Cache-Control"] = "no-store"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "no-referrer"
    return response


def workspace(request):
    return request.state.workspace


def authorize_write(request):
    if request.headers.get("origin") != PUBLIC_URL:
        raise HTTPException(403, "This action must originate from LeadHive.")
    provided = request.headers.get("x-leadhive-csrf", "")
    if not secrets.compare_digest(provided, workspace(request)["csrf"]):
        raise HTTPException(403, "Your session changed. Refresh and try again.")


def channel_id(request):
    state = workspace(request)
    selected = request.query_params.get("channel") or state["selected"]
    if not selected or not any(ch["id"] == selected for ch in state["channels"]):
        raise HTTPException(401, "Connect and select your YouTube channel first.")
    return selected


def credentials_for(selected):
    credentials = core.load_json(core.USER_TOKENS_FILE, {}).get(selected)
    if not credentials:
        raise HTTPException(401, "Reconnect your YouTube channel.")
    return core.Credentials.from_authorized_user_info(credentials, core.SCOPES)


def public_profile(selected):
    profile = core.load_json(core.BUSINESS_PROFILE_FILE, {}).get(selected, {})
    return {key: str(profile.get(key, "")) for key in ("business_name", "website", "services", "brand_tone", "ai_rules")}


def valid_image(value):
    return value if isinstance(value, str) and value.startswith("https://") else ""


@app.get("/")
def home():
    return RedirectResponse(PUBLIC_URL + "/test-demo")


@app.get("/api/youtube/session")
def session(request: Request):
    state = workspace(request)
    return {"channels": state["channels"], "selected": state["selected"], "csrf": state["csrf"]}


@app.get("/api/youtube/auth/login")
def login(request: Request):
    if not Path(core.CLIENT_SECRETS_FILE).is_file():
        return RedirectResponse(PUBLIC_URL + "/test-demo?connection=unavailable#channel", status_code=303)
    try:
        flow = core.google_auth_oauthlib.flow.Flow.from_client_secrets_file(
            core.CLIENT_SECRETS_FILE, scopes=core.SCOPES, redirect_uri=CALLBACK_URL)
        url, state = flow.authorization_url(access_type="offline", include_granted_scopes="true", prompt="consent")
        workspace(request)["oauth"] = {"state": state, "flow": flow, "expires": time.time() + 600}
        return RedirectResponse(url)
    except Exception:
        return RedirectResponse(PUBLIC_URL + "/test-demo?connection=unavailable#channel", status_code=303)


@app.get("/api/youtube/auth/callback")
def callback(request: Request, state: str = "", code: str = "", error: str = ""):
    saved = workspace(request).pop("oauth", None)
    if error or not saved or saved["expires"] < time.time() or not secrets.compare_digest(saved["state"], state) or not code:
        return RedirectResponse(PUBLIC_URL + "/test-demo?connection=failed#channel", status_code=303)
    try:
        flow = saved["flow"]
        flow.fetch_token(code=code)
        credentials = flow.credentials
        youtube = core.googleapiclient.discovery.build("youtube", "v3", credentials=credentials)
        result = youtube.channels().list(part="snippet,statistics", mine=True).execute()
        channels = result.get("items", [])
        sanitized = []
        with storage_lock:
            tokens = core.load_json(core.USER_TOKENS_FILE, {})
            for item in channels:
                channel = item["id"]
                tokens[channel] = {
                    "token": credentials.token, "refresh_token": credentials.refresh_token,
                    "token_uri": credentials.token_uri, "client_id": credentials.client_id,
                    "client_secret": credentials.client_secret, "scopes": credentials.scopes,
                }
                snippet, stats = item.get("snippet", {}), item.get("statistics", {})
                sanitized.append({
                    "id": channel, "title": snippet.get("title", ""),
                    "thumbnail": valid_image(snippet.get("thumbnails", {}).get("default", {}).get("url", "")),
                    "subscribers": None if stats.get("hiddenSubscriberCount") else stats.get("subscriberCount"),
                    "views": stats.get("viewCount"), "videos": stats.get("videoCount"),
                })
            core.save_json(core.USER_TOKENS_FILE, tokens)
        current = workspace(request)
        current["channels"], current["selected"] = sanitized, None
        return RedirectResponse(PUBLIC_URL + "/test-demo#channel", status_code=303)
    except Exception:
        # Never send provider exception text, credentials, or raw OAuth responses to the browser.
        return RedirectResponse(PUBLIC_URL + "/test-demo?connection=failed#channel", status_code=303)


class SelectChannel(BaseModel):
    channel: str


@app.post("/api/youtube/channel")
def select_channel(request: Request, payload: SelectChannel):
    authorize_write(request)
    if not any(ch["id"] == payload.channel for ch in workspace(request)["channels"]):
        raise HTTPException(403, "This channel is not connected to your session.")
    workspace(request)["selected"] = payload.channel
    return {"selected": payload.channel}


@app.get("/api/youtube/workspace")
def read_workspace(request: Request):
    selected = channel_id(request)
    return {
        "profile": public_profile(selected),
        "selection": core.load_json(core.TARGET_VIDEOS_FILE, {}).get(selected, []),
        "schedule": core.load_json(core.SCHEDULE_FILE, {}).get(selected, {"mode": "all", "target_date": "", "start_time": "", "end_time": ""}),
        "running": core.active_bots.get(selected, False),
        "automation_ready": callable(getattr(core, "check_and_increment_trial", None)),
    }


class Profile(BaseModel):
    business_name: str = Field(min_length=1, max_length=250)
    website: str = Field(min_length=1, max_length=2000)
    services: str = Field(min_length=1, max_length=10000)
    brand_tone: str = Field(min_length=1, max_length=100)
    ai_rules: str = Field(min_length=1, max_length=10000)


@app.put("/api/youtube/profile")
def save_profile(request: Request, payload: Profile):
    authorize_write(request)
    selected = channel_id(request)
    if urlparse(payload.website).scheme not in ("http", "https"):
        raise HTTPException(422, "Enter a valid HTTP or HTTPS website URL.")
    title = next(ch["title"] for ch in workspace(request)["channels"] if ch["id"] == selected)
    # Preserve the original profile save / upload-fetch behavior and field contract.
    with storage_lock:
        core.save_profile(request=request, channel_id=selected, channel_title=title, **payload.model_dump())
    return {"profile": public_profile(selected)}


@app.get("/api/youtube/videos")
def videos(request: Request):
    selected = channel_id(request)
    try:
        youtube = core.googleapiclient.discovery.build("youtube", "v3", credentials=credentials_for(selected))
        details = youtube.channels().list(part="contentDetails", id=selected).execute()
        items = details.get("items", [])
        if not items:
            return {"videos": []}
        uploads = items[0]["contentDetails"]["relatedPlaylists"]["uploads"]
        result, token = [], None
        while True:
            page = youtube.playlistItems().list(part="snippet", playlistId=uploads, maxResults=50, pageToken=token).execute()
            for item in page.get("items", []):
                snippet = item["snippet"]
                result.append({"video_id": snippet["resourceId"]["videoId"], "title": snippet["title"],
                    "thumbnail": valid_image(snippet.get("thumbnails", {}).get("medium", {}).get("url", ""))})
            token = page.get("nextPageToken")
            if not token:
                break
        # Only IDs returned for this authenticated channel may be selected.
        workspace(request)["video_ids"] = {video["video_id"] for video in result}
        return {"videos": result}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(502, "YouTube content could not be loaded. Try again or reconnect your channel.")


class Selection(BaseModel):
    video_ids: list[str] = Field(max_length=5000)


@app.put("/api/youtube/selection")
def save_selection(request: Request, payload: Selection):
    authorize_write(request)
    selected = channel_id(request)
    if not set(payload.video_ids).issubset(workspace(request).get("video_ids", set())):
        raise HTTPException(422, "Reload content before selecting videos.")
    with storage_lock:
        core.save_selected_videos(channel_id=selected, video_ids=list(dict.fromkeys(payload.video_ids)))
    return {"selection": payload.video_ids}


class Schedule(BaseModel):
    mode: str
    target_date: str = ""
    start_time: str = ""
    end_time: str = ""


@app.put("/api/youtube/schedule")
def save_schedule(request: Request, payload: Schedule):
    authorize_write(request)
    selected = channel_id(request)
    if payload.mode not in ("all", "period"):
        raise HTTPException(422, "Select a valid automation mode.")
    if payload.mode == "period":
        try:
            core.datetime.strptime(payload.target_date, "%Y-%m-%d")
            start = core.datetime.strptime(payload.start_time, "%H:%M")
            end = core.datetime.strptime(payload.end_time, "%H:%M")
            if start >= end:
                raise ValueError()
        except ValueError:
            raise HTTPException(422, "Choose a valid date and an end time later than the start time.")
    with storage_lock:
        return core.update_schedule(channel_id=selected, **payload.model_dump())


class Automation(BaseModel):
    running: bool


@app.put("/api/youtube/automation")
def automation(request: Request, payload: Automation):
    authorize_write(request)
    selected = channel_id(request)
    with storage_lock:
        current = core.active_bots.get(selected, False)
        if payload.running and not callable(getattr(core, "check_and_increment_trial", None)):
            raise HTTPException(503, "Automation is unavailable: the backend trial-check function is missing.")
        if payload.running and not core.load_json(core.TARGET_VIDEOS_FILE, {}).get(selected):
            raise HTTPException(422, "Select target videos before starting automation.")
        if current != payload.running:
            core.toggle_bot(selected)
    return {"running": core.active_bots.get(selected, False)}


@app.get("/api/youtube/activity")
def activity(request: Request):
    selected = channel_id(request)
    logs = core.load_json(core.LOGS_FILE, [])
    return {"running": core.active_bots.get(selected, False),
        "logs": [{k: log.get(k, "") for k in ("author", "comment", "reply", "timestamp")}
                 for log in logs if log.get("channel_id") == selected][:50]}


@app.get("/api/youtube/analytics")
def analytics(request: Request):
    selected = channel_id(request)
    try:
        response = core.video_analytics(request=request, channel_id=selected)
        if not hasattr(response, "context"):
            raise HTTPException(401, "Reconnect your YouTube channel.")
        return {"videos": [{k: v.get(k) for k in ("video_id", "title", "thumbnail", "views", "comments", "likes")}
                           for v in response.context.get("videos", [])],
                "capabilities": {"audience": False, "recommendations": False, "growth": False}}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(502, "Performance data could not be loaded. Try again.")


@app.exception_handler(Exception)
async def unexpected_error(request, exc):
    return JSONResponse(status_code=500, content={"detail": "The YouTube service could not complete this request."})
