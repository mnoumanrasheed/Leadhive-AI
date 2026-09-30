// ============================================================
// TEST DEMO UI TYPES
// ============================================================
// These types represent the VIEW MODEL used by Test Demo UI components.
// Where backend DTOs differ from what the UI needs, mapping happens
// in useYouTubeIntelligence.ts — NOT inside components.
// ============================================================

export type DemoScreen =
  | 'platform'
  | 'channel'
  | 'persona'
  | 'content'
  | 'dashboard'
  | 'command-center'
  | 'analytics'

/** Channel as shown in the Test Demo UI. */
export interface Channel {
  id: string
  channel_id: string
  title: string
  thumbnail: string
  subscribers: number | null
  views: number | null
  videos: number | null
}

/**
 * AI Persona / Business Profile.
 * Maps to BusinessProfileInput on the backend.
 * Frontend uses a simplified form; additional fields (faqs, links, etc.)
 * can be extended later.
 */
export interface Profile {
  business_name: string
  offer: string
  tone: string
  faqs: Array<{ question: string; answer: string }>
  canned_answers: string[]
  links: string[]
  avoid_topics: string[]
}

/** Video as shown in the content library. */
export interface Video {
  video_id: string
  title: string
  thumbnail: string
  description: string
  is_selected: boolean
  views: number
  likes: number
  comments: number
}

/** Per-video metrics for the analytics/dashboard screens. */
export type VideoMetrics = Video

/**
 * Schedule configuration (matches backend ScheduleInput / ScheduleResponse).
 */
export interface Schedule {
  mode: 'continuous' | 'scheduled'
  days_of_week: number[]
  time_windows: Array<{ start: string; end: string }>
  timezone: string
  max_actions_per_hour: number | null
  max_actions_per_day: number | null
}

/** A single activity log entry (matches backend LogEntry). */
export interface Activity {
  author: string
  comment: string
  reply: string
  timestamp: string
}

/** Bot / automation state (matches backend BotStateResponse). */
export interface BotState {
  running: boolean
  is_running: boolean
  status: string
  desired_running: boolean
}

export interface ScreenNavigation {
  navigate: (screen: DemoScreen) => void
}

export const screenLabels: Record<DemoScreen, string> = {
  platform: 'YouTube Intelligence',
  channel: 'Channel',
  persona: 'AI Persona',
  content: 'Video Library',
  dashboard: 'Overview',
  'command-center': 'Command Center',
  analytics: 'Analytics',
}

export function screenFromHash(): DemoScreen {
  const candidate = window.location.hash.slice(1)
  return Object.hasOwn(screenLabels, candidate) ? (candidate as DemoScreen) : 'platform'
}

// ============================================================
// DEFAULT VALUES
// ============================================================

export const defaultProfile: Profile = {
  business_name: '',
  offer: '',
  tone: '',
  faqs: [],
  canned_answers: [],
  links: [],
  avoid_topics: [],
}

export const defaultSchedule: Schedule = {
  mode: 'continuous',
  days_of_week: [],
  time_windows: [],
  timezone: 'UTC',
  max_actions_per_hour: null,
  max_actions_per_day: null,
}

export const defaultBotState: BotState = {
  running: false,
  is_running: false,
  status: 'stopped',
  desired_running: false,
}
