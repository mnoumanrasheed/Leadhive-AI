import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowRight, Check, MessageCircle, MoreHorizontal, Sparkles } from 'lucide-react'
import { additionalLeads, primaryLead, qualificationSignals, salesRepresentative } from '../data/demoData'

const journeySteps = [
  { step: '01', name: 'Inquiry', desc: 'Message' },
  { step: '02', name: 'AI Parse', desc: 'Understand' },
  { step: '03', name: 'Qualify', desc: 'Rules match' },
  { step: '04', name: 'Score', desc: 'High Intent' },
  { step: '05', name: 'Handover', desc: 'Assigned' },
] as const

const ease = [0.16, 1, 0.3, 1] as const

export function ProductDemo() {
  const windowRef = useRef<HTMLDivElement>(null)
  const inView = useInView(windowRef, { once: true, amount: 0.15 })
  const reducedMotion = useReducedMotion()
  const active = Boolean(reducedMotion) || inView
  const [score, setScore] = useState(reducedMotion ? primaryLead.score : 0)

  useEffect(() => {
    if (reducedMotion) {
      setScore(primaryLead.score)
      return
    }
    if (!inView) return

    let animationFrame = 0
    let startedAt = 0
    const duration = 520
    const timeout = window.setTimeout(() => {
      const updateScore = (time: number) => {
        if (!startedAt) startedAt = time
        const progress = Math.min((time - startedAt) / duration, 1)
        const easedProgress = 1 - Math.pow(1 - progress, 3)
        setScore(Math.round(primaryLead.score * easedProgress))
        if (progress < 1) animationFrame = window.requestAnimationFrame(updateScore)
      }
      animationFrame = window.requestAnimationFrame(updateScore)
    }, 600)

    return () => {
      window.clearTimeout(timeout)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [inView, reducedMotion])

  const reveal = (delay: number, distance = 8) => ({
    initial: reducedMotion ? false : { opacity: 0, y: distance },
    animate: active ? { opacity: 1, y: 0 } : { opacity: 0, y: distance },
    transition: { duration: 0.42, delay: reducedMotion ? 0 : delay, ease },
  })

  return (
    <motion.div
      ref={windowRef}
      className="product-window"
      aria-label="LeadHive qualification interface preview"
      initial={reducedMotion ? false : { opacity: 0, y: 14, scale: 0.99 }}
      animate={active ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 14, scale: 0.99 }}
      transition={{ duration: 0.56, ease }}
    >
      {/* Top Window Bar */}
      <div className="window-bar">
        <div className="window-brand">
          <span className="mark">L</span>
          <div>
            <strong>LeadHive Intelligence</strong>
            <small>Live Engine</small>
          </div>
        </div>
        <div className="window-status">
          <Sparkles />
          <span>AI Triage Active</span>
        </div>
        <div className="window-menu" aria-hidden="true">
          <MoreHorizontal />
        </div>
      </div>

      {/* Progress Journey Bar - Clean, Compact & Non-Clipping */}
      <div className="journey-bar" aria-label="Qualification journey">
        {journeySteps.map((item, index) => (
          <div className="journey-step" key={item.step}>
            <motion.i
              initial={reducedMotion ? false : { scale: 0.8 }}
              animate={active ? { scale: 1, backgroundColor: '#06b6d4', borderColor: '#06b6d4' } : undefined}
              transition={{ duration: 0.3, delay: reducedMotion ? 0 : 0.15 + index * 0.08, ease }}
            >
              <Check />
            </motion.i>
            <div className="journey-label-wrap">
              <b>{item.name}</b>
              <small>{item.desc}</small>
            </div>
            {index < journeySteps.length - 1 && (
              <motion.span
                className="journey-connector"
                initial={reducedMotion ? false : { scaleX: 0 }}
                animate={active ? { scaleX: 1 } : undefined}
                transition={{ duration: 0.3, delay: reducedMotion ? 0 : 0.2 + index * 0.08, ease }}
              />
            )}
          </div>
        ))}
      </div>

      {/* 3-Column Core Workspace */}
      <div className="product-layout">
        {/* Left: Active Conversations */}
        <aside className="conversation-list">
          <div className="ui-label">
            <span>Inbox</span>
            <b>3 live</b>
          </div>
          <div className="conversation-stack">
            <button className="conversation active" type="button">
              <span className="avatar blue">{primaryLead.initials}</span>
              <span>
                <strong>{primaryLead.name}</strong>
                <small>{primaryLead.company}</small>
              </span>
              <time>Now</time>
            </button>
            {additionalLeads.map((lead, index) => (
              <button className="conversation" type="button" key={lead.name}>
                <span className={index === 0 ? 'channel-badge whatsapp' : 'avatar amber'}>
                  {index === 0 ? <MessageCircle /> : lead.initials}
                </span>
                <span>
                  <strong>{lead.name}</strong>
                  <small>{lead.company}</small>
                </span>
                <time>{index === 0 ? '4m' : '8m'}</time>
              </button>
            ))}
          </div>
          <div className="inbox-foot">
            <i /> Connected
          </div>
        </aside>

        {/* Center: Live Chat & AI Extraction Thread */}
        <div className="conversation-view">
          <div className="conversation-head">
            <div>
              <span className="avatar blue">{primaryLead.initials}</span>
              <span>
                <strong>{primaryLead.name}</strong>
                <small>{primaryLead.role} · {primaryLead.company}</small>
              </span>
            </div>
            <motion.span className="priority" {...reveal(0.4, 0)}>
              High Intent
            </motion.span>
          </div>

          <div className="chat-thread">
            <span className="timestamp">Today · 10:42 AM</span>
            <motion.div className="chat-bubble" {...reveal(0.5, 6)}>
              {primaryLead.message}
            </motion.div>
            <motion.div className="ai-insight" {...reveal(0.65, 6)}>
              <Sparkles />
              <span>
                <strong>20-site rollout detected</strong>
                <small>Commercial expansion signal captured</small>
              </span>
            </motion.div>
            <motion.div className="ai-reply" {...reveal(0.8, 6)}>
              <span className="mark small">L</span>
              <p>I’ve captured your 20-location scope and target timeline. Routing directly to our enterprise team.</p>
            </motion.div>
          </div>

          <div className="conversation-state">
            <span><i /> AI Qualified</span>
            <strong>4 signals</strong>
          </div>
        </div>

        {/* Right: Lead Intelligence & Opportunity Score Panel */}
        <aside className="intelligence-panel">
          <div className="ui-label intelligence-heading">
            <span>Intelligence</span>
            <em>Live</em>
          </div>

          <div className="score-card">
            <div className="score-card-head">
              <span className="score-kicker">Score</span>
              <span className="score-confidence"><i /> High</span>
            </div>
            <div
              className="score-dial"
              role="img"
              aria-label={`${score} out of 100 opportunity score`}
              style={{ '--score-progress': `${score * 3.6}deg` } as CSSProperties}
            >
              <div>
                <strong>{score}</strong>
                <small>/100</small>
              </div>
            </div>
            <motion.div className="score-status" {...reveal(0.9, 4)}>
              <span><i /> Hot Lead</span>
            </motion.div>
          </div>

          <div className="signal-list">
            <span className="signal-title">Key Signals</span>
            {qualificationSignals.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <motion.div className="assignment" {...reveal(1.05, 5)}>
            <span className="avatar navy">{salesRepresentative.initials}</span>
            <div>
              <small>Assigned</small>
              <strong>{salesRepresentative.name}</strong>
            </div>
            <ArrowRight />
          </motion.div>
        </aside>
      </div>
    </motion.div>
  )
}
