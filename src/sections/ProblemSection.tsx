import { motion } from 'motion/react'
import { BrainCircuit, Clock3, MessagesSquare, SearchX, Split } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { useViewportCycle } from '../hooks/useViewportCycle'

const pressurePoints = [
  {
    icon: Split,
    label: 'Fragmented channels',
    title: 'Demand lands in separate inboxes.',
    copy: 'WhatsApp, Instagram, Messenger, and web chat each create a different queue and an incomplete customer view.',
  },
  {
    icon: Clock3,
    label: 'Slow response',
    title: 'Buying momentum disappears quickly.',
    copy: 'High-intent questions wait behind general enquiries while teams work through the backlog manually.',
  },
  {
    icon: SearchX,
    label: 'Hidden opportunity',
    title: 'The strongest signals look like every other message.',
    copy: 'Budget, urgency, scope, and decision timing remain buried in unstructured conversation history.',
  },
  {
    icon: MessagesSquare,
    label: 'Manual triage',
    title: 'Sales spends time sorting instead of selling.',
    copy: 'Reps read repetitive questions and low-intent messages before they reach the conversations that need human attention.',
  },
]

export function ProblemSection() {
  const { ref, inView, reducedMotion, step } = useViewportCycle({ steps: pressurePoints.length, interval: 1750 })

  return (
    <section className="problem-section section-pad" id="problem" ref={ref}>
      <div className="container problem-editorial-layout">
        <Reveal className="problem-editorial-copy">
          <p className="eyebrow">The problem</p>
          <h2>More inbound attention should not create more sales chaos.</h2>
          <p>Customer demand arrives continuously, but the information sales needs is scattered across channels, buried in natural language, and discovered too late.</p>
          <aside className="problem-thesis">
            <span>The real bottleneck</span>
            <strong>Knowing where human attention will create the most value.</strong>
          </aside>
        </Reveal>

        <div className="problem-pressure-list" aria-label="Common lead management challenges">
          <div className="problem-live-status"><motion.i animate={inView && !reducedMotion ? { scale: [1, 1.35, 1], opacity: [0.45, 1, 0.45] } : { scale: 1, opacity: 0.6 }} transition={{ duration: 1.5, repeat: inView && !reducedMotion ? Infinity : 0 }} /><BrainCircuit /><span>AI triage scanning live demand</span></div>
          {pressurePoints.map((item, index) => {
            const Icon = item.icon
            const isActive = reducedMotion ? index === 2 : inView && step === index
            return (
              <Reveal className={`problem-pressure-row${isActive ? ' is-active' : ''}`} delay={index * 0.075} key={item.label}>
                <motion.i className="problem-row-scan" animate={isActive && !reducedMotion ? { scaleX: [0, 1], opacity: [0, 0.7, 0] } : { scaleX: 0, opacity: 0 }} transition={{ duration: 1.4, ease: 'easeInOut' }} />
                <span className="problem-pressure-number">0{index + 1}</span>
                <motion.span className="problem-pressure-icon" aria-hidden="true" animate={isActive && !reducedMotion ? { x: [0, 3, 0], scale: [1, 1.04, 1] } : undefined} transition={{ duration: 1.1 }}><Icon /></motion.span>
                <div>
                  <small>{item.label}</small>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  {index === 2 && <motion.span className="problem-opportunity-flag" animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -4 }}><i /> High-value signal found</motion.span>}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
