import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Bot, List, Play, Square, X } from 'lucide-react'
import { youtubeRequest } from '../../../services/youtubeApi'
import type { YouTubeController } from '../../../hooks/useYouTubeIntelligence'
import { ConnectionRequired, EmptyState, ScreenHeading, StepActions } from '../DemoUI'
import type { Activity, Schedule, ScreenNavigation } from '../types'

export function CommandCenter({ controller: c, navigate }: ScreenNavigation & { controller: YouTubeController }) {
  const [logs, setLogs] = useState<Activity[]>([])
  const [pollError, setPollError] = useState('')
  const [saved, setSaved] = useState(false)
  const confirm = useRef<HTMLDialogElement>(null)
  const selected = c.channel?.id
  useEffect(() => {
    if (!selected) return
    const abort = new AbortController()
    let timer: ReturnType<typeof setTimeout>
    async function poll() {
      try {
        const result = await youtubeRequest<{ logs: Activity[]; running: boolean }>('/activity?channel=' + encodeURIComponent(selected!), { signal: abort.signal })
        setLogs(result.logs); c.setRunning(result.running); setPollError('')
      } catch (error) {
        if (!abort.signal.aborted) setPollError(error instanceof Error ? error.message : 'Unable to load activity.')
      } finally { if (!abort.signal.aborted) timer = setTimeout(poll, 5000) }
    }
    void poll()
    return () => { abort.abort(); clearTimeout(timer) }
  }, [selected, c.setRunning])
  function update(key: keyof Schedule, value: string) { c.setSchedule({ ...c.schedule, [key]: value }); setSaved(false) }
  async function toggle(running: boolean) {
    if (await c.mutate('/automation', { running })) c.setRunning(running)
    confirm.current?.close()
  }
  return <section className="yi-command-center"><ScreenHeading eyebrow="AI engagement" title="Command Center">Manage your automation and follow real channel interactions.</ScreenHeading>
    {!c.channel ? <ConnectionRequired /> : <>
      <div className="yi-operations-status" aria-label="Automation status overview">
        <div className="yi-operations-identity"><span className="yi-operations-mark"><Bot size={20} /></span><div><span>AI operations center</span><strong>{c.channel.title}</strong></div></div>
        <dl><div><dt>Engine</dt><dd className={c.running ? 'is-running' : ''}><i />{c.running ? 'Running' : 'Inactive'}</dd></div><div><dt>Target videos</dt><dd>{c.selection.length.toLocaleString()}</dd></div><div><dt>Mode</dt><dd>{c.schedule.mode === 'period' ? 'Scheduled window' : 'All comments'}</dd></div></dl>
      </div>

      <div className="td-operations yi-operations-center"><aside className="td-control-rail"><div className="yi-control-heading"><span>Automation controls</span><p>Configure when LeadHive can engage.</p></div>
        <form className="yi-schedule-form" onSubmit={async event => { event.preventDefault(); if (await c.mutate('/schedule', c.schedule)) setSaved(true) }}>
          <label>Automation Mode<select value={c.schedule.mode} onChange={e => update('mode', e.target.value)}><option value="all">Reply to all comments</option><option value="period">Date & time filter</option></select></label>
          {c.schedule.mode === 'period' && <div className="yi-time-window"><label>Comment date (UTC)<input type="date" required value={c.schedule.target_date} onChange={e => update('target_date', e.target.value)} /></label><div><label>Start time (UTC)<input type="time" required value={c.schedule.start_time} onChange={e => update('start_time', e.target.value)} /></label><label>End time (UTC)<input type="time" required value={c.schedule.end_time} onChange={e => update('end_time', e.target.value)} /></label></div></div>}
          <button className="td-button td-button-secondary" disabled={c.busy}>Save mode settings</button>{saved && <p className="yi-saved" role="status">Settings saved.</p>}
        </form>
        <div className="yi-control-divider" />
        <div className="td-engine-status"><span>Automation state</span><strong className={'td-status ' + (c.running ? 'yi-running' : '')}><i />{c.running ? 'Running' : 'Not running'}</strong></div>
        {!c.automationReady && <p className="yi-service-note">Automation is unavailable while the backend trial check is unconfigured.</p>}
        <div className="yi-control-actions"><button className="button td-button td-button-primary" disabled={c.busy || (!c.running && (!c.automationReady || !c.selection.length))} onClick={() => c.running ? void toggle(false) : confirm.current?.showModal()}>{c.running ? <Square size={15} /> : <Play size={15} />}{c.running ? 'Stop Automation' : 'Start Automation'}</button>
        <button className="td-button td-button-quiet" onClick={() => navigate('analytics')}>View Analytics <ArrowUpRight size={16} /></button></div>
      </aside><section className="td-activity"><div className="yi-activity-heading"><div><span className="yi-panel-kicker">Observed interactions</span><h2>Live Activity</h2><p>Real comments and LeadHive replies from this channel.</p></div><span className={'yi-live-status ' + (c.running ? 'is-running' : '')}><i />{c.running ? 'Monitoring channel' : 'Automation inactive'}</span></div>
        {pollError && <p className="yi-error" role="alert">{pollError}</p>}
        <div className="yi-activity-feed">{logs.length ? logs.map((log, index) => <article className="yi-interaction" key={index}><header><div><span className="yi-activity-index">{String(index + 1).padStart(2, '0')}</span><strong>{log.author}</strong></div><time>{log.timestamp}</time></header><p>{log.comment}</p><div><span>LeadHive reply</span><p>{log.reply}</p></div></article>) : <EmptyState icon={<List size={24} />} title="No activity yet.">Live interactions will appear here when the automation engine begins processing comments.</EmptyState>}</div>
        <footer className="yi-activity-footer"><span>{logs.length.toLocaleString()} recorded {logs.length === 1 ? 'interaction' : 'interactions'}</span><span>{c.running ? 'Live monitoring active' : 'Waiting for automation'}</span></footer>
      </section></div>
      <StepActions back={() => navigate('content')} next={() => navigate('dashboard')} label="Return to Overview" />
      <dialog ref={confirm} className="td-dialog" aria-labelledby="start-title"><button className="td-close td-button td-button-quiet" aria-label="Close confirmation" onClick={() => confirm.current?.close()}><X size={18} /></button><p className="td-eyebrow">Public channel replies</p><h2 id="start-title">Start AI engagement?</h2><p>LeadHive will post replies to comments on your selected YouTube videos using your saved persona and automation settings.</p><button className="button td-button td-button-primary" disabled={c.busy} onClick={() => void toggle(true)}>Start replying</button></dialog>
    </>}
  </section>
}