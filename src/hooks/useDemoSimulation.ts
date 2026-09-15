import { useEffect, useMemo, useState } from 'react'
import { demoService } from '../services/demoService'
import type { ActivityEvent, ActivityStage, AutomationStatus, Persona } from '../types/demo'

export function useDemoSimulation(contentIds: string[], persona: Persona) {
  const [status, setStatus] = useState<AutomationStatus>('Ready')
  const [events, setEvents] = useState<ActivityEvent[]>([])
  const interactions = useMemo(
    () => demoService.getInteractions(contentIds, persona),
    [contentIds, persona],
  )
  const complete = events.length >= interactions.length * 8

  useEffect(() => {
    if (status !== 'Active') return
    if (complete) {
      setStatus('Complete')
      return
    }
    const tick = events.length
    const stage = (tick % 8) as ActivityStage
    const timeout = window.setTimeout(
      () => {
        const event = demoService.createEvent(interactions[Math.floor(tick / 8)], stage, tick)
        setEvents((previous) => [...previous, event])
      },
      stage === 0 ? 1400 : stage === 5 ? 1600 : 950,
    )
    return () => window.clearTimeout(timeout)
  }, [events.length, status, complete, interactions])

  const leads = useMemo(() => demoService.getLeads(interactions, events), [interactions, events])
  const analytics = useMemo(() => demoService.getAnalytics(leads), [leads])
  return {
    status,
    events,
    leads,
    analytics,
    total: interactions.length,
    start: () => {
      if (!complete) setStatus('Active')
    },
    pause: () => setStatus((previous) => (previous === 'Active' ? 'Paused' : previous)),
    reset: () => {
      setStatus('Ready')
      setEvents([])
    },
  }
}
