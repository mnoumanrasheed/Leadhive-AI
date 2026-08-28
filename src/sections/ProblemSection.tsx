import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowRight, Inbox, Sparkles, ShieldAlert, Zap } from 'lucide-react'
import { additionalLeads, primaryLead } from '../data/demoData'

// ─── Data ────────────────────────────────────────────────────────────────────

const MESSAGES = [
  {
    id: 'db',
    name: additionalLeads[0].name,
    initials: additionalLeads[0].initials,
    company: additionalLeads[0].company,
    message: 'Can you share the pricing breakdown?',
    channel: 'WhatsApp',
    status: 'Warm',
    tone: 'warm' as const,
    time: '2m',
    active: false,
  },
  {
    id: 'ac',
    name: primaryLead.name,
    initials: primaryLead.initials,
    company: primaryLead.company,
    message: 'Need this for 12 retail branches ASAP',
    channel: 'Website',
    status: 'High Intent',
    tone: 'high' as const,
    time: '4m',
    active: true,
  },
  {
    id: 'wv',
    name: 'Website Visitor',
    initials: 'WV',
    company: 'Unidentified',
    message: 'Hello, what are your opening hours?',
    channel: 'Web Chat',
    status: 'General FAQ',
    tone: 'quiet' as const,
    time: '6m',
    active: false,
  },
  {
    id: 'ps',
    name: additionalLeads[1].name,
    initials: additionalLeads[1].initials,
    company: additionalLeads[1].company,
    message: 'Do you offer multi-location onboarding?',
    channel: 'Instagram',
    status: 'Warm',
    tone: 'warm' as const,
    time: '8m',
    active: false,
  },
  {
    id: 'ce',
    name: 'Careers Enquiry',
    initials: 'CE',
    company: 'General',
    message: 'Are you hiring frontend developers?',
    channel: 'Messenger',
    status: 'Not a Lead',
    tone: 'quiet' as const,
    time: '12m',
    active: false,
  },
]

const CARD_EASE = [0.22, 1, 0.36, 1] as const
const ROW_EASE  = [0.16, 1, 0.3, 1] as const

// ─── Animated count-up ───────────────────────────────────────────────────────

function AnimatedNumber({
  value,
  from = 0,
  duration = 1.4,
  trigger = true,
}: {
  value: number
  from?: number
  duration?: number
  trigger?: boolean
}) {
  const [count, setCount] = useState(from)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!trigger) return
    if (reducedMotion) { setCount(value); return }

    let raf: number
    const start = performance.now()
    const ms    = duration * 1000

    const tick = (now: number) => {
      const t  = Math.min((now - start) / ms, 1)
      const e  = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)      // expo-out
      setCount(Math.round(from + (value - from) * e))
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, from, duration, trigger, reducedMotion])

  return <>{count.toLocaleString()}</>
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function CardHeader({ trigger }: { trigger: boolean }) {
  return (
    <div className="lic-header">
      <div className="lic-brand">
        <div className="lic-logo-mark" aria-hidden="true">L</div>
        <div className="lic-brand-text">
          <span className="lic-brand-name">LeadHive</span>
          <span className="lic-brand-sub">Conversation Intelligence</span>
        </div>
      </div>
      <div className="lic-header-meta">
        <div className="lic-live-pill">
          <span className="lic-live-dot" />
          <span>Live</span>
        </div>
        <span className="lic-unread">
          <strong><AnimatedNumber value={1284} from={1240} duration={1.2} trigger={trigger} /></strong>
          {' '}unread
        </span>
      </div>
    </div>
  )
}

function StatusBar() {
  return (
    <div className="lic-status-bar">
      <div className="lic-status-left">
        <Inbox size={12} strokeWidth={2} />
        <span>All Connected Channels</span>
      </div>
      <div className="lic-status-right">
        <span className="lic-ai-dot" />
        <span>AI Intent Triage Active</span>
      </div>
    </div>
  )
}

function ConversationRow({
  item,
  index,
  trigger,
  reducedMotion,
}: {
  item: typeof MESSAGES[number]
  index: number
  trigger: boolean
  reducedMotion: boolean | null
}) {
  return (
    <motion.div
      className={`lic-row${item.active ? ' lic-row--active' : ''}`}
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={trigger ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: 0.38,
        delay: reducedMotion ? 0 : 0.28 + index * 0.06,
        ease: ROW_EASE,
      }}
    >
      {/* Shimmer sweep — only on the active row, fires occasionally */}
      {item.active && !reducedMotion && (
        <span className="lic-row-sweep" aria-hidden="true" />
      )}

      {/* Avatar */}
      <div className={`lic-avatar lic-avatar--${item.tone}`} aria-hidden="true">
        {item.initials}
      </div>

      {/* Body */}
      <div className="lic-row-body">
        <div className="lic-row-top">
          <strong className="lic-sender">{item.name}</strong>
          <span className="lic-channel">{item.channel} · {item.company}</span>
          <span className="lic-time">{item.time}</span>
        </div>
        <p className="lic-msg">{item.message}</p>
        {item.active && (
          <div className="lic-signal-chip">
            <Sparkles size={10} className="lic-signal-icon" aria-hidden="true" />
            <span>High-intent commercial signal · 12-branch rollout</span>
          </div>
        )}
      </div>

      {/* Status pill */}
      <div className="lic-pill-wrap">
        <span className={`lic-pill lic-pill--${item.tone}`}>{item.status}</span>
      </div>
    </motion.div>
  )
}

function OpportunityBar() {
  return (
    <div className="lic-opp-bar">
      <div className="lic-opp-left">
        <div className="lic-opp-icon" aria-hidden="true">
          <Zap size={13} />
        </div>
        <div className="lic-opp-text">
          <span className="lic-opp-eyebrow">COMMERCIAL OPPORTUNITY</span>
          <strong className="lic-opp-title">High-intent lead surfaced</strong>
          <span className="lic-opp-sub">Immediate sales handover recommended</span>
        </div>
      </div>
      <a href="#contact" className="lic-opp-btn">
        Open Intelligence
        <ArrowRight size={12} />
      </a>
    </div>
  )
}

// ─── Main card ───────────────────────────────────────────────────────────────

function LeadIntelligenceCard({ trigger }: { trigger: boolean }) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      className="lic-card"
      aria-label="LeadHive conversation intelligence preview"
      initial={reducedMotion ? false : { opacity: 0, y: 28, scale: 0.985 }}
      animate={trigger ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.78, ease: CARD_EASE }}
    >
      {/* Ambient float — extremely subtle, disabled for reduced-motion */}
      <motion.div
        className="lic-card-inner"
        animate={reducedMotion ? undefined : { y: [0, -4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <CardHeader trigger={trigger} />
        <StatusBar />

        <div className="lic-rows">
          {MESSAGES.map((item, i) => (
            <ConversationRow
              key={item.id}
              item={item}
              index={i}
              trigger={trigger}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        <OpportunityBar />
      </motion.div>
    </motion.div>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────

const REVEAL_EASE = [0.16, 1, 0.3, 1] as const

export function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView     = useInView(sectionRef, { once: true, amount: 0.16 })
  const reducedMotion = useReducedMotion()
  const active     = Boolean(reducedMotion) || inView

  const reveal = useCallback((delay: number, distance = 18) => ({
    initial:    reducedMotion ? false : { opacity: 0, y: distance },
    animate:    active ? { opacity: 1, y: 0 } : { opacity: 0, y: distance },
    transition: { duration: 0.65, delay: reducedMotion ? 0 : delay, ease: REVEAL_EASE },
  }), [active, reducedMotion])

  return (
    <section className="problem-section section-pad" id="problem" ref={sectionRef}>
      {/* Layered atmospheric background */}
      <div className="problem-bg-decorations" aria-hidden="true">
        <div className="problem-mesh-glow problem-glow-primary" />
        <div className="problem-mesh-glow problem-glow-secondary" />
        <svg className="problem-ambient-grid-lines" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="problem-grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(37,99,235,0.035)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#problem-grid-pattern)" />
        </svg>
      </div>

      <div className="container problem-layout">

        {/* ── Left: Editorial copy ── */}
        <div className="problem-copy">
          <motion.div className="problem-eyebrow-pill" {...reveal(0)}>
            <span className="problem-eyebrow-dot" />
            <span>The problem</span>
          </motion.div>

          <motion.h2 className="problem-heading" {...reveal(0.08, 22)}>
            <span className="problem-headline-highlight">
              <AnimatedNumber value={10000} from={9700} trigger={active} duration={1.6} />{' '}conversations.
            </span>
            <br />
            <span className="problem-headline-sub">
              Your sales team shouldn't read all of them.
            </span>
          </motion.h2>

          <motion.div className="problem-support" {...reveal(0.18)}>
            <p>
              Inbound volume creates noise—unqualified queries, support requests, and casual browsing bury high-value intent. LeadHive surfaces the deals that matter before they slip away.
            </p>
            <div className="problem-campaign-pill">
              <span className="campaign-dot" />
              <span>Illustrative high-volume campaign scenario</span>
            </div>
          </motion.div>

          <motion.aside className="problem-insight-card" {...reveal(0.28)}>
            <div className="insight-icon-wrap">
              <ShieldAlert size={16} className="insight-shield-icon" />
            </div>
            <div className="insight-text-content">
              <span className="insight-kicker">THE CORE CHALLENGE</span>
              <strong className="insight-quote">
                "The problem is not getting more leads. The problem is knowing which ones actually matter."
              </strong>
            </div>
          </motion.aside>
        </div>

        {/* ── Right: Refined Intelligence Card ── */}
        <div className="inbox-stage">
          <div className="inbox-panel-glow" aria-hidden="true" />
          <LeadIntelligenceCard trigger={active} />
        </div>

      </div>
    </section>
  )
}
