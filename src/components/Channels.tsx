import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { Globe2, PhoneCall, Sparkles, Check } from 'lucide-react'
import { Reveal } from './Reveal'

type SequencePhase = 'idle' | 'incoming' | 'processing' | 'output'

function MessengerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.4 11.5c0 4.7-3.7 8.1-8.5 8.1-.8 0-1.7-.1-2.4-.3L5.8 21l.8-3.3a7.7 7.7 0 0 1-3.1-6.2c0-4.7 3.7-8.1 8.5-8.1s8.4 3.4 8.4 8.1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m7.8 13.7 3.1-3.3 2.4 1.8 2.9-3.1-3.2 4.5-2.4-1.8-2.8 1.9Z" fill="currentColor" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  )
}

const channels = [
  {
    id: 'facebook',
    name: 'Facebook Messenger',
    shortName: 'Messenger',
    copy: 'Campaign replies, understood.',
    icon: MessengerIcon,
  },
  {
    id: 'instagram',
    name: 'Instagram Direct Messages',
    shortName: 'Instagram',
    copy: 'High-intent DMs, qualified.',
    icon: InstagramIcon,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    shortName: 'WhatsApp',
    copy: 'Demand qualified at scale.',
    icon: PhoneCall,
  },
  {
    id: 'website',
    name: 'Website',
    shortName: 'Website',
    copy: 'Visitor intent captured live.',
    icon: Globe2,
  },
] as const

const connectionPaths = [
  'M 22 19 C 34 19, 35 38, 44 45',
  'M 78 19 C 66 19, 65 38, 56 45',
  'M 22 67 C 34 67, 35 56, 44 51',
  'M 78 67 C 66 67, 65 56, 56 51',
] as const

export function Channels() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { amount: 0.25 })
  const reducedMotion = useReducedMotion()
  const [activeChannel, setActiveChannel] = useState(0)
  const [hoveredChannel, setHoveredChannel] = useState<number | null>(null)
  const [phase, setPhase] = useState<SequencePhase>('idle')

  useEffect(() => {
    if (reducedMotion) {
      setPhase('output')
      return
    }

    if (!inView) {
      setPhase('idle')
      return
    }

    setPhase('incoming')
    const processTimer = window.setTimeout(() => setPhase('processing'), 1500)
    const outputTimer = window.setTimeout(() => setPhase('output'), 3200)
    const nextTimer = window.setTimeout(() => {
      setActiveChannel((current) => (current + 1) % channels.length)
    }, 5600)

    return () => {
      window.clearTimeout(processTimer)
      window.clearTimeout(outputTimer)
      window.clearTimeout(nextTimer)
    }
  }, [activeChannel, inView, reducedMotion])

  const focusedChannel = hoveredChannel ?? activeChannel
  const hubStatus = phase === 'processing'
    ? 'Qualifying conversation…'
    : phase === 'output'
      ? 'Sales-ready opportunity created'
      : 'Listening across every channel'

  return (
    <section className="channels-section section-pad" id="channels" ref={sectionRef}>
      <div className="channels-section-depth" aria-hidden="true" />
      <div className="container channels-network-layout">
        <Reveal className="channels-copy">
          <p className="eyebrow">Unified channels</p>
          <h2>Built for where your customers already talk to you.</h2>
          <p>Customers don’t always fill out forms. They send messages. LeadHive turns those conversations into structured opportunities.</p>
          <div className="channels-proof">
            <span><Check /></span>
            <div><small>One connected frontline</small><strong>Every conversation. One intelligence layer.</strong></div>
          </div>
        </Reveal>

        <Reveal className="channels-network-wrap" delay={0.08}>
          <div className={`channels-network${hoveredChannel !== null ? ' has-hover' : ''}`}>
            <svg className="channels-connection-map" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {connectionPaths.map((path, index) => (
                <g key={path} className={focusedChannel === index ? 'is-focused' : ''}>
                  <path className="channel-connection-base" d={path} pathLength="1" />
                  {inView && !reducedMotion && phase === 'incoming' && activeChannel === index && (
                    <motion.path
                      key={`${activeChannel}-${phase}`}
                      className="channel-connection-signal"
                      d={path}
                      pathLength="1"
                      strokeDasharray="0.08 0.92"
                      initial={{ strokeDashoffset: 1, opacity: 0 }}
                      animate={{ strokeDashoffset: 0, opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 1.45, ease: 'easeInOut' }}
                    />
                  )}
                </g>
              ))}
              <path className="channel-output-line" d="M 50 58 L 50 84" pathLength="1" />
              {inView && !reducedMotion && phase === 'output' && (
                <motion.path
                  key={`output-${activeChannel}`}
                  className="channel-output-signal"
                  d="M 50 58 L 50 84"
                  pathLength="1"
                  strokeDasharray="0.18 0.82"
                  initial={{ strokeDashoffset: 1, opacity: 0 }}
                  animate={{ strokeDashoffset: 0, opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.25, ease: 'easeInOut' }}
                />
              )}
            </svg>

            <motion.div
              className={`channels-ai-hub${phase === 'processing' ? ' is-processing' : ''}${hoveredChannel !== null ? ' is-reacting' : ''}`}
              animate={phase === 'processing' && inView && !reducedMotion ? { scale: [1, 1.012, 1] } : { scale: 1 }}
              transition={{ duration: 0.75, ease: 'easeInOut' }}
            >
              <motion.i
                className="channels-ai-pulse"
                animate={phase === 'processing' && inView && !reducedMotion ? { scale: [0.82, 1.16], opacity: [0.45, 0] } : { opacity: 0 }}
                transition={{ duration: 0.9, repeat: phase === 'processing' ? 1 : 0, ease: 'easeOut' }}
                aria-hidden="true"
              />
              <div className="channels-hub-brand"><span className="mark">L</span><small>LeadHive AI</small></div>
              <h3>LeadHive Intelligence</h3>
              <div className="channels-processing-stages" aria-label="Understand, qualify, prioritize">
                <span>Understand</span><i>→</i><span>Qualify</span><i>→</i><span>Prioritize</span>
              </div>
              <div className="channels-hub-status"><i /><span>{hubStatus}</span></div>
            </motion.div>

            <motion.span
              className="channels-mobile-pulse"
              animate={inView && !reducedMotion && phase === 'incoming' ? { y: [18, 0], opacity: [0, 1, 0] } : { opacity: 0 }}
              transition={{ duration: 1.25, ease: 'easeInOut' }}
              aria-hidden="true"
            />

            <div className="channels-node-grid">
              {channels.map((channel, index) => {
                const Icon = channel.icon
                const isActive = focusedChannel === index
                const isSending = activeChannel === index && phase === 'incoming' && inView
                return (
                  <button
                    type="button"
                    className={`channel-node channel-node-${index}${isActive ? ' is-active' : ''}${isSending ? ' is-sending' : ''}`}
                    key={channel.id}
                    onMouseEnter={() => setHoveredChannel(index)}
                    onMouseLeave={() => setHoveredChannel(null)}
                    onFocus={() => setHoveredChannel(index)}
                    onBlur={() => setHoveredChannel(null)}
                    aria-label={`${channel.name}, connected to LeadHive AI`}
                  >
                    <span className={`channel-brand-icon ${channel.id}`}><Icon /></span>
                    <span className="channel-node-copy"><strong>{channel.shortName}</strong><small>{channel.copy}</small></span>
                    <span className="channel-connected"><i /> Connected</span>
                  </button>
                )
              })}
            </div>

            <motion.div
              className={`channels-lead-output${phase === 'output' ? ' is-ready' : ''}`}
              animate={phase === 'output' && inView && !reducedMotion ? { y: [3, 0], opacity: [0.7, 1] } : { y: 0, opacity: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <span><Sparkles /></span>
              <div><small>Qualified output</small><strong>Sales-ready lead</strong></div>
              <i><Check /></i>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
