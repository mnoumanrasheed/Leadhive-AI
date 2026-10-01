// ============================================================
// CENTRALIZED YOUTUBE / AI-ENGAGEMENT BACKEND API SERVICE
// ============================================================
// ONE canonical source for the backend URL.
// VITE_YOUTUBE_API_BASE_URL must be set in .env.local for local dev
// and as an environment variable on every deployment target.
// ============================================================

const API_BASE_URL =
  (import.meta.env.VITE_YOUTUBE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? ''

// ============================================================
// ERROR CLASS
// ============================================================

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ============================================================
// TYPESCRIPT TYPES — EXACT MATCH TO OPENAPI SCHEMAS
// ============================================================

export interface HealthResponse {
  status?: string
  [key: string]: unknown
}

export interface AuthUser {
  [key: string]: unknown
}

export interface YouTubeSession {
  [key: string]: unknown
}

export interface ChannelPayload {
  id: string
  channel_id: string
  title: string
  channel_title: string
  thumbnail: string
  subscribers: number | null
  views: number | null
  videos: number | null
}

export interface WorkspaceResponse {
  authenticated: boolean
  channels: ChannelPayload[]
  channel_id: string | null
  selected_video_ids: string[]
}

export interface DashboardResponse {
  channel_id: string
  channel: ChannelPayload
  is_running: boolean
  selected_video_ids: string[]
}

export interface FAQItem {
  question: string
  answer: string
}

export interface BusinessProfileInput {
  business_name?: string
  offer?: string
  tone?: string
  faqs?: FAQItem[]
  canned_answers?: string[]
  links?: string[]
  avoid_topics?: string[]
}

export interface BusinessProfileResponse extends BusinessProfileInput {
  channel_id: string
}

export interface TimeWindow {
  start: string
  end: string
}

export interface ScheduleInput {
  mode?: 'continuous' | 'scheduled'
  days_of_week?: number[]
  time_windows?: TimeWindow[]
  timezone?: string
  max_actions_per_hour?: number | null
  max_actions_per_day?: number | null
}

export interface ScheduleResponse extends ScheduleInput {
  channel_id: string
}

export interface VideoPayload {
  video_id: string
  title: string
  thumbnail: string
  description: string
  is_selected: boolean
  views: number
  likes: number
  comments: number
}

export interface VideosResponse {
  channel_id: string
  videos: VideoPayload[]
}

export interface SelectionRequest {
  channel_id: string
  video_ids?: string[]
}

export interface SelectionResponse {
  channel_id: string
  selected_video_ids: string[]
}

export interface VideoDescriptionUpdate {
  description: string
}

export interface VideoDescriptionResponse {
  channel_id: string
  video_id: string
  description: string
}

export interface LatestVideoComment {
  comment_id: string
  author: string
  author_thumbnail: string
  text: string
  like_count: number
  published_at: string | null
}

export interface LatestVideoPayload {
  video_id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  published_at: string | null
  views: number
  likes: number
  comments: number
  recent_comments: LatestVideoComment[]
}

export interface LatestVideoResponse {
  channel_id: string
  video: LatestVideoPayload | null
}

export interface ManualReplyRequest {
  comment_id: string
  comment_text: string
  author?: string
}

export interface ManualReplyResponse {
  comment_id: string
  reply_text: string
  posted: boolean
}

export interface BotStateUpdate {
  running: boolean
}

export interface BotStateResponse {
  status: string
  running: boolean
  is_running: boolean
  desired_running: boolean
}

export interface LogEntry {
  channel_id: string
  author: string
  comment: string
  reply: string
  timestamp: string
}

export interface LogsResponse {
  running: boolean
  logs: LogEntry[]
}

export interface AnalyticsTotals {
  videos: number
  views: number
  likes: number
  comments: number
}

export interface AnalyticsResponse {
  channel_id: string
  totals: AnalyticsTotals
  videos: VideoPayload[]
}

export interface DemoConfigResponse {
  channel_id: string
  channel_name: string
  video_id: string
}

export interface DemoReplyResponse {
  reply_text: string
}

export interface DemoPostCommentResponse {
  comment_id: string
  comment_text: string
  reply_id: string
  reply_text: string
}

// ============================================================
// REQUEST HELPER
// ============================================================

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: Record<string, string | boolean | number | undefined>
  signal?: AbortSignal
}

function extractErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    if (typeof obj['detail'] === 'string') return obj['detail']
    if (typeof obj['message'] === 'string') return obj['message']
    if (typeof obj['error'] === 'string') return obj['error']
  }
  return fallback
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return null
  const ct = response.headers.get('content-type') ?? ''
  if (!ct.includes('application/json')) return text
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError(
      'VITE_YOUTUBE_API_BASE_URL is not configured. Add it to your .env.local file.',
      0,
    )
  }

  // Build URL - prevent double slashes
  const cleanPath = path.startsWith('/') ? path : '/' + path
  let url = API_BASE_URL + cleanPath

  // Append query string
  if (options.query) {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(options.query)) {
      if (value !== undefined) params.set(key, String(value))
    }
    const qs = params.toString()
    if (qs) url += '?' + qs
  }

  let response: Response
  try {
    response = await fetch(url, {
      method: options.method ?? 'GET',
      // credentials: 'include' sends session cookies cross-origin.
      // Backend must have allow_credentials=True and explicit allowed origins.
      credentials: 'include',
      signal: options.signal,
      headers: {
        Accept: 'application/json',
        ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
    })
  } catch (networkError) {
    if (options.signal?.aborted) throw networkError
    console.error('[API] Network error', { url, error: networkError })
    throw new ApiError(
      'Cannot reach the backend. Check that VITE_YOUTUBE_API_BASE_URL is correct and the backend is running.',
      0,
    )
  }

  const data = await parseBody(response)

  if (!response.ok) {
    const fallback =
      response.status === 401
        ? 'Your session has expired. Please reconnect your YouTube account.'
        : response.status === 403
          ? 'Access denied.'
          : response.status === 404
            ? `Endpoint not found: ${path}`
            : response.status === 422
              ? 'The request was rejected by the backend (validation error).'
              : response.status >= 500
                ? 'The backend encountered an internal error. Please try again later.'
                : 'An unexpected error occurred.'
    console.error('[API] Non-OK response', { url, status: response.status, body: data })
    throw new ApiError(extractErrorMessage(data, fallback), response.status)
  }

  return data as T
}

// ============================================================
// OAUTH - browser redirect (NOT a JSON API call)
// ============================================================

/**
 * Initiates YouTube OAuth by navigating the browser to the backend login URL.
 * This MUST be a browser navigation - the backend returns an HTTP redirect to Google.
 */
export function initiateYouTubeOAuth(): void {
  if (!API_BASE_URL) {
    console.error('[API] VITE_YOUTUBE_API_BASE_URL is not set - cannot initiate OAuth.')
    return
  }
  window.location.assign(`${API_BASE_URL}/auth/youtube/login`)
}

// ============================================================
// TYPED SERVICE FUNCTIONS
// ============================================================

// Health
export function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
  return apiRequest<HealthResponse>('/health', { signal })
}

// Auth
export function getCurrentUser(signal?: AbortSignal): Promise<AuthUser> {
  return apiRequest<AuthUser>('/api/auth/me', { signal })
}

export function getYouTubeSession(signal?: AbortSignal): Promise<YouTubeSession> {
  return apiRequest<YouTubeSession>('/api/youtube/session', { signal })
}

export async function getChannels(signal?: AbortSignal): Promise<ChannelPayload[]> {
  const res = await apiRequest<{ channels: ChannelPayload[] }>('/api/channels', { signal })
  return res.channels ?? []
}

export function logout(signal?: AbortSignal): Promise<void> {
  return apiRequest<void>('/api/auth/logout', { method: 'POST', signal })
}

// Workspace
export function getWorkspace(signal?: AbortSignal): Promise<WorkspaceResponse> {
  return apiRequest<WorkspaceResponse>('/api/youtube/workspace', { signal })
}

export function getDashboard(channelId: string, signal?: AbortSignal): Promise<DashboardResponse> {
  return apiRequest<DashboardResponse>(`/dashboard/${encodeURIComponent(channelId)}`, { signal })
}

// Business Profile (Persona)
export function getBusinessProfile(
  channelId: string,
  signal?: AbortSignal,
): Promise<BusinessProfileResponse> {
  return apiRequest<BusinessProfileResponse>(
    `/api/channels/${encodeURIComponent(channelId)}/profile`,
    { signal },
  )
}

export function saveBusinessProfile(
  channelId: string,
  payload: BusinessProfileInput,
  signal?: AbortSignal,
): Promise<BusinessProfileResponse> {
  return apiRequest<BusinessProfileResponse>(
    `/api/channels/${encodeURIComponent(channelId)}/profile`,
    { method: 'PUT', body: payload, signal },
  )
}

// Videos
export function getVideos(
  channelId: string,
  refresh = false,
  signal?: AbortSignal,
): Promise<VideosResponse> {
  return apiRequest<VideosResponse>(`/api/youtube/videos/${encodeURIComponent(channelId)}`, {
    query: { refresh },
    signal,
  })
}

export function saveSelectedVideos(
  channelId: string,
  videoIds: string[],
  signal?: AbortSignal,
): Promise<SelectionResponse> {
  const body: SelectionRequest = { channel_id: channelId, video_ids: videoIds }
  return apiRequest<SelectionResponse>('/save-selected-videos', { method: 'POST', body, signal })
}

export function getLatestVideo(
  channelId: string,
  signal?: AbortSignal,
): Promise<LatestVideoResponse> {
  return apiRequest<LatestVideoResponse>(
    `/api/youtube/latest-video/${encodeURIComponent(channelId)}`,
    { signal },
  )
}

export function sendManualReply(
  channelId: string,
  payload: ManualReplyRequest,
  signal?: AbortSignal,
): Promise<ManualReplyResponse> {
  return apiRequest<ManualReplyResponse>(
    `/api/youtube/reply/${encodeURIComponent(channelId)}`,
    { method: 'POST', body: payload, signal },
  )
}

export function updateVideoDescription(
  channelId: string,
  videoId: string,
  description: string,
  signal?: AbortSignal,
): Promise<VideoDescriptionResponse> {
  const body: VideoDescriptionUpdate = { description }
  return apiRequest<VideoDescriptionResponse>(
    `/api/channels/${encodeURIComponent(channelId)}/videos/${encodeURIComponent(videoId)}/description`,
    { method: 'PUT', body, signal },
  )
}

// Schedule
export function getSchedule(channelId: string, signal?: AbortSignal): Promise<ScheduleResponse> {
  return apiRequest<ScheduleResponse>(
    `/api/channels/${encodeURIComponent(channelId)}/schedule`,
    { signal },
  )
}

export function updateSchedule(
  channelId: string,
  payload: ScheduleInput,
  signal?: AbortSignal,
): Promise<ScheduleResponse> {
  return apiRequest<ScheduleResponse>(
    `/api/channels/${encodeURIComponent(channelId)}/schedule`,
    { method: 'PUT', body: payload, signal },
  )
}

// Bot
export function getBotState(channelId: string, signal?: AbortSignal): Promise<BotStateResponse> {
  return apiRequest<BotStateResponse>(`/api/channels/${encodeURIComponent(channelId)}/bot`, {
    signal,
  })
}

export function setBotState(
  channelId: string,
  running: boolean,
  signal?: AbortSignal,
): Promise<BotStateResponse> {
  const body: BotStateUpdate = { running }
  return apiRequest<BotStateResponse>(`/api/channels/${encodeURIComponent(channelId)}/bot`, {
    method: 'PUT',
    body,
    signal,
  })
}

// Logs
export function getLogs(channelId: string, signal?: AbortSignal): Promise<LogsResponse> {
  return apiRequest<LogsResponse>(`/api/logs/${encodeURIComponent(channelId)}`, { signal })
}

// Analytics
export function getChannelAnalytics(
  channelId: string,
  signal?: AbortSignal,
): Promise<AnalyticsResponse> {
  return apiRequest<AnalyticsResponse>(`/analytics/${encodeURIComponent(channelId)}`, { signal })
}

export function getAllChannelAnalytics(
  refresh = false,
  signal?: AbortSignal,
): Promise<unknown> {
  return apiRequest<unknown>('/api/analytics/channels', { query: { refresh }, signal })
}

export function getVideoAnalytics(
  channelId: string,
  videoId: string,
  signal?: AbortSignal,
): Promise<unknown> {
  return apiRequest<unknown>(
    `/api/analytics/channels/${encodeURIComponent(channelId)}/videos/${encodeURIComponent(videoId)}`,
    { signal },
  )
}

// Demo endpoints
export function getDemoConfig(signal?: AbortSignal): Promise<DemoConfigResponse> {
  return apiRequest<DemoConfigResponse>('/api/demo/config', { signal })
}

export function sendDemoReply(
  commentText: string,
  signal?: AbortSignal,
): Promise<DemoReplyResponse> {
  return apiRequest<DemoReplyResponse>('/api/demo/reply', {
    method: 'POST',
    body: { comment_text: commentText },
    signal,
  })
}

export function postDemoComment(
  commentText: string,
  signal?: AbortSignal,
): Promise<DemoPostCommentResponse> {
  return apiRequest<DemoPostCommentResponse>('/api/demo/comment', {
    method: 'POST',
    body: { comment_text: commentText },
    signal,
  })
}
