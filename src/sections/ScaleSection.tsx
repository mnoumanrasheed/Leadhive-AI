import { Clock3, Focus, Layers3, TrendingUp } from 'lucide-react'
import { Reveal } from '../components/Reveal'

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
  return (
    <section className="scale-section section-pad" id="results">
      <div className="container">
        <Reveal className="scale-outcome-intro">
          <div><p className="eyebrow">Results at scale</p><h2>Turn conversation volume into operating clarity.</h2></div>
          <p>LeadHive improves the decisions around every inbound conversation: what needs a response, what needs qualification, and what deserves a seller’s attention now.</p>
        </Reveal>

        <div className="scale-outcome-grid">
          {outcomes.map((outcome, index) => {
            const Icon = outcome.icon
            return (
              <Reveal className="scale-outcome" delay={index * 0.055} key={outcome.label}>
                <div className="scale-outcome-top"><span>0{index + 1}</span><Icon /></div>
                <small>{outcome.label}</small>
                <h3>{outcome.title}</h3>
                <p>{outcome.copy}</p>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="scale-shift" aria-label="Operational change with LeadHive">
          <div><small>Without LeadHive</small><strong>First in the inbox</strong><span>Manual review · fragmented context · reactive follow-up</span></div>
          <i aria-hidden="true" />
          <div><small>With LeadHive</small><strong>Best opportunity first</strong><span>Clear priority · complete context · confident human action</span></div>
        </Reveal>
      </div>
    </section>
  )
}
