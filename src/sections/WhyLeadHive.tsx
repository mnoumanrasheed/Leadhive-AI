import { ArrowRight, Check } from 'lucide-react'
import { Reveal } from '../components/Reveal'

const benefits = [
  ['One intelligent frontline', 'Every channel. One consistent, intelligent customer experience.'],
  ['Always on', 'Qualify demand 24/7—even when your sales team is offline.'],
  ['Instant response', 'Keep momentum high with responses delivered in seconds.'],
  ['Built for scale', 'Handle campaign spikes without adding operational headcount.'],
  ['Smart qualification', 'Surface the signals that reveal commercial opportunity.'],
  ['Structured intelligence', 'Turn messy conversations into clean, usable sales context.'],
]

export function WhyLeadHive() {
  return (
    <section className="why-section section-pad" id="why">
      <div className="container why-layout">
        <Reveal className="why-heading">
          <p className="eyebrow">Why LeadHive</p>
          <h2>Your sales team should sell—not sort messages.</h2>
          <p>More attention should create more business, not more operational chaos. LeadHive turns unstructured conversations into prioritized opportunities.</p>
        </Reveal>
        <div className="benefit-list">
          {benefits.map(([title, copy], index) => (
            <Reveal className="benefit-row" delay={index * 0.035} key={title}>
              <span>0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div><Check />
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal className="container strategy-line">
        <div><small>Marketing</small><strong>Generates attention</strong></div><ArrowRight />
        <div className="strategy-center"><small>LeadHive AI</small><strong>Creates intelligence</strong></div><ArrowRight />
        <div><small>Your sales team</small><strong>Closes deals</strong></div>
      </Reveal>
      <Reveal className="container intersection-copy">
        <span>Built at the intersection of</span>
        <strong>AI technology<br />and marketing intelligence.</strong>
        <p>Technology understands conversations. Marketing understands customers. LeadHive brings both together to produce better-qualified opportunities—not just more replies.</p>
      </Reveal>
    </section>
  )
}
