import { Reveal } from '../components/Reveal'

export function TrustSection() {
  return (
    <section className="trust-section" id="trust" aria-label="LeadHive credibility">
      <Reveal className="container trust-layout">
        <div><span>Built by</span><strong>M3Hive</strong></div>
        <p>AI Engineering <i /> Customer Experience <i /> Sales Automation <i /> Enterprise Delivery</p>
        <small>Built for sales teams managing high-volume digital conversations.</small>
      </Reveal>
    </section>
  )
}
