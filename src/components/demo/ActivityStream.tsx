import { Youtube } from './PlatformIcons'
import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowDown, CheckCheck, CircleCheck, MessageSquare, Pause, Sparkles } from 'lucide-react'
import { activityStageLabels, demoContents } from '../../data/demoData'
import type { AutomationStatus, Lead } from '../../types/demo'
import { AiOrb, StatusBadge } from './DemoUI'

export function ActivityStream({
  leads,
  status,
  eventCount,
  total,
}: {
  leads: Lead[]
  status: AutomationStatus
  eventCount: number
  total: number
}) {
  const viewport = useRef<HTMLDivElement>(null)
  const follow = useRef(true)
  const [following, setFollowing] = useState(true)
  const reducedMotion = useReducedMotion()
  useEffect(() => {
    const element = viewport.current
    if (!element || !follow.current) return
    const scroll = () =>
      element.scrollTo({
        top: element.scrollHeight,
        behavior: reducedMotion ? 'instant' : 'smooth',
      })
    scroll()
    const observer = new ResizeObserver(scroll)
    if (element.firstElementChild) observer.observe(element.firstElementChild)
    return () => observer.disconnect()
  }, [eventCount, reducedMotion])
  useEffect(() => {
    if (eventCount === 0) {
      follow.current = true
      setFollowing(true)
    }
  }, [eventCount])
  function updateFollow() {
    const element = viewport.current
    if (!element) return
    follow.current = element.scrollHeight - element.scrollTop - element.clientHeight < 100
    setFollowing(follow.current)
  }
  function jumpToLatest() {
    follow.current = true
    setFollowing(true)
    viewport.current?.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: reducedMotion ? 'instant' : 'smooth',
    })
  }
  const latest = leads.at(-1)
  return (
    <section className="td-stream td-panel" aria-labelledby="td-live-title">
      <div className="td-stream-header">
        <h2 id="td-live-title">
          <MessageSquare size={18} />
          Live Activity
        </h2>
        <span className={'td-live-label ' + (status === 'Active' ? 'is-active' : '')}>
          <i />
          {status === 'Active' ? 'LIVE SIMULATION' : status.toUpperCase()}
        </span>
      </div>
      <div className="td-stream-subheader">
        <span>YouTube engagement feed</span>
        <span>
          {leads.length} / {total} conversations
        </span>
      </div>
      <p className="td-sr-only" role="status" aria-live="polite">
        {status === 'Paused'
          ? 'Automation paused.'
          : latest
            ? latest.name + ': ' + activityStageLabels[latest.stage]
            : 'Ready to start the AI demo.'}
      </p>
      <div
        className="td-stream-viewport"
        ref={viewport}
        tabIndex={0}
        aria-label="Scrollable conversation activity"
        onWheel={updateFollow}
        onTouchMove={updateFollow}
        onKeyUp={updateFollow}
      >
        <div className="td-stream-items">
          {leads.length === 0 ? (
            <div className="td-stream-empty">
              <AiOrb compact />
              <span className="td-badge td-badge-blue">
                {status === 'Active'
                  ? 'Listening to your demo channel'
                  : 'Your AI workspace is ready'}
              </span>
              <h3>
                {status === 'Active'
                  ? 'Your first conversation is on its way.'
                  : 'Great conversations start here.'}
              </h3>
              <p>
                {status === 'Active'
                  ? 'Watching your selected content for a new comment…'
                  : 'Start the demo to watch LeadHive turn comments into thoughtful replies and qualified opportunities.'}
              </p>
              <div className="td-empty-preview">
                <MessageSquare size={15} />
                <span>Comment</span>
                <span>→</span>
                <Sparkles size={15} />
                <span>Intelligence</span>
                <span>→</span>
                <CircleCheck size={15} />
                <span>Opportunity</span>
              </div>
            </div>
          ) : (
            leads.map((lead, index) => (
              <motion.article
                layout={!reducedMotion}
                key={lead.id}
                className="td-activity-card"
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="td-activity-heading">
                  <span className={'td-avatar td-avatar-' + (index % 4)}>{lead.initials}</span>
                  <div>
                    <h3>{lead.name}</h3>
                    <span>
                      <Youtube size={12} />
                      {demoContents.find((item) => item.id === lead.contentId)?.title}
                    </span>
                  </div>
                  <time dateTime={lead.timestamp}>
                    {lead.timestamp.slice(11, 19)} <small>demo</small>
                  </time>
                </div>
                <p className="td-comment">“{lead.message}”</p>
                <div className="td-analysis-row">
                  {lead.stage >= 2 && (
                    <>
                      <span className="td-badge td-badge-blue">{lead.intent}</span>
                      {lead.score >= 80 && <span className="td-high-intent">↗ High Intent</span>}
                    </>
                  )}
                  {lead.stage >= 3 && (
                    <span className="td-score">
                      <span>Lead score</span>
                      <strong>
                        {lead.score}
                        <small> / 100</small>
                      </strong>
                      <span className="td-score-track">
                        <i style={{ width: lead.score + '%' }} />
                      </span>
                    </span>
                  )}
                </div>
                {lead.stage >= 5 && (
                  <motion.div
                    className="td-ai-reply"
                    initial={reducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span>
                      <Sparkles size={14} />
                      AI RESPONSE
                      <CheckCheck size={14} />
                    </span>
                    <p>{lead.response}</p>
                  </motion.div>
                )}
                <div className="td-activity-footer">
                  {lead.stage < 6 ? (
                    <span className={'td-processing ' + (status === 'Paused' ? 'is-paused' : '')}>
                      {status === 'Paused' ? (
                        <Pause size={12} />
                      ) : (
                        <span className="td-processing-dots">
                          <i />
                          <i />
                          <i />
                        </span>
                      )}
                      {status === 'Paused' ? 'Paused · ' : ''}
                      {activityStageLabels[lead.stage]}
                    </span>
                  ) : (
                    <StatusBadge status={lead.status} />
                  )}
                  {lead.stage === 7 && (
                    <span className="td-crm-update">
                      <CircleCheck size={12} />
                      Demo CRM updated
                    </span>
                  )}
                </div>
              </motion.article>
            ))
          )}
          {status === 'Complete' && (
            <div className="td-session-complete">
              <CircleCheck size={18} />
              <div>
                <strong>Every conversation, taken care of.</strong>
                <p>Your session is complete. Explore analytics or reset to replay.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {!following && (
        <button className="td-jump-latest" onClick={jumpToLatest}>
          <ArrowDown size={13} />
          Jump to latest
        </button>
      )}
      <div className="td-stream-bottom">
        <span>
          <span className="td-dot" />
          {status === 'Paused'
            ? 'Paused. Resume whenever you’re ready.'
            : 'Sample conversations · Nothing is posted publicly'}
        </span>
        <span>LeadHive AI</span>
      </div>
    </section>
  )
}
