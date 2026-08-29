import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { HeroPipelineVisual } from './HeroPipelineVisual'

const EASE = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const inView = useInView(ref, { amount: 0.12, once: false })
  const animate = inView && !reducedMotion

  const copyReveal = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const visualReveal = {
    hidden: { opacity: 0, y: 28, scale: 0.985 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: EASE },
    },
  }

  return (
    <section className="hero" id="home" ref={ref}>
      <div className="hero-3d-backdrop" aria-hidden="true">
        <motion.div
          className="hero-ambient-glow hero-glow-headline"
          animate={
            animate
              ? { x: [0, 10, 0], y: [0, -6, 0], scale: [1, 1.03, 1] }
              : { x: 0, y: 0, scale: 1 }
          }
          transition={{ duration: 10, repeat: animate ? Infinity : 0, ease: 'easeInOut' }}
        />
        <motion.div
          className="hero-ambient-glow hero-glow-flow"
          animate={
            animate
              ? { x: [0, -8, 0], y: [0, 7, 0], scale: [1, 1.04, 1] }
              : { x: 0, y: 0, scale: 1 }
          }
          transition={{ duration: 8, repeat: animate ? Infinity : 0, ease: 'easeInOut' }}
        />
        <motion.div
          className="hero-subtle-grid-plane"
          animate={
            animate
              ? { x: [0, 6, 0], y: [0, 5, 0], opacity: [0.55, 0.72, 0.55] }
              : { x: 0, y: 0, opacity: 0.6 }
          }
          transition={{ duration: 12, repeat: animate ? Infinity : 0, ease: 'linear' }}
        />
      </div>

      <div className="hero-vignette" aria-hidden="true" />

      <div className="container hero-layout">
        <motion.div
          className="hero-copy"
          initial={reducedMotion ? false : 'hidden'}
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: reducedMotion ? 0 : 0.09 },
            },
          }}
        >
          <motion.div
            className="hero-eyebrow-pill"
            variants={copyReveal}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <motion.span
              className="eyebrow-status-dot"
              animate={animate ? { scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] } : { scale: 1, opacity: 1 }}
              transition={{ duration: 2.2, repeat: animate ? Infinity : 0, ease: 'easeInOut' }}
            />
            <span className="eyebrow-text">Autonomous Sales Intelligence</span>
          </motion.div>

          <motion.h1
            className="hero-headline"
            variants={copyReveal}
            transition={{ duration: 0.68, ease: EASE }}
          >
            Turn every conversation into <span className="gradient-text">a qualified opportunity.</span>
          </motion.h1>

          <motion.p
            className="hero-lead"
            variants={copyReveal}
            transition={{ duration: 0.58, ease: EASE }}
          >
            LeadHive AI understands, qualifies, and prioritizes inbound conversations across every channel—so your team acts on the opportunities that matter.
          </motion.p>

          <motion.div
            className="hero-actions"
            variants={copyReveal}
            transition={{ duration: 0.58, ease: EASE }}
          >
            <motion.a
              href="#contact"
              className="hero-primary-cta"
              whileHover={reducedMotion ? undefined : { y: -2 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <span>Book a live demo</span>
              <motion.span
                animate={animate ? { x: [0, 3, 0] } : { x: 0 }}
                transition={{ duration: 1.8, repeat: animate ? Infinity : 0, ease: 'easeInOut' }}
              >
                <ArrowRight size={16} className="cta-icon" />
              </motion.span>
            </motion.a>

            <motion.a
              href="#workflow"
              className="hero-secondary-cta"
              whileHover={reducedMotion ? undefined : { y: -2 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <span>See how it works</span>
              <motion.span
                animate={animate ? { x: [0, 3, 0] } : { x: 0 }}
                transition={{ duration: 2, repeat: animate ? Infinity : 0, ease: 'easeInOut', delay: 0.2 }}
              >
                <ChevronRight size={15} className="secondary-icon" />
              </motion.span>
            </motion.a>
          </motion.div>

          <motion.div
            className="hero-metric-line"
            variants={copyReveal}
            transition={{ duration: 0.62, ease: EASE }}
          >
            <motion.span
              className="metric-item"
              animate={animate ? { y: [0, -2, 0] } : { y: 0 }}
              transition={{ duration: 4.6, repeat: animate ? Infinity : 0, ease: 'easeInOut' }}
            >
              <strong>10,000</strong> conversations
            </motion.span>

            <motion.span
              className="metric-arrow"
              aria-hidden="true"
              animate={animate ? { x: [0, 4, 0], opacity: [0.45, 1, 0.45] } : { x: 0, opacity: 1 }}
              transition={{ duration: 2.4, repeat: animate ? Infinity : 0, ease: 'easeInOut' }}
            >
              →
            </motion.span>

            <motion.span
              className="metric-item metric-hot"
              animate={
                animate
                  ? {
                      y: [0, -2, 0],
                      boxShadow: [
                        '0 0 0 rgba(0,0,0,0)',
                        '0 0 24px rgba(57, 208, 255, 0.18)',
                        '0 0 0 rgba(0,0,0,0)',
                      ],
                    }
                  : { y: 0, boxShadow: '0 0 0 rgba(0,0,0,0)' }
              }
              transition={{ duration: 3.2, repeat: animate ? Infinity : 0, ease: 'easeInOut', delay: 0.35 }}
            >
              <strong>150</strong> sales-ready leads
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual-column"
          initial={reducedMotion ? false : 'hidden'}
          animate="visible"
          variants={visualReveal}
        >
          <motion.div
            className="hero-flow-frame"
            animate={
              animate
                ? {
                    y: [0, -4, 0],
                    rotateX: [0, 0.4, 0],
                    rotateY: [0, -0.4, 0],
                  }
                : { y: 0, rotateX: 0, rotateY: 0 }
            }
            transition={{
              duration: 7.5,
              repeat: animate ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            <HeroPipelineVisual />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}