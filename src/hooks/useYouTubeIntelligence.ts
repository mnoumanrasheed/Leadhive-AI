// ============================================================
// useYouTubeIntelligence — Main Test Demo orchestration hook
// ============================================================
// Responsibilities:
//   - Initialize: verify backend health, restore session, load workspace
//   - Expose channel list and active channel selection
//   - Load channel-specific: videos, schedule, bot state, logs, analytics
//   - Provide mutation helpers: saveProfile, saveSelection, saveSchedule,
//     toggleBot, doLogout
//   - Manage loading and error states per operation
//   - Stop stale requests when channel changes (AbortController)
//   - Expose typed state consumed by Test Demo UI screens
// ============================================================

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ApiError,
  getWorkspace,
  getBusinessProfile,
  saveBusinessProfile,
  getVideos,
  saveSelectedVideos,
  getSchedule,
  updateSchedule,
  getBotState,
  setBotState,
  getChannelAnalytics,
  logout,
} from '../services/youtubeApi'
import type {
  Activity,
  BotState,
  Channel,
  Profile,
  Schedule,
  Video,
  VideoMetrics,
} from '../components/test-demo/types'
import {
  defaultBotState,
  defaultProfile,
  defaultSchedule,
} from '../components/test-demo/types'
import type {
  ChannelPayload,
  VideoPayload,
  AnalyticsResponse,
  LogsResponse,
} from '../services/youtubeApi'

// ── Mappers ────────────────────────────────────────────────

function mapChannel(c: ChannelPayload): Channel {
  return {
    id: c.channel_id,
    channel_id: c.channel_id,
    title: c.title || c.channel_title,
    thumbnail: c.thumbnail,
    subscribers: c.subscribers,
    views: c.views,
    videos: c.videos,
  }
}

function mapVideo(v: VideoPayload): Video {
  return {
    video_id: v.video_id,
    title: v.title,
    thumbnail: v.thumbnail,
    description: v.description,
    is_selected: v.is_selected,
    views: v.views,
    likes: v.likes,
    comments: v.comments,
  }
}

function mapVideoMetrics(v: VideoPayload): VideoMetrics {
  return mapVideo(v)
}

function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message
  if (err instanceof Error) return err.message
  return fallback
}

// ── State shape ───────────────────────────────────────────

interface State {
  // Initialization
  isInitializing: boolean
  initError: string

  // Channel management
  channels: Channel[]
  activeChannelId: string | null

  // Per-channel data
  isLoadingWorkspace: boolean
  isLoadingVideos: boolean
  isLoadingSchedule: boolean
  isLoadingBot: boolean
  isLoadingAnalytics: boolean

  // Mutations
  isSavingProfile: boolean
  isSavingSelection: boolean
  isUpdatingSchedule: boolean
  isUpdatingBot: boolean
  isLoggingOut: boolean

  // Data
  profile: Profile
  videos: Video[]
  selectedVideoIds: string[]
  schedule: Schedule
  botState: BotState
  analytics: VideoMetrics[]

  // General error (cleared on each new op)
  error: string
}

const initialState: State = {
  isInitializing: true,
  initError: '',
  channels: [],
  activeChannelId: null,
  isLoadingWorkspace: false,
  isLoadingVideos: false,
  isLoadingSchedule: false,
  isLoadingBot: false,
  isLoadingAnalytics: false,
  isSavingProfile: false,
  isSavingSelection: false,
  isUpdatingSchedule: false,
  isUpdatingBot: false,
  isLoggingOut: false,
  profile: defaultProfile,
  videos: [],
  selectedVideoIds: [],
  schedule: defaultSchedule,
  botState: defaultBotState,
  analytics: [],
  error: '',
}

// ── Hook ─────────────────────────────────────────────────

export function useYouTubeIntelligence() {
  const [state, setState] = useState<State>(initialState)

  // Ref to abort in-flight channel-specific requests on channel switch or unmount
  const channelAbort = useRef<AbortController | null>(null)
  // Ref to abort the initialization request
  const initAbort = useRef<AbortController | null>(null)

  function patch(partial: Partial<State>) {
    setState(prev => ({ ...prev, ...partial }))
  }

  // ── INITIALIZATION ────────────────────────────────────────
  // On mount: call /api/youtube/workspace to see if user is authenticated.
  // If authenticated, load channels and the last-used channel data.
  // If not authenticated, show Connect YouTube state (isInitializing=false, channels=[]).

  const initialize = useCallback(async () => {
    initAbort.current?.abort()
    const abort = new AbortController()
    initAbort.current = abort

    patch({ isInitializing: true, initError: '', error: '' })

    try {
      const workspace = await getWorkspace(abort.signal)

      if (!workspace.authenticated || workspace.channels.length === 0) {
        // Not logged in to YouTube or no channels
        patch({
          isInitializing: false,
          channels: [],
          activeChannelId: null,
          selectedVideoIds: workspace.selected_video_ids ?? [],
        })
        return
      }

      const channels = workspace.channels.map(mapChannel)
      // Prefer channel_id from workspace (last used), else first channel
      const activeChannelId = workspace.channel_id ?? channels[0]?.id ?? null

      patch({
        channels,
        activeChannelId,
        selectedVideoIds: workspace.selected_video_ids ?? [],
        isInitializing: false,
      })
    } catch (err) {
      if (abort.signal.aborted) return
      // 401 means no session — not an error, just show Connect state
      if (err instanceof ApiError && err.status === 401) {
        patch({ isInitializing: false, channels: [], activeChannelId: null })
        return
      }
      patch({
        isInitializing: false,
        initError: errorMessage(err, 'Unable to reach the backend. Check your connection.'),
      })
    }
  }, [])

  useEffect(() => {
    void initialize()
    return () => {
      initAbort.current?.abort()
    }
  }, [initialize])

  // ── CHANNEL-SPECIFIC DATA LOADING ─────────────────────────
  // Fires whenever activeChannelId changes. Cancels previous requests.

  useEffect(() => {
    const channelId = state.activeChannelId
    if (!channelId) return

    // Cancel previous channel's requests
    channelAbort.current?.abort()
    const abort = new AbortController()
    channelAbort.current = abort

    // Clear stale data immediately
    patch({
      profile: defaultProfile,
      videos: [],
      schedule: defaultSchedule,
      botState: defaultBotState,
      analytics: [],
      error: '',
      isLoadingWorkspace: true,
      isLoadingVideos: true,
      isLoadingSchedule: true,
      isLoadingBot: true,
      isLoadingAnalytics: true,
    })

    // Load all channel data in parallel
    void Promise.allSettled([
      // Profile
      getBusinessProfile(channelId, abort.signal)
        .then(data => {
          if (abort.signal.aborted) return
          patch({
            profile: {
              business_name: data.business_name ?? '',
              offer: data.offer ?? '',
              tone: data.tone ?? '',
              faqs: data.faqs ?? [],
              canned_answers: data.canned_answers ?? [],
              links: data.links ?? [],
              avoid_topics: data.avoid_topics ?? [],
            },
            isLoadingWorkspace: false,
          })
        })
        .catch(err => {
          if (abort.signal.aborted) return
          // Not a blocker — just use defaults
          console.warn('[useYouTubeIntelligence] Profile load failed:', err)
          patch({ isLoadingWorkspace: false })
        }),

      // Videos
      getVideos(channelId, false, abort.signal)
        .then(data => {
          if (abort.signal.aborted) return
          const videos = data.videos.map(mapVideo)
          const selectedVideoIds = data.videos.filter(v => v.is_selected).map(v => v.video_id)
          patch({ videos, selectedVideoIds, isLoadingVideos: false })
        })
        .catch(err => {
          if (abort.signal.aborted) return
          console.warn('[useYouTubeIntelligence] Videos load failed:', err)
          patch({ isLoadingVideos: false, error: errorMessage(err, 'Failed to load videos.') })
        }),

      // Schedule
      getSchedule(channelId, abort.signal)
        .then(data => {
          if (abort.signal.aborted) return
          patch({
            schedule: {
              mode: data.mode ?? 'continuous',
              days_of_week: data.days_of_week ?? [],
              time_windows: data.time_windows ?? [],
              timezone: data.timezone ?? 'UTC',
              max_actions_per_hour: data.max_actions_per_hour ?? null,
              max_actions_per_day: data.max_actions_per_day ?? null,
            },
            isLoadingSchedule: false,
          })
        })
        .catch(err => {
          if (abort.signal.aborted) return
          console.warn('[useYouTubeIntelligence] Schedule load failed:', err)
          patch({ isLoadingSchedule: false })
        }),

      // Bot state
      getBotState(channelId, abort.signal)
        .then(data => {
          if (abort.signal.aborted) return
          patch({
            botState: {
              running: data.running,
              is_running: data.is_running,
              status: data.status,
              desired_running: data.desired_running,
            },
            isLoadingBot: false,
          })
        })
        .catch(err => {
          if (abort.signal.aborted) return
          console.warn('[useYouTubeIntelligence] Bot state load failed:', err)
          patch({ isLoadingBot: false })
        }),

      // Analytics
      getChannelAnalytics(channelId, abort.signal)
        .then((data: AnalyticsResponse) => {
          if (abort.signal.aborted) return
          patch({
            analytics: data.videos.map(mapVideoMetrics),
            isLoadingAnalytics: false,
          })
        })
        .catch(err => {
          if (abort.signal.aborted) return
          console.warn('[useYouTubeIntelligence] Analytics load failed:', err)
          patch({ isLoadingAnalytics: false })
        }),
    ])

    return () => {
      abort.abort()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeChannelId])

  // ── MUTATIONS ─────────────────────────────────────────────

  const saveProfile = useCallback(async (profileData: Profile): Promise<boolean> => {
    const channelId = state.activeChannelId
    if (!channelId) return false
    patch({ isSavingProfile: true, error: '' })
    try {
      const result = await saveBusinessProfile(channelId, {
        business_name: profileData.business_name,
        offer: profileData.offer,
        tone: profileData.tone,
        faqs: profileData.faqs,
        canned_answers: profileData.canned_answers,
        links: profileData.links,
        avoid_topics: profileData.avoid_topics,
      })
      patch({
        profile: {
          business_name: result.business_name ?? '',
          offer: result.offer ?? '',
          tone: result.tone ?? '',
          faqs: result.faqs ?? [],
          canned_answers: result.canned_answers ?? [],
          links: result.links ?? [],
          avoid_topics: result.avoid_topics ?? [],
        },
        isSavingProfile: false,
      })
      return true
    } catch (err) {
      patch({
        isSavingProfile: false,
        error: errorMessage(err, 'Failed to save profile.'),
      })
      return false
    }
  }, [state.activeChannelId])

  const saveSelection = useCallback(async (videoIds: string[]): Promise<boolean> => {
    const channelId = state.activeChannelId
    if (!channelId) return false
    patch({ isSavingSelection: true, error: '' })
    try {
      const result = await saveSelectedVideos(channelId, videoIds)
      patch({ selectedVideoIds: result.selected_video_ids, isSavingSelection: false })
      return true
    } catch (err) {
      patch({
        isSavingSelection: false,
        error: errorMessage(err, 'Failed to save video selection.'),
      })
      return false
    }
  }, [state.activeChannelId])

  const saveSchedule = useCallback(async (schedule: Schedule): Promise<boolean> => {
    const channelId = state.activeChannelId
    if (!channelId) return false
    patch({ isUpdatingSchedule: true, error: '' })
    try {
      const result = await updateSchedule(channelId, {
        mode: schedule.mode,
        days_of_week: schedule.days_of_week,
        time_windows: schedule.time_windows,
        timezone: schedule.timezone,
        max_actions_per_hour: schedule.max_actions_per_hour,
        max_actions_per_day: schedule.max_actions_per_day,
      })
      patch({
        schedule: {
          mode: result.mode ?? 'continuous',
          days_of_week: result.days_of_week ?? [],
          time_windows: result.time_windows ?? [],
          timezone: result.timezone ?? 'UTC',
          max_actions_per_hour: result.max_actions_per_hour ?? null,
          max_actions_per_day: result.max_actions_per_day ?? null,
        },
        isUpdatingSchedule: false,
      })
      return true
    } catch (err) {
      patch({
        isUpdatingSchedule: false,
        error: errorMessage(err, 'Failed to update schedule.'),
      })
      return false
    }
  }, [state.activeChannelId])

  const toggleBot = useCallback(async (running: boolean): Promise<boolean> => {
    const channelId = state.activeChannelId
    if (!channelId) return false
    patch({ isUpdatingBot: true, error: '' })
    try {
      const result = await setBotState(channelId, running)
      patch({
        botState: {
          running: result.running,
          is_running: result.is_running,
          status: result.status,
          desired_running: result.desired_running,
        },
        isUpdatingBot: false,
      })
      return true
    } catch (err) {
      patch({
        isUpdatingBot: false,
        error: errorMessage(err, 'Failed to update bot state.'),
      })
      return false
    }
  }, [state.activeChannelId])

  const doLogout = useCallback(async (): Promise<void> => {
    patch({ isLoggingOut: true, error: '' })
    try {
      await logout()
    } catch (err) {
      console.warn('[useYouTubeIntelligence] Logout error (continuing anyway):', err)
    } finally {
      // Clear all state back to disconnected
      setState({
        ...initialState,
        isInitializing: false,
      })
    }
  }, [])

  const selectChannel = useCallback((channelId: string) => {
    patch({ activeChannelId: channelId })
  }, [])

  const reload = useCallback(() => {
    void initialize()
  }, [initialize])

  // ── Derived state ────────────────────────────────────────

  const channel =
    state.channels.find(c => c.id === state.activeChannelId) ?? null

  const isLoading =
    state.isInitializing ||
    state.isLoadingWorkspace ||
    state.isLoadingVideos

  const isBusy =
    state.isSavingProfile ||
    state.isSavingSelection ||
    state.isUpdatingSchedule ||
    state.isUpdatingBot ||
    state.isLoggingOut

  // ── Setters for local state (used by form screens) ────────

  const setProfile = useCallback((profile: Profile | ((prev: Profile) => Profile)) => {
    setState(prev => ({
      ...prev,
      profile: typeof profile === 'function' ? profile(prev.profile) : profile,
    }))
  }, [])

  const setSchedule = useCallback((schedule: Schedule | ((prev: Schedule) => Schedule)) => {
    setState(prev => ({
      ...prev,
      schedule: typeof schedule === 'function' ? schedule(prev.schedule) : schedule,
    }))
  }, [])

  const setSelectedVideoIds = useCallback(
    (ids: string[] | ((prev: string[]) => string[])) => {
      setState(prev => ({
        ...prev,
        selectedVideoIds: typeof ids === 'function' ? ids(prev.selectedVideoIds) : ids,
      }))
    },
    [],
  )

  const setBotStateLocal = useCallback((bs: BotState | ((prev: BotState) => BotState)) => {
    setState(prev => ({
      ...prev,
      botState: typeof bs === 'function' ? bs(prev.botState) : bs,
    }))
  }, [])

  return {
    // Status
    isInitializing: state.isInitializing,
    isLoading,
    isBusy,
    initError: state.initError,
    error: state.error,

    // Loading granularity
    isLoadingVideos: state.isLoadingVideos,
    isLoadingSchedule: state.isLoadingSchedule,
    isLoadingBot: state.isLoadingBot,
    isLoadingAnalytics: state.isLoadingAnalytics,
    isUpdatingBot: state.isUpdatingBot,
    isUpdatingSchedule: state.isUpdatingSchedule,
    isSavingProfile: state.isSavingProfile,
    isSavingSelection: state.isSavingSelection,
    isLoggingOut: state.isLoggingOut,

    // Data
    channels: state.channels,
    activeChannelId: state.activeChannelId,
    channel,
    profile: state.profile,
    setProfile,
    videos: state.videos,
    selectedVideoIds: state.selectedVideoIds,
    setSelectedVideoIds,
    schedule: state.schedule,
    setSchedule,
    botState: state.botState,
    setBotStateLocal,
    analytics: state.analytics,

    // Actions
    selectChannel,
    saveProfile,
    saveSelection,
    saveSchedule,
    toggleBot,
    doLogout,
    reload,
  }
}

export type YouTubeController = ReturnType<typeof useYouTubeIntelligence>
