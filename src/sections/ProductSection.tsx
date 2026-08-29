import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
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
  const reducedMotion = useReducedMotion()
  const selected = capabilities[active]
  const SelectedIcon = selected.icon

  return (
    <section className="product-section section-pad" id="product">
      <div className="container">
        <div className="product-intro">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <p className="eyebrow">The product</p>
            <h2>One intelligence layer for every customer conversation.</h2>
          </motion.div>
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: reducedMotion ? 0 : 0.08 }}
          >
            LeadHive gives revenue teams a shared system for understanding demand, prioritizing opportunity, and acting with complete context.
          </motion.p>
        </div>

        <motion.div
          className="product-showcase"
          initial={reducedMotion ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="product-capability-rail" role="tablist" aria-label="LeadHive capabilities">
            <div className="product-rail-heading"><span className="mark">L</span><strong>Capabilities</strong></div>
            {capabilities.map((capability, index) => {
              const Icon = capability.icon
              const isActive = active === index
              return (
                <button
                  type="button"
                  key={capability.id}
                  className={`product-capability-tab${isActive ? ' active' : ''}`}
                  onClick={() => setActive(index)}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="product-capability-panel"
                >
                  <Icon aria-hidden="true" />
                  <span>{capability.title}</span>
                  <ArrowRight aria-hidden="true" />
                </button>
              )
            })}
          </div>

          <div className="product-dashboard" aria-label="LeadHive product dashboard preview">
            <header className="product-dashboard-header">
              <div><strong>Lead intelligence</strong><span>Live workspace</span></div>
              <div className="product-dashboard-status"><i /> All systems active</div>
            </header>

            <div className="product-metric-strip">
              <div><span>Open conversations</span><strong>1,284</strong><small>across 4 channels</small></div>
              <div><span>High intent</span><strong>86</strong><small>needs attention</small></div>
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
                transition={{ duration: 0.28 }}
              >
                <div className="product-panel-icon"><SelectedIcon /></div>
                <small>{selected.eyebrow}</small>
                <h3>{selected.title}</h3>
                <p>{selected.copy}</p>
                <div className="product-signal-list">
                  {selected.signals.map((signal) => <span key={signal}><Check /> {signal}</span>)}
                </div>
                <div className="product-context-note"><span>Selected opportunity</span><strong>{primaryLead.name} · {primaryLead.company}</strong></div>
              </motion.aside>
            </div>
          </div>
        </motion.div>

        <div className="product-footer-statement">
          <p>Everything sales needs to act. Nothing they need to reconstruct.</p>
          <a href="#contact" className="product-footer-link">See LeadHive in action <ArrowRight /></a>
        </div>
      </div>
    </section>
  )
}
