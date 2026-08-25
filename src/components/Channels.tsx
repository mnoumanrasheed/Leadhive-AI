import { ArrowRight } from 'lucide-react'
import { Reveal } from './Reveal'

const channels = [
  ['f', 'Facebook', 'Messenger', 'Engage incoming inquiries and campaign responses automatically.'],
  ['◎', 'Instagram', 'Direct Messages', 'Turn high-intent DMs into structured lead intelligence.'],
  ['◔', 'WhatsApp', 'WhatsApp Business', 'Understand and qualify customer demand at scale.'],
  ['↗', 'Web', 'Your Website', 'Capture, engage, and qualify visitors before they disappear.'],
]

export function Channels() {
  return (
    <section className="channels-section section-pad" id="channels">
      <div className="container">
        <Reveal className="channels-heading">
          <div><p className="eyebrow">Unified channels</p><h2>Built for where your customers already talk to you.</h2></div>
          <p>Customers don’t always fill out forms. They send messages. LeadHive turns those conversations into structured opportunities.</p>
        </Reveal>
        <div className="channels-table">
          {channels.map(([symbol, label, name, copy], index) => (
            <Reveal className="channel-row" delay={index * 0.04} key={label}>
              <span className={`channel-symbol channel-${index}`}>{symbol}</span>
              <small>{label}</small>
              <h3>{name}</h3>
              <p>{copy}</p>
              <a href="#contact" aria-label={`Connect ${label}`}><ArrowRight /></a>
            </Reveal>
          ))}
        </div>
        <Reveal className="channel-outcome">
          <span className="mark">L</span>
          <div><small>One intelligent layer</small><strong>Engage · Understand · Qualify · Prioritize</strong></div>
          <span>LeadHive AI</span>
        </Reveal>
      </div>
    </section>
  )
}
