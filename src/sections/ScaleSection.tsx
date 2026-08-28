import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { Flame } from 'lucide-react'

const EASE = [0.22, 1, 0.36, 1] as const

const STAGES = [
  {
    value: 10000,
    label: 'Incoming Inquiries',
    bar: 1,
    color: 'rgba(100, 116, 139, 0.25)',
    accent: '#94a3b8',
  },
  {
    value: 6850,
    label: 'Meaningful Conversations',
    bar: 0.685,
    color: 'rgba(100, 116, 139, 0.18)',
    accent: '#94a3b8',
  },
  {
    value: 1240,
    label: 'Potential Prospects',
    bar: 0.42,
    color: 'rgba(37, 99, 235, 0.14)',
    accent: '#2563eb',
  },
  {
    value: 420,
    label: 'Qualified Opportunities',
    bar: 0.26,
    color: 'rgba(6, 182, 212, 0.16)',
    accent: '#06b6d4',
  },
  {
    value: 150,
    label: 'Hot Opportunities',
    bar: 0.14,
    color: 'rgba(6, 182, 212, 0.22)',
    accent: '#06b6d4',
    isFinal: true,
  },
]

function CountUp({ to, trigger, duration = 1.4 }: { to: number; trigger: boolean; duration?: number }) {
  const [count, setCount] = useState(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!trigger) return
    if (reducedMotion) { setCount(to); return }
    let raf: number
    const start = performance.now()
    const ms = duration * 1000
    const tick = (now: number) => {
      const t = Math.min((now - start) / ms, 1)
      const ease = 1 - Math.pow(2, -10 * t)
      setCount(Math.round(to * ease))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, trigger, duration, reducedMotion])

  return <>{count.toLocaleString()}</>
}

export function ScaleSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' })
  const reducedMotion = useReducedMotion()

  return (
    <section className="scale-section" id="clarity" ref={ref}>
      <div className="container scale-inner">

        {/* LEFT: Copy */}
        <div className="scale-copy-col">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <p className="scale-eyebrow">Clarity at scale</p>
          </motion.div>

          <motion.h2
            className="scale-headline"
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            This is what sales intelligence looks like.
          </motion.h2>

          <motion.p
            className="scale-body"
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            Stop asking whether every message was answered. Start asking how quickly your team can close the opportunities that matter most.
          </motion.p>

          <motion.blockquote
            className="scale-quote"
            initial={reducedMotion ? false : { opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
          >
            "Your team starts the day with clarity, not backlog."
          </motion.blockquote>
        </div>

        {/* RIGHT: Intelligence Pipeline Card */}
        <motion.div
          className="scale-pipeline-card"
          initial={reducedMotion ? false : { opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
        >
          <div className="pipeline-card-header">
            <span className="pipeline-card-label">Example qualification scenario</span>
            <span className="pipeline-card-sublabel">Illustrative campaign</span>
          </div>

          <div className="pipeline-stages">
            {STAGES.map((stage, i) => (
              <motion.div
                key={stage.label}
                className={`pipeline-stage${stage.isFinal ? ' final' : ''}`}
                initial={reducedMotion ? false : { opacity: 0, x: 16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.12, ease: EASE }}
              >
                <div className="stage-meta">
                  <span className="stage-label">{stage.label}</span>
                  <strong className="stage-value">
                    <CountUp to={stage.value} trigger={inView} duration={1.2 + i * 0.15} />
                  </strong>
                </div>
                <div className="stage-bar-track">
                  <motion.div
                    className="stage-bar-fill"
                    style={{ '--stage-accent': stage.accent, '--stage-color': stage.color } as React.CSSProperties}
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: stage.bar } : {}}
                    transition={{ duration: 0.9, delay: 0.45 + i * 0.12, ease: 'easeOut' }}
                  />
                </div>
                {i < STAGES.length - 1 && (
                  <div className="stage-connector">
                    <motion.div
                      className="connector-line"
                      initial={{ scaleY: 0 }}
                      animate={inView ? { scaleY: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.7 + i * 0.12, ease: 'easeOut', transformOrigin: 'top' }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Final Hot Opportunities Focal Metric */}
          <motion.div
            className="pipeline-focal"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.05, ease: EASE }}
          >
            <motion.div
              className="focal-glow"
              animate={!reducedMotion && inView ? {
                boxShadow: [
                  '0 0 0 0 rgba(6, 182, 212, 0)',
                  '0 0 0 8px rgba(6, 182, 212, 0.12)',
                  '0 0 0 0 rgba(6, 182, 212, 0)',
                ]
              } : {}}
              transition={{ duration: 2, delay: 1.4, ease: 'easeInOut' }}
            >
              <Flame size={18} className="focal-icon" />
              <div className="focal-num">
                <CountUp to={150} trigger={inView} duration={1.6} />
              </div>
              <div className="focal-text">Hot Opportunities</div>
            </motion.div>
          </motion.div>

          <div className="pipeline-card-footer">
            <p className="pipeline-takeaway">From conversation volume to clear sales priority.</p>
            <small className="pipeline-disclaimer">Illustrative figures — not verified customer results.</small>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
