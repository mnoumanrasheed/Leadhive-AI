import { ArrowRight, Bell, Check, MessageSquare, TrendingUp } from 'lucide-react'
import { Reveal } from './Reveal'

const features = [
  ['Hot lead alerts', 'Act the moment high-intent opportunities emerge.'],
  ['AI-generated summaries', 'Understand every conversation without reading every message.'],
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
            <div className="app-head"><div><small>Good morning,</small><strong>Sales overview</strong></div><span>AK</span></div>
            <div className="mobile-metric"><small>Hot leads today</small><div><strong>24</strong><span><TrendingUp /> 18%</span></div></div>
            <div className="mobile-subhead"><strong>Needs your attention</strong><span>View all</span></div>
            <div className="mobile-lead selected"><span className="avatar navy">HA</span><div><strong>Hassan Ali</strong><small>20 units · Lahore</small></div><em>HOT</em></div>
            <div className="mobile-lead"><span className="avatar amber">SM</span><div><strong>Sara Malik</strong><small>Demo requested · Instagram</small></div><em>92</em></div>
            <div className="mobile-summary"><span>LeadHive summary</span><p>High purchase intent. Budget confirmed. Wants to begin this month.</p><small><Check /> Ready for follow-up</small></div>
            <div className="app-tabs"><MessageSquare /><span><i /></span><Bell /></div>
          </div>
          <div className="phone-notification"><span><Bell /></span><div><small>New hot lead</small><strong>Action recommended now</strong></div><b>94</b></div>
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
