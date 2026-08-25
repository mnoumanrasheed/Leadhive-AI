import { TrendingUp } from 'lucide-react'
import { Reveal } from '../components/Reveal'

const funnel = [
  ['10,000', 'Incoming inquiries', '100%'],
  ['6,850', 'Meaningful conversations', '82%'],
  ['1,240', 'Potential prospects', '61%'],
  ['420', 'Qualified opportunities', '44%'],
  ['150', 'Hot leads', '28%'],
]

export function ScaleSection() {
  return (
    <section className="scale-section section-pad">
      <div className="container scale-layout">
        <Reveal className="scale-copy">
          <p className="eyebrow">Clarity at scale</p>
          <h2>This is what sales intelligence looks like.</h2>
          <p>Stop asking whether every message was answered. Start asking how quickly your team can close the opportunities that matter most.</p>
          <blockquote>“Your team starts the day with clarity, not backlog.”</blockquote>
        </Reveal>
        <Reveal className="funnel-visual" delay={0.08}>
          <div className="funnel-head"><span><i /> Live funnel</span><small>Last 30 days</small></div>
          <div className="funnel-body">
            {funnel.map(([value, label, width], index) => (
              <div className={`funnel-row ${index === funnel.length - 1 ? 'final' : ''}`} style={{ width }} key={label}>
                <span>{label}</span><strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className="funnel-footer"><TrendingUp /><div><strong>3.6× better sales focus</strong><span>Powered by LeadHive qualification</span></div></div>
        </Reveal>
      </div>
    </section>
  )
}
