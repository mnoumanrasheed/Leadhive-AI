import { ArrowUpRight } from 'lucide-react'

export function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div className="footer-brand"><img src="/LeadHive%20AI%20Logo.png" alt="LeadHive AI" /><p>Turning every customer conversation into clear, qualified sales opportunity.</p></div>
        <div><h4>Platform</h4><a href="#product">Product</a><a href="#workflow">How it works</a><a href="#channels">Channels</a><a href="#mobile">Mobile app</a></div>
        <div><h4>Company</h4><a href="#why">Why LeadHive</a><a href="#contact">Contact</a><a href="#contact">Book a demo</a></div>
        <div className="footer-contact"><h4>Start a conversation</h4><a href="mailto:hello@m3hive.com">hello@m3hive.com <ArrowUpRight /></a><small>Built for ambitious sales teams.</small><a className="powered-by" href="https://m3hive.com" target="_blank" rel="noreferrer">Powered by <strong>m3hive</strong></a></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 LeadHive AI. All rights reserved.</span><div><a href="#">Privacy</a><a href="#">Terms</a></div></div>
    </footer>
  )
}
