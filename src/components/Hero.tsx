import { motion, useReducedMotion } from 'motion/react'
import { ArrowDownRight, ArrowRight } from 'lucide-react'
import { ProductDemo } from './ProductDemo'

export function Hero() {
  const reducedMotion = useReducedMotion()
  const copyReveal = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="hero" id="home">
      <div className="hero-rule" aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />
      <div className="container hero-layout">
        <motion.div
          className="hero-copy"
          initial={reducedMotion ? false : 'hidden'}
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.09 } },
          }}
        >
          <motion.p className="eyebrow light hero-eyebrow" variants={copyReveal} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>Sales intelligence for modern conversations</motion.p>
          <motion.h1 variants={copyReveal} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
            <span className="hero-title-line">Turn every</span>
            <span className="hero-title-line">conversation into</span>
            <span className="hero-title-line">a qualified opportunity.</span>
          </motion.h1>
          <motion.p className="hero-lead" variants={copyReveal} transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}>LeadHive AI engages every inquiry, understands buying intent, and surfaces the opportunities your sales team should act on first.</motion.p>
          <motion.div className="hero-actions" variants={copyReveal} transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}>
            <a href="#contact" className="button hero-primary-cta">Book a demo <ArrowRight /></a>
            <a href="#workflow" className="text-link light hero-secondary-cta">See how it works <ArrowDownRight /></a>
          </motion.div>
          <motion.div className="hero-proof" aria-label="LeadHive product capabilities" variants={copyReveal} transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}>
            <span>Built for high-volume digital conversations</span>
            <span>Human-ready Sales Handover</span>
          </motion.div>
        </motion.div>
        <motion.div
          className="hero-product"
          initial={reducedMotion ? false : { opacity: 0, y: 22, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.78, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-product-stage">
            <ProductDemo />
          </div>
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
