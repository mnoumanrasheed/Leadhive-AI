import { Clock3, MessagesSquare, SearchX, Split } from 'lucide-react'
import { Reveal } from '../components/Reveal'

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
  return (
    <section className="problem-section section-pad" id="problem">
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
          {pressurePoints.map((item, index) => {
            const Icon = item.icon
            return (
              <Reveal className="problem-pressure-row" delay={index * 0.05} key={item.label}>
                <span className="problem-pressure-number">0{index + 1}</span>
                <span className="problem-pressure-icon" aria-hidden="true"><Icon /></span>
                <div>
                  <small>{item.label}</small>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
