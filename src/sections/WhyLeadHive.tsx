import { ArrowRight, Clock, Cpu, Layers, Target, TrendingUp, Zap } from 'lucide-react'
import { motion } from 'motion/react'
import { Reveal } from '../components/Reveal'
import { useViewportCycle } from '../hooks/useViewportCycle'

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
  const { ref, inView, reducedMotion, step } = useViewportCycle({ steps: benefits.length, interval: 1350, amount: 0.16 })

  return (
    <section className="why-section section-pad" id="why" ref={ref}>
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
              <Reveal className={`benefit-row${step === index ? ' is-active' : ''}`} delay={index * 0.07} key={benefit.title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.copy}</p>
                </div>
                <motion.div className="benefit-icon-badge" aria-hidden="true" animate={step === index && inView && !reducedMotion ? { x: [0, 3, 0], rotate: [0, 1.5, 0] } : undefined} transition={{ duration: 0.85 }}><Icon /></motion.div>
              </Reveal>
            )
          })}
        </div>
      </div>
      <Reveal className="container strategy-line">
        <div className="strategy-step"><span>01</span><small>Marketing</small><strong>Generates attention</strong></div><span className="strategy-connector"><ArrowRight /><motion.i animate={inView && !reducedMotion ? { x: [0, 34], opacity: [0, 1, 0] } : { x: 0, opacity: 0 }} transition={{ duration: 1.2, repeat: inView && !reducedMotion ? Infinity : 0, repeatDelay: 2.4 }} /></span>
        <motion.div className="strategy-step strategy-center" animate={inView && !reducedMotion ? { scale: [1, 1.012, 1] } : { scale: 1 }} transition={{ duration: 3.6, repeat: inView && !reducedMotion ? Infinity : 0, ease: 'easeInOut' }}><span>02</span><small>LeadHive AI</small><strong>Creates intelligence</strong></motion.div><span className="strategy-connector"><ArrowRight /><motion.i animate={inView && !reducedMotion ? { x: [0, 34], opacity: [0, 1, 0] } : { x: 0, opacity: 0 }} transition={{ duration: 1.2, repeat: inView && !reducedMotion ? Infinity : 0, repeatDelay: 2.4, delay: 1.2 }} /></span>
        <div className="strategy-step"><span>03</span><small>Your sales team</small><strong>Closes deals</strong></div>
      </Reveal>
      <Reveal className="container intersection-copy">
        <span>Built at the intersection of</span>
        <strong>AI engineering<br />and customer experience.</strong>
        <p>LeadHive combines conversation understanding with sales automation to create precise Lead Intelligence and human-ready Sales Handovers—not just more replies.</p>
      </Reveal>
    </section>
  )
}
