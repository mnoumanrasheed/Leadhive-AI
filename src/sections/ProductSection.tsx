import { useRef, useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Check } from 'lucide-react'
import { primaryLead } from '../data/demoData'

// -- Animated Number
function AnimatedNumber({ value, from = 0, duration = 1.4, trigger = true }: { value: number; from?: number; duration?: number; trigger?: boolean }) {
  const [count, setCount] = useState(from)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!trigger) return
    if (reducedMotion) { setCount(value); return }
    let raf: number
    const start = performance.now()
    const ms = duration * 1000
    const tick = (now: number) => {
      const t = Math.min((now - start) / ms, 1)
      const e = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setCount(Math.round(from + (value - from) * e))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, from, duration, trigger, reducedMotion])

  return <>{count}</>
}

const CAPABILITIES = [
  { 
    id: 'inbox',
    title: 'Unified Omnichannel Inbox', 
    copy: 'Capture and route messages from any source into one intelligent view.' 
  },
  { 
    id: 'intent',
    title: 'AI Intent Detection', 
    copy: 'Instantly extract commercial intent, locations, and timelines from raw text.' 
  },
  { 
    id: 'score',
    title: 'Opportunity Scoring', 
    copy: 'Automatically grade every conversation so your team prioritizes revenue.' 
  },
  { 
    id: 'handover',
    title: 'Instant Sales Handover', 
    copy: 'Pass fully qualified, scored opportunities directly to the right rep.' 
  }
]

const EASE = [0.22, 1, 0.36, 1] as const

export function ProductSection() {
  const [active, setActive] = useState(0)
  const reducedMotion = useReducedMotion()

  return (
    <section className="product-section" id="product">
      <div className="container">
        
        {/* TOP AREA: Headline */}
        <div className="product-heading-area">
          <motion.p 
            className="product-eyebrow"
            initial={reducedMotion ? false : { opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            The product
          </motion.p>
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          >
            <h2 className="product-headline">
              Most inboxes show messages.<br />
              LeadHive shows opportunities.
            </h2>
            <p className="product-subhead">
              It does more than send automated replies. LeadHive listens, understands, engages, qualifies, scores, and prioritizes—around the clock.
            </p>
          </motion.div>
        </div>

        {/* LOWER AREA: Product Console + Capabilities */}
        <div className="showcase-layout">
          
          {/* Left: Main Product Visual (approx 65%) */}
          <motion.div 
            className="showcase-console-wrapper"
            initial={reducedMotion ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <div className="showcase-console">
              
              {/* 0: Omnichannel Inbox Highlight Area */}
              <div className={`console-block inbox-block ${active === 0 ? 'highlight' : 'dim'}`}>
                <div className="inbox-header">
                  <div className="inbox-user">
                    <div className="inbox-avatar">{primaryLead.initials}</div>
                    <div className="inbox-meta">
                      <strong>{primaryLead.name}</strong>
                      <span>Website / {primaryLead.company}</span>
                    </div>
                  </div>
                  <div className="inbox-badge">HIGH-INTENT OPPORTUNITY</div>
                </div>
                <div className="inbox-message">
                  <p>“Planning a 20-site rollout next month.<br/>Can you share enterprise pricing?”</p>
                </div>
              </div>

              {/* 1: AI Intent Highlight Area */}
              <div className={`console-block intent-block ${active === 1 ? 'highlight' : 'dim'}`}>
                <div className="intent-grid">
                  <div className="intent-card">
                    <span>Commercial Intent</span>
                    <strong>HIGH</strong>
                  </div>
                  <div className="intent-card">
                    <span>Locations</span>
                    <strong>20</strong>
                  </div>
                  <div className="intent-card">
                    <span>Timeline</span>
                    <strong>Next Month</strong>
                  </div>
                </div>
              </div>

              <div className="console-bottom-row">
                {/* 2: Opportunity Scoring Area */}
                <div className={`console-block score-block ${active === 2 ? 'highlight' : 'dim'}`}>
                  <span>Opportunity Score</span>
                  <div className="score-number">
                    <strong><AnimatedNumber value={94} trigger={active === 2} duration={1.2} /></strong>
                    <small>/ 100</small>
                  </div>
                  <div className="score-visual-bar">
                    <motion.div 
                      className="score-visual-fill"
                      initial={{ width: '0%' }}
                      animate={{ width: active === 2 ? '94%' : '0%' }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* 3: Sales Handover Area */}
                <div className={`console-block handover-block ${active === 3 ? 'highlight' : 'dim'}`}>
                  <span>Suggested Action</span>
                  <p>Share enterprise pricing and schedule discovery call.</p>
                  <motion.button 
                    className="handover-btn"
                    animate={active === 3 ? { boxShadow: ['0 0 0 0 rgba(34,211,238,0)', '0 0 0 6px rgba(34,211,238,0.2)', '0 0 0 0 rgba(34,211,238,0)'] } : {}}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  >
                    Route to Sales <ArrowRight size={14} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Capability Selector (approx 35%) */}
          <div className="showcase-selector">
            {CAPABILITIES.map((cap, index) => {
              const isActive = active === index
              return (
                <motion.div
                  key={cap.id}
                  className={`capability-card ${isActive ? 'active' : ''}`}
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setActive(index)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-selected={isActive}
                  initial={reducedMotion ? false : { opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1, ease: EASE }}
                >
                  <div className="cap-indicator">
                    <motion.div 
                      className="cap-dot"
                      animate={{ scale: isActive ? 1 : 0.5, opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <div className="cap-content">
                    <h4>{cap.title}</h4>
                    <p>{cap.copy}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>

        </div>

        {/* BOTTOM STATEMENT */}
        <div className="product-footer-statement">
          <p>Opportunities, not inbox chaos.</p>
          <a href="#demo" className="product-footer-link">See LeadHive in action <ArrowRight size={14} /></a>
        </div>
      </div>
    </section>
  )
}
