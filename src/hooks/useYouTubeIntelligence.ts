import { useCallback, useEffect, useState } from 'react'
import { youtubeRequest } from '../services/youtubeApi'
import type { Profile, Schedule, Session, Workspace } from '../components/test-demo/types'

export function useYoutubeResource<T>(path: string | null, refresh = 0) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    setData(null); setError('')
    if (!path) { setLoading(false); return }
    setLoading(true)
    youtubeRequest<T>(path, { signal: controller.signal })
      .then(setData)
      .catch(error => { if (!controller.signal.aborted) setError(error instanceof Error ? error.message : 'Unable to load this section.') })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [path, refresh])
  return { data, error, loading }
}

const blankProfile: Profile = { business_name: '', website: '', services: '', brand_tone: '', ai_rules: '' }
const blankSchedule: Schedule = { mode: 'all', target_date: '', start_time: '', end_time: '' }

export function useYouTubeIntelligence() {
  const [refresh, setRefresh] = useState(0)
  const [session, setSession] = useState<Session | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [profile, setProfile] = useState<Profile>(blankProfile)
  const [selection, setSelection] = useState<string[]>([])
  const [schedule, setSchedule] = useState<Schedule>(blankSchedule)
  const [running, setRunning] = useState(false)
  const resource = useYoutubeResource<Session>('/session', refresh)
  const workspace = useYoutubeResource<Workspace>(session?.selected ? '/workspace?channel=' + encodeURIComponent(session.selected) : null, refresh)

  useEffect(() => { if (resource.data) setSession(resource.data) }, [resource.data])
  useEffect(() => {
    if (workspace.data) {
      setProfile(workspace.data.profile); setSelection(workspace.data.selection)
      setSchedule(workspace.data.schedule); setRunning(workspace.data.running)
    } else {
      setProfile(blankProfile); setSelection([]); setSchedule(blankSchedule); setRunning(false)
    }
  }, [workspace.data])

  const mutate = useCallback(async (path: string, body: unknown, method = 'PUT') => {
    setBusy(true); setError('')
    try {
      await youtubeRequest(path + (session?.selected && path !== '/channel' ? '?channel=' + encodeURIComponent(session.selected) : ''), { method, body, csrf: session?.csrf })
      return true
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to save your changes.')
      return false
    } finally { setBusy(false) }
  }, [session?.csrf, session?.selected])

  async function chooseChannel(channel: string) {
    if (await mutate('/channel', { channel }, 'POST')) {
      setSession(current => current ? { ...current, selected: channel } : current)
      setRefresh(value => value + 1)
      return true
    }
    return false
  }

  return {
    session, loading: resource.loading || workspace.loading, error: error || resource.error || workspace.error,
    busy, profile, setProfile, selection, setSelection, schedule, setSchedule, running, setRunning,
    automationReady: workspace.data?.automation_ready ?? false,
    channel: session?.channels.find(channel => channel.id === session.selected) || null,
    chooseChannel, mutate, reload: () => setRefresh(value => value + 1),
  }
}
export type YouTubeController = ReturnType<typeof useYouTubeIntelligence>
