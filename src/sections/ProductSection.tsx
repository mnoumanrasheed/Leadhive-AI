import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import {
  ArrowRight,
  BarChart3,
  Check,
  Clock3,
  Gauge,
  Inbox,
  MessageSquareText,
  Search,
  Send,
  SlidersHorizontal,
} from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { additionalLeads, primaryLead } from '../data/demoData'

const capabilities = [
  {
    id: 'inbox',
    title: 'Unified inbox',
    eyebrow: 'One customer view',
    copy: 'Bring every active conversation into a single operational workspace without losing its original channel.',
    icon: Inbox,
    signals: ['4 connected channels', 'Shared ownership', 'Live conversation status'],
  },
  {
    id: 'intent',
    title: 'Intent detection',
    eyebrow: 'Understand demand',
    copy: 'Detect commercial intent and distinguish buying conversations from support, FAQs, and casual browsing.',
    icon: Search,
    signals: ['High purchase intent', 'Enterprise pricing request', 'Commercial language detected'],
  },
  {
    id: 'qualification',
    title: 'Smart qualification',
    eyebrow: 'Apply your criteria',
    copy: 'Collect the missing information your team needs using qualification rules aligned to your sales process.',
    icon: SlidersHorizontal,
    signals: ['Budget confirmed', '20 locations', 'Next-month timeline'],
  },
  {
    id: 'scoring',
    title: 'Lead scoring',
    eyebrow: 'Prioritize clearly',
    copy: 'Rank every opportunity against fit, intent, urgency, and completeness so sellers know where to start.',
    icon: Gauge,
    signals: ['Opportunity score 92', 'High-priority queue', 'Fit and urgency weighted'],
  },
  {
    id: 'context',
    title: 'Conversation context',
    eyebrow: 'Keep the full picture',
    copy: 'Preserve customer history, extracted details, and AI summaries so nobody has to reconstruct the conversation.',
    icon: MessageSquareText,
    signals: ['Concise AI summary', 'Source history retained', 'Next action suggested'],
  },
  {
    id: 'handoff',
    title: 'Sales-ready handoff',
    eyebrow: 'Move with confidence',
    copy: 'Route qualified opportunities to the right seller with the context and recommended action already attached.',
    icon: Send,
    signals: ['Owner assigned', 'Context attached', 'Ready for follow-up'],
  },
  {
    id: 'analytics',
    title: 'Analytics & visibility',
    eyebrow: 'See what is working',
    copy: 'Track channel demand, qualification health, opportunity quality, and team response from one clear view.',
    icon: BarChart3,
    signals: ['Channel quality mix', 'Qualification visibility', 'Team response overview'],
  },
] as const

const leads = [primaryLead, ...additionalLeads]

export function ProductSection() {
  const [active, setActive] = useState(0)
  const [autoPaused, setAutoPaused] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const pauseTimerRef = useRef<number | null>(null)
  const inView = useInView(sectionRef, { amount: 0.18 })
  const reducedMotion = useReducedMotion()
  const selected = capabilities[active]
  const SelectedIcon = selected.icon
  const capabilityProgress = [0.72, 0.82, 0.88, 0.92, 0.78, 0.96, 0.68][active]

  useEffect(() => {
    if (!inView || reducedMotion || autoPaused) return
    const timer = window.setTimeout(() => setActive((current) => (current + 1) % capabilities.length), 4800)
    return () => window.clearTimeout(timer)
  }, [active, autoPaused, inView, reducedMotion])

  useEffect(() => () => {
    if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current)
  }, [])

  const selectCapability = (index: number) => {
    setActive(index)
    setAutoPaused(true)
    if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current)
    pauseTimerRef.current = window.setTimeout(() => setAutoPaused(false), 10000)
  }

  return (
    <section className="product-section section-pad" id="product" ref={sectionRef} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Subtle Ambient Background Motion Layer */}
      <div className="product-ambient-backdrop" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <motion.div
          style={{
            position: 'absolute',
            top: '20%',
            right: '5%',
            width: '560px',
            height: '560px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, rgba(37, 99, 235, 0.03) 50%, transparent 70%)',
            filter: 'blur(90px)',
          }}
          animate={inView && !reducedMotion ? { x: [0, -12, 0], y: [0, 10, 0], scale: [1, 1.03, 1] } : { x: 0, y: 0 }}
          transition={{ duration: 22, repeat: inView && !reducedMotion ? Infinity : 0, ease: 'easeInOut' }}
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="product-intro">
          <Reveal>
            <p className="eyebrow">The product</p>
            <h2>One intelligence layer for every customer conversation.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="hero-lead-text" style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-lg)', lineHeight: 1.7 }}>
              LeadHive gives revenue teams a shared system for understanding demand, prioritizing opportunity, and acting with complete context.
            </p>
          </Reveal>
        </div>

        <motion.div
          className="product-showcase"
          initial={reducedMotion ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="product-capability-rail" role="tablist" aria-label="LeadHive capabilities">
            <div className="product-rail-heading"><span className="mark">L</span><strong>Capabilities</strong><span className="product-demo-live"><i /> Live demo</span></div>
            <motion.i className="product-auto-progress" key={`${active}-${autoPaused}`} initial={{ scaleX: 0 }} animate={inView && !reducedMotion && !autoPaused ? { scaleX: 1 } : { scaleX: 0 }} transition={{ duration: 4.8, ease: 'linear' }} />
            {capabilities.map((capability, index) => {
              const Icon = capability.icon
              const isActive = active === index
              return (
                <motion.button
                  type="button"
                  key={capability.id}
                  className={`product-capability-tab${isActive ? ' active' : ''}`}
                  onClick={() => selectCapability(index)}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="product-capability-panel"
                  initial={reducedMotion ? false : { opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: reducedMotion ? 0 : 0.06 * index, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Icon aria-hidden="true" />
                  <span>{capability.title}</span>
                  <ArrowRight aria-hidden="true" />
                </motion.button>
              )
            })}
          </div>

          <div className={`product-dashboard capability-${selected.id}`} aria-label="LeadHive product dashboard preview">
            <motion.i className="product-dashboard-scan" key={selected.id} initial={{ y: -30, opacity: 0 }} animate={inView && !reducedMotion ? { y: 370, opacity: [0, 0.45, 0] } : { opacity: 0 }} transition={{ duration: 2.2, ease: 'easeInOut' }} />
            <header className="product-dashboard-header">
              <div><strong>Lead intelligence</strong><span>Live workspace</span></div>
              <div className="product-dashboard-status"><i /> All systems active</div>
            </header>

            <div className="product-metric-strip">
              <div><span>Open conversations</span><strong>1,284</strong><small>across 4 channels</small></div>
              <div><span>High intent</span><motion.strong key={active} initial={reducedMotion ? false : { opacity: 0.5, y: 3 }} animate={{ opacity: 1, y: 0 }}>{86 + active}</motion.strong><small>needs attention</small></div>
              <div><span>Median response</span><strong>4s</strong><small><Clock3 /> always-on coverage</small></div>
            </div>

            <div className="product-dashboard-grid">
              <div className="product-lead-queue">
                <div className="product-panel-heading"><div><small>Priority queue</small><strong>Opportunities</strong></div><span>Score</span></div>
                {leads.map((lead, index) => (
                  <div className={`product-lead-row${index === 0 ? ' selected' : ''}`} key={lead.name}>
                    <span className={`avatar ${index === 0 ? 'navy' : index === 1 ? 'amber' : 'blue'}`}>{lead.initials}</span>
                    <div><strong>{lead.name}</strong><small>{lead.company} · {index === 0 ? 'Website' : index === 1 ? 'WhatsApp' : 'Instagram'}</small></div>
                    <span className="product-lead-status">{index === 0 ? 'High intent' : 'Qualified'}</span>
                    <b>{lead.score}</b>
                  </div>
                ))}
                <div className="product-queue-footer"><span>Prioritized by fit, intent, and urgency</span><a href="#contact">View team queue <ArrowRight /></a></div>
              </div>

              <motion.aside
                className="product-intelligence-panel"
                id="product-capability-panel"
                role="tabpanel"
                key={selected.id}
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="product-panel-icon"><SelectedIcon /></div>
                <small>{selected.eyebrow}</small>
                <h3>{selected.title}</h3>
                <p>{selected.copy}</p>
                <div className="product-signal-list">
                  {selected.signals.map((signal, index) => <motion.span key={signal} initial={reducedMotion ? false : { opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }}><Check /> {signal}</motion.span>)}
                </div>
                <div className="product-capability-progress"><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: capabilityProgress }} transition={{ duration: reducedMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }} /></div>
                <div className="product-context-note"><span>Selected opportunity</span><strong>{primaryLead.name} · {primaryLead.company}</strong></div>
              </motion.aside>
            </div>
          </div>
        </motion.div>

        <Reveal className="product-footer-statement" delay={0.1}>
          <p>Everything sales needs to act. Nothing they need to reconstruct.</p>
          <a href="#contact" className="product-footer-link">See LeadHive in action <ArrowRight /></a>
        </Reveal>
      </div>
    </section>
  )
}
