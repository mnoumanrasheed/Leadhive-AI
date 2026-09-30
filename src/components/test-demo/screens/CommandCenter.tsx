import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Bot, List, Play, Square, X } from 'lucide-react'
import { getLogs } from '../../../services/youtubeApi'
import type { YouTubeController } from '../../../hooks/useYouTubeIntelligence'
import { ConnectionRequired, EmptyState, Panel, PanelHeader, ScreenHeading, StatusBadge, StepActions } from '../DemoUI'
import type { Activity, Schedule, ScreenNavigation } from '../types'

const POLL_INTERVAL_MS = 5000

export function CommandCenter({ controller: c, navigate }: ScreenNavigation & { controller: YouTubeController }) {
  const [logs, setLogs] = useState<Activity[]>([])
  const [pollError, setPollError] = useState('')
  const [scheduleSaved, setScheduleSaved] = useState(false)
  const confirm = useRef<HTMLDialogElement>(null)
  const channelId = c.channel?.id

  // ── Log polling ────────────────────────────────────────────
  useEffect(() => {
    if (!channelId) {
      setLogs([])
      return
    }
    const abort = new AbortController()
    let timer: ReturnType<typeof setTimeout>

    async function poll() {
      try {
        const result = await getLogs(channelId!, abort.signal)
        if (abort.signal.aborted) return
        setLogs(result.logs.map(entry => ({
          author: entry.author,
          comment: entry.comment,
          reply: entry.reply,
          timestamp: entry.timestamp,
        })))
        c.setBotStateLocal(prev => ({ ...prev, running: result.running, is_running: result.running }))
        setPollError('')
      } catch (err) {
        if (abort.signal.aborted) return
        setPollError(err instanceof Error ? err.message : 'Unable to load activity.')
      } finally {
        if (!abort.signal.aborted) {
          timer = setTimeout(poll, POLL_INTERVAL_MS)
        }
      }
    }

    void poll()
    return () => {
      abort.abort()
      clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId])

  function updateSchedule(key: keyof Schedule, value: Schedule[keyof Schedule]) {
    c.setSchedule(prev => ({ ...prev, [key]: value }))
    setScheduleSaved(false)
  }

  async function toggle(running: boolean) {
    await c.toggleBot(running)
    confirm.current?.close()
  }

  const isRunning = c.botState.running || c.botState.is_running

  return (
    <section className="yi-command-center">
      <ScreenHeading eyebrow="Operations Console" title="AI Command Center">
        Configure engagement rules and monitor live comment processing in real time.
      </ScreenHeading>

      {!c.channel ? (
        <ConnectionRequired />
      ) : (
        <>
          <div className="yi-operations-status" aria-label="Automation status overview">
            <div className="yi-operations-identity">
              <span className="yi-operations-mark">
                <Bot size={20} />
              </span>
              <div>
                <span>Operations Engine</span>
                <strong>{c.channel.title}</strong>
              </div>
            </div>

            <dl>
              <div>
                <dt>Engine Status</dt>
                <dd>
                  <StatusBadge tone={isRunning ? 'success' : 'neutral'}>
                    {isRunning ? 'Active (Running)' : 'Inactive'}
                  </StatusBadge>
                </dd>
              </div>
              <div>
                <dt>Target Videos</dt>
                <dd>{c.selectedVideoIds.length.toLocaleString()} monitored</dd>
              </div>
              <div>
                <dt>Filter Mode</dt>
                <dd>{c.schedule.mode === 'scheduled' ? 'Scheduled Window' : 'All New Comments'}</dd>
              </div>
            </dl>
          </div>

          <div className="yi-operations-center">
            <Panel className="yi-control-rail">
              <PanelHeader title="Automation controls">Configure when and how LeadHive engages.</PanelHeader>

              {c.error && <p className="td-error" role="alert">{c.error}</p>}

              <form
                className="yi-schedule-form"
                onSubmit={async event => {
                  event.preventDefault()
                  if (await c.saveSchedule(c.schedule)) setScheduleSaved(true)
                }}
              >
                <label>
                  <span>Engagement Mode</span>
                  <select
                    value={c.schedule.mode}
                    onChange={e => updateSchedule('mode', e.target.value as 'continuous' | 'scheduled')}
                  >
                    <option value="continuous">Reply to all new comments</option>
                    <option value="scheduled">Scheduled time windows</option>
                  </select>
                </label>

                {c.schedule.mode === 'scheduled' && (
                  <div className="yi-time-window">
                    <label>
                      <span>Timezone</span>
                      <input
                        type="text"
                        value={c.schedule.timezone}
                        onChange={e => updateSchedule('timezone', e.target.value)}
                        placeholder="UTC"
                      />
                    </label>
                  </div>
                )}

                <button className="td-button td-button-secondary" disabled={c.isUpdatingSchedule}>
                  {c.isUpdatingSchedule ? 'Saving...' : 'Save Mode Settings'}
                </button>
                {scheduleSaved && (
                  <p className="yi-saved" role="status">
                    Settings successfully saved.
                  </p>
                )}
              </form>

              <div className="yi-control-divider" />

              <div className="td-engine-status">
                <span>Engine State</span>
                <strong className={'td-status ' + (isRunning ? 'yi-running' : '')}>
                  <i />
                  {isRunning ? 'Processing comments' : 'Automation stopped'}
                </strong>
              </div>

              <div className="yi-control-actions">
                <button
                  className={'button td-button ' + (isRunning ? 'td-button-secondary' : 'td-button-primary')}
                  disabled={c.isUpdatingBot || (!isRunning && !c.selectedVideoIds.length)}
                  onClick={() => (isRunning ? void toggle(false) : confirm.current?.showModal())}
                >
                  {isRunning ? <Square size={15} /> : <Play size={15} />}
                  {isRunning ? 'Stop Automation' : 'Start Automation'}
                </button>
                <button className="td-button td-button-quiet" onClick={() => navigate('analytics')}>
                  View Analytics <ArrowUpRight size={15} />
                </button>
              </div>
            </Panel>

            <Panel className="td-activity">
              <div className="yi-activity-heading">
                <div>
                  <span className="td-panel-kicker">Live Stream</span>
                  <h2>Observed Channel Interactions</h2>
                  <p>Recent comments processed by LeadHive AI on your channel.</p>
                </div>
                <StatusBadge tone={isRunning ? 'success' : 'neutral'}>
                  {isRunning ? 'Monitoring Live' : 'Standby'}
                </StatusBadge>
              </div>

              {pollError && (
                <p className="td-error" role="alert">
                  {pollError}
                </p>
              )}

              <div className="yi-activity-feed">
                {logs.length ? (
                  logs.map((log, index) => (
                    <article className="yi-interaction" key={index}>
                      <header>
                        <div className="yi-interaction-author">
                          <span className="yi-activity-index">{String(index + 1).padStart(2, '0')}</span>
                          <strong>{log.author}</strong>
                        </div>
                        <time>{log.timestamp}</time>
                      </header>
                      <p className="yi-interaction-comment">{log.comment}</p>
                      <div className="yi-interaction-reply">
                        <span>LeadHive AI Response</span>
                        <p>{log.reply}</p>
                      </div>
                    </article>
                  ))
                ) : (
                  <EmptyState icon={<List size={24} />} title="No interactions recorded yet.">
                    Live channel comments and automated LeadHive replies will appear here once the engine processes new activity.
                  </EmptyState>
                )}
              </div>

              <footer className="yi-activity-footer">
                <span>{logs.length.toLocaleString()} recorded interaction{logs.length === 1 ? '' : 's'}</span>
                <span>{isRunning ? `Poller active (${POLL_INTERVAL_MS / 1000}s interval)` : 'Engine idle'}</span>
              </footer>
            </Panel>
          </div>

          <StepActions back={() => navigate('content')} next={() => navigate('dashboard')} label="Return to Overview" />

          <dialog ref={confirm} className="td-dialog" aria-labelledby="start-title">
            <button
              className="td-close td-button td-button-quiet"
              aria-label="Close confirmation"
              onClick={() => confirm.current?.close()}
            >
              <X size={18} />
            </button>
            <p className="td-eyebrow">Public Automation Confirmation</p>
            <h2 id="start-title">Start AI engagement?</h2>
            <p>
              LeadHive AI will begin replying publicly to new comments on your {c.selectedVideoIds.length} selected YouTube videos using your configured brand persona.
            </p>
            <button
              className="button td-button td-button-primary"
              disabled={c.isUpdatingBot}
              onClick={() => void toggle(true)}
            >
              Confirm & Start Replying
            </button>
          </dialog>
        </>
      )}
    </section>
  )
}
