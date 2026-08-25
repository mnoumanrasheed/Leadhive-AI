import { ArrowRight, Check } from 'lucide-react'
import { Reveal } from './Reveal'

export function CTA() {
  return (
    <section className="cta-section section-pad" id="contact">
      <div className="container">
        <Reveal className="cta-layout">
          <div>
            <p className="eyebrow light">Ready when you are</p>
            <h2>Your next best customer is already messaging you.</h2>
          </div>
          <div className="cta-copy">
            <p>The question is whether your team will find them in time. Let LeadHive engage every inquiry and surface the leads that deserve attention.</p>
            <div className="cta-actions">
              <a href="mailto:hello@m3hive.com?subject=Book%20a%20LeadHive%20Demo" className="button">Book a demo <ArrowRight /></a>
              <a href="mailto:hello@m3hive.com?subject=Get%20Started%20with%20LeadHive" className="text-link light">Get started <ArrowRight /></a>
            </div>
          </div>
        </Reveal>
        <div className="cta-proof">
          {['More conversations', 'Faster response', 'Better qualified leads', 'Same sales team'].map((item) => <span key={item}><Check /> {item}</span>)}
        </div>
      </div>
    </section>
  )
}
