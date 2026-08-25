import { motion, useReducedMotion } from 'motion/react'
import { ArrowDownRight, ArrowRight } from 'lucide-react'
import { ProductDemo } from './ProductDemo'

export function Hero() {
  const reducedMotion = useReducedMotion()

  return (
    <section className="hero" id="home">
      <div className="hero-rule" />
      <div className="container hero-layout">
        <motion.div
          className="hero-copy"
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow light">Sales intelligence for modern conversations</p>
          <h1>Turn every conversation into a qualified opportunity.</h1>
          <p className="hero-lead">LeadHive AI engages every inquiry, understands buying intent, and surfaces the opportunities your sales team should act on first.</p>
          <div className="hero-actions">
            <a href="#contact" className="button">Book a demo <ArrowRight /></a>
            <a href="#workflow" className="text-link light">See how it works <ArrowDownRight /></a>
          </div>
          <div className="hero-metrics" aria-label="LeadHive performance example">
            <div><strong>10,000</strong><span>messages understood</span></div>
            <div><strong>150</strong><span>hot leads surfaced</span></div>
          </div>
        </motion.div>
        <motion.div
          className="hero-product"
          initial={reducedMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.78, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProductDemo />
        </motion.div>
      </div>
      <div className="container channel-line">
        <span>One intelligent frontline across</span>
        <div><i className="fb">f</i> Messenger</div>
        <div><i className="ig">◎</i> Instagram</div>
        <div><i className="wa">◔</i> WhatsApp</div>
        <div><i className="web">↗</i> Website</div>
      </div>
    </section>
  )
}
