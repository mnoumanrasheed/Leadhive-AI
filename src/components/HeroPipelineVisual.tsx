import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowRight, Check, MessageCircle, Sparkles, Target } from 'lucide-react'

const signals = [
  { channel: 'WhatsApp', message: 'Pricing for 20 locations?', tone: 'whatsapp' },
  { channel: 'Instagram', message: 'Can we launch next month?', tone: 'instagram' },
  { channel: 'Web chat', message: 'Need enterprise onboarding', tone: 'web' },
]

type HeroPhase = 'incoming' | 'processing' | 'scoring' | 'output'

export function HeroPipelineVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const reducedMotion = useReducedMotion()
  const animate = inView && !reducedMotion
  const [phase, setPhase] = useState<HeroPhase>('incoming')
  const [activeSignal, setActiveSignal] = useState(0)

  useEffect(() => {
    if (reducedMotion) {
      setPhase('output')
      return
    }
    if (!inView) return

    setPhase('incoming')
    const processing = window.setTimeout(() => setPhase('processing'), 1650)
    const scoring = window.setTimeout(() => setPhase('scoring'), 3200)
    const output = window.setTimeout(() => setPhase('output'), 4650)
    const restart = window.setTimeout(() => setActiveSignal((current) => (current + 1) % signals.length), 6900)
    return () => {
      window.clearTimeout(processing)
      window.clearTimeout(scoring)
      window.clearTimeout(output)
      window.clearTimeout(restart)
    }
  }, [activeSignal, inView, reducedMotion])

  const score = phase === 'incoming' ? 72 : phase === 'processing' ? 81 : phase === 'scoring' ? 92 : 92

  return (
    <motion.div className="hero-intelligence-visual" ref={ref} aria-label="LeadHive separates high-intent opportunities from conversation volume" animate={animate ? { y: [0, -3, 0] } : { y: 0 }} transition={{ duration: 7.5, repeat: animate ? Infinity : 0, ease: 'easeInOut' }}>
      <div className="hero-visual-topline">
        <span><i /> Live conversation intelligence</span>
        <small>All channels connected</small>
      </div>

      <div className="hero-signal-stage">
        <div className="hero-message-stream" aria-label="Incoming conversation signals">
          {signals.map((signal, index) => (
            <motion.div
              className={`hero-signal-message${activeSignal === index ? ' is-active' : ''}`}
              key={signal.channel}
              initial={reducedMotion ? false : { opacity: 0.45, x: -8 }}
              animate={animate && activeSignal === index && phase === 'incoming' ? { opacity: [0.55, 1], x: [-8, 8] } : { opacity: activeSignal === index ? 1 : 0.62, x: 0 }}
              transition={{ duration: phase === 'incoming' ? 1.5 : 0.4, ease: 'easeInOut' }}
            >
              <span className={`hero-signal-icon ${signal.tone}`}><MessageCircle /></span>
              <span><small>{signal.channel}</small><strong>{signal.message}</strong></span>
            </motion.div>
          ))}
          <div className="hero-stream-volume"><span>+9,997 more</span><i /></div>
        </div>

        <motion.span className="hero-incoming-signal" animate={animate && phase === 'incoming' ? { x: [0, 52], opacity: [0, 1, 0] } : { opacity: 0 }} transition={{ duration: 1.45, ease: 'easeInOut' }} aria-hidden="true" />

        <div className="hero-intelligence-core" aria-label="AI qualification engine">
          <motion.div
            className="hero-core-orbit"
            animate={animate && (phase === 'processing' || phase === 'scoring') ? { scale: [0.92, 1.08], opacity: [0.18, 0.45, 0.18] } : { opacity: 0.25 }}
            transition={{ duration: 1.2, repeat: animate && (phase === 'processing' || phase === 'scoring') ? Infinity : 0, ease: 'easeInOut' }}
          />
          <div className="hero-core-mark"><Sparkles /></div>
          <strong>LeadHive AI</strong>
          <span>{phase === 'incoming' ? 'Signal received' : phase === 'processing' ? 'Understanding intent' : phase === 'scoring' ? 'Qualification complete' : 'Opportunity prioritized'}</span>
          <div className="hero-core-signals">
            {['Budget', 'Timing', 'Scope'].map((item, index) => <motion.small key={item} animate={{ opacity: phase === 'scoring' || phase === 'output' || index === 0 && phase === 'processing' ? 1 : 0.42, x: phase === 'scoring' ? [0, 2, 0] : 0 }} transition={{ delay: index * 0.12 }}><Check /> {item}</motion.small>)}
          </div>
        </div>

        <motion.div
          className="hero-output-card"
          initial={reducedMotion ? false : { opacity: 0.65, x: 10 }}
          animate={phase === 'output' ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0.68, x: 8, scale: 0.99 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <div className="hero-output-label"><Target /> Sales-ready</div>
          <div className="hero-output-number"><strong>150</strong><span>priority leads</span></div>
          <div className="hero-output-lead">
            <span>AC</span>
            <div><strong>Amelia Carter</strong><small>20-site rollout · next month</small></div>
            <motion.b key={score} initial={reducedMotion ? false : { scale: 0.92, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }}>{score}</motion.b>
          </div>
          <div className="hero-output-action">Full context attached <ArrowRight /></div>
        </motion.div>
      </div>

      <div className="hero-visual-caption">
        <span>10,000 conversations</span>
        <i aria-hidden="true" />
        <strong>150 sales-ready leads</strong>
      </div>
    </motion.div>
  )
}
