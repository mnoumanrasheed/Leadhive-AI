import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Check, ChevronRight } from 'lucide-react'
import { primaryLead, qualificationSignals, salesRepresentative } from '../data/demoData'

const steps = [
  {
    number: '01',
    label: 'Incoming message',
    title: 'A customer starts with a real business need.',
    copy: 'LeadHive responds instantly, on the channel where the conversation began.',
  },
  {
    number: '02',
    label: 'AI Understanding',
    title: 'Unstructured language becomes structured context.',
    copy: 'Intent, quantity, location, and timeline are extracted instantly.',
  },
  {
    number: '03',
    label: 'Qualification',
    title: 'The next best question is asked automatically.',
    copy: 'LeadHive determines what is missing and qualifies against your business rules.',
  },
  {
    number: '04',
    label: 'Opportunity Score',
    title: 'Buying signals become a clear priority.',
    copy: 'Every conversation is scored so the best opportunities rise first.',
  },
  {
    number: '05',
    label: 'Sales Handover',
    title: 'The right person gets the full picture.',
    copy: 'A rich summary and qualification data are sent to sales at the right moment.',
  },
]

function WorkflowVisual({ active }: { active: number }) {
  const reducedMotion = useReducedMotion()
  const transition = reducedMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }

  return (
    <div className="workflow-preview-panel">
      {/* Top Bar */}
      <div className="preview-top-bar">
        <div className="preview-brand">
          <div className="preview-logo-mark">L</div>
          <strong>LeadHive Console</strong>
        </div>
        <div className="preview-status-chip">
          <div className="status-dot" />
          <span>Conversation live</span>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="preview-progress">
        {steps.map((step, index) => (
          <div key={step.number} className={`progress-segment ${index <= active ? 'active' : ''}`}>
            <div className="progress-node" />
            <span>{step.number}</span>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="preview-canvas">
        <AnimatePresence mode="wait">
          <motion.div
            className="preview-state"
            key={active}
            initial={reducedMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -12, scale: 0.98 }}
            transition={transition}
          >
            {active === 0 && (
              <div className="state-content step-1">
                <div className="inquiry-card">
                  <div className="inquiry-meta">
                    <span className="avatar blue">{primaryLead.initials}</span>
                    <div className="meta-text">
                      <strong>{primaryLead.name}</strong>
                      <span>{primaryLead.company} · Website Chat</span>
                    </div>
                  </div>
                  <div className="inquiry-bubble">
                    <p>“{primaryLead.message}”</p>
                  </div>
                  <div className="inquiry-status">
                    <Check size={14} /> Message received
                  </div>
                </div>
              </div>
            )}
            
            {active === 1 && (
              <div className="state-content step-2">
                <div className="extraction-header">
                  <span className="kicker">Intent Extraction</span>
                  <div className="animated-line" />
                </div>
                <div className="insights-grid">
                  {qualificationSignals.map(([key, value], idx) => (
                    <motion.div 
                      key={key} 
                      className="insight-chip"
                      initial={reducedMotion ? false : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.3 }}
                    >
                      <span className="chip-label">{key}</span>
                      <strong className="chip-val">{value}</strong>
                      <div className="chip-check"><Check size={12} /></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {active === 2 && (
              <div className="state-content step-3">
                <div className="qual-rule">
                  <span className="kicker">Verifying Rule: Business Need</span>
                  <strong>Must confirm enterprise rollout scope</strong>
                </div>
                <div className="chat-thread">
                  <div className="chat-bubble ai">
                    <div className="bubble-avatar">L</div>
                    <p>Will all 20 UK locations need to launch next month?</p>
                  </div>
                  <motion.div 
                    className="chat-bubble user"
                    initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p>Yes, the rollout covers all 20 sites.</p>
                    <span className="avatar blue">{primaryLead.initials}</span>
                  </motion.div>
                </div>
              </div>
            )}
            
            {active === 3 && (
              <div className="state-content step-4">
                <div className="score-display">
                  <div className="score-circle">
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" className="bg" />
                      <motion.circle 
                        cx="50" cy="50" r="45" className="progress"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{ strokeDashoffset: 283 - (283 * 0.94) }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </svg>
                    <div className="score-val">
                      <strong>{primaryLead.score}</strong>
                      <span>/ 100</span>
                    </div>
                  </div>
                  <div className="score-tags">
                    <span className="badge hot">HOT OPPORTUNITY</span>
                    <span className="badge outline">High Intent</span>
                    <span className="badge outline">Multi-site</span>
                  </div>
                </div>
              </div>
            )}
            
            {active === 4 && (
              <div className="state-content step-5">
                <div className="handover-card">
                  <div className="handover-top">
                    <span className="kicker">Sales Handover Ready</span>
                    <span className="status-verified"><Check size={12} /> Verified</span>
                  </div>
                  <div className="handover-rep">
                    <span className="avatar navy">{salesRepresentative.initials}</span>
                    <div className="rep-info">
                      <strong>{salesRepresentative.name}</strong>
                      <span>{salesRepresentative.role} · Available</span>
                    </div>
                    <button className="route-btn">Route to Sales <ArrowRight size={14} /></button>
                  </div>
                  <div className="handover-summary">
                    <p><strong>{primaryLead.name}</strong> at <strong>{primaryLead.company}</strong> is planning a 20-site UK rollout next month and requested enterprise pricing. Recommended Action: contact today.</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Footer */}
      <div className="preview-footer">
        <span className="footer-context">LeadHive Intelligence Engine</span>
        <strong className="footer-current">{steps[active].label}</strong>
      </div>
    </div>
  )
}

export function WorkflowSection() {
  const [active, setActive] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  // Intersection observer for scrolling activation
  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll<HTMLElement>('[data-workflow-step]')
    if (!items?.length) return
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(Number((visible.target as HTMLElement).dataset.workflowStep))
    }, { rootMargin: '-30% 0px -40% 0px', threshold: [0, 0.4, 0.8] })
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="workflow-section" id="workflow" ref={sectionRef}>
      <div className="container workflow-heading">
        <motion.p 
          className="eyebrow light"
          initial={reducedMotion ? false : { opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          How it works
        </motion.p>
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <h2>From conversation<br />to opportunity.</h2>
          <p>A continuous intelligence layer turns raw messages into confident human action.</p>
        </motion.div>
      </div>
      
      <div className="container workflow-layout">
        {/* Left Side: Step Navigator */}
        <div className="workflow-navigator" role="tablist" aria-label="Workflow steps">
          {steps.map((step, index) => {
            const isActive = active === index
            return (
              <article
                className={`nav-card ${isActive ? 'active' : ''}`}
                data-workflow-step={index}
                key={step.number}
                onClick={() => setActive(index)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setActive(index)
                  }
                }}
                role="tab"
                tabIndex={0}
                aria-selected={isActive}
                aria-label={`Step ${step.number}: ${step.label}`}
              >
                <div className="nav-card-num">{step.number}</div>
                <div className="nav-card-content">
                  <span className="nav-eyebrow">{step.label}</span>
                  <h3 className="nav-title">{step.title}</h3>
                  <p className="nav-copy">{step.copy}</p>
                </div>
                <div className="nav-card-icon" aria-hidden="true">
                  <ChevronRight size={18} />
                </div>
                {/* Active glow/connector effect */}
                {isActive && <div className="nav-card-glow" />}
              </article>
            )
          })}
        </div>

        {/* Right Side: Live Preview */}
        <div className="workflow-sticky">
          <WorkflowVisual active={active} />
        </div>
      </div>
    </section>
  )
}
