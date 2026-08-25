import { ArrowRight, Check } from 'lucide-react'
import { Reveal } from '../components/Reveal'

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
              <div><span className="avatar blue">HA</span><div><strong>Hassan Ali</strong><small>New enterprise inquiry</small></div></div>
              <span className="hot-label">Hot opportunity</span>
            </div>
            <p className="source-message">“Need 20 units for our Lahore branches next month.”</p>
            <div className="sheet-fields">
              <label><span>Purchase intent</span><strong><Check /> High</strong></label>
              <label><span>Quantity</span><strong>20 units</strong></label>
              <label><span>Location</span><strong>Lahore</strong></label>
              <label><span>Timeline</span><strong>Next month</strong></label>
              <label className="wide"><span>Recommended action</span><strong>Share business pricing and schedule sales call</strong></label>
            </div>
            <div className="sheet-action"><span>Qualified automatically in 38 seconds</span><button>Send to sales <ArrowRight /></button></div>
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
