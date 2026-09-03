import { ArrowUpRight } from 'lucide-react'
import { Reveal } from './Reveal'

export function Footer() {
  const homePath = window.location.pathname === '/'
  const sectionHref = (id: string) => `${homePath ? '' : '/'}#${id}`

  return (
    <footer>
      <Reveal className="container footer-grid">
        <div className="footer-brand">
          <a href="/" aria-label="LeadHive AI home">
            <img src="/LeadHive%20AI%20Logo.png" alt="LeadHive AI" />
          </a>
          <p>Turning digital conversations into clear, qualified sales opportunities.</p>
          <small><span className="footer-live-beacon" /> Built by <a className="footer-brand-link" href="https://m3hive.com/" target="_blank" rel="noreferrer">M3Hive</a> - Platform Active</small>
        </div>
        <div>
          <h3>Product</h3>
          <a href={sectionHref('product')}>Lead Intelligence</a>
          <a href={sectionHref('workflow')}>How It Works</a>
          <a href={sectionHref('channels')}>Channels</a>
          <a href={sectionHref('mobile')}>Mobile</a>
        </div>
        <div>
          <h3>Company</h3>
          <a href={sectionHref('why')}>Why LeadHive</a>
          <a href={sectionHref('contact')}>Book a Demo</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
        <div className="footer-contact">
          <h3>Contact</h3>
          <a href="mailto:support@leadhive-ai.com">support@leadhive-ai.com <ArrowUpRight /></a>
          <small>For product, partnership, and demo enquiries.</small>
          <a className="powered-by" href="https://m3hive.com/" target="_blank" rel="noreferrer">
            Built by M3Hive <ArrowUpRight />
          </a>
        </div>
      </Reveal>
      <div className="container footer-bottom">
        <span>&copy; 2026 LeadHive AI. All rights reserved.</span>
        <span>AI Engineering - Sales Automation - Enterprise Delivery</span>
      </div>
    </footer>
  )
}
