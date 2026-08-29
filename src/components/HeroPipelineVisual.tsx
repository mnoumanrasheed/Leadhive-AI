import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowRight, Check, MessageCircle, Sparkles, Target } from 'lucide-react'

const signals = [
  { channel: 'WhatsApp', message: 'Pricing for 20 locations?', tone: 'whatsapp' },
  { channel: 'Instagram', message: 'Can we launch next month?', tone: 'instagram' },
  { channel: 'Web chat', message: 'Need enterprise onboarding', tone: 'web' },
]

export function HeroPipelineVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const reducedMotion = useReducedMotion()
  const animate = inView && !reducedMotion

  return (
    <div className="hero-intelligence-visual" ref={ref} aria-label="LeadHive separates high-intent opportunities from conversation volume">
      <div className="hero-visual-topline">
        <span><i /> Live conversation intelligence</span>
        <small>All channels connected</small>
      </div>

      <div className="hero-signal-stage">
        <div className="hero-message-stream" aria-label="Incoming conversation signals">
          {signals.map((signal, index) => (
            <motion.div
              className="hero-signal-message"
              key={signal.channel}
              initial={reducedMotion ? false : { opacity: 0.45, x: -8 }}
              animate={animate ? { opacity: [0.45, 1, 0.65], x: [-8, 0, 8] } : { opacity: 0.8, x: 0 }}
              transition={{ duration: 3.6, delay: index * 0.55, repeat: animate ? Infinity : 0, ease: 'easeInOut' }}
            >
              <span className={`hero-signal-icon ${signal.tone}`}><MessageCircle /></span>
              <span><small>{signal.channel}</small><strong>{signal.message}</strong></span>
            </motion.div>
          ))}
          <div className="hero-stream-volume"><span>+9,997 more</span><i /></div>
        </div>

        <div className="hero-intelligence-core" aria-label="AI qualification engine">
          <motion.div
            className="hero-core-orbit"
            animate={animate ? { scale: [0.92, 1.08], opacity: [0.18, 0.45, 0.18] } : { opacity: 0.25 }}
            transition={{ duration: 2.8, repeat: animate ? Infinity : 0, ease: 'easeInOut' }}
          />
          <div className="hero-core-mark"><Sparkles /></div>
          <strong>LeadHive AI</strong>
          <span>Intent understood</span>
          <div className="hero-core-signals">
            <small><Check /> Budget</small>
            <small><Check /> Timing</small>
            <small><Check /> Scope</small>
          </div>
        </div>

        <motion.div
          className="hero-output-card"
          initial={reducedMotion ? false : { opacity: 0.65, x: 10 }}
          animate={animate ? { opacity: [0.65, 1, 1], x: [10, 0, 0] } : { opacity: 1, x: 0 }}
          transition={{ duration: 3.6, repeat: animate ? Infinity : 0, repeatDelay: 0.8, ease: 'easeOut' }}
        >
          <div className="hero-output-label"><Target /> Sales-ready</div>
          <div className="hero-output-number"><strong>150</strong><span>priority leads</span></div>
          <div className="hero-output-lead">
            <span>AC</span>
            <div><strong>Amelia Carter</strong><small>20-site rollout · next month</small></div>
            <b>92</b>
          </div>
          <div className="hero-output-action">Full context attached <ArrowRight /></div>
        </motion.div>
      </div>

      <div className="hero-visual-caption">
        <span>10,000 conversations</span>
        <i aria-hidden="true" />
        <strong>150 sales-ready leads</strong>
      </div>
    </div>
  )
}
