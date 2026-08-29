import { Clock3, Focus, Layers3, TrendingUp } from 'lucide-react'
import { motion } from 'motion/react'
import { Reveal } from '../components/Reveal'
import { useViewportCycle } from '../hooks/useViewportCycle'

const outcomes = [
  {
    icon: Clock3,
    label: 'Faster qualification',
    title: 'Respond while intent is active.',
    copy: 'Understand and qualify demand in the conversation instead of waiting for a manual inbox review.',
  },
  {
    icon: Focus,
    label: 'Higher sales focus',
    title: 'Start with the best opportunity.',
    copy: 'A ranked queue directs seller attention using fit, urgency, and commercial intent—not arrival time.',
  },
  {
    icon: Layers3,
    label: 'Less wasted effort',
    title: 'Keep noise out of the sales workflow.',
    copy: 'General questions and low-intent conversations can be handled without consuming seller capacity.',
  },
  {
    icon: TrendingUp,
    label: 'Scalable processing',
    title: 'Absorb demand without losing clarity.',
    copy: 'Maintain consistent qualification and prioritization through campaign spikes and seasonal peaks.',
  },
] as const

export function ScaleSection() {
  const { ref, inView, reducedMotion, step } = useViewportCycle({ steps: outcomes.length, interval: 1800 })

  return (
    <section className="scale-section section-pad" id="results" ref={ref}>
      <div className="container">
        <Reveal className="scale-outcome-intro">
          <div><p className="eyebrow">Results at scale</p><h2>Turn conversation volume into operating clarity.</h2></div>
          <p>LeadHive improves the decisions around every inbound conversation: what needs a response, what needs qualification, and what deserves a seller’s attention now.</p>
        </Reveal>

        <div className="scale-outcome-grid">
          {outcomes.map((outcome, index) => {
            const Icon = outcome.icon
            return (
              <Reveal className={`scale-outcome${step === index ? ' is-active' : ''}`} delay={index * 0.075} key={outcome.label}>
                <div className="scale-outcome-top"><span>0{index + 1}</span><Icon /></div>
                <small>{outcome.label}</small>
                <h3>{outcome.title}</h3>
                <p>{outcome.copy}</p>
                <span className="scale-outcome-meter"><motion.i animate={{ scaleX: reducedMotion ? 1 : step === index ? 1 : 0.16 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }} /></span>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="scale-shift" aria-label="Operational change with LeadHive">
          <div><small>Without LeadHive</small><strong>First in the inbox</strong><span>Manual review · fragmented context · reactive follow-up</span></div>
          <i aria-hidden="true"><motion.b animate={inView && !reducedMotion ? { x: [-5, 29], opacity: [0, 1, 0] } : { x: 0, opacity: 0 }} transition={{ duration: 1.6, repeat: inView && !reducedMotion ? Infinity : 0, repeatDelay: 1.1, ease: 'easeInOut' }} /></i>
          <div><small>With LeadHive</small><strong>Best opportunity first</strong><span>Clear priority · complete context · confident human action</span></div>
        </Reveal>
      </div>
    </section>
  )
}
