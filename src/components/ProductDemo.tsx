import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowRight, Check, MessageCircle, MoreHorizontal, Sparkles } from 'lucide-react'
import { additionalLeads, primaryLead, qualificationSignals, salesRepresentative } from '../data/demoData'

const journey = [
  ['Incoming Message', 'Message'],
  ['AI Understanding', 'Understand'],
  ['Qualification', 'Qualify'],
  ['Hot Opportunity', 'Hot'],
  ['Sales Assignment', 'Assign'],
] as const

const ease = [0.22, 1, 0.36, 1] as const

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
    }, 1000)

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
      <div className="window-bar">
        <div className="window-brand">
          <span className="mark">L</span>
          <div><strong>LeadHive</strong><small>Lead Intelligence</small></div>
        </div>
        <div className="window-status"><Sparkles /><span>AI qualification active</span></div>
        <button className="window-menu" type="button" aria-label="More product preview options"><MoreHorizontal /></button>
      </div>

      <div className="journey-bar" aria-label="Qualification journey">
        {journey.map(([step, shortLabel], index) => (
          <div className="journey-step" key={step}>
            <motion.i
              initial={reducedMotion ? false : { scale: 0.8, backgroundColor: '#ffffff', borderColor: '#b8c4ca' }}
              animate={active ? { scale: 1, backgroundColor: '#229eb8', borderColor: '#229eb8' } : undefined}
              transition={{ duration: 0.3, delay: reducedMotion ? 0 : 0.2 + index * 0.09, ease }}
            ><Check /></motion.i>
            <motion.b
              data-short={shortLabel}
              initial={reducedMotion ? false : { opacity: 0.48 }}
              animate={active ? { opacity: 1 } : undefined}
              transition={{ duration: 0.3, delay: reducedMotion ? 0 : 0.2 + index * 0.09 }}
            >{step}</motion.b>
            {index < journey.length - 1 && <motion.span className="journey-connector" initial={reducedMotion ? false : { scaleX: 0 }} animate={active ? { scaleX: 1 } : undefined} transition={{ duration: 0.34, delay: reducedMotion ? 0 : 0.27 + index * 0.09, ease }} />}
          </div>
        ))}
      </div>

      <div className="product-layout">
        <aside className="conversation-list">
          <div className="ui-label"><span>Conversations</span><b>3</b></div>
          <div className="conversation-stack">
            <button className="conversation active" type="button">
              <span className="avatar blue">{primaryLead.initials}</span>
              <span><strong>{primaryLead.name}</strong><small>{primaryLead.company}</small></span>
              <time>Now</time>
            </button>
            {additionalLeads.map((lead, index) => (
              <button className="conversation" type="button" key={lead.name}>
                <span className={index === 0 ? 'channel-badge whatsapp' : 'avatar amber'}>{index === 0 ? <MessageCircle /> : lead.initials}</span>
                <span><strong>{lead.name}</strong><small>{lead.company}</small></span>
                <time>{index === 0 ? '4m' : '8m'}</time>
              </button>
            ))}
          </div>
          <div className="inbox-foot"><i /> All channels connected</div>
        </aside>

        <div className="conversation-view">
          <div className="conversation-head">
            <div><span className="avatar blue">{primaryLead.initials}</span><span><strong>{primaryLead.name}</strong><small>{primaryLead.role} · {primaryLead.company}</small></span></div>
            <motion.span className="priority" {...reveal(1.3, 0)}>High Purchase Intent</motion.span>
          </div>
          <div className="chat-thread">
            <span className="timestamp">Today · 10:42</span>
            <motion.div className="chat-bubble" {...reveal(0.62, 7)}>{primaryLead.message}</motion.div>
            <motion.div className="ai-insight" {...reveal(0.8, 6)}><Sparkles /><span><strong>20-site rollout detected</strong><small>Deployment scope added to Qualification Signals</small></span></motion.div>
            <motion.div className="ai-reply" {...reveal(0.94, 7)}><span className="mark small">L</span><p>Absolutely. I’ve captured the rollout scope and timeline. I’ll connect you with our enterprise team.</p></motion.div>
          </div>
          <div className="conversation-state"><span><i /> Qualification complete</span><strong>4 signals captured</strong></div>
        </div>

        <aside className="intelligence-panel">
          <div className="ui-label intelligence-heading"><span>Lead Intelligence</span><em>Updated now</em></div>
          <div className="score-card">
            <div className="score-card-head"><span className="score-kicker">Opportunity Score</span><span className="score-confidence"><i /> High confidence</span></div>
            <div
              className="score-dial"
              role="img"
              aria-label={`${score} out of 100 opportunity score`}
              style={{ '--score-progress': `${score * 3.6}deg` } as CSSProperties}
            ><div><strong>{score}</strong><small>/100</small></div></div>
            <motion.div className="score-status" {...reveal(1.54, 5)}><span><i /> Hot Opportunity</span><small>Ready for Sales Handover</small></motion.div>
          </div>
          <div className="signal-list">
            <span className="signal-title">Qualification Signals</span>
            {qualificationSignals.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
          </div>
          <motion.div className="assignment" {...reveal(1.72, 7)}>
            <span className="avatar navy">{salesRepresentative.initials}</span>
            <div><small>Assigned Representative</small><strong>{salesRepresentative.name}</strong><em>{salesRepresentative.role}</em></div>
            <ArrowRight />
          </motion.div>
        </aside>
      </div>
    </motion.div>
  )
}
