import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Check } from 'lucide-react'
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
    title: 'Unstructured language becomes structured sales context.',
    copy: 'Intent, quantity, location, and timeline are extracted as the conversation develops.',
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
    copy: 'Every conversation is scored as Hot, Warm, Cold, or No Lead—so the best opportunities rise first.',
  },
  {
    number: '05',
    label: 'Sales Handover',
    title: 'The right person gets the full picture.',
    copy: 'A rich summary, qualification data, and recommended next step are sent to sales at the right moment.',
  },
]

function WorkflowVisual({ active }: { active: number }) {
  const reducedMotion = useReducedMotion()
  const transition = reducedMotion ? { duration: 0 } : { duration: 0.38, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }

  return (
    <div className="workflow-window">
      <div className="workflow-top"><div><span className="mark">L</span><strong>LeadHive</strong></div><span><i /> Conversation live</span></div>
      <div className="workflow-progress">
        {steps.map((step, index) => <span key={step.number} className={index <= active ? 'complete' : ''}><i />{step.number}</span>)}
      </div>
      <div className="workflow-canvas">
        <AnimatePresence mode="wait">
          <motion.div
            className="workflow-state"
            key={active}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={transition}
          >
            {active === 0 && (
              <div className="state-message">
                <div className="state-meta"><span className="avatar blue">{primaryLead.initials}</span><div><strong>{primaryLead.name}</strong><small>{primaryLead.company} · now</small></div></div>
                <blockquote>“{primaryLead.message}”</blockquote>
                <div className="received"><Check /> Message received · response in progress</div>
              </div>
            )}
            {active === 1 && (
              <div className="state-understanding">
                <p className="state-kicker">Qualification Signals extracted</p>
                {qualificationSignals.map(([key, value], index) => (
                  <div key={key}><span>0{index + 1}</span><label>{key}</label><strong>{value}</strong><Check /></div>
                ))}
              </div>
            )}
            {active === 2 && (
              <div className="state-qualification">
                <p className="state-kicker">Qualification in progress</p>
                <div className="rule-check"><span>Business Need</span><strong>Enterprise rollout scope</strong></div>
                <div className="qual-chat"><span className="mark small">L</span><p>Will all 20 UK locations need to launch next month?</p></div>
                <div className="qual-chat customer"><p>Yes, the rollout covers all 20 sites.</p><span className="avatar blue">{primaryLead.initials}</span></div>
                <div className="received"><Check /> Required context confirmed</div>
              </div>
            )}
            {active === 3 && (
              <div className="state-score">
                <div className="large-score"><strong>{primaryLead.score}</strong><span>/ 100</span></div>
                <span className="hot-label">Hot Opportunity</span>
                <p>High Purchase Intent · 20 locations · UK · Next-month Timeline</p>
                <div className="score-line"><span /></div>
              </div>
            )}
            {active === 4 && (
              <div className="state-handover">
                <p className="state-kicker">Sales Handover</p>
                <div className="handover-person"><span className="avatar navy">{salesRepresentative.initials}</span><div><strong>{salesRepresentative.name}</strong><small>{salesRepresentative.role} · available</small></div><span>Assigned</span></div>
                <div className="handover-summary"><span>Lead Intelligence summary</span><p>{primaryLead.name} at {primaryLead.company} is planning a 20-site UK rollout next month and requested enterprise pricing. Recommended Action: contact today.</p></div>
                <button>Open opportunity <ArrowRight /></button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="workflow-foot"><span>LeadHive qualification engine</span><strong>{steps[active].label}</strong></div>
    </div>
  )
}

export function WorkflowSection() {
  const [active, setActive] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll<HTMLElement>('[data-workflow-step]')
    if (!items?.length) return
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(Number((visible.target as HTMLElement).dataset.workflowStep))
    }, { rootMargin: '-28% 0px -46% 0px', threshold: [0, 0.3, 0.6] })
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="workflow-section" id="workflow" ref={sectionRef}>
      <div className="container workflow-heading">
        <p className="eyebrow light">How it works</p>
        <h2>From conversation<br />to opportunity.</h2>
        <p>A continuous intelligence layer turns raw messages into confident human action.</p>
      </div>
      <div className="container workflow-layout">
        <div className="workflow-steps">
          {steps.map((step, index) => (
            <article
              className={`workflow-step ${active === index ? 'active' : ''}`}
              data-workflow-step={index}
              key={step.number}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setActive(index)
                }
              }}
              role="button"
              tabIndex={0}
              aria-pressed={active === index}
            >
              <span>{step.number}</span>
              <div><small>{step.label}</small><h3>{step.title}</h3><p>{step.copy}</p></div>
            </article>
          ))}
        </div>
        <div className="workflow-sticky"><WorkflowVisual active={active} /></div>
      </div>
    </section>
  )
}
