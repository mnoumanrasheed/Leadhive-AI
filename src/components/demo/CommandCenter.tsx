import { Youtube } from './PlatformIcons'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowRight,
  BarChart3,
  CircleCheck,
  LayoutDashboard,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { demoService } from '../../services/demoService'
import { useDemoSimulation } from '../../hooks/useDemoSimulation'
import type { Persona } from '../../types/demo'
import { ActivityStream } from './ActivityStream'
import { ProcessVisualizer } from './ProcessVisualizer'
import { AnalyticsDashboard } from './AnalyticsDashboard'

export function CommandCenter({
  persona,
  contentIds,
  onSetup,
}: {
  persona: Persona
  contentIds: string[]
  onSetup: () => void
}) {
  const simulation = useDemoSimulation(contentIds, persona)
  const [view, setView] = useState<'command' | 'analytics'>('command')
  const reducedMotion = useReducedMotion()
  const currentLead = simulation.leads.at(-1)
  const { channel, contents } = demoService.getSetup()
  useEffect(() => {
    document.querySelector<HTMLElement>('[data-demo-heading]')?.focus({ preventScroll: true })
  }, [view])
  function changeView(next: 'command' | 'analytics') {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  return (
    <div className="td-workspace">
      <aside className="td-control td-panel">
        <div className="td-workspace-label">
          <span className="td-workspace-icon">
            <Sparkles size={17} />
          </span>
          <div>
            <strong>{persona.businessName}</strong>
            <small>Demo workspace</small>
          </div>
          <span className="td-workspace-version">01</span>
        </div>
        <nav aria-label="Demo application navigation" className="td-app-nav">
          <button
            onClick={() => changeView('command')}
            aria-current={view === 'command' ? 'page' : undefined}
          >
            <LayoutDashboard size={16} />
            Command Center
          </button>
          <button
            onClick={() => changeView('analytics')}
            aria-current={view === 'analytics' ? 'page' : undefined}
          >
            <BarChart3 size={16} />
            Analytics<span className="td-nav-count">{simulation.analytics.leadsDetected}</span>
          </button>
        </nav>
        <div className="td-control-body">
          <h2>AI Control Center</h2>
          <dl className="td-control-details">
            <div>
              <dt>Channel</dt>
              <dd>
                <Youtube size={15} className="td-youtube-text" />
                YouTube
              </dd>
            </div>
            <div>
              <dt>Automation Mode</dt>
              <dd>Lead Qualification</dd>
            </div>
            <div>
              <dt>Tone</dt>
              <dd>{persona.tone === 'Professional & Helpful' ? 'Professional' : persona.tone}</dd>
            </div>
            <div>
              <dt>Selected Content</dt>
              <dd>
                {contentIds.length} {contentIds.length === 1 ? 'Video' : 'Videos'}
              </dd>
            </div>
            <div>
              <dt>AI Status</dt>
              <dd>
                <span
                  role="status"
                  className={
                    'td-automation-status td-automation-' + simulation.status.toLowerCase()
                  }
                >
                  <i />
                  {simulation.status}
                </span>
              </dd>
            </div>
          </dl>
          <div className="td-control-buttons">
            <button
              className="td-btn td-btn-primary"
              disabled={simulation.status === 'Active' || simulation.status === 'Complete'}
              onClick={simulation.start}
            >
              <Play size={15} fill="currentColor" />
              {simulation.status === 'Paused'
                ? 'Resume Automation'
                : simulation.status === 'Complete'
                  ? 'Demo Complete'
                  : simulation.status === 'Active'
                    ? 'AI Demo Running'
                    : 'Start AI Demo'}
            </button>
            <button
              className="td-btn td-btn-secondary"
              disabled={simulation.status !== 'Active'}
              onClick={simulation.pause}
            >
              <Pause size={15} />
              Pause Automation
            </button>
            <button className="td-btn td-btn-quiet" onClick={simulation.reset}>
              <RotateCcw size={14} />
              Reset Demo
            </button>
          </div>
        </div>
        <div className="td-control-bottom">
          <span>
            <ShieldCheck size={15} />
            You’re in a demo workspace
          </span>
          <p>Explore freely. All conversations and CRM updates are simulated.</p>
          <button
            className="td-text-button"
            onClick={() => {
              simulation.reset()
              onSetup()
            }}
          >
            <Settings2 size={13} />
            Edit setup & restart
          </button>
        </div>
      </aside>
      <div className="td-workspace-main">
        <AnimatePresence
          mode="wait"
          initial={false}
          onExitComplete={() =>
            window.requestAnimationFrame(() =>
              document
                .querySelector<HTMLElement>('[data-demo-heading]')
                ?.focus({ preventScroll: true }),
            )
          }
        >
          <motion.div
            key={view}
            initial={reducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}
          >
            {view === 'analytics' ? (
              <AnalyticsDashboard
                analytics={simulation.analytics}
                leads={simulation.leads}
                onBack={() => changeView('command')}
              />
            ) : (
              <>
                <div className="td-dashboard-heading">
                  <div>
                    <span className="td-section-label">
                      <span className="td-dot" />
                      YOUR ENGAGEMENT, ON AUTOPILOT
                    </span>
                    <h1 tabIndex={-1} data-demo-heading>
                      AI Command Center
                    </h1>
                    <p>A little intelligence. A lot more possibility.</p>
                  </div>
                  <button
                    className="td-btn td-btn-secondary"
                    onClick={() => changeView('analytics')}
                  >
                    View Analytics
                    <ArrowRight size={15} />
                  </button>
                </div>
                <div className="td-channel-strip">
                  <span className="td-channel-strip-icon">
                    <Youtube size={19} />
                  </span>
                  <div>
                    <strong>{channel.name}</strong>
                    <span>
                      {contents
                        .filter((content) => contentIds.includes(content.id))
                        .map((content) => content.title)
                        .join(' · ')}
                    </span>
                  </div>
                  <span className="td-badge td-badge-green">
                    <CircleCheck size={12} />
                    Connected
                  </span>
                </div>
                <div className="td-session-stats">
                  <div>
                    <span>Conversations</span>
                    <strong>
                      {simulation.analytics.leadsDetected}
                      <small> / {simulation.total}</small>
                    </strong>
                  </div>
                  <div>
                    <span>AI responses</span>
                    <strong>{simulation.analytics.aiResponses}</strong>
                  </div>
                  <div>
                    <span>Qualified leads</span>
                    <strong>
                      {simulation.analytics.qualifiedLeads}
                      <span className="td-stat-indicator">↗</span>
                    </strong>
                  </div>
                  <div>
                    <span>Average score</span>
                    <strong>
                      {simulation.analytics.averageLeadScore}
                      <small> / 100</small>
                    </strong>
                  </div>
                </div>
                <ProcessVisualizer
                  stage={currentLead?.stage}
                  name={currentLead?.name}
                  status={simulation.status}
                />
                <ActivityStream
                  leads={simulation.leads}
                  status={simulation.status}
                  eventCount={simulation.events.length}
                  total={simulation.total}
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
