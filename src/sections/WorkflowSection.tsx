import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { BrainCircuit, Check, Gauge, MessageCircle, Send, SlidersHorizontal } from 'lucide-react'
import { Reveal } from '../components/Reveal'

const steps = [
  {
    number: '01',
    label: 'Incoming Message',
    title: 'Demand arrives on any connected channel.',
    copy: 'LeadHive receives the conversation immediately and preserves its source and history.',
    icon: MessageCircle,
  },
  {
    number: '02',
    label: 'AI Understanding',
    title: 'Language becomes usable customer context.',
    copy: 'The AI identifies intent, entities, sentiment, urgency, and the information already provided.',
    icon: BrainCircuit,
  },
  {
    number: '03',
    label: 'Qualification',
    title: 'Missing criteria are collected naturally.',
    copy: 'LeadHive asks the next relevant question using the qualification rules your team defines.',
    icon: SlidersHorizontal,
  },
  {
    number: '04',
    label: 'Lead Score',
    title: 'Fit and buying signals create a priority.',
    copy: 'Each conversation is ranked against commercial intent, completeness, urgency, and business fit.',
    icon: Gauge,
  },
  {
    number: '05',
    label: 'Sales Handover',
    title: 'A seller receives the opportunity, ready to act.',
    copy: 'The owner gets a concise summary, qualification evidence, full context, and a recommended next step.',
    icon: Send,
  },
] as const

export function WorkflowSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.2 })
  const reducedMotion = useReducedMotion()
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (!inView || reducedMotion) return
    const timer = window.setTimeout(() => setActiveStep((current) => (current + 1) % steps.length), 1550)
    return () => window.clearTimeout(timer)
  }, [activeStep, inView, reducedMotion])

  return (
    <section className="workflow-section section-pad" id="workflow" ref={ref} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Slow Ambient Background Glow Drift */}
      <div className="workflow-ambient-backdrop" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <motion.div
          style={{
            position: 'absolute',
            top: '15%',
            left: '3%',
            width: '520px',
            height: '520px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, rgba(37, 99, 235, 0.03) 50%, transparent 70%)',
            filter: 'blur(95px)',
          }}
          animate={inView && !reducedMotion ? { x: [0, 15, 0], y: [0, -10, 0], scale: [1, 1.04, 1] } : { x: 0, y: 0 }}
          transition={{ duration: 24, repeat: inView && !reducedMotion ? Infinity : 0, ease: 'easeInOut' }}
        />
        <motion.div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, rgba(37, 99, 235, 0.02) 50%, transparent 70%)',
            filter: 'blur(90px)',
          }}
          animate={inView && !reducedMotion ? { x: [0, -14, 0], y: [0, 8, 0], scale: [1, 1.03, 1] } : { x: 0, y: 0 }}
          transition={{ duration: 20, repeat: inView && !reducedMotion ? Infinity : 0, ease: 'easeInOut' }}
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="workflow-intro">
          <Reveal>
            <p className="eyebrow light">How it works</p>
            <h2>One continuous path from first message to human action.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p style={{ color: 'var(--ink-subtle)', fontSize: 'var(--text-base)', lineHeight: 1.7 }}>
              The workflow runs in real time, keeps context intact, and brings your sales team in only when human judgment can move the opportunity forward.
            </p>
          </Reveal>
        </div>

        <div className="workflow-rail" aria-label="LeadHive qualification workflow">
          <div className="workflow-track" aria-hidden="true">
            <motion.i
              className="workflow-progress-horizontal"
              initial={false}
              animate={{ scaleX: reducedMotion ? 1 : (activeStep + 1) / steps.length }}
              transition={{ duration: reducedMotion ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.i
              className="workflow-progress-vertical"
              initial={false}
              animate={{ scaleY: reducedMotion ? 1 : (activeStep + 1) / steps.length }}
              transition={{ duration: reducedMotion ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Reveal
                className={`workflow-step${activeStep === index ? ' is-active' : ''}${activeStep > index ? ' is-complete' : ''}`}
                delay={index * 0.075}
                key={step.number}
              >
                <motion.div
                  className="workflow-node"
                  animate={activeStep === index && inView && !reducedMotion ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                  <Icon />
                  <span>{step.number}</span>
                  <motion.i
                    animate={activeStep === index && inView && !reducedMotion ? { scale: [0.8, 1.45], opacity: [0.5, 0] } : { opacity: 0 }}
                    transition={{ duration: 1, repeat: 1 }}
                  />
                </motion.div>
                <small>{step.label}</small>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={0.42}>
          <div className={`workflow-handoff-summary${activeStep === steps.length - 1 ? ' is-active' : ''}`}>
            <span className="avatar navy">AC</span>
            <div><small>Sales handover prepared</small><strong>20-site rollout · enterprise pricing · next month</strong></div>
            <span className="workflow-summary-check"><Check /> Context verified</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
