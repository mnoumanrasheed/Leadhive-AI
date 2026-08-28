import { ArrowRight, Clock, Cpu, Layers, Target, TrendingUp, Zap } from 'lucide-react'
import { Reveal } from '../components/Reveal'

const benefits = [
  {
    title: 'One intelligent frontline',
    copy: 'Every channel. One consistent, intelligent customer experience.',
    icon: Layers,
  },
  {
    title: 'Always on',
    copy: 'Qualify demand 24/7—even when your sales team is offline.',
    icon: Clock,
  },
  {
    title: 'Instant response',
    copy: 'Keep momentum high with responses delivered in seconds.',
    icon: Zap,
  },
  {
    title: 'Built for scale',
    copy: 'Handle campaign spikes without adding operational headcount.',
    icon: TrendingUp,
  },
  {
    title: 'Smart qualification',
    copy: 'Surface the signals that reveal commercial opportunity.',
    icon: Target,
  },
  {
    title: 'Structured intelligence',
    copy: 'Turn messy conversations into clean, usable sales context.',
    icon: Cpu,
  },
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
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <Reveal className="benefit-row" delay={index * 0.035} key={benefit.title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.copy}</p>
                </div>
                <div className="benefit-icon-badge" aria-hidden="true">
                  <Icon />
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
      <Reveal className="container strategy-line">
        <div><small>Marketing</small><strong>Generates attention</strong></div><ArrowRight />
        <div className="strategy-center"><small>LeadHive AI</small><strong>Creates intelligence</strong></div><ArrowRight />
        <div><small>Your sales team</small><strong>Closes deals</strong></div>
      </Reveal>
      <Reveal className="container intersection-copy">
        <span>Built at the intersection of</span>
        <strong>AI engineering<br />and customer experience.</strong>
        <p>LeadHive combines conversation understanding with sales automation to create precise Lead Intelligence and human-ready Sales Handovers—not just more replies.</p>
      </Reveal>
    </section>
  )
}
