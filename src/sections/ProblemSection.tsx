import { ArrowRight } from 'lucide-react'
import { Reveal } from '../components/Reveal'

const messages = [
  ['Can you share the price?', 'Warm', '2m'],
  ['Need this for 12 branches ASAP', 'High intent', '4m'],
  ['Hello???', 'Unqualified', '6m'],
  ['Do you deliver to Lahore?', 'Warm', '8m'],
  ['Looking for a job', 'Not a lead', '12m'],
]

export function ProblemSection() {
  return (
    <section className="problem-section section-pad">
      <div className="container problem-layout">
        <Reveal className="problem-copy">
          <p className="eyebrow">The problem</p>
          <h2>10,000 conversations.<br />Your sales team shouldn’t read all of them.</h2>
          <p>More attention creates more messages—but not every conversation represents real buying intent. Your team shouldn’t have to read them all to find out.</p>
          <div className="editorial-note">
            <span>The real challenge</span>
            <strong>The problem is not getting more leads. The problem is knowing which ones actually matter.</strong>
          </div>
        </Reveal>

        <Reveal className="inbox-visual" delay={0.08}>
          <div className="inbox-head"><div><i /> Unified inbox</div><span>1,284 unread</span></div>
          <div className="inbox-rows">
            {messages.map(([message, status, time], index) => (
              <div className={`inbox-row ${index === 1 ? 'selected' : ''}`} key={message}>
                <span className={`avatar tone-${index}`}>{['S', 'A', 'M', 'H', 'R'][index]}</span>
                <div><strong>{message}</strong><small>Incoming conversation</small></div>
                <span className="row-status">{status}</span>
                <time>{time}</time>
              </div>
            ))}
          </div>
          <div className="signal-strip">
            <span>High-intent signal detected</span>
            <strong>Commercial opportunity surfaced</strong>
            <ArrowRight />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
