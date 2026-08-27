import { ArrowRight, Bell, Check, MessageSquare } from 'lucide-react'
import { Reveal } from './Reveal'
import { additionalLeads, primaryLead, salesRepresentative } from '../data/demoData'

const features = [
  ['Hot Opportunity alerts', 'Act the moment high-intent opportunities emerge.'],
  ['Lead Intelligence summaries', 'Understand every conversation without reading every message.'],
  ['Channel performance', 'See demand, engagement, and quality across touchpoints.'],
  ['Live team visibility', 'Keep sales aligned with what needs action.'],
]

export function MobileExperience() {
  return (
    <section className="mobile-section section-pad" id="mobile">
      <div className="container mobile-layout">
        <Reveal className="phone-stage">
          <div className="phone">
            <div className="phone-top"><span>9:41</span><i /></div>
            <div className="app-head"><div><small>Good morning, {salesRepresentative.name.split(' ')[0]}</small><strong>Lead Intelligence</strong></div><span>{salesRepresentative.initials}</span></div>
            <div className="mobile-metric"><small>Opportunity Score</small><div><strong>{primaryLead.score}</strong><span>Hot Opportunity</span></div></div>
            <div className="mobile-subhead"><strong>Needs your attention</strong><span>Conversations</span></div>
            <div className="mobile-lead selected"><span className="avatar navy">{primaryLead.initials}</span><div><strong>{primaryLead.name}</strong><small>{primaryLead.deployment} · {primaryLead.region}</small></div><em>HOT</em></div>
            <div className="mobile-lead"><span className="avatar amber">{additionalLeads[0].initials}</span><div><strong>{additionalLeads[0].name}</strong><small>{additionalLeads[0].note}</small></div><em>{additionalLeads[0].score}</em></div>
            <div className="mobile-summary"><span>Recommended Action</span><p>Share enterprise pricing and schedule a discovery call for the 20-site rollout.</p><small><Check /> Ready for Sales Handover</small></div>
            <div className="app-tabs"><MessageSquare /><span><i /></span><Bell /></div>
          </div>
          <div className="phone-notification"><span><Bell /></span><div><small>Hot Opportunity</small><strong>{primaryLead.name}</strong></div><b>{primaryLead.score}</b></div>
        </Reveal>

        <div className="mobile-copy">
          <Reveal>
            <p className="eyebrow light">LeadHive mobile</p>
            <h2>Your sales intelligence. In your pocket.</h2>
            <p>Give your team immediate visibility into the opportunities that matter most—wherever the day takes them.</p>
          </Reveal>
          <div className="mobile-feature-list">
            {features.map(([title, copy], index) => (
              <Reveal className="mobile-feature-row" delay={index * 0.04} key={title}>
                <span>0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div>
              </Reveal>
            ))}
          </div>
          <Reveal><a className="text-link light" href="#contact">Explore the mobile experience <ArrowRight /></a></Reveal>
        </div>
      </div>
    </section>
  )
}
