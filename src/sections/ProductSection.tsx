import { ArrowRight, Check } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { primaryLead, qualificationSignals } from '../data/demoData'

const capabilities = [
  ['Respond in seconds', 'Keep intent high with fast, always-on responses across every connected channel.'],
  ['Understand real intent', 'Interpret customer needs, urgency, context, requirements, and buying signals.'],
  ['Qualify intelligently', 'Ask business-specific questions that separate curiosity from commercial potential.'],
  ['Prioritize automatically', 'Score every conversation as Hot, Warm, Cold, or No Lead for effortless focus.'],
  ['Act at the right moment', 'Send rich alerts and conversation summaries when high-value opportunities emerge.'],
]

export function ProductSection() {
  return (
    <section className="product-section section-pad" id="product">
      <div className="container">
        <Reveal className="product-intro">
          <p className="eyebrow">The product</p>
          <div>
            <h2>Most inboxes show messages.<br />LeadHive shows opportunities.</h2>
            <p>It does more than send automated replies. LeadHive listens, understands, engages, qualifies, scores, and prioritizes—around the clock.</p>
          </div>
        </Reveal>

        <div className="capability-composition">
          <Reveal className="qualification-sheet">
            <div className="sheet-head">
              <div><span className="avatar blue">{primaryLead.initials}</span><div><strong>{primaryLead.name}</strong><small>{primaryLead.role} · {primaryLead.company}</small></div></div>
              <span className="hot-label">Hot Opportunity</span>
            </div>
            <p className="source-message">“{primaryLead.message}”</p>
            <div className="sheet-fields">
              {qualificationSignals.map(([label, value], index) => <label key={label}><span>{label}</span><strong>{index === 0 && <Check />}{value}</strong></label>)}
              <label className="wide"><span>Business Need</span><strong>Enterprise rollout across 20 retail locations</strong></label>
              <label className="wide"><span>Recommended Action</span><strong>Share enterprise pricing and schedule a discovery call</strong></label>
            </div>
            <div className="sheet-action"><span>Opportunity Score <strong>{primaryLead.score}/100</strong></span><button>Start Sales Handover <ArrowRight /></button></div>
          </Reveal>

          <div className="capability-list">
            {capabilities.map(([title, text], index) => (
              <Reveal className="capability-row" delay={index * 0.04} key={title}>
                <span>0{index + 1}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal className="product-result">
          <span>Your sales team gets</span><strong>opportunities, not inbox chaos.</strong><a href="#contact">See LeadHive in action <ArrowRight /></a>
        </Reveal>
      </div>
    </section>
  )
}
