import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowRight, Check, Inbox, Sparkles } from 'lucide-react'
import { additionalLeads, primaryLead } from '../data/demoData'

const messages = [
  { name: additionalLeads[0].name, initials: additionalLeads[0].initials, message: 'Can you share the price?', source: 'WhatsApp · Vertex Commercial', status: 'Warm', tone: 'warm', time: '2m', selected: false },
  { name: primaryLead.name, initials: primaryLead.initials, message: 'Need this for 12 branches ASAP', source: 'Website · Northstar Retail', status: 'High intent', tone: 'high', time: '4m', selected: true },
  { name: 'Website visitor', initials: 'WV', message: 'Hello???', source: 'Website · Unidentified', status: 'Unqualified', tone: 'quiet', time: '6m', selected: false },
  { name: additionalLeads[1].name, initials: additionalLeads[1].initials, message: 'Do you deliver across the UK?', source: 'Instagram · Meridian Group', status: 'Warm', tone: 'warm', time: '8m', selected: false },
  { name: 'Recruitment enquiry', initials: 'RE', message: 'Looking for a job', source: 'Messenger · General', status: 'Not a lead', tone: 'quiet', time: '12m', selected: false },
] as const

const ease = [0.22, 1, 0.36, 1] as const

export function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.18 })
  const reducedMotion = useReducedMotion()
  const active = Boolean(reducedMotion) || inView

  const reveal = (delay: number, distance = 14) => ({
    initial: reducedMotion ? false : { opacity: 0, y: distance },
    animate: active ? { opacity: 1, y: 0 } : { opacity: 0, y: distance },
    transition: { duration: 0.52, delay: reducedMotion ? 0 : delay, ease },
  })

  return (
    <section className="problem-section section-pad" id="problem" ref={sectionRef}>
      <div className="container problem-layout">
        <div className="problem-copy">
          <motion.p className="eyebrow" {...reveal(0)}>The problem</motion.p>
          <motion.h2 {...reveal(0.07, 18)}>
            <span>10,000 conversations.</span>
            <span>Your sales team</span>
            <span>shouldn’t read</span>
            <span>all of them.</span>
          </motion.h2>
          <motion.div className="problem-support" {...reveal(0.18)}>
            <p>More attention creates more messages—but not every conversation represents real buying intent. Your team shouldn’t have to read them all to find out.</p>
            <small className="example-note"><i /> Illustrative campaign example</small>
          </motion.div>
          <motion.aside className="editorial-note" {...reveal(0.28)}>
            <span className="insight-icon"><Sparkles /></span>
            <div>
              <span>The real challenge</span>
              <strong>The problem is not getting more leads. The problem is knowing which ones actually matter.</strong>
            </div>
          </motion.aside>
        </div>

        <motion.div className="inbox-stage" {...reveal(0.15, 20)}>
          <div className="inbox-visual" aria-label="LeadHive conversation intelligence preview">
          <div className="inbox-head">
            <div className="inbox-brand"><span className="inbox-product-mark">L</span><span><strong>LeadHive</strong><small>Conversation Intelligence</small></span></div>
            <div className="inbox-live"><i /> Live inbox</div>
            <span className="inbox-count"><strong>1,284</strong> unread</span>
          </div>
          <div className="inbox-toolbar"><span><Inbox /> All conversations</span><span>Priority first <Check /></span></div>
          <div className="inbox-rows">
            {messages.map((item, index) => (
              <motion.div
                className={`inbox-row ${item.selected ? 'selected' : ''}`}
                key={item.message}
                initial={reducedMotion ? false : { opacity: 0, y: 10, backgroundColor: 'rgba(255,255,255,0)', borderLeftColor: 'rgba(30,169,194,0)' }}
                animate={active ? { opacity: 1, y: 0, backgroundColor: item.selected ? 'rgba(232,247,247,1)' : 'rgba(255,255,255,0)', borderLeftColor: item.selected ? 'rgba(30,169,194,1)' : 'rgba(30,169,194,0)' } : undefined}
                transition={{ duration: 0.4, delay: reducedMotion ? 0 : 0.38 + index * 0.075, ease }}
              >
                <span className={`problem-avatar tone-${index}`}>{item.initials}</span>
                <div className="inbox-message"><span><strong>{item.name}</strong><small>{item.source}</small></span><b>{item.message}</b></div>
                <span className={`row-status ${item.tone}`}>{item.status}</span>
                <time>{item.time}</time>
                {item.selected && <motion.span className="detected-signal" {...reveal(0.86, 4)}><Sparkles /> Purchase signal detected</motion.span>}
              </motion.div>
            ))}
          </div>
          <motion.div className="signal-strip" {...reveal(0.98, 10)}>
            <span className="signal-icon"><Sparkles /></span>
            <div><span>High-intent signal detected</span><strong>Commercial opportunity surfaced</strong><small>12-branch requirement · Immediate timeline</small></div>
            <span className="signal-action">Open Lead Intelligence <ArrowRight /></span>
          </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
