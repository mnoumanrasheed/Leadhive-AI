import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { BrainCircuit, Check, Gauge, MessageCircle, Send, SlidersHorizontal } from 'lucide-react'

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
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const reducedMotion = useReducedMotion()

  return (
    <section className="workflow-section section-pad" id="workflow" ref={ref}>
      <div className="container">
        <div className="workflow-intro">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
          >
            <p className="eyebrow light">How it works</p>
            <h2>One continuous path from first message to human action.</h2>
          </motion.div>
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: reducedMotion ? 0 : 0.08 }}
          >
            The workflow runs in real time, keeps context intact, and brings your sales team in only when human judgment can move the opportunity forward.
          </motion.p>
        </div>

        <div className="workflow-rail" aria-label="LeadHive qualification workflow">
          <div className="workflow-track" aria-hidden="true">
            <motion.i
              initial={reducedMotion ? { scaleX: 1 } : { scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : undefined}
              transition={{ duration: reducedMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.article
                className="workflow-step"
                key={step.number}
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.55, delay: reducedMotion ? 0 : 0.12 + index * 0.09 }}
              >
                <div className="workflow-node"><Icon /><span>{step.number}</span></div>
                <small>{step.label}</small>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </motion.article>
            )
          })}
        </div>

        <motion.div
          className="workflow-handoff-summary"
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: reducedMotion ? 0 : 0.68 }}
        >
          <span className="avatar navy">AC</span>
          <div><small>Sales handover prepared</small><strong>20-site rollout · enterprise pricing · next month</strong></div>
          <span className="workflow-summary-check"><Check /> Context verified</span>
        </motion.div>
      </div>
    </section>
  )
}
